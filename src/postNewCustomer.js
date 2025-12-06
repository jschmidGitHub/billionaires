async function postNewCustomer(customerName) {
  //console.log("Post: ", customerName);

  const response = await fetch('/api/customers/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            customerName: customerName
        })
    });
    if (!response.ok) {
        throw new Error('Network error doing POST to /api/customers/');
    }
}

export default postNewCustomer