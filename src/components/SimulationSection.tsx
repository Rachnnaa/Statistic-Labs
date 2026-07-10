import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Coins,
  Dices,
  RotateCcw,
  Play,
  Shuffle,
  Info,
  Sliders,
  Sparkles,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SimulationSection() {
  const [activeTab, setActiveTab] = useState<'coin' | 'dice' | 'urn' | 'rng'>('coin');

  // --- COIN FLIP STATE ---
  const [coinTosses, setCoinTosses] = useState<number>(100);
  const [coinHistory, setCoinHistory] = useState<{ heads: number; tails: number }>({ heads: 0, tails: 0 });
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastFlipResult, setLastFlipResult] = useState<'H' | 'T' | null>(null);
  const [flipTrend, setFlipTrend] = useState<{ trial: number; headsPct: number }[]>([]);

  // --- DICE ROLL STATE ---
  const [diceHistory, setDiceHistory] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
  const [totalDiceRolls, setTotalDiceRolls] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [lastDieValue, setLastDieValue] = useState<number | null>(null);

  // --- URN EXPERIMENT STATE ---
  const [urnRed, setUrnRed] = useState(5);
  const [urnBlue, setUrnBlue] = useState(5);
  const [urnGreen, setUrnGreen] = useState(3);
  const [urnYellow, setUrnYellow] = useState(2);
  const [withReplacement, setWithReplacement] = useState(true);
  const [urnHistory, setUrnHistory] = useState<Record<string, number>>({ Red: 0, Blue: 0, Green: 0, Yellow: 0 });
  const [urnRemaining, setUrnRemaining] = useState<Record<string, number>>({ Red: 5, Blue: 5, Green: 3, Yellow: 2 });
  const [lastDrawnBall, setLastDrawnBall] = useState<string | null>(null);
  const [isDrawingBall, setIsDrawingBall] = useState(false);

  // --- RNG STATE ---
  const [rngType, setRngType] = useState<'uniform' | 'normal'>('uniform');
  const [rngCount, setRngCount] = useState(10);
  const [rngUniformMin, setRngUniformMin] = useState(0);
  const [rngUniformMax, setRngUniformMax] = useState(100);
  const [rngNormalMean, setRngNormalMean] = useState(50);
  const [rngNormalStd, setRngNormalStd] = useState(10);
  const [rngResults, setRngResults] = useState<number[]>([]);

  // --- COIN SIMULATION LOGIC ---
  const handleSingleCoinFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setLastFlipResult(null);

    setTimeout(() => {
      const result = Math.random() < 0.5 ? 'H' : 'T';
      setLastFlipResult(result);
      setIsFlipping(false);
      
      const updatedHeads = coinHistory.heads + (result === 'H' ? 1 : 0);
      const updatedTails = coinHistory.tails + (result === 'T' ? 1 : 0);
      setCoinHistory({ heads: updatedHeads, tails: updatedTails });

      const total = updatedHeads + updatedTails;
      setFlipTrend(prev => [
        ...prev,
        { trial: total, headsPct: parseFloat(((updatedHeads / total) * 100).toFixed(1)) }
      ].slice(-50)); // keep last 50 trials
    }, 800);
  };

  const handleBatchCoinFlip = (count: number) => {
    let localHeads = coinHistory.heads;
    let localTails = coinHistory.tails;
    const tempTrend = [...flipTrend];

    for (let i = 0; i < count; i++) {
      const result = Math.random() < 0.5 ? 'H' : 'T';
      if (result === 'H') localHeads++;
      else localTails++;

      const total = localHeads + localTails;
      if (i % Math.ceil(count / 10) === 0 || i === count - 1) {
        tempTrend.push({ trial: total, headsPct: parseFloat(((localHeads / total) * 100).toFixed(1)) });
      }
    }

    setCoinHistory({ heads: localHeads, tails: localTails });
    setFlipTrend(tempTrend.slice(-50));
    setLastFlipResult(Math.random() < 0.5 ? 'H' : 'T');
  };

  const handleResetCoin = () => {
    setCoinHistory({ heads: 0, tails: 0 });
    setLastFlipResult(null);
    setFlipTrend([]);
  };

  // --- DICE SIMULATION LOGIC ---
  const handleSingleDiceRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    setLastDieValue(null);

    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 6) + 1;
      setLastDieValue(rolled);
      setIsRolling(false);
      
      setDiceHistory(prev => ({
        ...prev,
        [rolled]: prev[rolled] + 1
      }));
      setTotalDiceRolls(prev => prev + 1);
    }, 600);
  };

  const handleBatchDiceRoll = (count: number) => {
    const freshRolls = { ...diceHistory };
    for (let i = 0; i < count; i++) {
      const rolled = Math.floor(Math.random() * 6) + 1;
      freshRolls[rolled]++;
    }
    setDiceHistory(freshRolls);
    setTotalDiceRolls(prev => prev + count);
    setLastDieValue(Math.floor(Math.random() * 6) + 1);
  };

  const handleResetDice = () => {
    setDiceHistory({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
    setTotalDiceRolls(0);
    setLastDieValue(null);
  };

  // --- URN SIMULATION LOGIC ---
  const initializeUrnRemaining = () => {
    setUrnRemaining({ Red: urnRed, Blue: urnBlue, Green: urnGreen, Yellow: urnYellow });
    setUrnHistory({ Red: 0, Blue: 0, Green: 0, Yellow: 0 });
    setLastDrawnBall(null);
  };

  const handleDrawBall = () => {
    if (isDrawingBall) return;

    // Build the pool based on currently remaining balls
    const pool: string[] = [];
    Object.keys(urnRemaining).forEach(color => {
      const count = urnRemaining[color];
      for (let i = 0; i < count; i++) {
        pool.push(color);
      }
    });

    if (pool.length === 0) {
      alert("No balls left in the Urn! Please refill.");
      return;
    }

    setIsDrawingBall(true);
    setLastDrawnBall(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const drawnColor = pool[randomIndex];
      setLastDrawnBall(drawnColor);
      setIsDrawingBall(false);

      // Update draw counts
      setUrnHistory(prev => ({ ...prev, [drawnColor]: prev[drawnColor] + 1 }));

      // Handle replacement logic
      if (!withReplacement) {
        setUrnRemaining(prev => ({
          ...prev,
          [drawnColor]: Math.max(0, prev[drawnColor] - 1)
        }));
      }
    }, 800);
  };

  const handleResetUrn = () => {
    setUrnHistory({ Red: 0, Blue: 0, Green: 0, Yellow: 0 });
    setUrnRemaining({ Red: urnRed, Blue: urnBlue, Green: urnGreen, Yellow: urnYellow });
    setLastDrawnBall(null);
  };

  // --- RNG LOGIC ---
  const handleGenerateRNG = () => {
    const results: number[] = [];
    for (let i = 0; i < rngCount; i++) {
      if (rngType === 'uniform') {
        const val = Math.random() * (rngUniformMax - rngUniformMin) + rngUniformMin;
        results.push(parseFloat(val.toFixed(2)));
      } else {
        // Box-Muller transform for normal distribution
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); 
        while(v === 0) v = Math.random();
        const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        const val = num * rngNormalStd + rngNormalMean;
        results.push(parseFloat(val.toFixed(2)));
      }
    }
    setRngResults(results);
  };

  const rngStats = useMemo(() => {
    if (rngResults.length === 0) return null;
    const sum = rngResults.reduce((a, b) => a + b, 0);
    const mean = sum / rngResults.length;
    const varSum = rngResults.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
    const variance = varSum / rngResults.length;
    const stdDev = Math.sqrt(variance);

    return {
      mean: mean.toFixed(3),
      variance: variance.toFixed(3),
      stdDev: stdDev.toFixed(3)
    };
  }, [rngResults]);

  // --- RECHARTS FORMATTING ---
  const coinChartData = useMemo(() => {
    const total = coinHistory.heads + coinHistory.tails || 1;
    return [
      { name: 'Heads', frequency: coinHistory.heads, percentage: ((coinHistory.heads / total) * 100).toFixed(1) },
      { name: 'Tails', frequency: coinHistory.tails, percentage: ((coinHistory.tails / total) * 100).toFixed(1) }
    ];
  }, [coinHistory]);

  const diceChartData = useMemo(() => {
    return Object.keys(diceHistory).map(side => {
      const freq = diceHistory[parseInt(side)];
      const pct = totalDiceRolls > 0 ? ((freq / totalDiceRolls) * 100).toFixed(1) : 0;
      return {
        side: `Side ${side}`,
        Frequency: freq,
        Percentage: pct
      };
    });
  }, [diceHistory, totalDiceRolls]);

  const urnChartData = useMemo(() => {
    const colors = ['Red', 'Blue', 'Green', 'Yellow'];
    const totalDraws = colors.reduce((acc, c) => acc + urnHistory[c], 0) || 1;
    return colors.map(c => ({
      color: c,
      Draws: urnHistory[c],
      Percentage: ((urnHistory[c] / totalDraws) * 100).toFixed(1)
    }));
  }, [urnHistory]);

  return (
    <div className="space-y-8" id="simulations-view">
      {/* Mini Simulation Navigation Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-200 dark:border-slate-800" id="sim-tabs">
        <button
          onClick={() => setActiveTab('coin')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'coin'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
          id="btn-coin-tab"
        >
          <Coins className="w-4 h-4" />
          Coin Toss
        </button>
        <button
          onClick={() => setActiveTab('dice')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'dice'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
          id="btn-dice-tab"
        >
          <Dices className="w-4 h-4" />
          Dice Roll
        </button>
        <button
          onClick={() => {
            setActiveTab('urn');
            setUrnRemaining({ Red: urnRed, Blue: urnBlue, Green: urnGreen, Yellow: urnYellow });
          }}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'urn'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
          id="btn-urn-tab"
        >
          <Layers className="w-4 h-4" />
          Urn Experiment
        </button>
        <button
          onClick={() => setActiveTab('rng')}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'rng'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
          id="btn-rng-tab"
        >
          <Shuffle className="w-4 h-4" />
          Random Generator
        </button>
      </div>

      {/* --- COIN TOSS COMPONENT --- */}
      {activeTab === 'coin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="coin-simulator">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6" id="coin-controls-panel">
            <div className="glass-card rounded-2xl p-6 space-y-5" id="coin-card-holder">
              <div className="flex justify-between items-center" id="coin-card-header">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Coins className="text-amber-500 w-5 h-5" />
                  Coin Flip Engine
                </h3>
                <button
                  onClick={handleResetCoin}
                  className="p-1.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  title="Reset Coin Experiment"
                  id="coin-reset-btn"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Graphical Flipping Stage */}
              <div className="h-44 bg-slate-50 dark:bg-slate-900/40 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-slate-800 relative overflow-hidden" id="flip-stage">
                <AnimatePresence mode="wait">
                  {isFlipping ? (
                    <motion.div
                      key="flipping-coin"
                      animate={{
                        rotateY: [0, 360, 720, 1080, 1440],
                        y: [0, -60, -90, -40, 0]
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="w-20 h-20 rounded-full bg-amber-400 border-4 border-amber-500 shadow-lg flex items-center justify-center font-bold text-white text-3xl font-mono shadow-amber-500/20"
                      id="anim-spinning-coin"
                    >
                      ?
                    </motion.div>
                  ) : lastFlipResult ? (
                    <motion.div
                      key="flipped-coin-result"
                      initial={{ scale: 0.5, rotateY: 180 }}
                      animate={{ scale: 1, rotateY: 0 }}
                      className={`w-20 h-20 rounded-full border-4 shadow-lg flex items-center justify-center font-bold text-white text-3xl font-mono ${
                        lastFlipResult === 'H'
                          ? 'bg-amber-400 border-amber-500 shadow-amber-500/20'
                          : 'bg-slate-400 border-slate-500 shadow-slate-500/20'
                      }`}
                      id="anim-coin-result"
                    >
                      {lastFlipResult}
                    </motion.div>
                  ) : (
                    <div className="text-center text-xs text-gray-400 font-semibold" id="empty-coin-stage">
                      No tosses yet. Let's flip!
                    </div>
                  )}
                </AnimatePresence>

                {lastFlipResult && !isFlipping && (
                  <span className="absolute bottom-3 text-xs font-bold text-gray-500 uppercase tracking-widest animate-bounce" id="coin-result-lbl">
                    {lastFlipResult === 'H' ? 'Heads' : 'Tails'}!
                  </span>
                )}
              </div>

              {/* Input & Simulation Launchers */}
              <div className="space-y-4" id="coin-launchers">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleSingleCoinFlip}
                    disabled={isFlipping}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-xl shadow-md cursor-pointer transition-colors"
                    id="coin-flip-1"
                  >
                    Toss Once
                  </button>
                  <button
                    onClick={() => handleBatchCoinFlip(coinTosses)}
                    className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl shadow-md cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    id="coin-flip-batch"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Toss {coinTosses}x
                  </button>
                </div>

                <div className="space-y-1" id="coin-tosses-slider">
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">Batch size multiplier:</label>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{coinTosses} tosses</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={coinTosses}
                    onChange={e => setCoinTosses(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Frequencies Readout */}
            <div className="grid grid-cols-2 gap-4" id="coin-stats-cards">
              <div className="glass-card rounded-2xl p-4 text-center border-l-4 border-l-amber-500" id="heads-card">
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Total Heads</span>
                <span className="block text-3xl font-extrabold text-amber-500 font-mono my-1">{coinHistory.heads}</span>
                <span className="block text-xs font-semibold text-gray-400">
                  {coinHistory.heads + coinHistory.tails > 0
                    ? ((coinHistory.heads / (coinHistory.heads + coinHistory.tails)) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="glass-card rounded-2xl p-4 text-center border-l-4 border-l-slate-400" id="tails-card">
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Total Tails</span>
                <span className="block text-3xl font-extrabold text-slate-500 font-mono my-1">{coinHistory.tails}</span>
                <span className="block text-xs font-semibold text-gray-400">
                  {coinHistory.heads + coinHistory.tails > 0
                    ? ((coinHistory.tails / (coinHistory.heads + coinHistory.tails)) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Graphical Live Update Column */}
          <div className="lg:col-span-7 space-y-6" id="coin-charts-panel">
            <div className="glass-card rounded-2xl p-6 h-[400px]" id="coin-chart-holder">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Live Frequency Chart
              </h4>
              <div className="w-full h-[280px]" id="coin-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={coinChartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} className="text-xs font-semibold" />
                    <YAxis stroke="#94a3b8" tickLine={false} className="text-xs font-mono" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white dark:bg-slate-800 p-3 shadow-xl rounded-xl border border-gray-100 dark:border-slate-700 text-xs font-semibold space-y-1">
                              <p className="font-bold text-gray-900 dark:text-white">{data.name}</p>
                              <p className="text-blue-600">Frequency: {data.frequency}</p>
                              <p className="text-amber-500">Percentage: {data.percentage}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="frequency" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                      <Cell fill="#f59e0b" />
                      <Cell fill="#94a3b8" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Convergence Trend Panel */}
            <div className="glass-card rounded-2xl p-6" id="coin-trend-holder">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                Law of Large Numbers Convergence
              </h4>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                As the number of total flips grows, notice how the ratio of Heads stabilizes and converges exactly toward the mathematical expectation of 50%.
              </p>
              <div className="w-full h-36" id="coin-trend-chart-box">
                {flipTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={flipTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                      <XAxis dataKey="trial" stroke="#94a3b8" className="text-xs font-mono" />
                      <YAxis domain={[0, 100]} stroke="#94a3b8" className="text-xs font-mono" />
                      <Tooltip />
                      <Line type="monotone" dataKey="headsPct" stroke="#f59e0b" strokeWidth={2} dot={false} name="Heads %" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-gray-400 font-semibold" id="empty-trend">
                    Plotting trend on subsequent flips...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DICE ROLL COMPONENT --- */}
      {activeTab === 'dice' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="dice-simulator">
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-6" id="dice-controls-panel">
            <div className="glass-card rounded-2xl p-6 space-y-5" id="dice-card-holder">
              <div className="flex justify-between items-center" id="dice-card-header">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Dices className="text-blue-500 w-5 h-5" />
                  3D Dice Roller Engine
                </h3>
                <button
                  onClick={handleResetDice}
                  className="p-1.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  title="Reset Dice Experiment"
                  id="dice-reset-btn"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Dice animation view */}
              <div className="h-44 bg-slate-50 dark:bg-slate-900/40 rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-slate-800 relative overflow-hidden" id="dice-stage">
                <AnimatePresence mode="wait">
                  {isRolling ? (
                    <motion.div
                      key="rolling-dice"
                      animate={{
                        rotate: [0, 90, 180, 270, 360],
                        scale: [1, 1.2, 0.8, 1.1, 1],
                        skewX: [0, 15, -15, 0]
                      }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="w-16 h-16 rounded-xl bg-blue-600 border-2 border-blue-700 shadow-xl flex items-center justify-center text-white font-bold font-mono text-3xl shadow-blue-600/20"
                      id="anim-rolling-die"
                    >
                      ⚄
                    </motion.div>
                  ) : lastDieValue ? (
                    <motion.div
                      key="rolled-die-result"
                      initial={{ scale: 0.5, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-16 h-16 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 shadow-xl flex items-center justify-center text-gray-900 dark:text-white text-4xl font-semibold font-serif"
                      id="anim-die-result"
                    >
                      {lastDieValue === 1 && '⚀'}
                      {lastDieValue === 2 && '⚁'}
                      {lastDieValue === 3 && '⚂'}
                      {lastDieValue === 4 && '⚃'}
                      {lastDieValue === 5 && '⚄'}
                      {lastDieValue === 6 && '⚅'}
                    </motion.div>
                  ) : (
                    <div className="text-center text-xs text-gray-400 font-semibold" id="empty-dice-stage">
                      Let's roll the dice!
                    </div>
                  )}
                </AnimatePresence>

                {lastDieValue && !isRolling && (
                  <span className="absolute bottom-3 text-xs font-bold text-gray-500 uppercase tracking-widest animate-bounce" id="die-result-lbl">
                    Rolled {lastDieValue}!
                  </span>
                )}
              </div>

              {/* Launcher buttons */}
              <div className="space-y-4" id="dice-launchers">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleSingleDiceRoll}
                    disabled={isRolling}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-xl shadow-md cursor-pointer transition-colors"
                    id="dice-roll-1"
                  >
                    Roll Once
                  </button>
                  <button
                    onClick={() => handleBatchDiceRoll(100)}
                    className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl shadow-md cursor-pointer transition-colors"
                    id="dice-roll-100"
                  >
                    Roll 100x
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleBatchDiceRoll(1000)}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-sm"
                    id="dice-roll-1000"
                  >
                    Roll 1000x
                  </button>
                  <button
                    onClick={() => handleBatchDiceRoll(5000)}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-sm"
                    id="dice-roll-5000"
                  >
                    Roll 5000x
                  </button>
                </div>
              </div>
            </div>

            {/* Total rolls tracking */}
            <div className="glass-card rounded-2xl p-5 flex items-center justify-between" id="dice-total-rolls-card">
              <div id="dice-total-text">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Total Rolls Count</span>
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Experimental Sum</span>
              </div>
              <div className="font-mono text-3xl font-extrabold text-blue-600 dark:text-blue-400" id="dice-total-val">
                {totalDiceRolls}
              </div>
            </div>
          </div>

          {/* Histogram Chart Panel */}
          <div className="lg:col-span-7" id="dice-charts-panel">
            <div className="glass-card rounded-2xl p-6 h-[400px]" id="dice-chart-holder">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Dice Outcome Frequency (Histogram)
              </h4>
              <div className="w-full h-[280px]" id="dice-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={diceChartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis dataKey="side" stroke="#94a3b8" tickLine={false} className="text-xs font-semibold" />
                    <YAxis stroke="#94a3b8" tickLine={false} className="text-xs font-mono" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white dark:bg-slate-800 p-3 shadow-xl rounded-xl border border-gray-100 dark:border-slate-700 text-xs font-semibold space-y-1">
                              <p className="font-bold text-gray-900 dark:text-white">{data.side}</p>
                              <p className="text-blue-600">Frequency: {data.Frequency}</p>
                              <p className="text-indigo-500">Percentage: {data.Percentage}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="Frequency" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- URN EXPERIMENT COMPONENT --- */}
      {activeTab === 'urn' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="urn-simulator">
          {/* Config panel */}
          <div className="lg:col-span-5 space-y-6" id="urn-config-panel">
            <div className="glass-card rounded-2xl p-6 space-y-5" id="urn-card-holder">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Layers className="text-emerald-500 w-5 h-5" />
                Urn Configuration
              </h3>

              {/* Sliders to set quantities */}
              <div className="space-y-3" id="urn-sliders">
                <div className="space-y-1" id="slider-urn-red">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-red-500">Red Balls:</span>
                    <span className="font-mono">{urnRed}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={urnRed}
                    onChange={e => {
                      setUrnRed(parseInt(e.target.value));
                      setUrnRemaining(prev => ({ ...prev, Red: parseInt(e.target.value) }));
                    }}
                    className="w-full accent-red-500"
                  />
                </div>

                <div className="space-y-1" id="slider-urn-blue">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-blue-500">Blue Balls:</span>
                    <span className="font-mono">{urnBlue}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={urnBlue}
                    onChange={e => {
                      setUrnBlue(parseInt(e.target.value));
                      setUrnRemaining(prev => ({ ...prev, Blue: parseInt(e.target.value) }));
                    }}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div className="space-y-1" id="slider-urn-green">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-emerald-500">Green Balls:</span>
                    <span className="font-mono">{urnGreen}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={urnGreen}
                    onChange={e => {
                      setUrnGreen(parseInt(e.target.value));
                      setUrnRemaining(prev => ({ ...prev, Green: parseInt(e.target.value) }));
                    }}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="space-y-1" id="slider-urn-yellow">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-amber-500">Yellow Balls:</span>
                    <span className="font-mono">{urnYellow}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={urnYellow}
                    onChange={e => {
                      setUrnYellow(parseInt(e.target.value));
                      setUrnRemaining(prev => ({ ...prev, Yellow: parseInt(e.target.value) }));
                    }}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              {/* Replacements and Refill Controls */}
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-4" id="urn-controls-box">
                <div className="flex items-center justify-between" id="replacement-row">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">With Replacement</label>
                  <input
                    type="checkbox"
                    checked={withReplacement}
                    onChange={e => {
                      setWithReplacement(e.target.checked);
                      handleResetUrn();
                    }}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="flex gap-2" id="refill-buttons">
                  <button
                    onClick={initializeUrnRemaining}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors cursor-pointer text-xs uppercase"
                    id="urn-refill-btn"
                  >
                    Set / Refill Urn
                  </button>
                  <button
                    onClick={handleResetUrn}
                    className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors cursor-pointer"
                    title="Reset Counts"
                    id="urn-cnt-reset-btn"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Draw Panel */}
          <div className="lg:col-span-7 space-y-6" id="urn-draw-panel">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="urn-visual-split">
              {/* Actual physical urn graphics container */}
              <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center h-[340px]" id="urn-visualizer-card">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Urn Stage</h4>
                
                {/* Visual Urn Cup */}
                <div className="w-40 h-44 bg-emerald-500/10 border-4 border-emerald-600 rounded-b-[40px] rounded-t-xl relative flex flex-wrap gap-2 p-4 items-end justify-center overflow-hidden" id="urn-physical-bowl">
                  {/* Bobbing colored balls */}
                  {Object.keys(urnRemaining).map(color => {
                    const count = urnRemaining[color];
                    const ballsArray = Array.from({ length: count });
                    return ballsArray.map((_, i) => (
                      <motion.div
                        key={`${color}-${i}`}
                        animate={{
                          y: [0, -10, 0],
                          x: [0, 5, -5, 0]
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`w-6 h-6 rounded-full shadow-md ${
                          color === 'Red' ? 'bg-red-500' :
                          color === 'Blue' ? 'bg-blue-500' :
                          color === 'Green' ? 'bg-emerald-500' :
                          'bg-amber-400'
                        }`}
                      />
                    ));
                  })}
                </div>

                <button
                  onClick={handleDrawBall}
                  disabled={isDrawingBall}
                  className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                  id="draw-ball-trigger"
                >
                  {isDrawingBall ? 'Drawing...' : 'Draw Ball'}
                </button>
              </div>

              {/* Drawer Outcome Display and counts */}
              <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-[340px]" id="urn-outcome-card">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Draw Outcome</h4>
                
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-gray-100 dark:border-slate-800" id="drawn-ball-box">
                  <AnimatePresence mode="wait">
                    {isDrawingBall ? (
                      <motion.div
                        key="drawing-ball-spinner"
                        animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                        className="w-12 h-12 rounded-full border-4 border-dashed border-emerald-600"
                      />
                    ) : lastDrawnBall ? (
                      <motion.div
                        key="drawn-ball-result"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center space-y-3"
                      >
                        <div className={`w-16 h-16 rounded-full shadow-lg mx-auto ${
                          lastDrawnBall === 'Red' ? 'bg-red-500' :
                          lastDrawnBall === 'Blue' ? 'bg-blue-500' :
                          lastDrawnBall === 'Green' ? 'bg-emerald-500' :
                          'bg-amber-400'
                        }`} />
                        <span className="block text-md font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">{lastDrawnBall} Ball!</span>
                      </motion.div>
                    ) : (
                      <div className="text-xs text-gray-400 font-semibold" id="drawn-empty">Click &ldquo;Draw Ball&rdquo; to simulate a pick</div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Live Counts Overlay */}
                <div className="mt-4 grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold" id="urn-count-summary">
                  <div className="p-1 bg-red-50 dark:bg-red-950/20 text-red-600 rounded">R: {urnHistory.Red}</div>
                  <div className="p-1 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded">B: {urnHistory.Blue}</div>
                  <div className="p-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded">G: {urnHistory.Green}</div>
                  <div className="p-1 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded">Y: {urnHistory.Yellow}</div>
                </div>
              </div>
            </div>

            {/* Recharts Draw Counts Chart */}
            <div className="glass-card rounded-2xl p-6 h-64" id="urn-chart-holder">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Experimental Draw Percentages</h4>
              <div className="w-full h-40" id="urn-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={urnChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis dataKey="color" stroke="#94a3b8" tickLine={false} className="text-xs font-semibold" />
                    <YAxis stroke="#94a3b8" tickLine={false} className="text-xs font-mono" />
                    <Tooltip />
                    <Bar dataKey="Draws" fill="#10b981" radius={[4, 4, 0, 0]}>
                      <Cell fill="#ef4444" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- RANDOM NUMBER GENERATOR --- */}
      {activeTab === 'rng' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="rng-simulator">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6" id="rng-controls-panel">
            <div className="glass-card rounded-2xl p-6 space-y-5" id="rng-card-holder">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Shuffle className="text-indigo-500 w-5 h-5" />
                Random Variable Sampler
              </h3>

              {/* Distribution Select */}
              <div className="space-y-1" id="rng-dist-select">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Parent Distribution</label>
                <div className="flex rounded-lg bg-gray-100 dark:bg-slate-800 p-1" id="rng-tab-group">
                  <button
                    onClick={() => setRngType('uniform')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      rngType === 'uniform'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    id="btn-rng-uniform"
                  >
                    Continuous Uniform
                  </button>
                  <button
                    onClick={() => setRngType('normal')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      rngType === 'normal'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    id="btn-rng-normal"
                  >
                    Gaussian Normal
                  </button>
                </div>
              </div>

              {/* Dynamic Parameters */}
              <div className="space-y-4" id="rng-parameters-holder">
                {rngType === 'uniform' ? (
                  <div className="grid grid-cols-2 gap-4" id="rng-unif-inputs">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Min Bound</label>
                      <input
                        type="number"
                        value={rngUniformMin}
                        onChange={e => setRngUniformMin(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Max Bound</label>
                      <input
                        type="number"
                        value={rngUniformMax}
                        onChange={e => setRngUniformMax(parseFloat(e.target.value) || 100)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950 dark:text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4" id="rng-norm-inputs">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Mean (μ)</label>
                      <input
                        type="number"
                        value={rngNormalMean}
                        onChange={e => setRngNormalMean(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">StdDev (σ)</label>
                      <input
                        type="number"
                        value={rngNormalStd}
                        onChange={e => setRngNormalStd(parseFloat(e.target.value) || 1)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1" id="rng-count-input-slider">
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">Sample Size:</label>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{rngCount} variables</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={rngCount}
                    onChange={e => setRngCount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <button
                  onClick={handleGenerateRNG}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                  id="rng-generate-btn"
                >
                  Generate Random Numbers
                </button>
              </div>
            </div>
          </div>

          {/* Results Columns */}
          <div className="lg:col-span-7 space-y-6" id="rng-results-panel">
            {rngResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="rng-results-grid">
                {/* Scrollable raw list of values */}
                <div className="glass-card rounded-2xl p-6 flex flex-col h-[380px]" id="rng-numbers-card">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Raw Generated Variables</h4>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-1.5 font-mono text-xs" id="rng-numbers-scroller">
                    {rngResults.map((val, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg">
                        <span className="text-gray-400 font-bold">X[{idx + 1}]</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experimental metrics */}
                <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-[380px]" id="rng-stats-card">
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Sample Realization Stats</h4>
                    <div className="space-y-4" id="rng-experimental-summary">
                      <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                        <span className="text-xs text-gray-500 font-semibold">Sample Size</span>
                        <span className="font-mono text-sm font-bold">{rngResults.length}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                        <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">Experimental Mean</span>
                        <span className="font-mono text-sm font-bold text-blue-600">{rngStats?.mean}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                        <span className="text-xs text-gray-500 font-semibold">Experimental Variance</span>
                        <span className="font-mono text-sm font-bold">{rngStats?.variance}</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="text-xs text-gray-500 font-semibold">Experimental StdDev</span>
                        <span className="font-mono text-sm font-bold">{rngStats?.stdDev}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50 dark:bg-slate-800/40 rounded-xl flex items-start gap-2.5 border border-indigo-100 dark:border-slate-700/50" id="rng-footer-caption">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-indigo-700 dark:text-indigo-300 leading-normal font-semibold">
                      Notice how the experimental statistics approach their theoretical specifications (population parameters) as the sample size increases. This illustrates the law of averages.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6 h-[380px] flex flex-col items-center justify-center text-center text-gray-400" id="rng-empty-results">
                <Shuffle className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3 animate-pulse" />
                <p className="text-sm font-bold">No samples generated yet</p>
                <p className="text-xs text-gray-400 max-w-xs mt-1">Configure parameters and click "Generate" to construct custom experimental realizations.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
