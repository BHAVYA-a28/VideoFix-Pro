
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { 
  Monitor, 
  HardDrive, 
  Cpu, 
  MemoryStick as Memory, 
  Zap, 
  Download, 
  Settings, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  Play,
  FileVideo,
  Palette,
  Globe,
  Shield,
  Activity,
  TrendingUp,
  Upload,
  RefreshCw,
  FolderOpen,
  Scissors,
  Film,
  TrendingDown,
  Video,
  Image,
  Headphones
} from 'lucide-react';

interface SystemInfo {
  os: string;
  ram: string;
  storage: string;
  gpu: string;
  cpu: string;
  uptime: string;
  temperature: string;
}

interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalHours: number;
  totalExports: number;
  totalImports: number;
}

interface RecentActivity {
  id: string;
  type: 'project' | 'export' | 'import' | 'backup' | 'update' | 'render' | 'edit' | 'share';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'failed' | 'pending';
  progress?: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface MediaLibrary {
  videos: number;
  images: number;
  audio: number;
  totalSize: string;
  lastBackup: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [clickedAction, setClickedAction] = useState<string | null>(null);

  // Define quickActions before using them in useEffect
  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'new-project',
      title: 'New Project',
      description: 'Create a new video editing project',
      icon: <FileVideo className="h-6 w-6" />,
      color: 'bg-blue-500',
      path: '/projects/new'
    },
    {
      id: 'software-downloads',
      title: 'Software Downloads',
      description: 'Download video editing software',
      icon: <Download className="h-6 w-6" />,
      color: 'bg-green-500',
      path: '/software'
    },
    {
      id: 'plugin-manager',
      title: 'Plugin Manager',
      description: 'Manage video editing plugins',
      icon: <Palette className="h-6 w-6" />,
      color: 'bg-purple-500',
      path: '/plugins'
    },
    {
      id: 'media-library',
      title: 'Media Library',
      description: 'Browse and organize media files',
      icon: <FolderOpen className="h-6 w-6" />,
      color: 'bg-orange-500',
      path: '/media'
    },
    {
      id: 'render-queue',
      title: 'Render Queue',
      description: 'Manage video rendering tasks',
      icon: <Film className="h-6 w-6" />,
      color: 'bg-red-500',
      path: '/render'
    },
    {
      id: 'system-diagnostics',
      title: 'System Diagnostics',
      description: 'Check system performance and compatibility',
      icon: <Settings className="h-6 w-6" />,
      color: 'bg-indigo-500',
      path: '/diagnostics'
    }
  ], []);

  // Keyboard shortcuts for quick actions
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const quickActionMap: { [key: string]: string } = {
        '1': 'new-project',
        '2': 'software-downloads',
        '3': 'plugin-manager',
        '4': 'media-library',
        '5': 'render-queue',
        '6': 'system-diagnostics'
      };

      if (quickActionMap[key] && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault();
        const action = quickActions.find(a => a.id === quickActionMap[key]);
        if (action) {
          setClickedAction(action.id);
          setTimeout(() => {
            setClickedAction(null);
            navigate(action.path);
          }, 500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);
  const [systemInfo] = useState<SystemInfo>({
    os: 'Windows 11 Pro',
    ram: '32 GB',
    storage: '1 TB SSD (68% free)',
    gpu: 'NVIDIA RTX 4080',
    cpu: 'Intel i9-13900K',
    uptime: '3 days, 7 hours',
    temperature: '45°C'
  });

  const [projectStats] = useState<ProjectStats>({
    totalProjects: 24,
    activeProjects: 3,
    completedProjects: 21,
    totalHours: 156,
    totalExports: 47,
    totalImports: 89
  });

  const [mediaLibrary] = useState<MediaLibrary>({
    videos: 156,
    images: 342,
    audio: 89,
    totalSize: '2.4 TB',
    lastBackup: '2 hours ago'
  });

  const [performanceMetrics] = useState<PerformanceMetric[]>([
    {
      name: 'CPU Usage',
      value: 23,
      unit: '%',
      status: 'excellent',
      trend: 'stable',
      icon: <Cpu className="h-6 w-6" />
    },
    {
      name: 'Memory Usage',
      value: 45,
      unit: '%',
      status: 'good',
      trend: 'stable',
      icon: <Memory className="h-6 w-6" />
    },
    {
      name: 'Storage Usage',
      value: 32,
      unit: '%',
      status: 'excellent',
      trend: 'stable',
      icon: <HardDrive className="h-6 w-6" />
    },
    {
      name: 'GPU Usage',
      value: 18,
      unit: '%',
      status: 'excellent',
      trend: 'down',
      icon: <Zap className="h-6 w-6" />
    }
  ]);

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'project',
      title: 'Project "Summer Campaign" exported',
      description: '4K video exported successfully to MP4 format',
      timestamp: '2 hours ago',
      status: 'completed',
      progress: 100
    },
    {
      id: '2',
      type: 'render',
      title: 'Product Demo rendering',
      description: 'Rendering 4K timeline with effects',
      timestamp: '4 hours ago',
      status: 'in-progress',
      progress: 75
    },
    {
      id: '3',
      type: 'project',
      title: 'Project "Product Demo" started',
      description: 'New project created with 4K timeline',
      timestamp: '6 hours ago',
      status: 'in-progress',
      progress: 30
    },
    {
      id: '4',
      type: 'backup',
      title: 'Auto backup completed',
      description: 'Project files backed up to cloud storage',
      timestamp: '8 hours ago',
      status: 'completed',
      progress: 100
    },
    {
      id: '5',
      type: 'import',
      title: 'Media imported',
      description: '15 video clips imported from external drive',
      timestamp: '1 day ago',
      status: 'completed',
      progress: 100
    },
    {
      id: '6',
      type: 'share',
      title: 'Project shared with team',
      description: 'Summer Campaign shared via cloud link',
      timestamp: '1 day ago',
      status: 'completed',
      progress: 100
    }
  ]);

  // Add status indicators for quick actions
  const getActionStatus = (actionId: string) => {
    switch (actionId) {
      case 'new-project':
        return { available: true, count: projectStats.totalProjects };
      case 'software-downloads':
        return { available: true, count: 15 }; // Available software
      case 'plugin-manager':
        return { available: true, count: 8 }; // Installed plugins
      case 'media-library':
        return { available: true, count: mediaLibrary.videos + mediaLibrary.images + mediaLibrary.audio };
      case 'render-queue':
        return { available: true, count: 2 }; // Active renders
      case 'system-diagnostics':
        return { available: true, count: 0 }; // No issues
      default:
        return { available: true, count: 0 };
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FileVideo className="h-4 w-4" />;
      case 'export':
        return <Download className="h-4 w-4" />;
      case 'import':
        return <Upload className="h-4 w-4" />;
      case 'backup':
        return <Shield className="h-4 w-4" />;
      case 'update':
        return <RefreshCw className="h-4 w-4" />;
      case 'render':
        return <Film className="h-4 w-4" />;
      case 'edit':
        return <Scissors className="h-4 w-4" />;
      case 'share':
        return <Globe className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable':
        return <BarChart3 className="h-4 w-4 text-blue-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Video Editing Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your projects, system performance, and media library at a glance.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projectStats.totalProjects}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileVideo className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projectStats.activeProjects}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Play className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{projectStats.totalHours}h</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exports</p>
                <p className="text-2xl font-bold text-gray-900">{projectStats.totalExports}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Download className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Media Files</p>
                <p className="text-2xl font-bold text-gray-900">{mediaLibrary.videos + mediaLibrary.images + mediaLibrary.audio}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FolderOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-green-600">Excellent</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <div className="text-sm text-gray-500">
              Click any action to navigate • Press 1-6 for keyboard shortcuts
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.id}
                to={action.path}
                onClick={() => {
                  setClickedAction(action.id);
                  setTimeout(() => setClickedAction(null), 1000);
                }}
                className={`bg-white p-6 rounded-xl shadow-sm border hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group transform hover:-translate-y-1 ${
                  clickedAction === action.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{action.title}</h3>
                      <div className="flex items-center space-x-2">
                        {getActionStatus(action.id).count > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getActionStatus(action.id).count}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {quickActions.indexOf(action) + 1}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {clickedAction === action.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    ) : (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-700">Operating System</span>
                    </div>
                    <span className="text-sm text-gray-600">{systemInfo.os}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Memory className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-700">RAM</span>
                    </div>
                    <span className="text-sm text-gray-600">{systemInfo.ram}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <HardDrive className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-700">Storage</span>
                    </div>
                    <span className="text-sm text-gray-600">{systemInfo.storage}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-gray-700">GPU</span>
                    </div>
                    <span className="text-sm text-gray-600">{systemInfo.gpu}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Cpu className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-gray-700">CPU</span>
                    </div>
                    <span className="text-sm text-gray-600">{systemInfo.cpu}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium text-gray-700">Uptime</span>
                    </div>
                    <span className="text-sm text-gray-600">{systemInfo.uptime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Media Library */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Media Library</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Video className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-700">Videos</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{mediaLibrary.videos}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Image className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-700">Images</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{mediaLibrary.images}</span>
            </div>
            
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Headphones className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-700">Audio</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{mediaLibrary.audio}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <HardDrive className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-gray-700">Total Size</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{mediaLibrary.totalSize}</span>
            </div>
            
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium text-gray-700">Last Backup</span>
                </div>
                <span className="text-sm text-gray-600">{mediaLibrary.lastBackup}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric) => (
              <div key={metric.name} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3">
                  <div className={getPerformanceStatusColor(metric.status)}>
                    {metric.icon}
                  </div>
                    </div>
                <h3 className="font-semibold text-gray-900 mb-1">{metric.name}</h3>
                <p className={`text-2xl font-bold ${getPerformanceStatusColor(metric.status)}`}>
                  {metric.value}{metric.unit}
                </p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  {getTrendIcon(metric.trend)}
                  <span className="text-sm text-gray-600 capitalize">{metric.status}</span>
                </div>
              </div>
            ))}
            </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-600">{activity.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    <div className="flex items-center space-x-2">
                      {activity.progress !== undefined && activity.status === 'in-progress' && (
                        <div className="w-16 bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full" 
                            style={{ width: `${activity.progress}%` }}
                          ></div>
          </div>
        )}
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;