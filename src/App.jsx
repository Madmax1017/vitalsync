import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import DoctorDashboard from './components/dashboard/DoctorDashboard';
import NurseDashboard from './components/nurse/NurseDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/nurse-dashboard" element={<NurseDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;