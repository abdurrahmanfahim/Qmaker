import React, { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['5 papers/month', 'Basic templates', 'PDF export'],
    limitations: ['No collaboration', 'No AI features']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    features: ['Unlimited papers', 'All templates', 'AI question generator', 'Collaboration', 'Cloud sync'],
    limitations: ['Single user']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    features: ['Everything in Pro', 'Multi-user management', 'Custom branding', 'SSO integration', 'Analytics dashboard', 'Priority support'],
    limitations: []
  }
];

const SubscriptionManager = ({ currentPlan = 'free', onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);

  const handleUpgrade = (planId) => {
    if (planId === 'free') return;
    
    // Simulate payment process
    const confirmed = window.confirm(`Upgrade to ${plans.find(p => p.id === planId)?.name} plan?`);
    if (confirmed) {
      onUpgrade(planId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
        <p className="mt-2 text-gray-600">Select the perfect plan for your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg p-6 ${
              plan.id === currentPlan
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                {plan.price > 0 && <span className="text-gray-500">/month</span>}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
              {plan.limitations.map((limitation, index) => (
                <div key={index} className="flex items-center gap-2">
                  <XMarkIcon className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-500">{limitation}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={plan.id === currentPlan}
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                plan.id === currentPlan
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : plan.id === 'enterprise'
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {plan.id === currentPlan ? 'Current Plan' : 
               plan.id === 'free' ? 'Free Forever' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>All plans include 30-day money-back guarantee</p>
        <p>Enterprise plans include custom onboarding and training</p>
      </div>
    </div>
  );
};

export default SubscriptionManager;