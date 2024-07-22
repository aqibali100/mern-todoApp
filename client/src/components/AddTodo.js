import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createItem } from '../features/TodoSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTodo = () => {
    const { loading } = useSelector((state) => state.todos);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        todoName: '',
        date: '',
        gender: 'select',
        status: 'select',
        description: ''
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddTodo();
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleAddTodo = async () => {
        if (
            formData.todoName &&
            formData.date &&
            formData.gender !== 'select' &&
            formData.status !== 'select' &&
            formData.description
        ) {
            try {
                await dispatch(createItem(formData)).unwrap();
                setFormData({
                    todoName: '',
                    date: '',
                    gender: 'select',
                    status: 'select',
                    description: ''
                });
                toast.success('Todo Has Been Created successfully!');
            } catch (error) {
                console.error('Error adding todo:', error);
            }
        }
    };
    return (
        <div>
            <div className="todo-bg">
                <div className="todo-main">
                    <h4>Create Todos</h4>
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
                            required
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea><br /><br />

                        <div className="add-btn">
                            <button type="submit" className="add todo-add" disabled={loading}>
                                {loading ? 'Adding...' : 'Add Todo'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default AddTodo
