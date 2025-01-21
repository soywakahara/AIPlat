import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Tab from '@mui/material/Tab';
import WorkflowList from './WorkflowList';

export default function WorkflowTabs() {
  const [tabValue, setTabValue] = useState('1');
  const [status, setStatus] = useState('all');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange}>
            <Tab label="フロー" value="1" />
            <Tab label="フォルダ" value="2" />
          </TabList>
        </Box>

        <TabPanel value="1">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="status-select-label">ステータス</InputLabel>
              <Select
                labelId="status-select-label"
                value={status}
                label="ステータス"
                onChange={handleStatusChange}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <WorkflowList statusFilter={status} />
        </TabPanel>

        <TabPanel value="2">
          <Box>フォルダ機能等をここで表示 (TODO)</Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
