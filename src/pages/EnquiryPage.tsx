import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/landing/Header';

const Footer = () => (
  <footer className="bg-gray-100 mt-12 py-6">
    <div className="container mx-auto px-4 text-center text-sm text-gray-600">
      © {new Date().getFullYear()} SolarHut — All rights reserved.
    </div>
  </footer>
);

const enquiryImg = new URL('../assets/SolarHutImages/image.png', import.meta.url).href;

export function EnquiryPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const navigate = useNavigate();

  const validateField = (field: string, value: string) => {
    let error = '';
    if (field === 'name' && (!value.trim() || value.trim().length < 3)) error = 'Name is required and must be at least 3 characters';
    if (field === 'phone' && (!value.trim() || !/^[6-9]\d{9}$/.test(value))) error = 'Enter a valid 10-digit Indian mobile number';
    if (field === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) error = 'Enter a valid email address';
    if (field === 'message' && (!value.trim() || value.trim().length < 10)) error = 'Message is required and must be at least 10 characters';
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid =
      validateField('name', name) &&
      validateField('phone', phone) &&
      validateField('email', email) &&
      validateField('message', message);

    if (!isValid) return;

    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setErrors({ name: '', phone: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto bg-white rounded shadow overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-96 md:h-auto flex-shrink-0">
          <img src={enquiryImg} alt="Solar installation" className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold mb-4">Enquiry Form</h1>
          <p className="mb-6 text-sm text-gray-600">Please fill out the form below and our sales team will get in touch within 1 working day.</p>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={(e) => validateField('name', e.target.value)}
                  className={`w-full border rounded px-3 py-2 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Asha Rao"
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mobile (WhatsApp)</label>
                <input
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(digits);
                  }}
                  onBlur={(e) => validateField('phone', phone)}
                  className={`w-full border rounded px-3 py-2 ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="9812345678"
                  inputMode="tel"
                  pattern="[6-9][0-9]{9}"
                  title="Enter a valid 10-digit Indian mobile number starting with 6-9."
                  required
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => validateField('email', e.target.value)}
                  className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="asha@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onBlur={(e) => validateField('message', e.target.value)}
                  className={`w-full border rounded px-3 py-2 h-32 ${errors.message ? 'border-red-500' : ''}`}
                  placeholder="Tell us about your project (location, rooftop area, budget)..."
                  required
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded border w-full sm:w-auto">Cancel</button>
                <button className="bg-[#FFA500] text-white px-4 py-2 rounded font-medium w-full sm:w-auto">Send Enquiry</button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <p className="text-green-600 font-medium">Thank you — your enquiry has been sent. We'll contact you soon.</p>
            </div>
          )}
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
