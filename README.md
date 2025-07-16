# Frog103 Website

This repository contains the static files for the **Frog103** website. The site is a portfolio and blog that showcases comics, design work and art galleries. All content is distributed as simple HTML, CSS and JavaScript so it can be hosted on any basic web server (for example GitHub Pages).

## Structure

- `index.html` – landing page
- `Blog.html` – blog with search functionality
- `Projects.html` – listing of comic projects
- `designGallery.html`, `animationGallery.html`, `otherArtGallery.html` – gallery pages with filtering and search
- JavaScript helpers for loading data (e.g. `comicfetch.js`, `galleryRender.js`)
- Data files in JSON (`*.json`) and text posts under `txtFiles`

## Development

No build tools are required. Clone the repository and open the HTML files directly in your browser or use a simple HTTP server:

```bash
npx serve .
```

### Testing

The project does not contain automated tests at this time. Running `npm test` will simply print a message.

## License

Source code in this repository is provided under the MIT License. See [`LICENSE`](LICENSE) for details.
