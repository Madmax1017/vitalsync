import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import DoctorDashboard from './components/dashboard/DoctorDashboard';
import NurseDashboard from './components/nurse/NurseDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/nurse-dashboard" element={<NurseDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;