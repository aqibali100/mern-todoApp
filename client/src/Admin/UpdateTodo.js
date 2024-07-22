import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAdminItems, getTodoById, updateItem, updateItemByAdmin } from '../features/TodoSlice';
import { toast } from 'react-toastify';

const UpdateTodo = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { loading, todo } = useSelector((state) => state.todos);
    const [formData, setFormData] = useState({
        todoName: '',
        date:new Date().toISOString().substr(0, 10),
        gender: '',
        status: '',
        description: ''
    });
    useEffect(() => {
        dispatch(getTodoById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (todo) {
            setFormData({
                todoName: todo.todoName || '',
                date: todo.date || new Date().toISOString().substr(0, 10), 
                gender: todo.gender || '',
                status: todo.status || '',
                description: todo.description || ''
            });
        }
    }, [todo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await dispatch(updateItemByAdmin({ todoId: id, updatedTodo: formData })).unwrap();
          dispatch(getAdminItems());
          toast.success('Todo Update Successfuly!');
          navigate('/all_todos');
        } catch (error) {
          console.error('Error updating todo:', error);
        }
      };

    return (
        <div>
            <div className="todo-bg">
                <div className="todo-main">
                    <h4>Update Todos</h4>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="todoName">Todo Name :</label><br />
                        <input
                            type="text"
                            id="todoName"
                            name="todoName"
                            value={formData.todoName}
                            onChange={handleChange}
                            placeholder='Enter Text'
                            required
                        /><br /><br />

                        <label htmlFor="date">Date :</label><br />
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        /><br /><br />

                        <label htmlFor="gender">Gender :</label><br />
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="select">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select><br /><br />

                        <label htmlFor="status">Status :</label><br />
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="select">Select</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select><br /><br />

                        <label htmlFor="description">Description :</label><br />
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea><br /><br />

                        <div className="add-btn-1">
                            <Link to='/all_todos'>
                                <button type="button" className="add todo-add">
                                    Go Back
                                </button>
                            </Link>
                            <button type="submit" className="add todo-add" disabled={loading}>
                                {loading ? 'Updating...' : 'Update Todo'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateTodo;
