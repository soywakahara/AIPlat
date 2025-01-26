import React, { useContext } from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { WorkflowContext } from '../contexts/WorkflowContext';

/**
 * ワークフロー一覧を表示するコンポーネント。
 * 今は仮のデータを使い、後でフェッチ処理を追加予定。
 */

export default function WorkflowList({ statusFilter }) {
  const { workflows, workflowsFetchError, isWorkflowsFetching } = useContext(WorkflowContext);

  // ステータスでフィルタリング
  const filteredWorkflows = workflows.filter(
    (wf) => statusFilter === 'all' || wf.status === statusFilter
  );

  if (isWorkflowsFetching) {
    return <Typography>読み込み中...</Typography>;
  }

  if (workflowsFetchError) {
    return <Typography color="error">{workflowsFetchError}</Typography>;
  }

  return (
    <Box>
      {/* Link を使用せず、onClick で navigate を使用 */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/workflow/new"
          sx={{ /*backgroundColor: '#FF925B' */ }}
        >
          新規作成
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredWorkflows.map((wf) => (
          <Card key={wf.id} variant="outlined">
            <CardContent>
              <Typography variant="h6">{wf.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {wf.id}, status: {wf.status}, createdAt: {wf.createdAt}
              </Typography>
              <Button 
                variant="contained" 
                component={Link}
                to={`/workflow/${wf.id}`}
                sx={{ mt: 1, /*backgroundColor: '#FF925B' */ }}
              >
                詳細を開く
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
