// 可编辑的主题视觉。这里仅保存图形，逐页文字请修改 content.js。
const visualFrame = body => `
  <svg class="hero-svg" viewBox="0 0 680 680" role="img" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="currentColor" stop-opacity=".18"/>
        <stop offset="1" stop-color="currentColor" stop-opacity=".025"/>
      </linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="12"/></filter>
    </defs>
    <circle cx="340" cy="340" r="265" fill="none" stroke="currentColor" stroke-opacity=".08"/>
    <circle cx="340" cy="340" r="210" fill="none" stroke="currentColor" stroke-opacity=".12" stroke-dasharray="2 12"/>
    ${body}
  </svg>`;

const hero = visualFrame(`
  <g transform="translate(83 98)">
    <path d="M50 110 255 0l205 110-205 110z" fill="url(#panel)" stroke="currentColor" stroke-opacity=".75"/>
    <path d="M50 110v88l205 111 205-111v-88" fill="none" stroke="currentColor" stroke-opacity=".25"/>
    <path d="M94 115 255 30l161 85-161 86z" fill="#080b12" stroke="currentColor" stroke-opacity=".35"/>
    <g fill="currentColor"><circle cx="160" cy="116" r="12"/><circle cx="255" cy="68" r="12"/><circle cx="350" cy="116" r="12"/><circle cx="255" cy="166" r="12"/></g>
    <g stroke="currentColor" stroke-opacity=".55"><path d="m160 116 95-48 95 48-95 50z" fill="none"/><path d="M160 116 255 166M350 116 255 68"/></g>
    <g transform="translate(0 178)"><path d="M50 110 255 0l205 110-205 110z" fill="url(#panel)" stroke="currentColor" stroke-opacity=".55"/><path d="M50 110v70l205 112 205-112v-70" fill="none" stroke="currentColor" stroke-opacity=".2"/></g>
    <g transform="translate(0 348)"><path d="M50 110 255 0l205 110-205 110z" fill="url(#panel)" stroke="currentColor" stroke-opacity=".35"/></g>
  </g>
  <g font-family="monospace" font-size="15" fill="currentColor"><text x="91" y="92">SYSTEM / 01</text><text x="91" y="545">CONTEXT → EXECUTION → FEEDBACK</text></g>`);

const rustack = visualFrame(`
  <g transform="translate(70 112)">
    <rect x="0" y="0" width="540" height="405" rx="3" fill="#080b12" stroke="currentColor" stroke-opacity=".45"/>
    <path d="M0 50h540" stroke="currentColor" stroke-opacity=".25"/><circle cx="28" cy="25" r="5" fill="currentColor"/><circle cx="48" cy="25" r="5" fill="currentColor" opacity=".55"/><circle cx="68" cy="25" r="5" fill="currentColor" opacity=".25"/>
    <g transform="translate(55 91)" fill="none" stroke="currentColor">
      <path d="M118 72c-33 0-47-48-16-64 13-35 66-38 84-7 35-2 47 45 18 63-7 5-15 8-25 8z" fill="url(#panel)"/>
      <path d="M152 72v60M70 176h164M70 176v65M152 176v65M234 176v65" stroke-opacity=".5"/>
      <g fill="#080b12"><rect x="23" y="241" width="94" height="68"/><rect x="105" y="241" width="94" height="68"/><rect x="187" y="241" width="94" height="68"/></g>
      <g font-family="monospace" font-size="15" text-anchor="middle" fill="currentColor" stroke="none"><text x="70" y="282">S3</text><text x="152" y="282">DDB</text><text x="234" y="282">SQS</text></g>
    </g>
    <g font-family="monospace" font-size="14" fill="currentColor"><text x="345" y="106">18 SERVICES</text><text x="345" y="143">779 ROUTES</text><text x="345" y="180">&lt; 1s BOOT</text><text x="345" y="217">≈ 8MB</text></g>
    <path d="M330 246h155M330 270h118M330 294h140M330 318h88" stroke="currentColor" stroke-opacity=".25"/>
  </g>`);

const wearable = visualFrame(`
  <g transform="translate(52 96)">
    <path d="M91 295c69-29 112-93 137-194 9-34 47-45 67-17 28 39 53 77 75 111 25 39 56 60 110 78 39 13 71 43 75 78 4 37-22 61-70 61H122c-69 0-103-82-31-117z" fill="url(#panel)" stroke="currentColor" stroke-width="2"/>
    <path d="M72 362h471M124 326c78 20 143 14 204-23M266 122l82 91M232 167l80 82" fill="none" stroke="currentColor" stroke-opacity=".35"/>
    <rect x="176" y="258" width="92" height="58" rx="8" fill="#080b12" stroke="currentColor"/>
    <circle cx="222" cy="287" r="10" fill="currentColor"/><path d="M222 257v-38M222 219c55-42 102-31 145 10M222 219c73-75 142-59 199-3" fill="none" stroke="currentColor" stroke-linecap="round"/>
    <g transform="translate(365 35)"><rect width="165" height="114" rx="16" fill="#080b12" stroke="currentColor"/><path d="M24 72c20-28 34 23 54-6s37-48 62 1" fill="none" stroke="currentColor"/><circle cx="25" cy="28" r="5" fill="currentColor"/><path d="M40 28h72" stroke="currentColor" stroke-opacity=".3"/></g>
    <g font-family="monospace" font-size="14" fill="currentColor"><text x="71" y="465">IMU → BLE → MOBILE → CLOUD → ML</text></g>
  </g>`);

