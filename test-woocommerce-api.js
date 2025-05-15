// Simple script to test WooCommerce API connection
const axios = require('axios');

// Replace with your test site credentials
const site = {
    name: 'Test Site',
    wp_url: process.env.WP_URL || 'https://your-woocommerce-site.com',
    wc_key: process.env.WC_KEY || 'your_consumer_key',
    wc_secret: process.env.WC_SECRET || 'your_consumer_secret'
};

async function testWooCommerceConnection() {
    try {
        console.log(`Testing WooCommerce API connection for: ${site.name} (${site.wp_url})`);
        
        if (!site.wp_url || !site.wc_key || !site.wc_secret) {
            console.error('Error: Missing WooCommerce credentials');
            console.log('Usage: WP_URL=https://your-site.com WC_KEY=key WC_SECRET=secret node test-woocommerce-api.js');
            return;
        }

        const baseUrl = site.wp_url.endsWith('/') ? site.wp_url : `${site.wp_url}/`;
        const apiUrl = `${baseUrl}wp-json/wc/v3/products`;
        
        console.log(`WooCommerce API URL: ${apiUrl}`);
        console.log(`Using consumer_key: ${site.wc_key.substring(0, 4)}...`);
        console.log(`Using consumer_secret: ${site.wc_secret.substring(0, 4)}...`);
        
        console.log('\nAttempting to fetch products from WooCommerce...');
        
        const response = await axios.get(apiUrl, {
            params: {
                consumer_key: site.wc_key,
                consumer_secret: site.wc_secret,
                page: 1,
                per_page: 5
            },
            timeout: 10000
        });

        console.log(`\n✅ Connection successful! Status: ${response.status}`);
        
        // Log headers to check total products available
        const totalProducts = response.headers['x-wp-total'];
        const totalPages = response.headers['x-wp-totalpages'];
        
        if (totalProducts && totalPages) {
            console.log(`WooCommerce reports ${totalProducts} total products across ${totalPages} pages`);
        }
        
        // Log the first product as a sample
        if (response.data && response.data.length > 0) {
            const product = response.data[0];
            console.log(`\nSample product:`);
            console.log(`ID: ${product.id}`);
            console.log(`Name: ${product.name}`);
            console.log(`Price: ${product.price || product.regular_price}`);
            console.log(`Status: ${product.status}`);
            console.log(`Created: ${product.date_created}`);
        } else {
            console.log('\nNo products found in WooCommerce store');
        }
        
        console.log(`\nTotal products received in this request: ${response.data.length}`);
    } catch (error) {
        console.error('❌ Error testing WooCommerce connection:');
        
        if (error.response) {
            // The request was made and the server responded with a status code outside of 2xx
            console.error(`Status: ${error.response.status} - ${error.response.statusText}`);
            console.error('Response data:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from server. Check your URL and network connection.');
        } else {
            // Something happened in setting up the request
            console.error('Error message:', error.message);
        }
    }
}

testWooCommerceConnection();
