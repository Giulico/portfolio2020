precision mediump float;

varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
varying vec2 vDistortedTextureCoord;

varying vec2 vDistortionEffect;

uniform sampler2D canvasTexture;
uniform sampler2D distortedTexture;

uniform vec2 iResolution;

void main( void ) {
  // get our texture coords
  vec2 textureCoords = vec2(vTextureCoord.x, vTextureCoord.y);

  // we gonna use the RGB value of our canvas to calculate the distortion effect
  vec4 distortionMap = texture2D(canvasTexture, textureCoords);

  // ZOOM IN
  // if we add the distortion to the texture coords it will create a zoom in distortion effect
  vec2 distortedTextureCoords = vDistortedTextureCoord + distortionMap.r * vDistortionEffect / 3.0;

  // ZOOM OUT
  // if we substract the distortion to the texture coords it will create a zoom out distortion effect
  //vec2 distortedTextureCoords = vDistortedTextureCoord - distortionMap.r * vDistortionEffect / 3.0;

  // we are going to add a little chromatic aberration
  vec4 redDistortion = texture2D(distortedTexture, distortedTextureCoords + distortionMap.r / (iResolution.x / 15.0));
  vec4 greenDistortion = texture2D(distortedTexture, distortedTextureCoords);
  vec4 blueDistortion = texture2D(distortedTexture, distortedTextureCoords - distortionMap.r / (iResolution.x / 15.0));

  // first line is the final result without chromatic aberration, second line is what is drawn on the canvas texture if you want to have a look
  //vec4 finalColor = texture2D(distortedTexture, distortedTextureCoords);
  //vec4 finalColor = texture2D(canvasTexture, textureCoords);

  vec4 finalColor = vec4(redDistortion.r, greenDistortion.g, blueDistortion.b, 1.0);

  gl_FragColor = finalColor;
}