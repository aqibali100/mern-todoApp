import React, { useEffect, useState } from 'react';
import '../CssFiles/DashBoard.css';
import { GetAllUsers} from '../features/UsersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { createTodoByAdmin } from '../features/TodoSlice';
import { toast } from 'react-toastify';

const AddTodo = () => {
  const dispatch = useDispatch();
  const { Users: users } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(GetAllUsers());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    todoName: '',
    date: '',
    gender: '',
    status: '',
    description: '',
    userId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const todoData = {
      todoName: formData.todoName,
      date: formData.date,
      gender: formData.gender,
      status: formData.status,
      description: formData.description,
      userId: formData.userId,
    };

    dispatch(createTodoByAdmin(todoData))
      .then(() => {
        toast.success('Todo Has Been Added!')
        setFormData({
          todoName: '',
          date: '',
          gender: '',
          status: '',
          description: '',
          userId: '',
        });
      })
      .catch((error) => {
        if (error) {
          toast.error('Failed To Add Todo!')
        }
      });
  };
  return (
    <div>
      <div className="todo-bg">
        <div className="todo-main">
          <h4>Add Todos</h4>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Todo Name :</label><br />
            <input
              type="text"
              id="name"
              name="todoName"
              placeholder="Enter Text"
              value={formData.todoName}
              onChange={handleChange}
            /><br /><br />

            <label htmlFor="date">Date :</label><br />
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            /><br /><br />

            <label htmlFor="gender">Gender :</label><br />
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
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
            >
              <option value="">Select</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select><br /><br />

            <label htmlFor="userId">Select User :</label><br />
            <select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user._id}>{user.username}</option>
              ))}
            </select><br /><br />

            <label htmlFor="description">Description :</label><br />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea><br /><br />

            <div className="add-btn">
              <button type="submit" className="add todo-add">
                Add Todo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTodo;
