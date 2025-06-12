import sound from "./intro.mp3";
import { useEffect } from 'react';

const ExecuteSound = ({ firstLaunch }: { firstLaunch: string }) => {
  useEffect(() => {
    const audio = new Audio(sound);
    if (firstLaunch === "true") {
      audio.play().catch(e => {
        console.warn('Cant play sound:', e);
      });
    }
  }, [firstLaunch]);

  return null;
};

export default ExecuteSound;
