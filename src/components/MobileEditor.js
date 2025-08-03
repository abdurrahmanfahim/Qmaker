import React, { useState, useRef, useEffect } from 'react';
import { 
  BoldIcon, 
  ItalicIcon, 
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  MicrophoneIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';

const MobileEditor = ({ content, onChange, placeholder = "Type your question..." }) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const editorRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Detect virtual keyboard
    const handleResize = () => {
      const heightDiff = window.innerHeight - document.documentElement.clientHeight;
      setIsKeyboardVisible(heightDiff > 150);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        if (editorRef.current) {
          const sanitizedTranscript = transcript.replace(/[<>"'&]/g, (match) => {
            const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
            return entities[match];
          });
          const currentContent = editorRef.current.innerHTML;
          editorRef.current.innerHTML = currentContent + sanitizedTranscript;
          onChange(editorRef.current.innerHTML);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onChange]);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    onChange(editorRef.current.innerHTML);
  };

  const insertTable = () => {
    const table = `
      <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;">Cell 1</td>
          <td style="border: 1px solid #ccc; padding: 8px;">Cell 2</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;">Cell 3</td>
          <td style="border: 1px solid #ccc; padding: 8px;">Cell 4</td>
        </tr>
      </table>
    `;
    
    document.execCommand('insertHTML', false, table);
    onChange(editorRef.current.innerHTML);
  };

  const startVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toolbarButtons = [
    { icon: BoldIcon, command: 'bold', label: 'Bold' },
    { icon: ItalicIcon, command: 'italic', label: 'Italic' },
    { icon: UnderlineIcon, command: 'underline', label: 'Underline' },
    { icon: ListBulletIcon, command: 'insertUnorderedList', label: 'Bullet List' },
    { icon: NumberedListIcon, command: 'insertOrderedList', label: 'Numbered List' },
    { icon: TableCellsIcon, command: 'table', label: 'Insert Table', onClick: insertTable }
  ];

  return (
    <div className="relative">
      {/* Mobile Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[120px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base leading-relaxed"
        style={{ fontSize: '16px' }} // Prevent zoom on iOS
        onInput={(e) => onChange(e.target.innerHTML)}
        onFocus={() => setShowToolbar(true)}
        onBlur={() => setTimeout(() => setShowToolbar(false), 200)}
        dangerouslySetInnerHTML={{ __html: content }}
        data-placeholder={placeholder}
      />

      {/* Floating Toolbar */}
      {(showToolbar || isKeyboardVisible) && (
        <div className={`fixed left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 transition-all duration-200 ${
          isKeyboardVisible ? 'bottom-0' : 'bottom-16'
        }`}>
          <div className="flex items-center justify-between p-2 overflow-x-auto">
            <div className="flex items-center gap-1">
              {toolbarButtons.map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick || (() => formatText(button.command))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors min-w-[44px] flex items-center justify-center"
                  title={button.label}
                >
                  <button.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              ))}
            </div>
            
            {/* Voice Input */}
            {'webkitSpeechRecognition' in window && (
              <button
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={`p-2 rounded-lg transition-colors min-w-[44px] flex items-center justify-center ${
                  isListening 
                    ? 'bg-red-100 text-red-600 animate-pulse' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                title={isListening ? 'Stop Recording' : 'Voice Input'}
              >
                <MicrophoneIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Voice Input Indicator */}
      {isListening && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-2 rounded-full z-50 flex items-center gap-2">
          <MicrophoneIcon className="w-4 h-4 animate-pulse" />
          <span className="text-sm">Listening...</span>
        </div>
      )}
    </div>
  );
};

export default MobileEditor;