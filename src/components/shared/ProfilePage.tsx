import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { toast } from 'sonner';

import { getProfile, updateProfile } from '../../api/api'; // ⭐ UPDATE: Import updateProfile

export function ProfilePage() {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    role: '',
  });

  // ⭐ FETCH PROFILE FROM API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const result = await getProfile();

      if (result.ok && result.data?.data) {
        const u = result.data.data;

        setProfile({
          firstname: u.first_name,
          lastname: u.last_name,
          email: u.email,
          mobile: u.mobile,
          role: u.role_names_display,
        });
      } else {
        toast.error(result.error || 'Failed to load profile');
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // ⭐ UPDATE PROFILE API (PUT /api/profile)
  const handleSaveProfile = async () => {
    const payload = {
      first_name: profile.firstname,
      last_name: profile.lastname,
      email: profile.email,
      mobile: profile.mobile,
    };

    const result = await updateProfile(payload);

    if (result.ok) {
      toast.success('Profile updated successfully!');

      // Optionally re-fetch updated profile
      // Or just update state
    } else {
      toast.error(result.error);
    }
  };

  if (loading) return <p className="p-8">Loading profile...</p>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* First Name */}
              <div>
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  value={profile.firstname}
                  onChange={(e) => setProfile({ ...profile, firstname: e.target.value })}
                />
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  value={profile.lastname}
                  onChange={(e) => setProfile({ ...profile, lastname: e.target.value })}
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              {/* Mobile */}
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={profile.mobile}
                  onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                />
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={profile.role} disabled />
              </div>

              <Button onClick={handleSaveProfile} className="w-full">
                Save Changes
              </Button>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
