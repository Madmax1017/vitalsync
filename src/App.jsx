import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import DoctorDashboard from './components/dashboard/DoctorDashboard';
import PatientsPage from './components/doctor/PatientsPage';
import NurseDashboard from './components/nurse/NurseDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import DoctorLogin from './components/auth/DoctorLogin';
import NurseLogin from './components/auth/NurseLogin';
import AdminLogin from './components/auth/AdminLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/patients" element={<PatientsPage />} />
        <Route path="/nurse" element={<NurseDashboard />} />
        <Route
          path="/admin"
          element={(
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          )}
        />
        <Route path="/login/doctor" element={<DoctorLogin />} />
        <Route path="/login/nurse" element={<NurseLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;