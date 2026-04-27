export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
  featured: boolean
}

export const products: Product[] = [
  {
    id: "vercel-tee-black",
    name: "Vercel Logo Tee - Black",
    price: 35,
    description: "Premium cotton t-shirt featuring the iconic Vercel triangle logo. Made from 100% organic cotton for ultimate comfort. Perfect for developers who ship fast.",
    image: "/products/tee-black.jpg",
    category: "Apparel",
    stock: 25,
    featured: true,
  },
  {
    id: "vercel-tee-white",
    name: "Vercel Logo Tee - White",
    price: 35,
    description: "Classic white t-shirt with the Vercel triangle logo. Lightweight, breathable fabric ideal for everyday wear. A wardrobe essential for any developer.",
    image: "/products/tee-white.jpg",
    category: "Apparel",
    stock: 18,
    featured: true,
  },
  {
    id: "vercel-hoodie",
    name: "Vercel Developer Hoodie",
    price: 75,
    description: "Stay warm while deploying with our premium developer hoodie. Features a minimal Vercel logo on the chest and a cozy fleece interior. Kangaroo pocket included.",
    image: "/products/hoodie.jpg",
    category: "Apparel",
    stock: 12,
    featured: true,
  },
  {
    id: "vercel-cap",
    name: "Vercel Triangle Cap",
    price: 28,
    description: "Structured cap with embroidered Vercel triangle logo. Adjustable strap for the perfect fit. Protect yourself from the sun while you code.",
    image: "/products/cap.jpg",
    category: "Accessories",
    stock: 30,
    featured: false,
  },
  {
    id: "vercel-mug",
    name: "Vercel Coffee Mug",
    price: 18,
    description: "Ceramic mug featuring the Vercel logo. 12oz capacity, dishwasher and microwave safe. Perfect for your morning coffee while reviewing deployments.",
    image: "/products/mug.jpg",
    category: "Drinkware",
    stock: 50,
    featured: true,
  },
  {
    id: "vercel-sticker-pack",
    name: "Vercel Sticker Pack",
    price: 12,
    description: "Collection of 10 premium vinyl stickers featuring Vercel logos and developer-themed designs. Weather-resistant and perfect for laptops, water bottles, and more.",
    image: "/products/stickers.jpg",
    category: "Accessories",
    stock: 100,
    featured: false,
  },
  {
    id: "vercel-notebook",
    name: "Vercel Developer Notebook",
    price: 22,
    description: "A5 hardcover notebook with dot grid pages. Features debossed Vercel logo on the cover. 192 pages of premium paper for sketching architectures and taking notes.",
    image: "/products/notebook.jpg",
    category: "Accessories",
    stock: 35,
    featured: false,
  },
  {
    id: "vercel-backpack",
    name: "Vercel Tech Backpack",
    price: 120,
    description: "Premium laptop backpack with dedicated 15-inch laptop compartment. Multiple pockets for organization, water-resistant material, and subtle Vercel branding.",
    image: "/products/backpack.jpg",
    category: "Bags",
    stock: 8,
    featured: true,
  },
  {
    id: "vercel-tote",
    name: "Vercel Canvas Tote",
    price: 25,
    description: "Durable canvas tote bag with Vercel logo print. Perfect for carrying your laptop, books, or groceries. Reinforced handles for everyday use.",
    image: "/products/tote.jpg",
    category: "Bags",
    stock: 40,
    featured: false,
  },
  {
    id: "vercel-water-bottle",
    name: "Vercel Insulated Bottle",
    price: 32,
    description: "Double-walled stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. 20oz capacity with laser-engraved Vercel logo.",
    image: "/products/bottle.jpg",
    category: "Drinkware",
    stock: 22,
    featured: false,
  },
  {
    id: "vercel-socks",
    name: "Vercel Developer Socks",
    price: 15,
    description: "Comfortable crew socks with Vercel triangle pattern. Made from a soft cotton blend. One size fits most. Perfect for long coding sessions.",
    image: "/products/socks.jpg",
    category: "Apparel",
    stock: 60,
    featured: false,
  },
  {
    id: "vercel-mousepad",
    name: "Vercel Desk Pad",
    price: 35,
    description: "Large desk pad featuring subtle Vercel branding. Smooth surface for precise mouse tracking. Non-slip rubber base. Dimensions: 80cm x 30cm.",
    image: "/products/mousepad.jpg",
    category: "Accessories",
    stock: 0,
    featured: false,
  },
]

export const categories = ["All", "Apparel", "Accessories", "Drinkware", "Bags"]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured)
}

export function searchProducts(query: string, category: string): Product[] {
  return products.filter((product) => {
    const matchesQuery = query
      ? product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      : true
    const matchesCategory = category === "All" ? true : product.category === category
    return matchesQuery && matchesCategory
  })
}
