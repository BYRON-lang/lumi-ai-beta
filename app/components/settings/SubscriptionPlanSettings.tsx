import React, { useState } from 'react';

interface SubscriptionPlanSettingsProps {
  user: any;
  onUpdate: (updatedUser: any) => void;
}

const SubscriptionPlanSettings: React.FC<SubscriptionPlanSettingsProps> = ({ user, onUpdate }) => {
  // Subscription plan state
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [planStatus, setPlanStatus] = useState('active');
  const [renewalDate, setRenewalDate] = useState('2024-02-15');
  const [paymentMethod, setPaymentMethod] = useState('visa-****1234');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
  const [apiUsage, setApiUsage] = useState({ used: 8500, limit: 10000 });
  const [storageUsage, setStorageUsage] = useState({ used: 2.3, limit: 5.0 });

  const handleChangeBilling = () => {
    console.log('Changing billing method');
    // Handle billing method change
  };

  const handleDownloadInvoice = () => {
    console.log('Downloading invoice');
    // Handle invoice download
  };

  const handleCancelSubscription = () => {
    console.log('Cancelling subscription');
    // Handle subscription cancellation
  };

  const getCurrentPlan = () => {
    return {
      name: 'Pro',
      price: '$19',
      period: 'month',
      popular: true
    };
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  return (
    <div>
      {/* Current Plan */}
      <h3 className="text-white text-[13px] font-semibold mb-2">Current Plan</h3>
      <hr className="border-[#303030] mb-4" />
      
      <div className="bg-[#262626] rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-white text-lg font-semibold">{getCurrentPlan().name} Plan</h4>
            <p className="text-[#808080] text-sm">
              {getCurrentPlan().price}/{getCurrentPlan().period}
              {getCurrentPlan().popular && (
                <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">Most Popular</span>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="text-[#808080] text-sm">Status</div>
            <div className={`text-sm font-medium ${
              planStatus === 'active' ? 'text-green-500' : 
              planStatus === 'trial' ? 'text-yellow-500' : 
              'text-red-500'
            }`}>
              {planStatus.charAt(0).toUpperCase() + planStatus.slice(1)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[#808080]">Renewal Date</div>
            <div className="text-white">{renewalDate}</div>
          </div>
          <div>
            <div className="text-[#808080]">Payment Method</div>
            <div className="text-white">{paymentMethod}</div>
          </div>
        </div>
        
        {trialDaysRemaining > 0 && (
          <div className="mt-3 p-2 bg-yellow-600/20 border border-yellow-600/30 rounded text-yellow-300 text-sm">
            Trial expires in {trialDaysRemaining} days
          </div>
        )}
      </div>
      
      {/* Usage Tracking */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Usage Tracking</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* API Usage */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">API Calls</h4>
          <p className="text-[#808080] text-sm">Monthly API call usage</p>
        </div>
        <div className="text-right">
          <div className="text-white text-sm font-medium">
            {apiUsage.used.toLocaleString()} / {apiUsage.limit.toLocaleString()}
          </div>
          <div className="text-[#808080] text-xs">
            {getUsagePercentage(apiUsage.used, apiUsage.limit)}% used
          </div>
        </div>
      </div>
      
      {/* Storage Usage */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Storage</h4>
          <p className="text-[#808080] text-sm">File and data storage usage</p>
        </div>
        <div className="text-right">
          <div className="text-white text-sm font-medium">
            {storageUsage.used}GB / {storageUsage.limit}GB
          </div>
          <div className="text-[#808080] text-xs">
            {getUsagePercentage(storageUsage.used, storageUsage.limit)}% used
          </div>
        </div>
      </div>
      
      
      {/* Plan Management */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Plan Management</h3>
      <hr className="border-[#303030] mb-4" />
      
      <div className="space-y-4">
        {/* Change Billing */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white text-[13px] font-semibold mb-1">Change Billing Method</h4>
            <p className="text-[#808080] text-sm">Update your payment method or billing cycle.</p>
          </div>
          <button
            onClick={handleChangeBilling}
            className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer"
          >
            Change
          </button>
        </div>
        
        {/* Download Invoice */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white text-[13px] font-semibold mb-1">Download Invoice</h4>
            <p className="text-[#808080] text-sm">Download your latest billing invoice.</p>
          </div>
          <button
            onClick={handleDownloadInvoice}
            className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer"
          >
            Download
          </button>
        </div>
        
        {/* Cancel Subscription */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white text-[13px] font-semibold mb-1">Cancel Subscription</h4>
            <p className="text-[#808080] text-sm">Cancel your current subscription plan.</p>
          </div>
          <button
            onClick={handleCancelSubscription}
            className="border border-red-500 text-red-500 px-3 py-1 rounded text-sm hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
      
      {/* Billing Information */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Billing Information</h3>
      <hr className="border-[#303030] mb-4" />
      
      <div className="bg-[#262626] rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[#808080] mb-1">Payment Method</div>
            <div className="text-white">{paymentMethod}</div>
          </div>
          <div>
            <div className="text-[#808080] mb-1">Billing Cycle</div>
            <div className="text-white capitalize">{billingCycle}</div>
          </div>
          <div>
            <div className="text-[#808080] mb-1">Next Billing Date</div>
            <div className="text-white">{renewalDate}</div>
          </div>
          <div>
            <div className="text-[#808080] mb-1">Plan Status</div>
            <div className={`font-medium ${
              planStatus === 'active' ? 'text-green-500' : 
              planStatus === 'trial' ? 'text-yellow-500' : 
              'text-red-500'
            }`}>
              {planStatus.charAt(0).toUpperCase() + planStatus.slice(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlanSettings;
