import React, { useEffect, useState } from 'react'
import '../CssFiles/UserDashBoard.css'
import { Link, useParams } from 'react-router-dom'
import { getTodoById } from '../features/TodoSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';


const ViewTodo = () => {
  const { id } = useParams();
  const { todo } = useSelector((state) => state.todos);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTodoById(id));
  }, [dispatch, id]);

  const [formData, setFormData] = useState({
    todoName: '',
    date: '',
    gender: '',
    status: '',
    description: ''
});

  useEffect(() => {
    if (todo) {
        setFormData({
            todoName: todo.todoName || '',
            date: todo.date || '',
            gender: todo.gender || '',
            status: todo.status || '',
            description: todo.description || ''
        });
    }
}, [todo]);
  return (
    <>
      <div className='view-page'>
        <h4>View Todo</h4>
        <div className="row view-todo">
          <div className="col-6 read-col">
            <label>Todo Name :</label><br></br>
            <input type='text' readOnly value={formData.todoName }></input><br></br>
          </div>
          <div className="col-6 read-col">
            <label>Date :</label><br></br>
            <input type='text' readOnly  value={moment(formData.date).format('MMMM Do YYYY, h:mm:ss a')}></input><br></br>
          </div>
        </div>

        <div className="row view-todo">
          <div className="col-6 read-col">
            <label>Gender :</label><br></br>
            <input type='text' readOnly value={formData.gender }></input><br></br>
          </div>
          <div className="col-6 read-col">
            <label>Email :</label><br></br>
            <input type='email' readOnly  value={user.email } ></input><br></br>
          </div>
        </div>

        <div className="row view-todo">
          <div className="col-6 read-col">
            <label>Status :</label><br></br>
            <input type='text' readOnly value={formData.status }></input><br></br>
          </div>
          <div className="col-6 read-col">
            <label>UserName :</label><br></br>
            <input type='text' readOnly  value={user.userName }></input><br></br>
          </div>
        </div>
        <div className="row view-todo">
          <div className="col-6 read-col">
            <label>Description :</label><br></br>
            <textarea type='text' readOnly value={formData.description }></textarea><br></br>
          </div>
        </div>

        <Link to='/view_todos'>
          <button type="button" className="add todo-add">
            Go Back
          </button>
        </Link>
      </div>
    </>
  )
}

export default ViewTodo
