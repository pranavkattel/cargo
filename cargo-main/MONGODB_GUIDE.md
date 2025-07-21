# MongoDB Integration Guide for Cargo Capital

## Overview
Your Cargo Capital system now supports MongoDB as the primary database. This guide will help you set up and use MongoDB with your tracking system.

## 🚀 Quick Setup

### 1. Configure MongoDB Connection
1. Open the `.env` file in the backend directory
2. Update the `MONGODB_URI` with your actual connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cargo-capital?retryWrites=true&w=majority
   ```
3. Make sure the database name is `cargo-capital`

### 2. Test Your Connection
```bash
npm run test:mongodb
```

### 3. Start the Server
```bash
npm start
```

## 📊 MongoDB Atlas Setup

### Step 1: Create Database
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in to your account
3. Select your cluster
4. Click "Browse Collections"
5. Click "Create Database"
6. Database name: `cargo-capital`
7. Collection name: `shipments`

### Step 2: Configure Access
1. **Database Access**: Create a user with read/write permissions
2. **Network Access**: Add your IP address (or 0.0.0.0/0 for all IPs)
3. **Connection**: Get your connection string

### Step 3: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<username>`, `<password>`, and `<database>` with your values

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run setup:mongodb` | Interactive MongoDB setup |
| `npm run test:mongodb` | Test MongoDB connection |
| `npm run migrate:mongodb` | Migrate data from file storage |
| `npm start` | Start server with MongoDB |

## 🔄 Data Migration

If you have existing data in file storage, you can migrate it to MongoDB:

```bash
npm run migrate:mongodb
```

This will:
- Check for existing file storage data
- Connect to MongoDB
- Transfer all shipments and tracking events
- Preserve all data integrity

## 📁 Storage Configuration

You can switch between storage types by updating the `.env` file:

```env
# Use MongoDB (recommended for production)
STORAGE_TYPE=mongodb

# Use file storage (good for development)
STORAGE_TYPE=file

# Use memory storage (data lost on restart)
STORAGE_TYPE=memory
```

## 🗃️ Database Schema

### Shipments Collection
```javascript
{
  _id: ObjectId,
  trackingId: String (unique, uppercase),
  status: String (enum),
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  shipmentDetails: {
    origin: String,
    destination: String,
    weight: String,
    dimensions: String,
    service: String,
    estimatedDelivery: Date
  },
  trackingEvents: [{
    id: String,
    status: String,
    description: String,
    location: String,
    timestamp: Date,
    completed: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔍 Features

### Automatic Sample Data
- If the database is empty, sample shipments are created automatically
- Includes test tracking ID: `CC001234567`

### Indexing
- Optimized queries with indexes on:
  - `trackingId` (unique)
  - `status`
  - `customerInfo.email`
  - `createdAt`

### Error Handling
- Connection retry logic
- Graceful fallback to file storage if MongoDB is unavailable
- Detailed error logging

## 🔧 Production Deployment

### Environment Variables
```env
STORAGE_TYPE=mongodb
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cargo-capital
NODE_ENV=production
PORT=5000
```

### MongoDB Atlas Production Settings
1. **Security**: Use strong passwords and limit IP access
2. **Backup**: Enable automatic backups
3. **Monitoring**: Set up alerts for connection issues
4. **Scaling**: Configure auto-scaling if needed

## 🚨 Troubleshooting

### Connection Issues
1. **Check credentials**: Verify username/password
2. **Network access**: Ensure your IP is whitelisted
3. **Database name**: Confirm it's `cargo-capital`
4. **Firewall**: Check if port 27017 is blocked

### Common Errors
- `ServerSelectionTimeoutError`: Network/authentication issue
- `MongoParseError`: Invalid connection string format
- `ValidationError`: Data doesn't match schema

### Debug Commands
```bash
# Test connection
npm run test:mongodb

# Check environment
echo $MONGODB_URI

# View logs
npm start 2>&1 | grep -i mongo
```

## 📈 Performance

### Scalability
- Supports 100,000+ shipments efficiently
- Optimized queries with proper indexing
- Connection pooling for concurrent requests

### Monitoring
- Built-in stats endpoint: `GET /api/stats`
- Returns database connection status and document counts

## 🔄 Switching Storage Types

You can easily switch between storage types without code changes:

1. **To MongoDB**: Set `STORAGE_TYPE=mongodb` in `.env`
2. **To File**: Set `STORAGE_TYPE=file` in `.env`
3. **To Memory**: Set `STORAGE_TYPE=memory` in `.env`

The system will automatically use the appropriate storage adapter.

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your MongoDB Atlas configuration
3. Test the connection with `npm run test:mongodb`
4. Check server logs for detailed error messages

Your Cargo Capital system is now ready to use MongoDB for reliable, scalable data storage! 🎉
