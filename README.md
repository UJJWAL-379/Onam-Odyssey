# 🌼 Onam Odyssey
## 👑 Maveli's Kasavu Quest — Kerala Edition

A lightweight Kerala-inspired browser game based on **Maveli, Onam, Kasavu colours, coconut hazards, umbrella power and Pookalam aesthetics**.

> 🎮 No game engine • No external libraries • No image/audio files • No API keys • GitHub Pages ready

## ▶️ Play Online

**GitHub Pages:** https://UJJWAL-379.github.io/Onam-Odyssey/

If Pages is not enabled: **Settings → Pages → Deploy from a branch → main → /(root)**.

## 🏆 Competition Highlights

Built to improve the areas commonly judged in Onam/game competitions: creativity, coding complexity, Pookalam aesthetics, cultural relevance and visual polish.

- 🌼 Procedural Pookalam-style Canvas art
- 👑 Hand-drawn Maveli character
- 🌊 Three-wave Level 1 difficulty curve
- 🥥 15-object coconut pool for lower GC pressure
- 👣 Level 2 stomp telegraph with a growing shadow
- 💥 Screen shake + Canvas particles
- ✨ Floating `+1 ☂` feedback
- ☂️ Power carries from Level 1 to Level 2
- ⚔️ 2 ☂ power attack that can stun the foot
- 🛡️ Real defensive mechanic
- 🔊 Procedural chenda-inspired Web Audio
- 📱 Touch controls + haptic feedback where supported
- ⏸️ Pause/resume overlay
- 💾 Local Pookalam victory progress
- 📲 PWA manifest + service worker
- ⚡ `requestAnimationFrame` + delta-time clamp at `0.05s`
- 🧩 Modular JavaScript architecture

## 🎮 Gameplay

### Level 1 — Maveli's Climb

Maveli returns from Pathalam and climbs the festive brick paths.

**Wave 1:** slower coconuts and easier collection.

**Wave 2:** faster hazards.

**Wave 3:** moving/bobbing upper platforms and faster hazards.

Collect umbrella power and reach the golden arch. Power carries into Level 2.

### Level 2 — Giant Stomp

A giant foot attacks Maveli on the plain ground. Before a stomp, a shadow appears for about **0.8 seconds**, giving the player a fair reaction window.

- Run sideways to escape.
- Hold **🛡 Defend** to block an impact.
- Spend **2 ☂ power** to attack and stun the foot.
- Reach the finish zone to win.

## 🕹️ Controls

| Platform | Control | Action |
|---|---|---|
| PC | `A` / `←` | Move left |
| PC | `D` / `→` | Move right |
| PC | `W` / `↑` / `Space` | Jump |
| PC | `F` | Attack |
| PC | `Shift` | Defend |
| Mobile | ◀ / ▶ | Move |
| Mobile | ⤴ JUMP | Jump |
| Mobile | ☂ ATTACK | Attack |
| Mobile | 🛡 HOLD TO DEFEND | Defend |
| All | `Ⅱ / ▶` | Pause / Resume |

## ☂ Umbrella Power

- Collecting an umbrella gives **+1 ☂ power**.
- Power carries into Level 2.
- **2 ☂ = one attack**.
- Defense does not consume power.

## 🌼 Pookalam Reward

Each completed victory increases a local victory counter. The game displays progress toward a **3-ring Pookalam reward** using browser `localStorage`. No account or server is required.

## 🔊 Audio

Short chenda-inspired percussion and game sounds are synthesized with the browser's **Web Audio API**. No audio files are downloaded. Browser audio may require a user interaction first.

## ⚡ Technical Design

### Object pooling
`js/pool.js` pre-allocates 15 coconut objects and reuses them instead of constantly allocating/removing objects.

### Delta-time loop
The game uses `requestAnimationFrame` and clamps frame delta to `0.05s`, improving stability during lag or tab switching.

### Procedural graphics
Pookalam, palms, Maveli, coconuts, platforms and the giant foot are drawn with Canvas APIs, keeping the project lightweight and free of external assets.

### Modular architecture

```text
Onam-Odyssey/
├── index.html
├── manifest.json
├── sw.js
├── css/
│   └── style.css
├── js/
│   ├── game.js
│   ├── player.js
│   ├── particles.js
│   ├── pool.js
│   └── audio.js
└── README.md
```

## 📥 Download

1. Open the repository.
2. Click **Code**.
3. Select **Download ZIP**.
4. Extract the ZIP.
5. Open the `Onam-Odyssey` folder.
6. Run it using a local server (recommended for ES modules).

## 🔗 Clone with Git

```bash
git clone https://github.com/UJJWAL-379/Onam-Odyssey.git
cd Onam-Odyssey
```

VS Code:

```bash
code .
```

## ▶️ Run Locally

Recommended:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

You can also use VS Code with a static-server/Live Server extension.

## 🌐 GitHub Pages

1. **Settings → Pages**
2. **Deploy from a branch**
3. Branch: `main`
4. Folder: `/(root)`
5. **Save**
6. Wait for deployment
7. Open `https://UJJWAL-379.github.io/Onam-Odyssey/`

No build command is required.

## 📲 PWA / Offline

`manifest.json` provides install metadata and `sw.js` caches the core game files. On supported HTTPS browsers, the game can be added to the home screen and reused after the first successful load.

## 🛠️ Development Guide

| File | Purpose |
|---|---|
| `index.html` | App shell, HUD and controls |
| `css/style.css` | Responsive Onam UI/UX |
| `js/game.js` | Game states, levels, loop and rendering |
| `js/player.js` | Maveli movement/drawing |
| `js/pool.js` | Coconut object pool |
| `js/particles.js` | Particle/floating text effects |
| `js/audio.js` | Procedural Web Audio |
| `manifest.json` | PWA metadata |
| `sw.js` | Offline caching |

## 🔄 Push Changes

```bash
git add .
git commit -m "Improve Onam Odyssey"
git push origin main
```

## 🐛 Troubleshooting

**Blank page:** run a local server because ES modules can be blocked from `file://`.

**No sound:** tap/click first; browser autoplay policies may block Web Audio.

**Pages blank:** verify all `js/` and `css/` files exist on the deployed branch and Pages uses `main` + root.

**Mobile controls:** use a modern browser; haptics depend on device/browser support.

## ♿ Accessibility

Keyboard-only gameplay is supported. Important game objects use shape as well as colour, and audio is optional.

## 🔒 Privacy

No account or gameplay server is required. Only the local Pookalam/victory counter is stored in the browser.

## 🚀 Future Ideas

- More detailed pixel animation
- More Pookalam layers
- Full chenda rhythm patterns
- More Kerala environments
- Full-screen mode
- Story/parallax scenes
- Leaderboards

## 🤝 Contributing

Fork the repository, create a branch, make and test your changes on desktop/mobile, then open a Pull Request. Keep the game lightweight and culturally respectful.

## 🌿 Philosophy

**Traditional Kerala aesthetics + modern browser-game mechanics + lightweight code.**

> 🌼 Run. Jump. Collect. Defend. Celebrate Onam. 👑

# 🌼 Happy Onam!