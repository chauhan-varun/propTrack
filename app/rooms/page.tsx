'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
import Link from 'next/link';
import { AddRoomDialog } from '@/components/rooms/add-room-dialog';
import { EditRoomDialog } from '@/components/rooms/edit-room-dialog';
import { EditBillDialog } from '@/components/rooms/edit-bill-dialog';
import { GenerateMonthDialog } from '@/components/rooms/generate-month-dialog';

interface Room {
    id: number;
    number: number;
    tenantName: string | null;
    rent: number;
    status: string;
    bills: Bill[];
}

interface Bill {
    id: number;
    month: string;
    prevUnits: number;
    currUnits: number;
    unitsUsed: number;
    ratePerUnit: number;
    rentAmount: number;
    electricityAmt: number;
    total: number;
    paid: boolean;
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const fetchRooms = async () => {
        try {
            const response = await fetch('/api/rooms');
            const data = await response.json();
            setRooms(data);

            // Set current month as default
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            setSelectedMonth(currentMonth);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const filteredRooms = rooms.filter((room) => {
        const matchesSearch =
            room.number.toString().includes(searchTerm) ||
            (room.tenantName && room.tenantName.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    const handleRoomAdded = () => {
        fetchRooms();
    };

    const handleRoomUpdated = () => {
        fetchRooms();
    };

    const handleBillUpdated = () => {
        fetchRooms();
    };

    const handleMonthGenerated = () => {
        fetchRooms();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Rooms Management</h1>
                        <p className="text-muted-foreground">
                            {rooms.length} / 90 rooms | {rooms.filter((r) => r.status === 'Occupied').length} occupied
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <GenerateMonthDialog onMonthGenerated={handleMonthGenerated} />
                    <AddRoomDialog onRoomAdded={handleRoomAdded} />
                </div>
            </div>

            <div className="flex gap-4 items-center">
                <Input
                    placeholder="Search by room number or tenant name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <Input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="max-w-xs"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Rooms</CardTitle>
                    <CardDescription>View and manage room details and monthly bills</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room No.</TableHead>
                                <TableHead>Tenant Name</TableHead>
                                <TableHead>Rent</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Prev Units</TableHead>
                                <TableHead>Curr Units</TableHead>
                                <TableHead>Units Used</TableHead>
                                <TableHead>Electricity</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRooms.map((room) => {
                                const currentBill = room.bills.find((b) => b.month === selectedMonth);
                                return (
                                    <TableRow key={room.id}>
                                        <TableCell className="font-medium">{room.number}</TableCell>
                                        <TableCell>{room.tenantName || 'N/A'}</TableCell>
                                        <TableCell>₹{room.rent.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant={room.status === 'Occupied' ? 'default' : 'secondary'}>
                                                {room.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{currentBill?.prevUnits ?? '-'}</TableCell>
                                        <TableCell>{currentBill?.currUnits ?? '-'}</TableCell>
                                        <TableCell>{currentBill?.unitsUsed ?? '-'}</TableCell>
                                        <TableCell>₹{currentBill?.electricityAmt.toFixed(2) ?? '0.00'}</TableCell>
                                        <TableCell className="font-semibold">₹{currentBill?.total.toFixed(2) ?? '0.00'}</TableCell>
                                        <TableCell>
                                            {currentBill ? (
                                                <Badge variant={currentBill.paid ? 'default' : 'destructive'}>
                                                    {currentBill.paid ? 'Paid' : 'Unpaid'}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">No Bill</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <EditRoomDialog room={room} onRoomUpdated={handleRoomUpdated} />
                                                {currentBill && (
                                                    <EditBillDialog bill={currentBill} onBillUpdated={handleBillUpdated} />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
