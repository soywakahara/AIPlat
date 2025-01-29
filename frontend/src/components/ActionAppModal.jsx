// ActionAppModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  TextField, 
  List, 
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
  
/**
 * 2段階:
 *   stage=1: アクション/アプリ選択画面
 *   stage=2: 設定フォーム
 */
export default function ActionAppModal({ open, step, onClose, onSave }) {
  // stage=1 or 2
  const [stage, setStage] = useState(1);
  // 選択されたアクション/アプリ
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedApp, setSelectedApp] = useState('');

  // ステップ名や設定
  const [stepName, setStepName] = useState('');
  const [configOption, setConfigOption] = useState(''); // 仮の設定項目

  useEffect(() => {
    if (!step) {
      // 新規モードの初期値
      setStage(1);
      setSelectedAction('');
      setSelectedApp('');
      setStepName('');
      setConfigOption('');
    } else {
      // 既存ステップ編集モード: すでに action/app/config があればセット
      setStage(2); // 既にどれかが選択済みと仮定して2ページ目を開く
      setSelectedAction(step.action || '');
      setSelectedApp(step.app || '');
      setStepName(step.name || '');
      setConfigOption(step.config?.option || '');
    }
  }, [step]);

  // アクション一覧 (仮)
  const actionList = [
    'CSV操作',
    'メール送信',
    'AI解析',
    'Slack投稿',
    'Webhook呼び出し'
  ];
  // アプリ一覧 (仮)
  const appList = [
    'Google Sheets',
    'Salesforce',
    'Stripe',
    'Gmail',
  ];

  // アクションorアプリを選択すると stage2 へ
  const handleSelectAction = (actionName) => {
    setSelectedAction(actionName);
    setStage(2); 
  };
  const handleSelectApp = (appName) => {
    setSelectedApp(appName);
    setStage(2);
  };

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    // 最終的に新ステップor更新ステップの情報を親に返す
    const updatedStep = {
      id: step?.id || new Date().getTime().toString(), // 新規の場合は適当に一意ID
      name: stepName || '新ステップ',
      action: selectedAction,
      app: selectedApp,
      config: {
        option: configOption,
        // 他に必要な設定をここに
      },
    };
    onSave(updatedStep);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      {stage === 1 && (
        <>
          <DialogTitle>アクションまたはアプリを選択</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" sx={{ mb: 1 }}>
              どちらかを選んでください
            </Typography>
            <Typography variant="subtitle1">アクション</Typography>
            <List>
              {actionList.map((actionName) => (
                <ListItem key={actionName} disablePadding>
                  <ListItemButton onClick={() => handleSelectAction(actionName)}>
                    <ListItemText primary={actionName} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Typography variant="subtitle1">アプリ</Typography>
            <List>
              {appList.map((appName) => (
                <ListItem key={appName} disablePadding>
                  <ListItemButton onClick={() => handleSelectApp(appName)}>
                    <ListItemText primary={appName} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>閉じる</Button>
          </DialogActions>
        </>
      )}

      {stage === 2 && (
        <>
          <DialogTitle>設定画面</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" sx={{ mb: 1 }}>
              選択したアクション/アプリに対して必要な設定を行ってください。
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              アクション: {selectedAction || 'なし'}, アプリ: {selectedApp || 'なし'}
            </Typography>
            <TextField
              label="ステップ名"
              value={stepName}
              onChange={(e) => setStepName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="オプション"
              value={configOption}
              onChange={(e) => setConfigOption(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStage(1)} color="inherit">
              戻る
            </Button>
            <Button onClick={handleSave} variant="contained">
              決定
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
