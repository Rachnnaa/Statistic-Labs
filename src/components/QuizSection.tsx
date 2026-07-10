import React, { useState } from 'react';
import { HelpCircle, Check, X, RotateCcw, Award, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizQuestion } from '../types';

const statisticsQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "If a continuous random variable is normally distributed, what percentage of values falls within exactly 2 standard deviations of the mean under the Empirical Rule?",
    options: ["68.27%", "95.45%", "99.73%", "50.00%"],
    correctIndex: 1,
    explanation: "Under the Empirical Rule (or 68-95-99.7 rule) for a Normal distribution, approximately 68.27% of values fall within 1 standard deviation, 95.45% within 2 standard deviations, and 99.73% within 3 standard deviations of the mean."
  },
  {
    id: 2,
    question: "Which distribution models the number of successes in a fixed sequence of n independent trials, where each trial has a constant probability p of success?",
    options: ["Poisson Distribution", "Binomial Distribution", "Exponential Distribution", "Normal Distribution"],
    correctIndex: 1,
    explanation: "The Binomial distribution models the number of successes k in a fixed number n of independent Bernoulli trials, each having a constant success probability p."
  },
  {
    id: 3,
    question: "Which distribution has a mean and variance that are mathematically equal to each other?",
    options: ["Continuous Uniform", "Exponential Distribution", "Poisson Distribution", "Student's t-Distribution"],
    correctIndex: 2,
    explanation: "The Poisson distribution has a single parameter λ (lambda) which represents both its theoretical mean and its theoretical variance (Mean = λ, Variance = λ)."
  },
  {
    id: 4,
    question: "What unique property is associated with the Exponential distribution, stating that the future probability is independent of how much time has already passed?",
    options: ["Symmetry", "Asymptotics", "Memorylessness", "Bimodality"],
    correctIndex: 2,
    explanation: "The Exponential distribution is famous for its 'memoryless' property: P(X > s + t | X > s) = P(X > t). For example, the probability that a light bulb lasts an extra hour is independent of how long it has already run."
  },
  {
    id: 5,
    question: "What happens to the Student's t-distribution as its degrees of freedom approach infinity?",
    options: [
      "It converges exactly to the Standard Normal (Z) distribution.",
      "It becomes heavily skewed to the right.",
      "Its variance approaches zero.",
      "It turns into a discrete Binomial distribution."
    ],
    correctIndex: 0,
    explanation: "As the degrees of freedom ν approach infinity, the heavy tails of Student's t-distribution shrink and it converges exactly to the Standard Normal (Gaussian) distribution."
  },
  {
    id: 6,
    question: "The Central Limit Theorem guarantees that the sampling distribution of the sample mean will approach a Normal distribution as sample size grows, regardless of what?",
    options: [
      "Whether the samples are independent",
      "The shape of the parent population distribution",
      "Whether the variance is finite",
      "The total number of samples drawn"
    ],
    correctIndex: 1,
    explanation: "The magic of the Central Limit Theorem (CLT) is that it works regardless of the parent population's shape (skewed, uniform, bimodal, etc.), provided the parent has a finite mean and variance."
  },
  {
    id: 7,
    question: "If an Urn contains 6 red and 4 blue balls, and we draw 2 balls WITHOUT replacement, are the outcomes of the first and second draws independent?",
    options: [
      "Yes, because the probability is constant.",
      "No, because drawing without replacement changes the available pool for the second draw.",
      "Yes, because balls are drawn randomly.",
      "It depends on the color of the drawn balls."
    ],
    correctIndex: 1,
    explanation: "Drawing WITHOUT replacement means the outcome of the first draw alters the proportions of balls remaining, directly influencing the probabilities of the second draw. Therefore, the draws are dependent."
  },
  {
    id: 8,
    question: "Which continuous distribution represents a state of complete ignorance or equal likelihood across a bounded interval [a, b]?",
    options: ["Normal Distribution", "Continuous Uniform Distribution", "Exponential Distribution", "Chi-Square Distribution"],
    correctIndex: 1,
    explanation: "The Continuous Uniform distribution represents equal probability density across a specified interval, making all equal-width intervals equally likely."
  },
  {
    id: 9,
    question: "William Gosset published the t-distribution in 1908 under which famous pseudonym because his employer (Guinness Brewery) forbade employees from publishing?",
    options: ["Student", "Snedecor", "Fisher", "Poisson"],
    correctIndex: 0,
    explanation: "William Sealy Gosset published his work under the pen name 'Student' in the journal Biometrika, which is why we call it Student's t-Distribution today."
  },
  {
    id: 10,
    question: "Which distribution is formed by taking the sum of squares of k independent standard normal random variables?",
    options: ["F-Distribution", "Student's t-Distribution", "Chi-Square Distribution", "Exponential Distribution"],
    correctIndex: 2,
    explanation: "By definition, if Z_1, ..., Z_k are independent standard normal random variables, the sum of their squares follows a Chi-Square distribution with k degrees of freedom."
  }
];

