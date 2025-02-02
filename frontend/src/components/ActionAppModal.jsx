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
import CSVOperationConfig from './config/operations/CSVOperationConfig';
//import OcrReadingConfig from './config/actions/OcrReadingConfig';
import { operationConfigMap, appConfigMap } from './config/configMap';
  
/**
 * 2段階:
 *   stage=1: アクション/アプリ選択画面
 *   stage=2: 設定フォーム
 */
export default function ActionAppModal({ open, action, onClose, onSave }) {
  // stage=1 or 2
  const [stage, setStage] = useState(1);
  // 選択されたアクション/アプリ
  const [selectedOperation, setSelectedOperation] = useState('');
  const [selectedApp, setSelectedApp] = useState('');

  useEffect(() => {
    if (!action) {
      // 新規モードの初期値
      setStage(1);
      setSelectedOperation('');
      setSelectedApp('');
    } else {
      // 既存ステップ編集モード: すでに operation/app があればセット
      setStage(2); // 既にどれかが選択済みと仮定して2ページ目を開く
      setSelectedOperation(action.operation || '');
      setSelectedApp(action.app || '');
    }
  }, [action]);

  // アクション一覧 (仮)
  const operationList = [
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
  const handleSelectOperation = (operationName) => {
    setSelectedOperation(operationName);
    setStage(2); 
  };
  const handleSelectApp = (appName) => {
    setSelectedApp(appName);
    setStage(2);
  };

  const handleClose = () => {
    // 全ての状態をリセット
    setStage(1);
    setSelectedOperation('');
    setSelectedApp('');
    onClose();
  };

  const handleBack = () => {
    setStage(1);
    setSelectedOperation('');
    setSelectedApp('');
  };

  const handleSave = () => {
    // 最終的に新ステップor更新ステップの情報を親に返す
    const updatedAction = {
      id: action?.id || new Date().getTime().toString(), // step → action
      name: action?.name || '新アクション', // step → action, '新ステップ' → '新アクション'
      operation: selectedOperation,
      app: selectedApp,
      config: action?.config || {}, // step → action
    };
    onSave(updatedAction);
    setStage(1); // 保存後にモーダルを閉じてリセット
  };

  // stage=2 のレンダリング部分に追加するため、一例として「getSelectedConfigComponent」を定義
  function getSelectedConfigComponent(operation, app) {
    // まずアクション用マップで探す
    const FoundOperationComponent = operationConfigMap[operation] || null;
    if (FoundOperationComponent) {
      return FoundOperationComponent;
    }
    // 見つからなかった場合はアプリ用マップを探す（必要に応じて順番を逆にしたり、お好みで調整）
    const FoundAppComponent = appConfigMap[app] || null;
    return FoundAppComponent;
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      {stage === 1 && (
        <>
          <DialogTitle>オペレーションまたはアプリを選択</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" sx={{ mb: 1 }}>
              どちらかを選んでください
            </Typography>
            <Typography variant="subtitle1">オペレーション</Typography>
            <List>
              {operationList.map((operationName) => (
                <ListItem key={operationName} disablePadding>
                  <ListItemButton onClick={() => handleSelectOperation(operationName)}>
                    <ListItemText primary={operationName} />
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
              選択したオペレーション/アプリに対して必要な設定を行ってください。
            </Typography>
            <TextField
              label="アクション名"
              defaultValue={action?.name || ''}
              onChange={(e) => {
                if (action) action.name = e.target.value;
              }}
              fullWidth
              sx={{ mb: 2 }}
            />
            {(() => {
              const SelectedConfigComponent = getSelectedConfigComponent(selectedOperation, selectedApp);
              return SelectedConfigComponent ? (
                <SelectedConfigComponent
                  config={action?.config || {}}
                  setConfig={(newConfig) => {
                    if (action) action.config = newConfig;
                  }}
                />
              ) : null;
            })()}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBack} color="inherit">
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
