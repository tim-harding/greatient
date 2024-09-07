const SHADER_VERTEX = `\
#version 300 es

in vec2 a_position;
uniform vec2 u_resolution;

void main() {
    // vec2 zeroToOne = a_position / u_resolution;
    // vec2 zeroToTwo = zeroToOne * 2.0;
    // vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(a_position, 0, 1);
}
`;

export default SHADER_VERTEX;
// vim: set filetype=glsl:
