import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckSquare, Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLogin } from '../hooks/useAuth';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/api';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const loginMutation = useLogin();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    try {
      const data = await loginMutation.mutateAsync(values);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(79,70,229,0.15)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-brand-500/40 mb-4 animate-pulse-slow">
            <CheckSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-2 text-sm">Sign in to your TeamFlow account</p>
        </div>

        {/* Demo credentials banner */}
        <div className="mb-4 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p>Admin: admin@example.com / Admin@123</p>
          <p>Member: bob@example.com / Member@123</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  {...register('email')}
                  className="input-field pl-10"
                  placeholder="you@company.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="login-password" className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-password"
                  type="password"
                  {...register('password')}
                  className="input-field pl-10"
                  placeholder="Your password"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting || loginMutation.isPending}
              className="btn-primary w-full py-3 mt-2"
            >
              {(isSubmitting || loginMutation.isPending) ? (
                <><Loader2 size={18} className="animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link id="go-to-register" to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {['Role-Based Access', 'Real-time Updates', 'Team Collaboration'].map((f) => (
            <div key={f} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-slate-400 font-medium">{f}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
