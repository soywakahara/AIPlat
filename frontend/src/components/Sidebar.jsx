import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Box, Button } from '@mui/material';

const drawerWidth = 240;

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: '64px',
          height: 'calc(100% - 64px)'
        },
      }}
    >
      <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <List sx={{ flex: 1 }}>
          <ListItemButton>
            <ListItemText primary="データ操作" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="アプリ操作" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="ワークフロー" />
          </ListItemButton>
        </List>
        <Box sx={{ p: 2 }}>
          <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
            設定
          </Button>
          <Button variant="outlined" fullWidth>
            ヘルプ
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
