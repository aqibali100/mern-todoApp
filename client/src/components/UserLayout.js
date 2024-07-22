import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout, setProfilePic } from '../features/AuthSlice.js';
import AddTodo from './AddTodo.js';
import ViewTodos from './ViewTodos.js';
import ViewTodo from './ViewTodo.js';
import Profile from './Profile.js';
import Insights from './Insights.js';
import UpdateTodo from './UpdateTodo.js';
import EditProfile from './EditProfile.js';
import ForgotPassword from './ForgotPassword.js';
import '../CssFiles/UserDashBoard.css';
import UserDashboard2 from './UserDashBoard.js';
import defaultProfilePic from '../images/no-user.webp';
import axios from 'axios';
import LoginPage from './LoginPage.js';
import NotFound from './NotFound.js';

function UserLayout() {
  const [profilePic, setProfilePicLocal] = useState(defaultProfilePic);
  const token = localStorage.getItem('token');
  const [open1, setOpen1] = useState(false);
  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleMenuClick = () => {
    if (sidebarRef.current && mainContentRef.current) {
      sidebarRef.current.classList.toggle('active');
      mainContentRef.current.classList.toggle('active');
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    setOpen1(true);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    navigate('/');
    setOpen1(false);
  };

  const handleClose = () => {
    setOpen1(false);
  };

  const fetchProfilePic = async () => {
    try {
      const res = await axios.get('http://localhost:5000/GetProfilePic', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data && res.data.imageUrl) {
        setProfilePicLocal(res.data.imageUrl);
        dispatch(setProfilePic(res.data.imageUrl));
      }
    } catch (error) { }
  };

  useEffect(() => {
    fetchProfilePic();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const location = useLocation();
  const isViewTodosActive = location.pathname === '/view_todos';

  const noHeaderSidebarPaths = ['/', '/forgot_password'];
  const shouldHideHeaderSidebar = noHeaderSidebarPaths.includes(location.pathname);

  return (
    <>
      <div>
        {!shouldHideHeaderSidebar && (
          <section className="header">
            <div className="logo">
              <i className="ri-menu-line icon icon-0 menu" onClick={handleMenuClick} aria-label="Toggle Menu"></i>
              <h2>
                ToDo<span>App</span>
              </h2>
            </div>
            <div className="search--notification--profile">
              <div className="search-3">
                {isViewTodosActive && (
                  <>
                  <input
                    type="text"
                    placeholder="Search Schedule.."
                    aria-label="Search Schedule"
                    value={search}
                    onChange={handleSearchChange}
                  />
                  <button>
                    <i className="ri-search-2-line"></i>
                  </button>
                  </>
                )}
              </div>
              <div className="notification--profile">
                <div className="picon bell" title="Notification">
                  <i className="ri-lock-line"></i>
                </div>
                <div className="picon chat" title="Messages">
                  <i className="ri-wechat-2-line"></i>
                </div>
                <div className="picon profile" title="Profile">
                  <img src={profilePic} alt="Profile" />
                </div>
              </div>
            </div>
          </section>
        )}
        <section className={`main ${shouldHideHeaderSidebar ? 'full-screen' : ''}`} ref={mainContentRef}>
          {!shouldHideHeaderSidebar && (
            <div className="sidebar" ref={sidebarRef}>
              <ul className="sidebar--items">
                <li>
                  <NavLink to="/user_dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    <span className="icon icon-1">
                      <i className="ri-layout-grid-line"></i>
                    </span>
                    <span className="sidebar--item">Dashboard</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/create_todo" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    <span className="icon icon-2">
                      <i className="ri-calendar-2-line"></i>
                    </span>
                    <span className="sidebar--item">Add Todos</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/view_todos" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    <span className="icon icon-2">
                      <i className="ri-calendar-2-line"></i>
                    </span>
                    <span className="sidebar--item">My Todos</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    <span className="icon icon-3">
                      <i className="ri-user-2-line"></i>
                    </span>
                    <span className="sidebar--item" style={{ whiteSpace: 'nowrap' }}>
                      Profile
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/insights" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    <span className="icon icon-5">
                      <i className="ri-line-chart-line"></i>
                    </span>
                    <span className="sidebar--item">Insights</span>
                  </NavLink>
                </li>
              </ul>
              <ul className="sidebar--bottom-items">
                <li>
                  <NavLink to="/logout" onClick={handleLogout} className={({ isActive }) => (isActive ? 'active-link' : '')}>
                    <span className="icon icon-8">
                      <i className="ri-logout-box-r-line"></i>
                    </span>
                    <span className="sidebar--item">Logout</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
          <div className="main--content">
            <Routes>
              <Route path="/user_dashboard" element={<UserDashboard2 />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<LoginPage />} />
              <Route path="/create_todo" element={<AddTodo />} />
              <Route path="/view_todos" element={<ViewTodos search={search} currentPage={currentPage} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/update_todo/:id" element={<UpdateTodo />} />
              <Route path="/view_todo/:id" element={<ViewTodo />} />
              <Route path="/edit_profile/:id" element={<EditProfile />} />
              <Route path="/forgot_password" element={<ForgotPassword />} />
            </Routes>
          </div>
        </section>
      </div>

      {/* Logout Dialog */}
      <Dialog
        open={open1}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Logout Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="center">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary" autoFocus>
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UserLayout;
