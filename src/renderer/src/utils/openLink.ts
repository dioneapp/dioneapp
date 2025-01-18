export const openLink = (url: string) => {
  window.electron.ipcRenderer.invoke('open-external-link', url)
}