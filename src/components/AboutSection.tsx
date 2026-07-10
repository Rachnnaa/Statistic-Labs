import React from 'react';
import { Landmark, Brain, ShieldAlert, HeartPulse, HardDrive, DollarSign } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="space-y-12" id="about-section-view">
      {/* Overview Card */}
      <div className="glass-card rounded-2xl p-8 space-y-4" id="about-intro">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Landmark className="text-blue-600 w-6 h-6" />
          The Science of Uncertainty
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
          Statistics is the discipline that concerns the collection, organization, analysis, interpretation, and presentation of data. From the Latin word <em>status</em> (meaning state), statistics originally arose as the "science of the state"—used by governments to catalog populations and resources. Today, it forms the mathematical bedrock of all experimental science and predictive computation.
        </p>
      </div>

      {/* History timeline card */}
      <div className="glass-card rounded-2xl p-8 space-y-6" id="about-history">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-800 pb-2">
          Historical Pioneers
        </h3>

        <div className="space-y-6" id="history-timeline">
          <div className="flex gap-4 items-start" id="timeline-gauss">
            <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 dark:bg-slate-800 px-3 py-1 rounded-lg mt-0.5">1809</span>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Carl Friedrich Gauss & The Normal Curve</h4>
              <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed">
                Gauss introduced the normal (bell-shaped) error curve while calculating the astronomical orbit of the dwarf planet Ceres. It remains the most widely applied distribution in science.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start" id="timeline-laplace">
            <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 dark:bg-slate-800 px-3 py-1 rounded-lg mt-0.5">1812</span>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Pierre-Simon Laplace & Central Limit Theorem</h4>
              <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed">
                Laplace proved early formulations of the Central Limit Theorem, establishing the physical proof of why sampling averages naturally converge to a Normal distribution.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start" id="timeline-gosset">
            <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 dark:bg-slate-800 px-3 py-1 rounded-lg mt-0.5">1908</span>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">William Sealy Gosset & Student's t-Distribution</h4>
              <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed">
                Employed by Guinness Brewery, Gosset published the t-distribution under the pen name "Student" to model small samples of hops and grains, launching modern small-sample inferential statistics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Applications grid */}
      <div className="space-y-6" id="about-applications">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-800 pb-2">
          Modern Applications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="apps-grid">
          {/* Machine Learning */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 rounded-2xl space-y-3" id="app-ml">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Machine Learning & AI</h4>
            <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed">
              Neural network weights, optimization objectives, and modern probabilistic generative architectures (like diffusion modeling) rely strictly on probability density approximations and loss optimizations.
            </p>
          </div>

          {/* Quantitative Finance */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 rounded-2xl space-y-3" id="app-finance">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shadow-md">
              <DollarSign className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Quantitative Finance</h4>
            <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed">
              Risk analysis, stock volatility models, and Black-Scholes options pricing engines depend heavily on continuous log-normal and geometric Brownian motion probability curves.
            </p>
          </div>

          {/* Clinical Epidemiology */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 rounded-2xl space-y-3" id="app-health">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center shadow-md">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Clinical Epidemiology</h4>
            <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed">
              Evaluating disease risks, modeling infection rates, and testing the efficacy of pharmaceutical trials require standard hypothesis checking (p-values) to prove significance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
