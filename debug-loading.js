// Debug script to check loading state
import http from 'http';

function debugFrontend() {
  console.log('🔍 Debugging frontend loading...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    timeout: 10000
  };

  const req = http.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 Response length:', data.length);
      
      // Check for loading indicators
      if (data.includes('app-loading')) {
        console.log('⚠️ App is still in loading state');
      } else if (data.includes('app-error')) {
        console.log('❌ App is showing error state');
      } else if (data.includes('App')) {
        console.log('✅ App has loaded successfully');
      } else {
        console.log('❓ Unknown app state');
      }
      
      // Check for specific content
      if (data.includes('ProductiveMiner')) {
        console.log('✅ Found ProductiveMiner content');
      }
      
      if (data.includes('Analytics')) {
        console.log('✅ Found Analytics content');
      }
      
      // Show first 500 chars for debugging
      console.log('📝 First 500 chars of response:');
      console.log(data.substring(0, 500));
    });
  });

  req.on('error', (err) => {
    console.log('❌ Connection failed:', err.message);
  });

  req.on('timeout', () => {
    console.log('⏰ Request timed out');
    req.destroy();
  });

  req.end();
}

debugFrontend(); 