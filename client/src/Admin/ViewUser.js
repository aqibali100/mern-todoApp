import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchProfilePic, getUserById } from '../features/UsersSlice';

const ViewUser = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [profilePicUrl, setProfilePicUrl] = useState('');

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
                <h4 className="p-h4">User Profile</h4>
                <div className="p-main" style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                    <div className="pro-pic">
                        <img src={profilePicUrl} alt="Profile" />
                        <div className="upload-icon">
                            <input
                                type="file"
                                id="upload-input"
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                    <div className="pro-info">
                        <label>Name:</label>
                        <br />
                        <input
                            type="text"
                            readOnly
                            value={name}
                        />
                        <br /><br></br>
                        <label>Email:</label>
                        <br />
                        <input
                            type="email"
                            readOnly
                            value={email}
                        />
                        <br /><br></br>
                        <label>Role:</label>
                        <br />
                        <input
                            type="text"
                            readOnly
                            value={role}
                        />
                        <br />
                        <br></br>
                        <label>User_Id:</label>
                        <br />
                        <input
                            type="text"
                            readOnly
                            value={id}
                        />
                        <br />
                        <br></br>
                        <Link to='/all_users'>
                            <button className="add">
                                Go Back
                            </button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewUser;
