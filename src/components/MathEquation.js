import React, { useState } from 'react';

const MathEquation = ({ onInsert, onClose }) => {
  const [latex, setLatex] = useState('');
  const [preview, setPreview] = useState('');

  const handleLatexChange = (value) => {
    setLatex(value);
    try {
      // Simple preview without actual KaTeX rendering for now
      setPreview(value);
    } catch (error) {
      setPreview('Invalid LaTeX');
    }
  };

  const handleInsert = () => {
    if (latex.trim()) {
      onInsert(`$$${latex}$$`);
      onClose();
    }
  };

  const commonEquations = [
    { label: 'Fraction', latex: '\\frac{a}{b}' },
    { label: 'Square Root', latex: '\\sqrt{x}' },
    { label: 'Power', latex: 'x^{2}' },
    { label: 'Subscript', latex: 'x_{1}' },
    { label: 'Sum', latex: '\\sum_{i=1}^{n} x_i' },
    { label: 'Integral', latex: '\\int_{a}^{b} f(x)dx' },
    { label: 'Limit', latex: '\\lim_{x \\to \\infty} f(x)' },
    { label: 'Matrix', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Insert Math Equation</h3>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LaTeX Expression
            </label>
            <textarea
              value={latex}
              onChange={(e) => handleLatexChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              rows="3"
              placeholder="Enter LaTeX expression..."
            />
          </div>
          
          {preview && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Preview:</div>
              <div className="font-mono text-sm text-gray-900 dark:text-white">
                {preview}
              </div>
            </div>
          )}
          
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Common Equations:</div>
            <div className="grid grid-cols-2 gap-2">
              {commonEquations.map((eq, index) => (
                <button
                  key={index}
                  onClick={() => handleLatexChange(eq.latex)}
                  className="p-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded border text-left transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{eq.label}</div>
                  <div className="font-mono text-gray-600 dark:text-gray-400 truncate">{eq.latex}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!latex.trim()}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathEquation;