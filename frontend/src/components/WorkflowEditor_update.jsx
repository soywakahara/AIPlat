// WorkflowEditor.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { WorkflowContext } from '../contexts/WorkflowContext';
import ActionAppModal from './ActionAppModal';

function createStep(id, name) {
  // アクションやアプリ、設定項目もここで持たせる例
  return { id, name, action: null, app: null, config: {} };
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
  
  const [steps, setSteps] = useState([]);
  // モーダル開閉用
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 「何番目の後にステップを挿入するか」を保持する
  const [targetIndex, setTargetIndex] = useState(null);

  // 既存ステップを編集する場合に備えて、編集対象ステップも保持
  const [editingStep, setEditingStep] = useState(null);

  useEffect(() => {
    if (isNew) {
      // 新規ワークフロー作成時
      setSelectedWorkflow(null);
      setSteps([createStep('1', '手動起動')]);
    } else if (workflowId) {
      // 既存ワークフロー編集時: モックデータで置き換え中
      const mockWorkflow = {
        id: workflowId,
        name: workflowId,
        steps: [
          createStep('1', '手動起動'),
          createStep('2', 'データ処理'),
          createStep('3', '完了通知'),
        ],
      };
      setSelectedWorkflow(mockWorkflow);
      setSteps(mockWorkflow.steps);
    }
  }, [workflowId, isNew, setSelectedWorkflow]);

  // 「＋」ボタンを押したとき、新規ステップ追加用にモーダルを開く
  const handleAddStepModal = (index) => {
    setTargetIndex(index);
    setEditingStep(null);   // 新規作成なので既存はnull
    setIsModalOpen(true);
  };

  // もし既存ステップをクリックして編集したい場合
  const handleEditStepModal = (step, index) => {
    setTargetIndex(index);
    setEditingStep(step);
    setIsModalOpen(true);
  };

  // モーダルで「決定」されたときに呼ばれる
  const handleModalSave = (newStepData) => {
    if (editingStep) {
      // 既存ステップを上書き更新する場合
      setSteps((prev) =>
        prev.map((s, i) =>
          s.id === editingStep.id ? { ...s, ...newStepData } : s
        )
      );
    } else {
      // 新規ステップ追加
      const newSteps = [...steps];
      // targetIndex の後ろに新ステップを挿入
      newSteps.splice(targetIndex + 1, 0, newStepData);
      setSteps(newSteps);
    }
    setIsModalOpen(false);
    setEditingStep(null);
    setTargetIndex(null);
  };

  if (isWorkflowDetailLoading) {
    return <Typography>読み込み中...</Typography>;
  }

  return (
    <Box
      component="main"
      sx={{
        marginLeft: '120px',
        marginTop: '100px',
        p: 3,
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
        {isNew ? '新規ワークフロー' : selectedWorkflow?.name}
      </Typography>

      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <React.Fragment key={step.id}>
            <Card 
              sx={{ mb: 2, cursor: 'pointer' }}
              onClick={() => handleEditStepModal(step, index)}
            >
              <CardContent>
                <Typography variant="subtitle1">
                  {step.name}
                </Typography>
              </CardContent>
            </Card>
            <Connector
              onClick={() => handleAddStepModal(index)}
              showBottomLine={!isLast}
            />
          </React.Fragment>
        );
      })}

      <ActionAppModal
        open={isModalOpen}
        step={editingStep}         // nullなら新規モード
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
      />
    </Box>
  );
}
