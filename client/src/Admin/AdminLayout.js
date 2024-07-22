import { NavLink, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import '../App.js';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { logout, setProfilePic } from '../features/AuthSlice.js';
import { useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import defaultProfilePic from '../images/no-user.webp';
import axios from 'axios';
import AdminDashBoard from './AdminDashBoard.js';
import AddTodo from './AddTodo.js';
import AllTodos from './AllTodos.js';
import Profile from './Profile.js';
import AddUser from './AddUser.js';
import AllUsers from './AllUsers.js';
import '../CssFiles/DashBoard.css';
import EditProfile from '../components/EditProfile.js';
import ViewTodo from './ViewTodo.js';
import UpdateTodo from './UpdateTodo.js';
import ViewUser from './ViewUser.js';
import UpdateUser from './UpdateUser.js';
import NotFound from '../components/NotFound.js';
import LoginPage from '../components/LoginPage.js';
import ForgotPassword from '../components/ForgotPassword.js';

function AdminLayout() {
    const [profilePic, setProfilePicLocal] = useState(defaultProfilePic);
    const token = localStorage.getItem('token');
    const [open1, setOpen1] = useState(false);
    const sidebarRef = useRef(null);
    const mainContentRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState(new URLSearchParams(location.search).get('search') || '');
    const [currentPage, setCurrentPage] = useState(1);

    // Side Bar Toggle
    const handleMenuClick = () => {
        if (sidebarRef.current && mainContentRef.current) {
            sidebarRef.current.classList.toggle('active');
            mainContentRef.current.classList.toggle('active');
        }
    };

    // Logout Code Here
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

    // Get Profile Pic
    const fetchProfilePic = async () => {
        try {
            const res = await axios.get('http://localhost:5000/GetProfilePic', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (res.data && res.data.imageUrl) {
                setProfilePicLocal(res.data.imageUrl);
                dispatch(setProfilePic(res.data.imageUrl));
            }
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    };
    
    useEffect(() => {
        fetchProfilePic();
    }, []);

    // Search filter
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setCurrentPage(1);
        navigate(`${location.pathname}?search=${value}`);
    };

    return (
        <>
            <section className="header">
                <div className="logo">
                    <i className="ri-menu-line icon icon-0 menu" onClick={handleMenuClick}></i>
                    <h2>Admin<span> Dashboard</span></h2>
                </div>
                <div className="search--notification--profile">
                    <div className="search-1">
                        <input type="text" placeholder="Search Schedule.." value={search}
                            onChange={handleSearchChange} />
                        <button><i className="ri-search-2-line"></i></button>
                    </div>
                    <div className="notification--profile">
                        <div className="picon lock">
                            <i className="ri-lock-line"></i>
                        </div>
                        <div className="picon bell">
                            <i className="ri-notification-2-line"></i>
                        </div>
                        <div className="picon chat">
                            <i className="ri-wechat-2-line"></i>
                        </div>
                        <div className="picon profile">
                            <a href='#'>
                                <img src={profilePic} alt='profile-pic'></img>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section className="main" ref={mainContentRef}>
                <div className="sidebar" ref={sidebarRef}>
                    <ul className="sidebar--items">
                        <li>
                            <NavLink to="/admin_dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <span className="icon icon-1">
                                    <i className="ri-layout-grid-line"></i>
                                </span>
                                <span className="sidebar--item">Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/all_todos" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <span className="icon icon-2">
                                    <i className="ri-calendar-2-line"></i>
                                </span>
                                <span className="sidebar--item">All Todos</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/add-todo" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <span className="icon icon-2">
                                    <i className="ri-calendar-2-line"></i>
                                </span>
                                <span className="sidebar--item">Add Todos</span>
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
                            <NavLink to="/add_user" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <span className="icon icon-3">
                                    <i className="ri-user-2-line"></i>
                                </span>
                                <span className="sidebar--item" style={{ whiteSpace: 'nowrap' }}>
                                    Add User
                                </span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/all_users" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                                <span className="icon icon-3">
                                    <i className="ri-user-2-line"></i>
                                </span>
                                <span className="sidebar--item" style={{ whiteSpace: 'nowrap' }}>
                                    All Users
                                </span>
                            </NavLink>
                        </li>
                    </ul>
                    <ul className="sidebar--bottom-items">
                        <li>
                            <NavLink to="/logout" onClick={handleLogout}>
                                <span className="icon icon-8">
                                    <i className="ri-logout-box-r-line"></i>
                                </span>
                                <span className="sidebar--item">Logout</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className="main--content">
                    <Routes>
                        <Route path="/admin_dashboard" element={<AdminDashBoard />} />
                        <Route path="/add-todo" element={<AddTodo />} />
                        <Route path="/all_todos" element={<AllTodos search={search} currentPage={currentPage} />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/add_user" element={<AddUser />} />
                        <Route path="/all_users" element={<AllUsers search={search} currentPage={currentPage} />} />
                        <Route path="/edit_profile/:id" element={<EditProfile />} />
                        <Route path="/view_todo/:id" element={<ViewTodo />} />
                        <Route path="/update_todo/:id" element={<UpdateTodo />} />
                        <Route path="/view_user/:id" element={<ViewUser />} />
                        <Route path="/update_user/:id" element={<UpdateUser />} />
                        <Route path="*" element={<NotFound />} />
                        <Route path="/" element={<LoginPage />} />
                        <Route path='/forgot_password' element={<ForgotPassword />} />
                    </Routes>
                </div>
            </section>

            <Dialog
                open={open1}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Logout Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" className='center'>
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

export default AdminLayout;
