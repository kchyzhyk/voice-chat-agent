import { useEffect, useRef } from "react";

export const AudioPlayer = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (src && audioRef.current) {
      audioRef.current
        .play()
        .catch((e) => console.error("Playback failed:", e));
    }
  }, [src]);

  return <audio ref={audioRef} src={src} controls playsInline preload="true" />;
};
