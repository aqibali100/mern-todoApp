import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import defaultProfilePic from '../images/no-user.webp';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getUserById } from '../features/UsersSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const token = localStorage.getItem('token');
  const [profilePic, setProfilePicLocal] = useState(defaultProfilePic);
  const [userName, setName] = useState(user.userName);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const fetchProfilePic = async () => {
    try {
        const res = await axios.get('http://localhost:5000/GetProfilePic', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (res.data && res.data.imageUrl) {
            setProfilePicLocal(res.data.imageUrl);
        }
    } catch (error) {
    }
};

useEffect(() => {
fetchProfilePic();
}, []);

useEffect(() => {
  if (user.userId) {
      dispatch(getUserById(user.userId))
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
}, [user.userId, dispatch]);
  return (
    <div>
      <div>
        <h4 className="p-h4">Profile</h4>
        <div className="p-main" style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
          <div className="pro-pic">
            <img src={profilePic} alt="Profile" />
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
            <p>{userName}</p>
            <br />
            <label>Email:</label>
            <br />
            <p>{email}</p>
            <br />
            <label>Role:</label>
            <br />
            <p>{role}</p>
            <br />
            <Link to={`/edit_profile/${user.userId}`} className="edit-link">
              <button className="add">
                <i className="ri-add-line"></i>Edit Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
