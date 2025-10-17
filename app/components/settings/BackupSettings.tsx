import React, { useState, useRef } from 'react';

interface BackupSettingsProps {
  user: any;
  onUpdate: (updatedUser: any) => void;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({ user, onUpdate }) => {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [lastBackupDate, setLastBackupDate] = useState('2024-01-15 14:30');
  const [backupSize, setBackupSize] = useState('2.3 MB');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    setBackupProgress(0);

    // Simulate backup creation process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setBackupProgress(i);
    }

    // Simulate file download
    const backupData = {
      user: user,
      settings: {},
      conversations: [],
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumi-backup-${new Date().toISOString().split('T')[0]}.lumi`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setLastBackupDate(new Date().toLocaleString());
    setBackupSize('2.3 MB');
    setIsCreatingBackup(false);
    setBackupProgress(0);
  };

  const handleRestoreBackup = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.lumi')) {
      alert('Please select a valid Lumi backup file (.lumi)');
      return;
    }

    setIsRestoring(true);
    setRestoreProgress(0);

    try {
      // Simulate file reading and restoration
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setRestoreProgress(i);
      }

      const text = await file.text();
      const backupData = JSON.parse(text);

      // Validate backup data
      if (!backupData.user || !backupData.timestamp) {
        throw new Error('Invalid backup file format');
      }

      // Simulate data restoration
      console.log('Restoring backup:', backupData);
      
      // Here you would actually restore the data
      // onUpdate(backupData.user);
      
      alert('Backup restored successfully!');
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('Failed to restore backup. Please check the file format.');
    } finally {
      setIsRestoring(false);
      setRestoreProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAutoBackupToggle = () => {
    console.log('Auto backup toggled');
    // Handle auto backup toggle
  };

  const handleCloudBackupToggle = () => {
    console.log('Cloud backup toggled');
    // Handle cloud backup toggle
  };

  return (
    <div>
      {/* Recent Backups */}
      <h3 className="text-white text-[13px] font-semibold mb-2">Recent Backups</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Backup Table */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="text-[#808080]">Backup name</div>
          <div className="text-[#808080]">Date created</div>
          <div className="text-[#808080]">Size</div>
          <div className="text-[#808080]">Status</div>
        </div>
        
        <hr className="border-[#303030]" />
        
        <div className="flex items-center justify-between text-sm">
          <div className="text-white">lumi-backup-2024-01-15.lumi</div>
          <div className="text-[#808080]">Jan 15, 2024 2:30 PM</div>
          <div className="text-[#808080]">2.3 MB</div>
          <div className="text-green-400">✓ Complete</div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="text-white">lumi-backup-2024-01-08.lumi</div>
          <div className="text-[#808080]">Jan 8, 2024 10:15 AM</div>
          <div className="text-[#808080]">2.1 MB</div>
          <div className="text-green-400">✓ Complete</div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="text-white">lumi-backup-2024-01-01.lumi</div>
          <div className="text-[#808080]">Jan 1, 2024 6:45 PM</div>
          <div className="text-[#808080]">1.9 MB</div>
          <div className="text-green-400">✓ Complete</div>
        </div>
      </div>
      
      <hr className="border-[#303030] mb-4" />
      
      <p className="text-[#808080] text-sm mb-6">All backups are encrypted and stored locally</p>

      {/* Backup Actions */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Backup Actions</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Create Backup */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Create Backup</h4>
          <p className="text-[#808080] text-sm">Download an encrypted backup of your data.</p>
        </div>
        <button
          onClick={handleCreateBackup}
          disabled={isCreatingBackup}
          className={`border px-3 py-1 rounded text-sm transition-colors cursor-pointer ${
            isCreatingBackup 
              ? 'border-[#666] text-[#666] cursor-not-allowed' 
              : 'border-[#808080] text-[#808080] hover:bg-[#333]'
          }`}
        >
          {isCreatingBackup ? 'Creating...' : 'Create Backup'}
        </button>
      </div>

      {/* Backup Progress */}
      {isCreatingBackup && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#808080] text-sm">Creating backup...</span>
            <span className="text-[#808080] text-sm">{backupProgress}%</span>
          </div>
          <div className="w-full bg-[#333] rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${backupProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Restore Backup */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Restore Backup</h4>
          <p className="text-[#808080] text-sm">Upload and restore data from a backup file.</p>
        </div>
        <button
          onClick={handleRestoreBackup}
          disabled={isRestoring}
          className={`border px-3 py-1 rounded text-sm transition-colors cursor-pointer ${
            isRestoring 
              ? 'border-[#666] text-[#666] cursor-not-allowed' 
              : 'border-[#808080] text-[#808080] hover:bg-[#333]'
          }`}
        >
          {isRestoring ? 'Restoring...' : 'Restore Backup'}
        </button>
      </div>

      {/* Restore Progress */}
      {isRestoring && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#808080] text-sm">Restoring backup...</span>
            <span className="text-[#808080] text-sm">{restoreProgress}%</span>
          </div>
          <div className="w-full bg-[#333] rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${restoreProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".lumi"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Backup Settings */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">Backup Settings</h3>
      <hr className="border-[#303030] mb-4" />
      
      {/* Auto Backup */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Auto Backup</h4>
          <p className="text-[#808080] text-sm">Automatically create backups weekly.</p>
        </div>
        <button
          onClick={handleAutoBackupToggle}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-600"
        >
          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
        </button>
      </div>
      
      {/* Cloud Backup */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white text-[13px] font-semibold mb-1">Cloud Backup</h4>
          <p className="text-[#808080] text-sm">Store backups in secure cloud storage.</p>
        </div>
        <button
          onClick={handleCloudBackupToggle}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-600"
        >
          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
        </button>
      </div>

      {/* Backup Details */}
      <h3 className="text-white text-[13px] font-semibold mb-2 mt-12">What's Included</h3>
      <hr className="border-[#303030] mb-4" />
      
      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <svg className="w-3 h-3 text-[#808080] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[#e0e0e0]">User profile and settings</span>
        </div>
        <div className="flex items-center text-sm">
          <svg className="w-3 h-3 text-[#808080] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[#e0e0e0]">Chat history and conversations</span>
        </div>
        <div className="flex items-center text-sm">
          <svg className="w-3 h-3 text-[#808080] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[#e0e0e0]">Personalized preferences</span>
        </div>
        <div className="flex items-center text-sm">
          <svg className="w-3 h-3 text-[#808080] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[#e0e0e0]">AI model settings and customizations</span>
        </div>
      </div>
    </div>
  );
};

export default BackupSettings;
