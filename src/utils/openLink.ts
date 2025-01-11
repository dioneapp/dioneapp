export const openLink = (url: string) => {
  window.ipcRenderer.send('open-external-link', url)
}