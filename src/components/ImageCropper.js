import React, { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropper = ({ imageSrc, onCrop, onCancel }) => {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);


  const getCroppedImg = (image, crop, fileName) => {
    if (!image || !crop.width || !crop.height) return null;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = 200;
    canvas.height = 200;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      200,
      200
    );

    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const handleCropComplete = () => {
    if (completedCrop && imgRef.current && completedCrop.width && completedCrop.height) {
      const croppedImage = getCroppedImg(imgRef.current, completedCrop);
      if (croppedImage) {
        onCrop(croppedImage);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-3xl w-full shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#09302f] to-[#072625] dark:from-[#4ade80] dark:to-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Crop Your Photo</h3>
          <p className="text-gray-600 dark:text-gray-400">Drag the corners to resize • Drag the center to reposition</p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 shadow-inner">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop
              className="max-w-full max-h-80 rounded-xl overflow-hidden"
            >
              <img
                ref={imgRef}
                alt="Crop preview"
                src={imageSrc}
                onLoad={(e) => {
                  imgRef.current = e.target;
                }}
                className="max-w-full max-h-80 rounded-xl shadow-lg"
              />
            </ReactCrop>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-3 font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            <XMarkIcon className="w-5 h-5" />
            Cancel
          </button>
          <button
            onClick={handleCropComplete}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-[#09302f] to-[#072625] dark:from-[#4ade80] dark:to-[#22c55e] text-white dark:text-gray-900 rounded-2xl hover:from-[#072625] hover:to-[#051f1e] dark:hover:from-[#22c55e] dark:hover:to-[#16a34a] flex items-center justify-center gap-3 font-semibold transition-all duration-200 hover:scale-[1.02] shadow-xl hover:shadow-2xl"
          >
            <CheckIcon className="w-5 h-5" />
            Save Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;