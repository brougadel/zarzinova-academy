/* =====================================================================
   Zarzinova Academy — Formulaires (pré-inscription + contact)
   Envoi par e-mail via Web3Forms : gratuit, sans backend.

   ▶▶ COLLEZ VOTRE CLÉ WEB3FORMS ICI (entre les guillemets) :            */
const WEB3FORMS_ACCESS_KEY = "11dbb05c-6189-47a1-b329-fdb7cc566d35";
/*  Clé gratuite : https://web3forms.com → « Create your Access Key »,
    saisissez l'adresse qui doit recevoir les demandes ; la clé arrive par e-mail.
    Cette clé peut être publique : elle permet seulement d'envoyer vers votre boîte.
    Une seule clé sert aux deux formulaires, sur toutes les pages.
   ===================================================================== */

{
  const ENDPOINT = 'https://api.web3forms.com/submit';
  const PHONE = '+216 93 539 510';
  const DEFAULT_FORMATION = "Orientation — je souhaite être conseillé(e)";
  const $ = id => document.getElementById(id);

  /* ---------- Outils communs ---------- */
  const isMail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  // Numéro tunisien : 8 chiffres commençant par 2, 3, 4, 5, 7 ou 9, avec ou sans +216 / 00216
  const cleanTel = v => v.replace(/[\s.\-()]/g, '');
  const isTnPhone = v => /^(?:\+216|00216)?[234579]\d{7}$/.test(cleanTel(v));
  const formatTel = v => '+216 ' + cleanTel(v).replace(/^(\+216|00216)/, '').replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
  const keyMissing = () => !WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.includes('COLLEZ');

  const setErr = (id, text) => {
    const input = $(id), p = $(id + '-err');
    input.setAttribute('aria-invalid', !!text);
    if (text) input.setAttribute('aria-describedby', id + '-err'); else input.removeAttribute('aria-describedby');
    p.textContent = text; p.classList.toggle('hidden', !text);
  };
  const check = errs => {
    Object.entries(errs).forEach(([id, t]) => setErr(id, t));
    const first = Object.keys(errs).find(k => errs[k]);
    if (first) $(first).focus();
    return !first;
  };
  const clearOnInput = ids => ids.forEach(id => $(id).addEventListener('input', () => { if ($(id).getAttribute('aria-invalid') === 'true') setErr(id, ''); }));
  const busy = (btnId, on, label) => {
    const b = $(btnId); b.disabled = on;
    b.querySelector('.spin').classList.toggle('hidden', !on);
    b.querySelector('.lbl').textContent = on ? 'Envoi en cours…' : label;
  };
  const send = async data => {
    const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ access_key: WEB3FORMS_ACCESS_KEY, from_name: 'Site Zarzinova Academy', ...data }) });
    const out = await res.json().catch(() => ({}));
    if (!res.ok || !out.success) throw new Error(out.message || 'Erreur ' + res.status);
  };
  const field = 'w-full h-12 px-4 rounded-xl border border-line bg-bg outline-none focus:border-skydeep aria-[invalid=true]:border-red-500';
  const err = id => `<p id="${id}-err" class="hidden text-[13px] text-red-600 mt-1"></p>`;
  const spinBtn = (id, label) => `<button id="${id}" class="h-12 w-full rounded-full bg-indigo text-white font-semibold hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2"><svg class="spin hidden animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 3a9 9 0 1 0 9 9" stroke-linecap="round"/></svg><span class="lbl">${label}</span></button>`;
  const check84 = `<svg class="mx-auto" width="84" height="84" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="40" fill="#87ceeb" opacity=".25"/><circle cx="42" cy="42" r="30" fill="var(--emerald)"/><path class="zn-check" d="M29 43l9 9 17-19" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const alertBox = id => `<p id="${id}" class="hidden text-sm rounded-xl px-4 py-3 bg-red-50 text-red-700 border border-red-200" role="alert"></p>`;

  /* =====================================================================
     1. FENÊTRE DE PRÉ-INSCRIPTION (boutons [data-open-signup], avec data-formation)
     ===================================================================== */
  document.body.insertAdjacentHTML('beforeend', `
