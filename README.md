# Map App

### Overview

This project is a simple map application built using React, OpenLayers, and Tailwind CSS. It allows users to draw lines and polygons on a map and save them as mission plans. The application also includes a basic user interface for selecting the draw mode and inserting polygons.

### Technologies Used

This project was built using the following technologies:

- React
- OpenLayers
- Tailwind CSS
- TypeScript
- ESLint
- Prettier
- Vite

### Project Structure

```bash
.
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── public
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   └── site.webmanifest
├── README.md
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── DrawControls.tsx
│   │   ├── MapComponent.tsx
│   │   ├── MissionModal.tsx
│   │   └── ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── dropdown-menu.tsx
│   ├── hooks
│   │   └── useMapInteractions.tsx
│   ├── index.css
│   ├── lib
│   │   └── utils.ts
│   ├── main.tsx
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

6 directories, 32 files
```

### Requirements

- Node.js (using v20.x)
- pnpm (Optional, but recommended)

### Getting Started

1. Clone the repository

```bash
mkdir -p ~/Dev/projects
cd ~/Dev/projects
git clone https://github.com/Arvind-4/map-app.git
```

2. Install dependencies using pnpm

```bash
cd ~/Dev/projects/map-app
npm install -g pnpm
pnpm install
```

3. Run the development server

```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

5. Build the application for production

```bash
cd ~/Dev/projects/map-app
pnpm build
```

### Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/Arvind-4/map-app/blob/main/LICENSE) file for more information.
