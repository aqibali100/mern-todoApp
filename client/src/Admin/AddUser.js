import React, {useState } from 'react'
import '../CssFiles/DashBoard.css'
import { useDispatch } from 'react-redux';
import { AddUsers } from '../features/UsersSlice';
import { toast } from 'react-toastify';

const AddUser = () => {
const dispatch = useDispatch();

  //Add User By Admin
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await dispatch(AddUsers(formData));
      toast.success('User Has Been Added!')
      setFormData({
        username: '',
        email: '',
        password: '',
        role: '',
      });
    } catch (error) {
      if (error.message === 'Email is already registered') {
       toast.error('Email is Already Registered!')
    }
    }
  };
  return (
    <div>
      <div className="todo-bg">
        <div className="todo-main">
          <h4>Add User</h4>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">User Name :</label><br />
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder='Enter Username'
              required
            /><br /><br />

            <label htmlFor="email">Email :</label><br />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter Email'
              required
            /><br /><br />

            <label htmlFor="password">Password :</label><br />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter Password'
              required
            /><br /><br />

            <label htmlFor="role">Role :</label><br />
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="select">Select</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select><br /><br />

            <div className="add-btn">
              <button type="submit" className="add todo-add">
               Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddUser
