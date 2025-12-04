async function getProductDetail(customerId) {
    
    let customerData = [];
    if (customerId) {
        
        const response = await fetch(
            `/api/product-detail/?customerId=${encodeURIComponent(customerId)}`
        );
        if (!response.ok) {
            console.error('Network error doing GET to /api/customer-dropdown.');
        }

        customerData = await response.json();  // Get query results from back end...
    }

    return customerData;
}

export default getProductDetail