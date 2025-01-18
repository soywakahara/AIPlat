import React from 'react';
import { Drawer, List, ListItem, ListItemText, Box, Toolbar, Button } from '@mui/material';

const drawerWidth = 240;

function Sidebar() {
  return (
    <Drawer
      variant="permanent" // 常時固定
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      {/** Toolbarを挿入することで、AppBarと高さを揃える */}
      <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <List sx={{ flex: 1 }}>
          <ListItem button>
            <ListItemText primary="データ操作" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="アプリ操作" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="ワークフロー" />
          </ListItem>
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
