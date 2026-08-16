import { useState } from 'react';
import { Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { deliveryLogin, fetchDeliveryProfile } from '../../../Redux Toolkit/Delivery/deliveryAuthSlice';

const DeliveryLoginForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { deliveryAuth } = useAppSelector(store => store);
    const [showPass, setShowPass] = useState(false);

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Enter a valid email').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: (values) => {
            dispatch(deliveryLogin({ email: values.email, password: values.password, navigate }))
                .unwrap()
                .then(() => { dispatch(fetchDeliveryProfile()); })
                .catch(() => {});
        },
    });

    return (
        <div>
            <h1 className="text-center font-bold text-xl text-primary-color pb-5">
                🚚 Delivery Partner Login
            </h1>
            <form className="space-y-5" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="delivery-login-email"
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
                    id="delivery-login-password"
                    name="password"
                    label="Password"
                    type={showPass ? 'text' : 'password'}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password ? formik.errors.password : undefined}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                                    {showPass ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                {deliveryAuth.error && (
                    <p className="text-sm text-red-500 text-center">{deliveryAuth.error}</p>
                )}
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={deliveryAuth.loading}
                    sx={{ py: '11px', borderRadius: '10px', fontWeight: 700, fontSize: '15px' }}
                >
                    {deliveryAuth.loading
                        ? <CircularProgress size={24} sx={{ color: 'white' }} />
                        : 'Login as Delivery Partner'}
                </Button>
            </form>
        </div>
    );
};

export default DeliveryLoginForm;
