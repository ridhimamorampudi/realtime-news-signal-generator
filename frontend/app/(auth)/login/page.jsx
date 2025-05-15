'use client';

import { useState } from 'react';
import Link from 'next/link';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('token', idToken);
      toast.success('Logged in successfully!');
      router.push('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md px-8">
        {/* Main Container */}
        <div className="relative bg-[#1A1F2E]/40 backdrop-blur-xl p-8 rounded-3xl border border-slate-800/30 shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
          
          {/* Header */}
          <div className="text-center mb-10 relative">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-400 tracking-widest uppercase">Alpha</span>
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-300"></div>
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-400 mt-3 text-lg">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="relative w-full px-5 py-4 bg-[#1A1F2E] border border-slate-800/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="relative w-full px-5 py-4 bg-[#1A1F2E] border border-slate-800/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            className="relative w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-4 px-4 rounded-xl transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 translate-y-full group-hover:translate-y-0"></div>
            <span className="relative z-10 text-lg">Sign In</span>
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors relative group">
                Sign up
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
