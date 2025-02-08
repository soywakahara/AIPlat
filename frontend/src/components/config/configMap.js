import CSVOperationConfig from './operations/CSVOperationConfig';
//import OcrReadingConfig from './actions/OcrReadingConfig';
// import GmailConfig from './apps/GmailConfig'; など必要に応じて追加

export const operationConfigMap = {
  'CSV操作': CSVOperationConfig,
  //'OCR読み取り': OcrReadingConfig,
  // 他のアクションも追加
};

export const appConfigMap = {
  'Gmail': null, // 例: Gmail用のコンポーネントを作成次第設定してください
  'Salesforce': null,
  // 他のアプリも追加
}; 