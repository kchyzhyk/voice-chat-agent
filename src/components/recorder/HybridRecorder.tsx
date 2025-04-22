import React, { useState } from "react";
import { IconButton, Tooltip, Box } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import MicIcon from "@mui/icons-material/Mic";
import { BasicRecorder } from "./BasicRecorder";
import { AutoSilenceRecorder } from "./AutoSilenceRecorder";

interface HybridRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  autoSilenceThreshold?: number;
}

export const HybridRecorder: React.FC<HybridRecorderProps> = ({
  onRecordingComplete,
  autoSilenceThreshold = 100,
}) => {
  const [autoMode, setAutoMode] = useState(true);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {autoMode ? (
        <AutoSilenceRecorder
          onRecordingComplete={onRecordingComplete}
          silenceThreshold={autoSilenceThreshold}
        />
      ) : (
        <BasicRecorder onRecordingComplete={onRecordingComplete} />
      )}

      <Tooltip
        title={
          autoMode ? "Switch to manual mode" : "Switch to auto-silence mode"
        }
        placement="top"
        arrow
      >
        <IconButton
          sx={{
            position: "absolute",
            top: -12,
            right: -12,
            backgroundColor: "background.paper",
            boxShadow: 1,
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
          onClick={() => setAutoMode(!autoMode)}
          color={autoMode ? "primary" : "secondary"}
          size="small"
        >
          {autoMode ? (
            <AutoFixHighIcon fontSize="small" />
          ) : (
            <MicIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </div>
  );
};
