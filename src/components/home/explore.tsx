import { useEffect, useState } from "react";
import { getCurrentPort } from "../../utils/getPort";

export default function Explore() {
    const [port, setPort] = useState<number>(0);
    const [scripts, setScripts] = useState<any[]>([]);
  
    useEffect(() => {
      async function getPort() {
        const port = await getCurrentPort();
        setPort(port);
      }
      getPort();
    }, [])
  
    useEffect(() => {
      async function getScripts() {
        const data = await fetch(`http://localhost:${port}/discovery`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const scripts = await data.json();
        setScripts(scripts);
        console.log(scripts);
      }
      getScripts();
    }, [port])

    
    return (
        <div className="w-full h-full mt-4">
        <div 
          id="scrollable" 
          className="grid grid-cols-2 gap-4 w-full h-screen max-w-max overflow-auto pr-2 pb-24"
        >
          {scripts.map((script: any) => (
            <div 
              className="flex gap-4 w-full h-[120px] border border-white/10 bg-gradient-to-r from-[#BCB1E7]/5 to-transparent backdrop-blur-3xl backdrop-filter rounded-lg p-4" 
              key={script.id}
            >
              <img 
                src={script.logo_url} 
                alt="Script icon" 
                className="h-16 w-16 rounded-xl border border-white/10 object-cover"
              />
              <div className="flex flex-col gap-2 justify-start items-start overflow-hidden">
                <p className="text-2xl text-white font-medium truncate w-full">
                  {script.name}
                </p>
                <p className="text-xs text-neutral-400 line-clamp-3 w-full">
                  {script.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="absolute bottom-1 right-1 text-[8px] text-neutral-500 select-all">
          {port}
        </p>
      </div>
    )
}
