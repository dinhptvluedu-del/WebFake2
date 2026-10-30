/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Brain,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

interface UserGuideProps {
  onGoToAnalyzer: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({ onGoToAnalyzer }) => {
  return (
    <div className="w-full space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              User Guide & Model Interpretation Manual
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Best practices for querying the pre-trained Bidirectional LSTM model and understanding results.
            </p>
          </div>
        </div>
      </div>

      {/* Guide Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Input Guidelines */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-xs">
              1
            </span>
            <span>Recommended Input Formatting</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Paste Headline and Article Body
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The Bi-LSTM model performs best when supplied with complete paragraphs rather than isolated 2-word slogans.
            For maximum accuracy:
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
            <li>Provide at least <strong>25 to 150 words</strong> of context.</li>
            <li>Include both the headline and the first introductory paragraph.</li>
            <li>Clean out non-standard emoji spam or excessive copy-paste metadata if present.</li>
          </ul>
        </div>

        {/* Step 2: Interpreting Labels */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-xs">
              2
            </span>
            <span>Interpreting Prediction Labels</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Real News vs. Fake News Classifications
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900 dark:text-emerald-300 block">Real News (Green)</strong>
                <span className="text-emerald-800/90 dark:text-emerald-400/90 leading-relaxed">
                  Indicates linguistic consistency with established journalistic standards, neutral tone, attribution to
                  named institutions or spokespeople, and absence of hyperbolic clickbait markers.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-900 dark:text-rose-300 block">Fake News (Red)</strong>
                <span className="text-rose-800/90 dark:text-rose-400/90 leading-relaxed">
                  Reflects stylistic alignment with deceptive disinformation, sensationalist outrage phrasing (e.g.,
                  "shocking banned miracle", "insiders confirm coverup"), or lack of verifiable corroboration.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Understanding Confidence */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-xs">
              3
            </span>
            <span>Understanding Confidence Scores</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Confidence Percentage Guide
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200">90% – 100%</span>
              <span className="text-emerald-600 font-semibold">High Conviction: Strong linguistic alignment</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200">70% – 89%</span>
              <span className="text-blue-600 font-semibold">Moderate Conviction: Prominent thematic indicators</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
              <span className="font-bold text-slate-800 dark:text-slate-200">50% – 69%</span>
              <span className="text-amber-600 font-semibold">Borderline / Nuanced: Mixed signals or short text</span>
            </div>
          </div>
        </div>

        {/* Step 4: AI Model Limitations */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-xs">
              4
            </span>
            <span>Crucial AI Model Limitations</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Boundaries of Algorithmic Verification
          </h3>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
            <li>
              <strong>Linguistic vs. Factual:</strong> The model evaluates writing style, structural patterns, and vocabulary
              distribution. It does not possess a real-time web crawler to check live events that occurred minutes ago.
            </li>
            <li>
              <strong>Satire & Parody:</strong> Sophisticated satire (e.g., The Onion) may be flagged as fake news because
              it deliberately mimics exaggerated disinformation structures.
            </li>
            <li>
              <strong>Opinion & Op-Eds:</strong> Highly impassioned genuine opinion pieces may occasionally receive lower
              real scores due to emotional tone.
            </li>
          </ul>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-indigo-950 dark:text-indigo-200">
            Ready to test an article with the pre-trained Bi-LSTM model?
          </h4>
          <p className="text-xs text-indigo-800/80 dark:text-indigo-400 mt-0.5">
            Load our pre-packaged real-world samples or paste any text from the web.
          </p>
        </div>
        <button
          onClick={onGoToAnalyzer}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 shadow-md shadow-indigo-600/20 flex items-center space-x-2 transition-all"
        >
          <span>Open News Analyzer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
