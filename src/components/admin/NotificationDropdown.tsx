import { useState } from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { notifications as initialNotifications } from '@/data/mockData';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState(initialNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'coverage': return <Info size={16} className="text-info" />;
      case 'pharmacy': return <AlertTriangle size={16} className="text-warning" />;
      case 'emergency': return <ShieldAlert size={16} className="text-destructive" />;
      default: return <Bell size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors outline-none">
          <Bell className="h-5 w-5 md:h-4 md:w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 md:-top-0.5 md:-right-0.5 flex h-4 w-4 md:h-3.5 md:w-3.5 items-center justify-center rounded-full bg-destructive text-[10px] md:text-[8px] font-bold text-white shadow">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 shadow-elevated border-border rounded-xl">
        <div className="flex items-center justify-between p-3">
          <DropdownMenuLabel className="font-semibold p-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button 
              onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
              className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
            >
              <Check size={12} /> Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-border" />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={`p-3 cursor-pointer focus:bg-muted/50 rounded-none border-b border-border last:border-0 ${notification.read ? 'opacity-60' : 'bg-primary/5'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3 items-start w-full">
                  <div className={`mt-0.5 p-1.5 rounded-full ${notification.read ? 'bg-muted' : 'bg-background shadow-sm'}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm font-medium leading-none ${notification.read ? 'text-muted-foreground' : 'text-foreground'} line-clamp-2`}>
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-1">
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2.5 w-2.5 bg-primary rounded-full mt-1 shrink-0" />
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuSeparator className="bg-border" />
        <div className="p-2">
          <button className="w-full text-center text-xs p-2 font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
            View All Notifications
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
