import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Label,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Maximize2,
  Minimize2,
  Calculator,
  Info,
  CheckCircle,
  TrendingUp,
  Heart
} from 'lucide-react';
import { DistributionType } from '../types';
import { distributionsData } from '../data/distributionsData';
import MathTex from './MathTex';
import * as math from '../utils/mathUtils';

interface DistributionExplorerProps {
  favorites: DistributionType[];
  onToggleFavorite: (id: DistributionType) => void;
}

export default function DistributionExplorer({ favorites, onToggleFavorite }: DistributionExplorerProps) {
  const [selectedId, setSelectedId] = useState<DistributionType>('normal');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const animIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Normal parameters
  const [normalMean, setNormalMean] = useState(0);
  const [normalStd, setNormalStd] = useState(1);

  // Binomial parameters
  const [binomN, setBinomN] = useState(20);
  const [binomP, setBinomP] = useState(0.5);

  // Poisson parameters
  const [poissonLambda, setPoissonLambda] = useState(4);

  // Uniform parameters
  const [uniformMin, setUniformMin] = useState(-2);
  const [uniformMax, setUniformMax] = useState(2);

  // Exponential parameters
  const [expLambda, setExpLambda] = useState(1.0);

  // Student t parameters
  const [tDf, setTDf] = useState(4);

  // Chi-Square parameters
  const [chiDf, setChiDf] = useState(4);

  // F-Distribution parameters
  const [fDf1, setFDf1] = useState(5);
  const [fDf2, setFDf2] = useState(10);

  // Calculator State
  const [calcType, setCalcType] = useState<'less' | 'greater' | 'between'>('less');
  const [calcX1, setCalcX1] = useState(1);
  const [calcX2, setCalcX2] = useState(2);

  const distribution = distributionsData[selectedId];

  // Reset parameters
  const handleReset = () => {
    setIsAnimating(false);
    setNormalMean(0);
    setNormalStd(1);
    setBinomN(20);
    setBinomP(0.5);
    setPoissonLambda(4);
    setUniformMin(-2);
    setUniformMax(2);
    setExpLambda(1.0);
    setTDf(4);
    setChiDf(4);
    setFDf1(5);
    setFDf2(10);
    
    // Set default calculator values
    setCalcX1(0);
    setCalcX2(1);
  };

  // Set randomized parameters
  const handleRandomExample = () => {
    setIsAnimating(false);
    if (selectedId === 'normal') {
      setNormalMean(parseFloat((Math.random() * 4 - 2).toFixed(1)));
      setNormalStd(parseFloat((Math.random() * 1.8 + 0.3).toFixed(1)));
    } else if (selectedId === 'binomial') {
      setBinomN(Math.floor(Math.random() * 40 + 10));
      setBinomP(parseFloat((Math.random() * 0.7 + 0.15).toFixed(2)));
    } else if (selectedId === 'poisson') {
      setPoissonLambda(parseFloat((Math.random() * 11 + 1).toFixed(1)));
    } else if (selectedId === 'uniform') {
      const minVal = parseFloat((Math.random() * 4 - 5).toFixed(1));
      setUniformMin(minVal);
      setUniformMax(parseFloat((minVal + Math.random() * 6 + 1.5).toFixed(1)));
    } else if (selectedId === 'exponential') {
      setExpLambda(parseFloat((Math.random() * 2.5 + 0.3).toFixed(2)));
    } else if (selectedId === 't') {
      setTDf(Math.floor(Math.random() * 19 + 1));
    } else if (selectedId === 'chisquare') {
      setChiDf(Math.floor(Math.random() * 14 + 1));
    } else if (selectedId === 'f') {
      setFDf1(Math.floor(Math.random() * 14 + 1));
      setFDf2(Math.floor(Math.random() * 19 + 1));
    }
  };

  // Auto-Morphing animation
  useEffect(() => {
    if (isAnimating) {
      let direction = 1;
      animIntervalRef.current = setInterval(() => {
        if (selectedId === 'normal') {
          setNormalMean(prev => {
            if (prev >= 2) direction = -1;
            if (prev <= -2) direction = 1;
            return parseFloat((prev + 0.1 * direction).toFixed(2));
          });
          setNormalStd(prev => {
            let next = prev + 0.05 * direction;
            if (next > 2.2) next = 2.2;
            if (next < 0.4) next = 0.4;
            return parseFloat(next.toFixed(2));
          });
        } else if (selectedId === 'binomial') {
          setBinomP(prev => {
            if (prev >= 0.85) direction = -1;
            if (prev <= 0.15) direction = 1;
            return parseFloat((prev + 0.02 * direction).toFixed(2));
          });
        } else if (selectedId === 'poisson') {
          setPoissonLambda(prev => {
            if (prev >= 14) direction = -1;
            if (prev <= 1.5) direction = 1;
            return parseFloat((prev + 0.25 * direction).toFixed(2));
          });
        } else if (selectedId === 'uniform') {
          setUniformMax(prev => {
            if (prev >= 6) direction = -1;
            if (prev <= 1) direction = 1;
            return parseFloat((prev + 0.1 * direction).toFixed(2));
          });
        } else if (selectedId === 'exponential') {
          setExpLambda(prev => {
            if (prev >= 3) direction = -1;
            if (prev <= 0.3) direction = 1;
            return parseFloat((prev + 0.05 * direction).toFixed(2));
          });
        } else if (selectedId === 't') {
          setTDf(prev => {
            let next = prev + direction;
            if (next >= 25) direction = -1;
            if (next <= 2) direction = 1;
            return next;
          });
        } else if (selectedId === 'chisquare') {
          setChiDf(prev => {
            let next = prev + direction;
            if (next >= 20) direction = -1;
            if (next <= 2) direction = 1;
            return next;
          });
        } else if (selectedId === 'f') {
          setFDf1(prev => {
            let next = prev + direction;
            if (next >= 20) direction = -1;
            if (next <= 2) direction = 1;
            return next;
          });
        }
      }, 100);
    } else {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    }

    return () => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, [isAnimating, selectedId]);

  // Generate dataset for graphs and calculator shading
  const chartData = useMemo(() => {
    const data: any[] = [];
    
    switch (selectedId) {
      case 'normal': {
        const start = normalMean - 4 * normalStd;
        const end = normalMean + 4 * normalStd;
        const step = (end - start) / 120;
        
        for (let x = start; x <= end; x += step) {
          const pdf = math.normalPdf(x, normalMean, normalStd);
          
          // Check if within calculator bounds for shading
          let isShaded = false;
          if (calcType === 'less' && x <= calcX1) isShaded = true;
          else if (calcType === 'greater' && x >= calcX1) isShaded = true;
          else if (calcType === 'between' && x >= calcX1 && x <= calcX2) isShaded = true;
          
          data.push({
            x: parseFloat(x.toFixed(2)),
            pdf,
            shadedPdf: isShaded ? pdf : 0
          });
        }
        break;
      }
      
      case 'binomial': {
        for (let k = 0; k <= binomN; k++) {
          const pmf = math.binomialPmf(k, binomN, binomP);
          
          let isShaded = false;
          if (calcType === 'less' && k <= calcX1) isShaded = true;
          else if (calcType === 'greater' && k >= calcX1) isShaded = true;
          else if (calcType === 'between' && k >= calcX1 && k <= calcX2) isShaded = true;
          
          data.push({
            x: k,
            pmf,
            shadedPmf: isShaded ? pmf : 0
          });
        }
        break;
      }
      
      case 'poisson': {
        const maxK = Math.max(15, Math.ceil(poissonLambda + 4 * Math.sqrt(poissonLambda)));
        for (let k = 0; k <= maxK; k++) {
          const pmf = math.poissonPmf(k, poissonLambda);
          
          let isShaded = false;
          if (calcType === 'less' && k <= calcX1) isShaded = true;
          else if (calcType === 'greater' && k >= calcX1) isShaded = true;
          else if (calcType === 'between' && k >= calcX1 && k <= calcX2) isShaded = true;
          
          data.push({
            x: k,
            pmf,
            shadedPmf: isShaded ? pmf : 0
          });
        }
        break;
      }
      
      case 'uniform': {
        const margin = (uniformMax - uniformMin) * 0.25 || 1;
        const start = uniformMin - margin;
        const end = uniformMax + margin;
        const step = (end - start) / 120;
        
        for (let x = start; x <= end; x += step) {
          const pdf = math.uniformPdf(x, uniformMin, uniformMax);
          
          let isShaded = false;
          if (calcType === 'less' && x <= calcX1) isShaded = true;
          else if (calcType === 'greater' && x >= calcX1) isShaded = true;
          else if (calcType === 'between' && x >= calcX1 && x <= calcX2) isShaded = true;
          
          data.push({
            x: parseFloat(x.toFixed(2)),
            pdf,
            shadedPdf: isShaded ? pdf : 0
          });
        }
        break;
      }
      
      case 'exponential': {
        const start = 0;
        const end = 5 / expLambda;
        const step = (end - start) / 120;
        
        for (let x = start; x <= end; x += step) {
          const pdf = math.exponentialPdf(x, expLambda);
          
          let isShaded = false;
          if (calcType === 'less' && x <= calcX1) isShaded = true;
          else if (calcType === 'greater' && x >= calcX1) isShaded = true;
          else if (calcType === 'between' && x >= calcX1 && x <= calcX2) isShaded = true;
          
          data.push({
            x: parseFloat(x.toFixed(2)),
            pdf,
            shadedPdf: isShaded ? pdf : 0
          });
        }
        break;
      }
      
      case 't': {
        const start = -5;
        const end = 5;
        const step = (end - start) / 120;
        
        for (let x = start; x <= end; x += step) {
          const pdf = math.tPdf(x, tDf);
          const normalComparison = math.normalPdf(x, 0, 1); // standard normal
          
          let isShaded = false;
          if (calcType === 'less' && x <= calcX1) isShaded = true;
          else if (calcType === 'greater' && x >= calcX1) isShaded = true;
          else if (calcType === 'between' && x >= calcX1 && x <= calcX2) isShaded = true;
          
          data.push({
            x: parseFloat(x.toFixed(2)),
            pdf,
            shadedPdf: isShaded ? pdf : 0,
            normalRef: normalComparison
          });
        }
        break;
      }
      
      case 'chisquare': {
        const start = 0.01;
        const end = chiDf + 4 * Math.sqrt(2 * chiDf);
        const step = (end - start) / 120;
        
        for (let x = start; x <= end; x += step) {
          const pdf = math.chiSquarePdf(x, chiDf);
          
          let isShaded = false;
          if (calcType === 'less' && x <= calcX1) isShaded = true;
          else if (calcType === 'greater' && x >= calcX1) isShaded = true;
          else if (calcType === 'between' && x >= calcX1 && x <= calcX2) isShaded = true;
          
          data.push({
            x: parseFloat(x.toFixed(2)),
            pdf,
            shadedPdf: isShaded ? pdf : 0
          });
        }
        break;
      }
      
      case 'f': {
        const start = 0.01;
        // Mean is d2 / (d2 - 2). Use a solid range to plot.
        const end = 5;
        const step = (end - start) / 120;
        
        for (let x = start; x <= end; x += step) {
          const pdf = math.fPdf(x, fDf1, fDf2);
          
          let isShaded = false;
          if (calcType === 'less' && x <= calcX1) isShaded = true;
          else if (calcType === 'greater' && x >= calcX1) isShaded = true;
          else if (calcType === 'between' && x >= calcX1 && x <= calcX2) isShaded = true;
          
          data.push({
            x: parseFloat(x.toFixed(2)),
            pdf,
            shadedPdf: isShaded ? pdf : 0
          });
        }
        break;
      }
    }
    
    return data;
  }, [
    selectedId,
    normalMean, normalStd,
    binomN, binomP,
    poissonLambda,
    uniformMin, uniformMax,
    expLambda,
    tDf,
    chiDf,
    fDf1, fDf2,
    calcType, calcX1, calcX2
  ]);

  // Calculate live statistics
  const currentStats = useMemo(() => {
    let mean = 0;
    let variance = 0;
    let stdDev = 0;
    
    switch (selectedId) {
      case 'normal':
        mean = normalMean;
        variance = normalStd * normalStd;
        stdDev = normalStd;
        break;
      case 'binomial':
        mean = binomN * binomP;
        variance = binomN * binomP * (1 - binomP);
        stdDev = Math.sqrt(variance);
        break;
      case 'poisson':
        mean = poissonLambda;
        variance = poissonLambda;
        stdDev = Math.sqrt(poissonLambda);
        break;
      case 'uniform':
        mean = (uniformMin + uniformMax) / 2;
        variance = Math.pow(uniformMax - uniformMin, 2) / 12;
        stdDev = Math.sqrt(variance);
        break;
      case 'exponential':
        mean = 1 / expLambda;
        variance = 1 / Math.pow(expLambda, 2);
        stdDev = mean;
        break;
      case 't':
        mean = 0;
        variance = tDf > 2 ? tDf / (tDf - 2) : Infinity;
        stdDev = tDf > 2 ? Math.sqrt(variance) : Infinity;
        break;
      case 'chisquare':
        mean = chiDf;
        variance = 2 * chiDf;
        stdDev = Math.sqrt(variance);
        break;
      case 'f':
        mean = fDf2 > 2 ? fDf2 / (fDf2 - 2) : Infinity;
        variance = fDf2 > 4 ? (2 * fDf2 * fDf2 * (fDf1 + fDf2 - 2)) / (fDf1 * Math.pow(fDf2 - 2, 2) * (fDf2 - 4)) : Infinity;
        stdDev = variance !== Infinity ? Math.sqrt(variance) : Infinity;
        break;
    }
    
    return {
      mean: mean === Infinity ? '∞' : mean.toFixed(4),
      variance: variance === Infinity ? '∞' : variance.toFixed(4),
      stdDev: stdDev === Infinity ? '∞' : stdDev.toFixed(4)
    };
  }, [
    selectedId,
    normalMean, normalStd,
    binomN, binomP,
    poissonLambda,
    uniformMin, uniformMax,
    expLambda,
    tDf,
    chiDf,
    fDf1, fDf2
  ]);

  // Calculate live probability from calculator
  const calcResult = useMemo(() => {
    let result = 0;
    
    switch (selectedId) {
      case 'normal':
        if (calcType === 'less') {
          result = math.normalCdf(calcX1, normalMean, normalStd);
        } else if (calcType === 'greater') {
          result = 1 - math.normalCdf(calcX1, normalMean, normalStd);
        } else {
          result = math.normalCdf(calcX2, normalMean, normalStd) - math.normalCdf(calcX1, normalMean, normalStd);
        }
        break;
        
      case 'binomial':
        if (calcType === 'less') {
          result = math.binomialCdf(calcX1, binomN, binomP);
        } else if (calcType === 'greater') {
          result = 1 - math.binomialCdf(calcX1 - 1, binomN, binomP);
        } else {
          result = math.binomialCdf(calcX2, binomN, binomP) - math.binomialCdf(calcX1 - 1, binomN, binomP);
        }
        break;
        
      case 'poisson':
        if (calcType === 'less') {
          result = math.poissonCdf(calcX1, poissonLambda);
        } else if (calcType === 'greater') {
          result = 1 - math.poissonCdf(calcX1 - 1, poissonLambda);
        } else {
          result = math.poissonCdf(calcX2, poissonLambda) - math.poissonCdf(calcX1 - 1, poissonLambda);
        }
        break;
        
      case 'uniform':
        if (calcType === 'less') {
          result = math.uniformCdf(calcX1, uniformMin, uniformMax);
        } else if (calcType === 'greater') {
          result = 1 - math.uniformCdf(calcX1, uniformMin, uniformMax);
        } else {
          result = math.uniformCdf(calcX2, uniformMin, uniformMax) - math.uniformCdf(calcX1, uniformMin, uniformMax);
        }
        break;
        
      case 'exponential':
        if (calcType === 'less') {
          result = math.exponentialCdf(calcX1, expLambda);
        } else if (calcType === 'greater') {
          result = 1 - math.exponentialCdf(calcX1, expLambda);
        } else {
          result = math.exponentialCdf(calcX2, expLambda) - math.exponentialCdf(calcX1, expLambda);
        }
        break;
        
      case 't':
        if (calcType === 'less') {
          result = math.tCdf(calcX1, tDf);
        } else if (calcType === 'greater') {
          result = 1 - math.tCdf(calcX1, tDf);
        } else {
          result = math.tCdf(calcX2, tDf) - math.tCdf(calcX1, tDf);
        }
        break;
        
      case 'chisquare':
        if (calcType === 'less') {
          result = math.chiSquareCdf(calcX1, chiDf);
        } else if (calcType === 'greater') {
          result = 1 - math.chiSquareCdf(calcX1, chiDf);
        } else {
          result = math.chiSquareCdf(calcX2, chiDf) - math.chiSquareCdf(calcX1, chiDf);
        }
        break;
        
      case 'f':
        if (calcType === 'less') {
          result = math.fCdf(calcX1, fDf1, fDf2);
        } else if (calcType === 'greater') {
          result = 1 - math.fCdf(calcX1, fDf1, fDf2);
        } else {
          result = math.fCdf(calcX2, fDf1, fDf2) - math.fCdf(calcX1, fDf1, fDf2);
        }
        break;
    }
    
    return Math.max(0, Math.min(1, result));
  }, [
    selectedId, calcType, calcX1, calcX2,
    normalMean, normalStd,
    binomN, binomP,
    poissonLambda,
    uniformMin, uniformMax,
    expLambda,
    tDf,
    chiDf,
    fDf1, fDf2
  ]);

  // Adjust calculator default ranges when distribution changes
  useEffect(() => {
    if (selectedId === 'normal') {
      setCalcX1(parseFloat(normalMean.toFixed(1)));
      setCalcX2(parseFloat((normalMean + normalStd).toFixed(1)));
    } else if (selectedId === 'binomial') {
      setCalcX1(Math.round(binomN * binomP));
      setCalcX2(Math.round(binomN * binomP + 2));
    } else if (selectedId === 'poisson') {
      setCalcX1(Math.round(poissonLambda));
      setCalcX2(Math.round(poissonLambda + 3));
    } else if (selectedId === 'uniform') {
      setCalcX1(parseFloat(((uniformMin + uniformMax) / 2).toFixed(1)));
      setCalcX2(parseFloat(uniformMax.toFixed(1)));
    } else if (selectedId === 'exponential') {
      setCalcX1(parseFloat((1 / expLambda).toFixed(2)));
      setCalcX2(parseFloat((2 / expLambda).toFixed(2)));
    } else if (selectedId === 't') {
      setCalcX1(0);
      setCalcX2(1);
    } else if (selectedId === 'chisquare') {
      setCalcX1(chiDf);
      setCalcX2(chiDf + 4);
    } else if (selectedId === 'f') {
      setCalcX1(1);
      setCalcX2(2);
    }
  }, [selectedId]);

  // Download chart as PNG
  const handleDownloadPNG = () => {
    const svgEl = document.querySelector('.recharts-wrapper svg');
    if (!svgEl) return;
    
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = window.URL.createObjectURL(svgBlob);
    
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svgEl.clientWidth * 2; // high res
      canvas.height = svgEl.clientHeight * 2;
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.scale(2, 2);
        context.drawImage(image, 0, 0);
        
        const png = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${selectedId}-distribution-chart.png`;
        link.href = png;
        link.click();
      }
    };
    image.src = blobURL;
  };

  const isFavorite = favorites.includes(selectedId);

  return (
    <div className="space-y-8" id="explorer-view">
      {/* Distribution selector list */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-200 dark:border-slate-800" id="distribution-pills">
        {(Object.keys(distributionsData) as DistributionType[]).map(id => {
          const dist = distributionsData[id];
          const active = selectedId === id;
          return (
            <button
              key={id}
              id={`pill-${id}`}
              onClick={() => {
                setSelectedId(id);
                setIsAnimating(false);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                active
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
              }`}
            >
              {dist.name}
              {favorites.includes(id) && (
                <Heart className={`w-3 h-3 fill-amber-400 text-amber-400`} />
              )}
            </button>
          );
        })}
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${isFullscreen ? 'fixed inset-0 z-50 p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto' : ''}`} id="explorer-grid">
        {/* Left Column: Sliders and Calculator */}
        <div className={`lg:col-span-5 space-y-6 ${isFullscreen ? 'hidden lg:block lg:col-span-4' : ''}`} id="control-panel">
          {/* Title Card */}
          <div className="glass-card rounded-2xl p-6" id="dist-info-card">
            <div className="flex justify-between items-start mb-2" id="title-wrapper">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white" id="dist-title">
                {distribution.name}
              </h2>
              <button
                onClick={() => onToggleFavorite(selectedId)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'bg-amber-100 dark:bg-amber-950 text-amber-500' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 hover:text-gray-600'
                }`}
                title="Favorite this distribution"
                id="fav-btn"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed" id="dist-def">
              {distribution.definition}
            </p>
            <div className="p-4 bg-blue-50 dark:bg-slate-800/50 rounded-xl flex flex-col items-center justify-center border border-blue-100 dark:border-slate-700/50" id="formula-holder">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1 uppercase tracking-wider" id="eq-label">Probability Equation</span>
              <MathTex math={distribution.formula} block={true} />
            </div>
          </div>

          {/* Slider Parameters Card */}
          <div className="glass-card rounded-2xl p-6 space-y-5" id="parameters-card">
            <div className="flex justify-between items-center mb-1" id="params-header">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2" id="params-title">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Parameters Control
              </h3>
              <div className="flex gap-2" id="params-controls">
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    isAnimating
                      ? 'bg-emerald-500 text-white animate-pulse'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                  id="anim-btn"
                >
                  {isAnimating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isAnimating ? 'Stop Morph' : 'Animate'}
                </button>
                <button
                  onClick={handleRandomExample}
                  className="p-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  title="Random Example"
                  id="rand-btn"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  title="Reset Parameters"
                  id="reset-btn"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4" id="sliders-container">
              {/* NORMAL SLIDERS */}
              {selectedId === 'normal' && (
                <>
                  <div className="space-y-1" id="slider-mean">
                    <div className="flex justify-between text-sm">
                      <label className="text-gray-700 dark:text-gray-300 font-medium">Mean (<MathTex math="\mu" />):</label>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{normalMean}</span>
                    </div>
                    <input
                      type="range"
                      min="-4"
                      max="4"
                      step="0.1"
                      value={normalMean}
                      onChange={e => {
                        setIsAnimating(false);
                        setNormalMean(parseFloat(e.target.value));
                      }}
                      className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>-4</span>
                      <span>4</span>
                    </div>
                  </div>

                  <div className="space-y-1" id="slider-std">
                    <div className="flex justify-between text-sm">
                      <label className="text-gray-700 dark:text-gray-300 font-medium">Standard Deviation (<MathTex math="\sigma" />):</label>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{normalStd}</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="2.5"
                      step="0.1"
                      value={normalStd}
                      onChange={e => {
                        setIsAnimating(false);
                        setNormalStd(parseFloat(e.target.value));
                      }}
                      className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0.2 (Tight)</span>
                      <span>2.5 (Spread)</span>
                    </div>
                  </div>
                </>
              )}

              {/* BINOMIAL SLIDERS */}
              {selectedId === 'binomial' && (
                <>
                  <div className="space-y-1" id="slider-binom-n">
                    <div className="flex justify-between text-sm">
                      <label className="text-gray-700 dark:text-gray-300 font-medium">Number of Trials (n):</label>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{binomN}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      step="1"
                      value={binomN}
                      onChange={e => {
                        setIsAnimating(false);
                        const val = parseInt(e.target.value);
                        setBinomN(val);
                        if (calcX1 > val) setCalcX1(val);
                        if (calcX2 > val) setCalcX2(val);
                      }}
                      className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>5</span>
                      <span>80</span>
                    </div>
                  </div>

                  <div className="space-y-1" id="slider-binom-p">
                    <div className="flex justify-between text-sm">
                      <label className="text-gray-700 dark:text-gray-300 font-medium">Success Probability (p):</label>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{binomP}</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.95"
                      step="0.01"
                      value={binomP}
                      onChange={e => {
                        setIsAnimating(false);
                        setBinomP(parseFloat(e.target.value));
                      }}
                      className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0.05</span>
                      <span>0.95</span>
                    </div>
                  </div>
                </>
              )}

              {/* POISSON SLIDER */}
              {selectedId === 'poisson' && (
                <div className="space-y-1" id="slider-poisson-lambda">
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">Rate (<MathTex math="\lambda" />):</label>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{poissonLambda}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="15"
                    step="0.1"
                    value={poissonLambda}
                    onChange={e => {
                      setIsAnimating(false);
                      setPoissonLambda(parseFloat(e.target.value));
                    }}
                    className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0.5</span>
                    <span>15</span>
                  </div>
                </div>
              )}

              {/* UNIFORM SLIDERS */}
              {selectedId === 'uniform' && (
                <>
                  <div className="space-y-1" id="slider-uniform-min">
                    <div className="flex justify-between text-sm">
                      <label className="text-gray-700 dark:text-gray-300 font-medium">Minimum (a):</label>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{uniformMin}</span>
                    </div>
                    <input
                      type="range"
                      min="-6"
                      max="4"
                      step="0.1"
                      value={uniformMin}
                      onChange={e => {
                        setIsAnimating(false);
                        const val = parseFloat(e.target.value);
                        if (val < uniformMax) {
                          setUniformMin(val);
                        }
                      }}
                      className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>-6</span>
                      <span>4</span>
                    </div>
                  </div>

                  <div className="space-y-1" id="slider-uniform-max">
                    <div className="flex justify-between text-sm">
                      <label className="text-gray-700 dark:text-gray-300 font-medium">Maximum (b):</label>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{uniformMax}</span>
                    </div>
                    <input
                      type="range"
                      min="-3"
                      max="8"
                      step="0.1"
                      value={uniformMax}
                      onChange={e => {
                        setIsAnimating(false);
                        const val = parseFloat(e.target.value);
                        if (val > uniformMin) {
                          setUniformMax(val);
                        }
                      }}
                      className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>-3</span>
                      <span>8</span>
                    </div>
                  </div>
                </>
              )}

              {/* EXPONENTIAL SLIDER */}
              {selectedId === 'exponential' && (
                <div className="space-y-1" id="slider-exp-lambda">
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">Decay Rate (<MathTex math="\lambda" />):</label>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{expLambda}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="4.0"
                    step="0.1"
                    value={expLambda}
                    onChange={e => {
                      setIsAnimating(false);
                      setExpLambda(parseFloat(e.target.value));
                    }}
                    className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0.2</span>
                    <span>4.0</span>
                  </div>
                </div>
              )}

              {/* STUDENT T SLIDER */}
              {selectedId === 't' && (
                <div className="space-y-1" id="slider-t-df">
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">Degrees of Freedom (<MathTex math="\nu" />):</label>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{tDf}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={tDf}
                    onChange={e => {
                      setIsAnimating(false);
                      setTDf(parseInt(e.target.value));
                    }}
                    className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>1 (Heaviest Tails)</span>
                    <span>40 (Approaches Normal)</span>
                  </div>
                </div>
              )}

              {/* CHI-SQUARE SLIDER */}
              {selectedId === 'chisquare' && (
                <div className="space-y-1" id="slider-chi-df">
                  <div className="flex justify-between text-sm">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">Degrees of Freedom (k):</label>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{chiDf}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    step="1"
                    value={chiDf}
                    onChange={e => {
                      setIsAnimating(false);
                      setChiDf(parseInt(e.target.value));
                    }}
                    className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>1 (Highly Skewed)</span>
                    <span>25 (Becomes Normal)</span>
                  </div>
                </div>
              )}

              {/* F-DISTRIBUTION SLIDERS */}
              {selectedId === 'f' && (
                <>
                  <div className="space-y-1" id="slider-f-df1">
                    <div className="flex justify-between text-sm">
                      <label className="text-gray-700 dark:text-gray-300 font-medium">Numerator DF (<MathTex math="d_1" />):</label>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{fDf1}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={fDf1}
                      onChange={e => {
                        setIsAnimating(false);
                        setFDf1(parseInt(e.target.value));
                      }}
                      className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>1</span>
                      <span>30</span>
                    </div>
                  </div>

                  <div className="space-y-1" id="slider-f-df2">
                    <div className="flex justify-between text-sm">
                      <label className="text-gray-700 dark:text-gray-300 font-medium">Denominator DF (<MathTex math="d_2" />):</label>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{fDf2}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={fDf2}
                      onChange={e => {
                        setIsAnimating(false);
                        setFDf2(parseInt(e.target.value));
                      }}
                      className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>1</span>
                      <span>30</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Parameter summary formulas */}
            <div className="pt-3 border-t border-gray-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center" id="stats-summary-grid">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl" id="summary-mean-box">
                <span className="block text-[10px] text-gray-500 font-medium uppercase tracking-wider">Mean</span>
                <MathTex math={distribution.meanFormula} />
                <span className="block text-sm font-bold text-gray-800 dark:text-gray-200 font-mono mt-0.5">{currentStats.mean}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl" id="summary-variance-box">
                <span className="block text-[10px] text-gray-500 font-medium uppercase tracking-wider">Variance</span>
                <MathTex math={distribution.varianceFormula} />
                <span className="block text-sm font-bold text-gray-800 dark:text-gray-200 font-mono mt-0.5">{currentStats.variance}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl" id="summary-stddev-box">
                <span className="block text-[10px] text-gray-500 font-medium uppercase tracking-wider">Std. Dev.</span>
                <MathTex math="\\sigma" />
                <span className="block text-sm font-bold text-gray-800 dark:text-gray-200 font-mono mt-0.5">{currentStats.stdDev}</span>
              </div>
            </div>
          </div>

          {/* Probability Calculator Card */}
          <div className="glass-card rounded-2xl p-6 space-y-4" id="calculator-card">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2" id="calc-title">
              <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Interactive Calculator
            </h3>

            <div className="flex rounded-lg bg-gray-100 dark:bg-slate-800 p-1" id="calc-tab-wrapper">
              {(['less', 'greater', 'between'] as const).map(type => {
                const active = calcType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setCalcType(type)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      active
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                    id={`btn-calc-${type}`}
                  >
                    {type === 'less' ? 'P(X ≤ x)' : type === 'greater' ? 'P(X ≥ x)' : 'P(a ≤ X ≤ b)'}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4" id="calc-inputs">
              <div id="calc-input-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                  {calcType === 'between' ? 'Bound a' : 'Value x'}
                </label>
                <input
                  type="number"
                  step={distribution.type === 'discrete' ? '1' : '0.1'}
                  value={calcX1}
                  onChange={e => setCalcX1(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl font-mono text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              {calcType === 'between' && (
                <div id="calc-input-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                    Bound b
                  </label>
                  <input
                    type="number"
                    step={distribution.type === 'discrete' ? '1' : '0.1'}
                    value={calcX2}
                    onChange={e => setCalcX2(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl font-mono text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between" id="calc-result-box">
              <div className="space-y-0.5" id="calc-result-info">
                <span className="block text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Calculated Probability</span>
                <span className="block font-mono text-lg font-extrabold text-amber-700 dark:text-amber-300">
                  {calcResult.toFixed(6)}
                </span>
              </div>
              <div className="text-right text-xs text-amber-600 dark:text-amber-400 font-semibold" id="calc-percentage">
                {(calcResult * 100).toFixed(4)}%
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Huge Dynamic Graph and Description Details */}
        <div className={`lg:col-span-7 space-y-6 ${isFullscreen ? 'lg:col-span-8' : ''}`} id="graph-panel">
          {/* Graph Card */}
          <div className="glass-card rounded-2xl p-6 flex flex-col h-[480px] relative" id="chart-card">
            <div className="flex justify-between items-center mb-4" id="chart-header">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2" id="chart-title">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Live Visualization <span className="text-xs bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-semibold">{distribution.type === 'continuous' ? 'Probability Density (PDF)' : 'Probability Mass (PMF)'}</span>
              </h3>
              <div className="flex gap-2" id="chart-utility-btns">
                <button
                  onClick={handleDownloadPNG}
                  className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors cursor-pointer"
                  title="Download Graph as PNG"
                  id="dl-chart-btn"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors cursor-pointer"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
                  id="fs-chart-btn"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Actual Recharts Component */}
            <div className="flex-1 w-full min-h-[300px]" id="recharts-wrapper-container">
              <ResponsiveContainer width="100%" height="100%">
                {distribution.type === 'continuous' ? (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPdf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="colorShaded" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.65} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.15} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={['auto', 'auto']}
                      tickLine={false}
                      stroke="#94a3b8"
                      className="text-xs font-mono"
                    />
                    <YAxis
                      tickLine={false}
                      stroke="#94a3b8"
                      className="text-xs font-mono"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-white dark:bg-slate-800 p-3 shadow-xl rounded-xl border border-gray-100 dark:border-slate-700 text-xs font-semibold space-y-1">
                              <p className="text-gray-500 font-mono">X = {item.x}</p>
                              <p className="text-blue-600 dark:text-blue-400">PDF = {item.pdf.toFixed(5)}</p>
                              {item.normalRef !== undefined && (
                                <p className="text-gray-400">Normal = {item.normalRef.toFixed(5)}</p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    
                    {/* Reference Lines for Mean */}
                    {selectedId !== 'exponential' && selectedId !== 'chisquare' && selectedId !== 'f' && (
                      <ReferenceLine x={parseFloat(currentStats.mean)} stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4">
                        <Label value="Mean" position="top" fill="#3b82f6" className="text-xs font-bold font-mono" />
                      </ReferenceLine>
                    )}

                    {/* Compare Student t with Normal */}
                    {selectedId === 't' && (
                      <Area
                        type="monotone"
                        dataKey="normalRef"
                        stroke="#94a3b8"
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                        fill="none"
                        name="Std Normal comparison"
                      />
                    )}

                    {/* Entire curve background */}
                    <Area
                      type="monotone"
                      dataKey="pdf"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorPdf)"
                      name="PDF Curve"
                    />

                    {/* Integrated Shade Region overlay */}
                    <Area
                      type="monotone"
                      dataKey="shadedPdf"
                      stroke="none"
                      fillOpacity={1}
                      fill="url(#colorShaded)"
                      name="Calculator Area"
                    />
                    
                    {selectedId === 't' && <Legend verticalAlign="top" height={36} />}
                  </AreaChart>
                ) : (
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={['auto', 'auto']}
                      tickLine={false}
                      stroke="#94a3b8"
                      className="text-xs font-mono"
                    />
                    <YAxis
                      tickLine={false}
                      stroke="#94a3b8"
                      className="text-xs font-mono"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-white dark:bg-slate-800 p-3 shadow-xl rounded-xl border border-gray-100 dark:border-slate-700 text-xs font-semibold space-y-1">
                              <p className="text-gray-500 font-mono">k = {item.x}</p>
                              <p className="text-blue-600 dark:text-blue-400">PMF = {item.pmf.toFixed(5)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    
                    <ReferenceLine x={parseFloat(currentStats.mean)} stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4">
                      <Label value="Mean" position="top" fill="#3b82f6" className="text-xs font-bold font-mono" />
                    </ReferenceLine>

                    {/* Background complete discrete bars */}
                    <Bar dataKey="pmf" fill="#3b82f6" fillOpacity={0.25} radius={[4, 4, 0, 0]} />
                    
                    {/* Shade overlay discrete bars */}
                    <Bar dataKey="shadedPmf" fill="#f59e0b" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Legend info */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500" id="chart-footer-caption">
              <span className="flex items-center gap-1.5 font-medium">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                Drag sliders to see the graph morph dynamically.
              </span>
              <span className="font-mono text-[10px]" id="chart-coord-label">Interactive Stats Lab 2026</span>
            </div>
          </div>

          {/* Real world & Properties Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="dist-info-details">
            <div className="glass-card rounded-2xl p-6 space-y-3" id="properties-box">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Key Properties
              </h4>
              <ul className="space-y-2" id="props-list">
                {distribution.properties.map((prop, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                    {prop}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-3" id="real-life-box">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Real-Life Scenario
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic bg-blue-50/50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-blue-50/50 dark:border-slate-800 leading-relaxed" id="real-life-text">
                &ldquo;{distribution.realLifeExample}&rdquo;
              </p>
              <div>
                <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-3 mb-1">Key Applications</h5>
                <div className="flex flex-wrap gap-1.5" id="apps-chips">
                  {distribution.applications.map((app, i) => (
                    <span key={i} className="text-[11px] bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-md font-semibold">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
