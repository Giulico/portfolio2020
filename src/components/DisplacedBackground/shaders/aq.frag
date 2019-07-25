precision mediump float;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
uniform vec2 iResolution;
uniform sampler2D uSampler;
uniform float iTime;
uniform float saturation;
uniform float displace;
uniform float amount;
uniform vec2 u_mouse;
uniform float u_mouse_vel;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float hash(vec2 p) {
  float h = dot(p,vec2(127.1,311.7));
  return -1.0 + 2.0*fract(sin(h)*43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash( i + vec2(0.0,0.0) ),
    hash( i + vec2(1.0,0.0) ), u.x),
  mix( hash( i + vec2(0.0,1.0) ),
    hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

float noise(vec2 p, int oct) {
  mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
  float f  = 0.0;
  for(int i = 1; i < 3; i++){
    float mul = 1.0/pow(2.0, float(i));
    f += mul*noise(p);
    p = m*p;
  }
  return f;
}

float random (vec2 st) {
  return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))*
      43758.5453123);
}

float srandom (in float st) {
  return fract(sin(st)*43758.5453123);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec2 computeUV( vec2 uv, float k, float kcube ){
  vec2 t = uv - .5;
  float r2 = t.x * t.x + t.y * t.y;
  float f = 0.;
  if( kcube == 0.0){
      f = 1. + r2 * k;
  }else{
      f = 1. + r2 * ( k + kcube * sqrt( r2 ) );
  }
  vec2 nUv = f * t + .5;
  nUv.y = nUv.y;
  return nUv;
}

vec3 sat(vec3 rgb, float adjustment) {
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}

float h00(float x) { return 2.*x*x*x - 3.*x*x + 1.; }
float h10(float x) { return x*x*x - 2.*x*x + x; }
float h01(float x) { return 3.*x*x - 2.*x*x*x; }
float h11(float x) { return x*x*x - x*x; }

float Hermite(float p0, float p1, float m0, float m1, float x) {
  return p0*h00(x) + m0*h10(x) + p1*h01(x) + m1*h11(x);
}

void main(void) {

  // vec2 vUv = vFilterCoord.xy / iResolution.xy;
  vec2 vUv = vTextureCoord;

  float glitch = pow(cos(iTime*0.5)*1.2+1.0, 1.2);
  if(noise(iTime+vec2(0, 0))*glitch > 0.92){
    // vUv.y = mod(vUv.y+noise(vec2(iTime*4.0, 0)) * amount, 1.0);
  }

  // GLITCH VERICALE -> nh
  // -------------------------------------------------------------------------
  vec2 hp = vec2(0.0, vUv.y);
  float nh = noise(hp*7.0+iTime*10.0, 3) * (noise(hp+iTime*0.3)*0.8);
  nh += noise(hp*100.0+iTime*10.0, 3)*0.00002;
  float rnd = 0.0;
  if(glitch > 0.0){
    rnd = hash(vUv);
    if(glitch < 1.0){
      rnd *= glitch;
    }
  }
  nh *= (glitch + rnd) * amount;
  nh = 0.; // DEACTIVATE EFFECT FOR TESTING PURPOSE
  // -------------------------------------------------------------------------

  // NOISE ORIZZONTALE -> xpos
  // -------------------------------------------------------------------------
  vec2 uv = vTextureCoord;
  float noise = max(0.0, snoise(vec2(iTime, uv.y * 0.3)) - 0.3) * (.001 / 0.7);
  noise = noise + (snoise(vec2(iTime*100.0, uv.y * 2.4)) - 0.5) * 0.15;
  float xpos = uv.x - (noise * noise * 0.05) * amount;
  if (srandom(iTime) > 0.5) {
    xpos += (srandom(iTime) / 10.) * amount;
  }
  // xpos = 0.; // DEACTIVATE EFFECT FOR TESTING PURPOSE
  // -------------------------------------------------------------------------

  // SPHERIFY
  // -------------------------------------------------------------------------
  float k = (-1.0 * (u_mouse_vel/18.) - 0.5) * amount * 0.5;
  float kcube = (.5 * (u_mouse_vel/18.) + 0.5) * amount * 0.5;
  float koffset = (0.2 * (u_mouse_vel/12.)) * amount * 0.5;
  k = 0.0;
  kcube = 0.0;
  koffset = 0.0;
  // -------------------------------------------------------------------------

  // DEFORMER
  // -------------------------------------------------------------------------
  // float da = (sin(iTime * 1.0)*0.5 + 0.5) * (u_mouse_vel / 200. + 0.05) + 0.6;
  // float db = (sin(iTime * 1.5)*0.5 + 0.5) * (u_mouse_vel / 200. + 0.05) + 0.6;
  // float dc = (sin(iTime * 2.0)*0.5 + 0.5) * (u_mouse_vel / 200. + 0.05) + 0.6;
  // float dd = (sin(iTime * 2.5)*0.5 + 0.5) * (u_mouse_vel / 200. + 0.05) + 0.6;
  // float y0 = mix(da, db, uv.x);
  // float y1 = mix(dc, dd, uv.x);
  // float x0 = mix(da, dc, uv.y);
  // float x1 = mix(db, dd, uv.y);
  // uv.x = Hermite(0., 1., 2.*x0, 2.*x1, uv.x);
  // uv.y = Hermite(0., 1., 2.*y0, 2.*y1, uv.y);
  // -------------------------------------------------------------------------

  // CROSS FADE
  // -------------------------------------------------------------------------
  uv.y += ((random(vec2(uv.x)) * 5. - 2.5) * displace) / 10. + ((sin((uv.x + iTime/4.5)*7.) * 0.25) * displace);
  vUv.y += ((random(vec2(vUv.x)) * 5. - 2.5) * displace) / 10. + ((sin((vUv.x + iTime/4.5)*7.) * 0.25) * displace);
  // -------------------------------------------------------------------------

  // NEW NOISE
  // -------------------------------------------------------------------------
  float stongth = sin(iTime/2.) * 0.5 + 0.7;
  float waveu = sin((uv.y + iTime / 30.0) * 20.0) * 0.0005 * stongth * hash(vUv) * u_mouse_vel;
  uv = uv + vec2(waveu, 0);
  // -------------------------------------------------------------------------

  // COMPOSER
  // -------------------------------------------------------------------------
  vec2 RUV = (vUv * (1. - amount) + uv * amount) + vec2(0.0 + xpos, nh)*nh;
  vec2 GUV = (vUv * (1. - amount) + uv * amount) + vec2(0.0 + xpos, nh-0.07)*nh;
  vec2 BUV = (vUv * (1. - amount) + uv * amount) + vec2(0.0 + xpos, nh)*nh;
  // vec2 RUV = vUv + vec2(0.0 + xpos, nh)*nh;
  // vec2 GUV = vUv + vec2(0.0 + xpos, nh-0.07)*nh;
  // vec2 BUV = vUv + vec2(0.0 + xpos, nh)*nh;

  vec2 computeRed = computeUV( RUV, k + koffset, kcube );
  vec2 computeGreen = computeUV( GUV, k, kcube );
  vec2 computeBlue = computeUV( BUV, k - koffset, kcube );

  float r = texture2D(uSampler, computeRed).r;
  float g = texture2D(uSampler, computeGreen).g;
  float b = texture2D(uSampler, computeBlue).b;
  float ar = texture2D(uSampler, computeRed).a;
  float ag = texture2D(uSampler, computeGreen).a;
  float ab = texture2D(uSampler, computeBlue).a;
  float alpha = mix(mix(ar, ag, 0.9), ab, 0.5);
  vec3 color = vec3(r, g, b);
  // -------------------------------------------------------------------------

  // DESATURATION
  // -------------------------------------------------------------------------
  vec3 grayXfer = vec3(0.9, 0.9, 0.5);
  vec3 gray = vec3(dot(grayXfer, color));
  vec3 renderColor =  vec3(mix(color, gray, 1.0 - saturation));
  // -------------------------------------------------------------------------

  // APPIATTISCI
  // -------------------------------------------------------------------------
  renderColor.rgb *= 0.5 + 0.1 * (1. - amount);
  // -------------------------------------------------------------------------

  // RENDER
  // -------------------------------------------------------------------------
  // gl_FragColor = vec4(renderColor.rgb, alpha);
  gl_FragColor = vec4(renderColor.rgb, alpha);
  // -------------------------------------------------------------------------

}