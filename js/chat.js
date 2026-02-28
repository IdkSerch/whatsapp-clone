// ============================================================
// chat.js — Lógica del chat (contactos, mensajes, UI)
// Desarrollado por: Gerardo
// ============================================================

// Verificar sesión
const sessionUser = Storage.getSession();
if (!sessionUser) window.location.href = 'index.html';

let currentUser = Storage.getUser(sessionUser);
let activeContact = null;
let pollInterval = null;

// ─── INIT ────────────────────────────────────────────────────
function init() {
  renderMyProfile();
  renderContacts();
}

// ─── PERFIL PROPIO ───────────────────────────────────────────
function renderMyProfile() {
  currentUser = Storage.getUser(sessionUser);
  const avatarImg = document.getElementById('myAvatar');
  const avatarFb  = document.getElementById('myAvatarFallback');
  const nameEl    = document.getElementById('myName');
  const userEl    = document.getElementById('myUsername');

  nameEl.textContent = currentUser.name;
  userEl.textContent = '@' + currentUser.username;

  if (currentUser.avatar) {
    avatarImg.src = currentUser.avatar;
    avatarImg.style.display = 'block';
    avatarFb.style.display = 'none';
  } else {
    avatarImg.style.display = 'none';
    avatarFb.textContent = currentUser.name[0].toUpperCase();
    avatarFb.style.display = 'flex';
  }
}

// ─── CONTACTOS ───────────────────────────────────────────────
function renderContacts() {
  currentUser = Storage.getUser(sessionUser);
  const search = document.getElementById('searchContacts').value.toLowerCase();
  const list   = document.getElementById('contactsList');
  const contacts = currentUser.contacts || [];

  const filtered = contacts.filter(c =>
    c.toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-contacts">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
        <p>${contacts.length === 0 ? 'Sin contactos aún.<br/>Agrega a alguien para chatear.' : 'Sin resultados.'}</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(username => {
    const contactUser = Storage.getUser(username);
    if (!contactUser) return '';
    const roomId = Storage.getRoomId(sessionUser, username);
    const msgs   = Storage.getMessages(roomId);
    const last   = msgs[msgs.length - 1];
    const preview = last ? (last.from === sessionUser ? 'Tú: ' + last.text : last.text) : 'Sin mensajes aún';
    const time    = last ? formatTime(last.ts) : '';
    const initial = contactUser.name[0].toUpperCase();

    const avatarHtml = contactUser.avatar
      ? `<img src="${contactUser.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt=""/>`
      : `<div class="avatar-fallback">${initial}</div>`;

    return `
      <div class="contact-item ${activeContact === username ? 'active' : ''}" onclick="openChat('${username}')">
        <div class="avatar-wrap">${avatarHtml}</div>
        <div class="contact-info">
          <div class="contact-name">${contactUser.name}</div>
          <div class="contact-preview">${preview}</div>
        </div>
        <div class="contact-meta">
          <span class="contact-time">${time}</span>
        </div>
      </div>`;
  }).join('');
}

// ─── ABRIR CHAT ──────────────────────────────────────────────
function openChat(username) {
  activeContact = username;
  const contact = Storage.getUser(username);

  // Header
  document.getElementById('chatHeader').classList.remove('hidden');
  document.getElementById('messagesWrap').classList.remove('hidden');
  document.getElementById('chatInputArea').classList.remove('hidden');
  document.getElementById('chatEmpty').classList.add('hidden');

  // Avatar del contacto
  const chatAvatarImg = document.getElementById('chatAvatar');
  const chatAvatarFb  = document.getElementById('chatAvatarFallback');
  if (contact.avatar) {
    chatAvatarImg.src = contact.avatar;
    chatAvatarImg.style.display = 'block';
    chatAvatarFb.style.display = 'none';
  } else {
    chatAvatarImg.style.display = 'none';
    chatAvatarFb.textContent = contact.name[0].toUpperCase();
    chatAvatarFb.style.display = 'flex';
  }
  document.getElementById('chatContactName').textContent = contact.name;

  renderContacts();
  renderMessages();

  // Polling cada 1.5s
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(() => {
    renderMessages(false);
    renderContacts();
  }, 1500);

  // Mobile
  document.getElementById('sidebar').classList.add('hidden-mobile');
  document.getElementById('chatArea').classList.add('visible-mobile');
}

function closeChat() {
  activeContact = null;
  if (pollInterval) clearInterval(pollInterval);
  document.getElementById('sidebar').classList.remove('hidden-mobile');
  document.getElementById('chatArea').classList.remove('visible-mobile');
}

// ─── MENSAJES ────────────────────────────────────────────────
function renderMessages(scroll = true) {
  if (!activeContact) return;
  const roomId = Storage.getRoomId(sessionUser, activeContact);
  const msgs   = Storage.getMessages(roomId);
  const container = document.getElementById('messages');

  let lastDate = '';
  container.innerHTML = msgs.map(msg => {
    const date = new Date(msg.ts).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' });
    let divider = '';
    if (date !== lastDate) {
      lastDate = date;
      divider = `<div class="date-divider">${date}</div>`;
    }
    const dir = msg.from === sessionUser ? 'out' : 'in';
    return `${divider}
      <div class="msg ${dir}">
        ${escapeHtml(msg.text)}
        <div class="msg-time">${formatTime(msg.ts)}</div>
      </div>`;
  }).join('');

  if (scroll) {
    const wrap = document.getElementById('messagesWrap');
    wrap.scrollTop = wrap.scrollHeight;
  }
}

function sendMessage() {
  const input = document.getElementById('msgInput');
  const text  = input.value.trim();
  if (!text || !activeContact) return;

  const roomId = Storage.getRoomId(sessionUser, activeContact);
  Storage.saveMessage(roomId, { from: sessionUser, text, ts: Date.now() });

  input.value = '';
  input.style.height = 'auto';
  renderMessages();
  renderContacts();
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// ─── AGREGAR CONTACTO ────────────────────────────────────────
function openAddContact() {
  document.getElementById('addContactInput').value = '';
  document.getElementById('addContactError').textContent = '';
  document.getElementById('addContactModal').classList.remove('hidden');
  setTimeout(() => document.getElementById('addContactInput').focus(), 100);
}

function addContact() {
  const username = document.getElementById('addContactInput').value.trim();
  const errEl    = document.getElementById('addContactError');
  currentUser    = Storage.getUser(sessionUser);

  if (!username) { errEl.textContent = 'Ingresa un nombre de usuario.'; return; }
  if (username === sessionUser) { errEl.textContent = 'No puedes agregarte a ti mismo.'; return; }

  const target = Storage.getUser(username);
  if (!target) { errEl.textContent = 'Usuario no encontrado.'; return; }

  if ((currentUser.contacts || []).includes(username)) {
    errEl.textContent = 'Ya tienes este contacto agregado.'; return;
  }

  currentUser.contacts = currentUser.contacts || [];
  currentUser.contacts.push(username);
  Storage.updateUser(currentUser);

  document.getElementById('addContactModal').classList.add('hidden');
  renderContacts();
}

function closeModal(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.add('hidden');
  }
}

// ─── LOGOUT ──────────────────────────────────────────────────
function logout() {
  Storage.clearSession();
  window.location.href = 'index.html';
}

// ─── HELPERS ─────────────────────────────────────────────────
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br/>');
}

// ─── ENTER en modal ──────────────────────────────────────────
document.getElementById('addContactInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addContact();
});

init();