import React from 'react';
import { Typography, Box } from '@mui/material';
import packageJson from '../../package.json';

declare global {
    const __BUILD_TIMESTAMP__: string;
}

interface VersionInfoProps {
  variant?: 'compact' | 'full';
  color?: string;
}

export default function VersionInfo({ variant, color = 'text.secondary' }: VersionInfoProps) {
    // Use build-time injected date, fallback to current date for dev
    const buildDate = typeof __BUILD_TIMESTAMP__ !== 'undefined' ? __BUILD_TIMESTAMP__ : '-';
    const version = packageJson.version;

  if (variant === 'compact') {
    return (
      <Typography 
        variant="caption" 
        sx={{ 
          color, 
          fontSize: '0.50rem',
          opacity: 0.7,
          fontFamily: 'monospace',
          display: 'block',
          alignSelf: 'center'
        }}
      >
        v{version}-{buildDate}
      </Typography>
    );
  }

  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography 
        variant="caption" 
        sx={{ 
          color, 
          fontSize: '0.60rem',
          opacity: 0.75,
          fontFamily: 'monospace',
          display: 'block'
        }}
      >
        v{version}-{buildDate}
      </Typography>
    </Box>
  );
}