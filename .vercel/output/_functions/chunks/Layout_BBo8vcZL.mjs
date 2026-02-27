import { c as createComponent, a as createAstro, r as renderTemplate, u as unescapeHTML, b as addAttribute, d as renderHead, e as renderSlot, f as renderComponent } from './astro/server_zdfufm3s.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                            */

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro$1 = createAstro();
const $$Seo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Seo;
  const {
    title = "Eternal Concepts by Philip J. Rhea",
    description = "Architecture, Remodeling, Elevation and Renderings by Philip J. Rhea",
    canonical = "/",
    noindex = false,
    lang = "en",
    image = "/og-image.jpg",
    // Replace with your default OG image
    twitterUsername = "@yourhandle",
    additionalMeta = [],
    additionalLink = []
  } = Astro2.props;
  const siteUrl = "https://your-portfolio.com";
  const fullUrl = `${siteUrl.replace(/\/$/, "")}${canonical}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Philip Rhea",
    url: siteUrl,
    image: `${siteUrl}/avatar.jpg`,
    sameAs: ["https://linkedin.com/in/your-profile", "https://x.com/yourhandle"],
    jobTitle: "Creative Director & Front-End Developer",
    worksFor: {
      "@type": "Organization",
      name: "Freelance / Self-Employed"
    },
    description: "Portfolio of Dennis Lindo, showcasing front-end development and creative design expertise."
  };
  return renderTemplate(_a$1 || (_a$1 = __template$1(["<head>", "</head><title>", '</title> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <meta name="description"', '> <!-- Open Graph / Facebook --> <meta property="og:type" content="website"> <meta property="og:url"', '> <meta property="og:title"', '> <meta property="og:description"', '> <meta property="og:image"', '> <!-- Twitter --> <meta name="twitter:card" content="summary_large_image"> <meta name="twitter:url"', '> <meta name="twitter:title"', '> <meta name="twitter:description"', '> <meta name="twitter:image"', '> <meta name="twitter:creator"', '> <!-- Canonical + Robots --> <link rel="canonical"', '> <meta name="robots"', '> <!-- Global Structured Data --> <script type="application/ld+json">', "<\/script> "])), renderHead(), title, addAttribute(description, "content"), addAttribute(fullUrl, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(image, "content"), addAttribute(fullUrl, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(image, "content"), addAttribute(twitterUsername, "content"), addAttribute(fullUrl, "href"), addAttribute(noindex ? "noindex, nofollow" : "index, follow", "content"), unescapeHTML(JSON.stringify(structuredData)));
}, "/Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/src/components/layout/Seo.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    metaTitle,
    description,
    canonical = Astro2.url.pathname,
    noindex = false,
    image = "/og-image.jpg",
    twitterUsername = "@yourhandle",
    additionalMeta = [],
    additionalLink = []
  } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head>', "", '</head> <body class="min-h-screen flex flex-col overflow-hidden"> <header class="bg-white/60 backdrop-blur-lg h-16 fixed top-0 w-full z-[10000] flex justify-center items-center"> <nav class="w-full flex flex-row justify-between items-center p-5"> <a href="/" class="text-xl font-serif text-gray-600 w-max min-w-max"> <h1 class="leading-5">\neternal concepts<br> <span class="font-serif font-light italic text-stone-400 text-sm">by Philip J. Rhea</span> </h1> </a> <!-- Off-canvas by default on mobile, normal on lg+ --> <ul class="fixed w-1/2 lg:w-max top-16 right-0 z-50 lg:static lg:translate-x-0 lg:flex duration-500 gap-4 delay-75 ease-in-out" id="menuLinks"> <li> <a href="/contact" class="hover:underline block px-4 py-2">Profile</a> </li> <li> <a href="/about" class="hover:underline block px-4 py-2">Philosophy</a> </li> <li> <a href="/portfolio" class="hover:underline block px-4 py-2">Portfolio</a> </li> <li> <a href="/parley" class="hover:underline block px-4 py-2">Parley</a> </li> <li> <a href="/proposal" class="hover:underline block px-4 py-2">Proposal</a> </li> <li> <a href="/portal" class="hover:underline block px-4 py-2">Portal</a> </li> </ul> <button class="relative aspect-square duration-200 lg:hidden size-8 burger border border-stone-300 overflow-hidden" data-state="init" onclick="burgerMenu(this)"> <span class="line-1"></span> <span class="line-2"></span> <span class="line-3"></span> </button> </nav> </header> <main class="w-screen overflow-hidden h-full min-h-[calc(100vh-8rem)] bg-stone-200"> <div id="pageContent" class="duration-500 ease-[cubic-bezier(1,-0.13,.17,1.18)] h-screen pt-16 overflow-auto relative origin-top-left bg-white"> ', ' <footer class="bg-gray-800 text-white text-center p-4 w-full h-16 text-sm">\n&copy; ', ' Eternal Concepts by Philip J. Rhea.<br>All rights reserved.\n</footer> </div> </main> <script>\n      function burgerMenu(button) {\n        // 1) flip the state\n        const state = button.getAttribute("data-state")\n        const next = state === "on" ? "off" : "on"\n        button.setAttribute("data-state", next)\n\n        // 2) toggle button colors\n        // button.classList.remove("bg-green-500")\n        // button.classList.toggle("bg-blue-500", next === "off")\n        // button.classList.toggle("bg-red-500", next === "on")\n\n        // 3) transform page content\n        const main = document.getElementById("pageContent")\n        const closedMenu = [\n          "scale-[100%]",\n          "translate-x-[0%]",\n          "translate-y-[0%]",\n          "w-screen",\n          "overflow-auto",\n        ]\n        const openMenu = [\n          "scale-[50%]",\n          "overflow-hidden",\n          "w-screen",\n          "border",\n          "border-stone-300",\n          "shadow-xl",\n          "rounded-2xl",\n          "-translate-x-[20%]",\n          "translate-y-[25%]",\n        ]\n        if (next === "on") {\n          main.classList.remove(...closedMenu)\n          main.classList.add(...openMenu)\n        } else {\n          main.classList.remove(...openMenu)\n          main.classList.add(...closedMenu)\n          setTimeout(() => main.classList.remove("w-screen"), 300)\n        }\n\n        // 4) slide the links in/out\n        const links = document.getElementById("menuLinks")\n        if (next === "on") {\n          // bring on-screen\n          links.classList.remove("translate-x-full")\n          links.classList.add("translate-x-0")\n        } else {\n          // push off-screen\n          links.classList.remove("translate-x-0")\n          links.classList.add("translate-x-full")\n        }\n\n        // 5) re-trigger stagger animation if you use it\n        if (next === "on") {\n          links.classList.remove("links-open")\n          void links.offsetWidth\n          links.classList.add("links-open")\n        } else {\n          links.classList.remove("links-open")\n        }\n      }\n    <\/script> </body> </html>'])), renderComponent($$result, "Seo", $$Seo, { "title": metaTitle || title, "description": description, "canonical": canonical, "noindex": noindex, "image": image, "twitterUsername": twitterUsername, "additionalMeta": additionalMeta, "additionalLink": additionalLink }), renderHead(), renderSlot($$result, $$slots["default"]), (/* @__PURE__ */ new Date()).getFullYear());
}, "/Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/src/components/layout/Layout.astro", void 0);

export { $$Layout as $ };
