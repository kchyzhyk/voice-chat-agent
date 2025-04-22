import React, { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import CircularProgress from "@mui/material/CircularProgress";

const RecorderContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "start",
  gap: "1rem",
  padding: "0.5rem 1.5rem",
  borderRadius: "12px",
});

const RecordButton = styled("button")(
  ({ isrecording }: { isrecording: string }) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    backgroundColor: isrecording === "true" ? "#ff4444" : "#4a46ff",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      opacity: 0.9,
    },
  })
);

const StatusText = styled("div")({
  fontSize: "0.9rem",
  color: "#666",
});

interface AutoSilenceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  silenceThreshold?: number;
  minDuration?: number;
}

export const AutoSilenceRecorder: React.FC<AutoSilenceRecorderProps> = ({
  onRecordingComplete,
  silenceThreshold = 2000,
  minDuration = 1000,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("Press to start recording");
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTime = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const isCancelled = useRef(false);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close();
      }
    };
  }, []);

  const startRecording = async () => {
    console.log("Start recording...");
    try {
      isCancelled.current = false;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recordingStartTime.current = Date.now();

      const source = audioContextRef.current!.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current!.createAnalyser();
      analyserRef.current.fftSize = 32;
      source.connect(analyserRef.current);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const duration = Date.now() - recordingStartTime.current;

        if (duration >= minDuration) {
          onRecordingComplete(audioBlob);
        } else {
          setStatus("Recording too short - try again");
        }
        setIsProcessing(false);
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      setStatus("Listening...");
      checkAudioLevelLoop();
    } catch (err) {
      console.error("Recording failed:", err);
      setStatus("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      isCancelled.current = true;
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      setIsProcessing(true);
      setStatus("Processing...");
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
  };

  const checkAudioLevelLoop = () => {
    if (isCancelled.current || !analyserRef.current) return;

    const buffer = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(buffer);

    const avg = buffer.reduce((sum, val) => sum + val, 0) / buffer.length;
    const isSilent = avg < 10;

    console.log("Avg volume:", avg, "Silent:", isSilent);

    if (isSilent) {
      if (!silenceTimer.current) {
        silenceTimer.current = setTimeout(() => {
          const duration = Date.now() - recordingStartTime.current;
          if (duration >= minDuration) {
            setIsProcessing(false);
            stopRecording();
          }
        }, silenceThreshold);
      }
    } else {
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
        silenceTimer.current = null;
      }
    }
    requestAnimationFrame(checkAudioLevelLoop);
  };

  return (
    <RecorderContainer>
      {isRecording ? (
        <RecordButton
          isrecording="true"
          onClick={stopRecording}
          disabled={isProcessing}
        >
          <StopIcon />
          Stop
        </RecordButton>
      ) : (
        <RecordButton
          isrecording="false"
          onClick={startRecording}
          disabled={isProcessing}
        >
          <MicIcon />
          Record
        </RecordButton>
      )}

      <StatusText>
        {isProcessing ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CircularProgress size={16} />
            {status}
          </div>
        ) : (
          status
        )}
      </StatusText>
    </RecorderContainer>
  );
};
