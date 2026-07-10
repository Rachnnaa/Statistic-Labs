import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PracticeProblem } from '../types';
import MathTex from './MathTex';

const generateRandomProblem = (difficulty: 'easy' | 'medium' | 'hard'): PracticeProblem => {
  const rand = Math.random();
  
  if (difficulty === 'easy') {
    if (rand < 0.5) {
      // Binomial Mean
      const n = Math.floor(Math.random() * 60 + 20);
      const p = parseFloat((Math.random() * 0.4 + 0.1).toFixed(2));
      const ans = (n * p).toFixed(2);
      return {
        id: `easy-binom-mean-${n}-${p}`,
        difficulty: 'easy',
        topic: 'Binomial Distribution',
        question: `Suppose an experiment consists of $n = ${n}$ independent Bernoulli trials, each with success probability $p = ${p}$. Find the mathematical expectation (mean) of the number of successes.`,
        answerType: 'number',
        correctAnswer: ans,
        tolerance: 0.05,
        solution: `The mathematical expectation (mean) $\\mu$ of a Binomial distribution is given by:
$$\\mu = n \\cdot p$$
Substituting our given parameters:
$$\\mu = ${n} \\cdot ${p} = ${ans}$$
Therefore, the expected number of successes is exactly **${ans}**.`
      };
    } else {
      // Standard deviation from variance
      const varVal = [16, 25, 36, 49, 64, 81, 100, 144][Math.floor(Math.random() * 8)];
      const ans = Math.sqrt(varVal).toString();
      return {
        id: `easy-norm-sd-${varVal}`,
        difficulty: 'easy',
        topic: 'Normal Distribution',
        question: `A normal distribution models the scores of an exam. If the theoretical variance of the scores is $\\sigma^2 = ${varVal}$, what is the standard deviation $\\sigma$?`,
        answerType: 'number',
        correctAnswer: ans,
        tolerance: 0.01,
        solution: `By definition, the standard deviation $\\sigma$ is the positive square root of the variance $\\sigma^2$:
$$\\sigma = \\sqrt{\\sigma^2}$$
Substituting our given parameter:
$$\\sigma = \\sqrt{${varVal}} = ${ans}$$
Therefore, the standard deviation of the scores is exactly **${ans}**.`
      };
    }
  } else if (difficulty === 'medium') {
    if (rand < 0.5) {
      // Uniform probability
      const a = Math.floor(Math.random() * 10);
      const b = a + Math.floor(Math.random() * 15 + 10);
      const boundary = a + Math.floor((b - a) * (Math.random() * 0.4 + 0.4));
      const ans = ((b - boundary) / (b - a)).toFixed(4);
      return {
        id: `med-unif-${a}-${b}-${boundary}`,
        difficulty: 'medium',
        topic: 'Continuous Uniform',
        question: `The waiting time for a shuttle bus is uniformly distributed between $a = ${a}$ and $b = ${b}$ minutes. What is the probability that a passenger waits more than $x = ${boundary}$ minutes?`,
        answerType: 'number',
        correctAnswer: ans,
        tolerance: 0.02,
        solution: `The probability density function (PDF) of a continuous uniform distribution is $f(x) = \\frac{1}{b - a}$ for $a \\le x \\le b$.
To find the probability of waiting more than $x = ${boundary}$ minutes, we integrate the PDF from $${boundary}$ to the maximum bound $b = ${b}$:
$$P(X > ${boundary}) = \\frac{b - x}{b - a}$$
Substituting our parameters:
$$P(X > ${boundary}) = \\frac{${b} - ${boundary}}{${b} - ${a}} = \\frac{${b - boundary}}{${b - a}} \\approx ${ans}$$
The probability of waiting more than $${boundary}$ minutes is approximately **${ans}**.`
      };
    } else {
      // Poisson Probability for k = 0
      const lambda = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
      const ans = Math.exp(-lambda).toFixed(4);
      return {
        id: `med-poisson-${lambda}`,
        difficulty: 'medium',
        topic: 'Poisson Distribution',
        question: `An office copier breaks down at a constant average rate of $\\lambda = ${lambda}$ times per month. What is the probability that there are exactly $k = 0$ breakdowns in a given month?`,
        answerType: 'number',
        correctAnswer: ans,
        tolerance: 0.02,
        solution: `The probability mass function (PMF) of a Poisson distribution is:
$$P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$$
To find the probability of exactly $k = 0$ breakdowns:
$$P(X = 0) = \\frac{\\lambda^0 e^{-\\lambda}}{0!} = e^{-\\lambda}$$
Substituting $\\lambda = ${lambda}$:
$$P(X = 0) = e^{-${lambda}} \\approx ${ans}$$
Therefore, the probability of 0 breakdowns is approximately **${ans}**.`
      };
    }
  } else {
    // Hard problems
    if (rand < 0.5) {
      // Normal Z-Score calculation
      const mean = Math.floor(Math.random() * 30 + 50);
      const sd = Math.floor(Math.random() * 8 + 4);
      const val = mean + Math.floor(sd * (Math.random() * 1.5 + 0.5));
      const ans = ((val - mean) / sd).toFixed(2);
      return {
        id: `hard-zscore-${mean}-${sd}-${val}`,
        difficulty: 'hard',
        topic: 'Normal Distribution',
        question: `A continuous random variable $X$ is normally distributed with mean $\\mu = ${mean}$ and standard deviation $\\sigma = ${sd}$. Calculate the Z-score for $x = ${val}$.`,
        answerType: 'number',
        correctAnswer: ans,
        tolerance: 0.02,
        solution: `The standard score (Z-score) represents the number of standard deviations a value $x$ lies away from the mean $\\mu$:
$$Z = \\frac{x - \\mu}{\\sigma}$$
Substituting our parameters:
$$Z = \\frac{${val} - ${mean}}{${sd}} = \\frac{${val - mean}}{${sd}} \\approx ${ans}$$
The corresponding Z-score is **${ans}**.`
      };
    } else {
      // Exponential CDF
      const lambda = parseFloat((Math.random() * 0.4 + 0.2).toFixed(2));
      const val = Math.floor(Math.random() * 2 + 1);
      const ans = (1 - Math.exp(-lambda * val)).toFixed(4);
      return {
        id: `hard-exp-${lambda}-${val}`,
        difficulty: 'hard',
        topic: 'Exponential Distribution',
        question: `The wait time (in minutes) at an intersection has an exponential distribution with failure rate $\\lambda = ${lambda}$. Find the probability that a driver waits less than $x = ${val}$ minutes.`,
        answerType: 'number',
        correctAnswer: ans,
        tolerance: 0.02,
        solution: `The cumulative distribution function (CDF) of an Exponential distribution is given by:
$$F(x) = 1 - e^{-\\lambda x} \\quad (x \\ge 0)$$
To calculate the probability of waiting less than $x = ${val}$ minutes:
$$P(X < ${val}) = F(${val}) = 1 - e^{-${lambda} \\cdot ${val}} = 1 - e^{-${(lambda * val).toFixed(2)}}$$
Calculating this value:
$$P(X < ${val}) \\approx 1 - ${Math.exp(-lambda * val).toFixed(4)} = ${ans}$$
Therefore, the probability of waiting less than $${val}$ minutes is approximately **${ans}**.`
      };
    }
  }
};

