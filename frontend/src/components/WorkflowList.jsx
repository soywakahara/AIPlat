import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

/**
 * ワークフロー一覧を表示するコンポーネント。
 * 今は仮のデータを使い、後でフェッチ処理を追加予定。
 */

// 仮のモックデータ
const mockWorkflows = [
  { id: 'wf001', name: 'ワークフローA', status: 'open', createdAt: '2024-07-01' },
  { id: 'wf002', name: 'ワークフローB', status: 'closed', createdAt: '2024-07-02' },
  { id: 'wf003', name: 'ワークフローC', status: 'open', createdAt: '2024-07-03' },
];

export default function WorkflowList({ statusFilter }) {
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    // TODO: fetch from backend
    // e.g. fetch('/api/workflows') 
    //   .then(res => res.json())
    //   .then(data => setWorkflows(data))
    //   .catch(err => console.error(err));

    // 今はモックデータに絞り込みして設定
    const filtered = mockWorkflows.filter(
      (wf) => statusFilter === 'all' || wf.status === statusFilter
    );
    setWorkflows(filtered);
  }, [statusFilter]);

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
        {workflows.map((wf) => (
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