<dialog id="signup" class="w-[min(94vw,580px)] max-h-[92vh] rounded-3xl p-0 bg-card text-ink border border-line shadow-2xl" aria-labelledby="sTitle">
  <div id="sFormWrap">
    <form id="sForm" class="p-6 sm:p-8 grid gap-4" novalidate>
      <div class="flex items-start justify-between gap-4">
        <div><p class="text-[13px] font-semibold text-skydeep">Pré-inscription</p><h2 id="sTitle" class="text-[22px] font-bold leading-tight mt-1">Rejoignez Zarzinova Academy</h2></div>
        <button type="button" data-close class="w-11 h-11 shrink-0 grid place-items-center rounded-xl border border-line" aria-label="Fermer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      </div>
      <label class="grid gap-1.5 text-sm font-medium">Formation sélectionnée
        <input id="s-formation" readonly tabindex="-1" class="w-full h-12 px-4 rounded-xl border border-line bg-mist font-semibold text-skydeep outline-none cursor-default">
      </label>
      <div class="grid sm:grid-cols-2 gap-4">
        <div><label for="s-name" class="text-sm font-medium">Nom et prénom <span class="text-red-600">*</span></label><input id="s-name" autocomplete="name" class="${field} mt-1.5">${err('s-name')}</div>
        <div><label for="s-tel" class="text-sm font-medium">Téléphone <span class="text-red-600">*</span></label><input id="s-tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="Ex. 93 539 510" class="${field} mt-1.5">${err('s-tel')}</div>
      </div>
      <div><label for="s-mail" class="text-sm font-medium">Adresse e-mail</label><input id="s-mail" type="email" autocomplete="email" placeholder="vous@exemple.com" class="${field} mt-1.5">${err('s-mail')}</div>
      <div><label for="s-level" class="text-sm font-medium">Niveau d'études ou profession</label>
        <input id="s-level" list="s-levels" placeholder="Ex. Étudiant(e), enseignant(e), parent…" class="${field} mt-1.5">
        <datalist id="s-levels"><option value="Élève (primaire)"><option value="Élève (collège / lycée)"><option value="Étudiant(e)"><option value="Demandeur(se) d'emploi"><option value="Salarié(e)"><option value="Acteur / actrice associatif(ve)"><option value="Entrepreneur(e)"><option value="Parent d'élève"></datalist></div>
      <div><label for="s-msg" class="text-sm font-medium">Message ou besoin spécifique</label><textarea id="s-msg" rows="3" maxlength="1500" placeholder="Disponibilités, âge de l'enfant, questions…" class="w-full px-4 py-3 rounded-xl border border-line bg-bg outline-none focus:border-skydeep mt-1.5"></textarea></div>
      <input type="checkbox" id="s-bot" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true">
      ${spinBtn('sSubmit', 'Envoyer ma pré-inscription')}
      ${alertBox('sMsg')}
      <p class="text-[12px] text-soft">Vos données servent uniquement à vous recontacter au sujet de votre inscription.</p>
    </form>
  </div>
  <div id="sDone" class="hidden p-8 sm:p-10 text-center" role="status">
    ${check84}
    <h2 class="mt-5 text-[22px] font-bold leading-snug">Merci <span id="dName"></span>&nbsp;!</h2>
    <p class="mt-3 text-[17px]">Votre demande de pré-inscription a bien été reçue par l'équipe de Zarzinova Academy.</p>
    <p class="mt-2 text-soft text-[15px]">Formation : <b id="dFormation" class="text-ink"></b><br>Nous vous rappelons très vite au <b id="dTel" class="text-ink whitespace-nowrap"></b>.</p>
    <button type="button" data-close class="mt-7 h-12 px-8 rounded-full bg-indigo text-white font-semibold hover:opacity-90">Fermer</button>
  </div>
</dialog>`);

  const dlg = $('signup'), sForm = $('sForm'), sWrap = $('sFormWrap'), sDone = $('sDone'), sMsg = $('sMsg');
  const openSignup = formation => {
    sForm.reset();
    $('s-formation').value = formation || DEFAULT_FORMATION;
    ['s-name','s-tel','s-mail'].forEach(id => setErr(id, ''));
    sMsg.classList.add('hidden'); sWrap.classList.remove('hidden'); sDone.classList.add('hidden');
    try { dlg.showModal(); } catch (_) { dlg.setAttribute('open', ''); }
    $('s-name').focus();
  };
  const closeSignup = () => { try { dlg.close(); } catch (_) { dlg.removeAttribute('open'); } };
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open-signup]');
    if (o) { e.preventDefault(); openSignup(o.dataset.formation); }
    if (e.target.closest('#signup [data-close]') || e.target === dlg) closeSignup();
  });
  clearOnInput(['s-name','s-tel','s-mail']);

  sForm.addEventListener('submit', async e => {
    e.preventDefault(); sMsg.classList.add('hidden');
    const name = $('s-name').value.trim(), tel = $('s-tel').value.trim(), mail = $('s-mail').value.trim();
    const ok = check({
      's-name': name.length < 3 || !/\s/.test(name) ? 'Indiquez votre nom et votre prénom.' : '',
      's-tel': !tel ? 'Le numéro de téléphone est obligatoire.' : !isTnPhone(tel) ? 'Numéro tunisien attendu : 8 chiffres, par ex. 93 539 510 ou +216 93 539 510.' : '',
      's-mail': mail && !isMail(mail) ? 'Cette adresse e-mail ne semble pas valide.' : ''
    });
    if (!ok) return;
    if (keyMissing()) { sMsg.textContent = `Le formulaire n'est pas encore configuré (clé Web3Forms manquante dans assets/js/forms.js). En attendant, appelez le ${PHONE}.`; sMsg.classList.remove('hidden'); return; }
    const formation = $('s-formation').value, telF = formatTel(tel);
    const data = {
      subject: `Nouvelle pré-inscription — ${formation}`, botcheck: $('s-bot').checked,
      'Formation': formation, 'Nom et prénom': name, 'Téléphone': telF,
      'E-mail': mail || 'Non renseigné', 'Niveau / profession': $('s-level').value.trim() || 'Non renseigné',
      'Message': $('s-msg').value.trim() || '—', 'Page': document.title
    };
    if (mail) data.email = mail; // pour répondre directement depuis votre boîte
    busy('sSubmit', true);
    try {
      await send(data);
      $('dName').textContent = name.split(' ')[0]; $('dFormation').textContent = formation; $('dTel').textContent = telF;
      sWrap.classList.add('hidden'); sDone.classList.remove('hidden'); sDone.querySelector('[data-close]').focus();
    } catch (error) {
      sMsg.textContent = `L'envoi n'a pas abouti. Vérifiez votre connexion et réessayez, ou appelez-nous au ${PHONE}.`; sMsg.classList.remove('hidden');
      console.error('[Zarzinova] Web3Forms :', error);
    } finally { busy('sSubmit', false, 'Envoyer ma pré-inscription'); }
  });

  /* =====================================================================
     2. FORMULAIRE DE CONTACT (page contact.html, <form id="contactForm">)
     ===================================================================== */
  const cForm = $('contactForm');
  if (cForm) {
    const cMsg = $('cMsg'), cDone = $('cDone');
    // Sujet pré-sélectionné depuis l'adresse : contact.html#partenariat ou #devis
    const subjects = { information: "Demande d'information", partenariat: 'Partenariat', devis: 'Devis entreprise' };
    const fromHash = () => { const s = subjects[location.hash.slice(1)]; if (s) $('c-subject').value = s; };
    fromHash(); addEventListener('hashchange', fromHash);
    clearOnInput(['c-name','c-mail','c-text']);

    cForm.addEventListener('submit', async e => {
      e.preventDefault(); cMsg.classList.add('hidden');
      const name = $('c-name').value.trim(), mail = $('c-mail').value.trim(), text = $('c-text').value.trim(), subject = $('c-subject').value;
      const ok = check({
        'c-name': name.length < 2 ? 'Indiquez votre nom.' : '',
        'c-mail': !mail ? "L'adresse e-mail est obligatoire pour vous répondre." : !isMail(mail) ? 'Cette adresse e-mail ne semble pas valide.' : '',
        'c-text': text.length < 10 ? 'Votre message doit contenir au moins 10 caractères.' : ''
      });
      if (!ok) return;
      if (keyMissing()) { cMsg.textContent = `Le formulaire n'est pas encore configuré (clé Web3Forms manquante dans assets/js/forms.js). En attendant, appelez le ${PHONE}.`; cMsg.classList.remove('hidden'); return; }
      busy('cSubmit', true);
      try {
        await send({ subject: `Contact site — ${subject}`, botcheck: $('c-bot').checked, email: mail, 'Nom': name, 'E-mail': mail, 'Sujet': subject, 'Message': text });
        $('cName').textContent = name.split(' ')[0];
        cForm.classList.add('hidden'); cDone.classList.remove('hidden'); cDone.focus();
      } catch (error) {
        cMsg.textContent = `L'envoi n'a pas abouti. Vérifiez votre connexion et réessayez, ou écrivez-nous sur WhatsApp au ${PHONE}.`; cMsg.classList.remove('hidden');
        console.error('[Zarzinova] Web3Forms :', error);
      } finally { busy('cSubmit', false, 'Envoyer le message'); }
    });
    $('cAgain').addEventListener('click', () => { cForm.reset(); fromHash(); cDone.classList.add('hidden'); cForm.classList.remove('hidden'); $('c-name').focus(); });
  }
}
