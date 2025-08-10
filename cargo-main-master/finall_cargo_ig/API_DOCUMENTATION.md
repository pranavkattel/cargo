# 🔌 Cargo Capital API Documentation

## Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://your-backend-domain.com`

## Authentication
Currently, the API uses basic rate limiting. JWT authentication is prepared but not enforced for the tracking endpoints.

## Rate Limiting
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Response Format
All API responses follow this structure:

```json
{
  "success": boolean,
  "data": object | array | null,
  "message": string,
  "error": string | null
}
```

## Endpoints

### 1. Health Check
Check if the API is running and database status.

```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "database": "connected",
    "uptime": "2h 15m 30s"
  },
  "message": "API is healthy"
}
```

### 2. Track Shipment
Get tracking information for a specific shipment.

```http
GET /api/track/:trackingId
```

**Parameters:**
- `trackingId` (string, required): The tracking ID to look up

**Example Request:**
```http
GET /api/track/CC001TEST
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65a5f1b2c3d4e5f6a7b8c9d0",
    "trackingId": "CC001TEST",
    "customerInfo": {
      "name": "John Smith",
      "email": "john.smith@email.com",
      "phone": "+1-555-0123",
      "address": "123 Main St, New York, NY 10001"
    },
    "shipmentDetails": {
      "origin": "New York, NY",
      "destination": "Los Angeles, CA",
      "weight": 5.2,
      "dimensions": {
        "length": 12,
        "width": 8,
        "height": 6
      },
      "serviceType": "express",
      "description": "Electronics - Laptop Computer",
      "value": 1200
    },
    "status": "in transit",
    "events": [
      {
        "status": "order placed",
        "location": "New York, NY",
        "timestamp": "2024-01-10T09:00:00.000Z",
        "description": "Shipment order has been placed and confirmed",
        "_id": "65a5f1b2c3d4e5f6a7b8c9d1"
      },
      {
        "status": "picked up",
        "location": "New York, NY",
        "timestamp": "2024-01-10T14:30:00.000Z",
        "description": "Package picked up from sender",
        "_id": "65a5f1b2c3d4e5f6a7b8c9d2"
      }
    ],
    "createdAt": "2024-01-10T09:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Shipment found successfully"
}
```

**Not Found Response (404):**
```json
{
  "success": false,
  "data": null,
  "message": "Shipment not found",
  "error": "No shipment found with tracking ID: INVALID123"
}
```

### 3. Get All Shipments (Admin)
Retrieve all shipments for admin dashboard.

```http
GET /api/admin/shipments
```

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `status` (string, optional): Filter by status
- `search` (string, optional): Search in tracking ID or customer name

**Example Request:**
```http
GET /api/admin/shipments?page=1&limit=5&status=in transit
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "shipments": [
      {
        "_id": "65a5f1b2c3d4e5f6a7b8c9d0",
        "trackingId": "CC001TEST",
        "customerInfo": {
          "name": "John Smith"
        },
        "status": "in transit",
        "createdAt": "2024-01-10T09:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 15,
      "itemsPerPage": 5,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Shipments retrieved successfully"
}
```

### 4. Create Shipment (Admin)
Create a new shipment.

```http
POST /api/admin/shipments
```

**Request Body:**
```json
{
  "trackingId": "CC004TEST",
  "customerInfo": {
    "name": "Jane Doe",
    "email": "jane.doe@email.com",
    "phone": "+1-555-0124",
    "address": "456 Oak St, Chicago, IL 60601"
  },
  "shipmentDetails": {
    "origin": "Chicago, IL",
    "destination": "Miami, FL",
    "weight": 3.5,
    "dimensions": {
      "length": 10,
      "width": 6,
      "height": 4
    },
    "serviceType": "standard",
    "description": "Documents",
    "value": 50
  },
  "status": "pending"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65a5f1b2c3d4e5f6a7b8c9d3",
    "trackingId": "CC004TEST",
    "customerInfo": {
      "name": "Jane Doe",
      "email": "jane.doe@email.com",
      "phone": "+1-555-0124",
      "address": "456 Oak St, Chicago, IL 60601"
    },
    "shipmentDetails": {
      "origin": "Chicago, IL",
      "destination": "Miami, FL",
      "weight": 3.5,
      "dimensions": {
        "length": 10,
        "width": 6,
        "height": 4
      },
      "serviceType": "standard",
      "description": "Documents",
      "value": 50
    },
    "status": "pending",
    "events": [
      {
        "status": "order placed",
        "location": "Chicago, IL",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "description": "Shipment order has been placed and confirmed",
        "_id": "65a5f1b2c3d4e5f6a7b8c9d4"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Shipment created successfully"
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "data": null,
  "message": "Validation error",
  "error": "Tracking ID already exists"
}
```

