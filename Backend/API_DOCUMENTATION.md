# ShopHub API Documentation

**Base URL:** `http://localhost:5000/api` (Development) or `https://apisgenzmart.vercel.app/api` (Production)

**Authentication:** Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Routes

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "609c3e6b5e9f0e2b4c8d9e0f",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://via.placeholder.com/150"
  }
}
```

---

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "609c3e6b5e9f0e2b4c8d9e0f",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### POST /auth/google
Google OAuth login.

**Request Body:**
```json
{
  "token": "google_id_token"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Google login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "609c3e6b5e9f0e2b4c8d9e0f",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### GET /auth/me
Get current authenticated user details.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "609c3e6b5e9f0e2b4c8d9e0f",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 🛍️ Products Routes

### GET /products
Get all products with pagination and filters.

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 12)
- `category` (string) - Filter by category
- `search` (string) - Search products by name

**Response:** `200 OK`
```json
{
  "success": true,
  "products": [
    {
      "id": "609c3e6b5e9f0e2b4c8d9e0f",
      "name": "Product Name",
      "description": "Product description",
      "price": 999,
      "image": "image_url",
      "category": "Electronics",
      "rating": 4.5,
      "reviews": 10,
      "stock": 50
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

---

### GET /products/:id
Get single product details.

**Response:** `200 OK`
```json
{
  "success": true,
  "product": {
    "id": "609c3e6b5e9f0e2b4c8d9e0f",
    "name": "Product Name",
    "description": "Product description",
    "price": 999,
    "image": "image_url",
    "category": "Electronics",
    "rating": 4.5,
    "reviews": [
      {
        "userId": "user_id",
        "username": "John Doe",
        "rating": 5,
        "comment": "Great product!"
      }
    ]
  }
}
```

---

### POST /products
Create new product (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 999,
  "category": "Electronics",
  "image": "image_url",
  "stock": 50
}
```

**Response:** `201 Created`

---

### PUT /products/:id
Update product (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Updated Name",
  "price": 1099,
  "stock": 45
}
```

**Response:** `200 OK`

---

### DELETE /products/:id
Delete product (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### POST /products/:id/reviews
Add review to product.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent product!"
}
```

**Response:** `201 Created`

---

## 🛒 Cart Routes

### GET /cart
Get user's shopping cart.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "id": "item_id",
        "productId": "product_id",
        "name": "Product Name",
        "price": 999,
        "quantity": 2,
        "image": "image_url"
      }
    ],
    "total": 1998
  }
}
```

---

### POST /cart
Add item to cart.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "609c3e6b5e9f0e2b4c8d9e0f",
  "quantity": 2
}
```

**Response:** `201 Created`

---

### PUT /cart/:itemId
Update cart item quantity.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:** `200 OK`

---

### DELETE /cart/:itemId
Remove item from cart.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

### DELETE /cart
Clear entire cart.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## 📦 Orders Routes

### POST /orders
Create new order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "items": [
    {
      "productId": "609c3e6b5e9f0e2b4c8d9e0f",
      "quantity": 2
    }
  ],
  "shippingAddress": "309 3rd Floor The Atlanta Business Hub, Nana Chiloda, Ahmedabad, Gujarat 382330",
  "paymentMethod": "razorpay"
}
```

**Response:** `201 Created`

---

### GET /orders
Get user's orders.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page

**Response:** `200 OK`
```json
{
  "success": true,
  "orders": [
    {
      "id": "order_id",
      "items": [...],
      "total": 1998,
      "status": "confirmed",
      "createdAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

---

### GET /orders/:id
Get single order details.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### PUT /orders/:id/cancel
Cancel order.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### PUT /orders/:id/confirm
Confirm order (After payment).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "paymentId": "razorpay_payment_id"
}
```

**Response:** `200 OK`

---

## 👤 User Routes

### GET /users/profile
Get user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "609c3e6b5e9f0e2b4c8d9e0f",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 8091780737",
    "addresses": []
  }
}
```

---

### PUT /users/profile
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "phone": "+91 9876543210"
}
```

**Response:** `200 OK`

---

### PUT /users/password
Change password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:** `200 OK`

---

### POST /users/upload-avatar
Upload user avatar.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Form-data with `avatar` file

**Response:** `200 OK`

---

### POST /users/address
Add new address.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "street": "123 Main St",
  "city": "Ahmedabad",
  "state": "Gujarat",
  "zipCode": "382330",
  "country": "India",
  "isDefault": true
}
```

**Response:** `201 Created`

---

### PUT /users/address/:addressId
Update address.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as POST

**Response:** `200 OK`

---

### DELETE /users/address/:addressId
Delete address.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### POST /users/wishlist/:productId
Add product to wishlist.

**Headers:** `Authorization: Bearer <token>`

**Response:** `201 Created`

---

### DELETE /users/wishlist/:productId
Remove product from wishlist.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### GET /users/wishlist
Get user's wishlist.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "wishlist": [
    {
      "id": "product_id",
      "name": "Product Name",
      "price": 999
    }
  ]
}
```

---

## 🏪 Seller Routes

### POST /seller/request
Request to become seller.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "storeName": "My Store",
  "description": "Store description",
  "category": "Electronics"
}
```

**Response:** `201 Created`

---

### GET /seller/dashboard
Get seller dashboard data (Seller only).

**Headers:** `Authorization: Bearer <seller_token>`

**Response:** `200 OK`

---

### GET /seller/products
Get seller's products (Seller only).

**Headers:** `Authorization: Bearer <seller_token>`

**Response:** `200 OK`

---

### POST /seller/products
Add product (Seller only).

**Headers:** `Authorization: Bearer <seller_token>`

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Description",
  "price": 999,
  "category": "Electronics",
  "image": "image_url",
  "stock": 50
}
```

**Response:** `201 Created`

---

### PUT /seller/products/:id
Update seller product.

**Headers:** `Authorization: Bearer <seller_token>`

**Response:** `200 OK`

---

### DELETE /seller/products/:id
Delete seller product.

**Headers:** `Authorization: Bearer <seller_token>`

**Response:** `200 OK`

---

### GET /seller/orders
Get seller's orders.

**Headers:** `Authorization: Bearer <seller_token>`

**Response:** `200 OK`

---

## 💰 Payment Routes

### GET /payment/settings
Get payment settings.

**Response:** `200 OK`
```json
{
  "success": true,
  "settings": {
    "razorpayKey": "rzp_test_xxxx"
  }
}
```

---

### PUT /payment/settings
Update payment settings (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "razorpayKey": "new_key",
  "razorpaySecret": "new_secret"
}
```

**Response:** `200 OK`

---

### POST /payment/create-order
Create Razorpay order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 1998,
  "currency": "INR"
}
```

**Response:** `201 Created`

---

### POST /payment/verify-payment
Verify payment after Razorpay callback.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature"
}
```

**Response:** `200 OK`

---

## 🔔 Notifications Routes

### GET /notifications
Get user notifications.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### PUT /notifications/:id/read
Mark notification as read.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### PUT /notifications/mark-all-read
Mark all notifications as read.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## ⚙️ Admin Routes

### GET /admin/seller-requests
Get all seller requests.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

---

### PUT /admin/approve-seller/:id
Approve seller request.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

---

### PUT /admin/reject-seller/:id
Reject seller request.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

---

### GET /admin/users
Get all users.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

---

### GET /admin/sellers
Get all sellers.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

---

### GET /admin/pending-products
Get pending products for approval.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

---

### PUT /admin/approve-product/:id
Approve product.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

---

### DELETE /admin/reject-product/:id
Reject product.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

---

## 🔑 Authentication Types

- **Public Endpoints:** No authentication required
- **Protected Endpoints:** Require valid JWT token
- **Admin Endpoints:** Require JWT token with admin role
- **Seller Endpoints:** Require JWT token with seller role

---

## Error Responses

All endpoints may return error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## Rate Limiting & Best Practices

1. Always include JWT token in Authorization header for protected routes
2. Use appropriate HTTP methods (GET, POST, PUT, DELETE)
3. Send data as JSON with `Content-Type: application/json`
4. Handle error responses appropriately
5. Implement retry logic for failed requests
6. Cache responses where appropriate

---

**Last Updated:** December 17, 2025
**API Version:** 1.0
**Contact:** support@genz-mart.in
