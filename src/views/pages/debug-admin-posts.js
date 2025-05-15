// Debug script for admin-posts.ejs
// Thêm mã này vào sau dòng loadPosts() trong tệp admin-posts.ejs
async function debugLoadPosts() {
  try {
    const token = localStorage.getItem('token');
    console.log('Debug - Token:', token ? `${token.substring(0, 15)}...` : 'Missing');
    
    if (!token) {
      console.error('DEBUG: Token missing');
      return;
    }
    
    // Thử truy vấn API trực tiếp
    const testUrl = '/posts?page=1&limit=5';
    console.log('Debug - Fetching URL:', testUrl);
    
    const response = await fetch(testUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Debug - Response status:', response.status);
    
    if (!response.ok) {
      console.error('Debug - Failed response');
      const errorText = await response.text();
      console.error('Debug - Error body:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('Debug - Successful response:', data);
    console.log('Debug - Posts count:', data.items?.length || 0);
    console.log('Debug - First post:', data.items?.[0]);
    
    // Kiểm tra xem bài đăng có dữ liệu đầy đủ không
    if (data.items && data.items.length > 0) {
      const post = data.items[0];
      console.log('Post fields:', Object.keys(post));
      console.log('Post has createdAt:', post.createdAt ? 'Yes' : 'No');
      console.log('Post has created_at:', post.created_at ? 'Yes' : 'No');
      console.log('Post has site:', post.site ? 'Yes' : 'No');
    }
  } catch (error) {
    console.error('Debug - Error in debugLoadPosts:', error);
  }
}
