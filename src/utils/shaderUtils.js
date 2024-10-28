export function loadShader(shaderContent) {
    return shaderContent.toString();
}

export function injectDefines(shader, defines = {}) {
    const defineStrings = Object.entries(defines).map(([key, value]) => 
        `#define ${key} ${value}`
    );
    return defineStrings.join('\n') + '\n' + shader;
}
