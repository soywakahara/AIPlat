import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { WorkflowContext } from '../contexts/WorkflowContext';

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

export default function WorkflowEditor({ isNew }) {
  const { id: workflowId } = useParams();
  const { 
    selectedWorkflow, 
    setSelectedWorkflow, 
    fetchWorkflowById, 
    isWorkflowDetailLoading 
  } = useContext(WorkflowContext);
  
  const [steps, setSteps] = useState([createStep('1', '手動起動')]);

  useEffect(() => {
    // 新規作成時はselectedWorkflowをクリア
    if (isNew) {
      setSelectedWorkflow(null);
      setSteps([createStep('1', '手動起動')]);
      return;
    }

    // 既存ワークフロー編集時
    if (workflowId) {
      // TODO: バックエンド実装後に有効化
      // fetchWorkflowById(workflowId);
      // setSelectedWorkflow(mockWorkflow);
      // setSteps(mockWorkflow.steps);
      
      // 一時的にモックデータを使用
      const mockWorkflow = {
        id: workflowId,
        name: `${workflowId}`,
        steps: [
          createStep('1', '手動起動'),
          createStep('2', 'データ処理'),
          createStep('3', '完了通知'),
        ]
      };
      setSelectedWorkflow(mockWorkflow);
      setSteps(mockWorkflow.steps);
    }
  }, [workflowId, isNew, setSelectedWorkflow]);

  const handleAddStep = (index) => {
    const newId = (steps.length + 1).toString();
    const newStep = createStep(newId, `ステップ${newId}`);
    const newSteps = [...steps];
    newSteps.splice(index + 1, 0, newStep);
    setSteps(newSteps);
  };

  if (isWorkflowDetailLoading) {
    return <Typography>読み込み中...</Typography>;
  }

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
        {isNew ? '新規ワークフロー' : `${selectedWorkflow?.name}`}
      </Typography>

      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <React.Fragment key={step.id}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1">{step.name}</Typography>
              </CardContent>
            </Card>
            <Connector
              onClick={() => handleAddStep(index)}
              showBottomLine={!isLast}
            />
          </React.Fragment>
        );
      })}
    </Box>
  );
}
