export const SHADER_FRAGMENT = `\
#version 300 es

precision highp float;

out vec4 outColor;

void main() {
    outColor = vec4(1, 0, 0.5, 1);
}
`;

export const SHADER_VERTEX = `\
#version 300 es

in vec2 a_position;
uniform vec2 u_resolution;

void main() {
    gl_PointSize = 4.0;
    gl_Position = vec4(a_position, 0, 1);
}
`;

// vim: set filetype=glsl:
