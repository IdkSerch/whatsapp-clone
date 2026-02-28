// ============================================================
// storage.js — Manejo de datos en localStorage
// Desarrollado por: Sergio
// ============================================================

const Storage = {
  getUsers() {
    return JSON.parse(localStorage.getItem('chatapp_users') || '[]');
  },
  saveUsers(users) {
    localStorage.setItem('chatapp_users', JSON.stringify(users));
  },
  getUser(username) {
    return this.getUsers().find(u => u.username === username) || null;
  },
  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },
  updateUser(updated) {
    const users = this.getUsers().map(u => u.username === updated.username ? updated : u);
    this.saveUsers(users);
  },
  setSession(username) {
    localStorage.setItem('chatapp_session', username);
  },
  getSession() {
    return localStorage.getItem('chatapp_session');
  },
  clearSession() {
    localStorage.removeItem('chatapp_session');
  },
  getMessages(roomId) {
    return JSON.parse(localStorage.getItem(`chatapp_msgs_${roomId}`) || '[]');
  },
  saveMessage(roomId, msg) {
    const msgs = this.getMessages(roomId);
    msgs.push(msg);
    localStorage.setItem(`chatapp_msgs_${roomId}`, JSON.stringify(msgs));
  },
  getRoomId(userA, userB) {
    return [userA, userB].sort().join('__');
  }
};