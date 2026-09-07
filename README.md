# Basmamezzev2

A modern, full-featured web application built with Next.js 14, React 18, and TypeScript. This project leverages cutting-edge technologies to deliver a high-performance, user-friendly experience.

**Live Demo:** [https://basmamezzev2.vercel.app](https://basmamezzev2.vercel.app)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Language Composition](#language-composition)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Basmamezzev2 is a modern web application designed with a focus on performance, accessibility, and user experience. Built on Next.js 14, the application takes advantage of server-side rendering, static generation, and dynamic imports for optimal performance.

The project integrates several powerful tools and libraries to create a seamless user experience with beautiful UI components, form handling, notifications, and content management.

---

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 14.2.35** - React framework with built-in SSR, SSG, and API routes
- **React 18.2.0** - UI library for building interactive components
- **TypeScript 5** - Type-safe JavaScript for scalable applications

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
- **Framer Motion 12.23.25** - Motion and animation library
- **Geist 1.3.1** - Modern design system
- **Lucide React 0.454.0** - Beautiful, consistent icon library
- **Styled Components 6.1.19** - CSS-in-JS styling solution

### Form & Validation
- **React Hook Form** - Performant, flexible form validation
- **@hookform/resolvers 3.9.1** - Validation library resolvers
- **Zod 3.24.1** - TypeScript-first schema validation

### Content & CMS
- **Sanity 3.0.0** - Headless CMS
- **next-sanity 9.12.3** - Sanity integration for Next.js
- **@sanity/image-url 1.2.0** - Image URL builder for Sanity

### Data & Analytics
- **Recharts 3.7.0** - Composable charting library
- **@vercel/analytics** - Web analytics from Vercel
- **@vercel/speed-insights 2.0.0** - Performance monitoring

### Notifications & Push
- **Novu Node 2.6.6** - Multi-channel notification platform
- **Resend 6.9.2** - Email API
- **web-push 3.6.7** - Web push notifications
- **Sonner** - Toast notifications library

### Utilities
- **date-fns 4.1.0** - Modern date utility library
- **clsx 2.1.1** - Utility for classnames
- **tailwind-merge 2.5.5** - Merge Tailwind CSS classes intelligently
- **cmdk** - Command menu component
- **embla-carousel-react** - Carousel/slider component
- **react-resizable-panels** - Resizable panel layouts
- **react-day-picker** - Date picker component
- **input-otp** - OTP input component
- **class-variance-authority 0.7.1** - CSS-in-JS variant system
- **vaul** - Drawer/modal component

### Theme Management
- **next-themes** - Easy theme switching (light/dark mode)

---

## 📊 Language Composition

```
TypeScript:  98.2%
JavaScript:   1.1%
CSS:          0.7%
```

The project is primarily written in TypeScript, ensuring type safety and better developer experience across the codebase.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/johnbosco6/basmamezzev2.git
   cd basmamezzev2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add necessary environment variables:
   ```bash
   # Example environment variables (update with your actual values)
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   # Add other required variables
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server at localhost:3000 |
| `npm run build` | Create an optimized production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint to check code quality |

---

## 📁 Project Structure

```
basmamezzev2/
├── app/                    # Next.js app directory
├── components/             # Reusable React components
├── lib/                    # Utility functions and helpers
├── styles/                 # Global styles and Tailwind config
├── public/                 # Static assets
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md              # This file
```

---

## ✨ Key Features

- **Server-Side Rendering (SSR)** - Improved SEO and initial page load performance
- **Static Generation (SSG)** - Pre-rendered static pages for fast delivery
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Accessible Components** - Built with Radix UI for WCAG compliance
- **Dark Mode Support** - Theme switching with next-themes
- **Form Management** - Powerful form handling with React Hook Form and Zod validation
- **Content Management** - Headless CMS integration with Sanity
- **Notifications** - Multi-channel notifications with Novu and email with Resend
- **Web Push** - Push notification support
- **Analytics & Performance** - Built-in analytics and performance monitoring from Vercel
- **Beautiful Icons** - Extensive icon library with Lucide React
- **Toast Notifications** - User-friendly toast messages with Sonner
- **Charts & Visualizations** - Data visualization with Recharts

---

## 📦 Key Dependencies

### UI Components & Styling
- `@radix-ui/*` - Unstyled, accessible component primitives
- `tailwindcss` - Utility-first CSS framework
- `framer-motion` - Animation library
- `lucide-react` - Icon library

### Forms & Validation
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - Validation resolvers

### CMS & Content
- `sanity` - Headless CMS
- `next-sanity` - Sanity integration

### Notifications & Communication
- `@novu/node` - Notification platform
- `resend` - Email API
- `web-push` - Push notifications

### Data & Visualization
- `recharts` - Charts library
- `date-fns` - Date utilities

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License. Feel free to use it for your own projects.

---

## 📧 Contact

For questions, suggestions, or feedback, please reach out to:
- **GitHub:** [@johnbosco6](https://github.com/johnbosco6)
- **Live Demo:** [https://basmamezzev2.vercel.app](https://basmamezzev2.vercel.app)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Sanity](https://www.sanity.io/) - Headless CMS
- [Vercel](https://vercel.com/) - Hosting and analytics

---

**Last Updated:** September 2026
