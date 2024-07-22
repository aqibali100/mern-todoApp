import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import UserLayout from './components/UserLayout';
import AdminLayout from './Admin/AdminLayout';
import { useSelector } from 'react-redux';

function App() {
  const { user } = useSelector(state => state.auth);

  const isAdmin = user && user.role === 'admin';

  return (
    <Router>
      {isAdmin ? <AdminLayout /> : <UserLayout />}
    </Router>
  );
}

export default App;
