import {
  CanvasTexture, DoubleSide, LinearFilter, Mesh, NoToneMapping,
  OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial,
  SRGBColorSpace, WebGLRenderer,
} from 'three';
import { gsap } from 'gsap';
import { CURL_RADIUS } from './geometry.js';
import { pageVertex, pageFragment, underVertex, underFragment } from './shaders.js';

const HEIGHT = 852 / 393;

/** Lazy, on-demand renderer. No RAF loop or GPU work while an entry is at rest. */
export function createPageTurnEngine(canvas, onContextLost) {
  const renderer = new WebGLRenderer({ canvas, alpha: false, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(393, 852, false);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping;
  renderer.debug.onShaderError = () => { throw new Error('Page shader could not compile'); };
  const camera = new OrthographicCamera(-0.5, 0.5, HEIGHT / 2, -HEIGHT / 2, 0.1, 10);
  camera.position.z = 3;
  const scene = new Scene();
  const progress = { value: 0 };
  const shared = {
    uProgress: { value: 0 }, uDirection: { value: 1 },
    uRadius: { value: CURL_RADIUS }, uGrabY: { value: 0.25 },
  };
  const pageMaterial = new ShaderMaterial({
    uniforms: { ...shared, uPage: { value: null } },
    vertexShader: pageVertex, fragmentShader: pageFragment,
    side: DoubleSide, toneMapped: false,
  });
  const underMaterial = new ShaderMaterial({
    uniforms: { ...shared, uPage: { value: null } },
    vertexShader: underVertex, fragmentShader: underFragment, toneMapped: false,
  });
  const geometry = new PlaneGeometry(1, HEIGHT, 128, 160);
  const underGeometry = new PlaneGeometry(1, HEIGHT);
  const sheet = new Mesh(geometry, pageMaterial);
  // Vertices move in the shader, so the original geometry bounds cannot cull it.
  sheet.frustumCulled = false;
  const under = new Mesh(underGeometry, underMaterial);
  under.position.z = -0.01;
  scene.add(under, sheet);
  let textures = [];
  let tween = null;
  let disposed = false;

  function render(value = progress.value) {
    if (disposed || renderer.getContext().isContextLost()) return;
    progress.value = Math.min(1, Math.max(0, value));
    shared.uProgress.value = progress.value;
    renderer.render(scene, camera);
  }
  const contextLost = (event) => { event.preventDefault(); tween?.kill(); onContextLost?.(); };
  canvas.addEventListener('webglcontextlost', contextLost);

  return {
    type: 'webgl',
    setPages(front, next, direction, grabY = 0.25) {
      tween?.kill();
      const old = textures;
      textures = [front, next].map((image) => {
        const texture = new CanvasTexture(image);
        texture.colorSpace = SRGBColorSpace;
        texture.minFilter = LinearFilter;
        texture.magFilter = LinearFilter;
        texture.generateMipmaps = false;
        return texture;
      });
      pageMaterial.uniforms.uPage.value = textures[0];
      underMaterial.uniforms.uPage.value = textures[1];
      shared.uDirection.value = direction;
      shared.uGrabY.value = Math.min(1, Math.max(0, grabY));
      old.forEach((texture) => texture.dispose());
      render(0);
    },
    render,
    settle(target, { duration = 0.72, onComplete, direct = false } = {}) {
      tween?.kill();
      tween = gsap.to(progress, {
        value: target, duration, ease: direct ? 'power2.inOut' : 'power2.out',
        onUpdate: () => render(), onComplete,
      });
    },
    cancel() { tween?.kill(); },
    dispose() {
      disposed = true;
      tween?.kill();
      canvas.removeEventListener('webglcontextlost', contextLost);
      textures.forEach((texture) => texture.dispose());
      geometry.dispose(); underGeometry.dispose();
      pageMaterial.dispose(); underMaterial.dispose();
      scene.clear(); renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
