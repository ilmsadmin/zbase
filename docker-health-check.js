// Script kiểm tra sức khỏe của Docker environment

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Kiểm tra trạng thái Docker environment cho ZBase...\n');

// Hàm thực thi lệnh và xử lý lỗi
function runCommand(command, errorMessage) {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    return output.trim();
  } catch (error) {
    console.error(`❌ ${errorMessage}`);
    console.error(`Lỗi: ${error.message}`);
    return null;
  }
}

// Kiểm tra Docker đang chạy
console.log('Kiểm tra Docker...');
const dockerVersion = runCommand('docker --version', 'Không thể kết nối với Docker.');
if (dockerVersion) {
  console.log(`✅ ${dockerVersion}`);
} else {
  console.log('❌ Docker không khả dụng. Vui lòng kiểm tra Docker Desktop đang chạy.');
  process.exit(1);
}

// Kiểm tra Docker Compose
console.log('\nKiểm tra Docker Compose...');
const dockerComposeVersion = runCommand('docker-compose --version', 'Docker Compose không khả dụng.');
if (dockerComposeVersion) {
  console.log(`✅ ${dockerComposeVersion}`);
} else {
  console.log('❌ Docker Compose không khả dụng.');
  process.exit(1);
}

// Kiểm tra file cấu hình
console.log('\nKiểm tra file cấu hình Docker...');
['docker-compose.yml', 'docker-compose.dev.yml', 'Dockerfile', 'Dockerfile.dev', '.env'].forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ File ${file} tồn tại`);
  } else {
    console.log(`❌ File ${file} không tìm thấy`);
  }
});

// Kiểm tra container đang chạy
console.log('\nKiểm tra container đang chạy...');
const runningContainers = runCommand('docker ps --format "{{.Names}}"', 'Không thể lấy danh sách container.');
if (runningContainers) {
  const containers = runningContainers.split('\n');
  const isPostgresRunning = containers.includes('zbase');
  const isAppRunning = containers.includes('zbase-app') || containers.includes('zbase-app-dev');
  
  if (isPostgresRunning) {
    console.log('✅ Container PostgreSQL (zbase) đang chạy');
  } else {
    console.log('❌ Container PostgreSQL (zbase) không chạy');
  }
  
  if (isAppRunning) {
    console.log('✅ Container ứng dụng (zbase-app/zbase-app-dev) đang chạy');
  } else {
    console.log('❌ Container ứng dụng (zbase-app/zbase-app-dev) không chạy');
  }
} else {
  console.log('❌ Không thể kiểm tra container đang chạy');
}

// Kiểm tra kết nối PostgreSQL
console.log('\nKiểm tra kết nối PostgreSQL...');
try {
  // Load biến môi trường từ .env
  require('dotenv').config();
  const { Client } = require('pg');
  
  const client = new Client({
    host: '127.0.0.1', // Luôn sử dụng 127.0.0.1 để kiểm tra từ máy host
    port: 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'ToanLinh',
    database: process.env.DB_DATABASE || 'zbase',
    connectionTimeoutMillis: 5000
  });
  
  client.connect()
    .then(() => {
      console.log('✅ Kết nối thành công đến PostgreSQL!');
      client.end();
      
      // Kiểm tra API
      console.log('\nKiểm tra API endpoint...');
      try {
        const http = require('http');
        const req = http.get('http://localhost:3001/api/info', (res) => {
          if (res.statusCode === 200) {
            console.log('✅ API endpoint hoạt động (200 OK)');
            
            let data = '';
            res.on('data', (chunk) => {
              data += chunk;
            });
            
            res.on('end', () => {
              console.log('\n📋 Thông tin API:');
              try {
                const info = JSON.parse(data);
                console.log(`- Tên: ${info.name}`);
                console.log(`- Phiên bản: ${info.version}`);
                console.log(`- Mô tả: ${info.description}`);
                
                console.log('\n🎉 Hệ thống Docker đang hoạt động tốt!');
              } catch (e) {
                console.log('Không thể phân tích dữ liệu API');
              }
            });
          } else {
            console.log(`❌ API endpoint trả về mã lỗi: ${res.statusCode}`);
          }
        });
        
        req.on('error', (err) => {
          console.log(`❌ Không thể kết nối đến API: ${err.message}`);
          console.log('🔧 Kiểm tra xem container ứng dụng có đang chạy không');
        });
      } catch (err) {
        console.log(`❌ Lỗi khi kiểm tra API: ${err.message}`);
      }
    })
    .catch(err => {
      console.log(`❌ Không thể kết nối đến PostgreSQL: ${err.message}`);
      console.log('🔧 Kiểm tra container PostgreSQL và cấu hình cổng');
    });
} catch (err) {
  console.log(`❌ Lỗi khi kiểm tra PostgreSQL: ${err.message}`);
  if (err.message.includes("Cannot find module 'pg'")) {
    console.log('🔧 Cài đặt module pg: npm install pg');
  }
}
