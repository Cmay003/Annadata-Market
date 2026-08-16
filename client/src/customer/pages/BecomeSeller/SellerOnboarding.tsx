/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Alert,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    LinearProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { completeSellerOnboarding } from '../../../Redux Toolkit/Seller/sellerAuthenticationSlice';
import { fetchSellerProfile } from '../../../Redux Toolkit/Seller/sellerSlice';

// ─── Step icons ────────────────────────────────────────────────────────────
const STEPS = [
    { label: 'Tax Details',     icon: '📄' },
    { label: 'Store Details',   icon: '🏪' },
    { label: 'Pickup Address',  icon: '📍' },
    { label: 'Bank Details',    icon: '🏦' },
];

// ─── Validation schemas per step ───────────────────────────────────────────
const stepSchemas = [
    // Step 0 — Tax Details
    Yup.object({
        gstin:      Yup.string().required('GSTIN is required'),
        panNumber:  Yup.string()
            .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g. ABCDE1234F)')
            .required('PAN number is required'),
        panName:    Yup.string().required('Name as on PAN is required'),
    }),
    // Step 1 — Store Details
    Yup.object({
        storeName: Yup.string().min(2, 'Store name too short').required('Store name is required'),
    }),
    // Step 2 — Pickup Address
    Yup.object({
        pincode: Yup.string().matches(/^\d{6}$/, 'Enter a valid 6-digit PIN code').required('PIN code is required'),
        city:    Yup.string().required('City is required'),
        state:   Yup.string().required('State is required'),
        street:  Yup.string().required('Area / street is required'),
    }),
    // Step 3 — Bank Details
    Yup.object({
        accountHolderName: Yup.string().required('Account holder name is required'),
        accountNumber:     Yup.string().matches(/^\d{9,18}$/, 'Invalid account number').required('Account number is required'),
        confirmAccountNumber: Yup.string()
            .oneOf([Yup.ref('accountNumber')], 'Account numbers do not match')
            .required('Please confirm account number'),
        ifscCode: Yup.string()
            .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code (e.g. HDFC0001234)')
            .required('IFSC code is required'),
    }),
];

const SellerOnboarding = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { sellerAuth } = useAppSelector((store) => store);
    const [activeStep, setActiveStep] = useState(0);
    const [snackOpen, setSnackOpen] = useState(false);
    const [showAccountNo, setShowAccountNo] = useState(false);
    const [showConfirmAccountNo, setShowConfirmAccountNo] = useState(false);

    useEffect(() => {
        // If no seller JWT, redirect to signup
        if (!localStorage.getItem('seller_jwt')) navigate('/become-seller');
    }, [navigate]);

    useEffect(() => {
        if (sellerAuth.error) setSnackOpen(true);
    }, [sellerAuth.error]);

    const formik = useFormik({
        initialValues: {
            // Tax
            gstin: '',
            panNumber: '',
            panName: '',
            panDocumentUrl: '',
            // Store
            storeName: '',
            // Address
            pincode: '',
            city: '',
            state: '',
            street: '',
            // Bank
            accountHolderName: '',
            accountNumber: '',
            confirmAccountNumber: '',
            ifscCode: '',
        },
        validationSchema: stepSchemas[activeStep],
        validateOnChange: true,
        onSubmit: () => {},
    });

    const handleNext = async () => {
        // Validate current step
        const errors = await formik.validateForm();
        const stepFields: Record<number, string[]> = {
            0: ['gstin', 'panNumber', 'panName'],
            1: ['storeName'],
            2: ['pincode', 'city', 'state', 'street'],
            3: ['accountHolderName', 'accountNumber', 'confirmAccountNumber', 'ifscCode'],
        };
        const touched: any = {};
        stepFields[activeStep].forEach((f) => (touched[f] = true));
        formik.setTouched({ ...formik.touched, ...touched });

        const stepErrors = stepFields[activeStep].filter((f) => errors[f as keyof typeof errors]);
        if (stepErrors.length > 0) return;

        if (activeStep < STEPS.length - 1) {
            setActiveStep((s) => s + 1);
        } else {
            // Final step — submit onboarding, await profile fetch, THEN navigate to /seller
            const { confirmAccountNumber, ...submitData } = formik.values;
            dispatch(completeSellerOnboarding({ onboardingData: submitData }))
                .unwrap()
                .then(async () => {
                    const jwt = localStorage.getItem('seller_jwt') || '';
                    await dispatch(fetchSellerProfile(jwt));
                    navigate('/seller');
                })
                .catch(() => {}); // error already in sellerAuth.error
        }
    };

    const handleBack = () => setActiveStep((s) => s - 1);
    const progress = ((activeStep) / STEPS.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Step {activeStep + 1} of {STEPS.length} — {STEPS[activeStep].label}
                    </p>
                    <LinearProgress
                        variant="determinate" value={progress}
                        sx={{ mt: 2, height: 6, borderRadius: 3,
                            '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #059669, #0d9488)' },
                            bgcolor: '#d1fae5' }}
                    />
                </div>

                {/* Stepper */}
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {STEPS.map((step, i) => (
                        <Step key={step.label} completed={i < activeStep}>
                            <StepLabel>
                                <span className="text-xs font-medium">{step.label}</span>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {/* Step Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* ── Step 0: Tax Details ── */}
                    {activeStep === 0 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">📄</span>
                                <div>
                                    <Typography variant="h6" fontWeight={700}>Tax & Identity Details</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Required for GST compliance and seller verification
                                    </Typography>
                                </div>
                            </div>

                            <TextField
                                fullWidth id="gstin" name="gstin" label="GSTIN Number"
                                placeholder="e.g. 22AAAAA0000A1Z5"
                                value={formik.values.gstin} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                error={formik.touched.gstin && Boolean(formik.errors.gstin)}
                                helperText={formik.touched.gstin ? formik.errors.gstin : 'Your 15-digit GST Identification Number'}
                                InputProps={{ style: { fontFamily: 'monospace', letterSpacing: '1px' } }}
                            />

                            <TextField
                                fullWidth id="panNumber" name="panNumber" label="PAN Number"
                                placeholder="e.g. ABCDE1234F"
                                inputProps={{ style: { textTransform: 'uppercase' } }}
                                value={formik.values.panNumber.toUpperCase()}
                                onChange={(e) => formik.setFieldValue('panNumber', e.target.value.toUpperCase())}
                                onBlur={formik.handleBlur}
                                error={formik.touched.panNumber && Boolean(formik.errors.panNumber)}
                                helperText={formik.touched.panNumber ? formik.errors.panNumber : '10-character Permanent Account Number'}
                                InputProps={{ style: { fontFamily: 'monospace', letterSpacing: '2px' } }}
                            />

                            <TextField
                                fullWidth id="panName" name="panName" label="Name as on PAN"
                                placeholder="Exactly as printed on your PAN card"
                                value={formik.values.panName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                error={formik.touched.panName && Boolean(formik.errors.panName)}
                                helperText={formik.touched.panName ? formik.errors.panName : undefined}
                            />

                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                <p className="text-sm text-amber-700 font-medium">📤 PAN Document Upload</p>
                                <p className="text-xs text-amber-600 mt-1">
                                    PAN document upload will be available after account creation.
                                    Our team will contact you via email for document verification.
                                </p>
                            </div>

                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <p className="text-xs text-blue-600">
                                    🔒 PAN verification typically takes <strong>1–2 business days</strong>.
                                    You'll be notified by email once verified.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Step 1: Store Details ── */}
                    {activeStep === 1 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">🏪</span>
                                <div>
                                    <Typography variant="h6" fontWeight={700}>Your Farm / Store Details</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        This is how buyers will see your store on Annadata
                                    </Typography>
                                </div>
                            </div>

                            <TextField
                                fullWidth id="storeName" name="storeName" label="Farm / Store Name"
                                placeholder="e.g. Green Valley Organic Farm"
                                value={formik.values.storeName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                error={formik.touched.storeName && Boolean(formik.errors.storeName)}
                                helperText={formik.touched.storeName ? formik.errors.storeName : 'Choose a unique, memorable name for your store'}
                            />

                            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-sm text-teal-700">
                                💡 <strong>Tips for a good store name:</strong>
                                <ul className="list-disc ml-4 mt-1 space-y-1 text-xs">
                                    <li>Include your location or specialty (e.g. "Pune Organic Farm")</li>
                                    <li>Keep it short and easy to remember</li>
                                    <li>Avoid special characters</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* ── Step 2: Pickup Address ── */}
                    {activeStep === 2 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">📍</span>
                                <div>
                                    <Typography variant="h6" fontWeight={700}>Pickup Address</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Where should we pick up orders from your farm?
                                    </Typography>
                                </div>
                            </div>

                            <TextField
                                fullWidth id="pincode" name="pincode" label="PIN Code"
                                placeholder="6-digit PIN code"
                                value={formik.values.pincode} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                                helperText={formik.touched.pincode ? formik.errors.pincode : undefined}
                                inputProps={{ maxLength: 6 }}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <TextField
                                    fullWidth id="city" name="city" label="City / Town"
                                    value={formik.values.city} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    error={formik.touched.city && Boolean(formik.errors.city)}
                                    helperText={formik.touched.city ? formik.errors.city : undefined}
                                />
                                <TextField
                                    fullWidth id="state" name="state" label="State"
                                    value={formik.values.state} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    error={formik.touched.state && Boolean(formik.errors.state)}
                                    helperText={formik.touched.state ? formik.errors.state : undefined}
                                />
                            </div>

                            <TextField
                                fullWidth id="street" name="street" label="Area / Street / Village"
                                placeholder="House No., Village / Colony / Area"
                                multiline rows={2}
                                value={formik.values.street} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                error={formik.touched.street && Boolean(formik.errors.street)}
                                helperText={formik.touched.street ? formik.errors.street : undefined}
                            />
                        </div>
                    )}

                    {/* ── Step 3: Bank Details ── */}
                    {activeStep === 3 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">🏦</span>
                                <div>
                                    <Typography variant="h6" fontWeight={700}>Bank Account Details</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Payments from orders will be transferred here
                                    </Typography>
                                </div>
                            </div>

                            <TextField
                                fullWidth id="accountHolderName" name="accountHolderName" label="Account Holder Name"
                                placeholder="Exactly as on your bank account"
                                value={formik.values.accountHolderName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                error={formik.touched.accountHolderName && Boolean(formik.errors.accountHolderName)}
                                helperText={formik.touched.accountHolderName ? formik.errors.accountHolderName : undefined}
                            />

                            <TextField
                                fullWidth id="accountNumber" name="accountNumber" label="Bank Account Number"
                                type={showAccountNo ? 'text' : 'password'}
                                value={formik.values.accountNumber} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                                helperText={formik.touched.accountNumber ? formik.errors.accountNumber : undefined}
                                InputProps={{
                                    style: { fontFamily: 'monospace' },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowAccountNo(!showAccountNo)} edge="end">
                                                {showAccountNo ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth id="confirmAccountNumber" name="confirmAccountNumber" label="Re-enter Account Number"
                                type={showConfirmAccountNo ? 'text' : 'password'}
                                value={formik.values.confirmAccountNumber} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                error={formik.touched.confirmAccountNumber && Boolean(formik.errors.confirmAccountNumber)}
                                helperText={formik.touched.confirmAccountNumber ? formik.errors.confirmAccountNumber : undefined}
                                InputProps={{
                                    style: { fontFamily: 'monospace' },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirmAccountNo(!showConfirmAccountNo)} edge="end">
                                                {showConfirmAccountNo ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth id="ifscCode" name="ifscCode" label="IFSC Code"
                                placeholder="e.g. HDFC0001234"
                                inputProps={{ style: { textTransform: 'uppercase' } }}
                                value={formik.values.ifscCode.toUpperCase()}
                                onChange={(e) => formik.setFieldValue('ifscCode', e.target.value.toUpperCase())}
                                onBlur={formik.handleBlur}
                                error={formik.touched.ifscCode && Boolean(formik.errors.ifscCode)}
                                helperText={formik.touched.ifscCode ? formik.errors.ifscCode : '11-character bank branch code'}
                                InputProps={{ style: { fontFamily: 'monospace', letterSpacing: '1px' } }}
                            />

                            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700">
                                🔒 Your bank details are encrypted and stored securely. We never share them with third parties.
                            </div>
                        </div>
                    )}

                    {/* ── Navigation Buttons ── */}
                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
                        <Button
                            variant="outlined" onClick={handleBack}
                            disabled={activeStep === 0}
                            sx={{ px: 4, py: 1.5, borderRadius: '10px' }}
                        >
                            ← Back
                        </Button>

                        <Button
                            variant="contained" onClick={handleNext}
                            disabled={sellerAuth.loading}
                            sx={{
                                px: 4, py: 1.5, borderRadius: '10px', fontWeight: 600,
                                background: activeStep === STEPS.length - 1
                                    ? 'linear-gradient(135deg, #059669 0%, #0d9488 100%)'
                                    : undefined,
                            }}
                        >
                            {sellerAuth.loading ? (
                                <CircularProgress size={22} sx={{ color: 'white' }} />
                            ) : activeStep === STEPS.length - 1 ? (
                                '✅ Submit & Complete'
                            ) : (
                                'Continue →'
                            )}
                        </Button>
                    </div>
                </div>

                {/* Step summary dots */}
                <div className="flex justify-center gap-2 mt-5">
                    {STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                i === activeStep ? 'bg-teal-500 w-6' : i < activeStep ? 'bg-teal-300' : 'bg-gray-200'
                            }`}
                        />
                    ))}
                </div>
            </div>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackOpen} autoHideDuration={5000}
                onClose={() => setSnackOpen(false)}
            >
                <Alert severity="error" variant="filled" onClose={() => setSnackOpen(false)}>
                    {sellerAuth.error}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SellerOnboarding;
