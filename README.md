# 🌼 Onam Ascent — Maveli's Journey

A lightweight Kerala Onam browser game starring Maveli. Level 1 is a three-lane festival runner inspired by classic lane-runner gameplay, followed by Level 2: Vamana's stomp challenge.

## ▶️ Play

GitHub Pages: https://UJJWAL-379.github.io/Onam-Odyssey/

No build step, npm install, game engine or external library is required.

## 🎮 Controls

| Platform | Control | Action |
|---|---|---|
| PC | A / ← | Move left |
| PC | D / → | Move right |
| PC | W / ↑ / Space | Jump in Level 1 |
| PC | F | Attack in Level 2 |
| PC | Shift | Defend in Level 2 |
| Mobile | Swipe left/right | Change lane |
| Mobile | Tap | Jump in Level 1 |
| Mobile | Buttons | Move, jump, attack, defend |
| All | Ⅱ / ▶ | Pause / resume |

## 🌿 Level 1 — Maveli's Run

- Three-lane perspective runner.
- Rolling coconut hazards.
- Jumpable Kerala festival barricades.
- Festival-train hazards that require lane changes.
- Glowing umbrella collectibles.
- +25 collection score and +5 skilled dodge score.
- Difficulty increases gradually with running time.
- Reach the golden gateway to enter Level 2.

## 👣 Level 2 — Vamana's Challenge

Jump is disabled. A giant golden-ankleted foot telegraphs its stomp with a shadow and countdown.

- **Defend:** spend 6 umbrella power to block the next stomp.
- **Attack:** spend stored power to strike the foot.
- Successful attack completes the encounter.
- Power collected in Level 1 carries into Level 2.

## ✨ Technical Features

- Single-file `index.html` runtime.
- Canvas rendering with procedural Kerala/Onam graphics.
- `requestAnimationFrame` with a 50 ms delta-time clamp.
- No external JavaScript libraries.
- Web Audio is optional and fails silently if unavailable.
- Touch/swipe input plus keyboard input.
- Haptic feedback when supported.
- Local best score and Pookalam victory progress.
- PWA manifest and service worker for supported HTTPS browsers.
- Defensive runtime error screen instead of a frozen/blank page.

## 📥 Run in VS Code

1. Download the repository ZIP and extract it.
2. Open the extracted folder in VS Code.
3. Open a terminal in that folder.
4. Run:

```bash
python -m http.server 8000
```

5. Open `http://localhost:8000`.

A local server is recommended because service workers require a secure context; `localhost` is supported.

## 🌐 GitHub Pages

In the repository: **Settings → Pages → Deploy from a branch → main → /(root)**.

Then open:

`https://UJJWAL-379.github.io/Onam-Odyssey/`

## 📱 Phone

The game is designed to run in a modern mobile browser. For the best experience, open the GitHub Pages URL on the phone, use landscape orientation, and add it to the home screen if the browser offers installation.

## 🧹 Repository structure

```text
Onam-Odyssey/
├── index.html      # Complete playable game
├── manifest.json   # PWA metadata
├── sw.js           # Offline cache
├── icon.svg        # App/browser icon
└── README.md       # Documentation
```

## 🔧 Troubleshooting

**Game error after clicking Start:** hard-refresh the page (`Ctrl+Shift+R`) so an older service-worker cache is replaced.

**No sound:** click/tap once; browser audio policies can block audio until user interaction.

**GitHub Pages shows 404:** enable Pages from the `main` branch and root folder.

**Phone controls do not respond:** use a current Chrome/Edge/Safari browser and ensure the page is not inside another scrolling frame.

## 🔒 Privacy

There is no account, server-side game data or analytics. Best score and victory progress are stored only in the browser's local storage.
