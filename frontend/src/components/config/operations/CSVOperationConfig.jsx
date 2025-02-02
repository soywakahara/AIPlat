import React from 'react';
import { TextField, Box } from '@mui/material';

export default function CSVOperationConfig({ config, setConfig }) {
  // configがオブジェクトであることを想定
  const handleChange = (key, value) => {
    setConfig({
      ...config,
      [key]: value,
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        label="CSV区切り文字"
        value={config?.delimiter || ''}
        onChange={(e) => handleChange('delimiter', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="読み込み開始行"
        value={config?.startLine || ''}
        onChange={(e) => handleChange('startLine', e.target.value)}
        fullWidth
      />
    </Box>
  );
} 