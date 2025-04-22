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
    setConversation(() => [{ sender: "user", audioUrl }]);
  }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        position: "absolute",
        margin: "100px auto",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        border: "1px solid #ddd",
        borderRadius: 2,
        p: 2,
        bgcolor: "background.paper",
        width: "50%",
        height: "auto",
        maxHeight: "50%",
      }}
      slotProps={{
        backdrop: {
          style: { backgroundColor: "transparent" },
        },
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <WaveformVisualizer />
        <HybridRecorder onRecordingComplete={handleRecordingComplete} />
        <div className="conversation-history">
          {conversation.map((item, i) => (
            <div
              key={i}
              className={`message ${item.sender}`}
              style={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <AudioPlayer src={item.audioUrl} />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
