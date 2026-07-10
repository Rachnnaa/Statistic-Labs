import React, { useState } from 'react';
import { BookOpen, HelpCircle, Award, Target, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { DistributionType } from '../types';
import { distributionsData } from '../data/distributionsData';
import MathTex from './MathTex';

export default function LearningMode() {
  const [selectedId, setSelectedId] = useState<DistributionType>('normal');
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'derivation' | 'comparison'>('info');

  const dist = distributionsData[selectedId];

  return (
    <div className="space-y-8" id="learning-mode-view">
      {/* Selector pills */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-200 dark:border-slate-800" id="learn-dist-pills">
        {(Object.keys(distributionsData) as DistributionType[]).map(id => {
          const active = selectedId === id;
          return (
            <button
              key={id}
              onClick={() => setSelectedId(id)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors cursor-pointer ${
                active
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
              }`}
            >
              {distributionsData[id].name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="learn-layout-grid">
        {/* Left Side: Navigation booklet subsections */}
        <div className="lg:col-span-3 space-y-4" id="learn-subtabs-column">
          <div className="glass-card rounded-2xl p-4 space-y-1" id="learn-subtabs-wrapper">
            <button
              onClick={() => setActiveSubTab('info')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer text-left ${
                activeSubTab === 'info'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'
              }`}
              id="subtab-info"
            >
              <BookOpen className="w-4 h-4" />
              Core Handbook
            </button>
            <button
              onClick={() => setActiveSubTab('derivation')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer text-left ${
                activeSubTab === 'derivation'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'
              }`}
              id="subtab-derivation"
            >
              <FileText className="w-4 h-4" />
              Mathematical Origin
            </button>
            <button
              onClick={() => setActiveSubTab('comparison')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer text-left ${
                activeSubTab === 'comparison'
                  ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'
              }`}
              id="subtab-comparison"
            >
              <Target className="w-4 h-4" />
              Evaluation & Limits
            </button>
          </div>

          {/* Quick parameter summary card */}
          <div className="glass-card rounded-2xl p-5 space-y-3" id="learn-quick-summary">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Metrics</h4>
            <div className="space-y-2 text-sm font-mono" id="learn-metrics-rows">
              <div className="flex justify-between border-b border-gray-100 dark:border-slate-800/60 pb-1.5">
                <span className="text-gray-500">Mean:</span>
                <span className="font-bold text-gray-800 dark:text-gray-200"><MathTex math={dist.meanFormula} /></span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Variance:</span>
                <span className="font-bold text-gray-800 dark:text-gray-200"><MathTex math={dist.varianceFormula} /></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed descriptive booklet page */}
        <div className="lg:col-span-9" id="learn-content-column">
          <div className="glass-card rounded-2xl p-8 space-y-6 min-h-[420px]" id="learn-booklet-page">
            
            {activeSubTab === 'info' && (
              <div className="space-y-6" id="booklet-info-page">
                <div id="booklet-intro">
                  <span className="text-xs bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    {dist.type} Distribution
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-3" id="booklet-title">
                    {dist.name} Overview
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                    {dist.definition}
                  </p>
                </div>

                {/* Properties section */}
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800/60" id="booklet-properties">
                  <h4 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-500" /> Key Characteristics
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="properties-grid-split">
                    {dist.properties.map((prop, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50 flex gap-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{idx+1}</span>
                        <p>{prop}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Scenario */}
                <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl space-y-2 mt-4" id="booklet-scenario">
                  <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" /> Real-World Narrative Example
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                    &ldquo;{dist.realLifeExample}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {activeSubTab === 'derivation' && (
              <div className="space-y-6" id="booklet-derivation-page">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" /> Mathematical Genesis
                </h3>
                
                <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50 rounded-xl space-y-4 text-center" id="formula-canvas">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Probability Equation</span>
                  <MathTex math={dist.formula} block={true} />
                </div>

                <div className="space-y-3" id="derivation-narrative">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Concept Origin</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {dist.derivation}
                  </p>
                </div>
              </div>
            )}

            {activeSubTab === 'comparison' && (
              <div className="space-y-6" id="booklet-comparison-page">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" /> Evaluation Blueprint
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="advantages-limitations-split">
                  {/* Advantages list */}
                  <div className="space-y-3" id="advantages-box">
                    <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Core Strengths
                    </h4>
                    <div className="space-y-2">
                      {dist.advantages.map((adv, idx) => (
                        <div key={idx} className="p-3 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950/20 rounded-xl text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {adv}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Limitations list */}
                  <div className="space-y-3" id="limitations-box">
                    <h4 className="text-sm font-bold text-rose-600 uppercase tracking-wider flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500" /> Inherent Limitations
                    </h4>
                    <div className="space-y-2">
                      {dist.limitations.map((lim, idx) => (
                        <div key={idx} className="p-3 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950/20 rounded-xl text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {lim}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
