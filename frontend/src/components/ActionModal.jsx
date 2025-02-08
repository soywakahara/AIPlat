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
export default function ActionModal({ open, action, onClose, onSave }) {
  // stage=1 or 2
  const [stage, setStage] = useState(1);
  // 選択されたアクション/アプリ
  const [selectedOperation, setSelectedOperation] = useState('');
  const [selectedApp, setSelectedApp] = useState('');
  // 一時的な編集状態を管理
  const [tempActionName, setTempActionName] = useState('');
  const [tempConfig, setTempConfig] = useState({});

  useEffect(() => {
    if (!action) {
      // 新規モードの初期値
      setStage(1);
      setSelectedOperation('');
      setSelectedApp('');
      setTempActionName('');
      setTempConfig({});
    } else {
      // 既存ステップ編集モード: actionType に応じて actionCategory の値をセット
      setStage(2); // 既にどれかが選択済みと仮定して2ページ目を開く
      if (action.actionType === 'operation') {
        setSelectedOperation(action.actionCategory);
        setSelectedApp('');
      } else {
        setSelectedOperation('');
        setSelectedApp(action.actionCategory);
      }
      setTempActionName(action.actionName || '');
      setTempConfig(action.actionConfig || {});
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
    setSelectedOperation('');
    setSelectedApp('');
    setTempActionName('');
    setTempConfig({});
    onClose();
    setStage(1);
  };

  const handleBack = () => {
    setStage(1);
    setSelectedOperation('');
    setSelectedApp('');
    // 戻るボタンを押しても一時的な設定は保持
  };

  const handleSave = () => {
    // 保存用のデータを親に返すときも sampleWorkflowData.json に準拠
    const updatedAction = {
      // 既存のアクションがあればそれを使い、新規なら適当IDを生成
      actionId: action?.actionId || new Date().getTime().toString(),
      actionName: tempActionName || '新アクション',
      actionType: selectedOperation ? 'operation' : 'app',
      actionCategory: selectedOperation ? selectedOperation : selectedApp,
      actionStatus: action?.actionStatus || 'draft',
      actionCreatedAt: action?.actionCreatedAt || new Date().toISOString().split('T')[0],
      actionAPI: action?.actionAPI || '',
      outputURL: action?.outputURL || '',
      actionConfig: tempConfig,  // 一時的な設定を保存時に反映
    };
    onSave(updatedAction);
    setStage(1);
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
              label="アクション名 (actionName)"
              value={tempActionName}  // 一時的な状態を使用
              onChange={(e) => setTempActionName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            {(() => {
              const SelectedConfigComponent = getSelectedConfigComponent(
                // ここでは selectedOperation = actionType に相当
                selectedOperation,
                selectedApp
              );
              return SelectedConfigComponent ? (
                <SelectedConfigComponent
                  config={tempConfig}  // 一時的な設定を渡す
                  setConfig={setTempConfig}  // 一時的な設定を更新
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