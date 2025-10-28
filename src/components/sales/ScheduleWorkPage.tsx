import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { mockFieldExecutives } from '../../lib/mockData';
import { toast } from 'sonner@2.0.3';

interface ScheduleWorkPageProps {
  preSelectedEnquiry?: any;
}

export function ScheduleWorkPage({ preSelectedEnquiry }: ScheduleWorkPageProps) {
  const [formData, setFormData] = useState({
    enquiryId: preSelectedEnquiry?.id || '',
    clientName: preSelectedEnquiry?.fullName || '',
    workDate: '',
    workTime: '',
    address: preSelectedEnquiry?.address || '',
    quotationAmount: '',
    remarks: '',
    fieldExecutiveId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.workDate || !formData.workTime || !formData.quotationAmount || !formData.fieldExecutiveId) {
      toast.error('Please fill all required fields');
      return;
    }

    toast.success('Work scheduled successfully! Field executive has been notified.');
    setFormData({
      enquiryId: '',
      clientName: '',
      workDate: '',
      workTime: '',
      address: '',
      quotationAmount: '',
      remarks: '',
      fieldExecutiveId: '',
    });
  };

  const availableExecutives = mockFieldExecutives.filter(
    (fe) => fe.status === 'available' || fe.status === 'on-job'
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Schedule Work</h1>
        <p className="text-gray-600">Schedule installation work and assign field executive</p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Work Schedule Form</CardTitle>
          <CardDescription>
            Fill in the details to schedule a new installation work
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="enquiryId">Enquiry ID</Label>
                <Input
                  id="enquiryId"
                  value={formData.enquiryId}
                  onChange={(e) => setFormData({ ...formData, enquiryId: e.target.value })}
                  placeholder="ENQ001"
                />
              </div>

              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Client name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workDate">Work Date *</Label>
                <Input
                  id="workDate"
                  type="date"
                  value={formData.workDate}
                  onChange={(e) => setFormData({ ...formData, workDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="workTime">Time *</Label>
                <Input
                  id="workTime"
                  type="time"
                  value={formData.workTime}
                  onChange={(e) => setFormData({ ...formData, workTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Installation address"
              />
            </div>

            <div>
              <Label htmlFor="quotationAmount">Quotation Amount (₹) *</Label>
              <Input
                id="quotationAmount"
                type="number"
                value={formData.quotationAmount}
                onChange={(e) => setFormData({ ...formData, quotationAmount: e.target.value })}
                placeholder="180000"
                required
              />
            </div>

            <div>
              <Label htmlFor="fieldExecutive">Assign to Field Executive *</Label>
              <Select
                value={formData.fieldExecutiveId}
                onValueChange={(value) => setFormData({ ...formData, fieldExecutiveId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field executive..." />
                </SelectTrigger>
                <SelectContent>
                  {availableExecutives.map((fe) => (
                    <SelectItem key={fe.id} value={fe.id}>
                      {fe.name} - {fe.status === 'available' ? '✓ Available' : 'On Job'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="remarks">Remarks / Special Instructions</Label>
              <Textarea
                id="remarks"
                rows={4}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Any special instructions for the field executive..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Schedule Work
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
