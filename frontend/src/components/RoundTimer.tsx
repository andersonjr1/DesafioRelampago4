import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AccessTime } from "@mui/icons-material";

// --- Interfaces ---
interface RoundTimerProps {
  startTime: number; // Server timestamp in milliseconds
  endTime: number; // Server timestamp in milliseconds
}

interface TimerContainerProps {
  isTimeUp: boolean;
  progressColor: "success" | "warning" | "error";
}

// --- Styled Components ---
const TimerContainer = styled(Box)<TimerContainerProps>(
  ({ theme, isTimeUp, progressColor }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: "white",
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    position: "relative",
    minWidth: "120px",
    transition: "all 0.3s ease-in-out",
    ...(progressColor === "error" &&
      !isTimeUp && {
        animation: "pulse 1.5s infinite",
        "@keyframes pulse": {
          "0%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0px rgba(232, 76, 61, 0.5)",
          },
          "50%": {
            transform: "scale(1.02)",
            boxShadow: "0 0 0 5px rgba(232, 76, 61, 0)",
          },
          "100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0px rgba(232, 76, 61, 0)",
          },
        },
      }),
  })
);

const TimerIcon = styled(AccessTime)(({ theme }) => ({
  fontSize: "1.5rem",
  color: theme.palette.primary.main,
}));

const TimerText = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.text.primary,
  fontSize: "0.875rem",
}));

const ProgressContainer = styled(Box)(() => ({
  position: "relative",
  display: "inline-flex",
  width: 24,
  height: 24,
}));

// --- Componente Principal ---
const RoundTimer: React.FC<RoundTimerProps> = ({ startTime, endTime }) => {
  const [timeLeft, setTimeLeft] = useState(() => endTime - startTime);
  const totalDuration = endTime - startTime;

  useEffect(() => {
    // Sync with server time on initial render
    const initialElapsed = Date.now() - startTime;
    const initialRemaining = Math.max(0, totalDuration - initialElapsed);
    setTimeLeft(initialRemaining);

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(0, prevTime - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, totalDuration]);

  const progress = (timeLeft / totalDuration) * 100;
  const seconds = Math.ceil(timeLeft / 1000);
  const isTimeUp = timeLeft <= 0;

  // useMemo to determine the color based on progress
  const progressColor = useMemo((): "success" | "warning" | "error" => {
    if (progress > 50) return "success";
    if (progress > 20) return "warning";
    return "error";
  }, [progress]);

  const getTimerText = () => {
    if (isTimeUp) return "Tempo esgotado!";
    return `${seconds} segundo${seconds !== 1 ? "s" : ""}`;
  };

  return (
    <TimerContainer isTimeUp={isTimeUp} progressColor={progressColor}>
      <TimerIcon />

      <ProgressContainer>
        {/* Background track */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={24}
          thickness={2}
          sx={{
            position: "absolute",
            color: "grey.300",
          }}
        />
        {/* Main progress indicator */}
        <CircularProgress
          variant="determinate"
          value={isTimeUp ? 0 : progress}
          size={24}
          thickness={3}
          color={progressColor}
          sx={{
            position: "absolute",
            [`& .MuiCircularProgress-circle`]: {
              strokeLinecap: "round",
              transition: "stroke-dashoffset 1s linear, color 0.5s",
            },
          }}
        />
      </ProgressContainer>

      <TimerText>{getTimerText()}</TimerText>
    </TimerContainer>
  );
};

export default RoundTimer;
