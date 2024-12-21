const axios = require("axios");

// Configuration
const API_BASE_URL = "http://localhost:8000/api/v1";
let authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NzIxODU0LCJpYXQiOjE3MzQ3MjAwNTQsImp0aSI6ImZkZmFkYTc3ZDI3ZDRjNTFhNDFmZTNlZWQwMTc3MDMwIiwidXNlcl9pZCI6MX0.B3ngvJrBK4Lbd6LxSzkyNLgAqejnrE2nyjmt8jZ5Vmw";

// Product categories with their specific attributes
const productCategories = {
  electronics: {
    prefixes: ["Smart", "Ultra", "Pro", "Elite", "Digital"],
    items: [
      "Phone",
      "Laptop",
      "Tablet",
      "Headphones",
      "Smartwatch",
      "Camera",
      "Speaker",
    ],
    priceRange: { min: 199, max: 2999 },
    stockRange: { min: 10, max: 100 },
  },
  clothing: {
    prefixes: ["Casual", "Premium", "Designer", "Classic", "Modern"],
    items: [
      "T-Shirt",
      "Jeans",
      "Jacket",
      "Sweater",
      "Dress",
      "Shirt",
      "Hoodie",
    ],
    priceRange: { min: 19.99, max: 199.99 },
    stockRange: { min: 50, max: 200 },
  },
  homeGoods: {
    prefixes: ["Luxury", "Essential", "Comfort", "Deluxe", "Basic"],
    items: ["Pillow", "Blanket", "Lamp", "Mirror", "Rug", "Vase", "Clock"],
    priceRange: { min: 29.99, max: 399.99 },
    stockRange: { min: 20, max: 150 },
  },
  sports: {
    prefixes: ["Professional", "Advanced", "Training", "Competition", "Sports"],
    items: ["Ball", "Shoes", "Racket", "Gloves", "Mat", "Weights", "Bag"],
    priceRange: { min: 24.99, max: 299.99 },
    stockRange: { min: 30, max: 120 },
  },
};

// Product descriptions templates
const descriptionTemplates = [
  "High-quality {category} {item} perfect for everyday use. Features premium materials and expert craftsmanship.",
  "Professional-grade {category} {item} designed for maximum performance and durability.",
  "Elegant and stylish {category} {item} that combines modern design with practical functionality.",
  "Premium {category} {item} made with attention to detail and superior materials.",
  "Versatile {category} {item} suitable for both professional and personal use.",
];

// Helper functions
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) =>
  Number((Math.random() * (max - min) + min).toFixed(2));
const randomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

// Generate a single product
const generateProduct = (category, categoryData) => {
  const prefix = randomElement(categoryData.prefixes);
  const item = randomElement(categoryData.items);
  const descTemplate = randomElement(descriptionTemplates);

  return {
    name: `${prefix} ${item}`,
    description: descTemplate
      .replace("{category}", category)
      .replace("{item}", item),
    price: randomFloat(
      categoryData.priceRange.min,
      categoryData.priceRange.max
    ),
    stock: randomInt(categoryData.stockRange.min, categoryData.stockRange.max),
  };
};

// Login function to get authentication token
const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/token/`, {
      username:"user123",
      password:"password123",
    });
    authToken = response.data.access;
    console.log("Successfully logged in");
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

// Function to add a single product
const addProduct = async (product) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products/`, product, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log(`Added product: ${product.name}`);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to add product ${product.name}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Main function to populate the database
const populateDatabase = async (productsPerCategory = 5) => {
  try {
    // First login to get token
    await login("user123", "password123");

    // Generate and add products for each category
    for (const [category, categoryData] of Object.entries(productCategories)) {
      console.log(`\nPopulating ${category} products...`);

      for (let i = 0; i < productsPerCategory; i++) {
        const product = generateProduct(category, categoryData);
        await addProduct(product);
        // Add small delay to prevent overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    console.log("\nDatabase population completed successfully!");
  } catch (error) {
    console.error("Database population failed:", error);
  }
};

// Execute the script
populateDatabase(25)
  .then(() => console.log("Script finished"))
  .catch((error) => console.error("Script failed:", error));
