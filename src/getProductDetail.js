async function getProductDetail(customerId) {
    
    let customerData = [];
    if (customerId) {
        
        const response = await fetch(
            `/api/products/?customerId=${encodeURIComponent(customerId)}`
        );
        if (!response.ok) {
            console.error('Network error doing GET to /api/customers');
        }

        customerData = await response.json();  // Get query results from back end...
    }

    return customerData;
}

export default getProductDetail