# Contributing to React TikTok Style Video Scroller

First off, thank you for considering contributing to this project! It's people like you that make open source such a great community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Git

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork locally:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/react-tiktok-style-video-scroller.git
   cd react-tiktok-style-video-scroller
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Build the package:**
   ```bash
   npm run build
   ```

5. **Run the test app:**
   ```bash
   cd test-app
   npm install
   npm run dev
   ```

6. **Create a branch for your changes:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Project Structure

```
react-tiktok-style-video-scroller/
├── src/
│   ├── components/
│   │   ├── VideoScroller.tsx    # Main scroller component
│   │   ├── VideoItem.tsx        # Individual video player
│   │   └── DefaultOverlay.tsx   # Default controls overlay
│   ├── hooks/
│   │   └── useVideoScroller.ts  # State management hook
│   ├── utils/
│   │   ├── theme.ts             # Theme utilities
│   │   └── share.ts             # Share utilities
│   ├── types.ts                 # TypeScript definitions
│   ├── styles.css               # Optional base styles
│   └── index.ts                 # Main exports
├── test-app/                    # Development test application
├── examples/                    # Example implementations
├── dist/                        # Built output (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Making Changes

### Types of Contributions

- **Bug fixes** - Fix something that isn't working correctly
- **Features** - Add new functionality
- **Documentation** - Improve or add documentation
- **Performance** - Optimize existing code
- **Tests** - Add or improve tests

### Before You Start

1. Check the [issues](https://github.com/neomavkda3/react-tiktok-style-video-scroller/issues) to see if someone is already working on what you want to do
2. For major changes, open an issue first to discuss your proposal
3. Make sure your change aligns with the project's goals

### Development Workflow

1. **Make your changes** in the `src/` directory

2. **Build the package** to check for TypeScript errors:
   ```bash
   npm run build
   ```

3. **Test your changes** in the test app:
   ```bash
   cd test-app
   npm run dev
   ```

4. **Run type checking:**
   ```bash
   npm run typecheck
   ```

## Pull Request Process

1. **Update documentation** if you've changed APIs or added features

2. **Ensure the build passes:**
   ```bash
   npm run build
   npm run typecheck
   ```

3. **Write a clear PR description:**
   - What does this PR do?
   - Why is this change needed?
   - Any breaking changes?
   - Screenshots/GIFs if it's a visual change

4. **Link related issues** using keywords like "Fixes #123" or "Closes #456"

5. **Request review** from maintainers

### PR Title Format

Use conventional commit format:
- `feat: add new feature`
- `fix: resolve bug with X`
- `docs: update README`
- `refactor: improve performance of Y`
- `chore: update dependencies`

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper types for all exports
- Avoid `any` type unless absolutely necessary
- Export types that consumers might need

### React

- Use functional components with hooks
- Follow React best practices for performance (useMemo, useCallback)
- Keep components focused and single-purpose
- Use proper prop types

### Styling

- Use inline styles for component defaults (ensures zero-config usage)
- Keep CSS file optional and minimal
- Support theming through props
- Follow mobile-first design

### Code Style

- Use consistent formatting (Prettier is recommended)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Example of Good Code

```tsx
// Good: Clear types, meaningful names, proper hooks usage
interface VideoItemProps {
  video: Video;
  onLike?: (video: Video, liked: boolean) => void;
}

export function VideoItem({ video, onLike }: VideoItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLike = useCallback(() => {
    onLike?.(video, !video.hasLiked);
  }, [video, onLike]);

  return (
    // ...
  );
}
```

## Testing

### Manual Testing

1. Test in the test-app with various video sources
2. Test on mobile devices or device emulators
3. Test keyboard navigation
4. Test with different theme configurations

### What to Test

- Video playback (play, pause, mute)
- Scrolling behavior (snap, smooth)
- Infinite loading
- Like/share interactions
- Custom overlays
- Theme application
- Edge cases (empty list, single video, errors)

## Documentation

### When to Update Docs

- New features
- Changed APIs
- New props or options
- New examples needed

### Documentation Locations

- `README.md` - Main documentation
- `examples/` - Code examples
- JSDoc comments in source code
- `CHANGELOG.md` - Version history

### Writing Good Documentation

- Include code examples
- Explain the "why" not just the "what"
- Keep it concise but complete
- Use proper formatting

## Questions?

If you have questions about contributing, feel free to:
- Open a [discussion](https://github.com/neomavkda3/react-tiktok-style-video-scroller/discussions)
- Open an issue with the "question" label

Thank you for contributing!
