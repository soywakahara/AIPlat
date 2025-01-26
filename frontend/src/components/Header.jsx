import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/"
          sx={{ 
            color: 'white',
            textDecoration: 'none',
            '&:hover': {
              opacity: 0.8,
            },
            flexGrow: 1,
          }}
        >
          AIプラットフォーム
        </Typography>
        <Button color="inherit" sx={{ marginLeft: 0 }}>ログイン</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
