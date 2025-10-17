import { useAuth } from '../contexts/AuthContext';
import ProfileSettings from './settings/ProfileSettings';
import PreferencesSettings from './settings/PreferencesSettings';
import NotificationSettings from './settings/NotificationSettings';
import AIModelsSettings from './settings/AIModelsSettings';
import PersonalAssistantSettings from './settings/PersonalAssistantSettings';
import PrivacyDataSettings from './settings/PrivacyDataSettings';
import SystemSettings from './settings/SystemSettings';
import SubscriptionPlanSettings from './settings/SubscriptionPlanSettings';
import UpgradeToPremiumSettings from './settings/UpgradeToPremiumSettings';
import BackupSettings from './settings/BackupSettings';
import ConnectionSettings from './settings/ConnectionSettings';
import { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('profile');
  
  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with proper styling */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-[#202020] border border-[#262626] rounded-lg w-[1200px] h-[720px] flex flex-row shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Sidebar Nav */}
        <div className="w-[240px] overflow-auto">
          <div className="p-3">
            <h2 className="text-[#808080] text-[13px] font-medium mb-2">Accounts</h2>
            
            {/* Avatar and Name */}
            <div 
              className={`flex items-center space-x-3 mb-1 hover:bg-[#2a2a2a] hover:text-gray-200 cursor-pointer rounded transition-colors w-full px-2 py-1 ${activeTab === 'profile' ? 'bg-[#2a2a2a]' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-cover border border-gray-600"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#191919] flex items-center justify-center text-[#808080] font-medium text-sm">
                  {user?.fullName 
                    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                    : user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <span className="text-white font-medium text-sm">
                {user?.fullName || user?.email || 'User Name'}
              </span>
            </div>
            
            {/* Preferences Tab */}
            <div className={`flex items-center space-x-4 ml-1 mb-1 hover:bg-[#2a2a2a] hover:text-gray-200 cursor-pointer rounded transition-colors w-full px-2 py-1 ${activeTab === 'preferences' ? 'bg-[#2a2a2a]' : ''}`}
              onClick={() => setActiveTab('preferences')}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24"
                className="text-white flex-shrink-0"
              >
                <path 
                  fill="none" 
                  stroke="currentColor" 
                  strokeLinecap="round" 
                  strokeMiterlimit="10" 
                  strokeWidth="1.5" 
                  d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"
                />
              </svg>
              <span className="text-white font-medium text-sm">Preferences</span>
            </div>
            
            {/* Notifications Tab */}
            <div className={`flex items-center space-x-4 ml-1 mb-8 hover:bg-[#2a2a2a] hover:text-gray-200 cursor-pointer rounded transition-colors w-full px-2 py-1 ${activeTab === 'notifications' ? 'bg-[#2a2a2a]' : ''}`}
              onClick={() => setActiveTab('notifications')}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24"
                className="text-white flex-shrink-0"
              >
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                  <path d="M2.53 14.77c-.213 1.394.738 2.361 1.902 2.843c4.463 1.85 10.673 1.85 15.136 0c1.164-.482 2.115-1.45 1.902-2.843c-.13-.857-.777-1.57-1.256-2.267c-.627-.924-.689-1.931-.69-3.003C19.525 5.358 16.157 2 12 2S4.475 5.358 4.475 9.5c0 1.072-.062 2.08-.69 3.003c-.478.697-1.124 1.41-1.255 2.267"/>
                  <path d="M8 19c.458 1.725 2.076 3 4 3c1.925 0 3.541-1.275 4-3"/>
                </g>
              </svg>
              <span className="text-white font-medium text-sm">Notifications</span>
            </div>
            
            {/* AI & Personalization Section */}
            <h2 className="text-[#808080] text-[13px] font-medium mb-2">AI & Personalization</h2>
            
            {/* AI & Models Tab */}
            <div className={`flex items-center space-x-4 ml-1 mb-1 hover:bg-[#2a2a2a] hover:text-gray-200 cursor-pointer rounded transition-colors w-full px-2 py-1 ${activeTab === 'ai-models' ? 'bg-[#2a2a2a]' : ''}`}
              onClick={() => setActiveTab('ai-models')}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24"
                className="text-white flex-shrink-0"
              >
                <path 
                  fill="none" 
                  d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.10l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.10-.008l.003-.011l.018-.43l-.003-.012l-.10-.10z"
                />
                <path 
                  fill="currentColor" 
                  d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"
                />
              </svg>
              <span className="text-white font-medium text-sm">AI & Models</span>
            </div>
            
            {/* Personal Assistant Tab */}
            <div className={`flex items-center space-x-4 ml-1 mb-1 hover:bg-[#2a2a2a] hover:text-gray-200 cursor-pointer rounded transition-colors w-full px-2 py-1 ${activeTab === 'personal-assistant' ? 'bg-[#2a2a2a]' : ''}`}
              onClick={() => setActiveTab('personal-assistant')}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24"
                className="text-white flex-shrink-0"
              >
                <path 
                  fill="currentColor" 
                  d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3l3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 16h-4.83l-.59.59L12 20.17l-1.59-1.59l-.58-.58H5V4h14v14zm-7-1l1.88-4.12L18 11l-4.12-1.88L12 5l-1.88 4.12L6 11l4.12 1.88z"
                />
              </svg>
              <span className="text-white font-medium text-sm">Personal Assistant</span>
            </div>
            
            {/* Privacy & Data Tab */}
            <div className={`flex items-center space-x-4 ml-1 mb-4 hover:bg-[#2a2a2a] hover:text-gray-200 cursor-pointer rounded transition-colors w-full px-2 py-1 ${activeTab === 'privacy-data' ? 'bg-[#2a2a2a]' : ''}`}
              onClick={() => setActiveTab('privacy-data')}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24"
                className="text-white flex-shrink-0"
              >
                <path 
                  fill="currentColor" 
                  d="M17 17q.625 0 1.063-.438T18.5 15.5q0-.625-.438-1.063T17 14q-.625 0-1.063.438T15.5 15.5q0 .625.438 1.063T17 17Zm0 3q.794 0 1.435-.353q.64-.353 1.06-.953q-.57-.344-1.195-.519Q17.675 18 17 18t-1.3.175q-.625.175-1.194.52q.419.6 1.06.952Q16.205 20 17 20Zm-5 .962q-3.013-.895-5.007-3.651Q5 14.554 5 11.1V5.692l7-2.615l7 2.615v5.656q-.225-.085-.494-.15q-.27-.067-.506-.123V6.381L12 4.15L6 6.38v4.72q0 1.483.438 2.84q.437 1.358 1.192 2.498q.755 1.139 1.785 1.99t2.198 1.299l.058-.02q.121.3.302.583q.18.283.41.531q-.102.039-.192.07t-.191.07ZM17 21q-1.671 0-2.836-1.164T13 17q0-1.671 1.164-2.836T17 13q1.671 0 2.836 1.164T21 17q0 1.671-1.164 2.836T17 21Zm-5-9.062Z"
                />
              </svg>
              <span className="text-white font-medium text-sm">Privacy & Data</span>
            </div>
            
            {/* Divider */}
            <hr className="border-[#303030] my-2" />
            
            {/* Connection Tab */}
            <div className={`flex items-center space-x-4 ml-1 mb-1 hover:bg-[#2a2a2a] hover:text-gray-200 cursor-pointer rounded transition-colors w-full px-2 py-1 ${activeTab === 'connection' ? 'bg-[#2a2a2a]' : ''}`}
              onClick={() => setActiveTab('connection')}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24"
                className="text-white flex-shrink-0"
              >
                <path 
                  fill="none" 
                  stroke="currentColor" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 4h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Zm10 6h-4m0 0v4m0-4l4 4"
                />
              </svg>
              <span className="text-white font-medium text-sm">Connection</span>
            </div>
            
            {/* Backup Tab */}
            <div className={`flex items-center space-x-4 ml-1 mb-1 hover:bg-[#2a2a2a] hover:text-gray-200 cursor-pointer rounded transition-colors w-full px-2 py-1 ${activeTab === 'backup' ? 'bg-[#2a2a2a]' : ''}`}
              onClick={() => setActiveTab('backup')}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 256 256"
                className="text-white flex-shrink-0"
              >
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
                  <path d="M 239.98507,55.993592 A 111.98507,39.994664 0 0 1 128,95.988256 111.98507,39.994664 0 0 1 16.01493,55.993592 111.98507,39.994664 0 0 1 128,15.998927 111.98507,39.994664 0 0 1 239.98507,55.993592 Z"/>
                  <path d="m 239.98507,199.97441 a 111.98507,39.994664 0 0 1 -55.99253,34.63639 111.98507,39.994664 0 0 1 -111.985079,0 111.98507,39.994664 0 0 1 -55.992531,-34.6364"/>
                  <path d="m 239.98507,151.9808 a 111.98507,39.994664 0 0 1 -55.99253,34.6364 111.98507,39.994664 0 0 1 -111.985079,-1e-5 A 111.98507,39.994664 0 0 1 16.01493,151.9808"/>
                  <path d="m 239.98507,103.9872 a 111.98507,39.994664 0 0 1 -55.99253,34.6364 111.98507,39.994664 0 0 1 -111.985079,0 111.98507,39.994664 0 0 1 -55.992531,-34.6364"/>
                  <path d="M 16.01493,55.99377 V 199.97441"/>
                  <path d="M 239.98507,55.993592 V 199.97441"/>
                </g>
              </svg>
              <span className="text-white font-medium text-sm">Backup</span>
            </div>
            
            {/* Subscription Plan Tab */}
            <div className={`flex items-center space-x-4 ml-1 mb-1 hover:bg-[#2a2a2a] hover:text-gray-200 cursor-pointer rounded transition-colors w-full px-2 py-1 ${activeTab === 'subscription-plan' ? 'bg-[#2a2a2a]' : ''}`}
              onClick={() => setActiveTab('subscription-plan')}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 256 256"
                className="text-white flex-shrink-0"
              >
                <path 
                  fill="currentColor" 
                  d="M224 48H32a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16Zm0 16v24H32V64Zm0 128H32v-88h192v88Zm-16-24a8 8 0 0 1-8 8h-32a8 8 0 0 1 0-16h32a8 8 0 0 1 8 8Zm-64 0a8 8 0 0 1-8 8h-16a8 8 0 0 1 0-16h16a8 8 0 0 1 8 8Z"
                />
              </svg>
              <span className="text-white font-medium text-sm">Subscription Plan</span>
            </div>
            
            {/* System Tab */}
            <div className={`flex items-center space-x-4 ml-1 mb-1 hover:bg-[#2a2a2a] hover:text-gray-200 cursor-pointer rounded transition-colors w-full px-2 py-1 ${activeTab === 'system' ? 'bg-[#2a2a2a]' : ''}`}
              onClick={() => setActiveTab('system')}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24"
                className="text-white flex-shrink-0"
              >
                <path 
                  fill="currentColor" 
                  d="M1 1h22v17H1V1Zm2 2v13h18V3H3Zm7.406 3.844L8.28 9.5l2.125 2.656l-1.562 1.25L5.719 9.5l3.125-3.906l1.562 1.25Zm4.75-1.25L18.281 9.5l-3.125 3.906l-1.562-1.25L15.72 9.5l-2.125-2.656l1.562-1.25ZM3.222 21h17.556v2H3.222v-2Z"
                />
              </svg>
              <span className="text-white font-medium text-sm">System</span>
            </div>
            
            {/* Upgrade to Premium Tab */}
            <div className={`flex items-center space-x-4 ml-1 mb-1 hover:bg-[#2a2a2a] hover:text-gray-200 cursor-pointer rounded transition-colors w-full px-2 py-1 ${activeTab === 'upgrade-premium' ? 'bg-[#2a2a2a]' : ''}`}
              onClick={() => setActiveTab('upgrade-premium')}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 32 32"
                className="text-[#808080] flex-shrink-0"
              >
                <path 
                  fill="currentColor" 
                  d="M21 24H11a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm0 4H11v-2h10zm7.707-13.707l-12-12a1 1 0 0 0-1.414 0l-12 12A1 1 0 0 0 4 16h5v4a2.002 2.002 0 0 0 2 2h10a2.003 2.003 0 0 0 2-2v-4h5a1 1 0 0 0 .707-1.707zM21 14v6H11v-6H6.414L16 4.414L25.586 14z"
                />
              </svg>
              <span className="text-[#808080] font-medium text-sm">Upgrade to Premium</span>
            </div>
          </div>
        </div>
        
        {/* Right Content Area */}
        <div className="flex-1 bg-[#202020] p-6 overflow-auto">
          {activeTab === 'profile' && (
            <ProfileSettings 
              user={user} 
              onUpdate={(updatedUser) => {
                // Here you would update the user in context or API
                console.log('Updated user:', updatedUser);
              }} 
            />
          )}
          {activeTab === 'preferences' && (
            <PreferencesSettings 
              user={user} 
              onUpdate={(updatedUser) => {
                // Here you would update the user in context or API
                console.log('Updated preferences:', updatedUser);
              }} 
            />
          )}
          {activeTab === 'notifications' && (
            <NotificationSettings 
              user={user} 
              onUpdate={(updatedUser) => {
                // Here you would update the user in context or API
                console.log('Updated notifications:', updatedUser);
              }} 
            />
          )}
          {activeTab === 'ai-models' && (
            <AIModelsSettings 
              user={user} 
              onUpdate={(updatedUser) => {
                // Here you would update the user in context or API
                console.log('Updated AI & Models:', updatedUser);
              }} 
            />
          )}
          {activeTab === 'personal-assistant' && (
            <PersonalAssistantSettings 
              user={user} 
              onUpdate={(updatedUser) => {
                // Here you would update the user in context or API
                console.log('Updated Personal Assistant:', updatedUser);
              }} 
            />
          )}
          {activeTab === 'privacy-data' && (
            <PrivacyDataSettings 
              user={user} 
              onUpdate={(updatedUser) => {
                // Here you would update the user in context or API
                console.log('Updated Privacy & Data:', updatedUser);
              }} 
            />
          )}
          {activeTab === 'system' && (
            <SystemSettings 
              user={user} 
              onUpdate={(updatedUser) => {
                // Here you would update the user in context or API
                console.log('Updated System:', updatedUser);
              }} 
            />
          )}
          {activeTab === 'subscription-plan' && (
            <SubscriptionPlanSettings 
              user={user} 
              onUpdate={(updatedUser) => {
                // Here you would update the user in context or API
                console.log('Updated Subscription:', updatedUser);
              }} 
            />
          )}
          {activeTab === 'upgrade-premium' && (
            <UpgradeToPremiumSettings 
              user={user} 
              onUpdate={(updatedUser) => {
                // Here you would update the user in context or API
                console.log('Updated Premium:', updatedUser);
              }} 
            />
          )}
          {activeTab === 'backup' && (
            <BackupSettings 
              user={user} 
              onUpdate={(updatedUser) => {
                // Here you would update the user in context or API
                console.log('Updated Backup:', updatedUser);
              }} 
            />
          )}
          {activeTab === 'connection' && (
            <ConnectionSettings 
              user={user} 
              onUpdate={(updatedUser) => {
                // Here you would update the user in context or API
                console.log('Updated Connection:', updatedUser);
              }} 
            />
          )}
          {activeTab !== 'profile' && activeTab !== 'preferences' && activeTab !== 'notifications' && activeTab !== 'ai-models' && activeTab !== 'personal-assistant' && activeTab !== 'privacy-data' && activeTab !== 'system' && activeTab !== 'subscription-plan' && activeTab !== 'upgrade-premium' && activeTab !== 'backup' && activeTab !== 'connection' && (
            <div className="text-white text-sm">
              <p>Content area for selected tab settings. Add forms, toggles, etc., here based on the active tab.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;