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
import { FileEdit } from 'lucide-react';

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

interface EditBillDialogProps {
    bill: Bill;
    onBillUpdated: () => void;
}

export function EditBillDialog({ bill, onBillUpdated }: EditBillDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currUnits: bill.currUnits.toString(),
        ratePerUnit: bill.ratePerUnit.toString(),
        paid: bill.paid,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/bills/${bill.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currUnits: parseInt(formData.currUnits),
                    ratePerUnit: parseFloat(formData.ratePerUnit),
                    paid: formData.paid,
                }),
            });

            if (response.ok) {
                setOpen(false);
                onBillUpdated();
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to update bill');
            }
        } catch (error) {
            console.error('Error updating bill:', error);
            alert('Failed to update bill');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <FileEdit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Bill</DialogTitle>
                    <DialogDescription>Update bill details for {bill.month}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Previous Units (Read-only)</Label>
                        <Input type="number" value={bill.prevUnits} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="currUnits">Current Units *</Label>
                        <Input
                            id="currUnits"
                            type="number"
                            required
                            value={formData.currUnits}
                            onChange={(e) => setFormData({ ...formData, currUnits: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ratePerUnit">Rate Per Unit *</Label>
                        <Input
                            id="ratePerUnit"
                            type="number"
                            step="0.01"
                            required
                            value={formData.ratePerUnit}
                            onChange={(e) => setFormData({ ...formData, ratePerUnit: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="paid">Payment Status *</Label>
                        <Select
                            value={formData.paid ? 'true' : 'false'}
                            onValueChange={(value) => setFormData({ ...formData, paid: value === 'true' })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="false">Unpaid</SelectItem>
                                <SelectItem value="true">Paid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="p-4 bg-muted rounded-lg space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>Units Used:</span>
                            <span className="font-medium">{parseInt(formData.currUnits) - bill.prevUnits}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Rent Amount:</span>
                            <span className="font-medium">₹{bill.rentAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Electricity:</span>
                            <span className="font-medium">
                                ₹{((parseInt(formData.currUnits) - bill.prevUnits) * parseFloat(formData.ratePerUnit)).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-1">
                            <span>Total:</span>
                            <span>
                                ₹
                                {(
                                    bill.rentAmount +
                                    (parseInt(formData.currUnits) - bill.prevUnits) * parseFloat(formData.ratePerUnit)
                                ).toFixed(2)}
                            </span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Bill'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
