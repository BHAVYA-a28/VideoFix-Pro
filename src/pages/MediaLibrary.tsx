import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileVideo,
  Image as ImageIcon,
  Headphones,
  Trash2,
  Search,
  Grid3X3,
  List,
  SortAsc,
  FolderPlus,
  File,
  Download,
  HardDrive,
  CheckCircle,
  X,
  Filter,
  Eye,
  Play
} from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio' | 'other';
  size: number;
  addedAt: string;
  thumbnail: string;
  duration?: string;
  resolution?: string;
  folder: string;
}

interface Folder {
  id: string;
  name: string;
  color: string;
}

const FOLDER_COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

const MediaLibrary: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(() => {
    const saved = localStorage.getItem('vfp_media_files');
    return saved ? JSON.parse(saved) : [];
  });
  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('vfp_media_folders');
    return saved ? JSON.parse(saved) : [
      { id: 'all', name: 'All Files', color: '#6b7280' },
      { id: 'footage', name: 'Footage', color: '#3b82f6' },
      { id: 'music', name: 'Music', color: '#8b5cf6' },
      { id: 'graphics', name: 'Graphics', color: '#22c55e' }
    ];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist
  useEffect(() => {
    localStorage.setItem('vfp_media_files', JSON.stringify(mediaFiles));
    // Update dashboard media stats
    const videos = mediaFiles.filter(f => f.type === 'video').length;
    const images = mediaFiles.filter(f => f.type === 'image').length;
    const audio = mediaFiles.filter(f => f.type === 'audio').length;
    const totalSize = mediaFiles.reduce((acc, f) => acc + f.size, 0);
    localStorage.setItem('vfp_media_library', JSON.stringify({
      videos,
      images,
      audio,
      totalSize: formatBytes(totalSize),
      lastBackup: mediaFiles.length > 0 ? 'Not yet' : 'Never'
    }));
  }, [mediaFiles]);

  useEffect(() => {
    localStorage.setItem('vfp_media_folders', JSON.stringify(folders));
  }, [folders]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (file: File): MediaFile['type'] => {
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'other';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <FileVideo className="w-5 h-5 text-blue-600" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-green-600" />;
      case 'audio': return <Headphones className="w-5 h-5 text-purple-600" />;
      default: return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return '#3b82f6';
      case 'image': return '#22c55e';
      case 'audio': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: MediaFile[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: getFileType(file),
      size: file.size,
      addedAt: new Date().toISOString(),
      thumbnail: getTypeColor(getFileType(file)),
      folder: selectedFolder === 'all' ? 'footage' : selectedFolder
    }));

    setMediaFiles(prev => [...newFiles, ...prev]);

    // Activity log
    const activities = JSON.parse(localStorage.getItem('vfp_recent_activities') || '[]');
    activities.unshift({
      id: Date.now().toString(),
      type: 'import',
      title: `${newFiles.length} file(s) imported to Media Library`,
      description: newFiles.map(f => f.name).slice(0, 3).join(', '),
      timestamp: new Date().toLocaleString(),
      status: 'completed',
      progress: 100
    });
    localStorage.setItem('vfp_recent_activities', JSON.stringify(activities.slice(0, 20)));

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const deleteSelected = () => {
    if (selectedFiles.length === 0) return;
    if (window.confirm(`Delete ${selectedFiles.length} file(s)?`)) {
      setMediaFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)));
      setSelectedFiles([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedFiles(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(f => f.id));
    }
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const color = FOLDER_COLORS[folders.length % FOLDER_COLORS.length];
    setFolders(prev => [...prev, { id: Date.now().toString(), name: newFolderName, color }]);
    setNewFolderName('');
    setShowCreateFolder(false);
  };

  const filteredFiles = mediaFiles.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || f.type === filterType;
    const matchesFolder = selectedFolder === 'all' || f.folder === selectedFolder;
    return matchesSearch && matchesType && matchesFolder;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'date': return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case 'size': return b.size - a.size;
      case 'type': return a.type.localeCompare(b.type);
      default: return 0;
    }
  });

  const totalSize = mediaFiles.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Library</h1>
            <p className="text-gray-600">
              {mediaFiles.length} files • {formatBytes(totalSize)} total
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateFolder(true)}
              className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Folder</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>Import Files</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="video/*,image/*,audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'All Files', count: mediaFiles.length, icon: <HardDrive className="w-5 h-5 text-gray-600" /> },
            { label: 'Videos', count: mediaFiles.filter(f => f.type === 'video').length, icon: <FileVideo className="w-5 h-5 text-blue-600" /> },
            { label: 'Images', count: mediaFiles.filter(f => f.type === 'image').length, icon: <ImageIcon className="w-5 h-5 text-green-600" /> },
            { label: 'Audio', count: mediaFiles.filter(f => f.type === 'audio').length, icon: <Headphones className="w-5 h-5 text-purple-600" /> },
            { label: 'Total Size', count: formatBytes(totalSize), icon: <HardDrive className="w-5 h-5 text-orange-600" />, isText: true }
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border p-4 flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">{stat.icon}</div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Sidebar — Folders */}
          <div className="w-48 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border p-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 px-2">Folders</h3>
              <div className="space-y-1">
                {folders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 ${
                      selectedFolder === folder.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: folder.color }} />
                    <span className="truncate">{folder.name}</span>
                    <span className="ml-auto text-xs text-gray-400">
                      {folder.id === 'all' ? mediaFiles.length : mediaFiles.filter(f => f.folder === folder.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border p-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="video">Videos</option>
                  <option value="image">Images</option>
                  <option value="audio">Audio</option>
                </select>

                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="date">Newest first</option>
                  <option value="name">Name</option>
                  <option value="size">Size</option>
                  <option value="type">Type</option>
                </select>

                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {selectedFiles.length > 0 && (
                  <>
                    <span className="text-sm text-blue-600 font-medium">{selectedFiles.length} selected</span>
                    <button
                      onClick={deleteSelected}
                      className="flex items-center space-x-1 bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Drop Zone / Empty State */}
            {filteredFiles.length === 0 ? (
              <div
                className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-16 text-center cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {mediaFiles.length === 0 ? 'No media files yet' : 'No files match your search'}
                </h3>
                <p className="text-gray-500 mb-6">
                  Drag and drop files here or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  Supports: Video (MP4, MOV, AVI), Images (JPG, PNG, SVG), Audio (MP3, WAV, FLAC)
                </p>
              </div>
            ) : (
              <>
                {/* Select All */}
                <div className="flex items-center mb-3">
                  <button onClick={selectAll} className="text-xs text-blue-600 hover:underline">
                    {selectedFiles.length === filteredFiles.length ? 'Deselect all' : 'Select all'}
                  </button>
                  <span className="text-xs text-gray-500 ml-3">
                    {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredFiles.map(file => (
                      <div
                        key={file.id}
                        className={`bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer hover:shadow-md transition-all group ${
                          selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => toggleSelect(file.id)}
                      >
                        <div
                          className="h-28 flex items-center justify-center relative"
                          style={{ background: `linear-gradient(135deg, ${file.thumbnail}22, ${file.thumbnail}55)` }}
                        >
                          {getTypeIcon(file.type)}
                          {selectedFiles.includes(file.id) && (
                            <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-0.5">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); setPreviewFile(file); }}
                            className="absolute bottom-2 right-2 bg-white/80 rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eye className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatBytes(file.size)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left px-4 py-3 w-8"></th>
                          <th className="text-left px-4 py-3">Name</th>
                          <th className="text-left px-4 py-3">Type</th>
                          <th className="text-left px-4 py-3">Size</th>
                          <th className="text-left px-4 py-3">Added</th>
                          <th className="text-left px-4 py-3 w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFiles.map(file => (
                          <tr
                            key={file.id}
                            className={`border-b hover:bg-gray-50 cursor-pointer ${
                              selectedFiles.includes(file.id) ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => toggleSelect(file.id)}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedFiles.includes(file.id)}
                                onChange={() => {}}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="px-4 py-3 flex items-center space-x-2">
                              {getTypeIcon(file.type)}
                              <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                            </td>
                            <td className="px-4 py-3 capitalize text-gray-600">{file.type}</td>
                            <td className="px-4 py-3 text-gray-600">{formatBytes(file.size)}</td>
                            <td className="px-4 py-3 text-gray-600">{new Date(file.addedAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={(e) => { e.stopPropagation(); setPreviewFile(file); }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">New Folder</h2>
                <button onClick={() => setShowCreateFolder(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                autoFocus
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                onKeyDown={e => e.key === 'Enter' && createFolder()}
              />
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowCreateFolder(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button
                  onClick={createFolder}
                  disabled={!newFolderName.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 truncate pr-4">{previewFile.name}</h2>
                <button onClick={() => setPreviewFile(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div
                className="h-48 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `linear-gradient(135deg, ${previewFile.thumbnail}22, ${previewFile.thumbnail}55)` }}
              >
                {previewFile.type === 'video' && <Play className="w-16 h-16 text-blue-600" />}
                {previewFile.type === 'image' && <ImageIcon className="w-16 h-16 text-green-600" />}
                {previewFile.type === 'audio' && <Headphones className="w-16 h-16 text-purple-600" />}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium capitalize">{previewFile.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size</span>
                  <span className="font-medium">{formatBytes(previewFile.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Added</span>
                  <span className="font-medium">{new Date(previewFile.addedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Folder</span>
                  <span className="font-medium capitalize">{previewFile.folder}</span>
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  onClick={() => {
                    setMediaFiles(prev => prev.filter(f => f.id !== previewFile.id));
                    setPreviewFile(null);
                  }}
                  className="flex items-center space-x-1 text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
                <button onClick={() => setPreviewFile(null)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
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

export default MediaLibrary;