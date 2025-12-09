import { useState } from 'react'

const AddProductModal = ({ isOpen, onClose, productPrefix, customerId, productId, onSubmit }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [imageLink, setImageLink] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!name.trim()) {
            alert("You must enter a Product Name that is not blank.");
        } else if (!description.trim()) {
            alert("You must enter a Description that is not blank.");
        } else {

            // Create an object containing the fields
            const newProduct = {
                customerId: customerId,
                productId: productId,
                name: name,
                description: description,
                price: price,
                imageLink: imageLink
            };

            onSubmit(newProduct);
            setName("");
            setDescription("");
            setPrice(0);
            setImageLink("");
            onClose();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '400px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
                <h2 style={{ marginTop: 0 }}>{productPrefix} Product</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            marginBottom: '15px'
                        }}
                        autoFocus
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            marginBottom: '15px'
                        }}
                        autoFocus
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            marginBottom: '15px'
                        }}
                        autoFocus
                    />
                    <input
                        type="text"
                        placeholder="Image Link (a valid URL)"
                        value={imageLink}
                        onChange={(e) => setImageLink(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            marginBottom: '15px'
                        }}
                        autoFocus
                    />
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose}
                            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ccc' }}>
                            Cancel
                        </button>
                        <button type="submit"
                            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ccc' }}>
                            {productPrefix} Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal