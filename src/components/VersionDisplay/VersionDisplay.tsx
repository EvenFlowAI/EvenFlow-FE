import React from 'react';
import { Box, Chip } from '@mui/material';

const VersionDisplay: React.FC = () => {
  const appVersion = process.env.REACT_APP_VERSION || 'dev';

  return (
    <Box sx={{ position: 'fixed', bottom: 0, right: 0, zIndex: 9999, padding: 1, opacity: 0.7 }}>
      <Chip
        label={`v${appVersion}`}
        size="small"
        color="primary"
        variant="outlined"
        onClick={() => {
          if (window.caches) {
            caches.keys().then(names => {
              names.forEach(name => {
                caches.delete(name);
              });
            });
          }
          window.location.reload();
        }}
      />
    </Box>
  );
};

export default VersionDisplay;
