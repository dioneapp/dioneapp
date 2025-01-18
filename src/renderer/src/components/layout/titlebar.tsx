import CloseIcon from "../../assets/Close.svg"
import OpenIcon from "../../assets/Open.svg"

export default function Titlebar() {
      const handleClose = async () => {
        await window.electron.ipcRenderer.invoke('app:close');
      };
    
      const handleMinimize = async () => {
        await window.electron.ipcRenderer.invoke('app:minimize');
      };

    return (
      <div id="titlebar" className="absolute top-0 w-full z-50">
        <div className="flex flex-row items-center justify-center h-10 w-full px-2">
        <div className="flex gap-1 items-center justify-end h-full w-full">
          <button id="minimize-button" onClick={handleMinimize} className="cursor-pointer p-2">
            <img src={OpenIcon} alt="Close App" className="h-3 w-3" />
          </button>
          <button id="close-button" onClick={handleClose} className="cursor-pointer p-2">
            <img src={CloseIcon} alt="Close App" className="h-3 w-3" />
          </button>
        </div>
      </div>
      </div>
    )
}