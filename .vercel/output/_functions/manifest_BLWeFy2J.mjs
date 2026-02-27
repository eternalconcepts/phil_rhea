import 'kleur/colors';
import { g as decodeKey } from './chunks/astro/server_zdfufm3s.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_BilzLBZ4.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/","cacheDir":"file:///Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/node_modules/.astro/","outDir":"file:///Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/dist/","srcDir":"file:///Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/src/","publicDir":"file:///Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/public/","buildClientDir":"file:///Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/dist/client/","buildServerDir":"file:///Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/contact","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/contact\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/contact.ts","pathname":"/api/contact","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/calendar.CPxTOOD4.css"}],"routeData":{"route":"/calendar","isIndex":false,"type":"page","pattern":"^\\/calendar\\/?$","segments":[[{"content":"calendar","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/calendar.astro","pathname":"/calendar","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/calendar.CPxTOOD4.css"},{"type":"inline","content":"label[data-astro-cid-vccdhhid] p[data-astro-cid-vccdhhid]{position:absolute;left:1rem;top:1.65rem;transform-origin:top left;transform:translateY(-50%);color:#000;transition:all .15s ease-out;pointer-events:none}label[data-astro-cid-vccdhhid].active p[data-astro-cid-vccdhhid]{top:0;letter-spacing:.05em;transform:translateY(.1rem) scale(.8);color:#9ca3af}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/src/pages/calendar.astro",{"propagation":"none","containsHead":true}],["/Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/api/contact@_@ts":"pages/api/contact.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/calendar@_@astro":"pages/calendar.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","/Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_417n2puE.mjs","\u0000@astrojs-manifest":"manifest_BLWeFy2J.mjs","/Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/src/components/homepage/TestimonialsCarousel.astro?astro&type=script&index=0&lang.ts":"_astro/TestimonialsCarousel.astro_astro_type_script_index_0_lang.BZsqTeZX.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/src/components/homepage/TestimonialsCarousel.astro?astro&type=script&index=0&lang.ts","function E(o){const l=o.querySelector(\".carousel-wrapper\"),c=o.querySelector(\".carousel-track\"),a=o.querySelector(\".carousel-prev\"),i=o.querySelector(\".carousel-next\"),r=o.querySelector(\".carousel-dots\"),d=Array.from(c.children),s=d.length,S=Math.ceil(d.length/s);let f,v,u=0,t=0;function L(){f=d[0].clientWidth;const e=getComputedStyle(c);v=parseFloat(e.columnGap)||parseFloat(e.gap)||0,u=(f+v)*S;const n=c.scrollWidth>l.clientWidth+1;if(r.style.display=n?\"flex\":\"none\",a.style.display=\"none\",i.style.display=\"none\",!!n){r.innerHTML=\"\";for(let g=0;g<s;g++){const h=document.createElement(\"button\");h.className=\"h-2 w-2 rounded-full bg-gray-400\",h.addEventListener(\"click\",()=>p(g)),r.appendChild(h)}y()}}function p(e){t=e,l.scrollTo({left:u*e,behavior:\"smooth\"}),y()}function y(){a.style.display=t===0?\"none\":\"block\",i.style.display=t===s-1?\"none\":\"block\",r.querySelectorAll(\"button\").forEach((e,n)=>{e.classList.toggle(\"bg-red-700\",n===t),e.classList.toggle(\"bg-gray-400\",n!==t)})}a.addEventListener(\"click\",()=>p(Math.max(0,t-1))),i.addEventListener(\"click\",()=>p(Math.min(s-1,t+1))),l.addEventListener(\"scroll\",()=>{const e=Math.round(l.scrollLeft/u);e!==t&&(t=e,y())},{passive:!0}),window.addEventListener(\"resize\",L),L()}document.addEventListener(\"DOMContentLoaded\",()=>{document.querySelectorAll(\".carousel\").forEach(E)});"]],"assets":["/_astro/LucaPacioliCaps.Bi0FgyEN.woff2","/_astro/TrajanPro-Regular.O-Iisiwo.woff","/_astro/calendar.CPxTOOD4.css","/favicon.svg"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"Z6YtbDcgV0q3NwrlSkVAeiG6n/i1mor49DCS6w3Q994="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
