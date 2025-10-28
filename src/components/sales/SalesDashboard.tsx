import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FileText, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function SalesDashboard() {
  const metrics = [
    {
      title: 'Total Assigned',
      value: '8',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending Quotations',
      value: '3',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Scheduled Works',
      value: '2',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Completed Jobs',
      value: '12',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const conversionData = [
    { month: 'Jun', converted: 8, pending: 2 },
    { month: 'Jul', converted: 10, pending: 3 },
    { month: 'Aug', converted: 12, pending: 1 },
    { month: 'Sep', converted: 15, pending: 2 },
    { month: 'Oct', converted: 12, pending: 3 },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1 sm:mb-2">Sales Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">Welcome back, Rahul Verma</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
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

      {/* Conversion Chart */}
      <Card>
        <CardHeader className="p-3 sm:p-4 md:p-5">
          <CardTitle className="text-sm sm:text-base md:text-lg">Quotation Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" style={{ fontSize: '10px' }} />
              <YAxis stroke="#666" style={{ fontSize: '10px' }} />
              <Tooltip contentStyle={{ fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '10px' }} iconSize={10} />
              <Bar dataKey="converted" fill="#10b981" name="Converted" />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
