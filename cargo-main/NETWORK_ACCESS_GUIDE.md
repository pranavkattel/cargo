# 🌐 Network Access Setup Guide

## How to Access Cargo Capital from Other Devices

### Your Network Information:
- **Your Computer's IP**: `100.64.229.104` (Wi-Fi)
- **Alternative IPs**: `192.168.17.1`, `192.168.244.1` (VMware adapters)

### Access URLs:

#### **Frontend (Admin Panel)**
- **Local**: http://localhost:5173
- **From other devices**: http://100.64.229.104:5173

#### **Backend API**
- **Local**: http://localhost:5000
- **From other devices**: http://100.64.229.104:5000

### Quick Steps:

1. **Make sure both servers are running:**
   ```bash
   # Backend (in /backend folder)
   node server.js
   
   # Frontend (in main folder)  
   npm run dev
   ```

2. **From another device on the same network:**
   - Open browser and go to: `http://100.64.229.104:5173`
   - Login with: `admin@cargocapital.com` / `password123`

### Firewall Setup (if needed):

If you can't access from other devices, you may need to allow the ports through Windows Firewall:

1. **Windows Settings** → **Network & Internet** → **Windows Defender Firewall**
2. **Advanced Settings** → **Inbound Rules** → **New Rule**
3. **Port** → **TCP** → **Specific Local Ports**: `5000, 5173`
4. **Allow the connection** → **Apply to all profiles** → **Name**: "Cargo Capital"

### Mobile Access:

The admin panel works on mobile devices too! Just visit the same URL from your phone/tablet browser.

### Security Notes:

- ✅ **CORS is configured** to allow same-network access
- ✅ **Password hashing** is enabled for security
- ✅ **JWT authentication** protects admin routes
- ⚠️ **For production**: Change default password and use HTTPS

### Troubleshooting:

1. **Can't connect**: Check firewall settings
2. **CORS errors**: Restart backend server
3. **Login issues**: Use `admin@cargocapital.com` / `password123`
4. **IP changed**: Run `ipconfig` to get new IP address

---

**Happy tracking!** 🚚📱
