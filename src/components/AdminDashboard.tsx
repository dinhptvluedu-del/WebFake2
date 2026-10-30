/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Activity,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  UserCheck,
  UserX,
  RefreshCw,
  Cpu,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { SystemStats, User, FeedbackItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { token, user: currentUser } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'feedback' | 'model'>('overview');
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 1. Dashboard stats
      const statsRes = await fetch('/api/admin/dashboard', { headers });
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }

      // 2. Users list
      const usersRes = await fetch('/api/admin/users', { headers });
      if (usersRes.ok) {
        setUsersList(await usersRes.json());
      }

      // 3. Feedback list
      const fbRes = await fetch('/api/feedback', { headers });
      if (fbRes.ok) {
        setFeedbackList(await fbRes.json());
      }
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const toggleUserRole = async (targetUser: User) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsersList(usersList.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u)));
      }
    } catch {
      // Handle error
    }
  };

  const toggleUserActive = async (targetUser: User) => {
    const newActive = !targetUser.isActive;
    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ isActive: newActive }),
      });
      if (res.ok) {
        setUsersList(usersList.map((u) => (u.id === targetUser.id ? { ...u, isActive: newActive } : u)));
      }
    } catch {
      // Handle error
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setUsersList(usersList.filter((u) => u.id !== userId));
      }
    } catch {
      // Handle error
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setFeedbackList(feedbackList.filter((f) => f.id !== id));
      }
    } catch {
      // Handle error
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Administrator Control Center
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              System Telemetry & Administration
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Monitor neural network inference volume, user permissions, and dataset feedback queues.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={isLoading}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 mt-6 border-b border-slate-100 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Metrics Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            User Management ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'feedback'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            User Feedback Audit ({feedbackList.length})
          </button>
          <button
            onClick={() => setActiveTab('model')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'model'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Bi-LSTM Model Health
          </button>
        </div>
      </div>

      {/* Tab: Overview Metrics */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Total Predictions</span>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {stats.totalAnalyzed.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Real-time inference invocations</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">User Accuracy Agreement</span>
              </div>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.accuracySatisfactionRate}%
              </p>
              <p className="text-[11px] text-slate-500 mt-1">From user feedback ratings</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Registered Users</span>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalUsers}</p>
              <p className="text-[11px] text-slate-500 mt-1">Active analysts & admins</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Average Latency</span>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.averageLatencyMs} ms</p>
              <p className="text-[11px] text-slate-500 mt-1">Per 128-token sequence pass</p>
            </div>
          </div>

          {/* Ratio Comparison Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span>Real News vs Fake News Classification Volume</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400">Real News ({stats.realNewsCount})</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono">{stats.realPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-4 rounded-full" style={{ width: `${stats.realPercentage}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-600 dark:text-rose-400">Fake News ({stats.fakeNewsCount})</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono">{stats.fakePercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-4 rounded-full" style={{ width: `${stats.fakePercentage}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs overflow-x-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Registered User Directory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Grant or revoke administrator privileges and manage analyst access tokens.
              </p>
            </div>
          </div>

          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {usersList.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                      {usr.fullName?.charAt(0) || 'U'}
                    </div>
                    <span>{usr.fullName}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs">{usr.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        usr.role === 'admin'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {usr.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center space-x-1 text-xs font-semibold ${
                        usr.isActive ? 'text-emerald-600' : 'text-rose-500'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${usr.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>{usr.isActive ? 'Active' : 'Disabled'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    {new Date(usr.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => toggleUserRole(usr)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Switch role"
                    >
                      {usr.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                    </button>
                    <button
                      onClick={() => toggleUserActive(usr)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                      title={usr.isActive ? 'Disable account' : 'Enable account'}
                    >
                      {usr.isActive ? <UserX className="w-4 h-4 text-rose-500" /> : <UserCheck className="w-4 h-4 text-emerald-500" />}
                    </button>
                    {usr.id !== currentUser?.id && (
                      <button
                        onClick={() => deleteUser(usr.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Feedback Audit Queue */}
      {activeTab === 'feedback' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">User Evaluation Audit Queue</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              User-submitted like/dislike votes and qualitative comments stored for model fine-tuning and error analysis.
            </p>
          </div>

          {feedbackList.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No feedback records submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {feedbackList.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 text-xs sm:text-sm"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          fb.rating === 'like'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {fb.rating === 'like' ? <ThumbsUp className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />}
                        <span>User Rated: {fb.rating === 'like' ? 'Accurate' : 'Inaccurate'}</span>
                      </span>

                      <span className="font-mono text-slate-500 text-xs">Target: {fb.analysisId}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 text-xs">{new Date(fb.createdAt).toLocaleString()}</span>
                    </div>

                    {fb.comments && (
                      <p className="text-slate-700 dark:text-slate-300 italic pl-1 border-l-2 border-indigo-500">
                        "{fb.comments}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteFeedback(fb.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                    title="Dismiss / remove feedback entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Model Health */}
      {activeTab === 'model' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Bi-LSTM Runtime Checkpoint Telemetry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Persistent in-memory pre-trained deep learning inference service.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block mb-1">Architecture</span>
              <span className="font-bold text-slate-900 dark:text-white">
                Bidirectional LSTM with Attention Pooling
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block mb-1">Max Sequence Length</span>
              <span className="font-bold text-slate-900 dark:text-white">128 Tokens (Post-padded)</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block mb-1">Embedding Dimensions</span>
              <span className="font-bold text-slate-900 dark:text-white">64-dim Word Vector Space</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block mb-1">Hidden Units</span>
              <span className="font-bold text-slate-900 dark:text-white">64 Forward + 64 Backward (128 Bi)</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block mb-1">Classification Head</span>
              <span className="font-bold text-slate-900 dark:text-white">Sigmoid (0.50 Decision Threshold)</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block mb-1">Model Loading Pattern</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Single Startup Load (Zero per-request reload)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
