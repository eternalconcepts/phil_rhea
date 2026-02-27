import { c as createComponent, a as createAstro, r as renderTemplate, b as addAttribute, m as maybeRenderHead, f as renderComponent } from '../chunks/astro/server_zdfufm3s.mjs';
import 'kleur/colors';
import 'clsx';
import { $ as $$Layout } from '../chunks/Layout_BBo8vcZL.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$CalendarForm = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CalendarForm;
  const {
    url = "https://calendly.com/eternalconcepts/intro?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=be123c",
    width = "100%",
    height = "700px"
  } = Astro2.props;
  return renderTemplate(_a || (_a = __template(["<!-- 1) The widget \u201Chost\u201D with your Calendly link on data-url -->", '<div class="flex flex-col justify-center items-center gap-5"> <h3>Schedule an introductory meeting</h3> <div id="calendly-embed"', ' class="mx-auto w-full min-w-[320px] max-w-[600px] lg:min-h-[600px] bg-white aspect-square rounded-xl shadow-xl overflow-hidden" style="width:100%; height:100%;"></div> </div> <!-- 2) Calendly\u2019s script (no async) --> <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript"><\/script> <!-- 3) Init once the page (and script) have loaded --> <script client:load>\n  function initCalendly() {\n    const el = document.getElementById("calendly-embed")\n    if (!window.Calendly || !el) return\n    const url = el.dataset.url\n    window.Calendly.initInlineWidget({\n      url,\n      parentElement: el,\n      resize: true,\n      color: "#0069ff",\n      text: "Your Button Text Here",\n    })\n  }\n\n  // Fire immediately if possible, otherwise wait for window load\n  if (window.Calendly) {\n    initCalendly()\n  } else {\n    window.addEventListener("load", initCalendly)\n  }\n\n  // Optional: listen for scheduling events\n  window.addEventListener("message", (e) => {\n    if (\n      e.origin === "https://calendly.com" &&\n      e.data.event?.startsWith("calendly.")\n    ) {\n      console.log("Calendly Event:", e.data.event)\n      console.log("Event Details:", e.data.payload)\n    }\n  })\n<\/script>'])), maybeRenderHead(), addAttribute(url, "data-url"));
}, "/Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/src/components/homepage/CalendarForm.astro", void 0);

const $$Calendar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="bg-stone-100 py-10 min-h-screen flex flex-col items-center justify-center"> <h2 class="text-2xl">Availability Calendar</h2> ${renderComponent($$result2, "CalendarForm", $$CalendarForm, {})} </section> ` })}`;
}, "/Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/src/pages/calendar.astro", void 0);

const $$file = "/Users/mainmarketing/Desktop/Users/mainmarketing/pers/phil_rhea/src/pages/calendar.astro";
const $$url = "/calendar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Calendar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
