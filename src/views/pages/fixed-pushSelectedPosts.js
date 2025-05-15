async function pushSelectedPosts() {
    try {
        const postIds = Array.from(document.querySelectorAll('.post-checkbox:checked')).map(cb => parseInt(cb.value));
        
        if (postIds.length === 0) {
            alert('Please select at least one post to push');
            return;
        }
        
        const token = localStorage.getItem('token');
        const response = await fetch('/posts/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postIds)
        });
        
        if (!response.ok) {
            console.error('Response status:', response.status);
            const errorText = await response.text();
            console.error('Response body:', errorText);
            
            let errorMessage = 'Failed to push posts';
            try {
                const errorData = JSON.parse(errorText);
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (e) {
                console.error('Error parsing JSON response:', e);
            }
            
            throw new Error(errorMessage);
        }
        
        const result = await response.json();
        
        // Close modal and refresh posts
        bootstrap.Modal.getInstance(document.getElementById('pushPostsModal')).hide();
        loadPosts();
        
        alert(`Successfully pushed ${result.pushed || 0} posts!`);
        
    } catch (error) {
        console.error('Error pushing posts:', error);
        alert('Failed to push posts: ' + error.message);
    }
}
