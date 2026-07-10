import React, { useState } from 'react';
import { FileText, Printer, Search, HelpCircle, Layers, BookOpen } from 'lucide-react';
import MathTex from './MathTex';

interface FormulaItem {
  name: string;
  latex: string;
  description: string;
}

interface FormulaCategory {
  title: string;
  items: FormulaItem[];
}

const formulaSheets: FormulaCategory[] = [
  {
    title: "Fundamental Probability Laws",
    items: [
      {
        name: "Axioms of Probability",
        latex: "0 \\le P(A) \\le 1, \\quad P(\\Omega) = 1, \\quad P(A \\cup B) = P(A) + P(B) \\quad (\\text{if } A \\cap B = \\emptyset)",
        description: "The core foundational assumptions that define mathematical probability theory."
      },
      {
        name: "Bayes' Theorem",
        latex: "P(A | B) = \\frac{P(B | A) \\cdot P(A)}{P(B)}",
        description: "Expresses conditional probability, allowing you to update the probability of a hypothesis (A) based on observed evidence (B)."
      },
      {
        name: "Mean (Expected Value)",
        latex: "E[X] = \\mu = \\sum x_i p_i \\quad (\\text{discrete}), \\quad E[X] = \\int_{-\\infty}^{\\infty} x f(x) dx \\quad (\\text{continuous})",
        description: "The weighted average of all possible values a random variable can assume."
      },
      {
        name: "Variance & Standard Deviation",
        latex: "Var(X) = \\sigma^2 = E[(X - \\mu)^2] = E[X^2] - (E[X])^2, \\quad \\sigma = \\sqrt{Var(X)}",
        description: "Measures the dispersion or spread of values around the expected value (mean)."
      },
      {
        name: "Covariance",
        latex: "Cov(X, Y) = E[(X - E[X])(Y - E[Y])] = E[XY] - E[X]E[Y]",
        description: "Measures the joint variability of two random variables, indicating if they change together."
      }
    ]
  },
  {
    title: "Continuous Distributions",
    items: [
      {
        name: "Normal Gaussian Distribution",
        latex: "f(x | \\mu, \\sigma) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}",
        description: "Symmetric, bell-shaped distribution. Models standard scores and physical/social characteristics."
      },
      {
        name: "Continuous Uniform Distribution",
        latex: "f(x) = \\frac{1}{b - a} \\quad \\text{for } a \\le x \\le b",
        description: "Flat, rectangular distribution where all equal-width intervals within the support are equally probable."
      },
      {
        name: "Exponential Decay Distribution",
        latex: "f(x | \\lambda) = \\lambda e^{-\\lambda x} \\quad \\text{for } x \\ge 0",
        description: "Models wait times or space intervals between independent random Poisson events."
      },
      {
        name: "Student's t-Distribution",
        latex: "f(t) = \\frac{\\Gamma(\\frac{\\nu+1}{2})}{\\sqrt{\\nu\\pi} \\Gamma(\\frac{\\nu}{2})} \\left(1 + \\frac{t^2}{\\nu}\\right)^{-\\frac{\\nu+1}{2}}",
        description: "Symmetric, heavier-tailed distribution used when testing small samples with unknown standard deviation."
      },
      {
        name: "Chi-Square Distribution",
        latex: "f(x | k) = \\frac{1}{2^{k/2} \\Gamma(k/2)} x^{k/2 - 1} e^{-x/2} \\quad \\text{for } x > 0",
        description: "Sum of squares of independent standard normal variables. Drives hypothesis tests of variance."
      },
      {
        name: "Fisher-Snedecor F-Distribution",
        latex: "f(x | d_1, d_2) = \\frac{\\sqrt{\\frac{(d_1 x)^{d_1} d_2^{d_2}}{(d_1 x + d_2)^{d_1 + d_2}}}}{x \\cdot B\\left(\\frac{d_1}{2}, \\frac{d_2}{2}\\right)}",
        description: "Ratio of two independent chi-square variables. Used primarily in ANOVA calculations."
      }
    ]
  },
  {
    title: "Discrete Distributions",
    items: [
      {
        name: "Binomial Distribution",
        latex: "P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}",
        description: "Models independent binary trials (success/failure) with constant probability p across n trials."
      },
      {
        name: "Poisson Distribution",
        latex: "P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}",
        description: "Models rate-based arrivals of events within a fixed space or time interval."
      }
    ]
  }
];

export default function FormulaLibrary() {
  const [searchTerm, setSearchTerm] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const filteredSheets = formulaSheets.map(cat => {
    const items = cat.items.filter(
      item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...cat, items };
  }).filter(cat => cat.items.length > 0);

  return (
    <div className="space-y-8" id="formula-library-view">
      {/* Utilities header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800" id="formula-toolbar">
        {/* Search bar */}
        <div className="relative w-full sm:max-w-xs" id="formula-search-box">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search equations..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950 dark:text-white"
          />
        </div>

        {/* Print button */}
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          id="print-formulas-btn"
        >
          <Printer className="w-4 h-4" />
          Print formulas (PDF)
        </button>
      </div>

      {/* Main reference sheet container */}
      <div className="space-y-8 print:p-8" id="printable-formula-sheet">
        {filteredSheets.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-4" id={`cat-section-${catIdx}`}>
            <h3 className="text-md font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              {cat.title}
            </h3>

            <div className="grid grid-cols-1 gap-6" id={`cat-grid-${catIdx}`}>
              {cat.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow"
                  id={`formula-item-${catIdx}-${itemIdx}`}
                >
                  {/* Left: Text specs */}
                  <div className="md:w-1/2 space-y-2 text-left" id="item-specs">
                    <h4 className="text-md font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>

                  {/* Right: Math equation rendering */}
                  <div className="w-full md:w-1/2 p-4 bg-slate-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800 rounded-xl flex items-center justify-center overflow-x-auto" id="item-latex">
                    <MathTex math={item.latex} block={true} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredSheets.length === 0 && (
          <div className="text-center py-12 text-gray-400" id="empty-search-formulas">
            <HelpCircle className="w-12 h-12 text-gray-300 dark:text-slate-700 mx-auto mb-2 animate-pulse" />
            <p className="text-sm font-bold">No equations matched your query</p>
          </div>
        )}
      </div>
    </div>
  );
}
