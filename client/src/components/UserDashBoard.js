import React, { useEffect } from 'react'
import '../CssFiles/UserDashBoard.css'
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { authenticateUser } from '../features/AuthSlice';
import { fetchTodos, getItems } from '../features/TodoSlice';


const UserDashboard2 = () => {
    const dispatch = useDispatch();
    const { items: todos,  loading } = useSelector((state) => state.todos);
    const user = useSelector(state => state.auth.user);
    const pendingTodosCount = todos.filter(todo => todo.status === 'pending').length;
    const completedTodosCount = todos.filter(todo => todo.status === 'completed').length;
   //UseEffect for Authenticated User
   useEffect(() => {
        dispatch(fetchTodos());
}, [dispatch]);
    return (
        <div>
            <div className="overview">
                <div className="title">
                    <h2 className="section--title">Todos Overview</h2>
                </div>
                <div className="cards">
                    <div className="card card-1">
                        <div className="card--data">
                            <div className="card--content">
                                <h5 className="card--title">Total Todos</h5>
                                <h1>{todos.length}</h1>
                            </div>
                            <i className="ri-calendar-2-line card--icon--lg"></i>
                        </div>
                    </div>
                    <div className="card card-2">
                        <div className="card--data">
                            <div className="card--content">
                                <h5 className="card--title">Completed Todos</h5>
                                <h1>{completedTodosCount}</h1>
                            </div>
                            <i className="ri-calendar-2-line card--icon--lg"></i>
                        </div>
                    </div>
                    <div className="card card-3">
                        <div className="card--data">
                            <div className="card--content">
                                <h5 className="card--title">Pending Todos</h5>
                                <h1>{pendingTodosCount}</h1>
                            </div>
                            <i className="ri-calendar-2-line card--icon--lg"></i>
                        </div>
                    </div>
                </div>
                <div className="recent--patients">
                    <div className="title">
                        <h2 className="section--title">Recent Todos</h2>
                    </div>
                    <div className="table-1">
                        <table>
                            <thead>
                                <tr>
                                    <th>Sr.#</th>
                                    <th>Name</th>
                                    <th>Date in</th>
                                    <th>Gender</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6">Loading...</td>
                                    </tr>
                                ) : todos.length > 0 ? (
                                    todos.slice(0, 7).map((todo, index) => (
                                        <tr key={todo._id}>
                                            <td>{index + 1}</td>
                                            <td>{todo.todoName}</td>
                                            <td>{moment(todo.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                            <td>{todo.gender}</td>
                                            <td>{todo.description}</td>
                                            <td className={todo.status === 'completed' ? 'completed' : 'pending'}>{todo.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No todos found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard2
