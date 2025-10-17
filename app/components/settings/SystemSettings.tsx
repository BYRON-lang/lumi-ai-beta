import React from 'react';

interface SystemSettingsProps {
  user: any;
  onUpdate: (updatedUser: any) => void;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ user, onUpdate }) => {
  // Web app version and system information
  const appVersion = '1.0.0';
  const buildNumber = '2024.01.15';
  const lastUpdated = 'January 15, 2024';
  const browserInfo = navigator.userAgent;

  const getBrowserName = () => {
    if (browserInfo.includes('Chrome')) return 'Google Chrome';
    if (browserInfo.includes('Firefox')) return 'Mozilla Firefox';
    if (browserInfo.includes('Safari')) return 'Safari';
    if (browserInfo.includes('Edge')) return 'Microsoft Edge';
    return 'Unknown Browser';
  };

  return (
    <div>
      {/* App Information */}
      <h3 className="text-white text-[13px] font-semibold mb-2">App Information</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* App Version */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Version</h4>
          <p className="text-[#808080] text-sm">Current web application version.</p>
        </div>
        <div className="text-[#808080] text-sm">
          {appVersion}
        </div>
      </div>
      
      {/* Build Number */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Build Number</h4>
          <p className="text-[#808080] text-sm">Internal build identifier.</p>
        </div>
        <div className="text-[#808080] text-sm">
          {buildNumber}
        </div>
      </div>
      
      {/* Last Updated */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Last Updated</h4>
          <p className="text-[#808080] text-sm">Date of the last application update.</p>
        </div>
        <div className="text-[#808080] text-sm">
          {lastUpdated}
        </div>
      </div>
      
      {/* Browser Information */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Browser Information</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Browser Name */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Browser</h4>
          <p className="text-[#808080] text-sm">Your current web browser.</p>
        </div>
        <div className="text-[#808080] text-sm">
          {getBrowserName()}
        </div>
      </div>
      
      {/* User Agent */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">User Agent</h4>
          <p className="text-[#808080] text-sm">Browser identification string.</p>
        </div>
        <div className="text-[#808080] text-sm max-w-xs truncate" title={browserInfo}>
          {browserInfo}
        </div>
      </div>
      
      {/* Screen Resolution */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Screen Resolution</h4>
          <p className="text-[#808080] text-sm">Your display resolution.</p>
        </div>
        <div className="text-[#808080] text-sm">
          {window.screen.width} × {window.screen.height}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
