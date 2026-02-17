require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const products = [
    // ELECTRONICS - Smartphones (10 products)
    {
        name: 'iPhone 15 Pro Max',
        description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
        price: 159900,
        originalPrice: 179900,
        discount: 11,
        category: 'Electronics',
        brand: 'Apple',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1592286927505-4fd30a732422?w=500'],
        ratings: { average: 4.8, count: 2340 },
        specifications: { 'Display': '6.7" Super Retina XDR', 'Processor': 'A17 Pro', 'RAM': '8GB', 'Storage': '256GB' }
    },
    {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Samsung flagship with S Pen, 200MP camera, and AI features',
        price: 129999,
        originalPrice: 149999,
        discount: 13,
        category: 'Electronics',
        brand: 'Samsung',
        stock: 45,
        images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'],
        ratings: { average: 4.7, count: 1890 },
        specifications: { 'Display': '6.8" Dynamic AMOLED', 'Processor': 'Snapdragon 8 Gen 3', 'RAM': '12GB', 'Storage': '256GB' }
    },
    {
        name: 'OnePlus 12',
        description: 'Flagship killer with Hasselblad camera and 100W fast charging',
        price: 64999,
        originalPrice: 69999,
        discount: 7,
        category: 'Electronics',
        brand: 'OnePlus',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'],
        ratings: { average: 4.6, count: 1234 },
        specifications: { 'Display': '6.82" AMOLED', 'Processor': 'Snapdragon 8 Gen 3', 'RAM': '12GB', 'Storage': '256GB' }
    },
    {
        name: 'Google Pixel 8 Pro',
        description: 'Pure Android experience with best-in-class camera and AI features',
        price: 106999,
        originalPrice: 119999,
        discount: 11,
        category: 'Electronics',
        brand: 'Google',
        stock: 35,
        images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500'],
        ratings: { average: 4.7, count: 890 },
        specifications: { 'Display': '6.7" LTPO OLED', 'Processor': 'Google Tensor G3', 'RAM': '12GB', 'Storage': '128GB' }
    },
    {
        name: 'Xiaomi 14',
        description: 'Leica camera system with Snapdragon 8 Gen 3 processor',
        price: 69999,
        originalPrice: 79999,
        discount: 13,
        category: 'Electronics',
        brand: 'Xiaomi',
        stock: 55,
        images: ['https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500'],
        ratings: { average: 4.5, count: 1567 },
        specifications: { 'Display': '6.36" AMOLED', 'Processor': 'Snapdragon 8 Gen 3', 'RAM': '12GB', 'Storage': '256GB' }
    },
    {
        name: 'iPhone 14 Pro',
        description: 'Dynamic Island, Always-On display, 48MP camera',
        price: 119900,
        originalPrice: 139900,
        discount: 14,
        category: 'Electronics',
        brand: 'Apple',
        stock: 40,
        images: ['https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=500'],
        ratings: { average: 4.7, count: 3456 },
        specifications: { 'Display': '6.1" Super Retina XDR', 'Processor': 'A16 Bionic', 'RAM': '6GB', 'Storage': '128GB' }
    },
    {
        name: 'Vivo X100 Pro',
        description: 'Zeiss optics with advanced night photography',
        price: 89999,
        originalPrice: 99999,
        discount: 10,
        category: 'Electronics',
        brand: 'Vivo',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500'],
        ratings: { average: 4.5, count: 890 },
        specifications: { 'Display': '6.78" AMOLED', 'Processor': 'MediaTek Dimensity 9300', 'RAM': '12GB', 'Storage': '256GB' }
    },
    {
        name: 'Realme GT 5 Pro',
        description: 'Flagship performance at mid-range price',
        price: 45999,
        originalPrice: 54999,
        discount: 16,
        category: 'Electronics',
        brand: 'Realme',
        stock: 70,
        images: ['https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500'],
        ratings: { average: 4.4, count: 2345 },
        specifications: { 'Display': '6.7" AMOLED', 'Processor': 'Snapdragon 8 Gen 2', 'RAM': '12GB', 'Storage': '256GB' }
    },
    {
        name: 'Nothing Phone 2',
        description: 'Unique Glyph interface with flagship specs',
        price: 44999,
        originalPrice: 49999,
        discount: 10,
        category: 'Electronics',
        brand: 'Nothing',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500'],
        ratings: { average: 4.5, count: 1678 },
        specifications: { 'Display': '6.7" LTPO AMOLED', 'Processor': 'Snapdragon 8+ Gen 1', 'RAM': '12GB', 'Storage': '256GB' }
    },
    {
        name: 'Motorola Edge 50 Pro',
        description: 'Clean Android with premium design',
        price: 35999,
        originalPrice: 39999,
        discount: 10,
        category: 'Electronics',
        brand: 'Motorola',
        stock: 55,
        images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500'],
        ratings: { average: 4.3, count: 1234 },
        specifications: { 'Display': '6.7" pOLED', 'Processor': 'Snapdragon 7 Gen 3', 'RAM': '8GB', 'Storage': '256GB' }
    },

    // ELECTRONICS - Laptops (10 products)
    {
        name: 'MacBook Pro M3',
        description: 'Apple MacBook Pro with M3 chip, stunning Liquid Retina XDR display',
        price: 169900,
        originalPrice: 189900,
        discount: 11,
        category: 'Electronics',
        brand: 'Apple',
        stock: 25,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
        ratings: { average: 4.9, count: 567 },
        specifications: { 'Display': '14" Liquid Retina XDR', 'Processor': 'Apple M3', 'RAM': '16GB', 'Storage': '512GB SSD' }
    },
    {
        name: 'Dell XPS 15',
        description: 'Premium Windows laptop with InfinityEdge display',
        price: 149999,
        originalPrice: 169999,
        discount: 12,
        category: 'Electronics',
        brand: 'Dell',
        stock: 30,
        images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500'],
        ratings: { average: 4.6, count: 890 },
        specifications: { 'Display': '15.6" FHD+', 'Processor': 'Intel i7 13th Gen', 'RAM': '16GB', 'Storage': '512GB SSD' }
    },
    {
        name: 'HP Pavilion Gaming',
        description: 'Gaming laptop with NVIDIA RTX graphics',
        price: 74999,
        originalPrice: 89999,
        discount: 17,
        category: 'Electronics',
        brand: 'HP',
        stock: 40,
        images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'],
        ratings: { average: 4.4, count: 1234 },
        specifications: { 'Display': '15.6" FHD 144Hz', 'Processor': 'AMD Ryzen 7', 'RAM': '16GB', 'Storage': '512GB SSD', 'GPU': 'RTX 3050' }
    },
    {
        name: 'Lenovo ThinkPad X1 Carbon',
        description: 'Business ultrabook with legendary keyboard',
        price: 134999,
        originalPrice: 149999,
        discount: 10,
        category: 'Electronics',
        brand: 'Lenovo',
        stock: 20,
        images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500'],
        ratings: { average: 4.7, count: 456 },
        specifications: { 'Display': '14" WUXGA', 'Processor': 'Intel i7 13th Gen', 'RAM': '16GB', 'Storage': '512GB SSD' }
    },
    {
        name: 'ASUS ROG Strix G15',
        description: 'High-performance gaming laptop',
        price: 119999,
        originalPrice: 139999,
        discount: 14,
        category: 'Electronics',
        brand: 'ASUS',
        stock: 35,
        images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'],
        ratings: { average: 4.6, count: 789 },
        specifications: { 'Display': '15.6" FHD 165Hz', 'Processor': 'AMD Ryzen 9', 'RAM': '16GB', 'Storage': '1TB SSD', 'GPU': 'RTX 4060' }
    },
    {
        name: 'MacBook Air M2',
        description: 'Thin, light, and powerful with M2 chip',
        price: 114900,
        originalPrice: 129900,
        discount: 12,
        category: 'Electronics',
        brand: 'Apple',
        stock: 45,
        images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500'],
        ratings: { average: 4.8, count: 2345 },
        specifications: { 'Display': '13.6" Liquid Retina', 'Processor': 'Apple M2', 'RAM': '8GB', 'Storage': '256GB SSD' }
    },
    {
        name: 'Acer Predator Helios 300',
        description: 'Gaming powerhouse with advanced cooling',
        price: 99999,
        originalPrice: 119999,
        discount: 17,
        category: 'Electronics',
        brand: 'Acer',
        stock: 30,
        images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500'],
        ratings: { average: 4.5, count: 1567 },
        specifications: { 'Display': '15.6" FHD 144Hz', 'Processor': 'Intel i7 12th Gen', 'RAM': '16GB', 'Storage': '512GB SSD', 'GPU': 'RTX 3060' }
    },
    {
        name: 'Microsoft Surface Laptop 5',
        description: 'Premium Windows laptop with touchscreen',
        price: 124999,
        originalPrice: 139999,
        discount: 11,
        category: 'Electronics',
        brand: 'Microsoft',
        stock: 25,
        images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500'],
        ratings: { average: 4.6, count: 890 },
        specifications: { 'Display': '13.5" PixelSense', 'Processor': 'Intel i7 12th Gen', 'RAM': '16GB', 'Storage': '512GB SSD' }
    },
    {
        name: 'Lenovo IdeaPad Gaming 3',
        description: 'Budget gaming laptop with solid performance',
        price: 64999,
        originalPrice: 79999,
        discount: 19,
        category: 'Electronics',
        brand: 'Lenovo',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'],
        ratings: { average: 4.3, count: 2345 },
        specifications: { 'Display': '15.6" FHD 120Hz', 'Processor': 'AMD Ryzen 5', 'RAM': '8GB', 'Storage': '512GB SSD', 'GPU': 'GTX 1650' }
    },
    {
        name: 'Asus VivoBook 15',
        description: 'Everyday laptop with modern design',
        price: 45999,
        originalPrice: 54999,
        discount: 16,
        category: 'Electronics',
        brand: 'ASUS',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500'],
        ratings: { average: 4.2, count: 3456 },
        specifications: { 'Display': '15.6" FHD', 'Processor': 'Intel i5 11th Gen', 'RAM': '8GB', 'Storage': '512GB SSD' }
    },

    // ELECTRONICS - Headphones (8 products)
    {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise cancellation',
        price: 29990,
        originalPrice: 34990,
        discount: 14,
        category: 'Electronics',
        brand: 'Sony',
        stock: 75,
        images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500'],
        ratings: { average: 4.8, count: 3456 },
        specifications: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth 5.2', 'Battery': '30 hours', 'ANC': 'Yes' }
    },
    {
        name: 'Apple AirPods Pro 2',
        description: 'Active noise cancellation with spatial audio',
        price: 24900,
        originalPrice: 26900,
        discount: 7,
        category: 'Electronics',
        brand: 'Apple',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500'],
        ratings: { average: 4.7, count: 5678 },
        specifications: { 'Type': 'In-Ear', 'Connectivity': 'Bluetooth', 'Battery': '6 hours', 'ANC': 'Yes' }
    },
    {
        name: 'Bose QuietComfort 45',
        description: 'Premium comfort with world-class noise cancellation',
        price: 28900,
        originalPrice: 32900,
        discount: 12,
        category: 'Electronics',
        brand: 'Bose',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'],
        ratings: { average: 4.6, count: 2345 },
        specifications: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth', 'Battery': '24 hours', 'ANC': 'Yes' }
    },
    {
        name: 'JBL Tune 770NC',
        description: 'Wireless over-ear headphones with ANC',
        price: 7999,
        originalPrice: 9999,
        discount: 20,
        category: 'Electronics',
        brand: 'JBL',
        stock: 120,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        ratings: { average: 4.3, count: 1890 },
        specifications: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth', 'Battery': '70 hours', 'ANC': 'Yes' }
    },
    {
        name: 'boAt Rockerz 450',
        description: 'Wireless Bluetooth headphones with extra bass',
        price: 1499,
        originalPrice: 2990,
        discount: 50,
        category: 'Electronics',
        brand: 'boAt',
        stock: 200,
        images: ['https://images.unsplash.com/photo-1577174881658-0f30157f72c4?w=500'],
        ratings: { average: 4.2, count: 12345 },
        specifications: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth', 'Battery': '15 hours', 'ANC': 'No' }
    },
    {
        name: 'Sennheiser Momentum 4',
        description: 'Audiophile-grade wireless headphones',
        price: 34990,
        originalPrice: 39990,
        discount: 13,
        category: 'Electronics',
        brand: 'Sennheiser',
        stock: 40,
        images: ['https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500'],
        ratings: { average: 4.7, count: 890 },
        specifications: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth 5.2', 'Battery': '60 hours', 'ANC': 'Yes' }
    },
    {
        name: 'Samsung Galaxy Buds 2 Pro',
        description: 'Premium TWS earbuds with 360 audio',
        price: 14990,
        originalPrice: 17990,
        discount: 17,
        category: 'Electronics',
        brand: 'Samsung',
        stock: 80,
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'],
        ratings: { average: 4.5, count: 2345 },
        specifications: { 'Type': 'In-Ear', 'Connectivity': 'Bluetooth 5.3', 'Battery': '5 hours', 'ANC': 'Yes' }
    },
    {
        name: 'Beats Studio Pro',
        description: 'Premium wireless headphones by Apple',
        price: 34900,
        originalPrice: 39900,
        discount: 13,
        category: 'Electronics',
        brand: 'Beats',
        stock: 45,
        images: ['https://images.unsplash.com/photo-1545127398-14699f92334b?w=500'],
        ratings: { average: 4.6, count: 1567 },
        specifications: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth', 'Battery': '40 hours', 'ANC': 'Yes' }
    },

    // FASHION - Footwear (8 products)
    {
        name: 'Nike Air Max 270',
        description: 'Iconic Air Max cushioning with breathable mesh',
        price: 12995,
        originalPrice: 14995,
        discount: 13,
        category: 'Fashion',
        brand: 'Nike',
        stock: 80,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
        ratings: { average: 4.6, count: 4567 },
        specifications: { 'Type': 'Running Shoes', 'Material': 'Mesh', 'Sole': 'Rubber' }
    },
    {
        name: 'Adidas Ultraboost 22',
        description: 'Premium running shoes with Boost cushioning',
        price: 16999,
        originalPrice: 18999,
        discount: 11,
        category: 'Fashion',
        brand: 'Adidas',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500'],
        ratings: { average: 4.7, count: 2890 },
        specifications: { 'Type': 'Running Shoes', 'Material': 'Primeknit', 'Sole': 'Continental Rubber' }
    },
    {
        name: 'Puma RS-X',
        description: 'Retro-inspired chunky sneakers',
        price: 7999,
        originalPrice: 9999,
        discount: 20,
        category: 'Fashion',
        brand: 'Puma',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500'],
        ratings: { average: 4.4, count: 1234 },
        specifications: { 'Type': 'Casual Shoes', 'Material': 'Synthetic', 'Sole': 'Rubber' }
    },
    {
        name: 'Reebok Classic Leather',
        description: 'Timeless design with premium leather',
        price: 5999,
        originalPrice: 7999,
        discount: 25,
        category: 'Fashion',
        brand: 'Reebok',
        stock: 90,
        images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'],
        ratings: { average: 4.5, count: 2345 },
        specifications: { 'Type': 'Casual Shoes', 'Material': 'Leather', 'Sole': 'Rubber' }
    },
    {
        name: 'New Balance 574',
        description: 'Classic sneakers with ENCAP cushioning',
        price: 8999,
        originalPrice: 10999,
        discount: 18,
        category: 'Fashion',
        brand: 'New Balance',
        stock: 70,
        images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=500'],
        ratings: { average: 4.5, count: 1890 },
        specifications: { 'Type': 'Casual Shoes', 'Material': 'Suede', 'Sole': 'Rubber' }
    },
    {
        name: 'Converse Chuck Taylor',
        description: 'Iconic canvas sneakers',
        price: 3999,
        originalPrice: 4999,
        discount: 20,
        category: 'Fashion',
        brand: 'Converse',
        stock: 150,
        images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500'],
        ratings: { average: 4.4, count: 5678 },
        specifications: { 'Type': 'Casual Shoes', 'Material': 'Canvas', 'Sole': 'Rubber' }
    },
    {
        name: 'Vans Old Skool',
        description: 'Classic skate shoes with waffle sole',
        price: 4499,
        originalPrice: 5499,
        discount: 18,
        category: 'Fashion',
        brand: 'Vans',
        stock: 120,
        images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500'],
        ratings: { average: 4.6, count: 3456 },
        specifications: { 'Type': 'Skate Shoes', 'Material': 'Canvas/Suede', 'Sole': 'Waffle Rubber' }
    },
    {
        name: 'Asics Gel-Kayano 30',
        description: 'Premium running shoes with GEL technology',
        price: 14999,
        originalPrice: 17999,
        discount: 17,
        category: 'Fashion',
        brand: 'Asics',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500'],
        ratings: { average: 4.7, count: 1234 },
        specifications: { 'Type': 'Running Shoes', 'Material': 'Mesh', 'Sole': 'Rubber' }
    },

    // HOME & KITCHEN (6 products)
    {
        name: 'Instant Pot Duo 7-in-1',
        description: 'Multi-use pressure cooker',
        price: 8999,
        originalPrice: 12999,
        discount: 31,
        category: 'Home & Kitchen',
        brand: 'Instant Pot',
        stock: 70,
        images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'],
        ratings: { average: 4.7, count: 12345 },
        specifications: { 'Capacity': '6 Liters', 'Functions': '7-in-1', 'Material': 'Stainless Steel' }
    },
    {
        name: 'Philips Air Fryer',
        description: 'Healthy cooking with Rapid Air technology',
        price: 9999,
        originalPrice: 14999,
        discount: 33,
        category: 'Home & Kitchen',
        brand: 'Philips',
        stock: 85,
        images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'],
        ratings: { average: 4.5, count: 8901 },
        specifications: { 'Capacity': '4.1 Liters', 'Power': '1400W', 'Material': 'Plastic' }
    },
    {
        name: 'Prestige Induction Cooktop',
        description: 'Energy-efficient induction cooktop',
        price: 2499,
        originalPrice: 3999,
        discount: 38,
        category: 'Home & Kitchen',
        brand: 'Prestige',
        stock: 120,
        images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500'],
        ratings: { average: 4.3, count: 5678 },
        specifications: { 'Power': '2000W', 'Control': 'Touch', 'Timer': 'Yes' }
    },
    {
        name: 'Bajaj Mixer Grinder',
        description: '750W mixer grinder with 3 jars',
        price: 3499,
        originalPrice: 5999,
        discount: 42,
        category: 'Home & Kitchen',
        brand: 'Bajaj',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500'],
        ratings: { average: 4.4, count: 6789 },
        specifications: { 'Power': '750W', 'Jars': '3', 'Material': 'Stainless Steel' }
    },
    {
        name: 'Kent RO Water Purifier',
        description: 'Advanced RO+UV+UF purification',
        price: 14999,
        originalPrice: 21999,
        discount: 32,
        category: 'Home & Kitchen',
        brand: 'Kent',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500'],
        ratings: { average: 4.6, count: 3456 },
        specifications: { 'Capacity': '8 Liters', 'Technology': 'RO+UV+UF', 'Storage': '8L' }
    },
    {
        name: 'Havells OTG Oven',
        description: 'Multi-function oven toaster griller',
        price: 5999,
        originalPrice: 8999,
        discount: 33,
        category: 'Home & Kitchen',
        brand: 'Havells',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'],
        ratings: { average: 4.4, count: 2345 },
        specifications: { 'Capacity': '28 Liters', 'Power': '1500W', 'Functions': 'Toast, Bake, Grill' }
    },

    // BOOKS (6 products)
    {
        name: 'Atomic Habits',
        description: 'An Easy & Proven Way to Build Good Habits',
        price: 399,
        originalPrice: 599,
        discount: 33,
        category: 'Books',
        brand: 'Penguin Random House',
        stock: 200,
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
        ratings: { average: 4.8, count: 15678 },
        specifications: { 'Author': 'James Clear', 'Pages': '320', 'Language': 'English' }
    },
    {
        name: 'Rich Dad Poor Dad',
        description: 'What the Rich Teach Their Kids About Money',
        price: 299,
        originalPrice: 450,
        discount: 34,
        category: 'Books',
        brand: 'Plata Publishing',
        stock: 250,
        images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'],
        ratings: { average: 4.7, count: 23456 },
        specifications: { 'Author': 'Robert Kiyosaki', 'Pages': '336', 'Language': 'English' }
    },
    {
        name: 'The Psychology of Money',
        description: 'Timeless lessons on wealth, greed, and happiness',
        price: 349,
        originalPrice: 499,
        discount: 30,
        category: 'Books',
        brand: 'Jaico Publishing',
        stock: 180,
        images: ['https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500'],
        ratings: { average: 4.7, count: 12345 },
        specifications: { 'Author': 'Morgan Housel', 'Pages': '256', 'Language': 'English' }
    },
    {
        name: 'Think and Grow Rich',
        description: 'The classic guide to success',
        price: 199,
        originalPrice: 299,
        discount: 33,
        category: 'Books',
        brand: 'Fingerprint Publishing',
        stock: 300,
        images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500'],
        ratings: { average: 4.6, count: 18901 },
        specifications: { 'Author': 'Napoleon Hill', 'Pages': '320', 'Language': 'English' }
    },
    {
        name: 'The Alchemist',
        description: 'A magical fable about following your dreams',
        price: 299,
        originalPrice: 399,
        discount: 25,
        category: 'Books',
        brand: 'HarperCollins',
        stock: 220,
        images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500'],
        ratings: { average: 4.8, count: 25678 },
        specifications: { 'Author': 'Paulo Coelho', 'Pages': '208', 'Language': 'English' }
    },
    {
        name: 'Sapiens',
        description: 'A Brief History of Humankind',
        price: 449,
        originalPrice: 599,
        discount: 25,
        category: 'Books',
        brand: 'Vintage',
        stock: 150,
        images: ['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500'],
        ratings: { average: 4.7, count: 14567 },
        specifications: { 'Author': 'Yuval Noah Harari', 'Pages': '512', 'Language': 'English' }
    },

    // SPORTS (4 products)
    {
        name: 'Boldfit Gym Shaker',
        description: 'Leak-proof protein shaker',
        price: 299,
        originalPrice: 599,
        discount: 50,
        category: 'Sports',
        brand: 'Boldfit',
        stock: 300,
        images: ['https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500'],
        ratings: { average: 4.3, count: 8901 },
        specifications: { 'Capacity': '700ml', 'Material': 'BPA Free Plastic', 'Features': 'Leak-proof' }
    },
    {
        name: 'Strauss Yoga Mat',
        description: 'Anti-skid exercise mat',
        price: 599,
        originalPrice: 1299,
        discount: 54,
        category: 'Sports',
        brand: 'Strauss',
        stock: 150,
        images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
        ratings: { average: 4.4, count: 5678 },
        specifications: { 'Size': '6mm thick', 'Material': 'NBR', 'Dimensions': '183 x 61 cm' }
    },
    {
        name: 'Nivia Football',
        description: 'Professional quality football',
        price: 599,
        originalPrice: 999,
        discount: 40,
        category: 'Sports',
        brand: 'Nivia',
        stock: 200,
        images: ['https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500'],
        ratings: { average: 4.2, count: 3456 },
        specifications: { 'Size': '5', 'Material': 'PVC', 'Type': 'Training' }
    },
    {
        name: 'Cosco Cricket Bat',
        description: 'Kashmir willow cricket bat',
        price: 1299,
        originalPrice: 1999,
        discount: 35,
        category: 'Sports',
        brand: 'Cosco',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500'],
        ratings: { average: 4.3, count: 2345 },
        specifications: { 'Material': 'Kashmir Willow', 'Size': 'Full', 'Weight': '1100-1200g' }
    },

    // BEAUTY (4 products)
    {
        name: 'Lakme Lipstick',
        description: 'Matte finish lipstick',
        price: 499,
        originalPrice: 650,
        discount: 23,
        category: 'Beauty',
        brand: 'Lakme',
        stock: 250,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500'],
        ratings: { average: 4.3, count: 6789 },
        specifications: { 'Type': 'Matte Lipstick', 'Shade': 'Red Rush', 'Volume': '3.6g' }
    },
    {
        name: 'Mamaearth Face Wash',
        description: 'Natural face wash with vitamin C',
        price: 299,
        originalPrice: 399,
        discount: 25,
        category: 'Beauty',
        brand: 'Mamaearth',
        stock: 300,
        images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500'],
        ratings: { average: 4.4, count: 12345 },
        specifications: { 'Type': 'Face Wash', 'Ingredients': 'Vitamin C, Turmeric', 'Volume': '100ml' }
    },
    {
        name: 'Gillette Fusion Razor',
        description: 'Precision trimmer with 5 blades',
        price: 399,
        originalPrice: 599,
        discount: 33,
        category: 'Beauty',
        brand: 'Gillette',
        stock: 200,
        images: ['https://images.unsplash.com/photo-1564182379166-8fcfdda80151?w=500'],
        ratings: { average: 4.5, count: 8901 },
        specifications: { 'Type': 'Manual Razor', 'Blades': '5', 'Features': 'Precision Trimmer' }
    },
    {
        name: 'Nivea Body Lotion',
        description: 'Deep moisture body lotion',
        price: 249,
        originalPrice: 349,
        discount: 29,
        category: 'Beauty',
        brand: 'Nivea',
        stock: 350,
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
        ratings: { average: 4.4, count: 9876 },
        specifications: { 'Type': 'Body Lotion', 'Skin Type': 'All', 'Volume': '400ml' }
    }
    ,

    // MOBILE (6 products)
    {
        name: 'iPhone 15',
        description: 'A16 Bionic, advanced dual‑camera system, and Dynamic Island',
        price: 79900,
        originalPrice: 89900,
        discount: 11,
        category: 'Mobile',
        brand: 'Apple',
        stock: 80,
        images: ['https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500'],
        ratings: { average: 4.7, count: 4321 },
        specifications: { 'Display': '6.1" OLED', 'Processor': 'A16 Bionic', 'RAM': '6GB', 'Storage': '128GB' }
    },
    {
        name: 'Samsung Galaxy A55',
        description: 'Balanced performance with Super AMOLED display',
        price: 32999,
        originalPrice: 36999,
        discount: 11,
        category: 'Mobile',
        brand: 'Samsung',
        stock: 120,
        images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'],
        ratings: { average: 4.4, count: 2100 },
        specifications: { 'Display': '6.6" Super AMOLED', 'Processor': 'Exynos', 'RAM': '8GB', 'Storage': '128GB' }
    },
    {
        name: 'Redmi Note 13 Pro',
        description: 'Value-packed phone with 200MP camera',
        price: 24999,
        originalPrice: 27999,
        discount: 11,
        category: 'Mobile',
        brand: 'Redmi',
        stock: 150,
        images: ['https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500'],
        ratings: { average: 4.3, count: 5400 },
        specifications: { 'Display': '6.67" AMOLED', 'Processor': 'Snapdragon 7s Gen 2', 'RAM': '8GB', 'Storage': '256GB' }
    },
    {
        name: 'OnePlus Nord 3',
        description: 'Fluid AMOLED and fast charging',
        price: 27999,
        originalPrice: 32999,
        discount: 15,
        category: 'Mobile',
        brand: 'OnePlus',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'],
        ratings: { average: 4.5, count: 3800 },
        specifications: { 'Display': '6.74" AMOLED 120Hz', 'Processor': 'Dimensity 9000', 'RAM': '8GB', 'Storage': '128GB' }
    },
    {
        name: 'Realme Narzo 70',
        description: 'Budget performer with large display',
        price: 14999,
        originalPrice: 17999,
        discount: 17,
        category: 'Mobile',
        brand: 'Realme',
        stock: 200,
        images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500'],
        ratings: { average: 4.2, count: 2200 },
        specifications: { 'Display': '6.72" IPS 120Hz', 'Processor': 'Dimensity 6100+', 'RAM': '6GB', 'Storage': '128GB' }
    },
    {
        name: 'Moto G64 5G',
        description: 'Clean Android with big battery',
        price: 13999,
        originalPrice: 16999,
        discount: 18,
        category: 'Mobile',
        brand: 'Motorola',
        stock: 180,
        images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500'],
        ratings: { average: 4.1, count: 1800 },
        specifications: { 'Display': '6.5" IPS 120Hz', 'Processor': 'Dimensity 7025', 'RAM': '6GB', 'Storage': '128GB' }
    },

    // COMPUTERS (6 products)
    {
        name: 'HP Pavilion Desktop',
        description: 'Everyday desktop PC for home and office',
        price: 42999,
        originalPrice: 49999,
        discount: 14,
        category: 'Computers',
        brand: 'HP',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=500'],
        ratings: { average: 4.2, count: 900 },
        specifications: { 'CPU': 'Intel i5', 'RAM': '8GB', 'Storage': '512GB SSD' }
    },
    {
        name: 'LG UltraFine 27" 4K Monitor',
        description: 'Sharp 4K IPS monitor for creators',
        price: 29999,
        originalPrice: 34999,
        discount: 14,
        category: 'Computers',
        brand: 'LG',
        stock: 60,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
        ratings: { average: 4.6, count: 1300 },
        specifications: { 'Resolution': '3840x2160', 'Panel': 'IPS', 'Refresh Rate': '60Hz' }
    },
    {
        name: 'Logitech MX Keys',
        description: 'Premium wireless keyboard with backlit keys',
        price: 9999,
        originalPrice: 12999,
        discount: 23,
        category: 'Computers',
        brand: 'Logitech',
        stock: 150,
        images: ['https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=500'],
        ratings: { average: 4.8, count: 5600 },
        specifications: { 'Connectivity': 'Bluetooth/USB', 'Backlight': 'Yes', 'Layout': 'Full-size' }
    },
    {
        name: 'Logitech MX Master 3S',
        description: 'Ergonomic wireless mouse with MagSpeed wheel',
        price: 7999,
        originalPrice: 9999,
        discount: 20,
        category: 'Computers',
        brand: 'Logitech',
        stock: 180,
        images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'],
        ratings: { average: 4.7, count: 4200 },
        specifications: { 'Sensor': 'Darkfield', 'DPI': '8000', 'Battery': 'USB-C Rechargeable' }
    },
    {
        name: 'Samsung 990 EVO 1TB SSD',
        description: 'Fast NVMe SSD for quick boot and load times',
        price: 9999,
        originalPrice: 12999,
        discount: 23,
        category: 'Computers',
        brand: 'Samsung',
        stock: 220,
        images: ['https://images.unsplash.com/photo-1611269106161-1cedaf879848?w=500'],
        ratings: { average: 4.8, count: 3100 },
        specifications: { 'Form Factor': 'M.2', 'Interface': 'PCIe 4.0 x4', 'Capacity': '1TB' }
    },
    {
        name: 'TP-Link Archer AX55 Router',
        description: 'Wi‑Fi 6 dual-band router',
        price: 6999,
        originalPrice: 8999,
        discount: 22,
        category: 'Computers',
        brand: 'TP-Link',
        stock: 140,
        images: ['https://images.unsplash.com/photo-1583470882139-04a3ab8c4e8d?w=500'],
        ratings: { average: 4.5, count: 2400 },
        specifications: { 'Wi‑Fi': '802.11ax', 'Bands': 'Dual', 'Speed': '3000 Mbps' }
    },

    // TOYS (6 products)
    {
        name: 'LEGO Classic Bricks Box',
        description: 'Creative building set with assorted bricks',
        price: 2999,
        originalPrice: 3499,
        discount: 14,
        category: 'Toys',
        brand: 'LEGO',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1585366119957-e9730b6d0f5c?w=500'],
        ratings: { average: 4.8, count: 5600 },
        specifications: { 'Age': '4+', 'Pieces': '500+', 'Material': 'ABS Plastic' }
    },
    {
        name: 'Hot Wheels 10-Pack',
        description: 'Die-cast cars set for kids',
        price: 1199,
        originalPrice: 1499,
        discount: 20,
        category: 'Toys',
        brand: 'Hot Wheels',
        stock: 200,
        images: ['https://images.unsplash.com/photo-1603539240359-665a856275c5?w=500'],
        ratings: { average: 4.6, count: 4300 },
        specifications: { 'Age': '3+', 'Material': 'Metal/Plastic', 'Type': 'Vehicles' }
    },
    {
        name: 'Barbie Fashionista Doll',
        description: 'Posable doll with outfit and accessories',
        price: 1499,
        originalPrice: 1999,
        discount: 25,
        category: 'Toys',
        brand: 'Barbie',
        stock: 180,
        images: ['https://images.unsplash.com/photo-1607457561908-8e1b30e3f2f0?w=500'],
        ratings: { average: 4.5, count: 2900 },
        specifications: { 'Age': '3+', 'Material': 'Plastic', 'Height': '12 inch' }
    },
    {
        name: 'Rubik’s Cube 3x3',
        description: 'Classic 3x3 speed cube',
        price: 299,
        originalPrice: 399,
        discount: 25,
        category: 'Toys',
        brand: 'Rubik’s',
        stock: 300,
        images: ['https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=500'],
        ratings: { average: 4.7, count: 7200 },
        specifications: { 'Age': '6+', 'Type': 'Puzzle', 'Material': 'ABS Plastic' }
    },
    {
        name: 'Nerf Elite Disruptor',
        description: '6-dart rotating drum blaster',
        price: 1299,
        originalPrice: 1699,
        discount: 24,
        category: 'Toys',
        brand: 'Nerf',
        stock: 160,
        images: ['https://images.unsplash.com/photo-1596495578065-8a1b3b1d2a9a?w=500'],
        ratings: { average: 4.4, count: 2500 },
        specifications: { 'Age': '8+', 'Darts': '6', 'Range': 'Up to 90 ft' }
    },
    {
        name: 'UNO Card Game',
        description: 'Classic family card game',
        price: 249,
        originalPrice: 349,
        discount: 29,
        category: 'Toys',
        brand: 'Mattel',
        stock: 400,
        images: ['https://images.unsplash.com/photo-1602482617871-8903f19bd6d3?w=500'],
        ratings: { average: 4.6, count: 8400 },
        specifications: { 'Players': '2-10', 'Age': '7+', 'Type': 'Card Game' }
    },

    // GROCERY (6 products)
    {
        name: 'India Gate Basmati Rice 5kg',
        description: 'Premium aged basmati rice with long grains',
        price: 749,
        originalPrice: 899,
        discount: 17,
        category: 'Grocery',
        brand: 'India Gate',
        stock: 300,
        images: ['https://images.unsplash.com/photo-1604908554027-3518203b3d59?w=500'],
        ratings: { average: 4.6, count: 5600 },
        specifications: { 'Weight': '5kg', 'Type': 'Basmati', 'Origin': 'India' }
    },
    {
        name: 'Aashirvaad Atta 10kg',
        description: 'Whole wheat flour for soft rotis',
        price: 499,
        originalPrice: 599,
        discount: 17,
        category: 'Grocery',
        brand: 'Aashirvaad',
        stock: 280,
        images: ['https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=500'],
        ratings: { average: 4.5, count: 4700 },
        specifications: { 'Weight': '10kg', 'Type': 'Whole Wheat', 'Protein': '12%' }
    },
    {
        name: 'Fortune Sunflower Oil 5L',
        description: 'Refined sunflower oil for everyday cooking',
        price: 749,
        originalPrice: 899,
        discount: 17,
        category: 'Grocery',
        brand: 'Fortune',
        stock: 260,
        images: ['https://images.unsplash.com/photo-1604908812143-8a9a5f02c293?w=500'],
        ratings: { average: 4.4, count: 3100 },
        specifications: { 'Volume': '5L', 'Type': 'Sunflower', 'Refined': 'Yes' }
    },
    {
        name: 'Tata Sampann Toor Dal 1kg',
        description: 'Unpolished arhar dal rich in protein',
        price: 169,
        originalPrice: 199,
        discount: 15,
        category: 'Grocery',
        brand: 'Tata Sampann',
        stock: 500,
        images: ['https://images.unsplash.com/photo-1543330715-9b7fdb262a5b?w=500'],
        ratings: { average: 4.6, count: 6500 },
        specifications: { 'Weight': '1kg', 'Type': 'Toor Dal', 'Polished': 'No' }
    },
    {
        name: 'Taj Mahal Tea 1kg',
        description: 'Strong and aromatic premium tea',
        price: 549,
        originalPrice: 649,
        discount: 15,
        category: 'Grocery',
        brand: 'Brooke Bond',
        stock: 320,
        images: ['https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500'],
        ratings: { average: 4.5, count: 4200 },
        specifications: { 'Weight': '1kg', 'Type': 'CTC', 'Aroma': 'Strong' }
    },
    {
        name: 'Nescafé Classic 200g',
        description: 'Instant coffee with rich aroma',
        price: 329,
        originalPrice: 399,
        discount: 18,
        category: 'Grocery',
        brand: 'Nescafé',
        stock: 280,
        images: ['https://images.unsplash.com/photo-1503077205613-5ee3b3a56f58?w=500'],
        ratings: { average: 4.4, count: 3900 },
        specifications: { 'Weight': '200g', 'Type': 'Instant', 'Roast': 'Medium' }
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create users (passwords will be hashed by User model's pre-save hook)
        const superAdmin = await User.create({
            name: 'GenZmart Super Admin',
            email: 'superadmin@genz-mart.in',
            password: 'Hemraj@2002#',
            role: 'superadmin'
        });

        const mainAdmin = await User.create({
            name: 'GenZmart Admin',
            email: 'admin@genz-mart.in',
            password: 'Hemraj@2002#',
            role: 'admin'
        });

        const seller = await User.create({
            name: 'GenZmart Seller',
            email: 'seller@genz-mart.in',
            password: 'Hemraj@2002#',
            role: 'seller',
            sellerInfo: {
                businessName: 'GenZmart Store',
                businessAddress: 'Kathmandu, Nepal',
                approved: true,
                approvedBy: superAdmin._id,
                approvedAt: Date.now()
            }
        });

        const user = await User.create({
            name: 'John Doe',
            email: 'user@example.com',
            password: 'user123',
            avatar: 'https://via.placeholder.com/150'
        });

        console.log('👤 Super Admin created (superadmin@genz-mart.in)');
        console.log('👤 Admin user created (admin@genz-mart.in)');
        console.log('👤 Seller user created (seller@genz-mart.in)');
        console.log('👤 Sample user created');

        // Insert products
        await Product.insertMany(products);
        console.log(`📦 ${products.length} products inserted`);

        console.log('\n✨ Database seeded successfully!');
        console.log('\n📝 Login Credentials:');
        console.log(`Super Admin - Email: superadmin@genz-mart.in, Password: Hemraj@2002#`);
        console.log(`Admin       - Email: admin@genz-mart.in, Password: Hemraj@2002#`);
        console.log(`Seller      - Email: seller@genz-mart.in, Password: Hemraj@2002#`);
        console.log(`User        - Email: user@example.com, Password: user123`);
        console.log(`\n📊 Total Products: ${products.length}`);
        console.log(`📂 Categories: Electronics, Fashion, Home & Kitchen, Books, Sports, Beauty, Mobile, Computers, Toys, Grocery`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
