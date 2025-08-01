import React, { useState } from 'react';
import { PlusIcon, MinusIcon, TableCellsIcon } from '@heroicons/react/24/outline';

const MobileTableEditor = ({ onInsertTable, onClose }) => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [tableStyle, setTableStyle] = useState('simple');

  const tableStyles = {
    simple: {
      name: 'Simple',
      style: 'border-collapse: collapse; width: 100%; border: 1px solid #ccc;',
      cellStyle: 'border: 1px solid #ccc; padding: 8px; text-align: left;'
    },
    modern: {
      name: 'Modern',
      style: 'border-collapse: collapse; width: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);',
      cellStyle: 'border: 1px solid #e5e7eb; padding: 12px; text-align: left; background: white;'
    },
    minimal: {
      name: 'Minimal',
      style: 'border-collapse: collapse; width: 100%;',
      cellStyle: 'border-bottom: 1px solid #e5e7eb; padding: 12px; text-align: left;'
    }
  };

  const generateTable = () => {
    const style = tableStyles[tableStyle];
    let tableHTML = `<table style="${style.style}">`;
    
    for (let i = 0; i < rows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < cols; j++) {
        const cellContent = i === 0 ? `Header ${j + 1}` : `Cell ${i}-${j + 1}`;
        tableHTML += `<td style="${style.cellStyle}">${cellContent}</td>`;
      }
      tableHTML += '</tr>';
    }
    
    tableHTML += '</table>';
    return tableHTML;
  };

  const handleInsert = () => {
    onInsertTable(generateTable());
    onClose();
  };

  const adjustValue = (current, delta, min, max) => {
    return Math.min(Math.max(current + delta, min), max);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white dark:bg-gray-800 w-full sm:w-96 sm:rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <TableCellsIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Insert Table</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Size Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rows
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRows(adjustValue(rows, -1, 1, 10))}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  disabled={rows <= 1}
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{rows}</span>
                <button
                  onClick={() => setRows(adjustValue(rows, 1, 1, 10))}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  disabled={rows >= 10}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Columns
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCols(adjustValue(cols, -1, 1, 6))}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  disabled={cols <= 1}
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{cols}</span>
                <button
                  onClick={() => setCols(adjustValue(cols, 1, 1, 6))}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  disabled={cols >= 6}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Table Style
            </label>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(tableStyles).map(([key, style]) => (
                <button
                  key={key}
                  onClick={() => setTableStyle(key)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    tableStyle === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-white">
                    {style.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview
            </label>
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 overflow-auto">
              <div 
                className="text-xs"
                dangerouslySetInnerHTML={{ __html: generateTable() }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Insert Table
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileTableEditor;