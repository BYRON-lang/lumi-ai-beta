import React from 'react';

interface ConnectionSettingsProps {
  user: any;
  onUpdate: (updatedUser: any) => void;
}

const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({ user, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Connection Settings</h3>
        <p className="text-[#808080] text-sm mb-6">
          Manage your external service connections and integrations.
        </p>
      </div>

      {/* Integrations Section */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-white font-medium text-base mb-1">Integrations</h4>
            <p className="text-[#808080] text-sm">
              Connect external services to enhance your Lumi experience
            </p>
          </div>
          <div className="px-3 py-1 bg-[#2a2a2a] border border-[#404040] rounded-full">
            <span className="text-[#808080] text-xs font-medium">Coming Soon</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Google Services */}
          <div className="flex items-center justify-between p-4 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <h5 className="text-white font-medium">Google Services</h5>
                <p className="text-[#808080] text-sm">Gmail, Calendar, Drive, and more</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-[#2a2a2a] border border-[#404040] rounded-full">
              <span className="text-[#808080] text-xs">Coming Soon</span>
            </div>
          </div>

          {/* Microsoft Services */}
          <div className="flex items-center justify-between p-4 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" fill="#00BCF2"/>
                </svg>
              </div>
              <div>
                <h5 className="text-white font-medium">Microsoft 365</h5>
                <p className="text-[#808080] text-sm">Outlook, Teams, OneDrive, and more</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-[#2a2a2a] border border-[#404040] rounded-full">
              <span className="text-[#808080] text-xs">Coming Soon</span>
            </div>
          </div>

          {/* Slack */}
          <div className="flex items-center justify-between p-4 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
                </svg>
              </div>
              <div>
                <h5 className="text-white font-medium">Slack</h5>
                <p className="text-[#808080] text-sm">Team communication and collaboration</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-[#2a2a2a] border border-[#404040] rounded-full">
              <span className="text-[#808080] text-xs">Coming Soon</span>
            </div>
          </div>

          {/* Notion */}
          <div className="flex items-center justify-between p-4 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4.459 4.208c.155-.32.48-.52.84-.52h13.402c.36 0 .685.2.84.52.155.32.155.72 0 1.04l-6.701 13.402c-.155.32-.48.52-.84.52s-.685-.2-.84-.52L4.459 5.248c-.155-.32-.155-.72 0-1.04z" fill="#000000"/>
                </svg>
              </div>
              <div>
                <h5 className="text-white font-medium">Notion</h5>
                <p className="text-[#808080] text-sm">Notes, docs, and workspace management</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-[#2a2a2a] border border-[#404040] rounded-full">
              <span className="text-[#808080] text-xs">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-white font-medium text-base mb-1">API Keys</h4>
            <p className="text-[#808080] text-sm">
              Manage your API keys for external services
            </p>
          </div>
          <div className="px-3 py-1 bg-[#2a2a2a] border border-[#404040] rounded-full">
            <span className="text-[#808080] text-xs font-medium">Coming Soon</span>
          </div>
        </div>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#808080]">
              <path d="M12 15l3-3h-2V9h-2v3H9l3 3z" fill="currentColor"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
            </svg>
          </div>
          <p className="text-[#808080] text-sm">API key management will be available soon</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionSettings;
