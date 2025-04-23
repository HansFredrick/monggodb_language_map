document.addEventListener('DOMContentLoaded', function() {
    const actionBtn = document.getElementById('actionBtn');
    const requestsList = document.getElementById('requestsList');
    
    // Fetch and display existing requests on page load
    fetchRequests();
    
    // Button click handler
    actionBtn.addEventListener('click', async function() {
        try {
            // Send POST request to server
            const response = await fetch('/api/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Button clicked at ${new Date().toLocaleTimeString()}`
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to send request');
            }
            
            // Refresh the list of requests
            fetchRequests();
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Check console for details.');
        }
    });
    
    // Function to fetch and display requests
    async function fetchRequests() {
        try {
            const response = await fetch('/api/requests');
            if (!response.ok) {
                throw new Error('Failed to fetch requests');
            }
            
            const requests = await response.json();
            displayRequests(requests);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    }
    
    // Function to display requests in the list
    function displayRequests(requests) {
        requestsList.innerHTML = '';
        
        if (requests.length === 0) {
            requestsList.innerHTML = '<li>No requests found</li>';
            return;
        }
        
        requests.forEach(request => {
            const li = document.createElement('li');
            li.textContent = `${request.message} (${new Date(request.timestamp).toLocaleString()})`;
            requestsList.appendChild(li);
        });
    }
});