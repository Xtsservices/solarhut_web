import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';

export function SettingsPage() {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'SolarHut Solutions',
    email: 'info@solarhut.com',
    phone: '+91 1800-SOLAR-HUT',
    address: '123, Solar Plaza, Connaught Place, New Delhi - 110001',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    newEnquiryAlert: true,
    paymentAlert: true,
    jobCompletionAlert: true,
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    timezone: 'Asia/Kolkata',
  });

  const handleSaveCompany = () => {
    toast.success('Company information updated');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification settings updated');
  };

  const handleSavePreferences = () => {
    toast.success('Preferences updated');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your system settings and preferences</p>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList>
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details that will be displayed to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <Label htmlFor="companyName" className="mb-1">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyInfo.name}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, name: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="companyEmail" className="mb-1">Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, email: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="companyPhone" className="mb-1">Phone</Label>
                  <Input
                    id="companyPhone"
                    value={companyInfo.phone}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, phone: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col md:col-span-2">
                  <Label htmlFor="companyAddress" className="mb-1">Address</Label>
                  <Input
                    id="companyAddress"
                    value={companyInfo.address}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, address: e.target.value })
                    }
                  />
                </div>
                <div className="md:col-span-2 flex justify-end mt-2">
                  <Button type="button" onClick={handleSaveCompany}>Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 text-sm">Email Notifications</p>
                  <p className="text-gray-500 text-xs">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked: boolean) =>
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 text-sm">SMS Notifications</p>
                  <p className="text-gray-500 text-xs">
                    Receive notifications via SMS
                  </p>
                </div>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked: boolean) =>
                    setNotifications({ ...notifications, smsNotifications: checked })
                  }
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-gray-900 mb-4">Alert Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 text-sm">New Enquiry Alert</p>
                      <p className="text-gray-500 text-xs">
                        Get notified when a new enquiry is received
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newEnquiryAlert}
                      onCheckedChange={(checked: boolean) =>
                        setNotifications({ ...notifications, newEnquiryAlert: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 text-sm">Payment Alert</p>
                      <p className="text-gray-500 text-xs">
                        Get notified when payment status changes
                      </p>
                    </div>
                    <Switch
                      checked={notifications.paymentAlert}
                      onCheckedChange={(checked: boolean) =>
                        setNotifications({ ...notifications, paymentAlert: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 text-sm">Job Completion Alert</p>
                      <p className="text-gray-500 text-xs">
                        Get notified when a job is completed
                      </p>
                    </div>
                    <Switch
                      checked={notifications.jobCompletionAlert}
                      onCheckedChange={(checked: boolean) =>
                        setNotifications({ ...notifications, jobCompletionAlert: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveNotifications}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>
                Customize your system experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={preferences.timezone}
                  onChange={(e) =>
                    setPreferences({ ...preferences, timezone: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleSavePreferences}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
