import { getCurrentPort } from "@renderer/utils/getPort";
import { useEffect, useState } from "react";

export default function Settings() {
    const [port, setPort] = useState<number | null>(null);
    const [versions] = useState(window.electron.process.versions)
  
    useEffect(() => {
      // get actual port
      const fetchPort = async () => {
          const currentPort = await getCurrentPort();
          setPort(currentPort);
      };
      fetchPort();
    }, []);
    
  return (
    <div className="bg-background overflow-hidden">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col text-xs text-neutral-400">
        <p>Electron v{versions.electron}</p>
        <p>Chromium v{versions.chrome}</p>
        <p>Node v{versions.node}</p>
        <p>Port {port}</p>
        </div>
      </div>
    </div>
  );
}