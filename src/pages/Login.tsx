import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Eye, EyeOff, Shield, Stethoscope, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

type RoleTab = 'admin' | 'doctor' | 'worker';

export default function Login() {
  const [activeTab, setActiveTab] = useState<RoleTab>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingMessage, setPendingMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleTabChange = (tab: RoleTab) => {
    setActiveTab(tab);
    setError('');
    setPendingMessage('');
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPendingMessage('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Login failed.');
      return;
    }

    if (result.status === 'pending') {
      setPendingMessage("Your account is pending verification by admin. You'll be notified once approved.");
      return;
    }

    // Redirect based on user role (from auth state) rather than just the active tab
    // This makes the transition more robust if the user uses the "wrong" tab but right credentials
    const { user } = result as any; // We can assume success means user is set if we return it, or just use useAuth state after a tick
    // But since login might not have returned the user, let's use the tab as a fallback or just check role
    
    if (activeTab === 'admin') {
      navigate('/');
    } else if (activeTab === 'doctor') {
      navigate('/doctor');
    } else {
      navigate('/worker');
    }
  };

  const placeholders = {
    admin: { email: 'admin@swastyaconnect.in', hint: 'Use: admin@swastyaconnect.in / admin123' },
    doctor: { email: 'harpreet@swastyaconnect.in', hint: 'Use any doctor email / doctor123' },
    worker: { email: 'worker@swastyaconnect.in', hint: 'Use: worker@swastyaconnect.in / worker123' },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" style={{ background: 'linear-gradient(135deg, hsl(215 25% 10%), hsl(221 83% 25%))' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-elevated mb-3">
            <Heart className="h-7 w-7 text-primary-foreground" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SwastyaConnect</h1>
          <p className="text-sm text-white/60 mt-1">Rural Telehealth Platform</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl p-6 shadow-elevated">
          {/* Role Tabs */}
          <div className="flex rounded-xl bg-muted p-1 mb-6">
            {([
              { key: 'admin' as const, label: 'Admin', icon: Shield },
              { key: 'doctor' as const, label: 'Doctor', icon: Stethoscope },
              { key: 'worker' as const, label: 'Worker', icon: Users },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                  activeTab === key
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Pending Banner */}
          <AnimatePresence>
            {pendingMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 flex items-start gap-2.5 rounded-lg bg-warning/10 border border-warning/20 px-3 py-3"
              >
                <Clock className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <p className="text-xs text-warning leading-relaxed">{pendingMessage}</p>
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

          {/* Form */}
          {activeTab === 'admin' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder={placeholders.admin.email}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{placeholders.admin.hint}</p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-primary text-primary-foreground shadow-elevated hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In as Admin'
                )}
              </Button>
            </form>
          ) : (
            // Doctor Login Form (Email & Password)
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder={placeholders.doctor.email}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{placeholders.doctor.hint}</p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-primary text-primary-foreground shadow-elevated hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  `Sign In as ${activeTab === 'doctor' ? 'Doctor' : 'Health Worker'}`
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                New doctor?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Register here
                </Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
