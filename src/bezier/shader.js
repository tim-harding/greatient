/*
These shaders calculate the beziér patch function p: R² → R 

         p(u,v) = û × B × P × B^T × v̂

where 
- B is the characteristic matrix of the cubic beziér function
- B^T is the transpose of B
- u and v are the beziér patch analogs of the parameter t
- û and v̂ and the polynomial coefficient vectors. 
        ┌                ┐        ┌    ┐ 
        │ -1   3  -3   1 │        │ v³ │ 
    B = │  3  -6   6   0 │    v̂ = │ v² │    û = [u³, u², u, 1]
        │ -3   3   0   0 │        │ v  │ 
        │  1   0   0   0 │        │ v  │ 
        └                ┘        └    ┘



A beziér mesh consists of a grid of beziér patches. Each patch is specified by
four beziér controls, which form a 2×2 analog of the usual 1D beziér curve:

         ┌───▶       ◀───┐ ← Anchor
         │               │
         ▼               ▼ ← Handle
               

         ▲               ▲
         │               │
         └───▶       ◀───┘

We interpolate these anchors and handles to create a 4×4 grid of control points.
This part is done on the CPU.

        P₀₀ P₀₁ P₀₂ P₀₃
         ┌───┬───┬───┐
         │   │   │   │
     P₁₀ ├───┼───┼───┤ P₁₃
         │   │   │   │
     P₂₀ ├───┼───┼───┤ P₂₃
         │   │   │   │
         └───┴───┴───┘
        P₃₀ P₃₁ P₃₂ P₃₃

These form the patch matrix P that defines the shape of the patch. p is computed
separately for the x and y axes to get the final 2D position, so we need two
patch matrices, Px and Py.

These shaders are rendered for a grid mesh with uv attributes
ranging from (0,0) to (1,1):

       (0,0)           (1,0)
         ┌───┬───┬───┬───┐
         │   │   │   │   │
         ├───┼───┼───┼───┤
         │   │   │   │   │
         ├───┼───┼───┼───┤
         │   │   │   │   │
         ├───┼───┼───┼───┤
         │   │   │   │   │
         └───┴───┴───┴───┘
       (1,0)           (1,1)

This mesh is instanced for each patch of the beziér mesh.



See here for a non-ascii version of this math
https://www.educative.io/answers/what-is-a-bzier-patch

For Bezier curves in 1D, I recommend this explainer
https://www.youtube.com/watch?v=jvPPXbo87ds

There is also a tensor product formulation where p: R² → R²
https://www.sciencedirect.com/topics/computer-science/tensor-product-patch
*/

export const FRAGMENT_SOURCE = `\
#version 300 es
precision mediump float;

out vec4 outColor;

void main() {
    outColor = vec4(1, 0, 0.5, 1);
}
`;

export const VERTEX_SOURCE = `\
#version 300 es
precision mediump float;

const mat4 B = mat4(
    -1,  3, -3,  1,
     3, -6,  3,  0,
    -3,  3,  0,  0,
     1,  0,  0,  0,
);

const mat4 Bt = mat4(
    -1,  3, -3,  1,
     3, -6,  3,  0, 
    -3,  3,  0,  0,
     1,  0,  0,  0,
);

in vec2 uv;
uniform mat4 Px;
uniform mat4 Py;

void main() {
    mat4 Mx = B * Px * Bt;
    mat4 My = B * Py * Bt;
    vec2 uv2 = uv * uv;
    vec4 u = vec4(uv2.u * uv.u, uv2.u, uv.u, 1);
    vec4 v = vec4(uv2.v * uv.v, uv2.v, uv.v, 1);
    float x = dot(u, Mx * v);
    float y = dot(u, My * v);
    gl_Position = vec4(x, y, 0, 1);
}
`;

// vim: set filetype=glsl:
