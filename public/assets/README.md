# Assets Directory

## Structure

```
assets/
├── images/           # Game images and backgrounds
│   └── landing-bg.jpg  (1200x1200px pixel art)
├── audio/            # Sound effects and music (to be added)
└── bg/               # Race track backgrounds (to be added)
    ├── dirt/         # Dirt track backgrounds
    ├── turf/         # Turf track backgrounds
    └── hybrid/       # Hybrid track backgrounds
```

## Image Guidelines

### Landing Background

- **File**: `images/landing-bg.jpg`
- **Size**: 1200x1200px
- **Style**: Pixel art
- **Rendering**: Image rendering is set to pixelated in CSS

### Responsive Behavior

- **Mobile (<768px)**: Background sized to fit height
- **Tablet (769-1200px)**: Cover mode
- **Desktop (>1200px)**: Background sized to fit width

## Adding New Assets

### Images

- Place pixel art images in `images/` directory
- Use `.jpg` or `.png` format
- Recommended sizes: multiples of base resolution (e.g., 1200x1200, 1600x1600, 2400x2400)

### Audio

- Place sound effects in `audio/` directory
- Use `.mp3` or `.ogg` format for browser compatibility

### Track Backgrounds

- Place track-specific backgrounds in respective `bg/` subdirectories
- Follow pixel art style guidelines
- Recommended width: at least 2400px for parallax effect
