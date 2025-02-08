import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';

export default function TriggerModal({ open, action, onClose, onSave }) {
  const triggerOptions = ['手動起動', 'Webhook', 'スケジュール'];
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [tempTriggerName, setTempTriggerName] = useState('');
  const [tempConfig, setTempConfig] = useState({});

  useEffect(() => {
    // Always start at "stage 1" for trigger actions
    if (!action) {
      setSelectedTrigger('');
      setTempTriggerName('');
      setTempConfig({});
    } else {
      // For editing trigger action, always reset selection (stage1)
      setSelectedTrigger('');
      setTempTriggerName(action.actionName || '');
      setTempConfig(action.actionConfig || {});
    }
  }, [action, open]);

  const handleSelectTrigger = (option) => {
    setSelectedTrigger(option);
    // Store the selection in the configuration
    setTempConfig({ triggerType: option });
    // Optionally, set the trigger name if empty
    if (!tempTriggerName) {
      setTempTriggerName(option);
    }
  };

  const handleSave = () => {
    const updatedAction = {
      actionId: action?.actionId || new Date().getTime().toString(),
      actionName: tempTriggerName || 'トリガー',
      actionType: 'trigger', // ensure trigger type
      actionCategory: 'manual', // fixed category for trigger actions
      actionStatus: action?.actionStatus || 'draft',
      actionCreatedAt: action?.actionCreatedAt || new Date().toISOString().split('T')[0],
      actionAPI: action?.actionAPI || '',
      outputURL: action?.outputURL || '',
      actionConfig: tempConfig,
    };
    onSave(updatedAction);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>トリガー設定</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 1 }}>
          トリガーのタイプを選択してください
        </Typography>
        <List>
          {triggerOptions.map((option) => (
            <ListItem key={option} disablePadding>
              <ListItemButton onClick={() => handleSelectTrigger(option)}>
                <ListItemText primary={option} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <TextField 
          label="トリガー名" 
          value={tempTriggerName} 
          onChange={(e) => setTempTriggerName(e.target.value)} 
          fullWidth
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
        <Button onClick={handleSave} variant="contained">
          決定
        </Button>
      </DialogActions>
    </Dialog>
  );
} 