import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Toaster } from '../ui/sonner';
// @ts-ignore: Vite virtual asset provided at build time
import logoImage from '../../assets/image.png';

export default function LoginPage({ onLogin }: { onLogin: (email: string, password: string) => void }) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginEmail, loginPassword);
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
            <p className="text-gray-600">Access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-[#FFA500] hover:bg-[#FF8C00] text-white">
              Login
            </Button>
          </form>

          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-900 mb-2">Demo Credentials:</p>
            <p className="text-xs text-orange-700">Admin: admin@solarhut.com</p>
            <p className="text-xs text-orange-700">Sales: rahul.verma@solarhut.com</p>
            <p className="text-xs text-orange-700">Field: manoj.kumar@solarhut.com</p>
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
