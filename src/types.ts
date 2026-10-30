/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
}

export interface TokenAttribution {
  token: string;
  weight: number;
  type: 'fake_indicator' | 'real_indicator' | 'neutral';
}

export interface PredictionResult {
  id: string;
  textExcerpt: string;
  fullText: string;
  predictedClass: 'Fake News' | 'Real News';
  confidenceScore: number;
  fakeProbability: number;
  realProbability: number;
  tokenCount: number;
  sequenceLength: number;
  tokensAttribution: TokenAttribution[];
  inferenceTimeMs: number;
  analyzedAt: string;
  modelDetails: {
    architecture: string;
    maxSequenceLength: number;
    embeddingDim: number;
    hiddenUnits: number;
    vocabMatches: number;
  };
  userId?: string;
}

export interface HistoryItem {
  id: string;
  userId?: string;
  textExcerpt: string;
  fullText: string;
  predictedClass: 'Fake News' | 'Real News';
  confidenceScore: number;
  fakeProbability: number;
  realProbability: number;
  tokenCount: number;
  sequenceLength: number;
  tokensAttribution?: TokenAttribution[];
  inferenceTimeMs: number;
  analyzedAt: string;
}

export interface FeedbackItem {
  id: string;
  analysisId: string;
  userId?: string;
  rating: 'like' | 'dislike';
  isCorrect: boolean;
  comments?: string;
  createdAt: string;
}

export interface SystemStats {
  totalAnalyzed: number;
  realNewsCount: number;
  fakeNewsCount: number;
  realPercentage: number;
  fakePercentage: number;
  totalUsers: number;
  totalFeedback: number;
  accuracySatisfactionRate: number;
  averageLatencyMs: number;
  modelVersion: string;
}

export interface ModelInfo {
  architecture: string;
  framework: string;
  maxSequenceLength: number;
  embeddingDim: number;
  hiddenUnits: number;
  vocabularySize: number;
  classificationActivation: string;
  classes: string[];
  decisionThreshold: number;
  trainingMetrics: {
    accuracy: string;
    precision: string;
    recall: string;
    f1Score: string;
    testLoss: number;
    dataset: string;
  };
  layers: Array<{
    name: string;
    type: string;
    outputShape: string;
  }>;
}
