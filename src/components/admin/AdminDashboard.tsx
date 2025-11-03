import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FileText, CheckCircle2, Clock, IndianRupee, Users, Wrench } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  // ...existing code...
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const monthOrder = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

  // ...existing code...


  // ...existing code...

  // ...existing code...

  // Place this after enquiryOverviewData declaration

  const metrics = [
    {
      title: 'Total Enquiries',
      value: '47',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'New Enquiries',
      value: '12',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Completed Jobs',
      value: '28',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Revenue',
      value: '₹42.5L',
      icon: IndianRupee,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Active Sales Persons',
      value: '8',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Field Executives',
      value: '12',
      icon: Wrench,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];


  const enquiryOverviewData = [
    { month: 'Jun', new: 15, assigned: 12, completed: 10 },
    { month: 'Jul', new: 20, assigned: 18, completed: 15 },
    { month: 'Aug', new: 18, assigned: 15, completed: 12 },
    { month: 'Sep', new: 25, assigned: 22, completed: 20 },
    { month: 'Oct', new: 22, assigned: 20, completed: 18 },
  ];


  const paymentData = [
    { name: 'Paid', value: 28, color: '#10b981' },
    { name: 'Pending', value: 7, color: '#f59e0b' },
  ];


  const salesPerformanceData = [
    { name: 'Rahul V.', closed: 12, pending: 3 },
    { name: 'Neha K.', closed: 15, pending: 2 },
    { name: 'Suresh N.', closed: 10, pending: 1 },
    { name: 'Priya S.', closed: 8, pending: 4 },
  ];

  // Field Executive Work Status (Line Chart)
  const fieldWorkData = [
    { month: 'Jun', completed: 10, inProgress: 2 },
    { month: 'Jul', completed: 15, inProgress: 3 },
    { month: 'Aug', completed: 12, inProgress: 2 },
    { month: 'Sep', completed: 20, inProgress: 4 },
    { month: 'Oct', completed: 18, inProgress: 3 },
  ];

  // Filter Enquiry Overview Data for chart
  let filteredEnquiryOverviewData = enquiryOverviewData;
  if (startDate || endDate) {
    // Filter by start and end date (month/year)
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    filteredEnquiryOverviewData = enquiryOverviewData.filter((item) => {
      // Assume all data is for 2025, and item.month is short month name
      const itemMonthIndex = monthOrder.indexOf(item.month);
      let startIndex = 0;
      let endIndex = monthOrder.length - 1;
      if (start) startIndex = start.getMonth() - 5; // Jun=5, Jul=6, ...
      if (end) endIndex = end.getMonth() - 5;
      return itemMonthIndex >= startIndex && itemMonthIndex <= endIndex;
    });
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1 sm:mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">Overview of your solar business operations</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-3 sm:p-4 md:p-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg ${metric.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${metric.color}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-0.5 truncate">{metric.title}</p>
                    <p className="text-gray-900">{metric.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="p-3 sm:p-4 md:p-5">
            <div className="flex flex-col gap-2 mt-2">
              <CardTitle className="text-sm sm:text-base md:text-lg">Enquiry Overview</CardTitle>
              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="flex flex-col w-full">
                  <span className="text-xs text-gray-600 mb-1">Start Date</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="border rounded px-2 py-1 text-xs min-w-[120px] w-full"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <span className="text-xs text-gray-600 mb-1">End Date</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="border rounded px-2 py-1 text-xs min-w-[120px] w-full"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={filteredEnquiryOverviewData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" style={{ fontSize: '10px' }} />
                <YAxis stroke="#666" style={{ fontSize: '10px' }} />
                <Tooltip contentStyle={{ fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} iconSize={10} />
                <Bar dataKey="new" fill="#f59e0b" name="New" />
                <Bar dataKey="assigned" fill="#3b82f6" name="Assigned" />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-4 md:p-5">
            <CardTitle className="text-sm sm:text-base md:text-lg">Payment Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ fontSize: '11px' }}
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 sm:p-4 md:p-5">
            <CardTitle className="text-sm sm:text-base md:text-lg">Sales Person Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={salesPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#666" style={{ fontSize: '10px' }} />
                <YAxis type="category" dataKey="name" stroke="#666" width={60} style={{ fontSize: '9px' }} />
                <Tooltip contentStyle={{ fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} iconSize={10} />
                <Bar dataKey="closed" fill="#10b981" name="Closed" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

       
      </div>
    </div>
  );
}
