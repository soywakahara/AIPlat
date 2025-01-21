import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';

function createStep(id, name) {
  return { id, name };
}

// “縦線 + ＋ボタン + 縦線”部分をまとめたコンポーネント
function Connector({ onClick }) {
  return (
    <Box 
      // 縦方向に並べる
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        mb: 2 // 下方向に少し余白
      }}
    >
      {/* 上の縦線 */}
      <Box 
        sx={{ 
          width: '2px', 
          height: '20px', 
          backgroundColor: '#ccc' 
        }} 
      />
      {/* ＋ボタン */}
      <Button 
        variant="contained" 
        size="small" 
        onClick={onClick}
        sx={{ 
          borderRadius: '50%', 
          minWidth: '40px', 
          height: '40px', 
          mt: '-2px', // 微調整
          mb: '-2px'
        }}
      >
        ＋
      </Button>
      {/* 下の縦線 */}
      <Box 
        sx={{ 
          width: '2px', 
          height: '20px', 
          backgroundColor: '#ccc' 
        }} 
      />
    </Box>
  );
}

export default function WorkflowEditor() {
  const [steps, setSteps] = useState([
    createStep('1', '手動起動'),
    createStep('2', 'CSVを操作する'),
  ]);

  const handleAddStep = (index) => {
    // “どの場所に追加するか”の例: index番目の後ろに新ステップ
    const newId = (steps.length + 1).toString();
    const newStep = createStep(newId, `ステップ${newId}`);
    const newSteps = [...steps];
    newSteps.splice(index + 1, 0, newStep);
    setSteps(newSteps);
  };

  return (
    <Box
      component="main"
      sx={{
        // サイドバー + ヘッダー分だけマージン
        marginLeft: '240px',
        marginTop: '64px',
        p: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        ワークフロータイトル
      </Typography>

      {/* ステップを順番に表示し、下にConnectorを表示 */}
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1">{step.name}</Typography>
              {/* 他にも「設定」「編集」ボタン等があれば置く */}
            </CardContent>
          </Card>

          {/* 各ステップの下に、縦線＋プラスボタンを表示 */}
          <Connector onClick={() => handleAddStep(index)} />
        </React.Fragment>
      ))}
    </Box>
  );
}
