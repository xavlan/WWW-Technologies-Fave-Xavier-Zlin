'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/inventory', label: 'Inventory', icon: Package },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'TechInventory';

  return (
    <aside className="flex w-64 flex-col border-r bg-card">
      <div className="border-b p-6">
        <Link href="/admin/dashboard" className="text-lg font-bold text-primary">
          {appName}
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">Admin Panel</p>
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
