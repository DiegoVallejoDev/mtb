# mtb.js Examples Guide 📚

This guide provides detailed examples and patterns for building static sites with mtb.js. Whether you're creating a simple landing page or a complex component-based application, these examples will help you get the most out of mtb.

## Table of Contents

- [Basic Component Usage](#basic-component-usage)
- [Component Props](#component-props)
- [Nested Components](#nested-components)
- [Building a Layout System](#building-a-layout-system)
- [Blog with Dynamic Cards](#blog-with-dynamic-cards)
- [Navigation with Active States](#navigation-with-active-states)
- [Form Components](#form-components)
- [Alpine.js Integration](#alpinejs-integration)
- [Full Project Example](#full-project-example)

---

## Basic Component Usage

### Creating Your First Component

Create a simple header component that can be reused across pages.

**File:** `src/components/header.html`
```html
<header class="site-header">
  <div class="container">
    <a href="/" class="logo">My Website</a>
    <nav class="main-nav">
      <a href="/">Home</a>
      <a href="/about.html">About</a>
      <a href="/contact.html">Contact</a>
    </nav>
  </div>
</header>
```

**Usage in a page:** `src/pages/index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home - My Website</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  {{header}}
  
  <main>
    <h1>Welcome to My Website</h1>
    <p>This is the home page content.</p>
  </main>
</body>
</html>
```

---

## Component Props

Props allow you to pass dynamic values to components, making them truly reusable.

### Button Component with Props

**File:** `src/components/button.html`
```html
<button class="btn btn-${variant}" type="${type}" ${disabled}>
  ${text}
</button>
```

**Usage:**
```html
<!-- Primary button -->
{{button text="Get Started" variant="primary" type="button"}}

<!-- Secondary button -->
{{button text="Learn More" variant="secondary" type="button"}}

<!-- Submit button for forms -->
{{button text="Submit" variant="primary" type="submit"}}

<!-- Outline button -->
{{button text="Cancel" variant="outline" type="button"}}
```

### Link Component with Props

**File:** `src/components/link.html`
```html
<a href="${href}" class="link link-${style}" target="${target}">
  ${text}
</a>
```

**Usage:**
```html
{{link text="Visit our blog" href="/blog" style="primary" target="_self"}}
{{link text="External resource" href="https://example.com" style="external" target="_blank"}}
```

---

## Nested Components

Components can include other components, enabling powerful composition patterns.

### Building a Card with Nested Button

**File:** `src/components/card-button.html`
```html
<a href="${href}" class="card-btn">
  ${text} →
</a>
```

**File:** `src/components/card.html`
```html
<article class="card card-${variant}">
  <div class="card-image">
    <img src="${image}" alt="${title}">
  </div>
  <div class="card-content">
    <h3 class="card-title">${title}</h3>
    <p class="card-description">${description}</p>
    {{card-button text="Read More" href="${link}"}}
  </div>
</article>
```

**Usage:**
```html
{{card 
  title="Getting Started Guide" 
  description="Learn how to set up mtb.js in your project" 
  image="/images/guide.jpg" 
  link="/guides/getting-started"
  variant="featured"
}}
```

---

## Building a Layout System

Create a reusable layout system for consistent page structure.

### Base Layout Components

**File:** `src/components/head.html`
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <title>${title} | My Website</title>
  <link rel="stylesheet" href="/css/main.css">
  <link rel="icon" href="/favicon.ico">
</head>
```

**File:** `src/components/nav.html`
```html
<nav class="main-nav" aria-label="Main navigation">
  <ul class="nav-list">
    <li><a href="/">Home</a></li>
    <li><a href="/about.html">About</a></li>
    <li><a href="/services.html">Services</a></li>
    <li><a href="/blog.html">Blog</a></li>
    <li><a href="/contact.html">Contact</a></li>
  </ul>
</nav>
```

**File:** `src/components/header.html`
```html
<header class="site-header">
  <div class="container">
    <a href="/" class="logo" aria-label="Home">
      <img src="/images/logo.svg" alt="Company Logo">
    </a>
    {{nav}}
    <button class="mobile-menu-toggle" aria-label="Toggle menu">
      <span class="hamburger"></span>
    </button>
  </div>
</header>
```

**File:** `src/components/footer.html`
```html
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="/images/logo.svg" alt="Company Logo">
        <p>Building amazing websites since 2024.</p>
      </div>
      <div class="footer-links">
        <h4>Quick Links</h4>
        {{nav}}
      </div>
      <div class="footer-contact">
        <h4>Contact Us</h4>
        <p>Email: hello@example.com</p>
        <p>Phone: (555) 123-4567</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 My Company. All rights reserved.</p>
    </div>
  </div>
</footer>
```

### Using the Layout

**File:** `src/pages/index.html`
```html
<!DOCTYPE html>
<html lang="en">
{{head title="Home" description="Welcome to our website"}}
<body>
  {{header}}
  
  <main class="main-content">
    <section class="hero">
      <h1>Welcome to Our Website</h1>
      <p>We build amazing things.</p>
      {{button text="Get Started" variant="primary" type="button"}}
    </section>
  </main>
  
  {{footer}}
</body>
</html>
```

---

## Blog with Dynamic Cards

Create a blog listing page with reusable post cards.

**File:** `src/components/post-card.html`
```html
<article class="post-card">
  <div class="post-image">
    <img src="${image}" alt="${title}" loading="lazy">
  </div>
  <div class="post-content">
    <div class="post-meta">
      <span class="post-category">${category}</span>
      <time class="post-date" datetime="${date}">${date}</time>
    </div>
    <h2 class="post-title">
      <a href="${url}">${title}</a>
    </h2>
    <p class="post-excerpt">${excerpt}</p>
    <a href="${url}" class="read-more">Read More →</a>
  </div>
</article>
```

**File:** `src/pages/blog.html`
```html
<!DOCTYPE html>
<html lang="en">
{{head title="Blog" description="Read our latest articles"}}
<body>
  {{header}}
  
  <main class="main-content">
    <section class="blog-header">
      <h1>Our Blog</h1>
      <p>Insights, tutorials, and updates from our team.</p>
    </section>
    
    <section class="blog-grid">
      {{post-card 
        title="Getting Started with mtb.js" 
        excerpt="Learn how to build your first static site with mtb.js" 
        date="2024-01-15" 
        category="Tutorial"
        image="/images/posts/getting-started.jpg"
        url="/blog/getting-started"
      }}
      
      {{post-card 
        title="Component Props Deep Dive" 
        excerpt="Master the props system for dynamic components" 
        date="2024-01-20" 
        category="Advanced"
        image="/images/posts/props-deep-dive.jpg"
        url="/blog/props-deep-dive"
      }}
      
      {{post-card 
        title="Building a Portfolio Site" 
        excerpt="Step-by-step guide to creating a stunning portfolio" 
        date="2024-01-25" 
        category="Project"
        image="/images/posts/portfolio.jpg"
        url="/blog/portfolio-site"
      }}
    </section>
  </main>
  
  {{footer}}
</body>
</html>
```

---

## Navigation with Active States

Create a navigation component that can highlight the active page.

**File:** `src/components/nav-item.html`
```html
<li class="nav-item ${active}">
  <a href="${href}" class="nav-link">${text}</a>
</li>
```

**File:** `src/components/main-nav.html`
```html
<nav class="main-nav" aria-label="Main navigation">
  <ul class="nav-list">
    {{nav-item text="Home" href="/" active="${homeActive}"}}
    {{nav-item text="About" href="/about.html" active="${aboutActive}"}}
    {{nav-item text="Services" href="/services.html" active="${servicesActive}"}}
    {{nav-item text="Contact" href="/contact.html" active="${contactActive}"}}
  </ul>
</nav>
```

**Usage on the About page:**
```html
{{main-nav homeActive="" aboutActive="is-active" servicesActive="" contactActive=""}}
```

---

## Form Components

Build reusable form elements with proper accessibility.

**File:** `src/components/form-field.html`
```html
<div class="form-field">
  <label for="${id}" class="form-label">
    ${label}
    <span class="required" aria-hidden="true">${required}</span>
  </label>
  <input 
    type="${type}" 
    id="${id}" 
    name="${name}" 
    class="form-input"
    placeholder="${placeholder}"
    ${attributes}
  >
  <span class="form-hint">${hint}</span>
</div>
```

**File:** `src/components/textarea-field.html`
```html
<div class="form-field">
  <label for="${id}" class="form-label">
    ${label}
    <span class="required" aria-hidden="true">${required}</span>
  </label>
  <textarea 
    id="${id}" 
    name="${name}" 
    class="form-textarea"
    placeholder="${placeholder}"
    rows="${rows}"
  ></textarea>
</div>
```

**File:** `src/components/contact-form.html`
```html
<form class="contact-form" action="/api/contact" method="POST">
  {{form-field 
    label="Full Name" 
    type="text" 
    id="name" 
    name="name" 
    placeholder="John Doe"
    required="*"
    hint=""
  }}
  
  {{form-field 
    label="Email Address" 
    type="email" 
    id="email" 
    name="email" 
    placeholder="john@example.com"
    required="*"
    hint="We'll never share your email."
  }}
  
  {{form-field 
    label="Phone" 
    type="tel" 
    id="phone" 
    name="phone" 
    placeholder="(555) 123-4567"
    required=""
    hint="Optional"
  }}
  
  {{textarea-field 
    label="Message" 
    id="message" 
    name="message" 
    placeholder="How can we help you?"
    required="*"
    rows="5"
  }}
  
  {{button text="Send Message" variant="primary" type="submit"}}
</form>
```

---

## Alpine.js Integration

mtb.js works seamlessly with [Alpine.js](https://alpinejs.dev/) for adding interactivity to your static sites. Here are detailed examples of combining mtb components with Alpine.js.

### Basic Counter Component

**File:** `src/components/counter.html`
```html
<div x-data="{ count: 0 }" class="counter-widget">
  <h3 class="counter-title">${title}</h3>
  <div class="counter-controls">
    <button 
      @click="count--" 
      class="counter-btn counter-btn-minus"
      :disabled="count <= 0"
    >
      −
    </button>
    <span class="counter-value" x-text="count"></span>
    <button 
      @click="count++" 
      class="counter-btn counter-btn-plus"
    >
      +
    </button>
  </div>
</div>
```

**Usage:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Counter Example</title>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body>
  {{counter title="Item Quantity"}}
</body>
</html>
```

### Interactive Accordion Component

**File:** `src/components/accordion-item.html`
```html
<div x-data="{ open: ${defaultOpen} }" class="accordion-item">
  <button 
    @click="open = !open" 
    class="accordion-header"
    :aria-expanded="open"
  >
    <span>${title}</span>
    <svg 
      class="accordion-icon" 
      :class="{ 'rotate-180': open }"
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width="24" 
      height="24"
    >
      <path d="M7 10l5 5 5-5z"/>
    </svg>
  </button>
  <div 
    x-show="open" 
    x-transition:enter="transition ease-out duration-200"
    x-transition:enter-start="opacity-0 transform -translate-y-2"
    x-transition:enter-end="opacity-100 transform translate-y-0"
    x-transition:leave="transition ease-in duration-150"
    x-transition:leave-start="opacity-100 transform translate-y-0"
    x-transition:leave-end="opacity-0 transform -translate-y-2"
    class="accordion-content"
  >
    <p>${content}</p>
  </div>
</div>
```

**File:** `src/components/accordion.html`
```html
<div class="accordion" x-data="{ activeIndex: null }">
  ${items}
</div>
```

**Usage:**
```html
<div class="faq-section">
  <h2>Frequently Asked Questions</h2>
  
  {{accordion-item 
    title="What is mtb.js?" 
    content="mtb.js is a lightweight, component-based static site generator that helps you build fast, modern websites."
    defaultOpen="true"
  }}
  
  {{accordion-item 
    title="Do I need to know JavaScript?" 
    content="No! mtb.js uses simple HTML components. However, you can enhance your sites with JavaScript libraries like Alpine.js."
    defaultOpen="false"
  }}
  
  {{accordion-item 
    title="Is it free to use?" 
    content="Yes, mtb.js is completely free and open source under the MIT license."
    defaultOpen="false"
  }}
</div>
```

### Modal/Dialog Component

**File:** `src/components/modal.html`
```html
<div 
  x-data="{ open: false }" 
  class="modal-wrapper"
>
  <!-- Trigger Button -->
  <button 
    @click="open = true" 
    class="btn btn-${triggerVariant}"
  >
    ${triggerText}
  </button>
  
  <!-- Modal Backdrop -->
  <div 
    x-show="open" 
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0"
    x-transition:enter-end="opacity-100"
    x-transition:leave="transition ease-in duration-200"
    x-transition:leave-start="opacity-100"
    x-transition:leave-end="opacity-0"
    @click="open = false"
    class="modal-backdrop"
  ></div>
  
  <!-- Modal Content -->
  <div 
    x-show="open" 
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0 transform scale-95"
    x-transition:enter-end="opacity-100 transform scale-100"
    x-transition:leave="transition ease-in duration-200"
    x-transition:leave-start="opacity-100 transform scale-100"
    x-transition:leave-end="opacity-0 transform scale-95"
    @click.away="open = false"
    @keydown.escape.window="open = false"
    class="modal-content"
    role="dialog"
    aria-modal="true"
  >
    <div class="modal-header">
      <h3 class="modal-title">${title}</h3>
      <button @click="open = false" class="modal-close" aria-label="Close">
        &times;
      </button>
    </div>
    <div class="modal-body">
      <p>${content}</p>
    </div>
    <div class="modal-footer">
      <button @click="open = false" class="btn btn-outline">Cancel</button>
      <button class="btn btn-primary">${actionText}</button>
    </div>
  </div>
</div>
```

**Usage:**
```html
{{modal 
  triggerText="Open Settings" 
  triggerVariant="primary"
  title="Settings" 
  content="Configure your preferences here."
  actionText="Save Changes"
}}
```

### Tabs Component

**File:** `src/components/tabs.html`
```html
<div x-data="{ activeTab: '${defaultTab}' }" class="tabs-container">
  <div class="tabs-list" role="tablist">
    <button 
      @click="activeTab = 'tab1'" 
      :class="{ 'active': activeTab === 'tab1' }"
      class="tab-button"
      role="tab"
      :aria-selected="activeTab === 'tab1'"
    >
      ${tab1Label}
    </button>
    <button 
      @click="activeTab = 'tab2'" 
      :class="{ 'active': activeTab === 'tab2' }"
      class="tab-button"
      role="tab"
      :aria-selected="activeTab === 'tab2'"
    >
      ${tab2Label}
    </button>
    <button 
      @click="activeTab = 'tab3'" 
      :class="{ 'active': activeTab === 'tab3' }"
      class="tab-button"
      role="tab"
      :aria-selected="activeTab === 'tab3'"
    >
      ${tab3Label}
    </button>
  </div>
  
  <div class="tabs-content">
    <div x-show="activeTab === 'tab1'" class="tab-panel" role="tabpanel">
      ${tab1Content}
    </div>
    <div x-show="activeTab === 'tab2'" class="tab-panel" role="tabpanel">
      ${tab2Content}
    </div>
    <div x-show="activeTab === 'tab3'" class="tab-panel" role="tabpanel">
      ${tab3Content}
    </div>
  </div>
</div>
```

**Usage:**
```html
{{tabs 
  defaultTab="tab1"
  tab1Label="Features" 
  tab1Content="Discover all the amazing features of mtb.js including component props, nested components, and watch mode."
  tab2Label="Installation" 
  tab2Content="Install mtb.js globally with npm install -g mtb or locally in your project."
  tab3Label="Examples" 
  tab3Content="Check out our examples page for detailed usage patterns and real-world applications."
}}
```

### Dropdown Menu Component

**File:** `src/components/dropdown.html`
```html
<div x-data="{ open: false }" class="dropdown" @click.away="open = false">
  <button 
    @click="open = !open" 
    class="dropdown-trigger btn btn-${variant}"
    :aria-expanded="open"
  >
    ${label}
    <svg class="dropdown-arrow" :class="{ 'rotate-180': open }" viewBox="0 0 24 24" width="16" height="16">
      <path d="M7 10l5 5 5-5z"/>
    </svg>
  </button>
  
  <div 
    x-show="open"
    x-transition:enter="transition ease-out duration-100"
    x-transition:enter-start="transform opacity-0 scale-95"
    x-transition:enter-end="transform opacity-100 scale-100"
    x-transition:leave="transition ease-in duration-75"
    x-transition:leave-start="transform opacity-100 scale-100"
    x-transition:leave-end="transform opacity-0 scale-95"
    class="dropdown-menu"
  >
    ${menuItems}
  </div>
</div>
```

**File:** `src/components/dropdown-item.html`
```html
<a href="${href}" class="dropdown-item" @click="open = false">
  ${text}
</a>
```

**Usage:**
```html
<nav>
  {{dropdown label="Products" variant="ghost" menuItems="
    <a href='/products/web' class='dropdown-item'>Web Development</a>
    <a href='/products/mobile' class='dropdown-item'>Mobile Apps</a>
    <a href='/products/design' class='dropdown-item'>UI/UX Design</a>
  "}}
</nav>
```

### Toast Notification Component

**File:** `src/components/toast.html`
```html
<div 
  x-data="{ show: false, message: '' }"
  x-on:show-toast.window="show = true; message = $event.detail.message; setTimeout(() => show = false, 3000)"
  class="toast-container"
>
  <div 
    x-show="show"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="transform translate-y-full opacity-0"
    x-transition:enter-end="transform translate-y-0 opacity-100"
    x-transition:leave="transition ease-in duration-200"
    x-transition:leave-start="transform translate-y-0 opacity-100"
    x-transition:leave-end="transform translate-y-full opacity-0"
    class="toast toast-${variant}"
  >
    <span x-text="message"></span>
    <button @click="show = false" class="toast-close">&times;</button>
  </div>
</div>
```

**File:** `src/components/toast-trigger.html`
```html
<button 
  @click="$dispatch('show-toast', { message: '${message}' })"
  class="btn btn-${variant}"
>
  ${text}
</button>
```

**Usage:**
```html
<!-- Place the toast container once on the page -->
{{toast variant="success"}}

<!-- Trigger toasts from anywhere -->
{{toast-trigger text="Show Success" message="Operation completed successfully!" variant="primary"}}
{{toast-trigger text="Show Info" message="Here's some information for you." variant="secondary"}}
```

---

## Full Project Example

Here's a complete project structure combining everything we've learned.

### Project Structure
```
my-website/
├── src/
│   ├── components/
│   │   ├── head.html
│   │   ├── header.html
│   │   ├── nav.html
│   │   ├── footer.html
│   │   ├── hero.html
│   │   ├── button.html
│   │   ├── card.html
│   │   ├── counter.html
│   │   ├── accordion-item.html
│   │   └── contact-form.html
│   └── pages/
│       ├── index.html
│       ├── about.html
│       ├── services.html
│       └── contact.html
├── public/
│   ├── css/
│   │   └── main.css
│   └── images/
├── mtb.config.js
└── package.json
```

### Hero Section Component

**File:** `src/components/hero.html`
```html
<section class="hero" x-data="{ loaded: false }" x-init="setTimeout(() => loaded = true, 100)">
  <div 
    class="hero-content"
    :class="{ 'animate-in': loaded }"
  >
    <h1 class="hero-title">${title}</h1>
    <p class="hero-subtitle">${subtitle}</p>
    <div class="hero-actions">
      {{button text="${primaryCta}" variant="primary" type="button"}}
      {{button text="${secondaryCta}" variant="outline" type="button"}}
    </div>
  </div>
</section>
```

### Complete Home Page

**File:** `src/pages/index.html`
```html
<!DOCTYPE html>
<html lang="en">
{{head title="Home" description="Welcome to our amazing website built with mtb.js"}}
<body>
  {{header}}
  
  <main>
    {{hero 
      title="Build Amazing Websites" 
      subtitle="mtb.js makes it easy to create fast, modern static sites with reusable components."
      primaryCta="Get Started"
      secondaryCta="Learn More"
    }}
    
    <section class="features">
      <div class="container">
        <h2>Why Choose mtb.js?</h2>
        <div class="features-grid">
          {{card 
            title="Lightning Fast" 
            description="Static HTML means blazing fast load times"
            image="/images/fast.svg"
            link="/features/speed"
            variant="default"
          }}
          {{card 
            title="Component Based" 
            description="Reusable components for consistent design"
            image="/images/components.svg"
            link="/features/components"
            variant="default"
          }}
          {{card 
            title="Zero Runtime" 
            description="No JavaScript framework overhead"
            image="/images/lightweight.svg"
            link="/features/lightweight"
            variant="default"
          }}
        </div>
      </div>
    </section>
    
    <section class="interactive-demo">
      <div class="container">
        <h2>Interactive Components</h2>
        <p>Combine mtb.js with Alpine.js for interactive experiences:</p>
        {{counter title="Try the Counter"}}
      </div>
    </section>
    
    <section class="faq">
      <div class="container">
        <h2>Frequently Asked Questions</h2>
        {{accordion-item 
          title="Is mtb.js free?" 
          content="Yes! mtb.js is completely free and open source under the MIT license."
          defaultOpen="true"
        }}
        {{accordion-item 
          title="Can I use it with other frameworks?" 
          content="Absolutely! mtb.js works great with Alpine.js, HTMX, or any other lightweight JavaScript library."
          defaultOpen="false"
        }}
      </div>
    </section>
  </main>
  
  {{footer}}
  
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</body>
</html>
```

---

## Tips and Best Practices

### 1. Organize Components by Function
```
src/components/
├── layout/           # Header, footer, nav
├── ui/               # Buttons, cards, forms
├── sections/         # Hero, features, testimonials
└── interactive/      # Alpine.js components
```

### 2. Use Meaningful Prop Names
```html
<!-- Good: Clear and descriptive -->
{{button text="Submit" variant="primary" type="submit"}}

<!-- Avoid: Unclear abbreviations -->
{{button t="Submit" v="p" tp="s"}}
```

### 3. Keep Components Focused
Each component should do one thing well. If a component is getting complex, consider breaking it into smaller pieces.

### 4. Document Your Components
Add comments to explain expected props:
```html
<!-- 
  Card Component
  Props:
    - title: Card heading (required)
    - description: Card body text (required)
    - image: Image URL (required)
    - link: Destination URL (required)
    - variant: "default" | "featured" | "compact"
-->
<article class="card card-${variant}">
  ...
</article>
```

### 5. Use Watch Mode for Development
```bash
mtb --watch
```
This automatically rebuilds your site when you make changes, speeding up development.

---

## Need More Help?

- Check out the [README](./README.md) for quick start information
- Visit the [GitHub repository](https://github.com/DiegoVallejoDev/mtb) for issues and contributions
- Join the community discussions for tips and support

Happy building with mtb.js! 🚵
