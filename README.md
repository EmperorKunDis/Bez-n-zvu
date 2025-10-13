# Pavel Jaros - Multi-site Portfolio

Tento projekt obsahuje 4 samostatné Next.js aplikace, které jsou automaticky deployovány na GitHub Pages.

## Struktur

- `pavel_jaros_design/` - Design portfolio
- `pavel_jaros_rekonstrukce/` - Rekonstrukce portfolio
- `pavel_jaros_reality/` - Reality portfolio
- `pavel_jaros_sprava/` - Správa portfolio

## Live URLs

Po úspěšném nasazení budou weby dostupné na:

- **Hlavní stránka**: https://emperoorkudis.github.io/Bez-n-zvu/
- **Design**: https://emperoorkudis.github.io/Bez-n-zvu/design
- **Rekonstrukce**: https://emperoorkudis.github.io/Bez-n-zvu/rekonstrukce
- **Reality**: https://emperoorkudis.github.io/Bez-n-zvu/reality
- **Správa**: https://emperoorkudis.github.io/Bez-n-zvu/sprava

## Lokální vývoj

### Jednotlivé projekty

Pro vývoj jednotlivých projektů:

```bash
cd pavel_jaros_design
bun install
bun run dev
```

Stejně tak pro ostatní projekty (`pavel_jaros_rekonstrukce`, `pavel_jaros_reality`, `pavel_jaros_sprava`).

### Build všech projektů

Pro build všech projektů najednou:

```bash
./build-all.sh
```

Výstup bude v adresáři `dist/`.

## Automatické nasazení

### GitHub Pages nastavení

1. Jděte do repository nastavení na GitHubu
2. Klikněte na **Pages** v levém menu
3. V sekci **Source** vyberte **GitHub Actions**
4. Workflow je již nakonfigurován v `.github/workflows/deploy.yml`

### Jak to funguje

1. Při každém push do `main` větve se spustí GitHub Actions workflow
2. Workflow buildne všechny 4 projekty
3. Zkopíruje výstupy do správné struktury
4. Deployuje na GitHub Pages

## Manuální spuštění deploye

Můžete také spustit deployment manuálně:

1. Jděte do **Actions** tab na GitHubu
2. Vyberte **Deploy to GitHub Pages** workflow
3. Klikněte na **Run workflow**

## Technologie

- **Next.js** - React framework pro statické weby
- **Bun** - JavaScript runtime a package manager
- **GitHub Actions** - CI/CD automatizace
- **GitHub Pages** - Hosting

## Struktura konfigurace

Každý projekt má nakonfigurován:
- `output: 'export'` - pro statický export
- `basePath: '/Bez-n-zvu/[název]'` - pro správné cesty na GitHub Pages
- `images.unoptimized: true` - pro podporu obrázků na statických stránkách

## První nasazení

1. Commitněte všechny změny:
```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

2. Povolte GitHub Pages v repository nastavení (viz sekce výše)

3. Workflow se automaticky spustí a deployuje weby

4. Po dokončení budou weby dostupné na výše uvedených URL

## Poznámky

- Build process může trvat několik minut
- Po prvním deployu může trvat až 10 minut, než budou stránky dostupné
- Při změnách v kódu stačí pushnout do main a deployment proběhne automaticky
