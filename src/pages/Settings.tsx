import { useState } from 'react'
import { FiSave, FiRefreshCw, FiShield, FiUsers, FiGlobe, FiDatabase } from 'react-icons/fi'

type SettingsData = {
  siteName: string
  siteDescription: string
  adminEmail: string
  maxFileSize: number
  allowedFileTypes: string[]
  enableRegistration: boolean
  requireEmailVerification: boolean
  enableContributorMode: boolean
  minScoreForContributor: number
  minProblemsForContributor: number
  minHoursForContributor: number
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>({
    siteName: 'Gnanify',
    siteDescription: 'Learn to code with interactive courses and challenges',
    adminEmail: 'admin@gnanify.com',
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'mp4'],
    enableRegistration: true,
    requireEmailVerification: false,
    enableContributorMode: true,
    minScoreForContributor: 1000,
    minProblemsForContributor: 50,
    minHoursForContributor: 10
  })
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setLoading(true)
    setMessage(null)
    setError(null)
    
    try {
      // API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)) // Mock API call
      setMessage('Settings saved successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        siteName: 'Gnanify',
        siteDescription: 'Learn to code with interactive courses and challenges',
        adminEmail: 'admin@gnanify.com',
        maxFileSize: 10,
        allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'mp4'],
        enableRegistration: true,
        requireEmailVerification: false,
        enableContributorMode: true,
        minScoreForContributor: 1000,
        minProblemsForContributor: 50,
        minHoursForContributor: 10
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure platform settings and preferences</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="btn-secondary flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <FiSave className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {/* General Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiGlobe className="w-5 h-5" />
          General Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={e => setSettings({...settings, siteName: e.target.value})}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={e => setSettings({...settings, adminEmail: e.target.value})}
              className="input-field"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Description
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={e => setSettings({...settings, siteDescription: e.target.value})}
              rows={3}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* User Registration Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiUsers className="w-5 h-5" />
          User Registration
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable User Registration</label>
              <p className="text-sm text-gray-500">Allow new users to create accounts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableRegistration}
                onChange={e => setSettings({...settings, enableRegistration: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Require Email Verification</label>
              <p className="text-sm text-gray-500">Users must verify their email before accessing the platform</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={e => setSettings({...settings, requireEmailVerification: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Contributor Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiShield className="w-5 h-5" />
          Contributor Requirements
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable Contributor Mode</label>
              <p className="text-sm text-gray-500">Allow users to become contributors and create content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableContributorMode}
                onChange={e => setSettings({...settings, enableContributorMode: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Score Required
              </label>
              <input
                type="number"
                value={settings.minScoreForContributor}
                onChange={e => setSettings({...settings, minScoreForContributor: Number(e.target.value)})}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Problems Solved
              </label>
              <input
                type="number"
                value={settings.minProblemsForContributor}
                onChange={e => setSettings({...settings, minProblemsForContributor: Number(e.target.value)})}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Hours Coding
              </label>
              <input
                type="number"
                value={settings.minHoursForContributor}
                onChange={e => setSettings({...settings, minHoursForContributor: Number(e.target.value)})}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiDatabase className="w-5 h-5" />
          File Upload Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum File Size (MB)
            </label>
            <input
              type="number"
              value={settings.maxFileSize}
              onChange={e => setSettings({...settings, maxFileSize: Number(e.target.value)})}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed File Types
            </label>
            <input
              type="text"
              value={settings.allowedFileTypes.join(', ')}
              onChange={e => setSettings({...settings, allowedFileTypes: e.target.value.split(',').map(s => s.trim())})}
              placeholder="jpg, png, pdf, mp4"
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Platform Version</p>
            <p className="text-sm font-medium text-gray-900">v1.0.0</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Database Status</p>
            <p className="text-sm font-medium text-green-600">Connected</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Last Backup</p>
            <p className="text-sm font-medium text-gray-900">2024-01-20 10:30 AM</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Server Status</p>
            <p className="text-sm font-medium text-green-600">Running</p>
          </div>
        </div>
      </div>
    </div>
  )
}
