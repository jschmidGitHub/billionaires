async function deleteCustomer(customerId) {

    if (customerId) {

        const response = await fetch(`/api/customers/${encodeURIComponent(customerId)}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            console.error('Network error doing DELETE to /api/customers/{id}');
        }
    }
}

export default deleteCustomer
