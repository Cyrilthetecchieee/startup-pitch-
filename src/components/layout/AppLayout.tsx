import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CalendarCheck,
  CreditCard,
  LineChart,
  FileText,
  Utensils,
  BookOpen,
  Bookmark,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Flame,
  Clock,
  Sparkles,
  Shield,
  UserCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const AppLayout: React.FC = () => {
  const { user, userDoc, role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const trainerLinks = [
    { to: '/trainer', label: 'Overview', icon: LayoutDashboard },
    { to: '/trainer/user-management', label: 'User Management', icon: Users },
    { to: '/trainer/workouts', label: 'Workout Builder', icon: Dumbbell },
    { to: '/trainer/assignments', label: 'Assignments & Schedule', icon: CalendarCheck },
    { to: '/trainer/membership', label: 'Membership Plan', icon: CreditCard },
    { to: '/trainer/progress', label: 'Progress Review', icon: LineChart },
    { to: '/trainer/content', label: 'Content Manager', icon: FileText },
  ];

  const userLinks = [
    { to: '/user', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/user/workouts', label: 'Workouts & Sessions', icon: Dumbbell },
    { to: '/user/planner', label: 'Schedule & Planner', icon: CalendarCheck },
    { to: '/user/progress', label: 'Progress & Weight', icon: LineChart },
    { to: '/user/nutrition', label: 'Nutrition & Water', icon: Utensils },
    { to: '/user/membership', label: 'My Membership', icon: CreditCard },
    { to: '/user/health-hub', label: 'Health Hub', icon: BookOpen },
    { to: '/user/favorites', label: 'Favorites', icon: Bookmark },
    { to: '/user/settings', label: 'Settings', icon: Settings },
  ];

  const navLinks = role === 'trainer' ? trainerLinks : userLinks;

  return (
    <div className="flex h-screen bg-dark-base text-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-dark-border bg-dark-card shrink-0">
        {/* Logo and Brand */}
        <div className="h-16 flex items-center px-6 border-b border-dark-border gap-3">
          <div className="w-8 h-8 rounded-lg bg-lime-500/20 border border-lime-500/40 flex items-center justify-center text-lime-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white text-base">FitSphere</span>
            <div className="text-[10px] text-lime-400 font-semibold uppercase tracking-wider">
              {role === 'trainer' ? 'Trainer Portal' : 'Athlete Portal'}
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/trainer' || item.to === '/user'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-lime-500/10 text-lime-400 border border-lime-500/30 shadow-lime-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-dark-elevated'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-lime-400' : 'text-gray-500 group-hover:text-gray-300'
                      }`}
                    />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 text-lime-400 opacity-80" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-dark-border bg-dark-card/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-xs font-bold text-gray-200">
              {userDoc?.displayName ? userDoc.displayName.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-bold text-gray-200 truncate">
                {userDoc?.displayName || user?.email}
              </div>
              <div className="text-[11px] text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dark-border text-xs text-gray-400 hover:text-coral-400 hover:border-coral-500/30 hover:bg-coral-500/10 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 bg-dark-card border-r border-dark-border flex flex-col h-full z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-lime-400" />
                <span className="font-extrabold text-white">FitSphere</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/trainer' || item.to === '/user'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                        isActive
                          ? 'bg-lime-500/10 text-lime-400 border border-lime-500/30'
                          : 'text-gray-400 hover:text-gray-200'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-4 border-t border-dark-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dark-border text-xs text-coral-400 hover:bg-coral-500/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-dark-border bg-dark-card/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-surface"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-400">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
              <span>System Online (Local Firebase Emulators Connected)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={role === 'trainer' ? 'lime' : 'cyan'}>
              {role === 'trainer' ? 'Trainer' : 'Athlete'}
            </Badge>

            <div className="h-4 w-px bg-dark-border" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-dark-surface border border-lime-500/30 flex items-center justify-center text-xs font-bold text-lime-400">
                {userDoc?.displayName ? userDoc.displayName.charAt(0) : 'U'}
              </div>
              <span className="text-xs font-semibold text-gray-200 hidden sm:inline">
                {userDoc?.displayName || 'User'}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-dark-base">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
