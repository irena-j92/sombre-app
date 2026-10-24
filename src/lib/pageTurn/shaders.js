// A diagonal, tapered cylinder peels the bottom corner upward like a thin leaf.
export const pageVertex = /* glsl */ `
  uniform float uProgress;
  uniform float uDirection;
  uniform float uRadius;
  uniform float uGrabY;
  varying vec2 vUv;
  varying float vAngle;
  varying vec3 vSheetNormal;
  const float ASPECT = 2.1679389313;
  const float PI = 3.14159265;

  void main() {
    vUv = uv;
    float tilt = 0.36 + (0.5 - uGrabY) * 0.16;
    vec2 n = vec2(cos(tilt), -sin(tilt));
    vec2 point = vec2(uDirection > 0.0 ? uv.x : 1.0 - uv.x, uv.y * ASPECT);
    float q = dot(point, n);
    float fold = mix(n.x + 0.016, n.y * ASPECT - PI * uRadius - 0.08, uProgress);
    // A smaller radius toward the top gives the curl its tapered, pointed tip.
    float radius = uRadius * mix(1.18, 0.42, uv.y);
    float distanceFromFold = max(0.0, q - fold);
    float angle = min(distanceFromFold / radius, PI);
    float rolled = q;
    if (q > fold) {
      rolled = distanceFromFold > PI * radius
        ? fold - (distanceFromFold - PI * radius)
        : fold + radius * sin(angle);
    }
    vec2 curled = point + n * (rolled - q);
    float z = radius * (1.0 - cos(angle));
    if (uDirection < 0.0) curled.x = 1.0 - curled.x;
    vAngle = angle;
    vSheetNormal = normalize(vec3(-n.x * sin(angle) * uDirection, -n.y * sin(angle), cos(angle)));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(curled.x - 0.5, curled.y - ASPECT * 0.5, z, 1.0);
  }
`;

export const pageFragment = /* glsl */ `
  uniform sampler2D uPage;
  varying vec2 vUv;
  varying float vAngle;
  varying vec3 vSheetNormal;
  float grain(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
  }
  void main() {
    vec3 printColor = texture2D(uPage, vUv).rgb;
    vec3 normal = normalize(vSheetNormal);
    vec3 light = normalize(vec3(-0.30, 0.42, 1.0));
    float bend = max(sin(vAngle), 0.0);
    vec3 color;
    if (gl_FrontFacing) {
      float diffuse = max(dot(normal, light), 0.0);
      float shade = mix(1.0, 0.78 + 0.22 * diffuse, smoothstep(0.0, 0.22, vAngle));
      color = printColor * shade + vec3(0.035) * pow(bend, 12.0);
    } else {
      // Near-white paper, a soft gray crease, and a clean unprinted underside.
      vec3 transmittedMood = texture2D(uPage, vec2(0.99, vUv.y)).rgb;
      vec3 paper = mix(vec3(0.97, 0.965, 0.95), transmittedMood, 0.022);
      float backLight = max(dot(-normal, light), 0.0);
      color = paper * (0.83 + 0.17 * backLight);
      color += vec3(0.055) * pow(bend, 10.0);
    }
    color += (grain(gl_FragCoord.xy) - 0.5) * 0.0025;
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

export const underVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const underFragment = /* glsl */ `
  uniform sampler2D uPage;
  uniform float uProgress;
  uniform float uDirection;
  uniform float uRadius;
  uniform float uGrabY;
  varying vec2 vUv;
  const float ASPECT = 2.1679389313;
  void main() {
    float tilt = 0.36 + (0.5 - uGrabY) * 0.16;
    vec2 n = vec2(cos(tilt), -sin(tilt));
    vec2 point = vec2(uDirection > 0.0 ? vUv.x : 1.0 - vUv.x, vUv.y * ASPECT);
    float q = dot(point, n);
    float fold = mix(n.x + 0.016, n.y * ASPECT - 3.14159265 * uRadius - 0.08, uProgress);
    float radius = uRadius * mix(1.18, 0.42, vUv.y);
    float shadow = exp(-abs(q - fold - radius * 0.65) * 29.0);
    shadow *= 0.29 * sin(uProgress * 3.14159265);
    vec3 color = texture2D(uPage, vUv).rgb * (1.0 - shadow);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;
