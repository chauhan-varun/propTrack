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
import { Calendar } from 'lucide-react';

interface GenerateMonthDialogProps {
    onMonthGenerated: () => void;
}

export function GenerateMonthDialog({ onMonthGenerated }: GenerateMonthDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/bills/generate-month', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ month }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                setOpen(false);
                setMonth('');
                onMonthGenerated();
            } else {
                alert(result.error || 'Failed to generate month records');
            }
        } catch (error) {
            console.error('Error generating month:', error);
            alert('Failed to generate month records');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Generate New Month
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate New Month Records</DialogTitle>
                    <DialogDescription>
                        Create bills for all occupied rooms for a new month. Previous readings will be copied automatically.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="month">Select Month *</Label>
                        <Input
                            id="month"
                            type="month"
                            required
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                            This will create new bill records for all occupied rooms with previous month&apos;s current readings as starting values.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Generating...' : 'Generate Records'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
