import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Heart, Clock, LogOut, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DoctorApprovalPending() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefresh = () => {
    // Re-reload the page so AuthContext re-checks the stored token
    window.location.reload();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, hsl(215 25% 10%), hsl(221 83% 25%))' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-elevated">
              <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-lg font-bold text-white">SwastyaConnect</span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl p-8 text-center shadow-elevated">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-warning/10 border-2 border-warning"
              >
                <Clock className="h-10 w-10 text-warning" />
              </motion.div>
              {/* Pulsing ring */}
              <motion.div
                animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border-2 border-warning"
              />
            </div>
          </div>

          <h1 className="text-xl font-bold text-foreground mb-2">
            Awaiting Admin Verification
          </h1>

          {user?.name && (
            <p className="text-sm text-muted-foreground mb-1">
              Hello, <span className="font-semibold text-foreground">{user.name}</span>
            </p>
          )}

          <div className="rounded-xl bg-warning/8 border border-warning/20 px-5 py-4 my-5">
            <p className="text-sm text-warning font-semibold mb-1">Account Pending Approval</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your account is awaiting admin verification. Please wait until the admin
              approves your account before accessing the Doctor Dashboard.
            </p>
          </div>

          {/* What happens next */}
          <div className="text-left rounded-xl bg-muted px-4 py-4 mb-6 space-y-2">
            <p className="text-xs font-semibold text-foreground mb-2">What happens next?</p>
            {[
              { step: '1', text: 'Admin reviews your registration' },
              { step: '2', text: 'Your unique Doctor ID is verified' },
              { step: '3', text: 'Account activated — you get access' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {step}
                </span>
                <p className="text-xs text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleRefresh}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 py-2.5 text-sm font-medium text-primary transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Check Again
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-muted hover:bg-muted/60 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
