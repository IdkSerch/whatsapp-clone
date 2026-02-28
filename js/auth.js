// ============================================================
// auth.js — Lógica de autenticación (Login / Registro)
// Desarrollado por: Sergio
// ============================================================

// Si ya hay sesión activa, redirigir al chat
if (Storage.getSession()) {
  window.location.href = 'chat.html';
}

let avatarBase64 = '';

function showTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('loginForm').classList.toggle('active', isLogin);
  document.getElementById('registerForm').classList.toggle('active', !isLogin);
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', isLogin ? i === 0 : i === 1));
  document.getElementById('tabIndicator').classList.toggle('right', !isLogin);
  clearErrors();
}

function clearErrors() {
  document.getElementById('loginError').textContent = '';
  document.getElementById('registerError').textContent = '';
}

function previewAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    avatarBase64 = e.target.result;
    const img = document.getElementById('avatarPreview');
    img.src = avatarBase64;
    img.style.display = 'block';
    document.getElementById('avatarPlaceholder').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');

  if (!username || !password) { errEl.textContent = 'Completa todos los campos.'; return; }

  const user = Storage.getUser(username);
  if (!user || user.password !== password) {
    errEl.textContent = 'Usuario o contraseña incorrectos.';
    return;
  }

  Storage.setSession(username);
  window.location.href = 'chat.html';
}

function register() {
  const name     = document.getElementById('regName').value.trim();
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  const errEl    = document.getElementById('registerError');

  if (!name || !username || !password) { errEl.textContent = 'Completa todos los campos.'; return; }
  if (password.length < 6)             { errEl.textContent = 'La contraseña debe tener al menos 6 caracteres.'; return; }
  if (Storage.getUser(username))       { errEl.textContent = 'Ese nombre de usuario ya está en uso.'; return; }

  const user = {
    name,
    username,
    password,
    avatar: avatarBase64 || '',
    contacts: [],
    createdAt: Date.now()
  };

  Storage.addUser(user);
  Storage.setSession(username);
  window.location.href = 'chat.html';
}

// Enter key support
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  if (document.getElementById('loginForm').classList.contains('active')) login();
  else register();
});