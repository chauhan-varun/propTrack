'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil } from 'lucide-react';

interface Room {
    id: number;
    number: number;
    tenantName: string | null;
    rent: number;
    status: string;
}

interface EditRoomDialogProps {
    room: Room;
    onRoomUpdated: () => void;
}

export function EditRoomDialog({ room, onRoomUpdated }: EditRoomDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        number: room.number.toString(),
        tenantName: room.tenantName || '',
        rent: room.rent.toString(),
        status: room.status,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/rooms/${room.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setOpen(false);
                onRoomUpdated();
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to update room');
            }
        } catch (error) {
            console.error('Error updating room:', error);
            alert('Failed to update room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                    <Pencil className="h-3 w-3" />
                    <span className="text-xs">Room</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Room</DialogTitle>
                    <DialogDescription>Update room details.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="number">Room Number *</Label>
                        <Input
                            id="number"
                            type="number"
                            required
                            value={formData.number}
                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tenantName">Tenant Name</Label>
                        <Input
                            id="tenantName"
                            value={formData.tenantName}
                            onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rent">Monthly Rent *</Label>
                        <Input
                            id="rent"
                            type="number"
                            step="0.01"
                            required
                            value={formData.rent}
                            onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Occupied">Occupied</SelectItem>
                                <SelectItem value="Vacant">Vacant</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Room'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
