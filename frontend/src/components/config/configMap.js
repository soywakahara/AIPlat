import CSVOperationConfig from './operations/CSVOperationConfig';
//import OcrReadingConfig from './actions/OcrReadingConfig';
// import GmailConfig from './apps/GmailConfig'; など必要に応じて追加

export const operationConfigMap = {
  'OCR': CSVOperationConfig,
  '文字起こし': CSVOperationConfig,
  'テキスト抽出': CSVOperationConfig,
  '要約': CSVOperationConfig,
  '翻訳': CSVOperationConfig,
  //'OCR読み取り': OcrReadingConfig,
  // 他のアクションも追加
};

export const appConfigMap = {
  'Gmail': null, // 例: Gmail用のコンポーネントを作成次第設定してください
  'Salesforce': null,
  'Google Drive': null,
  'Google Calendar': null,
  'Google Docs': null,
  // 他のアプリも追加
}; 