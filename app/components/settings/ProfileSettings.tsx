import React from 'react';

interface ProfileSettingsProps {
  user: any;
  onUpdate: (updatedUser: any) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate }) => {
  return (
    <div>
      <h2 className="text-white text-[13px] font-semibold mb-2">Account</h2>
      <hr className="border-[#303030] mb-4" />
      
      {/* User Avatar and Field */}
      <div className="flex items-center mb-6">
        {user?.profilePicture ? (
          <img 
            src={user.profilePicture} 
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#191919] flex items-center justify-center text-[#808080] font-medium text-2xl">
            {user?.fullName 
              ? user.fullName.split(' ').map((n: string) => n[0]).join(' ').toUpperCase()
              : user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <div className="ml-4">
          <label className="block text-[#808080] text-[13px] font-medium mb-1">Preferred name</label>
          <input 
            className="w-[200px] p-1 bg-[#262626] text-white rounded focus:outline-none"
            placeholder="Enter preferred name"
            value={user?.fullName || ''}
          />
        </div>
      </div>
      
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-10">Account Security</h3>
      <hr className="border-[#303030] mb-4" />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Email</h4>
          <p className="text-[#808080] text-sm">{user?.email || 'No email'}</p>
        </div>
        <button className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer">
          Change email
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Password</h4>
          <p className="text-[#808080] text-sm">Set a permanent password</p>
        </div>
        <button className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer">
          {user ? 'Change password' : 'Add password'}
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Add passkeys</h4>
          <p className="text-[#808080] text-sm">Enhance security with passkeys for passwordless sign-in.</p>
        </div>
        <button className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer">
          Add passkey
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Add recovery email</h4>
          <p className="text-[#808080] text-sm">Add a recovery email for account recovery and security alerts.</p>
        </div>
        <button className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer">
          Add email
        </button>
      </div>
      
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Support</h3>
      <hr className="border-[#303030] mb-4" />
      
      <div 
        className="flex items-center justify-between mb-4 transition-colors cursor-pointer"
        onClick={() => alert('Delete account functionality would be implemented here')}
      >
        <div>
          <h4 className="text-red-500 text-[13px] font-semibold mb-1">Delete my Account</h4>
          <p className="text-[#808080] text-sm">Permanently delete the account and remove access from all workspaces</p>
        </div>
        <div className="text-[#808080] text-lg">→</div>
      </div>
      
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-6">Devices</h3>
      <hr className="border-[#303030] mb-4" />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Logout of all devices</h4>
          <p className="text-[#808080] text-sm">Log out of all other active sessions on other devices besides this one.</p>
        </div>
        <button className="border border-[#808080] text-[#808080] px-3 py-1 rounded text-sm hover:bg-[#333] transition-colors cursor-pointer">
          Logout of all devices
        </button>
      </div>
      
      <hr className="border-[#303030] mb-4" />
      
      {/* Device List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="text-[#808080]">Device name</div>
          <div className="text-[#808080]">Last active</div>
          <div className="text-[#808080]">Location</div>
        </div>
        
        <hr className="border-[#303030]" />
        
        <div className="flex items-center justify-between text-sm">
          <div className="text-white">iPhone 15 Pro</div>
          <div className="text-[#808080]">2 minutes ago</div>
          <div className="text-[#808080]">New York, US</div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="text-white">MacBook Pro</div>
          <div className="text-[#808080]">1 hour ago</div>
          <div className="text-[#808080]">San Francisco, US</div>
        </div>
      </div>
      
      <hr className="border-[#303030] mt-4" />
      
      <p className="text-[#808080] text-sm mt-2">All devices are shown</p>
    </div>
  );
};

export default ProfileSettings;
