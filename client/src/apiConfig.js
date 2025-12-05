// Automatically switch between Localhost and Render
const isProduction = import.meta.env.MODE === 'production';

// REPLACE 'YOUR_RENDER_URL' WITH THE URL YOU JUST COPIED FROM RENDER
const PROD_URL = 'https://api-tester-backend.onrender.com'; 

export const API_BASE_URL = isProduction ? PROD_URL : 'http://localhost:5000';
