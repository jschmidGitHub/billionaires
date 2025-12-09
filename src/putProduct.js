async function putProduct(newProduct) {

    //console.log("Put: ", newProduct);
    
    const { customerId, productId, description, imageLink, name, price } = newProduct;

    const response = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            customerId: customerId,
            productId: productId,
            description: description,
            imageLink: imageLink,
            productName: name,
            price: price,
        })
    });
    if (!response.ok) {
        throw new Error('Network error doing PUT to /api/customers/{id}');
    }
}

export default putProduct