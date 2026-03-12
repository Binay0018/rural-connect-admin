import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Heart, ArrowLeft, ShieldCheck, Phone, KeyRound,
  AlertCircle, CheckCircle, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyDoctorOtp, saveDoctorToken, sendDoctorOtp } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

interface LocationState {
  phone?: string;
  name?: string;
  doctorId?: string;
  isExistingUser?: boolean;
}

export default function DoctorOtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithOtpToken } = useAuth();

  const state = (location.state as LocationState) || {};
  const [phone, setPhone] = useState(state.phone || '');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingApproval, setPendingApproval] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Resend OTP countdown
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Start countdown when page loads
  useEffect(() => {
    if (!state.phone) return;
    setResendCountdown(30);

    // If redirected here because "already exists", the signup API didn't actually send an OTP.
    // We should send it now automatically.
    if (state.isExistingUser) {
      setError('');
      setIsLoading(true);
      sendDoctorOtp({ phone: state.phone, doctorId: '', name: '' })
        .then(() => setError('Welcome back! We just sent a new OTP to your phone.'))
        .catch(() => setError('Failed to send OTP. Please click Resend OTP.'))
        .finally(() => setIsLoading(false));
    }
  }, [state.phone, state.isExistingUser]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.trim().length < 4) {
      setError('Please enter a valid OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyDoctorOtp({ phone: phone.trim(), code: code.trim() });

      // Save token to localStorage
      saveDoctorToken(res.token, res.user);

      // Update auth context with OTP-based session
      loginWithOtpToken(res.token, res.user);

      // Check approval status
      const isApproved = res.user?.approved !== false;

      if (!isApproved) {
        setPendingApproval(true);
      } else {
        navigate('/doctor');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'OTP verification failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Pending Approval Screen ──────────────────────────────────────────
  if (pendingApproval) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, hsl(215 25% 10%), hsl(221 83% 25%))' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl p-8 text-center shadow-elevated">
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/10 border-2 border-warning">
                  <Clock className="h-8 w-8 text-warning" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-success border-2 border-card">
                  <CheckCircle className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Registration Verified! ✓</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Your phone number has been verified successfully.
            </p>
            <div className="rounded-xl bg-warning/8 border border-warning/20 px-4 py-4 mb-6">
              <p className="text-sm font-semibold text-warning mb-1">Awaiting Admin Approval</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your account is pending verification by admin. You will receive an SMS once your account is approved and ready to use.
              </p>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => navigate('/login')}
                className="w-full gradient-primary text-primary-foreground"
              >
                Back to Login
              </Button>
              <p className="text-[10px] text-muted-foreground">
                Token saved. You can check back after admin review.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── OTP Verify Form ──────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, hsl(215 25% 10%), hsl(221 83% 25%))' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Back */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/doctor-signup')}
            className="rounded-lg p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-elevated">
              <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">SwastyaConnect</p>
              <p className="text-[10px] text-white/50">OTP Verification</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl p-6 shadow-elevated">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Verify OTP</h2>
              <p className="text-xs text-muted-foreground">Enter the OTP sent to your phone</p>
            </div>
          </div>

          {/* OTP sent info */}
          {state.phone && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground">
                OTP sent to <span className="font-semibold text-foreground">{state.phone}</span>
              </p>
            </div>
          )}

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 flex items-start gap-2.5 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-3"
              >
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleVerify} className="space-y-4">
            {/* Phone (editable in case state wasn't passed) */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setError(''); }}
                  placeholder="+91-98765-43210"
                  required
                  type="tel"
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
              </div>
            </div>

            {/* OTP Code */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                OTP Code <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={code}
                  onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 8)); setError(''); }}
                  placeholder="Enter OTP"
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow tracking-[0.3em] font-mono"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Enter the one-time password from your SMS</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-primary text-primary-foreground shadow-elevated hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Verifying…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Verify OTP
                </span>
              )}
            </Button>
          </form>

          {/* Resend & Navigation */}
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              disabled={resendCountdown > 0}
              onClick={() => navigate('/doctor-signup', { state: { prefill: { phone } } })}
              className="text-xs text-primary hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
            >
              {resendCountdown > 0 ? `Resend OTP in ${resendCountdown}s` : 'Resend OTP'}
            </button>
            <Link to="/login" className="text-xs text-muted-foreground hover:text-foreground">
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
