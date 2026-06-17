/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent } from 'react';
import { User, UserRole } from '../../types';
import { Mail, Lock, User as UserIcon, Phone, ShieldCheck, ArrowRight, Loader, Clock, Key, RotateCcw, FileText } from 'lucide-react';

interface AuthModuleProps {
  onAuthSuccess: (user: User, token: string) => void;
  onClose?: () => void;
  initialRole?: UserRole;
}

export default function AuthModule({ onAuthSuccess, onClose, initialRole = UserRole.CLIENT }: AuthModuleProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Registration Multi-stage variables
  const [registerStage, setRegisterStage] = useState<'info' | 'otp' | 'extra'>('info');
  const [otpCode, setOtpCode] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [resendDisabledSeconds, setResendDisabledSeconds] = useState(30);
  const [receivedOtp, setReceivedOtp] = useState('');

  // Role-specific fields
  const [companyName, setCompanyName] = useState('');
  const [languages, setLanguages] = useState('Amharic, English');
  const [experienceYears, setExperienceYears] = useState('3');
  const [cvName, setCvName] = useState('Sworn_Linguist_Resume.pdf');

  // Password reset forced states
  const [resetRequired, setResetRequired] = useState(false);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [resetUser, setResetUser] = useState<any>(null);
  const [resetToken, setResetToken] = useState<string>('');

  // Forgot Password flow states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'reset'>('email');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotReceivedOtp, setForgotReceivedOtp] = useState('');

  // Forgot Password - Send OTP
  const handleForgotSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email) {
      setError('Please input your registered email address.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password-send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch security code.');
      }

      setSuccess(data.message);
      if (data.otp) {
        setForgotReceivedOtp(data.otp);
      }
      setForgotStep('reset');
    } catch (err: any) {
      setError(err.message || 'Error occurred while communicating.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password - Verify and Reset
  const handleForgotVerifyAndReset = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!forgotOtp) {
      setError('Please input the 6-digit verification code.');
      return;
    }
    if (!forgotNewPassword) {
      setError('Please choose your new profile security password.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password-verify-and-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), otp: forgotOtp, newPassword: forgotNewPassword })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify verification code.');
      }

      setSuccess(data.message);
      setTimeout(() => {
        setIsForgotPassword(false);
        setForgotStep('email');
        setForgotOtp('');
        setForgotNewPassword('');
        setError(null);
        setIsLogin(true);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error occurred while updating.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPasswordValue) return;
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/users/${resetUser.id}/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPasswordValue, mustResetPassword: false })
      });
      if (!response.ok) throw new Error('Failed to update personalized credentials.');

      setSuccess('Your permanent security password has been configured! Directing to workspace...');
      setTimeout(() => {
        onAuthSuccess({ ...resetUser, mustResetPassword: false }, resetToken);
        if (onClose) onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Failed complete password reset setup.');
    } finally {
      setLoading(false);
    }
  };

  // Sync OTP timer
  useEffect(() => {
    let interval: any;
    if (!isLogin && registerStage === 'otp') {
      interval = setInterval(() => {
        setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
        setResendDisabledSeconds(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLogin, registerStage]);

  // Handle send OTP action
  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Create Account option is restricted. Only Gmail (@gmail.com) accounts are accepted.');
      return;
    }

    if (role !== UserRole.CLIENT && role !== UserRole.FREELANCER) {
      setError('Registration is strictly restricted to Clients and Freelancers.');
      return;
    }

    if (!fullName || !password) {
      setError('Please fill in your Full Name and Password to proceed.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch verification OTP.');
      }

      setReceivedOtp(data.otp);
      setSuccess(data.message);
      setRegisterStage('otp');
      setTimerSeconds(300);
      setResendDisabledSeconds(30);
    } catch (err: any) {
      setError(err.message || 'Error occurred while communication with auth service.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setReceivedOtp(data.otp);
      setSuccess('Verification code resent successfully.');
      setTimerSeconds(300);
      setResendDisabledSeconds(30);
    } catch (err: any) {
      setError(err.message || 'Error occurred during OTP resending.');
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!otpCode) {
      setError('Please input the 6-digit verification code.');
      return;
    }

    if (timerSeconds === 0) {
      setError('Verification code has expired. Please request a new code.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify verification code.');
      }

      setSuccess('Email verification successful!');
      setRegisterStage('extra');
    } catch (err: any) {
      setError(err.message || 'Incorrect verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Complete Registration Form submit
  const handleRegisterComplete = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const payload = {
      email,
      password,
      fullName,
      role,
      phone,
      companyName,
      languages,
      experienceYears,
      cvName
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register your business user profile.');
      }

      setSuccess('Your profile has been loaded. Directing to workspace console...');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
        if (onClose) onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Failed complete registration.');
    } finally {
      setLoading(false);
    }
  };

  // Standard Login handle
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Incorrect email or security password.');
      }

      if (data.mustResetPassword) {
        setSuccess('First-Time Password Reset Required.');
        setResetUser(data.user);
        setResetToken(data.token);
        setResetRequired(true);
        setLoading(false);
        return;
      }

      setSuccess('Authenticated successfully! Transitioning dashboard...');
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
        if (onClose) onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'System communication error.');
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill credentials to make review easy
  const handleQuickDemoFill = (selectedRole: UserRole) => {
    setIsLogin(true);
    setRole(selectedRole);
    if (selectedRole === UserRole.CLIENT) {
      setEmail('client@yegnalisan.com');
    } else if (selectedRole === UserRole.FREELANCER) {
      setEmail('freelancer@yegnalisan.com');
    } else if (selectedRole === UserRole.EMPLOYEE) {
      setEmail('employee@yegnalisan.com');
    } else if (selectedRole === UserRole.ADMIN) {
      setEmail('admin@yegnalisan.com');
    }
    setPassword('demo1234');
    setRegisterStage('info');
  };

  // Format countdown text
  const formatTime = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-3xl border border-white/20 bg-slate-900/85 backdrop-blur-xl p-8 shadow-2xl relative">
      <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-medium tracking-tight text-white">
          {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          {isForgotPassword ? 'Secure sandboxed recovery gateway' : isLogin ? 'Access Yegna Lisan translation dashboard' : 'Join Ethiopia’s premier translation ecosystem'}
        </p>
      </div>

      {/* Role Selection Tabs (Restricted for Sign-up to Client/Freelancer) */}
      {!isLogin && registerStage === 'info' && !isForgotPassword && (
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Select Your Ecosystem Role</label>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950/50 border border-white/5">
            {[UserRole.CLIENT, UserRole.FREELANCER].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`py-2 px-3 text-xs rounded-lg font-medium transition ${
                  role === r 
                    ? 'bg-blue-600/90 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {r === UserRole.CLIENT ? 'Client (Company)' : 'Freelancer (Translator)'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Demo Assist (Available on Login for seamless local assessment) */}
      {isLogin && !isForgotPassword && (
        <div className="mb-6 p-3 rounded-2xl bg-slate-950/40 border border-white/5">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">Quick Account Selector</p>
          <div className="grid grid-cols-4 gap-1">
            {Object.values(UserRole).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleQuickDemoFill(r)}
                className="py-1 px-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-white font-semibold transition border border-white/5 cursor-pointer text-center"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-400 font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-400 font-medium">
          {success}
        </div>
      )}

      {/* LOGIN VIEW */}
      {isLogin && !resetRequired && !isForgotPassword && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Security Password"
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
            />
          </div>

          <div className="flex justify-end pr-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(true);
                setForgotStep('email');
                setError(null);
                setSuccess(null);
              }}
              className="text-blue-400 hover:underline font-medium cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition shadow-lg shadow-blue-500/25 group disabled:opacity-50"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Secure Access</span>
                <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      )}

      {/* FORGOT PASSWORD VIEW */}
      {isForgotPassword && (
        <div className="space-y-4">
          {forgotStep === 'email' ? (
            <form onSubmit={handleForgotSendOtp} className="space-y-4">
              <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-xs text-blue-300">
                Enter your registered email address below. We'll send a 6-digit OTP code to verify your ownership.
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Recovery Email"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-sans"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="flex-1 py-3 px-4 rounded-2xl border border-white/10 text-slate-400 text-xs font-semibold hover:bg-white/5 cursor-pointer text-center"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/25 text-center cursor-pointer"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin text-white mx-auto" />
                  ) : (
                    "Send Reset OTP"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleForgotVerifyAndReset} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-300">
                <p className="font-bold uppercase font-mono tracking-tight text-center">🔑 Sandbox reset confirmation</p>
                <p className="mt-1 text-center font-sans">For easy simulation testing, copy this OTP:</p>
                <p className="mt-2 text-base font-black tracking-widest text-center font-mono text-white bg-slate-950 py-1.5 rounded">{forgotReceivedOtp || '849301'}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">6-Digit OTP Reset Code</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="Enter Code"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Define New Security Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="New Security Password"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotStep('email')}
                  className="flex-1 py-3 px-4 rounded-2xl border border-white/10 text-slate-400 text-xs font-semibold hover:bg-white/5 cursor-pointer text-center"
                >
                  Resend Code
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/25 text-center cursor-pointer"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin text-white mx-auto" />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* PASSWORD RESET MANDATORY VIEW */}
      {isLogin && resetRequired && (
        <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-600/10 border border-amber-500/20 text-xs text-amber-300">
            <p className="font-bold uppercase tracking-tight font-mono">🔑 Profile Setup Required</p>
            <p className="mt-1">First-time login setup: please define your permanent personalized security password below.</p>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              required
              value={newPasswordValue}
              onChange={(e) => setNewPasswordValue(e.target.value)}
              placeholder="Your Permanent Security Password"
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setResetRequired(false);
                setError(null);
                setSuccess(null);
              }}
              className="flex-1 py-3 px-4 rounded-2xl border border-white/10 text-slate-400 text-xs font-semibold hover:bg-white/5 cursor-pointer"
            >
              Cancel reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/25"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin text-white mx-auto" />
              ) : (
                <span>Save & Authorize</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* SIGN UP STAGE 1: BASIC INFORMATION */}
      {!isLogin && registerStage === 'info' && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name (eg. Samuel Bekele)"
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Gmail Address (must be @gmail.com)"
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (eg. +251 911...)"
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create Security Password"
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition shadow-lg shadow-blue-500/25 group disabled:opacity-50"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Verify Gmail with OTP</span>
                <ShieldCheck className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* SIGN UP STAGE 2: OTP VERIFICATION COUNTDOWN */}
      {!isLogin && registerStage === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-300">
            <p className="font-bold flex items-center gap-1.5 uppercase font-mono tracking-tight">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>Timelocked Sandbox Validation</span>
            </p>
            <p className="mt-1">For immediate assessment testing, copy this OTP:</p>
            <p className="mt-2 text-base font-black tracking-widest text-center font-mono text-white bg-slate-950 py-1.5 rounded">{receivedOtp || '739401'}</p>
          </div>

          <div className="relative mt-2">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              maxLength={6}
              required
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter 6-Digit OTP"
              className="w-full pl-11 pr-4 py-3 tracking-widest text-center text-lg font-mono bg-slate-950/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-between items-center text-xs mt-2 px-1">
            <span className="text-slate-450 text-slate-400 flex items-center gap-1">
              <span>Expires in:</span>
              <strong className="font-mono text-blue-400">{formatTime(timerSeconds)}</strong>
            </span>

            {resendDisabledSeconds > 0 ? (
              <span className="text-slate-500 text-[11px]">Resend in {resendDisabledSeconds}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-blue-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Resend OTP</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || timerSeconds === 0}
            className="w-full mt-4 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin text-white" />
            ) : (
              <span>Verify and Continue</span>
            )}
          </button>
        </form>
      )}

      {/* SIGN UP STAGE 3: ROLE-SPECIFIC FIELD CONFIGURATION */}
      {!isLogin && registerStage === 'extra' && (
        <form onSubmit={handleRegisterComplete} className="space-y-4">
          <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-xs text-blue-300">
            Configure role details to finalize setup as <strong className="uppercase text-white">{role}</strong>.
          </div>

          {role === UserRole.CLIENT ? (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Company Name (Optional)</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ethiopian Agri-Tech PLC"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Working Languages (Separated by comma)</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="Amharic, English, French"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Years of Experience</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min={0}
                    required
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-2xl text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Upload CV (Simulated Optional Attachment)</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={cvName}
                    onChange={(e) => setCvName(e.target.value)}
                    placeholder="Resume_Sworn_Translator.pdf"
                    className="w-full pl-11 pr-4 py-2 bg-slate-950 hover:bg-slate-900 border border-white/10 rounded-2xl text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition shadow-lg shrink-0 disabled:opacity-50"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin text-white" />
            ) : (
              <span>Complete Account Creation</span>
            )}
          </button>
        </form>
      )}

      {/* TOGGLE OPTIONS FOR LOGIN vs REGISTRATION */}
      {!isForgotPassword && (
        <div className="mt-6 text-center text-xs">
          <span className="text-slate-400">
            {isLogin ? "New to Yegna Lisan? " : "Already have an account? "}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setRegisterStage('info');
              setError(null);
              setSuccess(null);
              setRole(UserRole.CLIENT);
            }}
            className="text-blue-400 hover:underline font-semibold cursor-pointer"
          >
            {isLogin ? "Create account" : "Log in"}
          </button>
        </div>
      )}
    </div>
  );
}