export default function PracticeProblems() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentProblem, setCurrentProblem] = useState<PracticeProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Initialize a problem on load / change difficulty
  useEffect(() => {
    setCurrentProblem(generateRandomProblem(difficulty));
    setUserAnswer('');
    setIsSubmitted(false);
    setShowSolution(false);
  }, [difficulty]);

  const handleNextProblem = () => {
    setCurrentProblem(generateRandomProblem(difficulty));
    setUserAnswer('');
    setIsSubmitted(false);
    setShowSolution(false);
  };

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProblem || isSubmitted) return;

    const parsedUser = parseFloat(userAnswer);
    const parsedCorrect = parseFloat(currentProblem.correctAnswer);
    const tolerance = currentProblem.tolerance || 0.01;

    if (isNaN(parsedUser)) {
      alert("Please enter a valid decimal number!");
      return;
    }

    const difference = Math.abs(parsedUser - parsedCorrect);
    const correct = difference <= tolerance;

    setIsCorrect(correct);
    setIsSubmitted(true);
    setShowSolution(true);
  };

  return (
    <div className="max-w-3xl mx-auto" id="practice-problems-view">
      {/* Selector tabs for difficulty */}
      <div className="flex gap-2 rounded-xl bg-gray-100 dark:bg-slate-800 p-1 mb-8" id="difficulty-tabs">
        {(['easy', 'medium', 'hard'] as const).map(diff => {
          const active = difficulty === diff;
          return (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer uppercase ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
              }`}
              id={`btn-diff-${diff}`}
            >
              {diff}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {currentProblem && (
          <motion.div
            key={currentProblem.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass-card rounded-2xl p-8 space-y-6"
            id="problem-container"
          >
            {/* Header: Topic tag */}
            <div className="flex justify-between items-center" id="problem-header">
              <span className="text-xs bg-indigo-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                {currentProblem.topic}
              </span>
              <span className="text-xs font-semibold text-gray-400 capitalize">{currentProblem.difficulty} Problem</span>
            </div>

            {/* Question description */}
            <div className="space-y-4" id="problem-body">
              <h3 className="text-md md:text-lg font-bold text-gray-900 dark:text-white leading-relaxed" id="problem-question">
                <MathTex math={currentProblem.question} />
              </h3>
              <p className="text-xs text-gray-400 italic">
                *Round your answer to 4 decimal places where applicable.
              </p>
            </div>

            {/* Answer Input form */}
            <form onSubmit={handleCheckAnswer} className="space-y-4" id="problem-form">
              <div className="flex flex-col sm:flex-row gap-3" id="input-row">
                <input
                  type="text"
                  placeholder="Enter your numeric answer..."
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  disabled={isSubmitted}
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950 dark:text-white"
                />
                {!isSubmitted ? (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow cursor-pointer transition-colors"
                    id="submit-answer-btn"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextProblem}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    id="next-problem-btn"
                  >
                    Next Problem
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Submit result indicators */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`p-4 rounded-xl flex items-start gap-3 border ${
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400'
                }`}
                id="problem-feedback-box"
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    {isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                  </h4>
                  <p className="text-xs font-semibold mt-0.5">
                    {isCorrect
                      ? "Fabulous calibration! You solved the metrics correctly."
                      : `The correct expected value was around ${currentProblem.correctAnswer}. Let's examine the math proof below.`}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Complete step-by-step math proof */}
            {showSolution && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50 rounded-2xl space-y-4"
                id="problem-solution-box"
              >
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-500" /> Complete Mathematics Solution
                </h4>
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-3 font-semibold" id="solution-latex-rendering">
                  <MathTex math={currentProblem.solution} block={true} />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
