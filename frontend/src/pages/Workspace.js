import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { getSocket } from '../utils/socket';
import { AuthContext } from '../context/AuthContext';

const Workspace = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [workspace, setWorkspace] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedThread, setSelectedThread] = useState('General');
  const [message, setMessage] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '' });

  useEffect(() => {
    fetchWorkspace();
    
    const socket = getSocket();
    if (socket) {
      socket.emit('join_workspace', id);
      
      socket.on('new_message', (data) => {
        if (data.threadName === selectedThread) {
          setWorkspace(prev => ({
            ...prev,
            threads: prev.threads.map(t =>
              t.name === data.threadName
                ? { ...t, messages: [...t.messages, data.message] }
                : t
            )
          }));
        }
      });
    }
    
    return () => {
      if (socket) {
        socket.off('new_message');
      }
    };
  }, [id, selectedThread]);

  const fetchWorkspace = async () => {
    try {
      const { data } = await api.get(`/workspace/${id}`);
      setWorkspace(data);
      
      if (!data.threads.find(t => t.name === 'General')) {
        await api.post(`/workspace/${id}/messages`, {
          threadName: 'General',
          content: 'Welcome to the workspace!'
        });
        fetchWorkspace();
      }
    } catch (error) {
      console.error('Error fetching workspace:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      const socket = getSocket();
      socket.emit('workspace_message', {
        projectId: id,
        threadName: selectedThread,
        content: message,
        user: { _id: user.id, profile: { name: user.profile.name } }
      });
      
      await api.post(`/workspace/${id}/messages`, {
        threadName: selectedThread,
        content: message
      });
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    
    try {
      await api.post(`/workspace/${id}/tasks`, newTask);
      setNewTask({ title: '', description: '', assignedTo: '' });
      fetchWorkspace();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await api.put(`/workspace/${id}/tasks/${taskId}`, { status });
      fetchWorkspace();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (!workspace) return <div className="p-6">Loading...</div>;

  const currentThread = workspace.threads.find(t => t.name === selectedThread) || { messages: [] };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md p-4 mb-4">
        <h2 className="text-2xl font-bold">Project Workspace</h2>
      </div>

      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-6 py-3 ${activeTab === 'chat' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-6 py-3 ${activeTab === 'tasks' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Tasks
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-6 py-3 ${activeTab === 'activity' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Activity
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'chat' && (
              <div className="grid grid-cols-4 gap-4 h-96">
                <div className="col-span-1 border-r pr-4">
                  <h3 className="font-semibold mb-4">Threads</h3>
                  <div className="space-y-2">
                    {['General', 'Backend', 'Frontend', 'Design', 'ML'].map((thread) => (
                      <button
                        key={thread}
                        onClick={() => setSelectedThread(thread)}
                        className={`w-full text-left px-3 py-2 rounded ${
                          selectedThread === thread ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                        }`}
                      >
                        {thread}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-3 flex flex-col">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                    {currentThread.messages.map((msg, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{msg.user?.profile?.name || 'Unknown'}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div>
                <form onSubmit={createTask} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Create New Task</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add Task
                  </button>
                </form>

                <div className="grid grid-cols-3 gap-4">
                  {['To Do', 'In Progress', 'Done'].map((status) => (
                    <div key={status} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">{status}</h3>
                      <div className="space-y-3">
                        {workspace.tasks
                          .filter((task) => task.status === status)
                          .map((task) => (
                            <div key={task._id} className="bg-white p-3 rounded shadow-sm">
                              <h4 className="font-semibold text-sm mb-1">{task.title}</h4>
                              <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                              <select
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                className="text-xs px-2 py-1 border rounded"
                              >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                              </select>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-3">
                {workspace.activityLog.map((log, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{log.user?.profile?.name}</span> {log.action}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
