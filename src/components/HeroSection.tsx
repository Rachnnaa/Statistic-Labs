import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, TrendingUp, Compass, Award } from 'lucide-react';
import { motion } from 'motion/react';
import MathTex from './MathTex';

interface HeroSectionProps {
  onNavigate: (tab: 'explorer' | 'learn') => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  // Animated bell curve state in hero
  const [mean, setMean] = useState(0);
  const [std, setStd] = useState(1.0);

  useEffect(() => {
    let direction = 1;
    const interval = setInterval(() => {
      setMean(prev => {
        let next = prev + 0.05 * direction;
        if (next >= 1.5) direction = -1;
        if (next <= -1.5) direction = 1;
        return parseFloat(next.toFixed(2));
      });
      setStd(prev => {
        let next = prev + 0.02 * direction;
        if (next > 1.4) next = 1.4;
        if (next < 0.6) next = 0.6;
        return parseFloat(next.toFixed(2));
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Compute SVG points for the animated bell curve
  const svgPath = () => {
    const width = 500;
    const height = 180;
    const points: string[] = [];

    // Helper normal pdf
    const pdf = (x: number, m: number, s: number) => {
      const exponent = -Math.pow(x - m, 2) / (2 * Math.pow(s, 2));
      return (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    };

    // Plot x from -4 to 4
    for (let i = 0; i <= 100; i++) {
      const xVal = -4 + (i / 100) * 8;
      const yVal = pdf(xVal, mean, std);
      
      // Map xVal [-4, 4] -> [0, width]
      const svgX = (xVal + 4) * (width / 8);
      // Map yVal [0, 0.7] -> [height, 10]
      const svgY = height - (yVal / 0.7) * (height - 20);
      
      points.push(`${svgX},${svgY}`);
    }

    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="space-y-16" id="hero-view">
      {/* Hero Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="hero-banner">
        {/* Left column: Text specs */}
        <div className="lg:col-span-7 space-y-6 text-left" id="hero-left-text">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm" id="hero-badge">
            <Sparkles className="w-3.5 h-3.5" />
            Educational Statistics Laboratory
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-none tracking-tight" id="hero-main-title">
            Interactive <br className="hidden md:inline" />
            <span className="text-blue-600">Statistics</span> Laboratory
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 font-semibold leading-relaxed" id="hero-subtitle">
            &ldquo;Learn Probability Through Interactive Visualizations&rdquo;
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
            Calibrate distributions, perform real-time simulations, solve quizzes, and develop an intuitive understanding of statistical laws through high-precision calculations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4" id="hero-action-buttons">
            <button
              onClick={() => onNavigate('learn')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              id="start-learning-btn"
            >
              <BookOpen className="w-5 h-5" />
              Start Learning
            </button>
            <button
              onClick={() => onNavigate('explorer')}
              className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-2xl shadow-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-all border border-gray-100 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              id="explore-dist-btn"
            >
              <Compass className="w-5 h-5" />
              Explore Distributions
            </button>
          </div>
        </div>

        {/* Right column: Beautiful animated bell curve visualization */}
        <div className="lg:col-span-5 flex justify-center" id="hero-right-visual">
          <div className="w-full max-w-md h-64 bg-white dark:bg-slate-800/40 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-slate-800 flex items-center justify-center relative overflow-hidden" id="hero-curve-card">
            <svg viewBox="0 0 500 180" className="w-full h-full text-blue-500" id="hero-svg-bell">
              {/* Grid Lines */}
              <line x1="0" y1="180" x2="500" y2="180" stroke="#cbd5e1" strokeWidth="1.5" className="dark:stroke-slate-800" />
              <line x1="250" y1="0" x2="250" y2="180" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" className="dark:stroke-slate-800" />

              {/* Shaded Area */}
              <path
                d={`${svgPath()} L 500,180 L 0,180 Z`}
                fill="url(#gradHero)"
                opacity="0.2"
              />

              {/* Glowing Line */}
              <path
                d={svgPath()}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <defs>
                <linearGradient id="gradHero" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute bottom-4 right-4 text-[9px] text-gray-400 font-mono" id="hero-curve-stats">
              Live Morphing: μ={mean}, σ={std}
            </span>
          </div>
        </div>
      </div>

      {/* Basic statistical pillars explainer bento cards */}
      <div className="space-y-6" id="statistical-pillars">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-800 pb-2">
          Theoretical Pillars
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="pillars-grid">
          {/* Probability */}
          <div className="p-6 bg-white dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform flex flex-col justify-between space-y-4" id="card-probability">
            <div className="space-y-2">
              <span className="text-[10px] bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Concept 1</span>
              <h4 className="text-md font-bold text-gray-900 dark:text-white mt-2">Probability</h4>
              <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed font-semibold">
                The branch of mathematics concerning numerical descriptions of how likely an event is to occur, ranging strictly between 0 (impossible) and 1 (absolute certainty).
              </p>
            </div>
          </div>

          {/* Random Variables */}
          <div className="p-6 bg-white dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform flex flex-col justify-between space-y-4" id="card-rv">
            <div className="space-y-2">
              <span className="text-[10px] bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Concept 2</span>
              <h4 className="text-md font-bold text-gray-900 dark:text-white mt-2">Random Variables</h4>
              <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed font-semibold">
                A mathematical rule or function that assigns a numerical value to each outcome in a random sample space. Can be discrete (countable) or continuous (infinite scale).
              </p>
            </div>
          </div>

          {/* Mean */}
          <div className="p-6 bg-white dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform flex flex-col justify-between space-y-4" id="card-mean">
            <div className="space-y-2">
              <span className="text-[10px] bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Concept 3</span>
              <h4 className="text-md font-bold text-gray-900 dark:text-white mt-2">Mean (<MathTex math="\mu" />)</h4>
              <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed font-semibold">
                The mathematical expectation or average value of a random variable, acting as the primary center of mass or central location parameter of a distribution curve.
              </p>
            </div>
          </div>

          {/* Variance */}
          <div className="p-6 bg-white dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform flex flex-col justify-between space-y-4" id="card-variance">
            <div className="space-y-2">
              <span className="text-[10px] bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Concept 4</span>
              <h4 className="text-md font-bold text-gray-900 dark:text-white mt-2">Variance (<MathTex math="\sigma^2" />)</h4>
              <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed font-semibold">
                The expectation of squared deviations from the mean, quantifying how far a set of random numbers is spread out from its average center of balance.
              </p>
            </div>
          </div>

          {/* Standard Deviation */}
          <div className="p-6 bg-white dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform flex flex-col justify-between space-y-4" id="card-std">
            <div className="space-y-2">
              <span className="text-[10px] bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Concept 5</span>
              <h4 className="text-md font-bold text-gray-900 dark:text-white mt-2">Standard Deviation (<MathTex math="\sigma" />)</h4>
              <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed font-semibold">
                The positive square root of the variance, expressing the average dispersion in the original units of the random variable, facilitating straightforward comparisons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
