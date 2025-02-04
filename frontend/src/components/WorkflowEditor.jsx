// WorkflowEditor.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { WorkflowContext } from '../contexts/WorkflowContext';
import ActionModal from './ActionModal';

function createAction(actionId, actionName) {
  return {
    actionId,
    actionName,
    actionType: '',       // operation に相当するフィールド
    actionStatus: 'draft',
    actionCreatedAt: new Date().toISOString().split('T')[0],
    actionAPI: '',
    outputURL: '',
    actionConfig: {},
  };
}

// "縦線 + ＋ボタン + 縦線"部分（下の縦線はオプション）
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
  
  const [actions, setActions] = useState([]);
  // モーダル開閉用
  const [isModalOpen, setIsModalOpen] = useState(false);
  // "何番目の後にステップを挿入するか"を保持する
  const [targetIndex, setTargetIndex] = useState(null);

  // 既存ステップを編集する場合に備えて、編集対象ステップも保持
  const [editingAction, setEditingAction] = useState(null);

  useEffect(() => {
    if (isNew) {
      // 新規ワークフロー作成時
      setSelectedWorkflow(null);
      setActions([createAction('1', '手動起動アクション')]);
    } else if (workflowId) {
      // 既存ワークフロー編集時: モックデータで置き換え中
      const mockWorkflow = {
        workflowId,
        workflowName: `MockName-${workflowId}`,
        workflowStatus: 'open',
        workflowCreatedAt: new Date().toISOString().split('T')[0],
        workflowTrigger: { triggerType: 'manual' },
        workflowActions: [
          createAction('1', '手動起動アクション'),
          createAction('2', 'データ処理アクション'),
          createAction('3', '完了通知アクション'),
        ],
      };
      setSelectedWorkflow(mockWorkflow);
      setActions(mockWorkflow.workflowActions);
    }
  }, [workflowId, isNew, setSelectedWorkflow]);

  // モーダルを閉じる際の処理を修正
  const handleModalClose = () => {
    setIsModalOpen(false);
    // モーダルを閉じた時点で編集状態をリセット
    setEditingAction(null);
    setTargetIndex(null);
  };

  // "＋"ボタンを押したとき、新規ステップ追加用にモーダルを開く
  const handleAddActionModal = (index) => {
    setTargetIndex(index);
    setEditingAction(null);
    setIsModalOpen(true);
  };

  // もし既存ステップをクリックして編集したい場合
  const handleEditActionModal = (action, index) => {
    setTargetIndex(index);
    setEditingAction(action);
    setIsModalOpen(true);
  };

  // モーダルで「決定」されたときに呼ばれる
  const handleModalSave = (newActionData) => {
    if (editingAction) {
      // 既存アクションを上書き更新する場合
      setActions((prev) =>
        prev.map((a) =>
          a.actionId === editingAction.actionId
            ? { ...a, ...newActionData }
            : a
        )
      );
    } else {
      // 新規アクション追加
      const newActions = [...actions];
      newActions.splice(targetIndex + 1, 0, newActionData);
      setActions(newActions);
    }
    handleModalClose();
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
        {isNew ? '新規ワークフロー' : selectedWorkflow?.workflowName}
      </Typography>

      {actions.map((action, index) => {
        const isLast = index === actions.length - 1;
        return (
          <React.Fragment key={action.actionId}>
            <Card 
              sx={{ mb: 2, cursor: 'pointer' }}
              onClick={() => handleEditActionModal(action, index)}
            >
              <CardContent>
                <Typography variant="subtitle1">
                  {action.actionName}
                </Typography>
              </CardContent>
            </Card>
            <Connector
              onClick={() => handleAddActionModal(index)}
              showBottomLine={!isLast}
            />
          </React.Fragment>
        );
      })}

      <ActionModal
        open={isModalOpen}
        action={editingAction}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />
    </Box>
  );
}
