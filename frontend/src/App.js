import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Body from './components/Body';
import WorkflowEditor from './components/WorkflowEditor';

function App() {
  return (
    <Router>
        <Box sx={{ display: 'flex' }}>
        <Header />
        <Sidebar />
        <Routes>    
            <Route path="/" element={<Body />} />
            <Route path="/workflow/new" element={<WorkflowEditor />} />
            <Route path="/workflow/:id" element={<WorkflowEditor />} />
        </Routes>
        </Box>
    </Router>
  );
}

export default App; 