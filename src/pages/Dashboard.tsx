import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, Monitor, HardDrive, Cpu, MemoryStick as Memory, Zap, RefreshCw, Download, Settings } from 'lucide-react';

interface SystemInfo {
  os: string;
  ram: string;
  storage: string;
  gpu: string;
  cpu: string;
}

interface DiagnosticResult {
  category: string;
  status: 'good' | 'warning' | 'error';
  message: string;
  details?: string;
  fix?: string;
}

const Dashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    os: 'Windows 11 Pro',
    ram: '32 GB',
    storage: '1 TB SSD (68% free)',
    gpu: 'NVIDIA RTX 4080',
    cpu: 'Intel i9-13900K'
  });

  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);

  const runDiagnostics = () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setScanComplete(false);
    setDiagnosticResults([]);

    // Simulate diagnostic process
    const diagnosticSteps = [
      { category: 'System Resources', status: 'good' as const, message: 'Adequate RAM and storage available', details: '32GB RAM, 320GB free storage' },
      { category: 'Plugin Compatibility', status: 'warning' as const, message: 'Potential conflict detected', details: 'After Effects CC 2024 + Red Giant Suite', fix: 'Update Red Giant plugins to latest version' },
      { category: 'GPU Acceleration', status: 'good' as const, message: 'CUDA acceleration enabled', details: 'RTX 4080 - All features supported' },
      { category: 'Memory Management', status: 'error' as const, message: 'Memory leak detected', details: 'After Effects using 18GB continuously', fix: 'Clear disk cache and restart application' },
      { category: 'Project Settings', status: 'warning' as const, message: 'High resolution project detected', details: '4K timeline with multiple effects', fix: 'Consider using proxy media for better performance' },
      { category: 'System Updates', status: 'good' as const, message: 'All software up to date', details: 'OS and video editing software current' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < diagnosticSteps.length) {
        setDiagnosticResults(prev => [...prev, diagnosticSteps[currentStep]]);
        currentStep++;
      } else {
        setIsScanning(false);
        setScanComplete(true);
        clearInterval(interval);
      }
    }, 800);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const goodCount = diagnosticResults.filter(r => r.status === 'good').length;
  const warningCount = diagnosticResults.filter(r => r.status === 'warning').length;
  const errorCount = diagnosticResults.filter(r => r.status === 'error').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Video Editor Diagnostics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive system analysis and plugin troubleshooting
          </p>
        </div>

        {/* System Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2 mb-2">
              <Monitor className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">OS</span>
            </div>
            <p className="text-sm text-gray-600">{systemInfo.os}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2 mb-2">
              <Memory className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">RAM</span>
            </div>
            <p className="text-sm text-gray-600">{systemInfo.ram}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2 mb-2">
              <HardDrive className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900">Storage</span>
            </div>
            <p className="text-sm text-gray-600">{systemInfo.storage}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-gray-900">GPU</span>
            </div>
            <p className="text-sm text-gray-600">{systemInfo.gpu}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-2 mb-2">
              <Cpu className="h-5 w-5 text-red-600" />
              <span className="font-medium text-gray-900">CPU</span>
            </div>
            <p className="text-sm text-gray-600">{systemInfo.cpu}</p>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                System Diagnostics
              </h2>
              <p className="text-gray-600">
                Run comprehensive checks on your video editing environment
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={runDiagnostics}
                disabled={isScanning}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  isScanning 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4" />
                    <span>Run Diagnostics</span>
                  </>
                )}
              </button>
              
              {scanComplete && (
                <button className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {diagnosticResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">{goodCount} Passed</p>
                  <p className="text-sm text-green-700">Systems working correctly</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-900">{warningCount} Warnings</p>
                  <p className="text-sm text-yellow-700">Issues requiring attention</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-6 w-6 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">{errorCount} Critical</p>
                  <p className="text-sm text-red-700">Immediate action needed</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagnostic Results */}
        <div className="space-y-4">
          {diagnosticResults.map((result, index) => (
            <div
              key={index}
              className={`bg-white border rounded-lg p-6 ${getStatusColor(result.status)} transition-all duration-300 transform hover:scale-[1.01]`}
            >
              <div className="flex items-start space-x-4">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{result.category}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      result.status === 'good' ? 'bg-green-100 text-green-800' :
                      result.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{result.message}</p>
                  {result.details && (
                    <p className="text-sm text-gray-600 mt-2">{result.details}</p>
                  )}
                  {result.fix && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm font-medium text-blue-900">Recommended Fix:</p>
                      <p className="text-sm text-blue-800 mt-1">{result.fix}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isScanning && diagnosticResults.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Initializing diagnostic scan...</p>
          </div>
        )}

        {/* Help Section */}
        {scanComplete && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Need Additional Help?</h3>
            <p className="text-blue-800 mb-4">
              Our expert support team is available 24/7 to help resolve complex issues and provide personalized solutions.
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Contact Expert Support
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;