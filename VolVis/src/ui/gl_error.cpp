#include "ui/gl_error.h"
#include "GL/glew.h"
#include <iostream>
#include <string>

void _check_gl_error(std::string_view file, int line)
{
    GLenum err(glGetError());

    while (err != GL_NO_ERROR) {
        std::string error;

        switch (err) {
        case GL_INVALID_OPERATION:
            error = "INVALID_OPERATION";
            break;
        case GL_INVALID_ENUM:
            error = "INVALID_ENUM";
            break;
        case GL_INVALID_VALUE:
            error = "INVALID_VALUE";
            break;
        case GL_OUT_OF_MEMORY:
            error = "OUT_OF_MEMORY";
            break;
        case GL_INVALID_FRAMEBUFFER_OPERATION:
            error = "INVALID_FRAMEBUFFER_OPERATION";
            break;
        }

        std::cerr << "GL_" << error.c_str() << " - " << file.data() << ":" << line << std::endl;
        err = glGetError();
    }
}
