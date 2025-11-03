'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, Home as HomeIcon, DollarSign, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';

interface DashboardData {
  stats: {
    totalRooms: number;
    occupiedRooms: number;
    vacantRooms: number;
    totalCollected: number;
    pendingAmount: number;
    currentMonth: string;
  };
  unpaidBills: Array<{
    id: number;
    month: string;
    total: number;
    room: {
      number: number;
      tenantName: string | null;
    };
  }>;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      // Check if result has the expected structure
      if (!result.stats) {
        throw new Error('Invalid data structure received from API');
      }

      setData(result);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg text-red-500">Failed to load dashboard data</div>
        <p className="text-muted-foreground text-center max-w-md">
          Please ensure your PostgreSQL database is running and properly configured in the .env file.
        </p>
        <Button onClick={fetchDashboard}>Retry</Button>
      </div>
    );
  }

  const { stats, unpaidBills } = data;

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">PropTrack Dashboard</h1>
            <p className="text-muted-foreground">Current Month: {stats.currentMonth}</p>
          </div>
          <Link href="/rooms">
            <Button>Manage Rooms</Button>
          </Link>
        </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
            <p className="text-xs text-muted-foreground">Maximum 90 rooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupiedRooms}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalRooms > 0 ? ((stats.occupiedRooms / stats.totalRooms) * 100).toFixed(1) : 0}% occupancy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacant</CardTitle>
            <HomeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vacantRooms}</div>
            <p className="text-xs text-muted-foreground">Available rooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalCollected.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{unpaidBills.length} unpaid bills</p>
          </CardContent>
        </Card>
      </div>

      {/* Due Payments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Due Payments</CardTitle>
          <CardDescription>List of all unpaid bills across all months</CardDescription>
        </CardHeader>
        <CardContent>
          {unpaidBills.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No pending payments! 🎉</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room No.</TableHead>
                  <TableHead>Tenant Name</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Amount Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unpaidBills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.room.number}</TableCell>
                    <TableCell>{bill.room.tenantName || 'N/A'}</TableCell>
                    <TableCell>{bill.month}</TableCell>
                    <TableCell className="text-right font-semibold">₹{bill.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Unpaid</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      </div>
    </>
  );
}
