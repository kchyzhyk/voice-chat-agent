import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

export const WaveformVisualizer = ({ audioUrl }: { audioUrl?: string }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#4facfe",
        progressColor: "#00f2fe",
        cursorWidth: 0,
        barWidth: 2,
        height: 80,
      });

      if (audioUrl) {
        wavesurfer.current.load(audioUrl);
      }
    }

    return () => wavesurfer.current?.destroy();
  }, [audioUrl]);

  return <div ref={waveformRef} />;
};
