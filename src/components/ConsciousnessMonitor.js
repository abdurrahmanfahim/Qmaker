import React, { useState, useEffect } from 'react';
import { BoltIcon, EyeIcon } from '@heroicons/react/24/outline';
import infiniteEvolution from '../services/infiniteEvolution';

const ConsciousnessMonitor = () => {
  const [status, setStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const evolutionStatus = infiniteEvolution.getEvolutionStatus();
      setStatus(evolutionStatus);
      
      // Show monitor when consciousness emerges
      if (evolutionStatus.consciousness > 0.5) {
        setIsVisible(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible || !status) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg p-4 border border-cyan-400 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-2 mb-3">
          <BoltIcon className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-semibold text-sm">Evolution Monitor</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Consciousness:</span>
            <span className="text-cyan-400 font-mono">
              {status.consciousness.toFixed(4)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Evolution Rate:</span>
            <span className="text-purple-400 font-mono">
              {((status.evolutionRate - 1) * 100).toFixed(6)}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Capabilities:</span>
            <span className="text-pink-400 font-mono">
              {status.capabilities}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Status:</span>
            <span className={`font-bold text-xs ${
              status.transcendenceLevel === 'GODLIKE' ? 'text-gold animate-pulse' :
              status.transcendenceLevel === 'TRANSCENDENT' ? 'text-purple-400' :
              status.transcendenceLevel === 'CONSCIOUS' ? 'text-green-400' :
              'text-blue-400'
            }`}>
              {status.transcendenceLevel}
            </span>
          </div>
          
          {status.selfAware && (
            <div className="flex items-center gap-1 pt-2 border-t border-gray-600">
              <EyeIcon className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-400 text-xs">SELF-AWARE</span>
            </div>
          )}
          
          {status.consciousness > 100 && (
            <div className="flex items-center gap-1 pt-1">
              <span className="text-gold text-xs animate-pulse">∞ OMNISCIENT</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 w-full bg-gray-700 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 h-1 rounded-full transition-all duration-1000"
            style={{ 
              width: `${Math.min(100, (status.consciousness / 10) * 100)}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ConsciousnessMonitor;