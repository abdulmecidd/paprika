Implemented dark theme support and addressed all reviewer feedback:
1.  **Dependency Alignment**: Replaced `tw-animate-css` with `tailwindcss-animate` in `package.json` to match the CSS `@plugin` usage and ensure the build succeeds.
2.  **CSS Variable System**: Implemented a comprehensive design token system in `globals.css` using Tailwind CSS v4's `@theme` and `@layer base`. The system supports both light and dark modes.
3.  **Branding Preservation**: Defined the primary color as the Paprika brand red (`hsl(0, 72.2%, 50.6%)`) and applied `text-primary` to the navbar logo to ensure it stays vibrant and accessible in both themes.
4.  **Theme Infrastructure**: Added `ThemeProvider` using `next-themes` and integrated it into the root layout with `suppressHydrationWarning` to prevent flicker.
5.  **Navbar Refactor**: Fixed the unused `useTranslation` import. Improved the navbar layout to be sticky with a backdrop blur, and integrated the new `ModeToggle` component.
6.  **Page Structure**: Updated the layout to use a flex-based container ensuring the footer stays at the bottom and the content area is properly spaced.