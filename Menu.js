 // Sample product data with categories
 const products = [
    { id: 1, name: "Burger", price: 9.99, category: "main", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300" },
    { id: 2, name: "Pizza", price: 12.99, category: "main", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300" },
    { id: 3, name: "Salad", price: 7.99, category: "main", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300" },
    { id: 4, name: "Pasta", price: 11.99, category: "main", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=300" },
    { id: 5, name: "Coffee", price: 3.99, category: "drinks", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300" },
    { id: 6, name: "Ice Cream", price: 6.99, category: "desserts", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300" },
    { id: 7, name: "Smoothie", price: 4.99, category: "drinks", image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=300" },
    { id: 8, name: "Cheesecake", price: 5.99, category: "desserts", image: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=300" }
];

let cart = [];
let currentCategory = 'all';

// Initialize products
function initProducts(category = 'all') {
    const productsContainer = document.getElementById('products');
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    productsContainer.innerHTML = filteredProducts.map(product => `
        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold">${product.name}</h3>
                <p class="text-gray-600">$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})" 
                        class="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Category buttons event listeners
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.dataset.category;
        initProducts(currentCategory);
    });
});

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = cart.map(item => `
        <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
                <h4 class="font-semibold">${item.name}</h4>
                <p class="text-gray-600">$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" 
                        class="bg-gray-200 px-2 py-1 rounded">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" 
                        class="bg-gray-200 px-2 py-1 rounded">+</button>
            </div>
        </div>
    `).join('');

    updateTotals();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(item => item.id === productId);
        item.quantity = newQuantity;
    }
    updateCart();
}

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function clearCart() {
    cart = [];
    updateCart();
}

function checkout() {
    if (cart.length === 0) return;

    const receipt = document.getElementById('receipt');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    const orderNumber = Math.floor(Math.random() * 1000) + 1;

    receipt.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-8 rounded-lg max-w-md w-full">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold">Thank You For Your Order!</h2>
                    <p class="text-gray-600">Order #${orderNumber}</p>
                    <p class="text-gray-600">${new Date().toLocaleString()}</p>
                </div>
                <div class="border-t border-b py-4 mb-4">
                    <div class="flex justify-between mb-2 font-bold">
                        <span>Item</span>
                        <span>Amount</span>
                    </div>
                    ${cart.map(item => `
                        <div class="flex justify-between mb-2">
                            <span>${item.name} x${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span>Subtotal:</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Tax (10%):</span>
                        <span>$${tax.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                </div>
                <div class="mt-6 text-center text-gray-600">
                    <p>Thank you for dining with us!</p>
                    <p>Please come again</p>
                </div>
                <button onclick="printReceipt()" class="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg no-print">
                    Print Receipt
                </button>
            </div>
        </div>
    `;

    receipt.classList.remove('hidden');
}

function printReceipt() {
    try {
        // Hide all elements except receipt before printing
        const nonPrintElements = document.querySelectorAll('.no-print');
        nonPrintElements.forEach(el => el.style.display = 'none');
        
        // Make receipt visible and positioned for printing
        const receipt = document.getElementById('receipt');
        receipt.style.position = 'absolute';
        receipt.style.left = '0';
        receipt.style.top = '0';
        receipt.style.width = '100%';
        
        // Print
        window.print();
        
        // Restore elements after printing
        nonPrintElements.forEach(el => el.style.display = '');
        receipt.style.position = '';
        receipt.style.left = '';
        receipt.style.top = '';
        receipt.style.width = '';
        
        // Hide receipt and clear cart
        receipt.classList.add('hidden');
        clearCart();
    } catch (error) {
        console.error('Error printing receipt:', error);
    }
}

// Initialize the POS system
initProducts();

// Search functionality
document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) &&
        (currentCategory === 'all' || product.category === currentCategory)
    );
    
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = filteredProducts.map(product => `
        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold">${product.name}</h3>
                <p class="text-gray-600">$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})" 
                        class="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
});