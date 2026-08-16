/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import OTPInput from '../../components/OtpFild/OTPInput'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useNavigate } from 'react-router-dom';
import { sendLoginSignupOtp, signup } from '../../../Redux Toolkit/Customer/AuthSlice';

const SignupForm = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [timer, setTimer] = useState<number>(30);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(store => store);

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Full name is required'),
            email: Yup.string().email('Enter a valid email').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords do not match')
                .required('Please confirm your password'),
        }),
        onSubmit: () => {
            // Triggered after OTP is sent and user clicks Signup
        }
    });

    // Step 1: Validate email+password form, then send OTP
    const handleSendOtp = async () => {
        const errors = await formik.validateForm();
        formik.setTouched({
            fullName: true,
            email: true,
            password: true,
            confirmPassword: true,
        });
        if (Object.keys(errors).length === 0) {
            dispatch(sendLoginSignupOtp({ email: formik.values.email }));
            setTimer(30);
            setIsTimerActive(true);
        }
    };

    // Step 2: Submit with OTP for email verification
    const handleSignup = () => {
        if (otp.length !== 6) return;
        dispatch(signup({
            fullName: formik.values.fullName,
            email: formik.values.email,
            password: formik.values.password,
            otp,
            navigate,
        }));
    };

    const handleResendOtp = () => {
        dispatch(sendLoginSignupOtp({ email: formik.values.email }));
        setTimer(30);
        setIsTimerActive(true);
    };

    useEffect(() => {
        let interval: any;
        if (isTimerActive) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setIsTimerActive(false);
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [isTimerActive]);

    return (
        <div>
            <h1 className='text-center font-bold text-xl text-primary-color pb-5'>Create Account</h1>
            <div className="space-y-4">

                {/* ── Step 1: Basic Info ── */}
                <TextField
                    fullWidth
                    id="signup-fullname"
                    name="fullName"
                    label="Full Name"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                    helperText={formik.touched.fullName ? formik.errors.fullName : undefined}
                    disabled={auth.otpSent}
                />

                <TextField
                    fullWidth
                    id="signup-email"
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email ? formik.errors.email : undefined}
                    disabled={auth.otpSent}
                />

                <TextField
                    fullWidth
                    id="signup-password"
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password ? formik.errors.password : undefined}
                    disabled={auth.otpSent}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                <TextField
                    fullWidth
                    id="signup-confirm-password"
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirm ? 'text' : 'password'}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword ? formik.errors.confirmPassword : undefined}
                    disabled={auth.otpSent}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                {/* ── Step 2: OTP Verification (shown after OTP is sent) ── */}
                {auth.otpSent && (
                    <div className="space-y-2 pt-1">
                        <p className="font-medium text-sm text-gray-700">
                            ✉️ Enter the OTP sent to <span className="font-semibold">{formik.values.email}</span>
                        </p>
                        <OTPInput
                            length={6}
                            onChange={(val: string) => setOtp(val)}
                            error={false}
                        />
                        <p className="text-xs text-gray-500 space-x-1">
                            {isTimerActive ? (
                                <span>Resend OTP in {timer}s</span>
                            ) : (
                                <>
                                    Didn't receive it?{' '}
                                    <span
                                        onClick={handleResendOtp}
                                        className="text-teal-600 cursor-pointer hover:text-teal-800 font-semibold"
                                    >
                                        Resend OTP
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                )}

                {/* ── Buttons ── */}
                {!auth.otpSent ? (
                    <Button
                        fullWidth
                        variant='contained'
                        onClick={handleSendOtp}
                        disabled={auth.loading}
                        sx={{ py: '11px' }}
                    >
                        {auth.loading
                            ? <CircularProgress size={24} sx={{ color: 'white' }} />
                            : 'Send Verification OTP'}
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        variant='contained'
                        onClick={handleSignup}
                        disabled={auth.loading || otp.length !== 6}
                        sx={{ py: '11px' }}
                    >
                        {auth.loading
                            ? <CircularProgress size={24} sx={{ color: 'white' }} />
                            : 'Create Account'}
                    </Button>
                )}

            </div>
        </div>
    )
}

export default SignupForm