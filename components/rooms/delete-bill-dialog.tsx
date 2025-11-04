'use client';

import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface Bill {
    id: number;
    month: string;
}

interface DeleteBillDialogProps {
    bill: Bill | null;
    onBillDeleted: () => void;
}

export function DeleteBillDialog({ bill, onBillDeleted }: DeleteBillDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!bill) return;

        setLoading(true);

        try {
            const response = await fetch(`/api/bills/${bill.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setOpen(false);
                onBillDeleted();
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to delete bill');
            }
        } catch (error) {
            console.error('Error deleting bill:', error);
            alert('Failed to delete bill');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1" disabled={!bill}>
                    <Trash2 className="h-3 w-3" />
                    <span className="text-xs">Delete</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Bill</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the bill for <strong>{bill?.month}</strong>?
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={loading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
