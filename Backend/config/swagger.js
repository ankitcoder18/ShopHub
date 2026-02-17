// Manual Swagger spec for Vercel compatibility
const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'ShopHub E-Commerce API',
        version: '1.0.0',
        description: 'Complete API documentation for ShopHub e-commerce platform',
        contact: {
            name: 'ShopHub Support',
            email: 'support@shophub.in',
            url: 'https://shophub.vercel.app'
        },
        license: {
            name: 'ISC'
        }
    },
    servers: [
        {
            url: 'http://localhost:5000/api',
            description: 'Development Server'
        },
        {
            url: 'https://apisshophub.vercel.app/api',
            description: 'Production Server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter your JWT token'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john@example.com' },
                    role: { type: 'string', enum: ['user', 'seller', 'admin'], example: 'user' },
                    avatar: { type: 'string', example: 'https://example.com/avatar.jpg' }
                }
            },
            Product: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    originalPrice: { type: 'number' },
                    discount: { type: 'number' },
                    category: { type: 'string' },
                    brand: { type: 'string' },
                    images: { type: 'array', items: { type: 'string' } },
                    stock: { type: 'number' },
                    ratings: {
                        type: 'object',
                        properties: {
                            average: { type: 'number' },
                            count: { type: 'number' }
                        }
                    }
                }
            },
            CartItem: {
                type: 'object',
                properties: {
                    product: { type: 'string' },
                    quantity: { type: 'number' },
                    price: { type: 'number' }
                }
            },
            Order: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    user: { type: 'string' },
                    items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
                    totalAmount: { type: 'number' },
                    status: { type: 'string', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
                    shippingAddress: { type: 'object' },
                    paymentMethod: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string' },
                    error: { type: 'string' }
                }
            }
        }
    },
    tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Products', description: 'Product management' },
        { name: 'Cart', description: 'Shopping cart operations' },
        { name: 'Orders', description: 'Order management' },
        { name: 'Payment', description: 'Payment processing' },
        { name: 'Users', description: 'User profile management' },
        { name: 'Admin', description: 'Admin operations' },
        { name: 'Seller', description: 'Seller operations' }
    ],
    paths: {
        '/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Register a new user',
                description: 'Create a new user account',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'email', 'password'],
                                properties: {
                                    name: { type: 'string', example: 'John Doe' },
                                    email: { type: 'string', example: 'john@example.com' },
                                    password: { type: 'string', example: 'password123' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'User registered successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        token: { type: 'string' },
                                        user: { $ref: '#/components/schemas/User' }
                                    }
                                }
                            }
                        }
                    },
                    '400': { description: 'Invalid input or user already exists' },
                    '500': { description: 'Server error' }
                }
            }
        },
        '/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'User login',
                description: 'Authenticate user and return JWT token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', example: 'john@example.com' },
                                    password: { type: 'string', example: 'password123' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean', example: true },
                                        token: { type: 'string' },
                                        user: { $ref: '#/components/schemas/User' }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Invalid credentials' },
                    '500': { description: 'Server error' }
                }
            }
        },
        '/products': {
            get: {
                tags: ['Products'],
                summary: 'Get all products',
                description: 'Retrieve products with filtering, search, and pagination',
                parameters: [
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 12 } },
                    { in: 'query', name: 'search', schema: { type: 'string' } },
                    { in: 'query', name: 'category', schema: { type: 'string' } },
                    { in: 'query', name: 'minPrice', schema: { type: 'number' } },
                    { in: 'query', name: 'maxPrice', schema: { type: 'number' } },
                    { in: 'query', name: 'sort', schema: { type: 'string', enum: ['newest', 'price-low', 'price-high', 'rating'] } }
                ],
                responses: {
                    '200': {
                        description: 'Products retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                                        pagination: {
                                            type: 'object',
                                            properties: {
                                                page: { type: 'number' },
                                                pages: { type: 'number' },
                                                total: { type: 'number' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/products/{id}': {
            get: {
                tags: ['Products'],
                summary: 'Get product by ID',
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': {
                        description: 'Product found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        product: { $ref: '#/components/schemas/Product' }
                                    }
                                }
                            }
                        }
                    },
                    '404': { description: 'Product not found' }
                }
            }
        },
        '/cart': {
            get: {
                tags: ['Cart'],
                summary: 'Get user cart',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Cart retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        cart: {
                                            type: 'object',
                                            properties: {
                                                items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
                                                totalAmount: { type: 'number' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Unauthorized' }
                }
            },
            post: {
                tags: ['Cart'],
                summary: 'Add item to cart',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['productId'],
                                properties: {
                                    productId: { type: 'string' },
                                    quantity: { type: 'number', default: 1 }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Item added to cart' },
                    '400': { description: 'Insufficient stock' },
                    '401': { description: 'Unauthorized' },
                    '404': { description: 'Product not found' }
                }
            },
            delete: {
                tags: ['Cart'],
                summary: 'Clear cart',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': { description: 'Cart cleared' },
                    '401': { description: 'Unauthorized' }
                }
            }
        },
        '/cart/{itemId}': {
            put: {
                tags: ['Cart'],
                summary: 'Update cart item quantity',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: 'path', name: 'itemId', required: true, schema: { type: 'string' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['quantity'],
                                properties: {
                                    quantity: { type: 'number', minimum: 1 }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Cart updated' },
                    '400': { description: 'Insufficient stock' },
                    '401': { description: 'Unauthorized' },
                    '404': { description: 'Item not found' }
                }
            },
            delete: {
                tags: ['Cart'],
                summary: 'Remove item from cart',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: 'path', name: 'itemId', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': { description: 'Item removed' },
                    '401': { description: 'Unauthorized' },
                    '404': { description: 'Item not found' }
                }
            }
        },
        '/orders': {
            post: {
                tags: ['Orders'],
                summary: 'Create new order',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['shippingAddress', 'paymentMethod'],
                                properties: {
                                    shippingAddress: {
                                        type: 'object',
                                        properties: {
                                            fullName: { type: 'string' },
                                            phone: { type: 'string' },
                                            address: { type: 'string' },
                                            city: { type: 'string' },
                                            state: { type: 'string' },
                                            pincode: { type: 'string' }
                                        }
                                    },
                                    paymentMethod: { type: 'string', enum: ['razorpay', 'cod'] }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': { description: 'Order created successfully' },
                    '400': { description: 'Cart is empty or invalid data' },
                    '401': { description: 'Unauthorized' }
                }
            },
            get: {
                tags: ['Orders'],
                summary: 'Get user orders',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } }
                ],
                responses: {
                    '200': {
                        description: 'Orders retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        orders: { type: 'array', items: { $ref: '#/components/schemas/Order' } }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Unauthorized' }
                }
            }
        },
        '/orders/{id}': {
            get: {
                tags: ['Orders'],
                summary: 'Get order by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': { description: 'Order found' },
                    '401': { description: 'Unauthorized' },
                    '404': { description: 'Order not found' }
                }
            }
        },
        '/payment/settings': {
            get: {
                tags: ['Payment'],
                summary: 'Get payment settings',
                description: 'Retrieve Razorpay configuration',
                responses: {
                    '200': {
                        description: 'Payment settings retrieved',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        razorpayEnabled: { type: 'boolean' },
                                        codEnabled: { type: 'boolean' },
                                        razorpayKeyId: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/payment/create-order': {
            post: {
                tags: ['Payment'],
                summary: 'Create Razorpay order',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['amount'],
                                properties: {
                                    amount: { type: 'number', description: 'Amount in rupees' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Razorpay order created' },
                    '401': { description: 'Unauthorized' },
                    '500': { description: 'Payment gateway error' }
                }
            }
        },
        '/payment/verify-payment': {
            post: {
                tags: ['Payment'],
                summary: 'Verify Razorpay payment',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature', 'orderId'],
                                properties: {
                                    razorpay_order_id: { type: 'string' },
                                    razorpay_payment_id: { type: 'string' },
                                    razorpay_signature: { type: 'string' },
                                    orderId: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Payment verified successfully' },
                    '400': { description: 'Invalid signature' },
                    '401': { description: 'Unauthorized' }
                }
            }
        },
        '/users/profile': {
            get: {
                tags: ['Users'],
                summary: 'Get user profile',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': { description: 'Profile retrieved' },
                    '401': { description: 'Unauthorized' }
                }
            },
            put: {
                tags: ['Users'],
                summary: 'Update user profile',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    phone: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Profile updated' },
                    '401': { description: 'Unauthorized' }
                }
            }
        },
        '/admin/seller-requests': {
            get: {
                tags: ['Admin'],
                summary: 'Get all seller requests',
                description: 'Get pending seller approval requests',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Seller requests retrieved',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        sellers: { type: 'array' }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Admin access required' }
                }
            }
        },
        '/admin/approve-seller/{id}': {
            put: {
                tags: ['Admin'],
                summary: 'Approve seller request',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'User ID' }
                ],
                responses: {
                    '200': { description: 'Seller approved successfully' },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Admin access required' },
                    '404': { description: 'User not found' }
                }
            }
        },
        '/admin/reject-seller/{id}': {
            put: {
                tags: ['Admin'],
                summary: 'Reject seller request',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    reason: { type: 'string', example: 'Incomplete documents' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Seller request rejected' },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Admin access required' }
                }
            }
        },
        '/admin/users': {
            get: {
                tags: ['Admin'],
                summary: 'Get all users',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Users retrieved',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        users: { type: 'array', items: { $ref: '#/components/schemas/User' } }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Admin access required' }
                }
            }
        },
        '/admin/sellers': {
            get: {
                tags: ['Admin'],
                summary: 'Get all sellers',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': { description: 'Sellers retrieved' },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Admin access required' }
                }
            }
        },
        '/admin/pending-products': {
            get: {
                tags: ['Admin'],
                summary: 'Get pending product approvals',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Pending products retrieved',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        products: { type: 'array', items: { $ref: '#/components/schemas/Product' } }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Admin access required' }
                }
            }
        },
        '/admin/approve-product/{id}': {
            put: {
                tags: ['Admin'],
                summary: 'Approve product',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Product ID' }
                ],
                responses: {
                    '200': { description: 'Product approved' },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Admin access required' },
                    '404': { description: 'Product not found' }
                }
            }
        },
        '/admin/reject-product/{id}': {
            delete: {
                tags: ['Admin'],
                summary: 'Reject/Delete product',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': { description: 'Product rejected' },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Admin access required' }
                }
            }
        },
        '/seller/request': {
            post: {
                tags: ['Seller'],
                summary: 'Request to become a seller',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['businessName', 'businessAddress'],
                                properties: {
                                    businessName: { type: 'string', example: 'My Store' },
                                    businessAddress: { type: 'string', example: '123 Main St, City' },
                                    gstNumber: { type: 'string', example: '22AAAAA0000A1Z5' },
                                    bankDetails: {
                                        type: 'object',
                                        properties: {
                                            accountNumber: { type: 'string' },
                                            ifscCode: { type: 'string' },
                                            bankName: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Seller request submitted' },
                    '400': { description: 'Already a seller or pending request exists' },
                    '401': { description: 'Unauthorized' }
                }
            }
        },
        '/seller/dashboard': {
            get: {
                tags: ['Seller'],
                summary: 'Get seller dashboard stats',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Dashboard stats retrieved',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        stats: {
                                            type: 'object',
                                            properties: {
                                                totalProducts: { type: 'number' },
                                                approvedProducts: { type: 'number' },
                                                pendingProducts: { type: 'number' },
                                                totalOrders: { type: 'number' },
                                                totalRevenue: { type: 'number' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Seller access required' }
                }
            }
        },
        '/seller/products': {
            get: {
                tags: ['Seller'],
                summary: 'Get seller products',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Seller products retrieved',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        products: { type: 'array', items: { $ref: '#/components/schemas/Product' } }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Seller access required' }
                }
            },
            post: {
                tags: ['Seller'],
                summary: 'Add new product',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'description', 'price', 'category', 'brand', 'stock'],
                                properties: {
                                    name: { type: 'string' },
                                    description: { type: 'string' },
                                    price: { type: 'number' },
                                    originalPrice: { type: 'number' },
                                    category: { type: 'string' },
                                    brand: { type: 'string' },
                                    stock: { type: 'number' },
                                    images: { type: 'array', items: { type: 'string' } }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': { description: 'Product created (pending approval)' },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Seller access required' }
                }
            }
        },
        '/seller/products/{id}': {
            put: {
                tags: ['Seller'],
                summary: 'Update seller product',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    description: { type: 'string' },
                                    price: { type: 'number' },
                                    stock: { type: 'number' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Product updated' },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Not authorized to update this product' },
                    '404': { description: 'Product not found' }
                }
            },
            delete: {
                tags: ['Seller'],
                summary: 'Delete seller product',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    '200': { description: 'Product deleted' },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Not authorized to delete this product' },
                    '404': { description: 'Product not found' }
                }
            }
        },
        '/seller/orders': {
            get: {
                tags: ['Seller'],
                summary: 'Get orders containing seller products',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Orders retrieved',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        orders: { type: 'array', items: { $ref: '#/components/schemas/Order' } }
                                    }
                                }
                            }
                        }
                    },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Seller access required' }
                }
            }
        }
    }
};

module.exports = swaggerSpec;
