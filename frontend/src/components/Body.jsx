import React from 'react';
import { Box, Toolbar, Typography } from '@mui/material';

/**
 * MUIでAppBar/Drawerを固定した場合、
 * メインコンテンツはAppBarの高さ + Drawerの幅を考慮してスタイルを当てる必要がある.
 */
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
      {/** Toolbarでヘッダー分のスペースを空ける */}
      <Toolbar />
      <Typography variant="h5" gutterBottom>
        メインコンテンツ
      </Typography>
      <Typography>
        ここにワークフロー一覧や詳細画面等を表示していきます。
      </Typography>
    </Box>
  );
}

export default Body;
