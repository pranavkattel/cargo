# Capital Cargo Backend - No Database Version

This version of the Capital Cargo backend has been updated to work without MongoDB or any external database. It uses in-memory mock data instead.

## Changes Made

### Removed Dependencies
- `mongodb` - No longer needed
- `mongoose` - No longer needed

### Updated Files
- `server.js` - Removed MongoDB connection logic
- `routes/tracking.js` - Updated to use mock data helpers
- `routes/shipments.js` - Updated to use mock data helpers
- `package.json` - Removed MongoDB dependencies
- Added `data/mockData.js` - Contains mock shipment data and helper functions

## Features

### Mock Data Includes
- 3 sample shipments with different statuses
- Complete tracking events for each shipment
- Customer information and shipment details

### API Endpoints Still Work
- `GET /api/health` - Health check
- `GET /api/shipments` - Get all shipments (with pagination, filtering)
- `GET /api/shipments/:id` - Get shipment by tracking ID
- `POST /api/shipments` - Create new shipment
- `PUT /api/shipments/:id` - Update shipment
- `PUT /api/shipments/:id/status` - Update shipment status
- `POST /api/shipments/:id/events` - Add tracking event
- `DELETE /api/shipments/:id` - Delete shipment
- `GET /api/track/:trackingId` - Track shipment
- `POST /api/track/batch` - Track multiple shipments

## Sample Tracking IDs for Testing
- `CC001234567` - In Transit (New York → London)
- `CC001234568` - Delivered (Los Angeles → Sydney)
- `CC001234569` - Pending Pickup (Singapore → Tokyo)

## Installation & Running

```bash
# Install dependencies
npm install

# Start server
npm start
# or
node server.js

# Server will run on port 5000
# http://localhost:5000
```

## Benefits of This Approach

1. **No Database Setup Required** - Works immediately without MongoDB installation
2. **Simple Deployment** - Can be deployed anywhere without database configuration
3. **Fast Development** - No database connection delays or setup complexity
4. **VPS Ready** - Perfect for simple VPS deployment without database management

## Data Persistence

Note: Since this uses in-memory data, all changes will be lost when the server restarts. This is perfect for:
- Development and testing
- Demo purposes
- Simple tracking systems with temporary data
- Environments where database setup is not desired

If you need data persistence in the future, you can easily add file-based storage or connect to a database by modifying the mock data helpers.
