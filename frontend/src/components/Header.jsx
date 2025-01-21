import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function Header() {
  return (
    <AppBar 
      position="fixed"
      sx={{ 
        //backgroundColor: '#FF5B5B',
        //backgroundColor: '#FF5722',
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          App
        </Typography>
        <Button color="inherit">ログイン</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
