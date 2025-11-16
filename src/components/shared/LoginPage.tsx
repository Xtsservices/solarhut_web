import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Toaster } from '../ui/sonner';
import { toast } from 'sonner';
import { requestOTP, verifyOTP } from '../../api';
// @ts-ignore: Vite virtual asset provided at build time
import logoImage from '../../assets/image.png';
import { useDispatch } from 'react-redux';

export default function LoginPage({ onLogin }: { onLogin: (mobile: string, otp: string) => void }) {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate mobile number
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('📱 Sending OTP to:', mobile);
      const result = await requestOTP({ mobile });
      
      if (result.ok) {
        setOtpSent(true);
        setCountdown(30); // 30 second countdown
      }
      // Error handling is done automatically by the API module
    } catch (error) {
      console.error('💥 Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate OTP
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔐 Verifying OTP for mobile:', mobile);
      const result = await verifyOTP({ mobile, otp });
      
      if (result.ok) {
        // Token and user data are automatically stored by the API module
        // console.log('🛡️ OTP verified successfully for mobile:', result);
        // console.log('✅ Login successful:', result.data?.user);
        const user = result?.data?.data;
        console.log('user data after login', user);
         if (user) {
          dispatch({
            type: "currentUserData",
            payload: user?.employee,
          });
        }

        localStorage.setItem("authToken", user?.token || '');
        console.log('🛡️ OTP verified successfully for mobile:', user);
        // Call onLogin with mobile and verified OTP
        onLogin(mobile, otp);
      }
      // Error handling is done automatically by the API module
    } catch (error) {
      console.error('💥 Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (countdown === 0) {
      setOtp('');
      setOtpSent(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img
                src={logoImage}
                alt="Solar Hut Solutions Logo"
                className="h-24 sm:h-24 w-auto object-contain"
              />
            </div>
            <h1 className="text-gray-900 mb-2">Portal Login</h1>
            <p className="text-gray-600">{otpSent ? 'Enter OTP sent to your mobile' : 'Login with mobile number'}</p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  required
                />
                {mobile && mobile.length > 0 && mobile.length < 10 && (
                  <p className="text-red-500 text-xs mt-1">Mobile number must be 10 digits</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#FFA500] hover:bg-[#FF8C00] text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="otp">6-Digit OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#FFA500] hover:bg-[#FF8C00] text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <div className="text-center">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={handleResendOtp}
                  disabled={countdown > 0}
                  className="text-[#FFA500] hover:text-[#FF8C00]"
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-900 mb-2">Demo Mobile Numbers:</p>
            <p className="text-xs text-orange-700">Admin: 6301179997</p>
            <p className="text-xs text-orange-600 mt-2">OTP: Use any 6-digit number (e.g., 123456)</p>
          </div>

          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => navigate('/')} className="text-[#FFA500] hover:text-[#FF8C00]">
              Back to Landing Page
            </Button>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
