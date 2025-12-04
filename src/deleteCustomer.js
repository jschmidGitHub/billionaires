async function deleteCustomer(customerId) {

    //console.log("Deleting customer: ", customerId);

    if (customerId) {

        const response = await fetch(`/api/delete-customer/?customerId=${encodeURIComponent(customerId)}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerId: customerId
            })
        });
        if (!response.ok) {
            console.error('Network error doing DELETE to /api/delete-customer.');
        }
    }
}

export default deleteCustomer
