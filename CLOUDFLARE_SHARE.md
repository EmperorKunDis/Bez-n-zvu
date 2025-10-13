# Cloudflare Tunnel - Sdílení z lokálního PC

Tento návod vám ukáže, jak sdílet všechny 4 weby přímo z vašeho lokálního počítače pomocí Cloudflare Tunnel.

## Výhody
- Zcela zdarma
- Žádná registrace na GitHubu
- Bezpečné HTTPS spojení
- Sdílení během pár sekund

## Nevýhody
- Váš počítač musí běžet, aby byly weby dostupné
- URL se mění při každém spuštění
- Vhodné pro krátkodobé sdílení nebo testování

## Jak to funguje

1. Buildne všechny 4 weby do adresáře `dist/`
2. Spustí lokální web server na portu 8080
3. Vytvoří Cloudflare Tunnel, který zpřístupní server na veřejné URL

## Použití

### Jednoduchý způsob (vše najednou):

```bash
./cloudflare-share.sh
```

Tento script:
1. Buildne všechny weby
2. Spustí lokální server
3. Vytvoří Cloudflare Tunnel
4. Zobrazí veřejnou URL, na které jsou weby dostupné

### Vaše weby budou dostupné na:

Pokud například Cloudflare vygeneruje URL: `https://example-abc123.trycloudflare.com`

Pak budete mít:
- **Hlavní stránka**: `https://example-abc123.trycloudflare.com/`
- **Design**: `https://example-abc123.trycloudflare.com/design`
- **Rekonstrukce**: `https://example-abc123.trycloudflare.com/rekonstrukce`
- **Reality**: `https://example-abc123.trycloudflare.com/reality`
- **Správa**: `https://example-abc123.trycloudflare.com/sprava`

### Ukončení:

Pro ukončení sdílení stiskněte `Ctrl+C` v terminálu.

## Alternativní způsob (krok po kroku):

### 1. Buildnout weby:
```bash
./build-all.sh
```

### 2. Spustit lokální server (v jednom terminálu):
```bash
cd dist
python3 -m http.server 8080
```

### 3. Spustit Cloudflare Tunnel (v druhém terminálu):
```bash
cloudflared tunnel --url http://localhost:8080
```

Cloudflare vám zobrazí veřejnou URL, na které jsou vaše weby dostupné.

## Trvalé řešení (doporučeno)

Pro trvalé řešení doporučuji použít **Cloudflare Pages** (zdarma):

### Cloudflare Pages nasazení:

1. Vytvořte účet na [Cloudflare](https://dash.cloudflare.com/sign-up)

2. Buildněte všechny weby:
```bash
./build-all.sh
```

3. Nainstalujte Wrangler (Cloudflare CLI):
```bash
bun add -g wrangler
```

4. Přihlaste se:
```bash
wrangler login
```

5. Deployujte:
```bash
wrangler pages deploy dist --project-name=pavel-jaros-portfolio
```

Vaše weby pak budou trvale dostupné na: `https://pavel-jaros-portfolio.pages.dev`

## Další bezplatné alternativy

### 1. Netlify
```bash
# Nainstalujte Netlify CLI
bun add -g netlify-cli

# Buildněte
./build-all.sh

# Deployujte
netlify deploy --dir=dist --prod
```

### 2. Vercel
```bash
# Nainstalujte Vercel CLI
bun add -g vercel

# Buildněte
./build-all.sh

# Deployujte
vercel deploy dist --prod
```

## Troubleshooting

### Python není nainstalován
Pokud nemáte Python, můžete použít Bun server:
```bash
cd dist
bunx serve
```

### Cloudflared není nainstalován
Nainstalujte cloudflared:
```bash
brew install cloudflared
```

### Port 8080 je již používán
Změňte port v scriptech na jiný (např. 8081, 3000, atd.)
