async function deleteProduct(productId) {

    //console.log("Deleting product with ID: ", productId);

    if (productId) {

        const response = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            console.error('Network error doing DELETE to /api/products');
        }
    }
}

export default deleteProduct