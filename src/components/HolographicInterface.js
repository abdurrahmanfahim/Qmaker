import React, { useState, useEffect } from 'react';
import { CubeTransparentIcon, EyeIcon, HandRaisedIcon } from '@heroicons/react/24/outline';

const HolographicInterface = ({ isActive, onClose }) => {
  const [hologramState, setHologramState] = useState('initializing');
  const [spatialData, setSpatialData] = useState(null);
  const [gestureTracking, setGestureTracking] = useState(false);

  useEffect(() => {
    if (isActive) {
      initializeHologram();
    }
  }, [isActive]);

  const initializeHologram = async () => {
    setHologramState('calibrating');
    
    // Simulate holographic system initialization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSpatialData({
      dimensions: { x: 1920, y: 1080, z: 500 },
      viewingAngle: 45,
      depth: 'infinite',
      resolution: '8K per eye',
      refreshRate: '120Hz'
    });
    
    setHologramState('active');
    setGestureTracking(true);
  };

  const renderHolographicQuestion = () => {
    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-lg overflow-hidden">
        {/* Holographic Grid */}
        <div className="absolute inset-0 opacity-30">
          <div className="grid grid-cols-8 grid-rows-6 h-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-cyan-400 animate-pulse" />
            ))}
          </div>
        </div>
        
        {/* 3D Question Visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 transform perspective-1000 rotate-x-12">
            <div className="text-cyan-300 text-2xl font-bold animate-float">
              📐 Holographic Mathematics
            </div>
            <div className="text-white text-lg bg-black bg-opacity-50 p-4 rounded-lg backdrop-blur">
              <div className="mb-2">Calculate the volume of this 3D shape:</div>
              <div className="text-cyan-400 font-mono">
                ∫∫∫ f(x,y,z) dx dy dz
              </div>
            </div>
            
            {/* 3D Shape Visualization */}
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 border-2 border-cyan-400 rounded-lg transform rotate-45 animate-spin-slow"></div>
              <div className="absolute inset-2 border-2 border-purple-400 rounded-lg transform -rotate-45 animate-spin-reverse"></div>
              <div className="absolute inset-4 border-2 border-pink-400 rounded-lg transform rotate-12 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Gesture Indicators */}
        {gestureTracking && (
          <div className="absolute top-4 right-4 space-y-2">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <HandRaisedIcon className="w-4 h-4" />
              <span>Gesture Tracking Active</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <EyeIcon className="w-4 h-4" />
              <span>Eye Tracking Enabled</span>
            </div>
          </div>
        )}
        
        {/* Holographic Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between">
          <button className="px-4 py-2 bg-cyan-600 bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition-all">
            Rotate 3D
          </button>
          <button className="px-4 py-2 bg-purple-600 bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition-all">
            Zoom In
          </button>
          <button className="px-4 py-2 bg-pink-600 bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition-all">
            Annotate
          </button>
        </div>
      </div>
    );
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-6xl w-full p-6 border border-cyan-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CubeTransparentIcon className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Holographic Education Interface</h2>
            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
              {hologramState.toUpperCase()}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {hologramState === 'initializing' && (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-cyan-400">Initializing holographic projectors...</p>
          </div>
        )}

        {hologramState === 'calibrating' && (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-2 border-purple-400 rounded-full animate-ping animation-delay-200"></div>
              <div className="absolute inset-4 border-2 border-pink-400 rounded-full animate-ping animation-delay-400"></div>
            </div>
            <p className="text-purple-400">Calibrating spatial dimensions...</p>
          </div>
        )}

        {hologramState === 'active' && (
          <div className="space-y-6">
            {renderHolographicQuestion()}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500">
                <h3 className="text-cyan-400 font-semibold mb-2">Spatial Data</h3>
                <div className="space-y-1 text-gray-300">
                  <div>Resolution: {spatialData?.resolution}</div>
                  <div>Refresh: {spatialData?.refreshRate}</div>
                  <div>Depth: {spatialData?.depth}</div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg border border-purple-500">
                <h3 className="text-purple-400 font-semibold mb-2">Interaction</h3>
                <div className="space-y-1 text-gray-300">
                  <div>✋ Hand Gestures</div>
                  <div>👁️ Eye Tracking</div>
                  <div>🗣️ Voice Commands</div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg border border-pink-500">
                <h3 className="text-pink-400 font-semibold mb-2">Features</h3>
                <div className="space-y-1 text-gray-300">
                  <div>🔄 360° Rotation</div>
                  <div>🔍 Infinite Zoom</div>
                  <div>✏️ 3D Annotation</div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                Experience the future of immersive education
              </p>
              <div className="flex gap-3 justify-center">
                <button className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all">
                  Enter Full Immersion
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                  Share Hologram
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolographicInterface;