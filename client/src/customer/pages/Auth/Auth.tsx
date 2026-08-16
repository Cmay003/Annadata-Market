import { useEffect, useState } from 'react'
import LoginForm from './LoginForm'
import { Alert, Button, Snackbar, Tab, Tabs, Box } from '@mui/material';
import SignupForm from './SignupForm';
import SellerLoginForm from '../BecomeSeller/SellerLoginForm';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useNavigate } from 'react-router-dom';
import DeliveryLoginForm from '../../../delivery/pages/Auth/DeliveryLoginForm';

type RoleType = 'buyer' | 'seller' | 'delivery';

const friendlyError = (msg: string | null) => {
    if (!msg) return '';
    if (msg.toLowerCase().includes('network error') || msg.toLowerCase().includes('err_connection')) {
        return '⚠️ Cannot connect to server. Please make sure the backend is running on port 5454.';
    }
    return msg;
};

const Auth = () => {
    const [role, setRole] = useState<RoleType>('buyer');
    const [isLoginPage, setIsLoginPage] = useState(true);
    const { auth, sellerAuth, deliveryAuth } = useAppSelector(store => store);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState('');
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const showError = (msg: string) => {
        setSnackbarOpen(false); // close first so re-open animation triggers
        setTimeout(() => {
            setSnackMsg(friendlyError(msg));
            setSnackSeverity('error');
            setSnackbarOpen(true);
        }, 50);
    };

    useEffect(() => {
        if (auth.otpSent) {
            setSnackMsg('OTP sent to your email! Check your inbox.');
            setSnackSeverity('success');
            setSnackbarOpen(true);
        }
    }, [auth.otpSent]);

    useEffect(() => {
        if (auth.error) showError(auth.error);
    }, [auth.error]);

    useEffect(() => {
        if (sellerAuth.error) showError(sellerAuth.error);
    }, [sellerAuth.error]);

    useEffect(() => {
        if (deliveryAuth.error) showError(deliveryAuth.error);
    }, [deliveryAuth.error]);

    const handleRoleChange = (_: any, newRole: RoleType) => {
        setRole(newRole);
        setIsLoginPage(true);
    };


    return (
        <div className='flex justify-center h-[90vh] items-center px-4'>
            <div className='max-w-md w-full rounded-2xl border shadow-lg overflow-hidden'>
                <img className='w-full' src="/login_banner.png" alt="Annadata" />

                <div className='px-8 pt-5 pb-8'>
                    {/* ── Role Selector ── */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs
                            value={role}
                            onChange={handleRoleChange}
                            variant="fullWidth"
                            textColor="primary"
                            indicatorColor="primary"
                        >
                            <Tab
                                value="buyer"
                                label={
                                    <span className="flex items-center gap-1.5 font-semibold text-sm">
                                        🛒 Buyer
                                    </span>
                                }
                            />
                            <Tab
                                value="seller"
                                label={
                                    <span className="flex items-center gap-1.5 font-semibold text-sm">
                                        🌾 Farmer
                                    </span>
                                }
                            />
                            <Tab
                                value="delivery"
                                label={
                                    <span className="flex items-center gap-1.5 font-semibold text-sm">
                                        🚚 Delivery
                                    </span>
                                }
                            />
                        </Tabs>
                    </Box>

                    {/* ── Buyer Flow ── */}
                    {role === 'buyer' && (
                        <>
                            {isLoginPage ? <LoginForm /> : <SignupForm />}
                            <div className='flex items-center gap-1 justify-center mt-5'>
                                <p className="text-sm text-gray-600">
                                    {isLoginPage ? "Don't have an account?" : 'Already have an account?'}
                                </p>
                                <Button onClick={() => setIsLoginPage(!isLoginPage)} size='small'>
                                    {isLoginPage ? 'Create account' : 'Login'}
                                </Button>
                            </div>
                        </>
                    )}

                    {/* ── Seller / Farmer Flow ── */}
                    {role === 'seller' && (
                        <>
                            <SellerLoginForm />
                            <div className='mt-6 space-y-3'>
                                <div className='flex items-center gap-3'>
                                    <div className='flex-1 h-px bg-gray-200' />
                                    <span className='text-xs text-gray-400'>or</span>
                                    <div className='flex-1 h-px bg-gray-200' />
                                </div>
                                <Button
                                    fullWidth
                                    variant='outlined'
                                    onClick={() => navigate('/become-seller')}
                                    sx={{
                                        py: '10px', borderRadius: '10px',
                                        borderColor: '#0d9488', color: '#0d9488',
                                        '&:hover': { bgcolor: '#f0fdfa', borderColor: '#059669' }
                                    }}
                                >
                                    🌾 Register as a New Farmer
                                </Button>
                            </div>
                        </>
                    )}

                    {/* ── Delivery Person Flow ── */}
                    {role === 'delivery' && (
                        <>
                            <DeliveryLoginForm />
                            <div className='mt-6 space-y-3'>
                                <div className='flex items-center gap-3'>
                                    <div className='flex-1 h-px bg-gray-200' />
                                    <span className='text-xs text-gray-400'>or</span>
                                    <div className='flex-1 h-px bg-gray-200' />
                                </div>
                                <Button
                                    fullWidth
                                    variant='outlined'
                                    onClick={() => navigate('/delivery-signup')}
                                    sx={{
                                        py: '10px', borderRadius: '10px',
                                        borderColor: '#0891b2', color: '#0891b2',
                                        '&:hover': { bgcolor: '#ecfeff', borderColor: '#0e7490' }
                                    }}
                                >
                                    🚚 Register as a Delivery Partner
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackSeverity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackMsg}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Auth