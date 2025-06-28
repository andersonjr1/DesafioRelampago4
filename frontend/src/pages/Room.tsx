import React from 'react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import RoomCodeDisplay from '../components/RoomCodeDisplay';

const Room: React.FC = () => {
  const { code } = useParams<{ code: string }>();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      {code && <RoomCodeDisplay roomCode={code} />}
    </Box>
  );
};

export default Room;