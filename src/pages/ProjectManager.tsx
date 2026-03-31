import React, { useState, useEffect } from 'react';
import {
  Plus,
  FileVideo,
  Trash2,
  Edit3,
  Clock,
  CheckCircle,
  Play,
  Pause,
  Search,
  FolderOpen,
  CalendarDays,
  Film,
  MoreVertical,
  X,
  Save,
  Tag,
  RefreshCw,
  Cloud,
  CloudOff
} from 'lucide-react';

import { 
  saveProject, 
  deleteProjectFromCloud, 
  fetchFromCloud,
  logActivity 
} from '../services/dataService';
import { useAuth } from '../hooks/useAuth';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused' | 'draft';
  createdAt: string;
  updatedAt: string;
  resolution: string;
  frameRate: string;
  duration: string;
  tags: string[];
  thumbnail: string;
}

const RESOLUTIONS = ['1920x1080 (Full HD)', '2560x1440 (QHD)', '3840x2160 (4K UHD)', '1280x720 (HD)', '7680x4320 (8K)'];
const FRAME_RATES = ['24 fps', '25 fps', '30 fps', '50 fps', '60 fps', '120 fps'];
const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const ProjectManager: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('vfp_projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'failed'>('synced');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // New project form
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    resolution: '1920x1080 (Full HD)',
    frameRate: '30 fps',
    tags: ''
  });

  // Initial cloud fetch
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const cloudProjects = await fetchFromCloud('projects');
        if (cloudProjects.length > 0) {
          // Merge logic — typically we'd compare timestamps, but for now we'll prefer cloud
          setProjects(cloudProjects as Project[]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  // Persist to localStorage and Cloud
  useEffect(() => {
    localStorage.setItem('vfp_projects', JSON.stringify(projects));
    
    // Update dashboard stats
    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      totalHours: projects.length * 6,
      totalExports: projects.filter(p => p.status === 'completed').length * 2,
      totalImports: projects.length * 3
    };
    localStorage.setItem('vfp_project_stats', JSON.stringify(stats));
  }, [projects]);

  const createProject = async () => {
    if (!newProject.name.trim()) return;

    setSyncStatus('syncing');
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolution: newProject.resolution,
      frameRate: newProject.frameRate,
      duration: '00:00:00',
      tags: newProject.tags.split(',').map(t => t.trim()).filter(Boolean),
      thumbnail: color
    };

    try {
      setProjects(prev => [project, ...prev]);
      setNewProject({ name: '', description: '', resolution: '1920x1080 (Full HD)', frameRate: '30 fps', tags: '' });
      setShowCreateModal(false);

      // Cloud Sync
      if (user) {
        await saveProject(project);
        setSyncStatus('synced');
      }

      // Add activity
      const activity = {
        id: Date.now().toString(),
        type: 'project',
        title: `Project "${project.name}" created`,
        description: `${project.resolution} • ${project.frameRate}`,
        timestamp: new Date().toLocaleString(),
        status: 'completed',
        progress: 100
      };
      
      const activities = JSON.parse(localStorage.getItem('vfp_recent_activities') || '[]');
      activities.unshift(activity);
      localStorage.setItem('vfp_recent_activities', JSON.stringify(activities.slice(0, 20)));
      
      if (user) logActivity(activity);

    } catch (err) {
      console.error('Create error:', err);
      setSyncStatus('failed');
    }
  };

  const deleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setSyncStatus('syncing');
      try {
        setProjects(prev => prev.filter(p => p.id !== id));
        if (user) await deleteProjectFromCloud(id);
        setSyncStatus('synced');
      } catch (err) {
        setSyncStatus('failed');
      }
    }
    setOpenMenu(null);
  };

  const updateProjectStatus = async (id: string, status: Project['status']) => {
    setSyncStatus('syncing');
    try {
      const updated = projects.map(p =>
        p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p
      );
      setProjects(updated);
      
      const project = updated.find(p => p.id === id);
      if (user && project) await saveProject(project);
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('failed');
    }
    setOpenMenu(null);
  };

  const saveEditProject = async () => {
    if (!editingProject) return;
    setSyncStatus('syncing');
    try {
      setProjects(prev => prev.map(p =>
        p.id === editingProject.id ? { ...editingProject, updatedAt: new Date().toISOString() } : p
      ));
      if (user) await saveProject(editingProject);
      setEditingProject(null);
      setSyncStatus('synced');
    } catch (err) {
      setSyncStatus('failed');
    }
  };


  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      case 'draft': return <Edit3 className="w-3 h-3" />;
      default: return null;
    }
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-3xl font-bold text-gray-900">Project Manager</h1>
              {user && (
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-gray-100 rounded-md">
                  {syncStatus === 'syncing' ? (
                    <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                  ) : syncStatus === 'failed' ? (
                    <CloudOff className="w-3.5 h-3.5 text-red-500" />
                  ) : (
                    <Cloud className="w-3.5 h-3.5 text-green-500" />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {syncStatus === 'syncing' ? 'Syncing' : syncStatus === 'failed' ? 'Error' : 'Cloud'}
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-600">Create and manage your video editing projects</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', count: projects.length, color: 'text-gray-700' },
            { label: 'Active', count: projects.filter(p => p.status === 'active').length, color: 'text-green-600' },
            { label: 'Completed', count: projects.filter(p => p.status === 'completed').length, color: 'text-blue-600' },
            { label: 'Drafts', count: projects.filter(p => p.status === 'draft').length, color: 'text-gray-500' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by name, description, or tag..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-1">
              {['all', 'active', 'draft', 'paused', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    filterStatus === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border p-32 text-center">
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Syncing projects from cloud...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-16 text-center">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {projects.length === 0 ? 'No projects yet' : 'No projects matching your search'}
            </h3>
            <p className="text-gray-500 mb-6">
              {projects.length === 0
                ? 'Create your first video editing project to get started'
                : 'Try adjusting your search or filter settings'}
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create First Project</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group">
                {/* Thumbnail */}
                <div
                  className="h-36 flex items-center justify-center relative"
                  style={{ background: `linear-gradient(135deg, ${project.thumbnail}33, ${project.thumbnail}88)` }}
                >
                  <FileVideo className="w-12 h-12" style={{ color: project.thumbnail }} />
                  <div className="absolute top-3 right-3">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === project.id ? null : project.id)}
                        className="p-1.5 bg-white/80 rounded-lg hover:bg-white transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                      {openMenu === project.id && (
                        <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border py-1 z-10">
                          <button onClick={() => setEditingProject(project)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                            <Edit3 className="w-4 h-4" /><span>Edit</span>
                          </button>
                          <button onClick={() => updateProjectStatus(project.id, 'active')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                            <Play className="w-4 h-4" /><span>Set Active</span>
                          </button>
                          <button onClick={() => updateProjectStatus(project.id, 'completed')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4" /><span>Mark Complete</span>
                          </button>
                          <button onClick={() => updateProjectStatus(project.id, 'paused')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
                            <Pause className="w-4 h-4" /><span>Pause</span>
                          </button>
                          <hr className="my-1" />
                          <button onClick={() => deleteProject(project.id)} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center space-x-2">
                            <Trash2 className="w-4 h-4" /><span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span className="capitalize">{project.status}</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center space-x-1">
                      <Film className="w-3.5 h-3.5" />
                      <span>{project.resolution.split(' ')[0]}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{project.frameRate}</span>
                    </span>
                  </div>

                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                          <Tag className="w-3 h-3 mr-1" />{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                    <span className="flex items-center space-x-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>Updated {formatDate(project.updatedAt)}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="My Video Project"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                    placeholder="Brief description of your project"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                    <select
                      value={newProject.resolution}
                      onChange={e => setNewProject(p => ({ ...p, resolution: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {RESOLUTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frame Rate</label>
                    <select
                      value={newProject.frameRate}
                      onChange={e => setNewProject(p => ({ ...p, frameRate: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {FRAME_RATES.map(fr => <option key={fr} value={fr}>{fr}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newProject.tags}
                    onChange={e => setNewProject(p => ({ ...p, tags: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="vlog, tutorial, cinematic"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
                <button
                  onClick={createProject}
                  disabled={!newProject.name.trim()}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        {editingProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Project</h2>
                <button onClick={() => setEditingProject(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={editingProject.name}
                    onChange={e => setEditingProject({ ...editingProject, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingProject.description}
                    onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                    <select
                      value={editingProject.resolution}
                      onChange={e => setEditingProject({ ...editingProject, resolution: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                    >
                      {RESOLUTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frame Rate</label>
                    <select
                      value={editingProject.frameRate}
                      onChange={e => setEditingProject({ ...editingProject, frameRate: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                    >
                      {FRAME_RATES.map(fr => <option key={fr} value={fr}>{fr}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setEditingProject(null)} className="px-4 py-2.5 text-gray-600">Cancel</button>
                <button
                  onClick={saveEditProject}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManager;