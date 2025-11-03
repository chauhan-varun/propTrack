'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Building2, LogOut } from 'lucide-react';

export function Header() {
    const { data: session } = useSession();

    if (!session) return null;

    return (
        <header className="border-b bg-white dark:bg-gray-950">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-bold">PropTrack</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        {session.user?.email}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}
