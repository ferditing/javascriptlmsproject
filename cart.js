// cart.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart from localStorage or create a new one
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to update the cart count displayed in the navigation
    const updateCartCount = () => {
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = cart.length;
    };

    // Function to add item to the cart
    const addToCart = (name, price) => {
        // Add item to cart array
        cart.push({ name, price });

        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update the cart count
        updateCartCount();
    };

    // Attach click event to all add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const name = event.target.getAttribute('data-name');
            const price = event.target.getAttribute('data-price');
            addToCart(name, price);
        });
    });

    // Update cart count on page load
    updateCartCount();
});
