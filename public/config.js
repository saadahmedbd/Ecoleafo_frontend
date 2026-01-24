// Runtime configuration - auto-detects environment
window.APP_CONFIG = {
  API_BASE_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://api.ecoleafo.com/api'
};
