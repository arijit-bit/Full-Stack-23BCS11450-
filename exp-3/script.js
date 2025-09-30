// The product dataset
const products = [
  { name: "Laptop", category: "electronics", price: 999 },
  { name: "T-Shirt", category: "clothing", price: 25 },
  { name: "Headphones", category: "electronics", price: 199 },
  { name: "Jeans", category: "clothing", price: 75 },
  { name: "JavaScript Guide", category: "books", price: 45 },
  { name: "Keyboard", category: "electronics", price: 120 },
  { name: "The Pragmatic Programmer", category: "books", price: 55 },
  { name: "Hoodie", category: "clothing", price: 60 },
];

// Get references to the HTML elements
const filterSelect = document.getElementById('filter');
const productsContainer = document.getElementById('products-container');

/**
 * Renders a list of products to the DOM.
 * @param {Array} productsToRender - The array of product objects to display.
 */
function renderProducts(productsToRender) {
  // Clear the container first
  productsContainer.innerHTML = '';
  
  // If no products, show a message
  if (productsToRender.length === 0) {
    productsContainer.innerHTML = '<p>No products found for this category.</p>';
    return;
  }

  // Generate HTML for each product and append it
  productsContainer.innerHTML = productsToRender.map(p => `
    <div class="product">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
    </div>
  `).join('');
}

// Add event listener to the filter dropdown
filterSelect.addEventListener('change', (event) => {
  const selectedCategory = event.target.value;
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);
  
  renderProducts(filteredProducts);
});

// Initial render to show all products on page load
renderProducts(products);