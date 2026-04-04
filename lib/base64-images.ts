// Helper script to convert and manage base64 product images
// Run in browser console to seed sample products with base64 images

const SAMPLE_PRODUCTS = [
  {
    name: 'Premium Leather Backpack',
    description: 'High-quality leather backpack with laptop compartment and ergonomic design',
    price: 129.99,
    category: 'Bags',
    stock: 15,
    imageColor: 'indigo',
  },
  {
    name: 'Wireless Headphones',
    description: 'Noise-canceling wireless headphones with 30-hour battery life',
    price: 199.99,
    category: 'Electronics',
    stock: 22,
    imageColor: 'blue',
  },
  {
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health monitoring and notifications',
    price: 249.99,
    category: 'Electronics',
    stock: 18,
    imageColor: 'green',
  },
  {
    name: 'Designer Sunglasses',
    description: 'UV-protected designer sunglasses with premium frames',
    price: 159.99,
    category: 'Accessories',
    stock: 25,
    imageColor: 'purple',
  },
  {
    name: 'Ceramic Coffee Mug',
    description: 'Heat-resistant ceramic mug with beautiful minimalist design',
    price: 24.99,
    category: 'Home',
    stock: 50,
    imageColor: 'red',
  },
];

// Helper function to create a simple SVG-based base64 image
export function createBase64ImageWithColor(color: string): string {
  const colors: Record<string, string> = {
    red: 'rgb(255, 52, 52)',
    blue: 'rgb(59, 130, 246)',
    green: 'rgb(34, 197, 94)',
    purple: 'rgb(147, 51, 234)',
    indigo: 'rgb(99, 102, 241)',
  };
  
  const rgbColor = colors[color] || colors.blue;
  const svgString = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="${rgbColor}"/>
      <text x="50%" y="50%" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
        ${color.toUpperCase()}
      </text>
    </svg>
  `;
  
  return 'data:image/svg+xml;base64,' + btoa(svgString);
}

// Export for use in other files
export { SAMPLE_PRODUCTS };

export function getSampleProductsWithImages() {
  const colors: Record<string, string> = {
    red: 'rgb(255, 52, 52)',
    blue: 'rgb(59, 130, 246)',
    green: 'rgb(34, 197, 94)',
    purple: 'rgb(147, 51, 234)',
    indigo: 'rgb(99, 102, 241)',
  };

  return SAMPLE_PRODUCTS.map((product) => {
    const color = product.imageColor;
    const rgbColor = colors[color] || colors.blue;
    const svgString = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="${rgbColor}"/><text x="50%" y="50%" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${color.toUpperCase()}</text></svg>`;
    const base64Image = 'data:image/svg+xml;base64,' + btoa(svgString);

    return {
      ...product,
      image: base64Image,
    };
  });
}
