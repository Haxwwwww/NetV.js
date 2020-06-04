#version 300 es
precision highp float;
in vec3 inVertexPos;
in vec2 inPos;
in float inSize;
in vec4 inColor;

out vec2 pos;
out float size;
out vec4 color;

// TODO: need review
uniform mat3 projection;
uniform vec2 scale;
uniform vec2 translate;
uniform vec2 viewport;

void main(void) {
    size = inSize;
    color = inColor;
    float vertexSize = size * (2. * sqrt(2.));
    pos = scale * inPos + translate;
    mat3 transform = mat3(
        vertexSize, 0, 0,
        0, vertexSize, 0,
        pos.x, pos.y, 1
    );

    gl_Position = vec4(projection * transform * inVertexPos, 1.);
}