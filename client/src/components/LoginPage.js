import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import loginPic from '../images/log.svg';
import registerPic from '../images/register.svg';
import { loginUser, registerUser } from '../features/AuthSlice';
import '../CssFiles/Login.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector(state => state.auth);

  const containerRef = useRef(null);

  const signInValidationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email Required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password Required'),
  });

  const signUpValidationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email Required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });
  //Login User
  const formikSignIn = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signInValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(loginUser(values)).unwrap();
        toast.success('Login Successfuly!');
      } catch (error) {
        resetForm();
        toast.error('Your Email or Password is Incorrect!');
      }
    },
  });
  //Register User
  const formikSignUp = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpValidationSchema,
    onSubmit: async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
        await dispatch(registerUser({
          username: values.username,
          email: values.email,
          password: values.password,
        })).unwrap();
        resetForm();
        toast.success('Registration successful!');
        containerRef.current.classList.remove('sign-up-mode');
        navigate('/');
      } catch (error) {
        resetForm();
        if (error.message === 'Email is already registered') {
          toast.error('Email is Already Registered!');
        } else {
          setErrors({ form: 'Registration failed. Please try again.' });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin_dashboard');
      } else {
        navigate('/user_dashboard');
      }
    }
  }, [user, navigate]);


  useEffect(() => {
    const container = containerRef.current;
    const signInBtn = document.getElementById('sign-in-btn');
    const signUpBtn = document.getElementById('sign-up-btn');

    const handleSignUp = () => {
      container.classList.add('sign-up-mode');
    };

    const handleSignIn = () => {
      container.classList.remove('sign-up-mode');
    };

    signUpBtn.addEventListener('click', handleSignUp);
    signInBtn.addEventListener('click', handleSignIn);

    return () => {
      signUpBtn.removeEventListener('click', handleSignUp);
      signInBtn.removeEventListener('click', handleSignIn);
    };
  }, []);

  return (
    <div>
      <div className="container" ref={containerRef}>
        <div className="forms-container">
          <div className="signin-signup">
            {/* Sign In Form */}
            <form className="sign-in-form" onSubmit={formikSignIn.handleSubmit}>
              <h2 className="title">Sign in</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  onChange={formikSignIn.handleChange}
                  value={formikSignIn.values.email}
                  className={formikSignIn.touched.email && formikSignIn.errors.email ? 'error' : ''}
                />
                {formikSignIn.touched.email && formikSignIn.errors.email ? (
                  <div className="error-message">{formikSignIn.errors.email}</div>
                ) : null}
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={formikSignIn.handleChange}
                  value={formikSignIn.values.password}
                  className={formikSignIn.touched.password && formikSignIn.errors.password ? 'error' : ''}
                />
                {formikSignIn.touched.password && formikSignIn.errors.password ? (
                  <div className="error-message">{formikSignIn.errors.password}</div>
                ) : null}
              </div>
              <button type="submit" className="btn solid" disabled={loading}>
                {loading ? 'Waiting' : 'Login'}
              </button>
              <Link to='/forgot_password'><Button>Forget Password?</Button></Link>
              <p className="social-text">Or Sign in with social platforms</p>
              <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-google"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </form>

            {/* Sign Up Form */}
            <form className="sign-up-form" onSubmit={formikSignUp.handleSubmit}>
              <h2 className="title">Sign up</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={formikSignUp.handleChange}
                  value={formikSignUp.values.username}
                  className={formikSignUp.touched.username && formikSignUp.errors.username ? 'error' : ''}
                />
                {formikSignUp.touched.username && formikSignUp.errors.username ? (
                  <div className="error-message">{formikSignUp.errors.username}</div>
                ) : null}
              </div>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={formikSignUp.handleChange}
                  value={formikSignUp.values.email}
                  className={formikSignUp.touched.email && formikSignUp.errors.email ? 'error' : ''}
                />
                {formikSignUp.touched.email && formikSignUp.errors.email ? (
                  <div className="error-message">{formikSignUp.errors.email}</div>
                ) : null}
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={formikSignUp.handleChange}
                  value={formikSignUp.values.password}
                  className={formikSignUp.touched.password && formikSignUp.errors.password ? 'error' : ''}
                />
                {formikSignUp.touched.password && formikSignUp.errors.password ? (
                  <div className="error-message">{formikSignUp.errors.password}</div>
                ) : null}
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  onChange={formikSignUp.handleChange}
                  value={formikSignUp.values.confirmPassword}
                  className={formikSignUp.touched.confirmPassword && formikSignUp.errors.confirmPassword ? 'error' : ''}
                />
                {formikSignUp.touched.confirmPassword && formikSignUp.errors.confirmPassword ? (
                  <div className="error-message">{formikSignUp.errors.confirmPassword}</div>
                ) : null}
              </div>
              <button type="submit" className="btn solid" disabled={loading}>
                {loading ? 'Waiting' : 'Sign up'}
              </button>
              <p className="social-text">Or Sign up with social platforms</p>
              <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-google"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>Read This!</h3>
              <p>
                You can Login if You have Already an Account. If You Have not an Account Please Sign Up First!
              </p>
              <button className="btn transparent" id="sign-up-btn">
                Sign up
              </button>
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

export default LoginPage;
