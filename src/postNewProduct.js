async function postNewProduct(newProduct) {

    const response = await fetch('/api/products/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            customerId: newProduct.customerId,
            productName: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            imageLink: newProduct.imageLink
        })
    });

    if (!response.ok) {
        throw new Error('Network error doing POST to /api/products/');
    }

    const data = await response.json();
    const { ID } = data;
    return ID;
}

export default postNewProduct