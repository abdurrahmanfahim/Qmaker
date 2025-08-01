import React, { useState, useEffect } from 'react';
import { UserGroupIcon, ShareIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';

const CollaborationPanel = ({ paperId, isOpen, onClose }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [shareLink, setShareLink] = useState('');
  const [permissions, setPermissions] = useState('view');

  useEffect(() => {
    // Simulate loading collaborators
    setCollaborators([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'editor', online: true },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'viewer', online: false }
    ]);
    setShareLink(`https://qmaker.app/paper/${paperId}/share`);
  }, [paperId]);

  const generateShareLink = () => {
    const link = `https://qmaker.app/paper/${paperId}/share?perm=${permissions}`;
    setShareLink(link);
    navigator.clipboard.writeText(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UserGroupIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Collaboration</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Share Paper</h3>
            <div className="flex gap-2 mb-3">
              <select 
                value={permissions} 
                onChange={(e) => setPermissions(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              >
                <option value="view">View Only</option>
                <option value="edit">Can Edit</option>
              </select>
              <button
                onClick={generateShareLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <ShareIcon className="w-4 h-4" />
                Copy Link
              </button>
            </div>
            <input
              type="text"
              value={shareLink}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm"
            />
          </div>

          <div>
            <h3 className="font-medium mb-3">Active Collaborators</h3>
            <div className="space-y-2">
              {collaborators.map(user => (
                <div key={user.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {user.role === 'editor' ? (
                      <PencilIcon className="w-4 h-4 text-blue-500" />
                    ) : (
                      <EyeIcon className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-xs text-gray-500">{user.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel;