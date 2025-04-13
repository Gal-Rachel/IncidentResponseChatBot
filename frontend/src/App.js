import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatPage from './Component/ChatPage/ChatPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />

      </Routes>
    </Router>
  );
}

export default App;
