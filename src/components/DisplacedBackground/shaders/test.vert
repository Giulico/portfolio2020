precision mediump float;

// default mandatory variables
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform mat4 distortedTextureMatrix;

// custom variables
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
varying vec2 vDistortedTextureCoord;

varying vec2 vDistortionEffect;

uniform vec2 u_mouse;

void main() {
  vec3 vertexPosition = aVertexPosition;
  gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

  // varyings
  vTextureCoord = aTextureCoord;
  vDistortedTextureCoord = (distortedTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
  vVertexPosition = vertexPosition;

  // distortion effect is calculated in the vertex shader
  vDistortionEffect = u_mouse - vec2(vertexPosition.x, vertexPosition.y);
}