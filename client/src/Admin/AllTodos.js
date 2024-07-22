import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, CircularProgress, DialogActions, Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import moment from 'moment';
import { deleteItemByAdmin, getAdminItems } from '../features/TodoSlice';
import { Link } from 'react-router-dom';
import '../CssFiles/DashBoard.css'
import { toast } from 'react-toastify';





const AllTodos = ({ search }) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage] = useState(6);
  const { items: todos, totalPages, loading } = useSelector((state) => state.todos);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);





  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };
  const getSerialNumber = (index) => {
    return (currentPage - 1) * todosPerPage + index + 1;
  };

  useEffect(() => {
    dispatch(getAdminItems({ page: currentPage, search, currentPage, filter }));
  }, [dispatch, currentPage, filter, search, currentPage]);


  //pagination
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  //delete todo by admin
  const handleClickOpen = (id) => {
    setTodoToDelete(id);
    setShowConfirmation(true);
  };
  const handleConfirmDelete = async () => {
    if (todoToDelete) {
      try {
        await dispatch(deleteItemByAdmin(todoToDelete)).unwrap();
        dispatch(getAdminItems());
        handleClose();
        setShowConfirmation(false);
        toast.success('Todo Delete Successfuly!');
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleClose = () => {
    setShowConfirmation(false)
  };
  return (
    <div>
      <div className="recent--patients">
        <div className="title">
          <h6 className="section--title">All Todos ({todos.length})</h6>
          <Link to='/add-todo'><button className="add">
            <i className="ri-add-line"></i>Add Todo
          </button></Link>
        </div>
        <div className="li-select-1">
          <select
            name="filter"
            id="filter"
            className="dropdown-4"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="table-1">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Todo Name</th>
                <th>Date</th>
                <th>Description</th>
                <th>User Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8"><CircularProgress /></td>
                </tr>
              ) : todos.length === 0 ? (
                <tr>
                  <td colSpan="8">No todos found</td>
                </tr>
              ) : (
                todos.map((todo, index) => (
                  <tr key={todo._id}>
                    <td>{getSerialNumber(index)}</td>
                    <td className='user-li'>{todo.todoName}</td>
                    <td>{moment(todo.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
                    <td>{todo.description}</td>
                    <td>{todo.user.username}</td>
                    <td className={todo.status === 'completed' ? 'completed' : 'pending'}>{todo.status}</td>
                    <td>
                      <span className='action-btn'>
                        <>
                          <Link to={`/view_todo/${todo._id}`} className="edit-link keyboard">
                            <i className="fa fa-keyboard-o" aria-hidden="true"></i>
                          </Link>
                          <Link to={`/update_todo/${todo._id}`} className="edit-link keyboard">
                            <i className="ri-edit-line edit"></i>
                          </Link>
                          <i className="ri-delete-bin-line delete" onClick={() => handleClickOpen(todo._id)}></i>
                        </>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>


          </table>

          <div className="pagination-1">
            <button className="pagination-btn" onClick={handlePrevPage} disabled={currentPage === 1}>
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <div className="page-info">
              Page {currentPage} of {totalPages}
            </div>
            <button className="pagination-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>
      </div>

      <Dialog
        open={showConfirmation}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Todo Delete Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to Delete This Todo Permanently?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AllTodos
