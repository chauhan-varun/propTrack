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
import { Plus } from 'lucide-react';

interface AddRoomDialogProps {
    onRoomAdded: () => void;
}

export function AddRoomDialog({ onRoomAdded }: AddRoomDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        number: '',
        tenantName: '',
        rent: '',
        status: 'Vacant',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setOpen(false);
                setFormData({ number: '', tenantName: '', rent: '', status: 'Vacant' });
                onRoomAdded();
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to add room');
            }
        } catch (error) {
            console.error('Error adding room:', error);
            alert('Failed to add room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Room
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                    <DialogDescription>Create a new room in the system.</DialogDescription>
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
                            placeholder="Enter room number"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tenantName">Tenant Name</Label>
                        <Input
                            id="tenantName"
                            value={formData.tenantName}
                            onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                            placeholder="Enter tenant name (optional)"
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
                            placeholder="Enter monthly rent"
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
                            {loading ? 'Adding...' : 'Add Room'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
