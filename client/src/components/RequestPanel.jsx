import React, { useState, useEffect } from 'react';
import { Send, Save, Settings, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import JsonEditor from './JsonEditor';
import { API_BASE_URL } from '../apiConfig'; // <--- NEW IMPORT

export default function RequestPanel({ setResponse, setLoading, requestToLoad, userId, isDark }) {
  // --- STATE ---
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [activeTab, setActiveTab] = useState('body'); 
  
  // Editors
  const [body, setBody] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');

  // Save Request Modal
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [collections, setCollections] = useState([]); 
  const [selectedCollectionId, setSelectedCollectionId] = useState('');

  // Environment State
  const [envs, setEnvs] = useState([]);
  const [activeEnvId, setActiveEnvId] = useState('');
  const [showEnvModal, setShowEnvModal] = useState(false);
  const [editingEnv, setEditingEnv] = useState({ id: null, name: '', variables: '{\n  "baseUrl": "https://api.example.com"\n}' });

  // --- EFFECTS ---
  
  // 1. Load History Item
  useEffect(() => {
    if (requestToLoad) {
      setMethod(requestToLoad.method);
      setUrl(requestToLoad.url);
      setBody(requestToLoad.body || ''); 
      setHeaders(requestToLoad.headers || '');
    }
  }, [requestToLoad]);

  // 2. Fetch Environments
  useEffect(() => {
     if(userId) fetchEnvs();
  }, [userId]);

  const fetchEnvs = async () => {
    try {
        // Updated URL
        const res = await axios.get(`${API_BASE_URL}/environments`, { params: { userId }});
        setEnvs(res.data);
    } catch(e) { console.error("Error loading envs"); }
  };

  // --- HELPERS ---

  const processVariables = (str) => {
    if (!activeEnvId || !str) return str;
    const env = envs.find(e => e.id === activeEnvId);
    if (!env) return str;
    let vars = {};
    try { vars = JSON.parse(env.variables); } catch(e) {}
    return str.replace(/\{\{(.*?)\}\}/g, (_, key) => {
        return vars[key.trim()] || `{{${key}}}`; 
    });
  };

  // --- ACTIONS ---

  const handleSend = async () => {
    setLoading(true);
    setResponse(null); 

    try {
      // 1. Process Variables
      const processedUrl = processVariables(url);
      const processedBodyStr = processVariables(body);
      const processedHeadersStr = processVariables(headers);

      // 2. Parse JSON
      let parsedBody = null;
      let parsedHeaders = {};
      try {
         if (processedBodyStr && processedBodyStr.trim()) parsedBody = JSON.parse(processedBodyStr);
         if (processedHeadersStr && processedHeadersStr.trim()) parsedHeaders = JSON.parse(processedHeadersStr);
      } catch (e) {
         toast.error("Invalid JSON! Check syntax.");
         setLoading(false);
         return;
      }

      const startTime = performance.now();
      
      // 3. Send Request (Updated URL)
      const res = await axios.post(`${API_BASE_URL}/proxy`, {
        url: processedUrl, 
        method, 
        headers: parsedHeaders, 
        body: parsedBody, 
        userId
      });

      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(0) + 'ms';

      setResponse({
        status: res.data.status,
        statusText: res.data.statusText,
        headers: res.data.headers,
        data: res.data.data,
        time: duration
      });

    } catch (error) {
      console.error(error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to Backend!");
        setResponse({
            status: 0,
            statusText: "Network Error",
            data: { error: "Could not reach the server. Is the backend running?" },
            time: "0ms"
        });
      } else {
        toast.error("Request Failed");
        setResponse({
            status: 500,
            statusText: "Error",
            data: { error: "Request Failed", details: error.message },
            time: "0ms"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // --- SAVE / ENV MANAGEMENT ---

  const handleSaveEnv = async () => {
    let parsedVars;
    try {
        parsedVars = JSON.parse(editingEnv.variables);
    } catch (e) {
        toast.error("Invalid JSON in variables");
        return;
    }

    try {
        // Updated URL
        await axios.post(`${API_BASE_URL}/environments`, {
            ...editingEnv,
            variables: parsedVars,
            userId
        });
        fetchEnvs();
        setEditingEnv({ id: null, name: '', variables: '{}' });
        toast.success("Environment Saved");
    } catch (e) {
        toast.error("Server Error: " + (e.response?.data?.error || e.message));
    }
  };

  const handleDeleteEnv = async (id) => {
    if(!confirm("Delete this environment?")) return;
    // Updated URL
    await axios.delete(`${API_BASE_URL}/environments/${id}`);
    fetchEnvs();
    if(activeEnvId === id) setActiveEnvId('');
    toast.success("Environment Deleted");
  };

  const openSaveModal = async () => {
    setShowSaveModal(true);
    try {
        // Updated URL
        const res = await axios.get(`${API_BASE_URL}/collections`, { params: { userId } });
        setCollections(res.data);
        if (res.data.length > 0) setSelectedCollectionId(res.data[0].id);
    } catch (e) { console.error("Failed to load collections"); }
  };

  const handleSaveToCollection = async () => {
    if (!saveName || !selectedCollectionId) return toast.error("Enter name and select folder.");
    try {
        let parsedHeaders = {};
        let parsedBody = {};
        try { parsedHeaders = JSON.parse(headers || '{}'); } catch(e){}
        try { parsedBody = JSON.parse(body || '{}'); } catch(e){}

        // Updated URL
        await axios.post(`${API_BASE_URL}/collections/${selectedCollectionId}/items`, {
            name: saveName,
            url, method, headers: parsedHeaders, body: parsedBody, userId
        });
        
        toast.success("Request Saved!");
        setShowSaveModal(false);
        setSaveName('');
    } catch (e) { toast.error("Error saving request."); }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 transition-colors relative">
      
      {/* --- TOP BAR --- */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center gap-3">
        
        {/* Env Selector */}
        <select 
            className="h-10 px-2 border border-slate-300 dark:border-slate-600 rounded text-xs bg-yellow-50 dark:bg-slate-800 dark:text-slate-200 max-w-[120px] focus:outline-none focus:border-yellow-500"
            value={activeEnvId}
            onChange={(e) => setActiveEnvId(e.target.value)}
        >
            <option value="">No Env</option>
            {envs.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        
        {/* Settings Button */}
        <button 
            onClick={() => setShowEnvModal(true)} 
            className="h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-600 dark:text-slate-300 mr-2"
        >
            <Settings size={18} />
        </button>

        {/* Method Selector */}
        <select 
          value={method} 
          onChange={(e) => setMethod(e.target.value)}
          className="h-10 px-3 bg-gray-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option>
        </select>

        {/* URL Input */}
        <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter API URL (e.g. {{baseUrl}}/users)"
          className="flex-1 h-10 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Buttons */}
        <button 
          onClick={handleSend}
          className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded flex items-center gap-2"
        >
          <Send size={18} /> Send
        </button>

        <button 
          onClick={openSaveModal}
          className="h-10 px-4 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded flex items-center gap-2 ml-2"
        >
          <Save size={18} /> Save
        </button>
      </div>

      {/* --- TABS --- */}
      <div className="border-b border-slate-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-950 flex px-4">
         <button onClick={() => setActiveTab('body')} className={`py-2 px-4 text-sm font-medium border-b-2 ${activeTab === 'body' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>Body</button>
         <button onClick={() => setActiveTab('headers')} className={`py-2 px-4 text-sm font-medium border-b-2 ${activeTab === 'headers' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>Headers</button>
      </div>

      {/* --- EDITORS --- */}
      <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-slate-900">
        {activeTab === 'body' && <JsonEditor value={body} onChange={setBody} isDark={isDark} />}
        {activeTab === 'headers' && <JsonEditor value={headers} onChange={setHeaders} isDark={isDark} />}
      </div>

      {/* --- SAVE REQUEST MODAL --- */}
      {showSaveModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-lg w-96 border dark:border-slate-600">
                <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Save Request</h3>
                <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Request Name</label>
                <input className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white p-2 rounded mb-4" placeholder="e.g. Login User" value={saveName} onChange={e => setSaveName(e.target.value)} />
                <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-300">Select Collection</label>
                <select className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white p-2 rounded mb-6" value={selectedCollectionId} onChange={e => setSelectedCollectionId(e.target.value)}>
                    {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div className="flex justify-end gap-2">
                    <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">Cancel</button>
                    <button onClick={handleSaveToCollection} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                </div>
            </div>
        </div>
      )}

      {/* --- ENV MANAGER MODAL --- */}
      {showEnvModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-lg w-[600px] h-[500px] flex flex-col border dark:border-slate-600">
                <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Manage Environments</h3>
                
                <div className="flex gap-2 mb-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded border dark:border-slate-600">
                    <input 
                        className="flex-1 border dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white p-2 rounded text-sm" 
                        placeholder="Env Name (e.g. Production)" 
                        value={editingEnv.name}
                        onChange={e => setEditingEnv({...editingEnv, name: e.target.value})}
                    />
                    <button onClick={handleSaveEnv} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm font-bold">Save</button>
                    <button onClick={() => setEditingEnv({ id: null, name: '', variables: '{\n  "key": "value"\n}' })} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-2 text-xs">Clear</button>
                </div>

                <div className="flex-1 flex gap-4 overflow-hidden">
                    <div className="w-1/3 border-r dark:border-slate-700 overflow-y-auto pr-2">
                        <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Your Environments</div>
                        {envs.length === 0 && <div className="text-sm text-slate-400 italic">No environments created.</div>}
                        {envs.map(e => (
                            <div key={e.id} className="flex justify-between items-center p-2 hover:bg-blue-50 dark:hover:bg-slate-700 group rounded border-b border-slate-50 dark:border-slate-700">
                                <span 
                                    onClick={() => setEditingEnv({ id: e.id, name: e.name, variables: e.variables })}
                                    className="cursor-pointer text-sm truncate flex-1 font-medium text-slate-700 dark:text-slate-200"
                                >{e.name}</span>
                                <Trash2 size={14} className="text-red-400 cursor-pointer hidden group-hover:block" onClick={() => handleDeleteEnv(e.id)} />
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                        <span className="text-xs font-bold text-slate-500 mb-1 uppercase">Variables (JSON)</span>
                        <div className="flex-1 border dark:border-slate-600 rounded overflow-hidden">
                            <JsonEditor 
                                value={editingEnv.variables} 
                                onChange={(val) => setEditingEnv({...editingEnv, variables: val})}
                                isDark={isDark}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-4 pt-2 border-t dark:border-slate-700">
                    <button onClick={() => setShowEnvModal(false)} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded hover:bg-gray-300 dark:hover:bg-slate-600">Close</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}
