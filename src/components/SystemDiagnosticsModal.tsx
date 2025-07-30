import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Cpu, 
  HardDrive, 
  Zap, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  X,
  Activity,
  Database
} from 'lucide-react';

interface SystemInfo {
  os: string;
  architecture: string;
  totalMemory: string;
  freeMemory: string;
  cpu: string;
  gpu: string;
  storage: {
    total: string;
    free: string;
    used: string;
  };
  network: {
    download: string;
    upload: string;
  };
  browser: string;
  screenResolution: string;
  colorDepth: number;
  timezone: string;
  language: string;
}

interface DiagnosticResult {
  category: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  details?: string;
}

interface SystemDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SystemDiagnosticsModal: React.FC<SystemDiagnosticsModalProps> = ({ isOpen, onClose }) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Real system detection
  const detectSystem = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Import the real system detection service
    const { detectSystemInfo, runDiagnostics } = await import('../services/systemDetector');

    // Simulate progressive scanning
    const steps = [
      { progress: 20, task: 'Detecting OS...' },
      { progress: 40, task: 'Analyzing CPU...' },
      { progress: 60, task: 'Checking Memory...' },
      { progress: 80, task: 'Scanning Storage...' },
      { progress: 100, task: 'Finalizing...' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setScanProgress(step.progress);
    }

    // Use real system detection
    const detectedSystem = detectSystemInfo();
    setSystemInfo(detectedSystem);

    // Run real diagnostics
    const diagnosticResults = runDiagnostics(detectedSystem);
    setDiagnostics(diagnosticResults);
    setIsScanning(false);
  };

  useEffect(() => {
    if (isOpen) {
      detectSystem();
    }
  }, [isOpen]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'fail':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Diagnostics</h2>
            <p className="text-gray-600">Comprehensive system analysis for video editing</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* System Specifications */}
          {systemInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">OS</p>
                    <p className="text-sm font-semibold text-gray-900">{systemInfo.os}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Database className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">RAM</p>
                    <p className="text-sm font-semibold text-gray-900">{systemInfo.totalMemory}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <HardDrive className="w-6 h-6 text-purple-500" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">Storage</p>
                    <p className="text-sm font-semibold text-gray-900">{systemInfo.storage.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">GPU</p>
                    <p className="text-sm font-semibold text-gray-900">{systemInfo.gpu}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Cpu className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">CPU</p>
                    <p className="text-sm font-semibold text-gray-900">{systemInfo.cpu}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isScanning && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Scanning system...</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Diagnostic Results */}
          {diagnostics.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Diagnostic Results</h3>
              {diagnostics.map((diagnostic, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${getStatusColor(diagnostic.status)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(diagnostic.status)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{diagnostic.category}</h4>
                      <p className="text-xs text-gray-600 mt-1">{diagnostic.message}</p>
                      {diagnostic.details && (
                        <p className="text-xs text-gray-500 mt-1">{diagnostic.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Info */}
          {systemInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Browser Info</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Browser:</span>
                    <span className="font-medium">{systemInfo.browser}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolution:</span>
                    <span className="font-medium">{systemInfo.screenResolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color Depth:</span>
                    <span className="font-medium">{systemInfo.colorDepth}-bit</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">System Info</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">{systemInfo.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timezone:</span>
                    <span className="font-medium">{systemInfo.timezone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Architecture:</span>
                    <span className="font-medium">{systemInfo.architecture}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={detectSystem}
              disabled={isScanning}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Settings className="w-4 h-4" />
              )}
              <span>{isScanning ? 'Scanning...' : 'Re-run Diagnostics'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDiagnosticsModal; 