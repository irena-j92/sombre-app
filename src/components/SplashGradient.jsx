import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

const vertexSource = `
  attribute vec2 position;
  varying vec2 uv;
  void main() {
    uv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision mediump float;
  varying vec2 uv;
  uniform float time;
  void main() {
    vec2 p = vec2(uv.x, 1.0 - uv.y);
    // Low, broad waves move across the full field, including its upper/lower bands.
    float wave = 0.032 * sin(p.x * 3.8 + p.y * 6.0 - time * 1.2);
    wave += 0.018 * sin(p.x * 2.4 - p.y * 4.8 + time * 0.9);
    wave += 0.008 * sin(p.x * 5.8 + p.y * 3.4 - time * 0.65);
    float y = clamp(p.y + wave, 0.0, 1.0);
    vec3 olive = vec3(0.302, 0.298, 0.0);
    vec3 green = vec3(0.357, 0.659, 0.443);
    vec3 lilac = vec3(0.992, 0.753, 0.973);
    vec3 peach = vec3(1.0, 0.678, 0.455);
    vec3 orange = vec3(1.0, 0.424, 0.173);
    vec3 color = mix(olive, green, smoothstep(0.0, 0.34, y));
    color = mix(color, lilac, smoothstep(0.29, 0.49, y));
    color = mix(color, peach, smoothstep(0.47, 0.66, y));
    color = mix(color, orange, smoothstep(0.64, 1.0, y));
    gl_FragColor = vec4(color, 1.0);
  }
`;

/** A single GPU quad warps the original splash palette; the wordmark stays crisp. */
export default function SplashGradient() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!window.WebGLRenderingContext) return;
    let gl;
    try {
      gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
    } catch {
      return;
    }
    if (!gl) return;
    let frame = 0;
    let stopped = false;
    const shaders = [];
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const cleanup = () => {
      stopped = true;
      cancelAnimationFrame(frame);
      canvas.style.opacity = '0';
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
    };
    const contextLost = (event) => { event.preventDefault(); cleanup(); };
    canvas.addEventListener('webglcontextlost', contextLost);
    try {
      for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
        const shader = gl.createShader(type);
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Splash shader unavailable');
        gl.attachShader(program, shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Splash renderer unavailable');
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(393 * ratio);
      canvas.height = Math.round(852 * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const time = gl.getUniformLocation(program, 'time');
      const start = performance.now();
      const draw = (now) => {
        if (stopped) return;
        gl.uniform1f(time, reducedMotion ? 0 : (now - start) / 1000);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        canvas.style.opacity = '1';
        if (!reducedMotion) frame = requestAnimationFrame(draw);
      };
      draw(start);
    } catch {
      cleanup(); // The CSS gradient beneath the canvas remains visible.
    }
    return () => {
      canvas.removeEventListener('webglcontextlost', contextLost);
      cleanup();
    };
  }, [reducedMotion]);

  return <div className="splash-gradient" aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
