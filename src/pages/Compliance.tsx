import { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Building, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Camera, 
  Download,
  Bell,
  History,
  Eye,
  X,
  Plus
} from 'lucide-react';

type Status = 'completed' | 'verified' | 'compliant' | 'pending' | 'under-review' | 'rejected' | 'action-required';

interface Asset {
  id: string;
  name: string;
  type: string;
  jurisdiction: string;
  status: Status;
  ownership: string;
  documents: string[];
  lastReview: string;
}

const ComplianceUserPanel = () => {
  const [activeTab, setActiveTab] = useState('kyc');
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Mock data
  const kycStatus = {
    level: 'Advanced',
    status: 'verified' as Status,
    completionPercent: 95,
    lastUpdated: '2025-06-15',
    steps: [
      { name: 'Personal Information', status: 'completed' as Status, date: '2025-06-10' },
      { name: 'Government ID', status: 'completed' as Status, date: '2025-06-12' },
      { name: 'Proof of Address', status: 'completed' as Status, date: '2025-06-13' },
      { name: 'Selfie Verification', status: 'completed' as Status, date: '2025-06-14' },
      { name: 'Accredited Investor', status: 'pending' as Status, date: null }
    ]
  };

  const userAssets: Asset[] = [
    {
      id: 'RWA-001',
      name: 'Marina Bay Luxury Apartments',
      type: 'Tokenized Property',
      jurisdiction: 'Singapore',
      status: 'compliant',
      ownership: '2.5%',
      documents: ['Ownership Certificate', 'Valuation Report', 'Compliance Certificate'],
      lastReview: '2025-06-01'
    },
    {
      id: 'RWA-002', 
      name: 'Tech Hub Commercial Complex',
      type: 'SPV Investment',
      jurisdiction: 'Dubai, UAE',
      status: 'under-review',
      ownership: '5.0%',
      documents: ['Investment Agreement', 'Due Diligence Report'],
      lastReview: '2025-06-18'
    },
    {
      id: 'RWA-003',
      name: 'Green Valley Residential',
      type: 'Direct Property',
      jurisdiction: 'Mumbai, India',
      status: 'action-required',
      ownership: '100%',
      documents: ['Property Deed', 'Tax Certificate'],
      lastReview: '2025-05-28'
    }
  ];

  const activities = [
    { date: '2025-06-18', type: 'document', message: 'Due diligence report uploaded for Tech Hub Complex' },
    { date: '2025-06-15', type: 'kyc', message: 'KYC verification completed - Advanced level achieved' },
    { date: '2025-06-14', type: 'verification', message: 'Selfie verification successful' },
    { date: '2025-06-01', type: 'compliance', message: 'Marina Bay Apartments compliance review completed' }
  ];

  const getStatusColor = (status: Status): string => {
    switch(status) {
      case 'completed':
      case 'verified':
      case 'compliant':
        return 'text-green-600 bg-green-50';
      case 'pending':
      case 'under-review':
        return 'text-yellow-600 bg-yellow-50';
      case 'rejected':
      case 'action-required':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: Status) => {
    switch(status) {
      case 'completed':
      case 'verified':
      case 'compliant':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'under-review':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
      case 'action-required':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const KYCSection = () => (
    <div className="space-y-6">
      {/* KYC Status Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            KYC Verification Status
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(kycStatus.status)}`}>
            {getStatusIcon(kycStatus.status)}
            {kycStatus.level} - {kycStatus.status.charAt(0).toUpperCase() + kycStatus.status.slice(1)}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{kycStatus.completionPercent}%</div>
            <div className="text-sm text-gray-600">Completion</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{kycStatus.level}</div>
            <div className="text-sm text-gray-600">Verification Level</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{kycStatus.lastUpdated}</div>
            <div className="text-sm text-gray-600">Last Updated</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{kycStatus.completionPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${kycStatus.completionPercent}%` }}
            ></div>
          </div>
        </div>

        {/* KYC Steps */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Verification Steps</h4>
          {kycStatus.steps.map((step, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-1 rounded-full ${getStatusColor(step.status)}`}>
                  {getStatusIcon(step.status)}
                </div>
                <span className="font-medium">{step.name}</span>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${getStatusColor(step.status)}`}>
                  {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                </div>
                {step.date && <div className="text-xs text-gray-500">{step.date}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Upload Documents */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => setUploadModal(true)}
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
          >
            <Upload className="w-4 h-4" />
            Upload Additional Documents
          </button>
        </div>
      </div>

      {/* Verification Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Verification powered by Sumsub</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your verification is processed securely by our trusted partner. 
              Estimated review time: 1-3 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const AssetsSection = () => (
    <div className="space-y-6">
      {/* Assets Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-green-600">2</div>
          <div className="text-sm text-gray-600">Compliant Assets</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600">1</div>
          <div className="text-sm text-gray-600">Under Review</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-red-600">1</div>
          <div className="text-sm text-gray-600">Action Required</div>
        </div>
      </div>

      {/* Assets List */}
      <div className="space-y-4">
        {userAssets.map((asset) => (
          <div key={asset.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span>{asset.type}</span>
                  <span>•</span>
                  <span>{asset.jurisdiction}</span>
                  <span>•</span>
                  <span>{asset.ownership} ownership</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(asset.status)}`}>
                {getStatusIcon(asset.status)}
                {asset.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Compliance Documents</h4>
                <div className="space-y-1">
                  {asset.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Last Review</h4>
                <p className="text-sm text-gray-600">{asset.lastReview}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedAsset(asset)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1">
                <Download className="w-4 h-4" />
                Download
              </button>
              {asset.status === 'action-required' && (
                <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  Upload Required
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ActivitySection = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <History className="w-5 h-5 text-blue-600" />
        Activity Timeline
      </h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-gray-900">{activity.message}</p>
              <p className="text-sm text-gray-500 mt-1">{activity.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AlertsSection = () => (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900">Pending Action Required</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Green Valley Residential property requires updated tax certificate. Please upload by June 25, 2025.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">KYC Upgrade Available</h4>
            <p className="text-sm text-blue-700 mt-1">
              Complete accredited investor verification to access premium investment opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
              <p className="text-gray-600">Manage your verification and asset compliance</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Quick Verify
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          {[
            { id: 'kyc', label: 'KYC Verification', icon: User },
            { id: 'assets', label: 'Asset Compliance', icon: Building },
            { id: 'activity', label: 'Activity', icon: History },
            { id: 'alerts', label: 'Alerts', icon: Bell }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === 'kyc' && <KYCSection />}
          {activeTab === 'assets' && <AssetsSection />}
          {activeTab === 'activity' && <ActivitySection />}
          {activeTab === 'alerts' && <AlertsSection />}
        </div>

        {/* Upload Modal */}
        {uploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upload Document</h3>
                <button
                  onClick={() => setUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop files here, or click to select</p>
                <p className="text-sm text-gray-500">Supported formats: PDF, JPG, PNG (max 10MB)</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Select Files
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Asset Detail Modal */}
        {selectedAsset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedAsset.name}</h3>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Asset ID</label>
                  <p className="text-gray-900">{selectedAsset.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900">{selectedAsset.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Jurisdiction</label>
                  <p className="text-gray-900">{selectedAsset.jurisdiction}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Ownership</label>
                  <p className="text-gray-900">{selectedAsset.ownership}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Documents</label>
                <div className="space-y-2">
                  {selectedAsset.documents.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{doc}</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Add Document
                </button>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceUserPanel;