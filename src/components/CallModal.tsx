import { useCallback, useState } from "react";
import { AudioPlayer } from "./AudioPlayer";
import { Modal } from "@mui/material";
import { WaveformVisualizer } from "./WaveformVisualizer";
import { HybridRecorder } from "./recorder/HybridRecorder";

export const CallModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [conversation, setConversation] = useState<
    Array<{ sender: string; audioUrl: string }>
  >([]);

  const handleRecordingComplete = useCallback((blob: Blob) => {
    const audioUrl = URL.createObjectURL(blob);
    setConversation((prev) => [...prev, { sender: "user", audioUrl }]);
  }, []);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="call-modal">
        <WaveformVisualizer />
        <HybridRecorder onRecordingComplete={handleRecordingComplete} />
        <div className="conversation-history">
          {conversation.map((item, i) => (
            <div key={i} className={`message ${item.sender}`}>
              <AudioPlayer src={item.audioUrl} />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
