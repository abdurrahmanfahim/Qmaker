/**
 * Progressive onboarding tour with interactive hotspots
 */

import React, { useState } from 'react';
import { 
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  PlusIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

const OnboardingTour = ({ isOpen, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Create Your First Paper",
      description: "Fill in basic information like subject, class, and exam details. Don't worry - you can change these later!",
      icon: <DocumentTextIcon className="w-8 h-8" />,
      target: "metadata-panel",
      position: "bottom"
    },
    {
      title: "Add Questions Easily", 
      description: "Click 'Add Sub-Question' to create questions. Use templates for common question types or start from scratch.",
      icon: <PlusIcon className="w-8 h-8" />,
      target: "add-question-btn",
      position: "top"
    },
    {
      title: "Export & Share",
      description: "When you're done, export your paper as PDF. Perfect for printing and sharing with students!",
      icon: <ShareIcon className="w-8 h-8" />,
      target: "export-btn", 
      position: "bottom"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      {/* Overlay with hotspot */}
      <div className="absolute inset-0" onClick={onSkip} />
      
      {/* Tour Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 z-10">
        {/* Close Button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-blue-600' 
                    : index < currentStep 
                    ? 'bg-blue-300' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl mb-4">
            {step.icon}
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            {step.title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Back
          </button>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {currentStep + 1} of {steps.length}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-4">
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Skip tour
          </button>
        </div>
      </div>

      {/* Animated Pointer (for visual guidance) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-ping"></div>
        <div className="absolute top-0 left-0 w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default OnboardingTour;