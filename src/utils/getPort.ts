export const getCurrentPort = async () => {
    return await window.ipcRenderer.invoke('get-current-port');
}