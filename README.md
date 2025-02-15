# Lo Techni Community Site

<div align="center">
<img src="https://github.com/talmosko/lotechni.dev/blob/master/src/assets/logos/logo.svg" alt="Lo Techni Logo" width="256" height="256" style="border-radius: 50%;">
</div>

> A community site for the Lo Techni podcast - Where developers talk about everything except code 🎙️

## 🚀 Tech Stack

- **Astro** v5.x - The web framework for content-driven websites
- **React** v19.x - For interactive components
- **Tailwind CSS** v3.4 - Utility-first CSS framework
- **TypeScript** v5.7 - Because we like our types strict
- **Zod** v3.24 - Runtime type validation that actually works

## 📦 Getting Started

### Prerequisites

- Node.js 18.14.1 or higher
- pnpm 8.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lotechni.dev.git

# Install dependencies
pnpm install
```

## 🛠️ Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Cleanup Scripts

```bash
# Clean build output
pnpm clean

# Nuclear option: Clean everything (build, node_modules, etc)
pnpm clean:all

# Format code
pnpm format
```

## 🗂️ Project Structure

```
/
├── public/          # Static assets
├── src/
│   ├── components/  # UI components
│   ├── layouts/     # Page layouts
│   ├── pages/       # File-based routing
│   ├── assets/      # Project assets
│   ├── sections/    # Page sections
│   ├── utils/       # Utility functions
│   └── types/       # TypeScript types
```

## 🔄 Import Aliases

```typescript
// Instead of this 😢
import EpisodeCard from '../../components/EpisodeCard.astro'

// Do this 🎉
import EpisodeCard from '@components/EpisodeCard.astro'
```

Available aliases:

```diff
+ "@components/*": ["src/components/*"]
+ "@layouts/*": ["src/layouts/*"]
+ "@assets/*": ["src/assets/*"]
+ "@sections/*": ["src/sections/*"]
+ "@utils/*": ["src/utils/*"]
+ "@types/*": ["src/types/*"]
```

## 🎨 Code Style

We use Prettier for code formatting with custom configurations for Astro and Tailwind. Format your code with:

```bash
pnpm format
```

## 🧞 Available Commands

| Command          | Action                                     |
| :--------------- | :----------------------------------------- |
| `pnpm install`   | Install project dependencies               |
| `pnpm dev`       | Start local dev server at `localhost:4321` |
| `pnpm build`     | Build production site to `./dist/`         |
| `pnpm preview`   | Preview production build locally           |
| `pnpm clean`     | Clean build output                         |
| `pnpm clean:all` | Clean everything (including node_modules)  |
| `pnpm format`    | Format code with Prettier                  |

## 🤝 Contributing

1. Fork it
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Format your code (`pnpm format`)
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

Built with ❤️ by the Lo Techni community
