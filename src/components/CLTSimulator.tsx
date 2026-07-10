import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label
} from 'recharts';
import {
  Sparkles,
  Play,
  RotateCcw,
  Info,
  TrendingUp,
  Cpu
} from 'lucide-react';
import MathTex from './MathTex';

type PopulationType = 'uniform' | 'exponential' | 'normal' | 'bimodal';

export default function CLTSimulator() {
  const [popType, setPopType] = useState<PopulationType>('exponential');
  const [sampleSize, setSampleSize] = useState<number>(15);
  const [sampleCount, setSampleCount] = useState<number>(1000);
  const [isSimulating, setIsSimulating] = useState(false);
  const [sampledMeans, setSampledMeans] = useState<number[]>([]);

  // Theoretical properties of parent distributions
  const popProperties = useMemo(() => {
    switch (popType) {
      case 'uniform':
        return { mean: 50, variance: 833.33, sd: 28.87, rangeText: '[0, 100]' };
      case 'exponential':
        // lambda = 0.02
        return { mean: 50, variance: 2500, sd: 50, rangeText: '[0, ∞)' };
      case 'normal':
        return { mean: 50, variance: 100, sd: 10, rangeText: 'Mean = 50, SD = 10' };
      case 'bimodal':
        // Mixtures of N(25, 5) and N(75, 5)
        return { mean: 50, variance: 650, sd: 25.49, rangeText: 'Peaks at 25 & 75' };
    }
  }, [popType]);

  // Generate parent population visualization dataset
  const parentChartData = useMemo(() => {
    const data: { x: number; density: number }[] = [];
    
    switch (popType) {
      case 'uniform':
        for (let x = -5; x <= 105; x += 1) {
          data.push({ x, density: x >= 0 && x <= 100 ? 0.01 : 0 });
        }
        break;
      case 'exponential':
        // lambda = 0.02
        for (let x = 0; x <= 200; x += 2) {
          data.push({ x, density: 0.02 * Math.exp(-0.02 * x) });
        }
        break;
      case 'normal':
        // N(50, 10)
        for (let x = 10; x <= 90; x += 0.8) {
          const exponent = -Math.pow(x - 50, 2) / (2 * 100);
          data.push({ x: parseFloat(x.toFixed(1)), density: (1 / (10 * Math.sqrt(2 * Math.PI))) * Math.exp(exponent) });
        }
        break;
      case 'bimodal':
        // 50% N(25, 6) + 50% N(75, 6)
        for (let x = 0; x <= 100; x += 1) {
          const part1 = (1 / (6 * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - 25, 2) / (2 * 36));
          const part2 = (1 / (6 * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - 75, 2) / (2 * 36));
          data.push({ x, density: 0.5 * part1 + 0.5 * part2 });
        }
        break;
    }
    return data;
  }, [popType]);

  // Drawing random samples from population
  const drawSampleValue = (type: PopulationType): number => {
    switch (type) {
      case 'uniform':
        return Math.random() * 100;
      case 'exponential':
        // Inverse transform sampling for Exp(lambda = 0.02)
        return -Math.log(1 - Math.random()) / 0.02;
      case 'normal': {
        // Box-Muller
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * 10 + 50;
      }
      case 'bimodal': {
        // 50-50 choice
        const peak = Math.random() < 0.5 ? 25 : 75;
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * 6 + peak;
      }
    }
  };

  // Run CLT sampling
  const handleRunSimulation = () => {
    setIsSimulating(true);
    
    // Perform generation in a small timeout to let UI indicate loading
    setTimeout(() => {
      const means: number[] = [];
      for (let s = 0; s < sampleCount; s++) {
        let sum = 0;
        for (let n = 0; n < sampleSize; n++) {
          sum += drawSampleValue(popType);
        }
        means.push(sum / sampleSize);
      }
      setSampledMeans(means);
      setIsSimulating(false);
    }, 100);
  };

  const handleReset = () => {
    setSampledMeans([]);
  };

  // Compute stats of sampling distribution
  const samplingStats = useMemo(() => {
    if (sampledMeans.length === 0) return null;
    const sum = sampledMeans.reduce((a, b) => a + b, 0);
    const mean = sum / sampledMeans.length;
    const sqDiffsSum = sampledMeans.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
    const variance = sqDiffsSum / sampledMeans.length;
    const sd = Math.sqrt(variance);

    // CLT Theoretical expectation
    const theoreticalMean = popProperties.mean;
    const theoreticalVariance = popProperties.variance / sampleSize;
    const theoreticalSD = Math.sqrt(theoreticalVariance);

    return {
      actualMean: mean.toFixed(2),
      actualVariance: variance.toFixed(2),
      actualSD: sd.toFixed(2),
      expectedMean: theoreticalMean.toFixed(2),
      expectedVariance: theoreticalVariance.toFixed(2),
      expectedSD: theoreticalSD.toFixed(2)
    };
  }, [sampledMeans, popProperties, sampleSize]);

  // Construct histogram dataset for sampling distribution
  const histogramData = useMemo(() => {
    if (sampledMeans.length === 0) return [];
    
    // Find min and max to divide into bins
    const minVal = 0; // standard bounds
    const maxVal = 100;
    const binCount = 35;
    const binWidth = (maxVal - minVal) / binCount;
    
    const bins = Array.from({ length: binCount }, (_, i) => {
      const start = minVal + i * binWidth;
      const end = start + binWidth;
      return {
        binLabel: Math.round((start + end) / 2),
        Frequency: 0
      };
    });

    sampledMeans.forEach(val => {
      let binIdx = Math.floor((val - minVal) / binWidth);
      if (binIdx >= binCount) binIdx = binCount - 1;
      if (binIdx < 0) binIdx = 0;
      bins[binIdx].Frequency++;
    });

    return bins;
  }, [sampledMeans]);

  return (
    <div className="space-y-8" id="clt-simulator-view">
      {/* Description header */}
      <div className="glass-card rounded-2xl p-6" id="clt-intro-box">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Cpu className="text-indigo-600 w-5 h-5" />
          Central Limit Theorem (CLT) Simulator
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
          The **Central Limit Theorem** is one of the most fundamental discoveries in mathematics. It states that for any independent random variables drawn from <em>any</em> parent population (regardless of its skewness or shape), the <strong>sampling distribution of the sample mean</strong> will converge into a perfect **Normal bell curve** as the sample size (<MathTex math="N" />) increases.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="clt-layout-grid">
        {/* Left Column: Config Panel */}
        <div className="lg:col-span-4 space-y-6" id="clt-config-column">
          <div className="glass-card rounded-2xl p-6 space-y-5" id="clt-controls-card">
            <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              CLT Settings
            </h3>

            {/* Choose population distribution */}
            <div className="space-y-1.5" id="clt-pop-select">
              <label className="text-xs font-bold text-gray-500 uppercase">1. Parent Population</label>
              <select
                value={popType}
                onChange={e => {
                  setPopType(e.target.value as PopulationType);
                  handleReset();
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950 dark:text-white cursor-pointer"
              >
                <option value="exponential">Exponential (Heavily Skewed)</option>
                <option value="bimodal">Bimodal (Two Extreme Peaks)</option>
                <option value="uniform">Continuous Uniform (Flat)</option>
                <option value="normal">Normal Gaussian (Already Symmetric)</option>
              </select>
            </div>

            {/* Choose sample size N */}
            <div className="space-y-1.5" id="clt-n-slider">
              <div className="flex justify-between text-sm">
                <label className="text-gray-700 dark:text-gray-300 font-medium">2. Sample Size (<MathTex math="N" />):</label>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-extrabold">{sampleSize} elements</span>
              </div>
              <input
                type="range"
                min="2"
                max="100"
                step="1"
                value={sampleSize}
                onChange={e => {
                  setSampleSize(parseInt(e.target.value));
                  handleReset();
                }}
                className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>N = 2 (Weak)</span>
                <span>N = 100 (Strong bell)</span>
              </div>
            </div>

            {/* Choose number of samples M */}
            <div className="space-y-1.5" id="clt-m-slider">
              <div className="flex justify-between text-sm">
                <label className="text-gray-700 dark:text-gray-300 font-medium">3. Number of Samples (<MathTex math="M" />):</label>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-extrabold">{sampleCount} samples</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="100"
                value={sampleCount}
                onChange={e => {
                  setSampleCount(parseInt(e.target.value));
                  handleReset();
                }}
                className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="flex gap-2 pt-2" id="clt-buttons-row">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase"
                id="clt-run-btn"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {isSimulating ? 'Sampling...' : 'Draw Sample Means'}
              </button>
              <button
                onClick={handleReset}
                className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors cursor-pointer"
                title="Reset Simulation"
                id="clt-reset-btn"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Theoretical vs Experimental Cards */}
          {samplingStats && (
            <div className="glass-card rounded-2xl p-6 space-y-4" id="clt-comparison-card">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Theorem Demonstration</h4>
              <div className="space-y-3" id="clt-equations-demo">
                {/* Mean comparison */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl" id="mean-comparison-box">
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                    <span>Expected Mean (<MathTex math="\mu_{\bar{X}} = \mu" />)</span>
                    <span>Actual Simulated</span>
                  </div>
                  <div className="flex justify-between font-mono font-extrabold text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{samplingStats.expectedMean}</span>
                    <span className="text-blue-600">{samplingStats.actualMean}</span>
                  </div>
                </div>

                {/* Variance comparison */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl" id="variance-comparison-box">
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                    <span>Expected Variance (<MathTex math="\sigma^2_{\bar{X}} = \sigma^2 / N" />)</span>
                    <span>Actual Simulated</span>
                  </div>
                  <div className="flex justify-between font-mono font-extrabold text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {popProperties.variance.toFixed(1)} / {sampleSize} = {samplingStats.expectedVariance}
                    </span>
                    <span className="text-indigo-600">{samplingStats.actualVariance}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visualizer Stage */}
        <div className="lg:col-span-8 space-y-6" id="clt-graphics-column">
          {/* Parent Distribution Visualizer */}
          <div className="glass-card rounded-2xl p-5 h-56 flex flex-col" id="pop-distribution-card">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex justify-between items-center">
              <span>Parent Population Probability Density (Input)</span>
              <span className="bg-slate-100 dark:bg-slate-800 text-[10px] text-gray-500 px-2 py-0.5 rounded font-mono font-bold">Range: {popProperties.rangeText}</span>
            </h4>
            <div className="flex-1 w-full" id="parent-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={parentChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="x" stroke="#94a3b8" tickLine={false} className="text-xs font-mono" />
                  <YAxis stroke="#94a3b8" tickLine={false} className="text-xs font-mono" />
                  <Area type="monotone" dataKey="density" stroke="#4f46e5" strokeWidth={1.5} fillOpacity={1} fill="url(#colorPop)" />
                  
                  <ReferenceLine x={popProperties.mean} stroke="#4f46e5" strokeWidth={2} strokeDasharray="3 3">
                    <Label value={`μ = ${popProperties.mean}`} position="top" fill="#4f46e5" className="text-[10px] font-bold font-mono" />
                  </ReferenceLine>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sampling Distribution Visualizer */}
          <div className="glass-card rounded-2xl p-6 h-80 flex flex-col" id="sampling-distribution-card">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Sampling Distribution of the Sample Mean (Output)
            </h4>

            {sampledMeans.length > 0 ? (
              <div className="flex-1 w-full" id="sampling-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogramData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis dataKey="binLabel" stroke="#94a3b8" tickLine={false} className="text-[9px] font-mono" />
                    <YAxis stroke="#94a3b8" tickLine={false} className="text-xs font-mono" />
                    <Tooltip />
                    <ReferenceLine x={parseFloat(samplingStats?.actualMean || '50')} stroke="#ef4444" strokeWidth={2.5}>
                      <Label value={`Actual Mean: ${samplingStats?.actualMean}`} position="top" fill="#ef4444" className="text-xs font-bold font-mono" />
                    </ReferenceLine>
                    <Bar dataKey="Frequency" fill="#3b82f6" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-gray-200 dark:border-slate-800 p-6" id="clt-empty-stage">
                <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Sampling Distribution Empty</p>
                <p className="text-[11px] text-gray-400 max-w-xs mt-1">Select parameters on the left and click &ldquo;Draw Sample Means&rdquo; to launch sampling and plot the CLT bell curve.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
