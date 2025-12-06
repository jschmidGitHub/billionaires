async function putCustomer(newCustomerName, customerId) {
  
  //console.log("Put: ", newCustomerName);

  const response = await fetch(`/api/customers/${encodeURIComponent(customerId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            customerName: newCustomerName
        })
    });
    if (!response.ok) {
        throw new Error('Network error doing PUT to /api/customers/{id}');
    }
}

export default putCustomer