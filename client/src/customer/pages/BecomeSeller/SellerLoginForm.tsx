/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { sellerLogin } from '../../../Redux Toolkit/Seller/sellerAuthenticationSlice';

const SellerLoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { sellerAuth } = useAppSelector((store) => store);
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Enter a valid email').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: (values) => {
            dispatch(sellerLogin({ email: values.email, password: values.password, navigate }));
        },
    });

    return (
        <div>
            <h1 className="text-center font-bold text-xl text-primary-color pb-5">
                🌾 Seller Login
            </h1>

            <form className="space-y-5" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="seller-login-email"
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email ? formik.errors.email : undefined}
                />

                <TextField
                    fullWidth
                    id="seller-login-password"
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password ? formik.errors.password : undefined}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {sellerAuth.error && (
                    <p className="text-sm text-red-500 text-center">{sellerAuth.error}</p>
                )}

                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={sellerAuth.loading}
                    sx={{ py: '11px' }}
                >
                    {sellerAuth.loading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                        'Login as Seller'
                    )}
                </Button>
            </form>
        </div>
    );
};

export default SellerLoginForm;