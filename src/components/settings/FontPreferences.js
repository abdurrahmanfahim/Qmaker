import React from 'react';
import usePaperStore from '../../store/paperStore';

const FontPreferences = () => {
  const { metadata, setMetadata } = usePaperStore();

  const fontOptions = {
    bangla: ['SolaimanLipi', 'Noto Sans Bengali', 'Kalpurush'],
    english: ['Roboto', 'Arial', 'Times New Roman'],
    arabic: ['Scheherazade New', 'Amiri', 'Noto Sans Arabic'],
    urdu: ['Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Alvi Nastaleeq']
  };

  const languages = [
    { code: 'bangla', name: 'বাংলা' },
    { code: 'english', name: 'English' },
    { code: 'arabic', name: 'العربية' },
    { code: 'urdu', name: 'اردو' }
  ];

  const handleFontChange = (language, font) => {
    const updatedFonts = {
      ...metadata.fonts,
      [language]: font
    };
    setMetadata({
      ...metadata,
      fonts: updatedFonts
    });
  };

  const handleOrientationChange = (orientation) => {
    setMetadata({
      ...metadata,
      orientation
    });
  };

  const handlePaperSizeChange = (paperSize) => {
    setMetadata({
      ...metadata,
      paperSize
    });
  };

  const handleFontSizeChange = (fontSize) => {
    setMetadata({
      ...metadata,
      fontSize
    });
  };

  const handleLineSpacingChange = (lineSpacing) => {
    setMetadata({
      ...metadata,
      lineSpacing
    });
  };

  const handleMarginChange = (margins) => {
    setMetadata({
      ...metadata,
      margins
    });
  };

  const handleAutoSaveChange = (autoSave) => {
    setMetadata({
      ...metadata,
      autoSave
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Font Preferences
        </h3>
        <div className="space-y-4">
          {languages.map(lang => (
            <div key={lang.code} className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {lang.name}
              </label>
              <select
                value={metadata.fonts?.[lang.code] || fontOptions[lang.code][0]}
                onChange={(e) => handleFontChange(lang.code, e.target.value)}
                className="w-48 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {fontOptions[lang.code].map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Paper Layout
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Orientation
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="orientation"
                  value="portrait"
                  checked={metadata.orientation === 'portrait'}
                  onChange={(e) => handleOrientationChange(e.target.value)}
                  className="mr-2"
                />
                Portrait
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="orientation"
                  value="landscape"
                  checked={metadata.orientation === 'landscape'}
                  onChange={(e) => handleOrientationChange(e.target.value)}
                  className="mr-2"
                />
                Landscape
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Paper Size
            </label>
            <select
              value={metadata.paperSize || 'A4'}
              onChange={(e) => handlePaperSizeChange(e.target.value)}
              className="w-32 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Typography
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Font Size
            </label>
            <select
              value={metadata.fontSize || '14px'}
              onChange={(e) => handleFontSizeChange(e.target.value)}
              className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Line Spacing
            </label>
            <select
              value={metadata.lineSpacing || '1.5'}
              onChange={(e) => handleLineSpacingChange(e.target.value)}
              className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="1">1.0</option>
              <option value="1.15">1.15</option>
              <option value="1.5">1.5</option>
              <option value="2">2.0</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Page Margins
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Margin Size
            </label>
            <select
              value={metadata.margins || 'normal'}
              onChange={(e) => handleMarginChange(e.target.value)}
              className="w-32 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="narrow">Narrow</option>
              <option value="normal">Normal</option>
              <option value="wide">Wide</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Editor Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto Save
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Automatically save changes
              </p>
            </div>
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              metadata.autoSave !== false ? 'bg-[#09302f] dark:bg-[#4ade80]' : 'bg-gray-200 dark:bg-gray-600'
            }`}>
              <input
                type="checkbox"
                checked={metadata.autoSave !== false}
                onChange={(e) => handleAutoSaveChange(e.target.checked)}
                className="sr-only"
              />
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                metadata.autoSave !== false ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontPreferences;