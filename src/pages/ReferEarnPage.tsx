import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export function ReferEarnPage() {
  const [code, setCode] = useState('');
  const referralCode = 'SHUT-REF-2025';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCode('COPIED');
      setTimeout(() => setCode(''), 1500);
    } catch (e) {
      setCode('FAILED');
      setTimeout(() => setCode(''), 1500);
    }
  };

  return (
    <section className="container mx-auto px-4 py-20 my-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Refer & Earn</h1>
        <p className="text-gray-600 mb-6">
          Refer a friend to Solar Hut Solutions and earn rewards when they book a consultation or installation.
          Share your unique referral code below.
        </p>

        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gray-100 px-4 py-3 rounded-lg text-lg font-mono tracking-wider">{referralCode}</div>
          <Button className="bg-[#FFA500] text-white" onClick={handleCopy}>
            {code === 'COPIED' ? 'Copied' : code === 'FAILED' ? 'Try Again' : 'Copy Code'}
          </Button>
        </div>

        <div className="text-sm text-gray-600 mb-6">
          <p>
            When someone uses your referral code and books a consultation, you'll receive a discount voucher for your next purchase.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/contact" className="text-[#FFA500] hover:underline">Contact Sales</Link>
          <Link to="/" className="text-black hover:underline">Back to Home</Link>
        </div>
      </div>
    </section>
  );
}

export default ReferEarnPage;
