import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { Alert, Button } from '@mui/material';
import loginPic from '../images/log.svg';
import registerPic from '../images/register.svg';
import { clearStatus, forgetPassword } from '../features/AuthSlice';
import '../CssFiles/Login.css'
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const loading = ''
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.auth);

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            const response = await dispatch(forgetPassword(values.email));
            resetForm();
            if (response.error) {
                toast.error('Given Email Does not Exist!');
              } else {
                toast.success('Password Reset Email Sent!');
              }
        },
    });

    useEffect(() => {
        let timer;
        if (status) {
            timer = setTimeout(() => {
                dispatch(clearStatus());
            }, 1500);
        }
        return () => clearTimeout(timer);
    }, [status, dispatch]);
    return (
        <div>
            <div className="container">
                <div className="forms-container">
                    <div className="signin-signup">
                        <form className="sign-in-form" onSubmit={formik.handleSubmit}>
                            <h1 className="title">Forgot Password</h1>
                            <div className="input-field">
                                <i className="fas fa-user"></i>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    name="email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                                {formik.status && formik.status.success && (
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        {formik.status.success}
                                    </Alert>
                                )}
                                {formik.status && formik.status.error && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {formik.status.error}
                                    </Alert>
                                )}
                            </div>
                            <button type="submit" className="btn solid" disabled={loading}>
                                {loading ? 'Waiting' : 'Send'}
                            </button>
                            <Link to='/'><Button>Login</Button></Link>
                        </form>
                    </div>
                </div>

                <div className="panels-container">
                    <div className="panel left-panel">
                        <div className="content">
                            <h3>Read This!</h3>
                            <p>
                                Enter Your Email and We sent an email to change your password!
                            </p>
                        </div>
                        <img src={loginPic} className="image" alt="" />
                    </div>
                    <div className="panel right-panel">
                        <div className="content">
                            <h3>Read This</h3>
                            <p>
                                If You Registered Then Go To Sign In Page and Login There
                            </p>
                            <button className="btn transparent" id="sign-in-btn">
                                Sign in
                            </button>
                        </div>
                        <img src={registerPic} className="image" alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword
