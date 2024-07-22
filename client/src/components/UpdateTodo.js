import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getTodoById, updateItem } from '../features/TodoSlice';
import { toast } from 'react-toastify';


const UpdateTodo = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { loading, todo } = useSelector((state) => state.todos);
    const [formData, setFormData] = useState({
        todoName: '',
        date: new Date(),
        gender: '',
        status: '',
        description: ''
    });
    console.log(todo, 'todo')

    useEffect(() => {
        dispatch(getTodoById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (todo) {
            setFormData({
                todoName: todo.todoName || '',
                date: todo.date || new Date(),
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
            dispatch(updateItem({ todoId: id, updatedTodo: formData }))
            toast.success('Todo Update Successfuly!')
            navigate('/view_todos');
        } catch (error) {
          toast.error('Failed to Update Todo!');
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
                            type="text"
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
                            <Link to='/view_todos'>
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
