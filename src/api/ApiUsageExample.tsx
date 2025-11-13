// src/api/ApiUsageExample.tsx
// This file demonstrates how to use the API module in React components

import React, { useState, useEffect } from 'react';
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  requestOTP, 
  verifyOTP,
  getContacts,
  deleteContact,
  createCancelToken,
  type User,
  type Contact,
  type ApiResponse 
} from './api';
import { toast } from 'sonner';

// Example 1: Authentication Component
export const AuthExample: React.FC = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    setLoading(true);
    const result = await requestOTP({ mobile });
    
    if (result.ok) {
      setOtpSent(true);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    const result = await verifyOTP({ mobile, otp });
    
    if (result.ok) {
      console.log('User logged in:', result.data?.user);
      // Navigate to dashboard or update app state
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2>Authentication Example</h2>
      {!otpSent ? (
        <div>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
            className="border p-2 mr-2"
          />
          <button 
            onClick={handleSendOTP} 
            disabled={loading}
            className="bg-blue-500 text-white p-2"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="border p-2 mr-2"
          />
          <button 
            onClick={handleVerifyOTP} 
            disabled={loading}
            className="bg-green-500 text-white p-2"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}
    </div>
  );
};

// Example 2: Users Management Component
export const UsersExample: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    role: 'employee'
  });

  // Fetch users with cancellation support
  const fetchUsers = async () => {
    setLoading(true);
    const cancelSource = createCancelToken();
    
    try {
      const result = await getUsers(cancelSource.token);
      if (result.ok && result.data) {
        setUsers(result.data);
      }
    } catch (error: any) {
      if (!error.message?.includes('canceled')) {
        console.error('Failed to fetch users:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const handleCreateUser = async () => {
    const result = await createUser(newUser);
    
    if (result.ok) {
      setNewUser({ first_name: '', last_name: '', email: '', mobile: '', role: 'employee' });
      fetchUsers(); // Refresh list
    }
  };

  // Update user
  const handleUpdateUser = async (id: string, updates: Partial<User>) => {
    const result = await updateUser(id, updates);
    
    if (result.ok) {
      fetchUsers(); // Refresh list
    }
  };

  // Delete user
  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await deleteUser(id);
      
      if (result.ok) {
        fetchUsers(); // Refresh list
      }
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Cleanup function to cancel any ongoing requests
    const cancelSource = createCancelToken();
    return () => {
      cancelSource.cancel('Component unmounted');
    };
  }, []);

  return (
    <div className="p-4">
      <h2>Users Management Example</h2>
      
      {/* Create User Form */}
      <div className="mb-4 p-4 border">
        <h3>Create New User</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={newUser.first_name}
            onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
            placeholder="First Name"
            className="border p-2"
          />
          <input
            type="text"
            value={newUser.last_name}
            onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
            placeholder="Last Name"
            className="border p-2"
          />
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Email"
            className="border p-2"
          />
          <input
            type="tel"
            value={newUser.mobile}
            onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
            placeholder="Mobile"
            className="border p-2"
          />
        </div>
        <button 
          onClick={handleCreateUser}
          className="bg-green-500 text-white p-2 mt-2"
        >
          Create User
        </button>
      </div>

      {/* Users List */}
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <div>
          <h3>Users List ({users.length})</h3>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="border p-2 flex justify-between items-center">
                <div>
                  <strong>{user.first_name} {user.last_name}</strong>
                  <br />
                  <small>{user.email} | {user.mobile} | {user.role}</small>
                </div>
                <div>
                  <button 
                    onClick={() => handleUpdateUser(user.id, { status: 'inactive' })}
                    className="bg-yellow-500 text-white p-1 mr-2"
                  >
                    Deactivate
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white p-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Example 3: Contacts Management Component
export const ContactsExample: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    const result = await getContacts();
    
    if (result.ok && result.data) {
      setContacts(result.data);
    }
    setLoading(false);
  };

  const handleDeleteContact = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      const result = await deleteContact(id);
      
      if (result.ok) {
        fetchContacts(); // Refresh list
      }
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="p-4">
      <h2>Contacts Management Example</h2>
      
      {loading ? (
        <div>Loading contacts...</div>
      ) : (
        <div>
          <h3>Contacts List ({contacts.length})</h3>
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div key={contact.id} className="border p-2 flex justify-between items-center">
                <div>
                  <strong>{contact.full_name}</strong>
                  <br />
                  <small>{contact.email} | {contact.mobile}</small>
                  <br />
                  <small>{contact.reason}: {contact.message}</small>
                </div>
                <button 
                  onClick={() => handleDeleteContact(contact.id)}
                  className="bg-red-500 text-white p-1"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Example 4: Error Handling and Loading States
export const ErrorHandlingExample: React.FC = () => {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleApiCall = async () => {
    setLoading(true);
    setResult(null);
    
    // This will likely fail for demonstration
    const result = await getUsers();
    setResult(result);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2>Error Handling Example</h2>
      
      <button 
        onClick={handleApiCall}
        disabled={loading}
        className="bg-blue-500 text-white p-2"
      >
        {loading ? 'Loading...' : 'Make API Call'}
      </button>
      
      {result && (
        <div className="mt-4 p-4 border">
          <h3>Result:</h3>
          <div className={result.ok ? 'text-green-600' : 'text-red-600'}>
            <strong>Status:</strong> {result.ok ? 'Success' : 'Error'}
          </div>
          {result.error && (
            <div className="text-red-600">
              <strong>Error:</strong> {result.error}
            </div>
          )}
          {result.data && (
            <div>
              <strong>Data:</strong>
              <pre className="text-sm bg-gray-100 p-2 mt-2">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Combined Examples Component
export const ApiExamples: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API Module Usage Examples</h1>
      
      <div className="space-y-8">
        <AuthExample />
        <hr />
        <UsersExample />
        <hr />
        <ContactsExample />
        <hr />
        <ErrorHandlingExample />
      </div>
    </div>
  );
};