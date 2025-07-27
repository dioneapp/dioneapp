export function getOS(): string {
    return process.platform === "win32" ? "windows" : process.platform === "darwin" ? "macos" : "linux";
}

export function getArch(): string {
    return process.arch === "x64" ? "amd64" : process.arch === "arm64" ? "arm64" : "x86";
}