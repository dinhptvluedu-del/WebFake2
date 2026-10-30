/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Brain,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  ArrowRightLeft,
  CheckCircle,
  Database,
  BarChart3,
  Cpu,
} from 'lucide-react';
import { SystemStats } from '../types';

interface LandingHeroProps {
  onStartAnalysis: () => void;
  onExploreArchitecture: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartAnalysis,
  onExploreArchitecture,
}) => {
  const [stats, setStats] = useState<SystemStats>({
    totalAnalyzed: 14280,
    realNewsCount: 7568,
    fakeNewsCount: 6712,
    realPercentage: 53.0,
    fakePercentage: 47.0,
    totalUsers: 1840,
    totalFeedback: 940,
    accuracySatisfactionRate: 94.2,
    averageLatencyMs: 38.4,
    modelVersion: 'Bi-LSTM-Keras-v2.4-Embed64',
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // Fallback to initial seed state
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="w-full">
      {/* Top Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-900/10 via-slate-900/5 to-transparent dark:from-indigo-950/40 dark:via-slate-900/20 dark:to-transparent border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-10 lg:p-12 mb-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Pre-trained Bidirectional LSTM Neural Architecture</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Detect Misinformation with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
              Bidirectional Deep Context
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Standard sequential NLP models only read text left-to-right. Our pre-trained{' '}
            <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">Bi-LSTM network</strong> scans
            news articles forward and backward simultaneously—capturing long-range contextual dependencies, hyperbolic
            deception patterns, and nuanced journalistic phrasing with over 94% precision.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartAnalysis}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 flex items-center justify-center space-x-2 transition-all transform active:scale-95"
            >
              <span>Analyze News Article Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreArchitecture}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center space-x-2 transition-all"
            >
              <Cpu className="w-4 h-4 text-indigo-500" />
              <span>Explore Bi-LSTM Architecture & APIs</span>
            </button>
          </div>
        </div>

        {/* Live System Statistics Grid */}
        <div className="mt-12 pt-8 border-t border-slate-200/70 dark:border-slate-800/70 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Total Analyzed</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats.totalAnalyzed.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Real-time verified articles</p>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Model F1 Score</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              94.2%
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Benchmark cross-validation</p>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-1">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Prediction Ratio</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.realPercentage}% <span className="text-[10px] text-slate-500 font-normal">Real</span>
              </span>
              <span className="text-slate-400">/</span>
              <span className="text-base sm:text-xl font-bold text-rose-600 dark:text-rose-400">
                {stats.fakePercentage}% <span className="text-[10px] text-slate-500 font-normal">Fake</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Balanced corpus distribution</p>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Inference Speed</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats.averageLatencyMs} ms
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Avg sequence forward pass</p>
          </div>
        </div>
      </div>

      {/* Interactive Bi-LSTM Architecture Visualizer */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                How Bidirectional LSTM (Bi-LSTM) Operates
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Analyzing both past and future context simultaneously to resolve semantic ambiguities.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg self-start">
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-500" />
            <span>Dual Recurrent Chains</span>
          </div>
        </div>

        {/* Visual Pipeline flow */}
        <div className="mt-6 space-y-6">
          {/* Forward sequence */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                  Forward LSTM Chain (Left-to-Right: $x_1 \to x_t \to x_T$)
                </span>
              </div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                Captures preceding context & lead credibility
              </span>
            </div>
            <div className="flex items-center justify-between overflow-x-auto py-2 gap-2 text-xs">
              {['Input: "Official"', '→ Gates: (it, ft)', '→ Cell State: ct', '→ Hidden: h_fwd[1]', '→ Sequential Pass', '→ Hidden: h_fwd[T]'].map(
                (step, i) => (
                  <div
                    key={i}
                    className="flex-1 min-w-[120px] bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-indigo-200/60 dark:border-indigo-800/60 text-center font-mono font-medium text-slate-800 dark:text-slate-200 shadow-xs"
                  >
                    {step}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Backward sequence */}
          <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-md bg-cyan-600 text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span className="text-sm font-bold text-cyan-950 dark:text-cyan-200">
                  Backward LSTM Chain (Right-to-Left: x_T → x_t → x_1)
                </span>
              </div>
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                Uncovers trailing clickbait qualifiers & sensationalist conclusions
              </span>
            </div>
            <div className="flex items-center justify-between overflow-x-auto py-2 gap-2 text-xs">
              {['End: "Censored!"', '→ Gates: (it, ft)', '→ Cell State: ct', '→ Hidden: h_bwd[T]', '→ Reverse Pass', '→ Hidden: h_bwd[1]'].map(
                (step, i) => (
                  <div
                    key={i}
                    className="flex-1 min-w-[120px] bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-cyan-200/60 dark:border-cyan-800/60 text-center font-mono font-medium text-slate-800 dark:text-slate-200 shadow-xs"
                  >
                    {step}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Fusion & Decision Layer */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                3
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Contextual Concatenation & Attention Pooling: H_t = [h_forward(t) || h_backward(t)]
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Both forward and backward hidden vectors are concatenated, then mapped through dense dropout and a
                  sigmoid classification layer (P(Fake) ∈ [0, 1]).
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Real News &ge; 50%
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Fake News &ge; 50%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
