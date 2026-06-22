'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Fish, Lock, User } from 'lucide-react'
import { AdminDashboard } from './components/AdminDashboard'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'Admin123@'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_authed')
    if (saved === 'true') setAuthed(true)
    setChecking(false)
  }, [])

  function handleLogin() {
    setAuthed(true)
    sessionStorage.setItem('admin_authed', 'true')
    sessionStorage.setItem('admin_secret', 'oceancatch-admin')
  }

  function handleLogout() {
    setAuthed(false)
    sessionStorage.removeItem('admin_authed')
    sessionStorage.removeItem('admin_secret')
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!authed) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <AdminDashboard onLogout={handleLogout} />
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onLogin()
    } else {
      setLoading(false)
      setError('Invalid username or password')
      setShakeKey(k => k + 1)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <motion.div
        key={shakeKey}
        initial={shakeKey === 0 ? { opacity: 0, y: 24, scale: 0.96 } : false}
        animate={shakeKey > 0 ? { x: [-10, 10, -8, 8, -5, 5, 0] } : { opacity: 1, y: 0, scale: 1 }}
        transition={shakeKey > 0 ? { duration: 0.45 } : { duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">
          {/* Top cyan accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

          <div className="p-8 sm:p-10">
            {/* Logo area */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="relative mb-4"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-3xl flex items-center justify-center shadow-xl shadow-cyan-500/30">
                  <Fish className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h1 className="text-2xl font-bold text-white tracking-tight">Sea Harvest Premium Seafoods</h1>
                <p className="text-cyan-400 text-xs font-semibold tracking-[0.25em] mt-1">ADMIN PORTAL</p>
              </motion.div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-7">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs text-slate-600 font-medium">Sign in to continue</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter username"
                    autoComplete="username"
                    className="w-full bg-slate-800/50 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 rounded-xl px-4 py-3 pl-11 text-sm outline-none transition-all duration-200 focus:bg-slate-800 focus:shadow-lg focus:shadow-cyan-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full bg-slate-800/50 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 rounded-xl px-4 py-3 pl-11 pr-12 text-sm outline-none transition-all duration-200 focus:bg-slate-800 focus:shadow-lg focus:shadow-cyan-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3"
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 disabled:shadow-none mt-2"
              >
                <span className={`flex items-center justify-center gap-2 transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}>
                  <Lock className="w-4 h-4" />
                  Sign In to Dashboard
                </span>
                {loading && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                  </span>
                )}
              </button>
            </motion.form>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-xs text-slate-700 mt-7"
            >
              Restricted access · Sea Harvest Premium Seafoods Control Panel
            </motion.p>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>

        {/* Outer glow */}
        <div className="absolute inset-0 -z-10 bg-cyan-500/5 rounded-3xl blur-2xl scale-110" />
      </motion.div>
    </div>
  )
}
