import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import DoctorDashboard from './components/dashboard/DoctorDashboard';
import PatientsPage from './components/doctor/PatientsPage';
import AppointmentsPage from './components/doctor/AppointmentsPage';
import DoctorTasksPage from './components/doctor/DoctorTasksPage';
import NurseDashboard from './components/nurse/NurseDashboard';
import NurseTasksPage from './components/nurse/NurseTasksPage';
import AdminDashboard from './components/admin/AdminDashboard';
import DoctorLogin from './components/auth/DoctorLogin';
import NurseLogin from './components/auth/NurseLogin';
import AdminLogin from './components/auth/AdminLogin';
import NurseNotesPage from './components/nurse/NurseNotesPage';
import NurseSchedulePage from './components/nurse/NurseSchedulePage';
import NursePatientsPage from './components/nurse/NursePatientsPage';
import AdminAnalyticsPage from './components/admin/AdminAnalyticsPage';
import AdminPatientsPage from './components/admin/AdminPatientsPage';
import AdminAppointmentsPage from './components/admin/AdminAppointmentsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/patients" element={<PatientsPage />} />
        <Route path="/doctor/appointments" element={<AppointmentsPage />} />
        <Route path="/doctor/tasks" element={<DoctorTasksPage />} />
        <Route path="/nurse" element={<NurseDashboard />} />
        <Route path="/nurse/tasks" element={<NurseTasksPage />} />
        <Route path="/nurse/notes" element={<NurseNotesPage />} />
        <Route path="/nurse/schedule" element={<NurseSchedulePage />} />
        <Route path="/nurse/patients" element={<NursePatientsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        <Route path="/admin/patients" element={<AdminPatientsPage />} />
        <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
        <Route path="/login/doctor" element={<DoctorLogin />} />
        <Route path="/login/nurse" element={<NurseLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;