# AI Fashion Fit MVP - Design Guidelines

## Design Approach

**Reference-Based Strategy**: Drawing inspiration from Instagram's visual-first layout, Shopify's e-commerce patterns, and modern fashion apps like ASOS and Farfetch. The design emphasizes large, high-quality imagery to showcase AI-generated try-ons and fashion products while maintaining clean, intuitive navigation.

---

## Typography System

**Primary Font**: Inter or DM Sans via Google Fonts CDN
**Accent Font**: Playfair Display or Cormorant for editorial fashion headlines

**Hierarchy**:
- Hero Headlines: 3xl to 6xl, font-weight-700
- Section Titles: 2xl to 4xl, font-weight-600
- Product Names: lg to xl, font-weight-500
- Body Text: base, font-weight-400, leading-relaxed
- Captions/Meta: sm, font-weight-400, opacity-70

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 8, 12, 16, 24
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-24
- Card gaps: gap-4 to gap-8
- Consistent vertical rhythm: py-16 for desktop sections, py-8 for mobile

**Grid Structure**:
- Product grids: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Try-on results (4×4): grid-cols-2 md:grid-cols-4 (responsive breakpoints)
- Feature cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Max container width: max-w-7xl with px-4 to px-8

---

## Core Pages & Layouts

### Landing Page
**Hero Section** (80vh):
- Full-width background: High-quality fashion image showing AI try-on concept
- Centered overlay content with backdrop-blur-md on button container
- Headline + subheadline + primary CTA ("Get Started with AI Try-On")
- Trust indicator strip below hero: "Powered by Gemini AI | 10,000+ Virtual Try-Ons | Personalized Recommendations"

**Features Grid** (3-column on desktop):
- Icon + headline + description cards
- AI Body Analysis, Virtual Try-On, Smart Recommendations, Personalized Fabrics

**How It Works** (4-step horizontal timeline):
- Upload Photo → AI Analysis → Browse Outfits → Virtual Try-On
- Step numbers with connecting line, images for each step

**Social Proof Section**:
- 2-column grid of before/after try-on examples
- User testimonials with profile photos

**CTA Section**:
- Full-width background image with blurred button background
- "Start Your AI Fashion Journey" with Google Sign-In button

### User Dashboard
**Top Navigation**:
- Logo left, navigation center (Profile, Models, Fabrics, Try-On, Cart), user avatar right
- Sticky header with subtle shadow on scroll

**Profile Page**:
- 2-column layout: Left - photo upload area (square aspect ratio, 1:1), Right - form fields
- AI analysis results displayed as badges below photo (Body Shape, Skin Tone)
- Visual progress indicator for profile completion

**Models Gallery**:
- Masonry grid layout showing clothing models
- Hover state reveals model details (name, suitable body shapes)
- Filter sidebar: body shape tags, clothing category
- Large imagery: 3:4 aspect ratio for clothing display

**Fabrics Catalog**:
- 4-column grid of fabric swatches
- Each card: large fabric image, name, texture description, skin tone compatibility badge
- Sort by: "Best Match for Your Skin Tone" (AI-powered)

**Try-On Generator**:
- Split interface: Left panel - selected models/fabrics list, Right panel - 4×4 grid preview
- Selection interface: 4 model slots + 4 fabric slots with clear visual distinction
- Generate button with loading state showing AI processing animation
- Results: 4×4 responsive grid of AI-generated outfit combinations
- Each result card: try-on image, add to cart button, share icon

**Shopping Cart**:
- List view with thumbnail images left, details center, price/quantity right
- Subtotal sticky footer with checkout button
- Empty state: illustration with "Browse Models" CTA

### Admin Panel
**Sidebar Navigation**:
- Fixed left sidebar (w-64) with menu items
- Dashboard, Models, Fabrics, Retailers, Orders, AI Logs

**Dashboard Cards**:
- 4-column metrics grid: Total Users, Try-Ons Generated, Orders, Revenue
- Recent activity feed below
- Charts: Line graph for AI usage trends

**Model/Fabric Management**:
- Table view with image thumbnails, name, category, actions
- Add New button triggers modal with image upload dropzone
- Drag-and-drop image upload area with preview

**Order Management**:
- Filterable table with order ID, user, items, status, amount
- Status badges with distinct visual treatments

### Retailer Interface
**Inventory Upload**:
- Drag-and-drop bulk upload interface
- CSV template download option
- Preview table before submission
- Image + metadata form for individual fabric entries

---

## Component Library

### Navigation
- Transparent header on landing, solid on scrolled state
- Mobile: Hamburger menu → full-screen overlay navigation

### Buttons
- Primary: Rounded-lg, px-8, py-3, font-weight-600
- Secondary: Outlined variant with same sizing
- Icon buttons: p-2 to p-3, rounded-full
- CTA buttons on images: backdrop-blur-md background

### Cards
- Rounded-xl with subtle shadow
- Hover: lift effect with increased shadow
- Product cards: Image fills top 2/3, content bottom 1/3
- Padding: p-4 to p-6

### Forms
- Input fields: rounded-lg, px-4, py-3, border treatment
- File upload: Dashed border dropzone with upload icon and instructions
- Form groups: space-y-4 for consistent field spacing
- Labels: font-weight-500, mb-2

### Image Display
- Product images: object-cover with consistent aspect ratios
- Try-on results: object-cover, rounded-lg
- User avatars: rounded-full
- Gallery lightbox for enlarged views

### Modals
- Centered overlay with backdrop-blur
- Max-w-2xl container
- Close button top-right
- Smooth fade-in animation

### Loading States
- Skeleton screens for image grids
- Spinner for AI processing with "Generating your try-ons..." text
- Progress bar for multi-step processes

### Data Display
- Tables: Striped rows, hover states, sticky headers
- Status badges: Rounded-full, px-3, py-1, uppercase text-xs
- Metrics cards: Icon, large number, label, percentage change

---

## Images

**Hero Image**: Full-width fashion lifestyle shot showing diverse models wearing stylish outfits, bright and aspirational

**How It Works Section**: 4 sequential images showing the process - phone upload, AI analysis visualization, clothing browsing, virtual try-on result

**Social Proof**: 6-8 before/after comparison images of AI try-on results

**Model Gallery**: 20+ high-quality clothing model images (3:4 ratio)

**Fabric Swatches**: Close-up texture shots of various fabrics

**Dashboard Empty States**: Friendly illustrations for empty cart, no try-ons yet

**Admin Charts**: Placeholder data visualizations for analytics

---

## Animations

**Strategic Use Only**:
- Hero fade-in on load
- Card lift on hover (transform: translateY(-4px))
- Smooth page transitions
- AI generation: Pulsing animation during processing
- Skeleton shimmer for loading states

---

## Accessibility

- All interactive elements have visible focus states with ring-2 treatment
- Form inputs maintain consistent focus styling
- Alt text for all product and try-on images
- ARIA labels for icon-only buttons
- Keyboard navigation support for image galleries
- Color contrast meets WCAG AA standards