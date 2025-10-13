# Property Management System - Quick Start Guide

## 🚀 5-Minute Setup

### 1. Start the System

```bash
# Terminal 1: Start Next.js
bun run dev

# Terminal 2: Start property watcher
bun run watch-properties
```

You should see:
```
[WATCHER] Starting Property Watcher...
[WATCHER] Watching directory: /path/to/nemovitosti
[WATCHER] ✓ Ready - monitoring for changes
```

### 2. Add Your First Property

Create a test property:

```bash
cd nemovitosti/Prodej
mkdir Test_Property
cd Test_Property
```

Create `data.md`:

```markdown
# Testovací Nemovitost
## Prodej bytu 2+kk

---

### Popis

Krásný byt v centru Prahy. Kompletně zrekonstruovaný, nové okna, podlahy.

---

img.01, img.02, img.03

---

**2+kk** dispozice

**65** plocha

**3** podlaží

---

youtubeURL : https://youtu.be/example

---

### PODROBNÉ INFORMACE

| | |
|---|---|
| **Adresa** | Testovací 123, Praha |
| **Typ** | Byt |
| **Stav** | Velmi dobrý |
| **Cena** | 5 000 000 Kč |

---

googleMap : <iframe src="https://www.google.com/maps/embed..."></iframe>
```

Add images (download or create placeholders):
```bash
# Add at least img00.jpg (main image)
curl -o img00.jpg https://picsum.photos/800/600
curl -o img01.jpg https://picsum.photos/800/600
curl -o img02.jpg https://picsum.photos/800/600
```

### 3. Watch the Magic ✨

The watcher will automatically:
- Detect the new folder
- Parse `data.md`
- Validate the data
- Add it to the database

You'll see logs like:
```
[WATCHER] → New directory detected: nemovitosti/Prodej/Test_Property
[WATCHER] + Creating property: Test_Property
[DB] ✓ Created property: Test_Property (PRODEJ)
[WATCHER] ✓ Property created: Test_Property (PRODEJ)
```

### 4. View on Website

Open `http://localhost:3000/api/properties` to see your property in the API response.

Or fetch it in your frontend:

```typescript
const properties = await fetch('/api/properties?status=PRODEJ')
  .then(res => res.json());

console.log(properties);
```

### 5. Test Status Change

Move the property to "Hotovo" (sold):

```bash
mv nemovitosti/Prodej/Test_Property nemovitosti/Hotovo/
```

Watch logs:
```
[WATCHER] → Directory removed: nemovitosti/Prodej/Test_Property
[WATCHER] → New directory detected: nemovitosti/Hotovo/Test_Property
[WATCHER] ↔ Detected move: Test_Property (PRODEJ → HOTOVO)
[DB] ✓ Updated property: Test_Property
[WATCHER] ✓ Property moved: Test_Property (PRODEJ → HOTOVO)
```

### 6. Test Update

Edit `data.md` and save:

```bash
nano nemovitosti/Hotovo/Test_Property/data.md
# Change price or description
```

Watch logs:
```
[WATCHER] → File changed: nemovitosti/Hotovo/Test_Property/data.md
[WATCHER] ↻ Updating property: Test_Property
[DB] ✓ Updated property: Test_Property
[WATCHER] ✓ Property updated: Test_Property
```

## 🎯 Common Tasks

### Add New Property

```bash
# 1. Create folder
mkdir nemovitosti/Prodej/New_Property_Name

# 2. Copy byt.md as template
cp byt.md nemovitosti/Prodej/New_Property_Name/data.md

# 3. Edit data.md with property info
# 4. Add images (img00.jpg, img01.jpg, ...)
# 5. Watcher automatically adds it to database
```

### Delete Property

```bash
rm -rf nemovitosti/Prodej/Property_Name
# Watcher automatically removes from database
```

### Change Status

```bash
# From Prodej to Hotovo:
mv nemovitosti/Prodej/Property_Name nemovitosti/Hotovo/

# From Pronajem to Hotovo:
mv nemovitosti/Pronajem/Property_Name nemovitosti/Hotovo/
```

### View Database

```bash
bun run db:studio
# Opens Prisma Studio in browser
```

### Check API

```bash
# All properties
curl http://localhost:3000/api/properties

# Only sales
curl http://localhost:3000/api/properties?status=PRODEJ

# Specific property
curl http://localhost:3000/api/properties/Test_Property

# Statistics
curl http://localhost:3000/api/properties/stats
```

## 🐛 Troubleshooting

### Property Not Showing Up?

Check watcher logs for errors:
```
[WATCHER] ✗ Invalid property folder Test_Property:
  - data.md file not found
```

### Fix Common Issues:

1. **Missing data.md**:
   ```bash
   # Add data.md to the folder
   ```

2. **Missing img00.jpg**:
   ```bash
   # Add at least img00.jpg (main image)
   ```

3. **Invalid data.md format**:
   ```bash
   # Check that it follows the template in byt.md
   # Must have # title, ## subtitle, description, etc.
   ```

### Restart Watcher

If something is stuck:

```bash
# Stop watcher (Ctrl+C)
# Restart
bun run watch-properties
```

The watcher will re-scan all folders on startup.

## 📊 Production Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start watcher as background process
pm2 start "bun run watch-properties" --name property-watcher

# Start Next.js
pm2 start "bun run start" --name nextjs-app

# View logs
pm2 logs property-watcher

# Auto-start on reboot
pm2 startup
pm2 save
```

### Using systemd

Create `/etc/systemd/system/property-watcher.service`:

```ini
[Unit]
Description=Property Watcher
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/pavel_jaros_reality
ExecStart=/usr/bin/bun run watch-properties
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable property-watcher
sudo systemctl start property-watcher
sudo systemctl status property-watcher
```

## 🎉 You're All Set!

Now you can manage properties by simply:
1. Creating/editing folders in `nemovitosti/`
2. Adding `data.md` and images
3. Moving folders to change status

The website updates automatically! No code changes needed.
