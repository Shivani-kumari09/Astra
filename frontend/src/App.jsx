import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import RequireAuth from './components/RequireAuth';
import Emergency from './pages/Emergency';
import Helplines from './pages/Helplines';
import Home from './pages/Home';
import Login from './pages/Login';
import Resources from './pages/Resources';
import RoutesPage from './pages/RoutesPage';
import Signup from './pages/Signup';
import Sos from './pages/Sos';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/sos" element={<Sos />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/helplines" element={<Helplines />} />
          <Route path="/emergency" element={<Emergency />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
