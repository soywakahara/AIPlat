import React from 'react';
import { Box, Toolbar, Typography } from '@mui/material';
import WorkflowTabs from './WorkflowTabs';

const drawerWidth = 240;

function Body() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        marginLeft: `${drawerWidth}px`,
      }}
    >
      <Toolbar />
      <Typography variant="h5" gutterBottom>
        ワークフロー管理
      </Typography>
      <Box>
        <WorkflowTabs />
      </Box>
    </Box>
  );
}

export default Body;
