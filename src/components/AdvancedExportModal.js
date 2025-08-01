import React, { useState } from 'react';
import { 
  DocumentArrowDownIcon,
  ShareIcon,
  QrCodeIcon,
  CloudArrowUpIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const AdvancedExportModal = ({ onClose, paperData }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeAnswers: false,
    includeMarks: true,
    customBranding: false,
    batchExport: false
  });
  const [qrCode, setQrCode] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { id: 'pdf', name: 'PDF Document', icon: '📄', description: 'Print-ready format' },
    { id: 'word', name: 'Word Document', icon: '📝', description: 'Editable format' },
    { id: 'html', name: 'Web Page', icon: '🌐', description: 'Online sharing' },
    { id: 'json', name: 'JSON Data', icon: '💾', description: 'Backup format' }
  ];

  const cloudServices = [
    { id: 'drive', name: 'Google Drive', icon: '☁️' },
    { id: 'dropbox', name: 'Dropbox', icon: '📦' },
    { id: 'onedrive', name: 'OneDrive', icon: '🔷' }
  ];

  const messagingApps = [
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
    { id: 'telegram', name: 'Telegram', icon: '✈️' },
    { id: 'email', name: 'Email', icon: '📧' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (selectedFormat === 'pdf') {
        // Generate PDF
        const element = document.createElement('a');
        element.href = 'data:application/pdf;base64,sample-pdf-data';
        element.download = `${paperData.subject || 'question-paper'}.pdf`;
        element.click();
      }
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateQRCode = () => {
    // Simulate QR code generation
    const paperUrl = `${window.location.origin}/paper/${paperData.id}`;
    setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paperUrl)}`);
  };

  const shareToApp = (appId) => {
    const text = `Check out this question paper: ${paperData.subject}`;
    const url = `${window.location.origin}/paper/${paperData.id}`;
    
    switch (appId) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`);
        break;
    }
  };

  const uploadToCloud = (serviceId) => {
    // Simulate cloud upload
    alert(`Uploading to ${serviceId}... (Feature coming soon)`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white dark:bg-gray-800 w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-2xl sm:rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <DocumentArrowDownIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Advanced Export</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Export Format */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Export Format</h4>
            <div className="grid grid-cols-2 gap-3">
              {exportFormats.map(format => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedFormat === format.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{format.icon}</span>
                    <div>
                      <div className="font-medium text-sm text-gray-900 dark:text-white">
                        {format.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Options</h4>
            <div className="space-y-3">
              {Object.entries({
                includeAnswers: 'Include Answer Key',
                includeMarks: 'Show Marks',
                customBranding: 'Custom Branding',
                batchExport: 'Batch Export Multiple Papers'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={exportOptions[key]}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cloud Storage */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <CloudArrowUpIcon className="w-4 h-4" />
              Save to Cloud
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {cloudServices.map(service => (
                <button
                  key={service.id}
                  onClick={() => uploadToCloud(service.id)}
                  className="p-3 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="text-2xl mb-1">{service.icon}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{service.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Sharing */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <DevicePhoneMobileIcon className="w-4 h-4" />
              Share Directly
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {messagingApps.map(app => (
                <button
                  key={app.id}
                  onClick={() => shareToApp(app.id)}
                  className="p-3 text-center border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="text-2xl mb-1">{app.icon}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{app.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <QrCodeIcon className="w-4 h-4" />
              QR Code
            </h4>
            <div className="flex items-center gap-4">
              <button
                onClick={generateQRCode}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Generate QR Code
              </button>
              {qrCode && (
                <img src={qrCode} alt="QR Code" className="w-16 h-16 border rounded" />
              )}
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
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <DocumentArrowDownIcon className="w-4 h-4" />
                Export {selectedFormat.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedExportModal;