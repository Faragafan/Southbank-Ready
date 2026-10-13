'use strict';

// Bundled, intact photographs. Full provenance: assets/photos/attribution.json.
// No remote image requests are made during the learning activities.
const PHOTO_ASSETS = {
  southbank: {
    file: 'southbank-yarra.jpg', width: 1280, height: 693,
    author: 'Donaldytong', licence: 'CC BY-SA 3.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Melbourne_Yarra_River_of_City_South_%26_North_Bank.jpg',
    alt: 'Southbank towers and the riverside promenade beside Melbourne’s Yarra River under a blue sky.',
    caption: 'Southbank and the Yarra River. Archive neighbourhood photograph.'
  },
  melbourne: {
    file: 'melbourne-flash-flood-2010.jpg', width: 640, height: 480,
    author: 'Nick carson at English Wikipedia', licence: 'CC BY-SA 3.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:2010_Melbourne_storm_flooding_Spencer_and_Flinders_Streets.jpg',
    alt: 'Brown floodwater covers the intersection of Spencer and Flinders Streets in Melbourne, with vehicles along the far side.',
    caption: 'Spencer and Flinders Streets, Melbourne, during flash flooding on 6 March 2010.',
    location: 'Melbourne CBD · 6 March 2010',
    question: 'Can you tell what is under the water?',
    explanation: 'You cannot judge the depth or see hidden hazards from this photo. Never walk, ride or drive through floodwater. Find a dry route and follow current official advice.'
  },
  werribee: {
    file: 'werribee-flood-2011.jpg', width: 1280, height: 1018,
    author: 'Tony Bryer', licence: 'CC BY-SA 2.0', licenceUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Werribee_River_in_flood_over_cottrell_street_in_Werribee.jpg',
    alt: 'Werribee River floodwater covers Cottrell Street, with a road closure barrier in the distance and onlookers near the river.',
    caption: 'Cottrell Street, Werribee, covered by river flooding on 14 January 2011.',
    location: 'Werribee · 14 January 2011',
    question: 'What if your usual route is closed?',
    explanation: 'Respect road closures and stay away from floodwater. Plan an alternative before an emergency, including transport and access needs. Check current conditions before leaving.'
  }
};

function photoCredit(p) {
  return `<div class="photo-credit"><span>Photo:</span> <a href="${p.source}" target="_blank" rel="noopener noreferrer" translate="no" dir="auto">${p.author}</a> · <a href="${p.licenceUrl}" target="_blank" rel="noopener noreferrer" translate="no" dir="ltr">${p.licence}</a></div>`;
}
function photoImage(p, eager = false) {
  return `<img src="assets/photos/${p.file}" width="${p.width}" height="${p.height}" alt="${p.alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
function welcomePhoto() {
  const p = PHOTO_ASSETS.werribee;
  return `<figure class="welcome-photo"><div class="photo-heading"><span class="neighbourhood-dot" aria-hidden="true"></span><span>Flooding changes familiar places.</span></div>${photoImage(p, true)}<figcaption><p>${p.caption}</p><p>Historical photo. Stay away from floodwater.</p>${photoCredit(p)}</figcaption></figure>`;
}
function floodPhotoLesson() {
  return `<section class="photo-lesson" aria-labelledby="photo-lesson-title"><div class="mini-label">LOOK CLOSER</div><h2 id="photo-lesson-title">A familiar street can change.</h2><p class="photo-intro">Explore two past floods in Greater Melbourne. Open each question to reveal a practical takeaway.</p><div class="flood-photo-grid">${['melbourne','werribee'].map(key => {
    const p = PHOTO_ASSETS[key];
    return `<article class="flood-photo-card"><figure><div class="flood-photo-image">${photoImage(p)}</div><figcaption><div class="photo-location">${p.location}</div><p>${p.caption}</p>${photoCredit(p)}</figcaption></figure><details class="photo-question"><summary><span>${p.question}</span><span class="reveal-symbol" aria-hidden="true">+</span></summary><p>${p.explanation}</p></details></article>`;
  }).join('')}</div><p class="photo-context">Historical examples, not current conditions or photographs of Southbank. People and vehicles shown near floodwater are not examples to copy. Stay away from floodwater.</p></section>`;
}
function photoCredits() {
  return `<section class="photo-sources" aria-labelledby="photo-sources-title"><div class="mini-label">THE IMAGES IN THIS MODULE</div><h2 id="photo-sources-title">Photo credits</h2><p>Photographs are included under the licences linked below. The creators do not endorse this module. Images are bundled for offline use; no local image edits have been made.</p><div class="photo-source-grid">${Object.values(PHOTO_ASSETS).map(p => `<figure>${photoImage(p)}<figcaption><p>${p.caption}</p>${photoCredit(p)}</figcaption></figure>`).join('')}</div><p class="body-note">Illustrations are learning aids. Confirm the real layout, equipment and procedures with your building team.</p></section>`;
}

// Decorative illustrations reinforce the adjacent translated labels and advice.
// They contain no text and do not replace the accessible button names.
function kitPicture(id) {
  const drawings = {
    meds: '<rect x="25" y="27" width="40" height="54" rx="9" fill="#fff"/><rect x="29" y="17" width="32" height="13" rx="3" fill="#183ee8"/><path d="M39 18v10m12-10v10" stroke="#fff"/><rect x="25" y="43" width="40" height="24" fill="#c6f36a"/><path d="M45 48v14m-7-7h14"/><path d="m79 49 11 11a11 11 0 0 1-16 16L63 65a11 11 0 0 1 16-16Z" fill="#ffbf91"/><path d="m68 71 15-15"/>',
    food: '<path d="M24 33h20l5 12v36H19V45Z" fill="#bce7ff"/><rect x="24" y="21" width="20" height="12" rx="3" fill="#183ee8"/><path d="M20 58h28m-28 9h28" stroke="#5399c6"/><rect x="59" y="40" width="38" height="41" rx="7" fill="#c6f36a"/><ellipse cx="78" cy="42" rx="19" ry="6" fill="#fff"/><ellipse cx="72" cy="61" rx="4" ry="6" transform="rotate(25 72 61)" fill="#fff"/><ellipse cx="84" cy="66" rx="4" ry="6" transform="rotate(-25 84 66)" fill="#fff"/>',
    torch: '<path d="m21 49 18-16 38 33-18 19Z" fill="#183ee8"/><path d="m23 47-8-18 15-16 18 11Z" fill="#c6f36a"/><path d="m45 10 8 9m12-8-7 12m-39-17 2 8" stroke="#c68822"/><rect x="45" y="45" width="11" height="14" rx="3" transform="rotate(-45 50 52)" fill="#fff"/><path d="m59 80 16-16" stroke="#fff"/>',
    radio: '<path d="m58 30 30-21"/><rect x="17" y="31" width="83" height="49" rx="9" fill="#c6f36a"/><circle cx="42" cy="57" r="17" fill="#fff"/><path d="M32 50h20m-22 7h24m-22 7h20" stroke="#91aaaf"/><rect x="69" y="41" width="22" height="10" rx="2" fill="#bce7ff"/><circle cx="75" cy="66" r="5" fill="#183ee8"/><circle cx="91" cy="66" r="4" fill="#183ee8"/>',
    docs: '<rect x="17" y="24" width="45" height="57" rx="5" fill="#183ee8"/><circle cx="39" cy="48" r="12" fill="none" stroke="#fff"/><path d="M28 48h22m-11-12q-10 12 0 24m0-24q10 12 0 24m-12 12h24" stroke="#fff"/><path d="M64 15h25l11 11v47H64Z" fill="#fff"/><path d="M89 15v12h11M72 38h19m-19 9h19m-19 9h12"/><circle cx="80" cy="78" r="9" fill="#c6f36a"/><path d="m87 84 12 10m-7-5 4-4"/>',
    charger: '<rect x="19" y="18" width="37" height="65" rx="7" fill="#fff"/><rect x="24" y="26" width="27" height="42" rx="3" fill="#bce7ff"/><path d="M33 21h9m-9 54h9"/><rect x="68" y="36" width="29" height="47" rx="6" fill="#c6f36a"/><path d="M80 47h6m-3 10-5 8h9l-5 8"/><path d="M37 83v7q0 7 14 7h18q14 0 14-14" fill="none"/>',
    firstaid: '<path d="M42 31v-9h30v9" fill="none"/><rect x="19" y="30" width="78" height="51" rx="10" fill="#c6f36a"/><circle cx="58" cy="56" r="18" fill="#fff"/><path d="M58 45v22M47 56h22" stroke="#183ee8" stroke-width="7"/><path d="M26 36v38m64-38v38" stroke="#91b745"/>',
    candle: '<path d="M58 14c-16 17-14 26-4 29 17 4 19-15 4-29Z" fill="#ffbf91"/><path d="M58 38v12"/><rect x="40" y="48" width="36" height="35" rx="4" fill="#fff"/><path d="M40 52q8 13 13 2 8 16 12 0 6 8 11-2" fill="#c6f36a"/><ellipse cx="58" cy="84" rx="33" ry="6" fill="#bce7ff"/>',
    heavy: '<rect x="23" y="31" width="70" height="39" rx="9" fill="#bce7ff"/><rect x="21" y="58" width="74" height="22" rx="5" fill="#c6f36a"/><rect x="15" y="46" width="15" height="34" rx="5" fill="#c6f36a"/><rect x="87" y="46" width="15" height="34" rx="5" fill="#c6f36a"/><path d="M24 80v8m68-8v8M58 33v23"/>',
    stove: '<rect x="18" y="53" width="81" height="29" rx="7" fill="#c6f36a"/><ellipse cx="58" cy="51" rx="29" ry="8" fill="#fff"/><path d="M39 48V30h38v18q-19 10-38 0Z" fill="#bce7ff"/><path d="M77 36h13m-51 0H29m14-8h30m-22 0v-6h14v6"/><circle cx="82" cy="67" r="5" fill="#183ee8"/><path d="M32 84v5m54-5v5"/>'
  };
  return `<svg class="kit-picture" viewBox="0 0 116 104" fill="none" stroke="#162838" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><ellipse cx="58" cy="89" rx="48" ry="8" fill="#162838" opacity=".06" stroke="none"/>${drawings[id] || drawings.charger}</svg>`;
}

function buildingPicture(selected) {
  const highlight = {home: ['128','96'], lobby: ['228','70'], basement: ['305','84'], recovery: ['305','84']}[selected] || ['128','96'];
  return `<figure class="building-visual"><svg class="building-cutaway" viewBox="0 0 600 416" aria-hidden="true" focusable="false" fill="none" stroke="#162838" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <rect x="1" y="1" width="598" height="414" rx="18" fill="#eef5fa" stroke="none"/>
    <path d="M45 94h35m-18-14v28m449-15h25m-12-12v24" stroke="#aac5d6"/>
    <path d="M0 302h600v114H0Z" fill="#d8e2e7" stroke="none"/>
    <rect x="104" y="55" width="390" height="333" rx="6" fill="#fff"/>
    <path d="M94 55h410M104 122h390M104 224h390M104 300h390"/>
    <rect x="110" y="${highlight[0]}" width="378" height="${highlight[1]}" rx="4" fill="#c6f36a" stroke="#183ee8" stroke-width="4"/>
    <path d="M235 124v174M384 124v174"/>
    <g fill="#bce7ff"><rect x="126" y="71" width="65" height="31" rx="4"/><rect x="216" y="71" width="65" height="31" rx="4"/><rect x="308" y="71" width="65" height="31" rx="4"/><rect x="401" y="71" width="65" height="31" rx="4"/></g>
    <g fill="#fff"><rect x="123" y="159" width="79" height="44" rx="5"/><rect x="129" y="179" width="67" height="23" rx="3"/><rect x="250" y="145" width="55" height="62" rx="4"/><path d="M414 201h56v-48h-12v12h-13v12h-13v12h-18Z"/></g>
    <path d="M138 204v8m51-8v8m-39-53v19m128-30v55m-18-26h8m20 0h8"/>
    <rect x="331" y="177" width="27" height="32" rx="6" fill="#183ee8"/><path d="M338 177v-7h13v7m-6 8v12m-6-6h12" stroke="#fff"/>
    <rect x="130" y="246" width="65" height="33" rx="4" fill="#fff"/><path d="M140 255h44m-44 9h27"/>
    <rect x="253" y="239" width="51" height="54" rx="3" fill="#bce7ff"/><path d="M279 240v52"/>
    <path d="M410 294v-54h51v54m-12-30v6" fill="#fff"/>
    <path d="M0 301h104m390 0h106" stroke-width="5"/>
    <path d="M504 266q-17-23 0-43 21 17 0 43m0 0v32" fill="#a9cd8d"/>
    <g fill="#fff"><path d="m137 345 14-22h67l16 22v24h-97Z"/><rect x="323" y="328" width="53" height="43" rx="3"/><rect x="382" y="344" width="53" height="27" rx="3"/></g>
    <path d="M157 325v18h54v-18m-73 20h95m-89 11h14m55 0h14m122-26v14m59 0v13"/>
    <circle cx="153" cy="370" r="7" fill="#162838"/><circle cx="219" cy="370" r="7" fill="#162838"/>
    ${['basement','recovery'].includes(selected) ? '<path d="M111 362q23-10 47 0t47 0t47 0t47 0t47 0t47 0t47 0v20H111Z" fill="#87c3e9" opacity=".85" stroke="none"/><path d="M268 335h28m-22-7 17 16" stroke="#183ee8"/>' : ''}
  </svg><figcaption>Illustration only. Confirm your building’s layout with management.</figcaption></figure>`;
}

function powerPicture(id) {
  if (id === 'daily') return kitPicture('food');
  if (id === 'connection') return kitPicture('charger');
  const drawing = id === 'lift'
    ? '<rect x="18" y="12" width="80" height="80" rx="6" fill="#fff"/><rect x="27" y="32" width="50" height="52" rx="2" fill="#bce7ff"/><path d="M52 32v52m-25-33h50"/><rect x="46" y="19" width="14" height="7" rx="1" fill="#162838"/><circle cx="87" cy="52" r="3"/><path d="m33 42 36 34m0-34L33 76" stroke="#183ee8" stroke-width="5"/>'
    : '<rect x="14" y="17" width="60" height="45" rx="6" fill="#fff"/><rect x="20" y="23" width="48" height="29" rx="3" fill="#bce7ff"/><path d="M25 39h8l5-9 8 17 6-8h11m-27 23v10m-11 0h38"/><rect x="79" y="47" width="25" height="36" rx="4" fill="#c6f36a"/><path d="M87 47v-7h10v7m-6 9-4 8h9l-5 9M62 60v24q0 8 9 8h14q8 0 8-9"/>';
  return `<svg class="kit-picture" viewBox="0 0 116 104" fill="none" stroke="#162838" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${drawing}</svg>`;
}
