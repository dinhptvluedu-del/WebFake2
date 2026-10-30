/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanText,
  tokenizeText,
  runBiLSTMInference,
  SAMPLE_ARTICLES,
  MAX_SEQUENCE_LENGTH,
} from './bilstmEngine';

test('cleanText cleans HTML, URLs, and punctuation properly', () => {
  const dirty = 'Check https://example.com/fake-news <b>SHOCKING</b> truth & cover-up!!!';
  const cleaned = cleanText(dirty);
  assert.equal(cleaned.includes('https'), false);
  assert.equal(cleaned.includes('<b>'), false);
  assert.equal(cleaned.includes('shocking'), true);
  assert.equal(cleaned.includes('cover-up'), true);
});

test('tokenizeText splits words accurately and ignores redundant spaces', () => {
  const text = 'breaking news   spokesperson confirms  ';
  const tokens = tokenizeText(text);
  assert.deepEqual(tokens, ['breaking', 'news', 'spokesperson', 'confirms']);
});

test('runBiLSTMInference rejects empty input text', () => {
  assert.throws(() => {
    runBiLSTMInference('   ');
  }, /empty or contains no valid linguistic tokens/);
});

test('runBiLSTMInference accurately identifies sensationalist fake news sample', () => {
  const fakeSample = SAMPLE_ARTICLES[0].text;
  const result = runBiLSTMInference(fakeSample);

  assert.equal(result.predictedClass, 'Fake News');
  assert.ok(result.confidenceScore >= 50, `Expected confidence >= 50, got ${result.confidenceScore}`);
  assert.ok(result.fakeProbability > 0.5, `Expected fakeProbability > 0.5, got ${result.fakeProbability}`);
  assert.ok(result.tokensAttribution.length > 0);
  assert.ok(result.sequenceLength <= MAX_SEQUENCE_LENGTH);
  assert.ok(result.inferenceTimeMs > 0);
});

test('runBiLSTMInference accurately identifies objective journalistic real news sample', () => {
  const realSample = SAMPLE_ARTICLES[2].text;
  const result = runBiLSTMInference(realSample);

  assert.equal(result.predictedClass, 'Real News');
  assert.ok(result.confidenceScore >= 50, `Expected confidence >= 50, got ${result.confidenceScore}`);
  assert.ok(result.realProbability > 0.5, `Expected realProbability > 0.5, got ${result.realProbability}`);
  assert.ok(result.tokensAttribution.some(t => t.type === 'real_indicator'));
});

test('runBiLSTMInference produces valid attribution scores and probabilities summing to 1.0', () => {
  const text = 'Researchers published a peer-reviewed study regarding new findings.';
  const result = runBiLSTMInference(text);
  const sum = Math.round((result.fakeProbability + result.realProbability) * 100) / 100;
  assert.equal(sum, 1.0);
  assert.ok(result.id.startsWith('pred_'));
});
