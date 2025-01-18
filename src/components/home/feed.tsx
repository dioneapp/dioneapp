import { useEffect, useState } from "react";
import Loading from "../../pages/loading.tsx";
import { getCurrentPort } from "../../utils/getPort.ts";
import ScriptCard from "./feed/card.tsx";
import { Script } from "./feed/types.ts";

interface ScriptListProps {
  endpoint: string;
  type?: string;
  className?: string;
}

export default function List({ endpoint, type, className = "" }: ScriptListProps) {
  const [port, setPort] = useState<number | null>(null);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPort = async () => {
      try {
        const currentPort = await getCurrentPort();
        setPort(currentPort);
      } catch (err) {
        setError("Failed to get port number");
        setLoading(false);
      }
    };
    fetchPort();
  }, []);

  useEffect(() => {
    const fetchScripts = async () => {
      if (!port) return;

      try {
        const response = await fetch(`http://localhost:${port}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setScripts(data);
      } catch (err) {
        setError("Failed to fetch scripts");
      } finally {
        setLoading(false);
      }
    };

    fetchScripts();
  }, [port, endpoint]);


  if (loading && type != 'explore') {
    return <Loading />;
  }

  return (
    <div className={`w-full ${className} last:mb-4`}>
      <div className="grid grid-cols-2 gap-4">
        {scripts.map((script) => (
          <ScriptCard key={script.id} script={script} />
        ))}
      </div>

      {port && (
        <div className="fixed bottom-2 right-2 text-[8px] text-neutral-500 
                      bg-black/50 backdrop-blur-sm rounded px-2 py-1">
          Port: {port}
        </div>
      )}
    </div>
  );
}