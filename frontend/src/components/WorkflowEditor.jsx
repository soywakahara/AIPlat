import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';

function createStep(id, name) {
  return { id, name };
}

// “縦線 + ＋ボタン + 縦線”部分（下の縦線はオプション）
function Connector({ onClick, showBottomLine = true }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 2,
      }}
    >
      {/* 上の縦線 */}
      <Box
        sx={{
          width: '2px',
          height: '20px',
          backgroundColor: '#99E391',
        }}
      />
      {/* ＋ボタン */}
      <Button
        variant="contained"
        size="small"
        onClick={onClick}
        sx={{
          borderRadius: '50%',
          minWidth: '30px',
          height: '30px',
          backgroundColor: '#99E391',
          mt: '-2px',
          mb: '-2px',
        }}
      >
        ＋
      </Button>
      {/* 下の縦線はオプショナル */}
      {showBottomLine && (
        <Box
          sx={{
            width: '2px',
            height: '20px',
            backgroundColor: '#99E391',
          }}
        />
      )}
    </Box>
  );
}

export default function WorkflowEditor() {
  const [steps, setSteps] = useState([
    createStep('1', '手動起動')
  ]);

  // index番目の下にステップを追加
  const handleAddStep = (index) => {
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
        // サイドバー + ヘッダー分のマージンは仮
        marginLeft: '120px',
        marginTop: '100px',
        p: 3,
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
        ワークフロー
      </Typography>

      {steps.map((step, index) => {
        // 次のステップがあるかどうかで、下の線を出すか決める
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1">{step.name}</Typography>
              </CardContent>
            </Card>

            <Connector
              // index+1 の位置に新ステップを挿入
              onClick={() => handleAddStep(index)}
              // 最後のステップなら下の線を表示しない
              showBottomLine={!isLast}
            />
          </React.Fragment>
        );
      })}
    </Box>
  );
}
