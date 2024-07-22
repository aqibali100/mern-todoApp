import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, getItems } from '../features/TodoSlice';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const ViewTodos = ({ search }) => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [successOpen, setSuccessOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [todosPerPage] = useState(6);
    const [todoToDelete, setTodoToDelete] = useState(null);
    const [checkedItems, setCheckedItems] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const { items: todos, totalPages, loading } = useSelector((state) => state.todos);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const [open, setOpen] = useState(false);


    //Get Todos
    useEffect(() => {
        dispatch(getItems({ page: currentPage, search, filter }));
    }, [dispatch, currentPage, filter, search]);
    //pagination
    const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const getSerialNumber = (index) => {
        return (currentPage - 1) * todosPerPage + index + 1;
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(1);
    };
    //delete todo
    const handleClickOpen = (id) => {
        setTodoToDelete(id);
        setOpen(true);
    };
    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteItem(todoToDelete));
            dispatch(getItems({ page: currentPage, search, filter }));
           toast.success('Todo delete Successfully!')
            handleClose();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteCheckedList = () => {
    };
    useEffect(() => {
        if (successOpen) {
            const timer = setTimeout(() => {
                setSuccessOpen(false);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [successOpen]);

    //delete selected todos
    const handleCheckChange = (id) => {
        setCheckedItems(prevCheckedItems =>
            prevCheckedItems.includes(id)
                ? prevCheckedItems.filter(itemId => itemId !== id)
                : [...prevCheckedItems, id]
        );
    };

    const handleSelectAllChange = (event) => {
        const isChecked = event.target.checked;
        setSelectAllChecked(isChecked);
        setCheckedItems(isChecked ? todos.map(todo => todo._id) : []);
    };
    return (
        <div>
            <div className="recent--patients">
                <div className="title">
                    <h2 className="section--title">All Todos ({todos.length})</h2>
                    <Link to='/create_todo'><button className="add">
                        <i className="ri-add-line"></i>Add Todo
                    </button></Link>
                </div>
                <div className="li-select">
                    <div className="div">
                        {checkedItems.length > 0 ? <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            style={{ textTransform: 'capitalize' }}
                            onClick={deleteCheckedList}
                        >
                            Delete
                        </Button> : ''}

                    </div>
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
                                <th className='th'> <Checkbox
                                    {...label}
                                    className='check'
                                    checked={selectAllChecked}
                                    onChange={handleSelectAllChange}
                                /> Select All</th>
                                <th>Sr.#</th>
                                <th>Name</th>
                                <th>Date in</th>
                                <th>Gender</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8"><CircularProgress></CircularProgress></td>
                                </tr>
                            ) : todos.length > 0 ? (
                                todos.map((todo, index) => (
                                    <tr key={todo._id}>
                                        <td>
                                            <Checkbox
                                                {...label}
                                                className='check'
                                                checked={checkedItems.includes(todo._id)}
                                                onChange={() => handleCheckChange(todo._id)}
                                            />
                                        </td>
                                        <td>{getSerialNumber(index)}</td>
                                        <td>{todo.todoName}</td>
                                        <td>{moment(todo.createdAt).format('MMMM Do YYYY')}</td>
                                        <td>{todo.gender}</td>
                                        <td>{todo.description}</td>
                                        <td className={todo.status === 'completed' ? 'completed' : 'pending'}>
                                            {todo.status}
                                        </td>
                                        <td>
                                            <span className='action-btn'>
                                                <Link to={`/view_todo/${todo._id}`} className="edit-link keyboard">
                                                    <i className="fa fa-keyboard-o" aria-hidden="true"></i>
                                                </Link>
                                                <Link to={`/update_todo/${todo._id}`} className="edit-link">
                                                    <i className="ri-edit-line edit" ></i>
                                                </Link>
                                                <i className="ri-delete-bin-line delete" onClick={() => handleClickOpen(todo._id)}></i>
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">No todos found</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                    <div className="pagination">
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
                open={successOpen}
                aria-labelledby="success-dialog-title"
                aria-describedby="success-dialog-description"
            >
                <DialogTitle id="success-dialog-title">{"Success"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="success-dialog-description" className='center'>
                        <CheckCircleOutlineIcon sx={{ color: 'green', fontSize: 48 }} />
                        Todo deleted successfully!
                    </DialogContentText>
                </DialogContent>
            </Dialog>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this todo?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </div>
    )
}

export default ViewTodos
