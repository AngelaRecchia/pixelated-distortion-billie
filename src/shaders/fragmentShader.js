const fragmentShader = /*glsl*/ `
  varying vec2 vUv;
  uniform sampler2D t;
  uniform sampler2D dataTexture;
  uniform vec4 resolution;
  uniform vec2 mouse;

  void main(){
    vec2 newUv = (vUv - vec2(.5)) * resolution.zw + vec2(.5) ;

    vec2 pos = gl_FragCoord.xy / resolution.xy;

    float circle = smoothstep(.6, 1., 1. - distance(mouse, newUv));
    vec4 offset = texture2D(dataTexture, newUv);

    vec4 color = texture2D(t, newUv - .5*vec2(offset.rg));

    gl_FragColor = color;
    // gl_FragColor = vec4(vec3(circle), 1.);
  }
`;

export default fragmentShader;
