async function getCustomerList() {

    const response = await fetch('/api/customers/', {
        method: 'GET',
    });
    if (!response.ok) {
        console.error('Network error doing GET to /api/customers');
    }

    const customerData = await response.json();  // Get query results from back end...
    
    return customerData;
}

export default getCustomerList