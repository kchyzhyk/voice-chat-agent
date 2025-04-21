import { AudioRecorder } from "react-audio-voice-recorder";

export const BasicRecorder = ({
  onRecordingComplete,
}: {
  onRecordingComplete: (blob: Blob) => void;
}) => (
  <AudioRecorder
    onRecordingComplete={onRecordingComplete}
    audioTrackConstraints={{ noiseSuppression: true, echoCancellation: true }}
    downloadOnSavePress={false}
    downloadFileExtension="wav"
  />
);