const book = visualFrame(`
  <g transform="translate(84 82)">
    <path d="M48 75 256 0l208 75-208 78z" fill="url(#panel)" stroke="currentColor"/><path d="M48 75v310l208 91V153L48 75M464 75v310l-208 91" fill="#080b12" fill-opacity=".55" stroke="currentColor" stroke-opacity=".5"/>
    <path d="M256 153v323M80 124l144 57M80 170l144 57M80 216l144 57M80 262l144 57M80 308l144 57" stroke="currentColor" stroke-opacity=".22"/>
    <path d="M288 181l144-57M288 227l144-57M288 273l144-57M288 319l144-57" stroke="currentColor" stroke-opacity=".22"/>
    <g fill="currentColor"><circle cx="109" cy="409" r="8"/><circle cx="158" cy="430" r="8"/><circle cx="207" cy="451" r="8"/><circle cx="305" cy="451" r="8"/><circle cx="354" cy="430" r="8"/><circle cx="403" cy="409" r="8"/></g>
    <g font-family="monospace" font-size="14" fill="currentColor"><text x="86" y="54">PLAN</text><text x="369" y="54">REVIEW</text><text x="175" y="534">SOURCE → BUILD → RELEASE</text></g>
  </g>`);

const softwareToHardware = visualFrame(`
  <g transform="translate(66 102)" fill="none" stroke="currentColor">
    <rect x="0" y="52" width="210" height="162" rx="4" fill="#080b12"/><path d="M0 92h210M25 124h105M25 151h142M25 178h76" stroke-opacity=".32"/>
    <path d="M270 134h122" stroke-width="2" stroke-dasharray="5 10"/><path d="m379 121 16 13-16 13"/>
    <g transform="translate(416 26)"><path d="M29 159c39-18 63-57 77-112 6-20 28-27 40-10 18 24 31 47 47 67 17 22 38 32 71 43 22 7 40 25 40 45 0 21-16 35-43 35H48c-42 0-61-49-19-68z" fill="url(#panel)"/><rect x="79" y="133" width="58" height="38" rx="5" fill="#080b12"/><circle cx="108" cy="152" r="7" fill="currentColor" stroke="none"/></g>
    <path d="M174 322c35-69 70 70 106 0s72 70 108 0 72 70 108 0" stroke-opacity=".7"/>
    <g fill="currentColor" stroke="none" font-family="monospace" font-size="14"><text x="12" y="20">DETERMINISTIC TEST</text><text x="426" y="20">PHYSICAL SIGNAL</text><text x="159" y="410">CODE → MEASUREMENT</text></g>
  </g>`);

const hardwareToKnowledge = visualFrame(`
  <g transform="translate(58 105)" fill="none" stroke="currentColor">
    <path d="M0 150c38-92 76 92 114 0s76 92 114 0" stroke-width="2"/>
    <g fill="currentColor" stroke="none"><circle cx="254" cy="150" r="6"/><circle cx="286" cy="116" r="5" opacity=".8"/><circle cx="286" cy="184" r="5" opacity=".55"/><circle cx="319" cy="92" r="4" opacity=".35"/><circle cx="319" cy="208" r="4" opacity=".25"/></g>
    <path d="M351 62 476 17l125 45-125 47z" fill="url(#panel)"/><path d="M351 62v236l125 55V109M601 62v236l-125 55" fill="#080b12" fill-opacity=".5"/><path d="M376 133h75M376 166h75M376 199h75M501 133h75M501 166h75M501 199h75" stroke-opacity=".25"/>
    <g fill="currentColor" stroke="none" font-family="monospace" font-size="14"><text x="0" y="20">RAW SIGNAL</text><text x="386" y="20">STRUCTURED KNOWLEDGE</text><text x="121" y="410">DATA → EXPLANATION → TRUST</text></g>
  </g>`);

const converge = visualFrame(`
  <g transform="translate(95 90)" fill="none" stroke="currentColor">
    <circle cx="245" cy="248" r="78" fill="url(#panel)"/><circle cx="245" cy="248" r="14" fill="currentColor"/>
    <circle cx="78" cy="94" r="62"/><circle cx="412" cy="94" r="62"/><circle cx="245" cy="448" r="62"/>
    <path d="m120 139 72 67M370 139l-72 67M245 386v-60" stroke-width="2" stroke-dasharray="5 9"/>
    <path d="M78 75v38M59 94h38M389 92h46M245 423v50M220 448h50" stroke-opacity=".6"/>
    <path d="M165 248a80 80 0 0 1 151-36" stroke-width="3"/><path d="m308 196 17 17-23 8"/>
    <g fill="currentColor" stroke="none" font-family="monospace" font-size="14" text-anchor="middle"><text x="78" y="15">SOFTWARE</text><text x="412" y="15">HARDWARE</text><text x="245" y="533">KNOWLEDGE</text></g>
  </g>`);

window.VISUALS = { hero, rustack, wearable, book, softwareToHardware, hardwareToKnowledge, converge };
