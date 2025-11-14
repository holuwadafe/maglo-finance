"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
// import { Button } from "@/components/ui/button";
// import { ThemeToggle } from "@/components/ui/theme-toggle";
// import { authService } from "@/lib/services/auth-service";
import { LogOut, LayoutDashboard, CreditCard, Wallet, Settings, HelpCircle, Menu, X, Bell, Search } from "lucide-react";
import Image from "next/image";
import Logo from "@/Assest/Logo (1).png";
import Exclude from "@/Assest/Exclude.png";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getPageTitle = () => {
    if (pathname.includes('/invoices')) return 'Invoices';
    if (pathname.includes('/transactions')) return 'Transactions';
    if (pathname.includes('/wallets')) return 'My Wallets';
    if (pathname.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", key: "dashboard" },
    { icon: CreditCard, label: "Transactions", href: "/dashboard/invoices", key: "transactions" },
    { icon: CreditCard, label: "Invoices", href: "/dashboard/invoices", key: "invoices" },
    { icon: Wallet, label: "My Wallets", href: "/dashboard/wallets", key: "wallets" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", key: "settings" },
  ];

  const getActiveMenuItem = () => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname.includes('/invoices')) return 'invoices';
    if (pathname.includes('/wallets')) return 'wallets';
    if (pathname.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-950">
      {/* Sidebar (fixed) */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-20'} bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 transition-all duration-300 flex flex-col fixed h-screen z-50 left-0 top-0`}>
        {/* Logo */}
        <div className="p-6 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md overflow-hidden bg-transparent dark:bg-slate-800 flex items-center justify-center">
              <Image src={Exclude} alt="Maglo icon" width={28} height={28} className="object-cover bg-white" />
            </div>
            {sidebarOpen && <span className="font-bold text-lg text-gray-900 dark:text-white">Maglo.</span>}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = getActiveMenuItem() === item.key;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary dark:bg-green-400 text-slate-900 dark:text-slate-900 font-medium"
                    : "text-gray-700 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Menu Items */}
        <div className="p-4 space-y-2 border-t border-gray-200 dark:border-slate-800 flex-shrink-0">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all">
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Help</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content (offset to account for fixed sidebar) */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'lg:ml-56 md:ml-56' : 'lg:ml-20 md:ml-20'}`}>
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full w-full max-w-md dark:bg-[#241b33] dark:shadow-inner">
              <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search anything on Transactions"
                className="bg-transparent ml-2 outline-none text-sm flex-1 placeholder:text-gray-400 dark:placeholder:text-gray-400/70 text-gray-900 dark:text-gray-200"
              />
            </div>

            {/* Notification */}
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg relative" title="Notifications">
              <Bell className="w-5 h-5 text-gray-600 dark:text-slate-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-slate-800">
              <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-600 dark:text-slate-400">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 p-6 overflow-y-auto h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

