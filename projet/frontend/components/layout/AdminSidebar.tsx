'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

import { LayoutDashboard, Package, LogOut, ArrowLeft } from 'lucide-react';

import { cn } from '@/lib/utils';

import { buttonVariants, Button } from '@/components/ui/button';

import { useAuth } from '@/context/AuthContext';

import { Logo } from '@/components/layout/Logo';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },

  { href: '/admin/inventory', label: 'Inventory', icon: Package },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const { logout } = useAuth();

  return (
    <aside className="flex w-64 flex-col border-r bg-card">
      <div className="border-b p-4">
        <Link href="/" className="mb-4 block">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Website
          </Button>
        </Link>

        <Logo href="/admin/dashboard" />

        <p className="mt-2 text-xs text-muted-foreground">Administration</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',

              pathname.startsWith(href)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4" />

            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        <button
          type="button"
          onClick={() => void logout()}
          className={cn(
            buttonVariants({ variant: 'ghost' }),

            'w-full justify-start gap-3',
          )}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
