import React, { useState } from 'react';

interface UpgradeToPremiumSettingsProps {
  user: any;
  onUpdate: (updatedUser: any) => void;
}

const UpgradeToPremiumSettings: React.FC<UpgradeToPremiumSettingsProps> = ({ user, onUpdate }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '50 messages per day',
        'Basic AI responses',
        'Community support',
        '1GB storage',
        'Basic features'
      ],
      popular: false,
      current: true
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        'Unlimited messages',
        'Advanced AI responses',
        'Priority support',
        '10GB storage',
        'API access'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Everything in Pro',
        'Unlimited storage',
        'Dedicated support',
        'Team management',
        'Custom integrations'
      ],
      popular: false
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleBillingCycleChange = (cycle: string) => {
    setBillingCycle(cycle);
  };

  const handleUpgrade = () => {
    console.log(`Upgrading to ${selectedPlan} plan (${billingCycle})`);
    // Handle upgrade logic
  };

  const getSelectedPlan = () => {
    return plans.find(plan => plan.id === selectedPlan) || plans[0];
  };

  const getPrice = (plan: any) => {
    return billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: any) => {
    if (billingCycle === 'yearly') {
      const monthlyTotal = plan.monthlyPrice * 12;
      const savings = monthlyTotal - plan.yearlyPrice;
      return Math.round((savings / monthlyTotal) * 100);
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-[#333] rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-white text-xl font-semibold mb-2">Upgrade to Premium</h2>
        <p className="text-[#808080] text-sm">Unlock advanced features and unlimited access</p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="bg-[#333] rounded-lg p-1 flex">
          <button
            onClick={() => handleBillingCycleChange('monthly')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-[#262626] text-white'
                : 'text-[#808080] hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => handleBillingCycleChange('yearly')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-[#262626] text-white'
                : 'text-[#808080] hover:text-white'
            }`}
          >
            Yearly
            {billingCycle === 'yearly' && (
              <span className="ml-1 bg-[#333] text-white text-xs px-1 py-0.5 rounded">
                Save {getSavings(getSelectedPlan())}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-[#262626] rounded-xl p-5 border cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? 'border-[#808080] bg-[#2a2a2a]'
                : 'border-[#333] hover:border-[#444]'
            }`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  plan.popular ? 'bg-[#333]' : 'bg-[#333]'
                }`}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white text-lg font-semibold">{plan.name}</h3>
                  <div className="flex space-x-2">
                    {plan.popular && (
                      <span className="bg-[#333] text-white text-xs px-2 py-1 rounded">
                        Popular
                      </span>
                    )}
                    {plan.current && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-white text-2xl font-bold">
                  {plan.monthlyPrice === 0 ? 'Free' : `$${getPrice(plan)}`}
                </span>
                {plan.monthlyPrice > 0 && (
                  <span className="text-[#808080] text-sm ml-1">
                    /{billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                )}
              </div>
              {billingCycle === 'yearly' && plan.monthlyPrice > 0 && (
                <div className="text-[#808080] text-xs mt-1">
                  Save ${(plan.monthlyPrice * 12) - plan.yearlyPrice}/year
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm">
                  <svg className="w-3 h-3 text-[#808080] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#e0e0e0]">{feature}</span>
                </div>
              ))}
            </div>

            <div className={`w-full py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors ${
              selectedPlan === plan.id
                ? 'bg-[#333] text-white'
                : 'bg-[#333] text-[#808080]'
            }`}>
              {selectedPlan === plan.id 
                ? (plan.current ? 'Current Plan' : 'Selected') 
                : (plan.current ? 'Downgrade' : 'Select')
              }
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Button */}
      <div className="text-center">
        {getSelectedPlan().monthlyPrice === 0 ? (
          <div>
            <div className="bg-[#333] text-white px-8 py-3 rounded-lg text-sm font-semibold inline-block">
              You're on the Free plan
            </div>
            <p className="text-[#808080] text-xs mt-3">
              Upgrade to unlock more features and unlimited access
            </p>
          </div>
        ) : (
          <div>
            <button
              onClick={handleUpgrade}
              className="bg-[#333] hover:bg-[#444] text-white px-8 py-3 rounded-lg text-sm font-semibold transition-colors"
            >
              Upgrade to {getSelectedPlan().name} - ${getPrice(getSelectedPlan())}
              {billingCycle === 'yearly' ? '/year' : '/month'}
            </button>
            <p className="text-[#808080] text-xs mt-3">
              Cancel anytime. No hidden fees.
            </p>
          </div>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="flex justify-center items-center space-x-6 text-[#808080] text-xs">
        <div className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure
        </div>
        <div className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          30-Day Refund
        </div>
        <div className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Instant Access
        </div>
      </div>
    </div>
  );
};

export default UpgradeToPremiumSettings;
