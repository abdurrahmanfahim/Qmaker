import React, { useState } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    title: "Welcome to Qmaker",
    content: "Create professional question papers in multiple languages",
    target: null
  },
  {
    title: "Paper Information",
    content: "Start by filling in your exam details",
    target: "[data-tutorial='metadata']"
  },
  {
    title: "Add Sections",
    content: "Organize questions into sections",
    target: "[data-tutorial='add-section']"
  },
  {
    title: "Create Questions",
    content: "Add sub-questions with rich text editing",
    target: "[data-tutorial='add-question']"
  },
  {
    title: "Preview & Export",
    content: "Preview your paper and export to PDF",
    target: "[data-tutorial='preview']"
  }
];

const OnboardingTutorial = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {steps[currentStep].title}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {steps[currentStep].content}
        </p>
        
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </button>
          
          <span className="text-sm text-gray-500">
            {currentStep + 1} of {steps.length}
          </span>
          
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            {currentStep < steps.length - 1 && <ChevronRightIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;