import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
import { fetchProfilePic, getUserById, updateUserById, uploadProfilePic } from '../features/UsersSlice';
import { toast } from 'react-toastify';

const UpdateUser = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.users.docs.find(user => user._id === id));
    const [profilePicUrl, setProfilePicUrl] = useState('');


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    //get user by admin
    useEffect(() => {
        if (id) {
            dispatch(getUserById(id))
                .unwrap()
                .then((originalPromiseResult) => {
                    setName(originalPromiseResult.username);
                    setEmail(originalPromiseResult.email);
                    setRole(originalPromiseResult.role);
                })
                .catch((rejectedValueOrSerializedError) => {
                });
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (user) {
            setName(user.username);
            setEmail(user.email);
            setRole(user.role);
        }
    }, [user]);
    //update user by admin
    const handleUpdateUser = async () => {
        try {
            const updatedUserData = {
                username: name,
                email: email,
                role: role,
            };

            await dispatch(updateUserById({ userId: id, userData: updatedUserData }));
            toast.success('User Has Been Updated!');
            navigate('/all_users')
        } catch (error) {
            console.error('Failed to update user:', error.message);
        }
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            await dispatch(uploadProfilePic(formData)).unwrap();
            const result = await dispatch(fetchProfilePic(id)).unwrap();
            setProfilePicUrl(result.imageUrl);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchProfilePic(id))
                .unwrap()
                .then((response) => {
                    setProfilePicUrl(response.imageUrl);
                })
                .catch((error) => {
                    console.error('Failed to fetch profile picture:', error);
                });
        }
    }, [id, dispatch]);

    return (
        <div>
            <div>
                <h4 className="p-h4">Profile</h4>
                <div className="p-main" style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                    <div className="pro-pic">
                        <img src={profilePicUrl} alt="Profile" />
                        <div className="upload-icon">
                            <input
                                type="file"
                                id="upload-input"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}

                            />
                            <label htmlFor="upload-input">
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                    <PhotoCamera />
                                </IconButton>
                            </label>
                        </div>
                    </div>
                    <div className="pro-info">
                        <label>Name:</label>
                        <br />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <br /><br></br>
                        <label>Email:</label>
                        <br />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <br /><br></br>
                        <label>Role:</label>
                        <br />
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        <br />
                        <br></br>
                        <button className="add" onClick={handleUpdateUser}>
                            Update Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateUser;
