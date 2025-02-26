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

  // actionの変更を監視して初期状態をセット
  useEffect(() => {
    if (!action) {
      // 新規モードの初期値
      setStage(1);
      setSelectedOperation('');
      setSelectedApp('');
      setTempActionName('');
      setTempConfig({});
    } else {
      // 既存ステップ編集モード
      setStage(2);
      if (action.actionType === 'operation') {
        const foundOperation = operationList.find(op => 
          op.operationCategory === action.actionCategory
        );
        setSelectedOperation(foundOperation || '');
        setSelectedApp('');
      } else {
        const foundApp = appList.find(app => 
          app.appCategory === action.actionCategory
        );
        setSelectedOperation('');
        setSelectedApp(foundApp || '');
      }
      setTempActionName(action.actionName || '');
      setTempConfig(action.actionConfig || {});
    }
  }, [action]);

  // モーダルが閉じられたときの状態リセット
  /*
  useEffect(() => {
    let timeoutId;
    if (!open) {
      // 他の状態は即座にリセット
      setSelectedOperation('');
      setSelectedApp('');
      setTempActionName('');
      setTempConfig({});
      
      // stageの変更のみ遅延させる
      timeoutId = setTimeout(() => {
        setStage(1);
      }, 100);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [open]);
  */

  // アクション一覧
  const operationList = [
    {
      operationName: "OCR読み取り",
      operationCategory: "OCR",
      apiURL: "http://localhost:8000/api/operation/ocr"
    },
    {
      operationName: "音声文字起こし",
      operationCategory: "transcribe",
      apiURL: "http://localhost:8000/api/operation/transcribe"
    },
    {
      operationName: "文書からテキスト抽出",
      operationCategory: "textExtraction",
      apiURL: "http://localhost:8000/api/operation/textExtraction"
    },
    {
      operationName: "要約",
      operationCategory: "summarize",
      apiURL: "http://localhost:8000/api/operation/summarize"
    },
    {
      operationName: "翻訳",
      operationCategory: "translate",
      apiURL: "http://localhost:8000/api/operation/translate"
    }
  ];

  // アプリ一覧
  const appList = [
    {
      appName: "Gmail",
      appCategory: "Gmail",
      apiURL: "http://localhost:8000/api/app/gmail"
    },
    {
      appName: "Google Drive",
      appCategory: "Google Drive",
      apiURL: "http://localhost:8000/api/app/googleDrive"
    },
    {
      appName: "Google Calendar",
      appCategory: "Google Calendar",
      apiURL: "http://localhost:8000/api/app/googleCalendar"
    },
    {
      appName: "Google Docs",
      appCategory: "Google Docs",
      apiURL: "http://localhost:8000/api/app/googleDocs"
    },
    {
      appName: "Salesforce",
      appCategory: "Salesforce",
      apiURL: "http://localhost:8000/api/app/salesforce"
    }
  ];

  // アクションorアプリを選択すると stage2 へ
  const handleSelectOperation = (operation) => {
    setSelectedOperation(operation);
    setStage(2); 
  };
  const handleSelectApp = (app) => {
    setSelectedApp(app);
    setStage(2);
  };

  const handleClose = () => {
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
    const updatedAction = {
      actionId: action?.actionId || new Date().getTime().toString(),
      actionName: tempActionName || '新アクション',
      actionType: selectedOperation ? 'operation' : 'app',
      actionCategory: selectedOperation
        ? selectedOperation.operationCategory
        : selectedApp.appCategory,
      actionStatus: action?.actionStatus || 'draft',
      actionCreatedAt: action?.actionCreatedAt || new Date().toISOString().split('T')[0],
      actionAPI: selectedOperation ? selectedOperation.apiURL : selectedApp.apiURL,
      outputURL: action?.outputURL || '',
      actionConfig: tempConfig,
    };
    onSave(updatedAction);
  };

  // stage=2 のレンダリング部分に追加するため、一例として「getSelectedConfigComponent」を定義
  function getSelectedConfigComponent(operation, app) {
    const opCategory = operation ? operation.operationCategory : '';
    const appCategory = app ? app.appCategory : '';
    
    // まずアクション用マップで探す
    const FoundOperationComponent = operationConfigMap[opCategory] || null;
    if (FoundOperationComponent) {
      return FoundOperationComponent;
    }
    // 見つからなかった場合はアプリ用マップを探す
    const FoundAppComponent = appConfigMap[appCategory] || null;
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
              {operationList.map((operation) => (
                <ListItem key={operation.operationName} disablePadding>
                  <ListItemButton onClick={() => handleSelectOperation(operation)}>
                    <ListItemText primary={operation.operationName} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Typography variant="subtitle1">アプリ</Typography>
            <List>
              {appList.map((app) => (
                <ListItem key={app.appName} disablePadding>
                  <ListItemButton onClick={() => handleSelectApp(app)}>
                    <ListItemText primary={app.appName} />
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