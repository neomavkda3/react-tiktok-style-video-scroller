# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-17

### Added

- Initial release of React TikTok Style Video Scroller
- **VideoScroller component** - Main container with virtual scrolling
  - Virtual rendering for optimal performance with large video lists
  - Infinite scroll with customizable load trigger
  - Snap scrolling for TikTok-like experience
  - Keyboard navigation (arrow keys, j/k)
  - Customizable loading and empty states
- **VideoItem component** - Individual video player
  - Auto-play/pause based on viewport visibility
  - Muted autoplay (browser requirement)
  - Click to unmute
  - Progress bar with drag-to-seek
  - Like and share interactions
- **DefaultOverlay component** - Default UI controls
  - Like button with count
  - Comment count display
  - Share button
  - Video title and description
- **useVideoScroller hook** - State management for video feeds
  - Cursor-based pagination support
  - Optimistic updates
  - Add/remove/update video helpers
- **Theme system**
  - Customizable colors and styling
  - Preset themes: default, tiktok, youtube, instagram, light
  - `createTheme` utility for custom themes
- **Share utilities**
  - Web Share API support
  - Clipboard fallback
  - Customizable share URL patterns
- **TypeScript support**
  - Full type definitions
  - Exported types for all public APIs
- **CSS styles** (optional)
  - Base styles for common use cases
  - Reduced motion support
  - Touch-friendly tap targets

### Technical Details

- Built with React 18+ support
- Uses @tanstack/react-virtual for efficient rendering
- Uses react-intersection-observer for visibility detection
- Zero runtime CSS-in-JS dependencies
- Tree-shakeable exports
- ESM and CommonJS builds

---

## Future Releases

### Planned Features

- [ ] Comments drawer component
- [ ] Video upload component
- [ ] Analytics integration helpers
- [ ] Server-side rendering support
- [ ] React Native version
- [ ] Storybook documentation
- [ ] Unit and integration tests

### How to Request Features

Open an issue on GitHub with the "feature request" label describing:
- What you want to achieve
- Why this would be useful
- Any implementation ideas you have
