# Capital Cargo Backend API

A Node.js/Express/MongoDB backend API for the Capital Cargo tracking system.

## Features

- **Shipment Tracking**: Track shipments by tracking ID
- **Shipment Management**: Create, read, update, and delete shipments
- **Event Tracking**: Add tracking events to shipments
- **RESTful API**: Well-structured REST endpoints
- **Data Validation**: MongoDB schema validation
- **Error Handling**: Comprehensive error handling and logging
- **Security**: Rate limiting, CORS, and security headers
- **Environment Configuration**: Configurable via environment variables

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env` and configure:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cargo-capital
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Start MongoDB**:
   - Local: `mongod`
   - Or use MongoDB Atlas cloud service

4. **Seed the database** (optional):
   ```bash
   npm run seed
   ```

5. **Start the server**:
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Tracking
- `GET /api/track/:trackingId` - Track shipment by ID
- `POST /api/track/batch` - Track multiple shipments

### Shipments
- `GET /api/shipments` - List all shipments (with pagination)
- `POST /api/shipments` - Create new shipment
- `GET /api/shipments/:id` - Get shipment by ID
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment
- `POST /api/shipments/:id/events` - Add tracking event

## Sample Tracking IDs

After running the seed script, you can test with these tracking IDs:
- `CC001TEST` - In transit shipment
- `CC002TEST` - Delivered shipment
- `CC003TEST` - Out for delivery shipment

## Data Models

### Shipment Schema
```javascript
{
  trackingId: String (unique),
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  shipmentDetails: {
    origin: String,
    destination: String,
    weight: Number,
    dimensions: { length, width, height },
    serviceType: String,
    description: String,
    value: Number
  },
  status: String,
  events: [TrackingEvent],
  estimatedDelivery: Date,
  actualDelivery: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Tracking Event Schema
```javascript
{
  status: String,
  description: String,
  location: String,
  timestamp: Date,
  completed: Boolean
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/cargo-capital |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## Development

### Project Structure
```
backend/
├── models/
│   └── Shipment.js          # MongoDB schema
├── routes/
│   ├── tracking.js          # Tracking endpoints
│   └── shipments.js         # Shipment CRUD endpoints
├── scripts/
│   └── seedData.js          # Database seeding
├── .env                     # Environment variables
├── server.js                # Main server file
└── package.json
```

### Testing the API

You can test the API using curl, Postman, or any HTTP client:

```bash
# Check health
curl http://localhost:5000/api/health

# Track a shipment
curl http://localhost:5000/api/track/CC001TEST

# Get all shipments
curl http://localhost:5000/api/shipments

# Create a new shipment
curl -X POST http://localhost:5000/api/shipments \\
  -H "Content-Type: application/json" \\
  -d '{
    "customerInfo": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "+1-555-0000",
      "address": "123 Test St"
    },
    "shipmentDetails": {
      "origin": "New York, NY",
      "destination": "Los Angeles, CA",
      "weight": 2.5,
      "serviceType": "standard",
      "description": "Test package"
    },
    "estimatedDelivery": "2024-12-31T23:59:59.000Z"
  }'
```

## Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: MongoDB schema validation
- **Error Handling**: Sanitized error responses

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Configure proper CORS origins
4. Set up process management (PM2, Docker, etc.)
5. Use HTTPS and proper SSL certificates
6. Set up monitoring and logging

## License

This project is part of the Capital Cargo tracking system.
