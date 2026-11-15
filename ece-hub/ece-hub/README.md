# ECE Hub

A static website for ECE students with three sections:

- **Electronic components**: a searchable, filterable reference list.
- **VLSI roadmap**: six phases from digital logic to ASIC verification.
- **3D component lab**: Three.js models of a resistor, capacitor, inductor, LED, and DIP-8 IC.

There is no build step. The site is plain HTML, CSS, and JavaScript.

## Project structure

```
ece-hub/
├── index.html        Page layout
├── css/style.css     Styles and colors
├── js/
│   ├── data.js       Parts and roadmap content (edit this)
│   └── main.js       Rendering and 3D viewer
└── README.md
```

## Run locally

Open `index.html` in a browser, or start a local server:

```bash
cd ece-hub
python3 -m http.server 8000
```

Then open http://localhost:8000

## Publish on GitHub Pages

1. On GitHub, create a new **public** repository named `ece-hub`. Do not add a README, .gitignore, or license, because the project already has a README.
2. In the `ece-hub` folder, run:

```bash
git init
git add .
git commit -m "Initial commit: ECE Hub website"
git branch -M main
git remote add origin https://github.com/<your-username>/ece-hub.git
git push -u origin main
```

3. On GitHub, open the repository and go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to *Deploy from a branch*. Select **main** and **/ (root)**, then click **Save**.
5. After one to two minutes the site is live at `https://<your-username>.github.io/ece-hub/`.

To publish changes later:

```bash
git add .
git commit -m "Describe your change"
git push
```

## Customize

- **Add a part:** add an object to the `PARTS` array in `js/data.js`.
- **Change the roadmap:** edit the `ROADMAP` array in `js/data.js`.
- **Change colors or fonts:** edit the variables at the top of `css/style.css`.
- **Add a 3D model:** write a function that returns a `THREE.Group`, then add it to the `models` object in `initViewer()` in `js/main.js`.

## Notes

- The 3D viewer loads Three.js from jsDelivr, and fonts load from Google Fonts, so both need an internet connection.
- If the site shows a 404 after deployment, wait a few minutes and confirm that `index.html` is in the repository root.