### 5. Update Shipment (Admin)
Update an existing shipment.

```http
PUT /api/admin/shipments/:id
```

**Parameters:**
- `id` (string, required): MongoDB ObjectId of the shipment

**Request Body:** (All fields optional)
```json
{
  "status": "in transit",
  "newEvent": {
    "status": "in transit",
    "location": "Chicago, IL - Distribution Center",
    "description": "Package arrived at distribution center"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65a5f1b2c3d4e5f6a7b8c9d3",
    "trackingId": "CC004TEST",
    "status": "in transit",
    "events": [
      {
        "status": "order placed",
        "location": "Chicago, IL",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "description": "Shipment order has been placed and confirmed"
      },
      {
        "status": "in transit",
        "location": "Chicago, IL - Distribution Center",
        "timestamp": "2024-01-15T11:00:00.000Z",
        "description": "Package arrived at distribution center"
      }
    ],
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Shipment updated successfully"
}
```

### 6. Delete Shipment (Admin)
Delete a shipment.

```http
DELETE /api/admin/shipments/:id
```

**Parameters:**
- `id` (string, required): MongoDB ObjectId of the shipment

**Success Response (200):**
```json
{
  "success": true,
  "data": null,
  "message": "Shipment deleted successfully"
}
```

**Not Found Response (404):**
```json
{
  "success": false,
  "data": null,
  "message": "Shipment not found",
  "error": "No shipment found with ID: 65a5f1b2c3d4e5f6a7b8c9d5"
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

## Status Values

Valid shipment status values:
- `pending` - Order placed, not yet processed
- `confirmed` - Order confirmed and ready for pickup
- `picked up` - Package collected from sender
- `in transit` - Package is being transported
- `out for delivery` - Package is with delivery agent
- `delivered` - Package successfully delivered
- `failed delivery` - Delivery attempt failed
- `returned` - Package returned to sender
- `cancelled` - Shipment cancelled

## Service Types

Valid service type values:
- `standard` - Standard delivery (5-7 business days)
- `express` - Express delivery (2-3 business days)
- `overnight` - Overnight delivery (next business day)
- `international` - International shipping

## Mock Data

When database is not available, the API returns mock data for these tracking IDs:
- `CC001TEST` - In Transit shipment
- `CC002TEST` - Delivered shipment
- `CC003TEST` - Out for Delivery shipment

## CORS Configuration

The API accepts requests from:
- `http://localhost:5173` (development)
- Your configured `CORS_ORIGIN` environment variable (production)

## Example Usage

### JavaScript (Frontend)
```javascript
// Track a shipment
const trackShipment = async (trackingId) => {
  try {
    const response = await fetch(`${API_URL}/api/track/${trackingId}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Tracking error:', error);
    throw error;
  }
};

// Create a shipment (admin)
const createShipment = async (shipmentData) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/shipments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipmentData),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Create shipment error:', error);
    throw error;
  }
};
```

### cURL Examples
```bash
# Track a shipment
curl -X GET "http://localhost:5000/api/track/CC001TEST"

# Get all shipments (admin)
curl -X GET "http://localhost:5000/api/admin/shipments?page=1&limit=10"

# Create a shipment (admin)
curl -X POST "http://localhost:5000/api/admin/shipments" \
  -H "Content-Type: application/json" \
  -d '{
    "trackingId": "CC005TEST",
    "customerInfo": {
      "name": "Test Customer",
      "email": "test@example.com",
      "phone": "+1-555-0100"
    },
    "shipmentDetails": {
      "origin": "City A",
      "destination": "City B",
      "weight": 1.0,
      "serviceType": "standard"
    },
    "status": "pending"
  }'
```

---

**Need help with the API?** Check the deployment guide or contact support!
