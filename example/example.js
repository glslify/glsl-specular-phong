'use strict'

var glslify = require('glslify')
var drawTriangle = require('a-big-triangle')

var createShader = glslify({
  vert: '\
attribute vec2 position;\
varying vec2 uv;\
void main() {\
  uv = position;\
  gl_Position = vec4(position,0,1);\
}',
  frag: '\
precision mediump float;\n\
#pragma glslify: specular = require(../index.glsl)\n\
varying vec2 uv;\n\
uniform vec3 lightPosition;\n\
void main() {\n\
  float r = sqrt(dot(uv,uv));\
  float theta = atan(uv.y,uv.x);\
  float phi   = asin(r);\
  vec3 normal = vec3(\
    cos(theta)*sin(phi),\
    sin(theta)*sin(phi),\
    -cos(phi));\n\
  vec3 position = vec3(normal.xy, normal.z+5.0);\
  vec3 lightDir = normalize(lightPosition - position);\
  vec3 eyeDir = normalize(-position);\
  float power = specular(lightDir, eyeDir, normal, 23.0);\n\
  if(r > 1.0) {\n\
    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);\n\
  } else {\n\
    gl_FragColor = vec4(power,power,power, 1.0);\n\
  }\n\
}',
  inline: true
})

var canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
canvas.style.left = "0px"
canvas.style.top = "0px"
canvas.style.position = "absolute"
document.body.appendChild(canvas)

var gl = canvas.getContext('webgl')
var shader = createShader(gl)

function render() {
  shader.bind()
  var theta = Date.now()*0.0005
  var x = Math.cos(theta)
  var y = Math.sin(theta)
  shader.uniforms.lightPosition = [30.0*x, 10.0, 30.0*y]
  drawTriangle(gl)
  requestAnimationFrame(render)
}

render()