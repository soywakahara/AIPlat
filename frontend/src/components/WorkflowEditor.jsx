import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Container,     // ここを追加
} from '@mui/material';
import { WorkflowContext } from '../contexts/WorkflowContext';
import ActionModal from './ActionModal';
import TriggerModal from './TriggerModal';
import DeleteIcon from '@mui/icons-material/Delete';  // この行を追加

function createAction(actionId, actionName) {
  return {
    actionId,
    actionName,
    actionType: 'operation',
    actionCategory: 'data_load',
    actionStatus: 'draft',
    actionCreatedAt: new Date().toISOString().split('T')[0],
    actionAPI: '',
    outputURL: '',
    actionConfig: {},
  };
}

function createTriggerAction(actionId, actionName) {
  return {
    actionId,
    actionName,
    actionType: 'trigger',
    actionCategory: 'manual',
    actionStatus: 'draft',
    actionCreatedAt: new Date().toISOString().split('T')[0],
    actionAPI: '',
    outputURL: '',
    actionConfig: {},
  };
}

function Connector({ onClick, showTopLine = true, showBottomLine = true, sx = {} }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 0.5,
        ...sx
      }}
    >
      {showTopLine && (
        <Box sx={{ width: '2px', height: '20px', backgroundColor: '#3665B7' }} />
      )}
      <Button
        variant="contained"
        size="small"
        onClick={onClick}
        sx={{
          borderRadius: '50%',
          minWidth: '24px',
          width: '24px',
          height: '24px',
          backgroundColor: '#3665B7',
          mt: '-2px',
          mb: '-2px',
        }}
      >
        ＋
      </Button>
      {showBottomLine && (
        <Box sx={{ width: '2px', height: '20px', backgroundColor: '#3665B7' }} />
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
    upsertWorkflow,
    isWorkflowDetailLoading,
  } = useContext(WorkflowContext);

  const [actions, setActions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [targetIndex, setTargetIndex] = useState(null);
  const [editingAction, setEditingAction] = useState(null);
  const [workflowTitle, setWorkflowTitle] = useState('');

  useEffect(() => {
    const loadWorkflow = async () => {
      if (isNew) {
        setSelectedWorkflow(null);
        setWorkflowTitle('');
        setActions([createTriggerAction('1', 'トリガー')]);
      } else if (workflowId) {
        try {
          const workflow = await fetchWorkflowById(workflowId);
          if (workflow) {
            setSelectedWorkflow(workflow);
            setWorkflowTitle(workflow.workflowName);
            setActions(workflow.workflowActions || []);
          }
        } catch (error) {
          console.error('Error loading workflow:', error);
          // エラー処理を追加することをお勧めします
        }

        // モックデータ（開発用参照として保持）
        /*
        const mockWorkflow = {
          workflowId,
          workflowName: `MockName-${workflowId}`,
          workflowStatus: 'open',
          workflowCreatedAt: new Date().toISOString().split('T')[0],
          workflowTrigger: { triggerType: 'manual' },
          workflowActions: [
            createTriggerAction('1', 'トリガー'),
            createAction('2', 'データ処理アクション'),
            createAction('3', '完了通知アクション'),
          ],
        };
        */
      }
    };

    loadWorkflow();
  }, [workflowId, isNew, setSelectedWorkflow]);

  const handleEditTriggerModal = (action, index) => {
    setTargetIndex(index);
    setEditingAction(action);
    setIsTriggerModalOpen(true);
  };

  const handleTriggerModalClose = () => {
    setIsTriggerModalOpen(false);
    setEditingAction(null);
    setTargetIndex(null);
  };

  const handleTriggerModalSave = async (newActionData) => {
    newActionData.actionType = 'trigger';
    newActionData.actionCategory = 'manual';
    let updatedActions;
    if (editingAction) {
      updatedActions = actions.map((a) =>
        a.actionId === editingAction.actionId ? { ...a, ...newActionData } : a
      );
    } else {
      updatedActions = [...actions];
      updatedActions.splice(targetIndex + 1, 0, newActionData);
    }
    setActions(updatedActions);
    handleTriggerModalClose();

    // 更新内容でワークフローをアップサート
    const updatedWorkflow = {
      ...selectedWorkflow,
      workflowId: selectedWorkflow?.workflowId || new Date().getTime().toString(),
      workflowName: workflowTitle,
      workflowStatus: selectedWorkflow?.workflowStatus || 'draft',
      workflowCreatedAt: selectedWorkflow?.workflowCreatedAt || new Date().toISOString().split('T')[0],
      workflowActions: updatedActions,
      workflowTrigger: selectedWorkflow?.workflowTrigger || { triggerType: 'manual' }
    };

    try {
      const updatedWorkflowResult = await upsertWorkflow(updatedWorkflow);
      console.log('Workflow upserted successfully:', updatedWorkflowResult);
      setSelectedWorkflow(updatedWorkflowResult);
    } catch (error) {
      console.error('Error upserting workflow:', error);
    }
  };

  const handleAddActionModal = (index) => {
    setTargetIndex(index);
    setEditingAction(null);
    setIsModalOpen(true);
  };

  const handleEditActionModal = (action, index) => {
    setTargetIndex(index);
    setEditingAction(action);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAction(null);
    setTargetIndex(null);
  };

  const handleModalSave = async (newActionData) => {
    // 更新後のアクションリストを構築
    let updatedActions;
    if (editingAction) {
      updatedActions = actions.map((a) =>
        a.actionId === editingAction.actionId ? { ...a, ...newActionData } : a
      );
    } else {
      updatedActions = [...actions];
      updatedActions.splice(targetIndex + 1, 0, newActionData);
    }
    setActions(updatedActions);
    handleModalClose();

    // 更新内容でワークフローをアップサート
    const updatedWorkflow = {
      ...selectedWorkflow,
      workflowId: selectedWorkflow?.workflowId || new Date().getTime().toString(),
      workflowName: workflowTitle,
      workflowStatus: selectedWorkflow?.workflowStatus || 'draft',
      workflowCreatedAt: selectedWorkflow?.workflowCreatedAt || new Date().toISOString().split('T')[0],
      workflowActions: updatedActions,
      workflowTrigger: selectedWorkflow?.workflowTrigger || { triggerType: 'manual' }
    };

    try {
      const updatedWorkflowResult = await upsertWorkflow(updatedWorkflow);
      console.log('Workflow upserted successfully:', updatedWorkflowResult);
      setSelectedWorkflow(updatedWorkflowResult);
    } catch (error) {
      console.error('Error upserting workflow:', error);
    }
  };

  //現時点ではワークフローのタイトルの更新時のみ実行される
  const handleWorkflowUpdate = async (newTitle) => {
    const updatedWorkflow = {
      ...selectedWorkflow,
      workflowId: selectedWorkflow?.workflowId || new Date().getTime().toString(),
      workflowName: newTitle,
      workflowStatus: selectedWorkflow?.workflowStatus || 'draft',
      workflowCreatedAt: selectedWorkflow?.workflowCreatedAt || new Date().toISOString().split('T')[0],
      workflowActions: actions
    };
    try {
      const updatedWorkflowResult = await upsertWorkflow(updatedWorkflow);
      console.log('Workflow upserted successfully:', updatedWorkflowResult);
      setSelectedWorkflow(updatedWorkflowResult);
    } catch (error) {
      console.error('Error upserting workflow:', error);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setWorkflowTitle(newTitle);
  };

  const handleTitleBlur = () => {
    handleWorkflowUpdate(workflowTitle);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();  // フォーカスを外す
      handleWorkflowUpdate(workflowTitle);
    }
  };

  const handleDeleteAction = (actionId) => {
    const newActions = actions.filter((a) => a.actionId !== actionId);
    setActions(newActions);
  };

  if (isWorkflowDetailLoading) {
    return <Typography>読み込み中...</Typography>;
  }

  return (
    // ここを <Container> でラップ（sx で独自のスタイルも可）
    <Container
      maxWidth="xl"
      sx={{ mt: 12, mb: 12, ml: 4, mr: 4 }} // 上下マージンを適宜
    >
      {/* タイトル */}
      <Box sx={{ mb: 6 }}>
        <TextField
          value={workflowTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          variant="standard"
          InputProps={{ 
            sx: {
              fontSize: '1.5rem',
            },
          }}
          fullWidth
          placeholder="新規ワークフロー"
        />
      </Box>

      {/* 白い背景のコンテナ */}
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          pt: 2,
          mt: 0,
        }}
      >
        {/* 保存ボタン */}
        <Box sx={{ mb: 2 , ml: 4}}>
          <Button variant="contained">
            ワークフロー起動
          </Button>
        </Box>

        {/* グレーの背景でアクションを囲む */}
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            borderRadius: '8px',
            p: 4,
            minHeight: '400px',
          }}
        >
          {actions.map((action, index) => {
            const isLast = index === actions.length - 1;
            return (
              <React.Fragment key={action.actionId}>
                <Card
                  sx={{
                    mb: 0.5,
                    mt: 0,
                    cursor: 'pointer',
                    position: 'relative',
                    minHeight: '80px',
                    width: '30%',
                    '&:hover': {
                      boxShadow: 1,
                    },
                  }}
                >
                  <CardContent 
                    onClick={() =>
                      action.actionType === 'trigger'
                        ? null //handleEditTriggerModal(action, index)
                        : handleEditActionModal(action, index)
                    }
                  >
                    <Typography variant="subtitle1">{action.actionName}</Typography>
                    {action.actionType !== 'trigger' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('このアクションを削除してもよろしいですか？')) {
                            handleDeleteAction(action.actionId);
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" color="action" />
                      </Box>
                    )}
                  </CardContent>
                </Card>
                <Connector
                  onClick={() => handleAddActionModal(index)}
                  showTopLine={true}
                  showBottomLine={!isLast}
                  sx={{ mr: 'calc(70%)' }}
                />
              </React.Fragment>
            );
          })}
        </Box>
      </Box>

      <ActionModal
        open={isModalOpen}
        action={editingAction}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />
      <TriggerModal
        open={isTriggerModalOpen}
        action={editingAction}
        onClose={handleTriggerModalClose}
        onSave={handleTriggerModalSave}
      />
    </Container>
  );
}
