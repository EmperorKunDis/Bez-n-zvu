#!/bin/bash

# Build script for all 4 websites
set -e

echo "Building all websites..."

# Build Design
echo "Building Design..."
cd pavel_jaros_design
bun install
bun run build
cd ..

# Build Rekonstrukce
echo "Building Rekonstrukce..."
cd pavel_jaros_rekonstrukce
bun install
bun run build
cd ..

# Build Reality
echo "Building Reality..."
cd pavel_jaros_reality
bun install
bun run build
cd ..

# Build Sprava
echo "Building Sprava..."
cd pavel_jaros_sprava
bun install
bun run build
cd ..

# Prepare deployment directory
echo "Preparing deployment directory..."
mkdir -p dist
cp -r pavel_jaros_design/out dist/design
cp -r pavel_jaros_rekonstrukce/out dist/rekonstrukce
cp -r pavel_jaros_reality/out dist/reality
cp -r pavel_jaros_sprava/out dist/sprava

# Create index.html
cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pavel Jaros - Portfolio</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 { color: #333; }
        ul { list-style: none; padding: 0; }
        li { margin: 15px 0; }
        a {
            display: block;
            padding: 15px;
            background: #f4f4f4;
            color: #333;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s;
        }
        a:hover { background: #ddd; }
    </style>
</head>
<body>
    <h1>Pavel Jaros - Portfolio</h1>
    <p>Vítejte na mém portfoliu. Vyberte si sekci:</p>
    <ul>
        <li><a href="design/">Design</a></li>
        <li><a href="rekonstrukce/">Rekonstrukce</a></li>
        <li><a href="reality/">Reality</a></li>
        <li><a href="sprava/">Správa</a></li>
    </ul>
</body>
</html>
EOF

echo "All websites built successfully!"
echo "Output directory: dist/"
