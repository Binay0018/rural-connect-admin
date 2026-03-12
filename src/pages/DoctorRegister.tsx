import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Eye, EyeOff, ArrowLeft, CheckCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const councils = [
  'Punjab Medical Council',
  'Delhi Medical Council',
  'Maharashtra Medical Council',
  'Tamil Nadu Medical Council',
  'Karnataka Medical Council',
  'Uttar Pradesh Medical Council',
  'Rajasthan Medical Council',
  'Gujarat Medical Council',
  'West Bengal Medical Council',
  'Andhra Pradesh Medical Council',
];

const specializations = [
  'General Medicine',
  'Pediatrics',
  'Gynecology',
  'Orthopedics',
  'Cardiology',
  'Dermatology',
  'ENT',
  'Ophthalmology',
  'Psychiatry',
  'Neurology',
  'Surgery',
  'Radiology',
];

export default function DoctorRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    registrationNumber: '',
    council: '',
    specialization: '',
  });
  const [certFile, setCertFile] = useState<File | null>(null);
  const [govtFile, setGovtFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!certFile) {
      setError('Please upload your Medical Certificate.');
      return;
    }
    if (!govtFile) {
      setError('Please upload your Government ID.');
      return;
    }

    setIsLoading(true);
    const result = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      registrationNumber: form.registrationNumber,
      council: form.council,
      specialization: form.specialization,
    });
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Registration failed.');
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, hsl(215 25% 10%), hsl(221 83% 25%))' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm">
          <div className="rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl p-8 text-center shadow-elevated">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 border-2 border-success">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Registration Submitted!</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Your account has been created with status:
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 border border-warning/20 px-3 py-1.5 text-xs font-semibold text-warning mb-6">
              ⏳ Pending Verification
            </span>
            <p className="text-xs text-muted-foreground mb-6">
              An admin will review your credentials and documents. You'll be able to log in once approved.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full gradient-primary text-primary-foreground">
              Back to Login
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8" style={{ background: 'linear-gradient(135deg, hsl(215 25% 10%), hsl(221 83% 25%))' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/login')} className="rounded-lg p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-elevated">
              <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">SwastyaConnect</p>
              <p className="text-[10px] text-white/50">Doctor Registration</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl p-6 shadow-elevated">
          <h2 className="text-lg font-bold text-foreground mb-1">Register as a Doctor</h2>
          <p className="text-xs text-muted-foreground mb-6">
            Your account will be reviewed by admin before activation.
          </p>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5"
              >
                <p className="text-xs text-destructive">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Full Name *</label>
                <input value={form.name} onChange={update('name')} placeholder="Dr. Ranjit Kumar" required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Phone Number *</label>
                <input value={form.phone} onChange={update('phone')} placeholder="+91-98765-43210" required type="tel"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Email Address *</label>
              <input value={form.email} onChange={update('email')} placeholder="doctor@email.com" required type="email"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Password *</label>
                <div className="relative">
                  <input value={form.password} onChange={update('password')} type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" required
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring pr-9" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Confirm Password *</label>
                <input value={form.confirmPassword} onChange={update('confirmPassword')} type="password" placeholder="Repeat password" required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <hr className="border-border" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medical Credentials</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Medical Reg. Number *</label>
                <input value={form.registrationNumber} onChange={update('registrationNumber')} placeholder="PMC-2023-XXXX" required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Specialization *</label>
                <select value={form.specialization} onChange={update('specialization')} required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select specialization</option>
                  {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">State Medical Council *</label>
              <select value={form.council} onChange={update('council')} required
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select council</option>
                {councils.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <hr className="border-border" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Document Upload</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Medical Certificate */}
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Medical Certificate *</label>
                <label className={`flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-4 cursor-pointer transition-colors ${
                  certFile ? 'border-success bg-success/5' : 'border-border hover:border-primary hover:bg-primary/5'
                }`}>
                  <Upload className={`h-5 w-5 ${certFile ? 'text-success' : 'text-muted-foreground'}`} />
                  <span className="text-xs text-center text-muted-foreground">
                    {certFile ? certFile.name : 'Click to upload PDF/JPG'}
                  </span>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setCertFile(e.target.files?.[0] || null)} />
                </label>
              </div>
              {/* Govt ID */}
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Government ID *</label>
                <label className={`flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-4 cursor-pointer transition-colors ${
                  govtFile ? 'border-success bg-success/5' : 'border-border hover:border-primary hover:bg-primary/5'
                }`}>
                  <Upload className={`h-5 w-5 ${govtFile ? 'text-success' : 'text-muted-foreground'}`} />
                  <span className="text-xs text-center text-muted-foreground">
                    {govtFile ? govtFile.name : 'Aadhaar/Passport/PAN'}
                  </span>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setGovtFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full gradient-primary text-primary-foreground shadow-elevated hover:opacity-90 mt-2">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Submitting...
                </span>
              ) : 'Submit for Verification'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Already registered?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
