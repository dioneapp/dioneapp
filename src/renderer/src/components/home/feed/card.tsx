import { memo } from 'react';
import { Script } from './types';
import { Link } from 'react-router-dom';

interface ScriptCardProps {
  script: Script;
}

function ScriptCard({ script }: ScriptCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/icon.svg";
  };

  return (
    <Link
      to={`/install/${script.id}`}
      className="group flex gap-4 h-auto min-h-[120px] border border-white/10 hover:border-white/20 
                bg-gradient-to-r from-[#BCB1E7]/5 to-transparent backdrop-blur-3xl 
                rounded-lg p-4 transition-all duration-200 hover:shadow-lg items-center"
    >
      <img
        src={script.logo_url || "/icon.svg"}
        onError={handleImageError}
        alt={`${script.name} icon`}
        className="h-16 w-16 rounded-xl border border-white/10 object-cover 
                 object-center group-hover:border-white/20 transition-all duration-200"
      />
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <h2 className="text-xl sm:text-2xl text-white font-medium truncate">
          {script.name}
        </h2>
        <p className="text-xs text-neutral-400 line-clamp-2 break-words">
          {script.description}
        </p>
      </div>
    </Link>
  );
}

export default memo(ScriptCard);