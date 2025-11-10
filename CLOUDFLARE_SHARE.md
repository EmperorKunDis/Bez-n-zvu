# Cloudflare Tunnel - 4 samostatné weby

Tento návod vám ukáže, jak sdílet všechny 4 weby přímo z vašeho lokálního počítače pomocí Cloudflare Tunnel. **Každý web bude mít vlastní veřejnou URL!**

## Výhody
- Zcela zdarma
- Žádná registrace potřebná
- Bezpečné HTTPS spojení
- Sdílení během pár sekund
- **4 samostatné URL pro každý web**
- Plně funkční weby s API routes
- Každý web běží nezávisle

## Nevýhody
- Váš počítač musí běžet, aby byly weby dostupné
- URL se mění při každém spuštění
- Vhodné pro krátkodobé sdílení nebo testování

## Jak to funguje

1. Spustí všechny 4 weby na dev serverech (porty 3001-3004)
2. Pro každý web vytvoří **samostatný Cloudflare Tunnel**
3. Každý tunel běží ve svém terminálovém okně
4. Každý web má **vlastní veřejnou URL**

## Použití

### Spustit všechny 4 weby najednou:

```bash
./cloudflare-full.sh
```

Tento příkaz:
1. Otevře **4 nové terminály**
2. Každý terminál spustí jeden web + Cloudflare Tunnel
3. Zobrazí logy a URL pro každý web

### Po spuštění uvidíte:

**4 terminálová okna**, každé s vlastním tunnelem:

1. **PJ-Design Cloudflare Tunnel**
   - Port: 3001
   - URL: `https://xxx-xxx-xxx.trycloudflare.com`

2. **PJ-Reality Cloudflare Tunnel**
   - Port: 3003
   - URL: `https://yyy-yyy-yyy.trycloudflare.com`

3. **PJ-Rekonstrukce Cloudflare Tunnel**
   - Port: 3002
   - URL: `https://zzz-zzz-zzz.trycloudflare.com`

4. **PJ-Správa Cloudflare Tunnel**
   - Port: 3004
   - URL: `https://www-www-www.trycloudflare.com`

Každá URL je **plně funkční web** s API routes!

### Lokální přístup:

Můžete také přistupovat k webům lokálně:
- http://localhost:3001 (design)
- http://localhost:3002 (rekonstrukce)
- http://localhost:3003 (reality)
- http://localhost:3004 (správa)

### Ukončení:

**Způsob 1: Jeden příkaz pro všechny**
```bash
./stop-all.sh
```

**Způsob 2: Jednotlivé terminály**
Stiskněte `Ctrl+C` v každém terminálovém okně.

## Alternativní způsob (jednotlivé weby):

Pokud chcete spustit pouze jeden web:

### Design:
```bash
./cloudflare-design.sh
```

### Reality:
```bash
./cloudflare-reality.sh
```

### Rekonstrukce:
```bash
./cloudflare-rekonstrukce.sh
```

### Správa:
```bash
./cloudflare-sprava.sh
```

Každý script spustí dev server a Cloudflare Tunnel pro daný web.

## Spustit dev servery bez Cloudflare Tunnel

Pokud chcete pouze lokální přístup bez veřejné URL:

```bash
# Design
cd pavel_jaros_design && PORT=3001 bun run dev

# Reality
cd pavel_jaros_reality && PORT=3003 bun run dev

# Rekonstrukce
cd pavel_jaros_rekonstrukce && PORT=3002 bun run dev

# Správa
cd pavel_jaros_sprava && PORT=3004 bun run dev
```

## Troubleshooting

### Cloudflared není nainstalován
Nainstalujte cloudflared:
```bash
brew install cloudflared
```

### Porty jsou již používány
Ukončete existující procesy:
```bash
./stop-all.sh
```

Nebo manuálně:
```bash
lsof -ti:3001,3002,3003,3004 | xargs kill -9
pkill -f cloudflared
```

### Terminály se neotevírají
Ujistěte se, že používáte macOS s Terminal.app. Na jiných systémech upravte `cloudflare-full.sh` pro váš terminál.

### Server se nespustil
Zkontrolujte, že:
- Máte nainstalovaný Bun (`brew install bun`)
- Všechny dependencies jsou nainstalovány (`bun install` v každém projektu)
- Porty 3001-3004 jsou volné