export default function QuizSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = statisticsQuizQuestions[currentIndex];

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null) return; // Prevent multiple clicks
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentIndex < statisticsQuizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setQuizFinished(false);
    setScore(0);
    setShowExplanation(false);
  };

  const progressPct = ((currentIndex + 1) / statisticsQuizQuestions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto" id="quiz-view">
      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key="quiz-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-card rounded-2xl p-8 space-y-6"
            id="quiz-container"
          >
            {/* Header: Progress indicator */}
            <div className="flex justify-between items-center text-sm" id="quiz-progress-header">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Question {currentIndex + 1} of {statisticsQuizQuestions.length}</span>
              <span className="font-mono font-semibold text-gray-500">Score: {score}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden" id="quiz-progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                className="h-full bg-blue-600 rounded-full"
              />
            </div>

            {/* Question Text */}
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-relaxed" id="quiz-question-text">
              {currentQuestion.question}
            </h3>

            {/* Options list */}
            <div className="space-y-3" id="quiz-options-list">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOpt = idx === currentQuestion.correctIndex;
                const isWrongSelection = isSelected && !isCorrectOpt;

                let optionStyles = "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50";
                let icon = null;

                if (selectedOption !== null) {
                  if (isCorrectOpt) {
                    optionStyles = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold";
                    icon = <Check className="w-4 h-4 text-emerald-500 shrink-0" />;
                  } else if (isWrongSelection) {
                    optionStyles = "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold";
                    icon = <X className="w-4 h-4 text-rose-500 shrink-0" />;
                  } else {
                    optionStyles = "border-gray-100 dark:border-slate-800 opacity-50 bg-white dark:bg-slate-800";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    disabled={selectedOption !== null}
                    className={`w-full flex items-center justify-between p-4 border rounded-xl text-sm font-semibold transition-all cursor-pointer text-left ${optionStyles}`}
                    id={`quiz-option-${idx}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-slate-800/80 text-gray-500 flex items-center justify-center text-xs font-bold font-mono">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl space-y-2"
                id="quiz-explanation-box"
              >
                <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> Explanation
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  {currentQuestion.explanation}
                </p>
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase shadow cursor-pointer transition-colors"
                    id="quiz-next-btn"
                  >
                    {currentIndex < statisticsQuizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="quiz-score-card"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-2xl p-8 text-center space-y-6"
            id="score-card-container"
          >
            <div className="w-20 h-20 bg-blue-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 shadow-xl shadow-blue-500/10" id="score-award-badge">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1.5" id="score-text-wrapper">
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Congratulations!</h3>
              <p className="text-sm text-gray-500 font-medium">You completed the Interactive Statistics Quiz</p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl max-w-sm mx-auto" id="score-results">
              <div className="flex justify-around items-center" id="score-metrics">
                <div>
                  <span className="block text-2xl font-black text-blue-600 font-mono">{score} / 10</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Correct Answers</span>
                </div>
                <div className="w-px h-10 bg-gray-200 dark:bg-slate-700" />
                <div>
                  <span className="block text-2xl font-black text-amber-500 font-mono">{score * 10}%</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Final Accuracy</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed" id="score-message">
              {score >= 8
                ? "Excellent job! You have established a pristine structural understanding of probability distributions."
                : score >= 5
                ? "Good work! Review the distributions handbooks to achieve perfect calibration."
                : "Keep studying! Try experimenting with parameters in the Explorer to build intuitive statistical reasoning."}
            </p>

            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 mx-auto cursor-pointer text-xs uppercase"
              id="quiz-restart-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restart Quiz
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
