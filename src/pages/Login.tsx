import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-xl border border-border bg-card p-8 shadow-card">
          {/* Branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-elevated mb-3">
              <Heart className="h-6 w-6 text-primary-foreground" fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold text-card-foreground tracking-tight">SwastyaConnect</h1>
            <p className="text-xs text-muted-foreground mt-1">Admin Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@swastyaconnect.in"
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
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground shadow-elevated hover:opacity-90 transition-opacity">
              Sign In
            </Button>
          </form>

          <p className="text-center text-[10px] text-muted-foreground mt-6">
            AI-Powered Telehealth for Rural India
          </p>
        </div>
      </motion.div>
    </div>
  );
}
