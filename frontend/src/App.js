import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Body from './components/Body';
import WorkflowEditor from './components/WorkflowEditor';
import { WorkflowProvider } from './contexts/WorkflowContext';

function App() {
  return (
    <Router>
      <WorkflowProvider>
        <Box sx={{ display: 'flex' }}>
        <Header />
        <Sidebar />
        <Routes>    
            <Route path="/" element={<Body />} />
            <Route path="/workflow/new" element={<WorkflowEditor isNew={true} />} />
            <Route path="/workflow/:id" element={<WorkflowEditor isNew={false} />} />
        </Routes>
        </Box>
      </WorkflowProvider>
    </Router>
  );
}

export default App; 