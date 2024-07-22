import React, { useEffect } from 'react';
import { Box, Button, TextField, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { resetPassword, clearStatus } from '../features/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';


const ForgetPassword = () => {
    const { token } = useParams();
    const dispatch = useDispatch();
    const { status, loading } = useSelector((state) => state.auth);
    const formik = useFormik({
        initialValues: {
            password: '',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Password is required'),
        }),
        onSubmit: (values, { setSubmitting }) => {
            dispatch(resetPassword({ token, password: values.password }))
                .finally(() => setSubmitting(false));
        },
    });

    useEffect(() => {
        if (status) {
            const timer = setTimeout(() => {
                dispatch(clearStatus());
                if (status.success) {
                    formik.resetForm();
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [status, dispatch]);

    return (
        <div className="sign-bg">
            <div className="container">
                <div className="row login-flex">
                    <div className="sign-up">
                        <h2 className="form-heading">New Password</h2>
                        <form onSubmit={formik.handleSubmit}>
                            <Box mb={2}>
                                <TextField
                                    id="password"
                                    name="password"
                                    label="Password"
                                    variant="outlined"
                                    type="password"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Box>
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
                            <Box className="form-btn" mb={2}>
                                <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
                                    Reset Password
                                </Button>
                            </Box>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
