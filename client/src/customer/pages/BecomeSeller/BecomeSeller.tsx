/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Alert,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { registerSeller, sendSellerOtp, resetSellerAuthState } from '../../../Redux Toolkit/Seller/sellerAuthenticationSlice';
import OTPInput from '../../components/OtpFild/OTPInput';

const BecomeSeller = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { sellerAuth } = useAppSelector((store) => store);

    const [otp, setOtp] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [timer, setTimer] = useState(30);
    const [timerActive, setTimerActive] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);

    // ── Reset auth state on first mount so form always starts fresh ──────
    useEffect(() => {
        dispatch(resetSellerAuthState());
    }, []);

    // Show snackbar on error or OTP sent
    useEffect(() => {
        if (sellerAuth.error || sellerAuth.otpSent) setSnackOpen(true);
    }, [sellerAuth.error, sellerAuth.otpSent]);

    // Countdown timer for OTP resend
    useEffect(() => {
        let interval: any;
        if (timerActive) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 1) { clearInterval(interval); setTimerActive(false); return 30; }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [timerActive]);

    const formik = useFormik({
        initialValues: { fullName: '', email: '', password: '', confirmPassword: '' },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Full name is required'),
            email: Yup.string().email('Enter a valid email').required('Email is required'),
            password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords do not match')
                .required('Please confirm your password'),
        }),
        onSubmit: () => {},
    });

    const handleSendOtp = async () => {
        const errors = await formik.validateForm();
        formik.setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
        if (Object.keys(errors).length === 0) {
            dispatch(sendSellerOtp(formik.values.email));
            setTimer(30);
            setTimerActive(true);
        }
    };

    const handleRegister = () => {
        if (otp.length !== 6) return;
        dispatch(registerSeller({
            fullName: formik.values.fullName,
            email: formik.values.email,
            password: formik.values.password,
            otp,
            navigate,
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
                        <span className="text-3xl">🌾</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Become a Seller</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Create your seller account and start selling on Annadata
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
                    <TextField
                        fullWidth id="seller-fullname" name="fullName" label="Full Name"
                        value={formik.values.fullName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                        helperText={formik.touched.fullName ? formik.errors.fullName : undefined}
                        disabled={sellerAuth.otpSent}
                    />

                    <TextField
                        fullWidth id="seller-email" name="email" label="Email Address" type="email"
                        value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email ? formik.errors.email : undefined}
                        disabled={sellerAuth.otpSent}
                    />

                    <TextField
                        fullWidth id="seller-password" name="password" label="Password"
                        type={showPass ? 'text' : 'password'}
                        value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password ? formik.errors.password : undefined}
                        disabled={sellerAuth.otpSent}
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

                    <TextField
                        fullWidth id="seller-confirm-password" name="confirmPassword" label="Confirm Password"
                        type={showConfirm ? 'text' : 'password'}
                        value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword ? formik.errors.confirmPassword : undefined}
                        disabled={sellerAuth.otpSent}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* OTP Section */}
                    {sellerAuth.otpSent && (
                        <div className="space-y-3 pt-1">
                            <p className="text-sm font-medium text-gray-700">
                                ✉️ OTP sent to <span className="font-semibold">{formik.values.email}</span>
                            </p>
                            <OTPInput length={6} onChange={(val: string) => setOtp(val)} error={false} />
                            <p className="text-xs text-gray-500">
                                {timerActive ? (
                                    <span>Resend OTP in {timer}s</span>
                                ) : (
                                    <>
                                        Didn't receive it?{' '}
                                        <span
                                            onClick={handleSendOtp}
                                            className="text-teal-600 cursor-pointer hover:text-teal-800 font-semibold"
                                        >
                                            Resend OTP
                                        </span>
                                    </>
                                )}
                            </p>
                        </div>
                    )}

                    {/* CTA Button */}
                    {!sellerAuth.otpSent ? (
                        <Button
                            fullWidth variant="contained" onClick={handleSendOtp}
                            disabled={sellerAuth.loading}
                            sx={{ py: '12px', borderRadius: '10px', fontWeight: 600, fontSize: '15px' }}
                        >
                            {sellerAuth.loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Verification OTP'}
                        </Button>
                    ) : (
                        <Button
                            fullWidth variant="contained" onClick={handleRegister}
                            disabled={sellerAuth.loading || otp.length !== 6}
                            sx={{ py: '12px', borderRadius: '10px', fontWeight: 600, fontSize: '15px',
                                background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' }}
                        >
                            {sellerAuth.loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Seller Account →'}
                        </Button>
                    )}

                    <div className="text-center text-sm text-gray-500 pt-1">
                        Already have a seller account?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            className="text-teal-600 font-semibold cursor-pointer hover:underline"
                        >
                            Login here
                        </span>
                    </div>
                </div>

                {/* Trust badges */}
                <div className="mt-6 flex justify-center gap-6 text-xs text-gray-400">
                    <span>✅ Free to join</span>
                    <span>🔒 Secure & verified</span>
                    <span>🌾 Direct to buyer</span>
                </div>
            </div>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackOpen} autoHideDuration={5000}
                onClose={() => setSnackOpen(false)}
            >
                <Alert severity={sellerAuth.error ? 'error' : 'success'} variant="filled" onClose={() => setSnackOpen(false)}>
                    {sellerAuth.error || 'OTP sent! Check your inbox.'}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default BecomeSeller;
