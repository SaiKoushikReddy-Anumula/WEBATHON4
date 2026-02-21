import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getSocket } from '../utils/socket';
import { AuthContext } from '../context/AuthContext';

const Workspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
          fetchWorkspace();
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
    } catch (error) {
      console.error('Error fetching workspace:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      await api.post(`/workspace/${id}/messages`, {
        threadName: selectedThread,
        content: message
      });
      
      const socket = getSocket();
      if (socket) {
        socket.emit('workspace_message', {
          projectId: id,
          threadName: selectedThread,
          content: message,
          user: { _id: user.id, profile: { name: user.profile.name } }
        });
      }
      
      setMessage('');
      fetchWorkspace();
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

  if (!workspace) return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-6"><div className="text-center">Loading...</div></div>;

  const currentThread = workspace.threads?.find(t => t.name === selectedThread) || { messages: [] };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-blue-100 shadow-lg p-4 mb-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Project Workspace</h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100">
          <div className="border-b border-blue-100">
            <div className="flex">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-6 py-3 font-medium transition-colors ${activeTab === 'chat' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                💬 Chat
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-6 py-3 font-medium transition-colors ${activeTab === 'tasks' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                ✅ Tasks
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-6 py-3 font-medium transition-colors ${activeTab === 'activity' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                📊 Activity
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'chat' && (
              <div className="grid grid-cols-4 gap-4 h-96">
                <div className="col-span-1 border-r border-blue-100 pr-4">
                  <h3 className="font-semibold mb-4 text-slate-800">Threads</h3>
                  <div className="space-y-2">
                    {['General', 'Backend', 'Frontend', 'Design', 'ML'].map((thread) => (
                      <button
                        key={thread}
                        onClick={() => setSelectedThread(thread)}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all ${
                          selectedThread === thread ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-blue-50 text-slate-700'
                        }`}
                      >
                        {thread}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-3 flex flex-col">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-3 bg-slate-50 rounded-xl p-4">
                    {currentThread.messages?.map((msg, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-1 bg-white p-3 rounded-xl shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-slate-800">{msg.user?.profile?.name || 'Unknown'}</span>
                            <span className="text-xs text-slate-500">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-slate-700">{msg.content}</p>
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
                      className="flex-1 px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div>
                <form onSubmit={createTask} className="mb-6 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <h3 className="font-semibold mb-4 text-slate-800">Create New Task</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Add Task
                  </button>
                </form>

                <div className="grid grid-cols-3 gap-4">
                  {['To Do', 'In Progress', 'Done'].map((status) => (
                    <div key={status} className="bg-slate-50 p-4 rounded-2xl border border-blue-100">
                      <h3 className="font-semibold mb-3 text-slate-800">{status}</h3>
                      <div className="space-y-3">
                        {workspace.tasks
                          ?.filter((task) => task.status === status)
                          .map((task) => (
                            <div key={task._id} className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                              <h4 className="font-semibold text-sm mb-1 text-slate-800">{task.title}</h4>
                              <p className="text-xs text-slate-600 mb-3">{task.description}</p>
                              <select
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                className="text-xs px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {workspace.activityLog?.map((log, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex-1">
                      <p className="text-sm text-slate-800">
                        <span className="font-semibold">{log.user?.profile?.name}</span> {log.action}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                {(!workspace.activityLog || workspace.activityLog.length === 0) && (
                  <p className="text-center text-slate-500 py-8">No activity yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
