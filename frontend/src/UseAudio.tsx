import { useEffect, useState } from "react";

export const useAudio = (url: string | null) => {
  const [audio] = useState(url ? new Audio(url) : null);
  const [playing, setPlaying] = useState(false);

  // const toggle = () => setPlaying(!playing);

  const play = () => setPlaying(true);

  useEffect(() => {
    playing ? audio?.play() : audio?.pause();
  }, [playing, audio]);

  useEffect(() => {
    audio?.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio?.removeEventListener("ended", () => setPlaying(false));
    };
  }, [audio]);

  return [playing, play];
};
