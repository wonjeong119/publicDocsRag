import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnalyzePage from './pages/AnalyzePage';
import ResultPage from './pages/ResultPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-main">
        <Routes>
          <Route path="/" element={<AnalyzePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/ResultPage" element={<ResultPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
