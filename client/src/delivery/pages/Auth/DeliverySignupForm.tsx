import { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    MenuItem,
    Snackbar,
    TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { deliverySignup, clearDeliveryError, fetchDeliveryProfile } from '../../../Redux Toolkit/Delivery/deliveryAuthSlice';

const VEHICLE_TYPES = ['BIKE', 'SCOOTER', 'CAR', 'VAN', 'TEMPO'];

const DeliverySignupForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { deliveryAuth } = useAppSelector(store => store);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);

    useEffect(() => {
        if (deliveryAuth.error) setSnackOpen(true);
    }, [deliveryAuth.error]);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            vehicleType: '',
            vehicleNumber: '',
            currentCity: '',
            currentPincode: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Full name is required'),
            email: Yup.string().email('Enter a valid email').required('Email is required'),
            password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords do not match')
                .required('Please confirm your password'),
            phone: Yup.string().min(10, 'Enter valid phone number').required('Phone is required'),
            vehicleType: Yup.string().required('Vehicle type is required'),
            vehicleNumber: Yup.string().required('Vehicle number is required'),
        }),
        onSubmit: (values) => {
            dispatch(deliverySignup({
                name: values.name,
                email: values.email,
                password: values.password,
                phone: values.phone,
                vehicleType: values.vehicleType,
                vehicleNumber: values.vehicleNumber,
                currentCity: values.currentCity,
                currentPincode: values.currentPincode,
                navigate,
            }))
                .unwrap()
                .then(() => { dispatch(fetchDeliveryProfile()); })
                .catch(() => {});
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12"
            style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
            <div className="w-full max-w-lg">

                {/* ── Header ── */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                        style={{ background: 'linear-gradient(135deg, #00927c22, #00927c44)' }}>
                        <span className="text-3xl">🚚</span>
                    </div>
                    <h1 className="text-3xl font-bold" style={{ color: '#1a2e1a' }}>
                        Become a Delivery Partner
                    </h1>
                    <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>
                        Join Annadata and earn by delivering fresh produce
                    </p>
                </div>

                {/* ── Card ── */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-5"
                    style={{ border: '1.5px solid #d1fae5' }}>

                    {/* Section: Personal Info */}
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#00927c' }}>
                        Personal Information
                    </p>

                    <TextField
                        fullWidth id="dp-name" name="name" label="Full Name"
                        value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name ? formik.errors.name : undefined}
                    />
                    <TextField
                        fullWidth id="dp-email" name="email" label="Email Address" type="email"
                        value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email ? formik.errors.email : undefined}
                    />
                    <TextField
                        fullWidth id="dp-phone" name="phone" label="Phone Number" type="tel"
                        value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone ? formik.errors.phone : undefined}
                    />
                    <TextField
                        fullWidth id="dp-password" name="password" label="Password"
                        type={showPass ? 'text' : 'password'}
                        value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
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
                    <TextField
                        fullWidth id="dp-confirm-pass" name="confirmPassword" label="Confirm Password"
                        type={showConfirm ? 'text' : 'password'}
                        value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword ? formik.errors.confirmPassword : undefined}
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

                    {/* Section: Vehicle Info */}
                    <p className="text-xs font-bold uppercase tracking-wider pt-2" style={{ color: '#00927c' }}>
                        Vehicle Details
                    </p>

                    <TextField
                        fullWidth select id="dp-vehicle-type" name="vehicleType" label="Vehicle Type"
                        value={formik.values.vehicleType} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        error={formik.touched.vehicleType && Boolean(formik.errors.vehicleType)}
                        helperText={formik.touched.vehicleType ? formik.errors.vehicleType : undefined}
                    >
                        {VEHICLE_TYPES.map(v => (
                            <MenuItem key={v} value={v}>{v}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth id="dp-vehicle-num" name="vehicleNumber" label="Vehicle Number (e.g. RJ14AB1234)"
                        value={formik.values.vehicleNumber} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        error={formik.touched.vehicleNumber && Boolean(formik.errors.vehicleNumber)}
                        helperText={formik.touched.vehicleNumber ? formik.errors.vehicleNumber : undefined}
                    />

                    {/* Section: Location (optional) */}
                    <p className="text-xs font-bold uppercase tracking-wider pt-2" style={{ color: '#00927c' }}>
                        Your Area <span className="font-normal normal-case text-gray-400">(Optional — helps us assign nearby orders)</span>
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <TextField
                            fullWidth id="dp-city" name="currentCity" label="City"
                            value={formik.values.currentCity} onChange={formik.handleChange}
                        />
                        <TextField
                            fullWidth id="dp-pincode" name="currentPincode" label="Pincode"
                            value={formik.values.currentPincode} onChange={formik.handleChange}
                        />
                    </div>

                    {/* ── Submit ── */}
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => formik.handleSubmit()}
                        disabled={deliveryAuth.loading}
                        sx={{ py: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '15px' }}
                    >
                        {deliveryAuth.loading
                            ? <CircularProgress size={24} sx={{ color: 'white' }} />
                            : '🚚 Join as Delivery Partner →'}
                    </Button>

                    <div className="text-center text-sm pt-1" style={{ color: '#6b7280' }}>
                        Already have an account?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            className="font-semibold cursor-pointer hover:underline"
                            style={{ color: '#00927c' }}
                        >
                            Login here
                        </span>
                    </div>
                </div>

                {/* Trust badges */}
                <div className="mt-6 flex justify-center gap-6 text-xs" style={{ color: '#9ca3af' }}>
                    <span>🏍️ Flexible hours</span>
                    <span>💰 Earn per delivery</span>
                    <span>🌾 Help farmers reach buyers</span>
                </div>
            </div>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackOpen} autoHideDuration={5000}
                onClose={() => { setSnackOpen(false); dispatch(clearDeliveryError()); }}
            >
                <Alert severity="error" variant="filled" onClose={() => setSnackOpen(false)}>
                    {deliveryAuth.error}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default DeliverySignupForm;
