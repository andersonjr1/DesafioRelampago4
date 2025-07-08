import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

// --- Interfaces ---
interface RoundTimerProps {
  startTime: number; // Server timestamp in milliseconds for when the timer started
  endTime: number; // Server timestamp in milliseconds for when the timer will end
}

// --- Styled Components ---

// The main container that holds the progress ring and the text.
// It's now an inline-block with a fixed size to act as a positioning context.
const TimerWrapper = styled(Box)({
  position: "relative",
  display: "inline-block", // Use inline-block to contain the absolutely positioned children
  width: 80,
  height: 80,
});

// A container to absolutely position the text in the center of the wrapper.
const TimerTextContainer = styled(Box)({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

// Styled component for the large number display.
// Its color will change based on the time remaining.
const NumberText = styled(Typography)<{
  color: "success" | "warning" | "error";
}>(({ theme, color }) => ({
  lineHeight: 1,
  fontWeight: "bold",
  fontSize: "2rem", // Larger font size for the number
  color: theme.palette[color].main,
  transition: "color 0.5s ease-in-out",
}));

// Styled component for the "seconds" label below the number.
const LabelText = styled(Typography)(({ theme }) => ({
  fontSize: "0.6rem",
  color: theme.palette.text.secondary,
  textTransform: "lowercase",
}));

// --- Main Component ---
const RoundTimer: React.FC<RoundTimerProps> = ({ startTime, endTime }) => {
  // Calculate total duration once, memoized for efficiency.
  const totalDuration = useMemo(
    () => endTime - startTime,
    [startTime, endTime]
  );

  // State to hold the remaining time in milliseconds.
  // It's initialized by calculating the difference between the end time and the current time.
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, endTime - Date.now())
  );

  // Effect to update the timer every second.
  useEffect(() => {
    const interval = setInterval(() => {
      // Consistently check against the current time to prevent drift.
      setTimeLeft(Math.max(0, endTime - Date.now()));
    }, 500);

    // Cleanup the interval when the component unmounts or dependencies change.
    return () => clearInterval(interval);
  }, [endTime]);

  // Calculate the progress percentage for the circular indicator.
  const progress = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;
  // Convert milliseconds to whole seconds for display.
  const seconds = Math.ceil(timeLeft / 1000);
  const isTimeUp = timeLeft <= 0;

  // Determine the color of the progress ring and text based on the time left.
  const progressColor = useMemo((): "success" | "warning" | "error" => {
    if (progress > 50) return "success";
    if (progress > 20) return "warning";
    return "error";
  }, [progress]);

  return (
    <TimerWrapper
      sx={{
        // Apply a pulsing animation when time is low.
        animation:
          progressColor === "error" && !isTimeUp
            ? "pulse 1.5s infinite"
            : "none",
        "@keyframes pulse": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      }}
    >
      {/* Background track for the progress ring */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={80}
        thickness={2.5}
        sx={{
          color: (theme) => theme.palette.grey[300],
          position: "absolute", // Position absolutely within the wrapper
          top: 0,
          left: 0,
        }}
      />
      {/* The main progress indicator that updates with time */}
      <CircularProgress
        variant="determinate"
        value={isTimeUp ? 0 : progress}
        size={80}
        thickness={3}
        color={progressColor}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          [`& .MuiCircularProgress-circle`]: {
            strokeLinecap: "round", // Makes the progress line have rounded ends
            transition: "stroke-dashoffset 1s linear, color 0.5s",
          },
        }}
      />
      <TimerTextContainer>
        {isTimeUp ? (
          <LabelText
            sx={{
              fontSize: "1rem",
              color: "error.main",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Esgotado!
          </LabelText>
        ) : (
          <>
            <NumberText color={progressColor}>{seconds}</NumberText>
            <LabelText>segundo{seconds !== 1 ? "s" : ""}</LabelText>
          </>
        )}
      </TimerTextContainer>
    </TimerWrapper>
  );
};

export default RoundTimer;
