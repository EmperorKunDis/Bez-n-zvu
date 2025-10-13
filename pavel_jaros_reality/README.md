# Pavel Jaroš Reality

Professional real estate website for Pavel Jaroš, a Keller Williams real estate agent specializing in property sales and rentals in Prague and surrounding areas.

## Features

- **Multi-language Support**: 6 languages (Czech, English, German, Polish, Slovak, Russian)
- **Responsive Design**: Mobile-first design using TailwindCSS
- **Contact Form**: Functional contact form with validation and email integration
- **Property Listings**: Showcase of featured properties
- **Service Overview**: Comprehensive listing of real estate services
- **Client References**: Testimonials from satisfied clients
- **Error Handling**: Global error boundary for graceful error recovery
- **Security**: Enhanced security headers and GDPR compliance
- **Property Management System**: Automated real-time property management via file system watching

## Technology Stack

- **Framework**: Next.js 15.3.2 with App Router
- **Runtime**: Bun
- **Language**: TypeScript 5.8.3
- **Styling**: TailwindCSS 3.4.17
- **UI Components**: Custom components based on shadcn/ui
- **Internationalization**: next-intl 4.3.11
- **Icons**: Lucide React 0.475.0
- **Code Quality**: Biome 1.9.4, ESLint 9.27.0
- **Database**: Prisma 6.17.1 with SQLite
- **File Watching**: Chokidar 4.0.3
- **Markdown Parser**: Gray-matter 4.0.3
- **Validation**: Zod 4.1.12

## Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+ and npm

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd pavel_jaros_reality

# Install dependencies
bun install
# or with npm
npm install
```

## Development

```bash
# Start the development server
bun run dev
# or with npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

The page auto-updates as you edit files.

## Build

```bash
# Create a production build
bun run build
# or with npm
npm run build

# Start the production server
bun run start
# or with npm
npm run start
```

## Project Structure

```
pavel_jaros_reality/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Localized routes
│   │   │   ├── layout.tsx     # Locale-specific layout
│   │   │   └── page.tsx       # Main page component
│   │   ├── api/
│   │   │   └── contact/       # Contact form API endpoint
│   │   ├── ClientBody.tsx     # Client-side body wrapper
│   │   └── global.css         # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── textarea.tsx
│   │   └── ErrorBoundary.tsx  # Error boundary component
│   └── lib/
│       └── utils.ts           # Utility functions
├── messages/                   # Translation files
│   ├── cs.json
│   ├── en.json
│   ├── de.json
│   ├── pl.json
│   ├── sk.json
│   └── ru.json
├── i18n/                      # Internationalization config
│   ├── routing.ts
│   └── request.ts
├── public/                    # Static assets
├── biome.json                # Biome configuration
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # TailwindCSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Available Scripts

### Development
- `bun run dev` - Start Next.js development server
- `bun run build` - Create production build
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Biome

### Testing
- `bun run test` - Run Jest tests
- `bun run test:watch` - Run tests in watch mode
- `bun run test:coverage` - Run tests with coverage

### Database
- `bun run db:generate` - Generate Prisma Client
- `bun run db:push` - Push schema changes to database
- `bun run db:studio` - Open Prisma Studio (database GUI)

### Property Management
- `bun run watch-properties` - Start property file system watcher
- `bun run watch-properties:dev` - Start watcher with auto-reload

## Configuration

### Adding a New Language

1. Add the language code to `i18n/routing.ts`:

```typescript
export const routing = defineRouting({
  locales: ['cs', 'en', 'de', 'pl', 'sk', 'ru', 'your-lang'],
  defaultLocale: 'cs'
});
```

2. Create a translation file in `messages/your-lang.json` with all required keys

3. Add the language to the language selector in `src/app/[locale]/page.tsx`:

```typescript
const languages = [
  // ... existing languages
  { code: 'your-lang', name: 'Your Language', flag: '🏳️' },
];
```

### Contact Form Configuration

The contact form API is located at `src/app/api/contact/route.ts`. To enable email sending:

1. Uncomment the email sending logic in the API route
2. Install an email service package (e.g., nodemailer, @sendgrid/mail)
3. Configure your email service credentials using environment variables

Example with SendGrid:

```bash
# Add to .env.local
SENDGRID_API_KEY=your_api_key
CONTACT_EMAIL=pavel.jaros@example.com
```

### Security Headers

Security headers are configured in `next.config.mjs`. You can modify them according to your needs:

```javascript
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'Strict-Transport-Security', value: '...' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      // ... more headers
    ]
  }]
}
```

## Deployment

### Netlify

The project is configured for Netlify deployment with `netlify.toml`.

```bash
# Deploy to Netlify
netlify deploy --prod
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build Docker image
docker build -t pavel-jaros-reality .

# Run container
docker run -p 3000:3000 pavel-jaros-reality
```

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Email service configuration (optional)
SENDGRID_API_KEY=your_sendgrid_api_key
CONTACT_EMAIL=your_email@example.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Property Management System

This application includes an **automated real-time property management system** that monitors a folder structure and automatically updates the website when properties are added, modified, or removed.

### How It Works

1. **Folder Structure**: Properties are organized in `nemovitosti/` folder:
   ```
   nemovitosti/
   ├── Prodej/          # Active sales listings
   ├── Pronajem/        # Active rental listings
   └── Hotovo/          # Sold/rented properties
   ```

2. **File System Watcher**: A background process monitors these folders using Chokidar
3. **Real-time Updates**: When you create, delete, or move a property folder, the database updates automatically
4. **Web Integration**: Frontend reads from database, ensuring instant updates

### Adding a New Property

1. Create a folder in the appropriate status directory:
   ```bash
   mkdir nemovitosti/Prodej/Dum_U_Prehrady_Cheb
   ```

2. Add required files to the folder:
   - `data.md` - Property information in Markdown format (see `byt.md` example)
   - `img00.jpg` - Main thumbnail image
   - `img01.jpg`, `img02.jpg`, ... - Gallery images

3. The watcher automatically detects the new folder and:
   - Parses `data.md`
   - Validates the data
   - Creates a database entry
   - Makes the property visible on the website

### Moving a Property (Status Change)

Simply move the folder to change status:

```bash
# Property sold? Move it to Hotovo:
mv nemovitosti/Prodej/Dum_U_Prehrady_Cheb nemovitosti/Hotovo/
```

The watcher detects the move and updates the property status in the database automatically.

### Updating Property Information

Edit the `data.md` file or add/remove images. The watcher detects changes and updates the database.

### data.md Format

Use the provided `byt.md` as a template. Required structure:

```markdown
# Property Title
## Subtitle

---

Description text...

---

img.01, img.02, img.03, ...

---

**5+1** dispozice
**520** plocha
**2** podlaží

---

youtubeURL : https://youtu.be/...

---

### PODROBNÉ INFORMACE

| | |
|---|---|
| **Address** | Value |
| **Type** | Value |
...

---

googleMap : <iframe...>
```

### Starting the Property Watcher

**Development:**
```bash
# Terminal 1: Start Next.js
bun run dev

# Terminal 2: Start property watcher
bun run watch-properties
```

**Production:**
```bash
# Use PM2 or systemd to keep watcher running
pm2 start "bun run watch-properties" --name property-watcher
pm2 start "bun run start" --name nextjs-app
```

### API Endpoints

The system provides REST API endpoints:

- `GET /api/properties` - List all properties (optional `?status=PRODEJ`)
- `GET /api/properties/[folderId]` - Get property details
- `GET /api/properties/stats` - Get statistics (counts by status)

### Database

- **Type**: SQLite (easily switchable to PostgreSQL)
- **Location**: `data/properties.db`
- **ORM**: Prisma
- **Schema**: See `prisma/schema.prisma`

To view/edit database:
```bash
bun run db:studio
```

### Error Handling

The watcher validates each property and logs errors:

```
[WATCHER] ✗ Invalid property folder Dum_Test:
  - data.md file not found
  - Main image img00.jpg not found
```

Invalid properties are skipped but logged for debugging.

## Features in Detail

### Internationalization

The application supports 6 languages with automatic locale detection. Translations are managed in JSON files under the `messages/` directory.

### Contact Form

- Client-side validation
- Server-side validation
- Loading states
- Error handling
- Success feedback
- GDPR consent checkbox

### Error Boundary

A React Error Boundary wraps the application to catch runtime errors and display a user-friendly error page.

### Security

- HTTPS enforcement
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- XSS protection
- CSRF protection
- Input validation and sanitization

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Style

This project uses Biome for code formatting and linting. Run `bun run format` before committing.

## License

This project is proprietary and confidential.

## Contact

Pavel Jaroš - [Contact Information]

Project Link: [https://pavel-jaros.cz](https://pavel-jaros.cz)

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Keller Williams](https://www.kw.com/)
