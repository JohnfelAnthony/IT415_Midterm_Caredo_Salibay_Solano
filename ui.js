// Local SVG artwork and a shared icon vocabulary. No external image requests.
const KIOSK_ICONS = {
  gear: '<path d="m9 3 1-2h4l1 2 2 1 2-1 2 3-1 2v3l1 2-2 3-2-1-2 1-1 2h-4l-1-2-2-1-2 1-2-3 1-2V8L2 6l2-3 2 1Z"/><circle cx="12" cy="11" r="4"/>',
  cup: '<path d="M4 9h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z"/><path d="M16 10h2a3 3 0 0 1 0 6h-2M3 23h16M7 2v3m5-3v3"/>',
  bag: '<path d="M4 7h16l1 15H3Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
  receipt: '<path d="M5 3h14v19l-3-2-4 2-4-2-3 2Z"/><path d="M8 7h8m-8 4h8m-8 4h5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  plate: '<circle cx="13" cy="12" r="6"/><path d="M3 3v7m3-7v7m-3-3h3m-1.5 3v11m16-18v18M21.5 3c-3 1-3 8 0 8"/>',
  cookie: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="8" r="1"/><circle cx="15" cy="7" r="1"/><circle cx="12" cy="14" r="1"/><circle cx="7" cy="15" r="1"/><circle cx="17" cy="14" r="1"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  cash: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M5 9v6m14-6v6"/>',
  qr: '<path d="M2 9V2h7m6 0h7v7m0 6v7h-7m-6 0H2v-7"/><rect x="6" y="6" width="4" height="4"/><rect x="14" y="6" width="4" height="4"/><rect x="6" y="14" width="4" height="4"/><path d="M14 14h4v4h-4m4 0v3"/>',
  card: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20M6 15h4"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12 4 4 10-10"/>',
  alert: '<path d="m12 3 10 18H2Z"/><path d="M12 9v5m0 3v1"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  print: '<path d="M6 9V3h12v6M6 17H3V9h18v8h-3M6 14h12v7H6Z"/><path d="M17 11h1"/>',
  wifi: '<path d="M3 7a14 14 0 0 1 18 0M6 11a9 9 0 0 1 12 0m-9 4a4 4 0 0 1 6 0m-3 4v1"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
};

