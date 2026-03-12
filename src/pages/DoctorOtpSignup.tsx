import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowLeft, Stethoscope, Phone, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { sendDoctorOtp } from '@/services/authService';

export default function DoctorOtpSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ doctorId: '', name: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
    setSuccessMsg('');
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Basic phone validation
    const phoneClean = form.phone.trim();
    if (!/^[+]?[\d\s\-]{8,15}$/.test(phoneClean)) {
      setError('Please enter a valid phone number (e.g. +91-98765-43210).');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendDoctorOtp({
        doctorId: form.doctorId.trim(),
        name: form.name.trim(),
        phone: phoneClean,
      });

      setSuccessMsg(res.message || 'OTP sent. Please verify the OTP to complete signup.');

      // Navigate to verify page after a short delay so user sees success
      setTimeout(() => {
        navigate('/doctor-verify', {
          state: {
            phone: phoneClean,
            name: form.name.trim(),
            doctorId: form.doctorId.trim(),
          },
        });
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP. Please try again.';
      
      // If user exists, they should be logging in via OTP verification
      if (msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('already registered')) {
        setError('Account already exists. Redirecting to login/verify...');
        setTimeout(() => {
          navigate('/doctor-verify', {
            state: { phone: phoneClean },
          });
        }, 2000);
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            onClick={() => navigate('/login')}
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
              <p className="text-[10px] text-white/50">Doctor Signup</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl p-6 shadow-elevated">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Doctor Registration</h2>
              <p className="text-xs text-muted-foreground">We'll send an OTP to verify your phone</p>
            </div>
          </div>

          {/* Success Banner */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 flex items-start gap-2.5 rounded-lg bg-success/10 border border-success/20 px-3 py-3"
              >
                <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <p className="text-xs text-success leading-relaxed">{successMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

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

          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Doctor ID */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Doctor ID <span className="text-destructive">*</span>
              </label>
              <input
                value={form.doctorId}
                onChange={update('doctorId')}
                placeholder="e.g. PMC-2024-0001"
                required
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Your Medical Registration / Doctor ID</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                value={form.name}
                onChange={update('name')}
                placeholder="Dr. Ranjit Kumar"
                required
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Phone Number <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="+91-98765-43210"
                  required
                  type="tel"
                  className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">OTP will be sent to this number</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !!successMsg}
              className="w-full gradient-primary text-primary-foreground shadow-elevated hover:opacity-90 transition-opacity mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Sending OTP…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send OTP
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Already registered?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
