import React, { useEffect, useState } from 'react';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProfilePic, getUserById, updateUser, uploadprofilePic, uploadProfilePic} from '../features/UsersSlice';
import { toast } from 'react-toastify';


const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const [userName, setName] = useState(user.userName);
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState(user.role);
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const { id } = useParams();

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
                    console.error('Failed to fetch user:', rejectedValueOrSerializedError);
                });
        }
    }, [id, dispatch]);

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

    const handleSave = async () => {
        const updatedUser = { userName, email };
        try {
            await dispatch(updateUser({ id, userData: updatedUser })).unwrap();
            toast.success('Profile updated successfully!');
            await dispatch(getUserById(id)).unwrap();
            navigate('/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };
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
                            value={userName}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <br /><br />
                        <label>Email:</label>
                        <br />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <br /><br />
                        <label>Role:</label>
                        <br />
                        <input
                            type="text"
                            readOnly
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        <br /><br />
                        <button className="add" onClick={handleSave}>
                            <i className="ri-add-line"></i>Save Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
