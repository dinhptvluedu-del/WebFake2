/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Brain,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Send,
  ThumbsUp,
  ThumbsDown,
  Info,
  Clock,
  FileText,
  Sliders,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { PredictionResult, TokenAttribution } from '../types';
import { SAMPLE_ARTICLES } from '../utils/bilstmEngine';
import { useAuth } from '../context/AuthContext';

interface NewsAnalyzerProps {
  onPredictionComplete?: (result: PredictionResult) => void;
}

export const NewsAnalyzer: React.FC<NewsAnalyzerProps> = ({ onPredictionComplete }) => {
  const { token, user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [threshold, setThreshold] = useState<number>(0.50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  // Selected token for explainability inspection
  const [selectedToken, setSelectedToken] = useState<TokenAttribution | null>(null);

  // User feedback state
  const [feedbackRating, setFeedbackRating] = useState<'like' | 'dislike' | null>(null);
  const [feedbackIsCorrect, setFeedbackIsCorrect] = useState<boolean | null>(null);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  // Input statistics
  const characterCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleClear = () => {
    setInputText('');
    setPrediction(null);
    setError(null);
    setSelectedToken(null);
    setFeedbackSubmitted(false);
    setFeedbackRating(null);
  };

  const loadSample = (sampleText: string) => {
    setInputText(sampleText);
    setError(null);
    setPrediction(null);
    setSelectedToken(null);
    setFeedbackSubmitted(false);
    setFeedbackRating(null);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() || inputText.trim().length < 15) {
      setError('Please provide a news article of at least 15 characters for meaningful Bi-LSTM analysis.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setSelectedToken(null);
    setFeedbackSubmitted(false);
    setFeedbackRating(null);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          text: inputText,
          threshold,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Prediction failed');
      }

      setPrediction(data);
      if (onPredictionComplete) {
        onPredictionComplete(data);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during Bi-LSTM model inference.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prediction || !feedbackRating) return;

    setFeedbackSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          analysisId: prediction.id,
          rating: feedbackRating,
          isCorrect: feedbackIsCorrect !== null ? feedbackIsCorrect : feedbackRating === 'like',
          comments: feedbackComments,
        }),
      });
      if (res.ok) {
        setFeedbackSubmitted(true);
      }
    } catch {
      // Ignore feedback network errors
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Input Section Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span>News Article Input & Verification</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter or paste news text below to execute the 10-step Bi-LSTM bidirectional inference pipeline.
            </p>
          </div>

          {/* Quick preset selector */}
          <div className="flex items-center space-x-1.5 self-start sm:self-auto">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" />
              Presets:
            </span>
            <button
              onClick={() => loadSample(SAMPLE_ARTICLES[0].text)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
              title="Sensationalist Miracle Cure (Deceptive)"
            >
              Fake Cure
            </button>
            <button
              onClick={() => loadSample(SAMPLE_ARTICLES[1].text)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
              title="Political Conspiracy Coverup (Deceptive)"
            >
              Fake Politics
            </button>
            <button
              onClick={() => loadSample(SAMPLE_ARTICLES[2].text)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
              title="NASA Peer-Reviewed Scientific Report (Credible)"
            >
              Real NASA
            </button>
            <button
              onClick={() => loadSample(SAMPLE_ARTICLES[3].text)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
              title="Federal Reserve Economic Report (Credible)"
            >
              Real Fed
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="mt-6">
          <label htmlFor="news-article-input" className="sr-only">
            News article content to analyze
          </label>
          <textarea
            id="news-article-input"
            rows={7}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste news headline and full article body here (minimum 15 characters). E.g. 'According to an official statement by the Federal Reserve, benchmark interest rates remained steady...' or 'Doctors furious after shocking secret cure is exposed...'"
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm sm:text-base leading-relaxed transition-all resize-y"
          />
        </div>

        {/* Live Counters and Controls */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>
                <strong className="text-slate-700 dark:text-slate-300">{wordCount}</strong> words
              </span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>
              <strong className="text-slate-700 dark:text-slate-300">{characterCount}</strong> chars
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>~{estimatedReadTime} min read</span>
            </span>
          </div>

          {/* Model Sensitivity Threshold Slider */}
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <Sliders className="w-3.5 h-3.5 text-indigo-500" />
            <label htmlFor="threshold-slider" className="font-semibold text-slate-700 dark:text-slate-300">
              Sensitivity Threshold:
            </label>
            <input
              id="threshold-slider"
              type="range"
              min="0.20"
              max="0.80"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-20 sm:w-24 accent-indigo-600 h-1.5 cursor-pointer"
            />
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 w-8 text-right">
              {threshold.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleClear}
            disabled={isLoading || (!inputText && !prediction)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Input</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !inputText.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Bi-LSTM Inference...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Analyze with Bi-LSTM Model</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Prediction Results Display */}
      {prediction && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Header & Status Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Analysis Report #{prediction.id}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                  {prediction.inferenceTimeMs}ms inference
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Classification Verdict
              </h3>
            </div>

            {/* Prominent Class Badge */}
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-3 px-5 py-3 rounded-2xl border ${
                  prediction.predictedClass === 'Fake News'
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 shadow-sm shadow-rose-500/10'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 shadow-sm shadow-emerald-500/10'
                }`}
              >
                {prediction.predictedClass === 'Fake News' ? (
                  <AlertTriangle className="w-7 h-7 text-rose-600 dark:text-rose-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                    Predicted Class
                  </p>
                  <p className="text-xl sm:text-2xl font-black tracking-tight">
                    {prediction.predictedClass}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Confidence Gauge & Probability Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Radial / Circular Score Gauge */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Gauge Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-200 dark:text-slate-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - prediction.confidenceScore / 100)}
                    strokeLinecap="round"
                    className={`${
                      prediction.predictedClass === 'Fake News'
                        ? 'text-rose-500 dark:text-rose-400'
                        : 'text-emerald-500 dark:text-emerald-400'
                    } transition-all duration-1000 ease-out`}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {prediction.confidenceScore}%
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Confidence
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                Bi-LSTM model confidence score
              </p>
            </div>

            {/* Probability Breakdown Progress Bars */}
            <div className="md:col-span-2 space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Model Softmax/Sigmoid Probability Distribution</span>
                <span className="text-xs font-normal text-slate-500">Threshold: {threshold}</span>
              </h4>

              {/* Fake News Probability bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-600 dark:text-rose-400 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5" />
                    Fake News Probability
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {(prediction.fakeProbability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-rose-500 h-3 rounded-full transition-all duration-700"
                    style={{ width: `${prediction.fakeProbability * 100}%` }}
                  />
                </div>
              </div>

              {/* Real News Probability bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                    Real News Probability
                  </span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {(prediction.realProbability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-3 rounded-full transition-all duration-700"
                    style={{ width: `${prediction.realProbability * 100}%` }}
                  />
                </div>
              </div>

              {/* Sequence Metadata */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Total Tokens</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {prediction.tokenCount}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Bi-LSTM Window</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {prediction.sequenceLength} / 128
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Vocab Hits</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {prediction.modelDetails.vocabMatches} terms
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Explainability Section: Token Attribution Heatmap */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Brain className="w-4 h-4 text-indigo-500" />
                  <span>Bidirectional Attention & Token Attribution (Explainable AI)</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Words highlighted in <span className="text-rose-600 font-semibold">red</span> pushed the model towards
                  Fake News. Words in <span className="text-emerald-600 font-semibold">green</span> signaled credible
                  journalistic patterns. Click any word to inspect its weight.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center space-x-2 text-[10px] font-semibold shrink-0">
                <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                  Fake Marker (+)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Real Marker (-)
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Neutral
                </span>
              </div>
            </div>

            {/* Tokenized Heatmap */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed max-h-56 overflow-y-auto flex flex-wrap gap-1.5 select-text">
              {prediction.tokensAttribution.map((attr, idx) => {
                let badgeClass =
                  'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
                if (attr.type === 'fake_indicator') {
                  badgeClass =
                    'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800/80 font-semibold';
                } else if (attr.type === 'real_indicator') {
                  badgeClass =
                    'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800/80 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedToken(attr)}
                    className={`px-1.5 py-0.5 rounded-md text-xs transition-colors cursor-pointer ${badgeClass}`}
                    title={`Click to inspect token weight: ${attr.weight}`}
                  >
                    {attr.token}
                  </button>
                );
              })}
            </div>

            {/* Selected Token Inspector Drawer */}
            {selectedToken && (
              <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-indigo-950 dark:text-indigo-200 font-mono text-sm">
                    "{selectedToken.token}"
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">Attribution Weight:</span>
                  <span
                    className={`font-mono font-bold ${
                      selectedToken.weight > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {selectedToken.weight > 0 ? `+${selectedToken.weight}` : selectedToken.weight}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    ({selectedToken.type === 'fake_indicator' ? 'Pushes toward Fake' : selectedToken.type === 'real_indicator' ? 'Pushes toward Real' : 'Context Neutral'})
                  </span>
                </div>
                <button
                  onClick={() => setSelectedToken(null)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-semibold"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Mandatory Responsible AI & Factual Limitation Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-200">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Important Model Disclaimer & Factual Distinction</p>
              <p className="leading-relaxed text-amber-800/90 dark:text-amber-300/90">
                This prediction represents an algorithmic evaluation produced by a pre-trained Bidirectional LSTM model
                trained to recognize structural, sensationalist, and journalistic linguistic patterns. It does{' '}
                <strong>not</strong> represent absolute or legally verified factual truth. Breaking real-world events,
                satire, and specialized technical news should always be cross-referenced with established fact-checking
                consortiums.
              </p>
            </div>
          </div>

          {/* User Feedback Form (Section 2.E) */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            {feedbackSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-3 text-emerald-800 dark:text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Thank you for your feedback!</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Your evaluation has been recorded under ID <code>{prediction.id}</code> and queued for model dataset refinement.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Evaluate this Prediction Result
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Help us improve future Bi-LSTM model checkpoints by submitting your verdict.
                    </p>
                  </div>

                  {/* Like / Dislike Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFeedbackRating('like');
                        setFeedbackIsCorrect(true);
                      }}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        feedbackRating === 'like'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/30'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Accurate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFeedbackRating('dislike');
                        setFeedbackIsCorrect(false);
                      }}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        feedbackRating === 'dislike'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700 ring-2 ring-rose-500/30'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>Inaccurate</span>
                    </button>
                  </div>
                </div>

                {/* Optional comment input */}
                {feedbackRating && (
                  <div className="space-y-2 animate-in fade-in">
                    <label htmlFor="feedback-comment-input" className="sr-only">
                      Optional feedback comments
                    </label>
                    <input
                      id="feedback-comment-input"
                      type="text"
                      value={feedbackComments}
                      onChange={(e) => setFeedbackComments(e.target.value)}
                      placeholder="Optional comment: What specific context or nuances did the model miss or capture well?"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={feedbackSubmitting}
                        className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center space-x-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{feedbackSubmitting ? 'Submitting...' : 'Submit Evaluation'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
