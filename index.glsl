float phongSpecular(
  vec3 lightDirection,
  vec3 viewDirection,
  vec3 surfaceNormal,
  float shininess) {

  //Calculate Phong power
  vec3 H = reflect(lightDirection, surfaceNormal);
  return pow(max(0.0, dot(viewDirection, H)), shininess);
}

#pragma glslify: export(phongSpecular)