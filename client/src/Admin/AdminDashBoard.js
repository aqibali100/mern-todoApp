import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GetAllUsers, getAllUsers } from '../features/UsersSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { fetchTodosByadmin } from '../features/TodoSlice';
import TodosChart from './TodosChart';
import UserChart from './UserChart';



const AdminDashBoard = () => {
    const dispatch = useDispatch();
    const todos = useSelector(state => state.todos.items)
    const [profiles, setProfiles] = useState([]);
    const { Users: users } = useSelector((state) => state.user);

    //get admin And Users Length
    const userAdmin = users.filter(user => user.role === 'admin').length;
    const userCount = users.filter(user => user.role === 'user').length;


    // get all users details from database by admin 
    useEffect(() => {
        dispatch(GetAllUsers());
    }, [dispatch]);

    // get all todos  from database by admin 
    useEffect(() => {
        dispatch(fetchTodosByadmin());
    }, [dispatch]);


    //get all profile pic by admin
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/GetAllProfiles');
                setProfiles(response?.data);
            } catch (error) {
            }
        };

        fetchProfiles();
    }, []);

    return (
        <div>
            <div>
                <div className="overview">
                    <div className="title">
                        <h6 className="section--title">Overview</h6>
                    </div>
                    <div className="cards">
                        <div className="card card-1">
                            <div className="card--data">
                                <div className="card--content">
                                    <h5 className="card--title">Total Users { }</h5>
                                    <h1>{users.length}</h1>
                                </div>
                                <i className="ri-user-2-line card--icon--lg"></i>
                            </div>
                        </div>
                        <div className="card card-2">
                            <div className="card--data">
                                <div className="card--content">
                                    <h5 className="card--title">Users</h5>
                                    <h1>{userCount}</h1>
                                </div>
                                <i className="ri-user-line card--icon--lg"></i>
                            </div>
                        </div>
                        <div className="card card-3">
                            <div className="card--data">
                                <div className="card--content">
                                    <h5 className="card--title">Admins</h5>
                                    <h1>{userAdmin}</h1>
                                </div>
                                <i className="ri-user-line card--icon--lg"></i>
                            </div>
                        </div>
                        <div className="card card-4">
                            <div className="card--data">
                                <div className="card--content">
                                    <h5 className="card--title">All Todos</h5>
                                    <h1>{todos.length}</h1>
                                </div>
                                <i className="ri-calendar-2-line card--icon--lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="doctors">
                    <div className="title">
                        <h6 className="section--title">All Users</h6>
                    </div>
                    <div className="doctors--cards">
                        {profiles.map(profile => {
                            if (profile.userId) return (
                                <Link key={profile.userId} to='' className="doctor--card">
                                    <div className="img--box--cover">
                                        <div className="img--box">
                                            <img src={profile.imageUrl} />
                                        </div>
                                    </div>
                                    <p className="free">{profile.userName}</p>
                                </Link>
                            )
                        })}
                    </div>
                </div>
                <TodosChart todos={todos}/>
                <UserChart  users={users}/>

                <div className="recent--patients">
                    <div className="title">
                        <h6 className="section--title">Recent Users</h6>
                    </div>
                    <div className="table-1">
                        <table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>User_id</th>
                                    <th>No. of Todos</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.slice(0, 7).map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user._id}</td>
                                        <td>{user.todoCount}</td>
                                        <td>{user.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashBoard
