import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserById, getAllUsers } from '../features/UsersSlice';
import { Link } from 'react-router-dom';
import { Button, DialogActions, Dialog, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import Pagination from 'react-bootstrap/Pagination';

const AllUsers = ({search}) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users.docs);
  const totalPages = useSelector((state) => state.user.users.totalPages);
  const loading = useSelector((state) => state.user.loading);

  const [userToDelete, setUserToDelete] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    dispatch(getAllUsers({ params: { page: currentPage, role: roleFilter, search } }));
  }, [dispatch, currentPage, roleFilter, search]); 

  // Handle pagination
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // Handle role filter change
  const handleRoleChange = (event) => {
    setRoleFilter(event.target.value);
    setCurrentPage(1); 
  };

  // Delete user
  const handleDeleteUser = (id) => {
    setUserToDelete(id);
    setShowConfirmation(true);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUserById(userToDelete)).unwrap();
        dispatch(getAllUsers({ params: { page: currentPage, role: roleFilter } }));
        handleClose();
        setShowConfirmation(false);
        toast.success('User Has Been Deleted!');
      } catch (error) {
        toast.error('Failed to delete user.');
      }
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
  };

  // Pagination items
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>,
    );
  }

  return (
    <div>
      <div className="recent--patients">
        <div className="title">
          <h6 className="section--title">All Users ({users.length})</h6>
          <Link to='/add_user'>
            <button className="add"><i className="ri-add-line"></i>Add Users</button>
          </Link>
        </div>
        <div className="li-select-1">
          <select
            name="filter"
            id="filter"
            className="dropdown-4"
            value={roleFilter}
            onChange={handleRoleChange}
          >
            <option value="all">All</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="loading-indicator">
                    <CircularProgress />
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{(currentPage - 1) * 6 + index + 1}</td>
                    <td className='user-li' style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                      <div className="user-img">
                        <img src={user?.profilePicUrl} alt="User Profile" />
                      </div>
                      {user.username}
                    </td>
                    <td>{user.email}</td>
                    <td>{user._id}</td>
                    <td>{user.todosCount}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className='action-btn'>
                        <Link to={`/view_user/${user._id}`}>
                          <i className="fa fa-keyboard-o" aria-hidden="true"></i>
                        </Link>
                        <Link to={`/update_user/${user._id}`}>
                          <i className="ri-edit-line edit"></i>
                        </Link>
                        <i className="ri-delete-bin-line delete" onClick={() => handleDeleteUser(user._id)}></i>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Pagination>{paginationItems}</Pagination>
        </div>
      </div>

      <Dialog
        open={showConfirmation}
        onClose={cancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"User Delete Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to Delete This User Permanently?
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
  );
}

export default AllUsers;