function kioskIcon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${KIOSK_ICONS[name] || KIOSK_ICONS.gear}</svg>`;
}

// Warm, engraved menu illustrations, drawn specifically for this catalog.
function productArtwork(id) {
  const drawings = {
    1: '<ellipse cx="88" cy="114" rx="57" ry="9" fill="#dac197"/><ellipse cx="88" cy="107" rx="53" ry="9" fill="#f8e9c9"/><path d="M121 51h11c23 0 23 36 1 38h-13" fill="none" stroke="#8f613b" stroke-width="8"/><path d="M48 49h77l-5 43q-3 20-34 20T52 91Z" fill="#ede0ba"/><path d="M49 50h75l-2 13H50Z" fill="#b5a642"/><ellipse cx="86" cy="49" rx="38" ry="10" fill="#795030"/><ellipse cx="86" cy="48" rx="31" ry="6" fill="#4b2f23"/><path d="M72 31c-10-9 10-13 0-23m17 24c-10-9 10-13 0-23m17 24c-10-9 10-13 0-23" fill="none" opacity=".5"/><path d="M65 72v18m6-18v21" opacity=".3"/>',
    2: '<ellipse cx="91" cy="118" rx="66" ry="8" fill="#dac197"/><path d="m26 91 73-52 56 65-113 5Z" fill="#c08c4c"/><path d="m30 83 71-48 52 62-109 4Z" fill="#f0d393"/><path d="m28 79 74-44 52 55-111 8Z" fill="#52664b"/><path d="m32 73 73-39 45 52-106 6Z" fill="#ab5136"/><path d="m33 67 73-36 43 50-104 7Z" fill="#eac17b"/><path d="m30 61 75-34 47 45-108 13Z" fill="#f2dca9"/><path d="m30 61 14 24 108-13-3 9-105 12-14-23Z" fill="#b87333"/><path d="m68 56 21-11m-4 21 20-9m18 5 10 4" stroke="#c39460"/><path d="m100 22-7 43" stroke="#5c0000"/><circle cx="100" cy="21" r="3" fill="#5c0000"/>',
    3: '<ellipse cx="90" cy="119" rx="37" ry="6" fill="#dac197"/><path d="m61 42 8 73h43l8-73Z" fill="#ab5136"/><path d="m65 73 4 42h43l5-42Z" fill="#5c0000"/><ellipse cx="90" cy="42" rx="30" ry="7" fill="#ebd9b8"/><path d="m91 53 15-42h18" fill="none" stroke="#a17a38" stroke-width="5"/><path d="m71 58 8 8 8-8-8-8Zm20 7 8 8 8-8-8-8Z" fill="#f4d6b1" opacity=".8"/><path d="m73 80 3 25" stroke="#d9a471" stroke-width="3"/><ellipse cx="90" cy="88" rx="12" ry="10" fill="#f5deb3"/><path d="m85 88 4 4 7-8"/>',
    4: '<ellipse cx="90" cy="117" rx="57" ry="8" fill="#dac197"/><ellipse cx="73" cy="91" rx="37" ry="26" fill="#a76d36"/><ellipse cx="73" cy="84" rx="38" ry="26" fill="#d4a65e"/><ellipse cx="111" cy="71" rx="37" ry="28" fill="#aa713d"/><ellipse cx="111" cy="65" rx="37" ry="27" fill="#e0b873"/><g fill="#5c3024"><path d="m91 57 5-5 6 4-3 7-7-1Zm23-6 7-3 5 6-6 5Zm8 25 5-4 7 3-2 6Zm-20 0 5-5 5 4-2 6ZM55 83l7-4 6 6-4 5Zm21 12 5-5 8 3-3 7Zm-30 6 4-5 7 1-1 5Z"/></g><g fill="#b1834b" stroke="none"><circle cx="84" cy="83" r="2"/><circle cx="108" cy="61" r="2"/><circle cx="132" cy="61" r="2"/><circle cx="60" cy="97" r="2"/></g>',
    5: '<ellipse cx="91" cy="121" rx="30" ry="5" fill="#dac197"/><path d="M79 19h24v21l10 11v63q0 8-22 8t-22-8V51l10-11Z" fill="#c0d0bf"/><path d="M79 19h24v10H79Z" fill="#008080"/><path d="M69 67h44v33H69Z" fill="#f5deb3"/><path d="M74 75h34m-34 18h34" stroke="#b5a642"/><path d="M91 75q-18 20 0 20t0-20Z" fill="#008080"/><path d="M77 46v16m0 42v9" stroke="#fffff0" stroke-width="3"/><path d="M80 34h22"/>',
    6: '<ellipse cx="90" cy="119" rx="57" ry="6" fill="#dac197"/><path d="m46 31 93 16-13 75-93-16Z" fill="#5a3224"/><g fill="#84503a"><path d="m53 38 24 4-4 20-24-4Zm30 5 24 4-4 20-24-4Zm30 5 20 4-4 20-20-4ZM49 66l24 4-4 20-24-4Zm30 5 24 4-4 20-24-4Zm30 5 20 4-4 20-20-4Z"/></g><path d="m34 88 94 16-3 18-93-16Z" fill="#b87333"/><path d="m36 83 94 16-5 15-93-16Z" fill="#ead3a5"/><path d="m70 92 30 5" stroke="#5c0000"/>',
    7: '<ellipse cx="91" cy="119" rx="61" ry="7" fill="#dac197"/><path d="M32 74h117q-7 48-58 48T32 74Z" fill="#b87333"/><ellipse cx="91" cy="75" rx="58" ry="20" fill="#efe2c1"/><g fill="#e3cf9e" stroke-width="1"><path d="m45 69 6 2m2-8 6 2m3 8 6 2m8-11 6 2m6 13 6 2m16-12 6 2m9 7 6 2m-8-14 6 2m-62 15 6 2m-3 8 6 2m30-5 6 2"/></g><path d="M73 57q7-25 34-13t11 29q-13 14-38 0Z" fill="#b17a43"/><path d="m98 58 23-18" stroke="#c09b63" stroke-width="12"/><circle cx="124" cy="38" r="6" fill="#eddbb5"/><path d="m80 55 9-4m-8 13 11-4m-18 5 6 4" stroke="#714422"/><path d="m44 75 9 2m80 0 9-2" stroke="#687444" stroke-width="6"/><path d="M48 96q16 12 37 14" stroke="#edc38b"/>',
    8: '<ellipse cx="90" cy="120" rx="45" ry="6" fill="#dac197"/><g fill="#deb268" stroke="#a57338"><path d="m53 39 11-2 8 60-12 2Zm18-14 10-2 4 71-11 1Zm18 13 11-1 1 56H90Zm20-12 11 2-9 70-11-2Zm20 19 11 4-20 53-11-4Z"/></g><path d="m48 78 17 43h52l17-43q-41 25-86 0Z" fill="#5c0000"/><path d="m53 88 13 32h49l13-31" fill="none" stroke="#b5a642"/><circle cx="91" cy="104" r="9" fill="#b5a642"/><path d="m86 104 4 3 6-7" stroke="#5c0000"/>',
  };
  return `<svg class="product-art" viewBox="0 0 180 140" fill="none" stroke="#704214" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${drawings[id] || ''}</svg>`;
}

function initializeKioskIcons() {
  document.querySelectorAll('[data-icon]').forEach(element => {
    element.innerHTML = kioskIcon(element.dataset.icon);
  });
}

window.addEventListener('DOMContentLoaded', initializeKioskIcons);
