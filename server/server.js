const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Config
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ROUTES ---

// 1. Health Check
app.get('/', (req, res) => {
    res.json({ message: "API Tester Backend is Running!" });
});

// --- ENVIRONMENTS ROUTES (NEW DAY 10) ---

// Get Environments for User
app.get('/environments', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.json([]);

    const { data, error } = await supabase
        .from('environments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Create/Update Environment
app.post('/environments', async (req, res) => {
    const { name, variables, userId, id } = req.body; 

    // Prepare payload
    const payload = { 
        name, 
        variables: JSON.stringify(variables), // Store as string
        user_id: userId 
    };
    if (id) payload.id = id; // If ID exists, Supabase will Update instead of Insert

    const { data, error } = await supabase
        .from('environments')
        .upsert(payload)
        .select();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// Delete Environment
app.delete('/environments/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('environments').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Deleted" });
});

// --- HISTORY ROUTES ---

app.get('/history', async (req, res) => {
    const { userId } = req.query; 
    if (!userId) return res.json([]);

    const { data, error } = await supabase
        .from('history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// --- COLLECTIONS ROUTES ---

app.get('/collections', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.json([]);

    const { data, error } = await supabase
        .from('collections')
        .select('*, collection_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/collections', async (req, res) => {
    const { name, userId } = req.body;
    const { data, error } = await supabase
        .from('collections')
        .insert({ name, user_id: userId })
        .select();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

app.post('/collections/:id/items', async (req, res) => {
    const { id } = req.params; 
    const { name, method, url, headers, body, userId } = req.body;

    const { data, error } = await supabase
        .from('collection_items')
        .insert({
            collection_id: id,
            name,
            method,
            url,
            headers: JSON.stringify(headers),
            body: JSON.stringify(body),
            user_id: userId
        })
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// --- PROXY ROUTE ---

app.post('/proxy', async (req, res) => {
    const { url, method, headers, body, userId } = req.body;

    if (!url || !method) return res.status(400).json({ error: "Missing URL or Method" });

    try {
        const axiosConfig = {
            method, url, headers: headers || {}, data: body || undefined, validateStatus: () => true,
        };

        const response = await axios(axiosConfig);
        
        if (userId) {
            supabase.from('history').insert({
                method,
                url,
                headers: JSON.stringify(headers),
                body: JSON.stringify(body),
                status: response.status,
                user_id: userId 
            }).then(({ error }) => {
                if (error) console.error("Error saving history:", error);
            });
        }

        res.json({
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data,
            time: "TODO" 
        });

    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(500).json({ error: "Request Failed", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});