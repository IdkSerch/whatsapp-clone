*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --green: #00C853;
  --teal: #00897B;
  --dark: #0a0f0d;
  --card: #111a14;
  --border: rgba(0,200,83,0.18);
  --text: #e8f5e9;
  --muted: #6b8f71;
  --error: #ff5252;
}

body {
  font-family: 'Sora', sans-serif;
  background: var(--dark);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.bg-mesh {
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(ellipse 80% 60% at 20% 30%, rgba(0,200,83,0.07) 0%, transparent 70%),
    radial-gradient(ellipse 60% 80% at 80% 70%, rgba(0,137,123,0.06) 0%, transparent 70%);
  pointer-events: none;
}

.auth-wrapper {
  width: 100%;
  max-width: 420px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  animation: fadeUp 0.6s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.brand { text-align: center; }
.brand-icon { width: 64px; height: 64px; margin: 0 auto 12px; }
.brand-icon svg { width: 100%; height: 100%; drop-shadow(0 4px 20px rgba(0,200,83,0.4)); }
.brand-name { font-size: 2rem; font-weight: 700; letter-spacing: -0.5px; background: linear-gradient(135deg, var(--green), var(--teal)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.brand-tagline { color: var(--muted); font-size: 0.85rem; margin-top: 4px; font-weight: 300; }

.auth-card {
  width: 100%;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6);
}

.tabs {
  display: flex;
  position: relative;
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 28px;
}

.tab {
  flex: 1;
  padding: 9px;
  background: none;
  border: none;
  color: var(--muted);
  font-family: 'Sora', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: color 0.3s;
  position: relative;
  z-index: 1;
}
.tab.active { color: var(--text); }

.tab-indicator {
  position: absolute;
  top: 4px; bottom: 4px; left: 4px;
  width: calc(50% - 4px);
  background: linear-gradient(135deg, var(--green), var(--teal));
  border-radius: 8px;
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
}
.tab-indicator.right { transform: translateX(calc(100% + 0px)); }

.form-section { display: none; }
.form-section.active { display: block; animation: fadeUp 0.3s ease both; }

.avatar-upload {
  width: 90px; height: 90px;
  border-radius: 50%;
  border: 2px dashed var(--border);
  cursor: pointer;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: border-color 0.3s;
  position: relative;
}
.avatar-upload:hover { border-color: var(--green); }
.avatar-upload img { width: 100%; height: 100%; object-fit: cover; display: none; }
.avatar-placeholder { display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--muted); font-size: 0.7rem; text-align: center; }
.avatar-placeholder svg { width: 28px; height: 28px; }

.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input {
  width: 100%;
  padding: 12px 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--text);
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.form-group input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(0,200,83,0.1); }
.form-group input::placeholder { color: rgba(107,143,113,0.6); }

.form-error { color: var(--error); font-size: 0.8rem; margin-bottom: 12px; min-height: 18px; }

.btn-primary {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, var(--green), var(--teal));
  border: none;
  border-radius: 10px;
  color: white;
  font-family: 'Sora', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: opacity 0.2s, transform 0.2s;
}
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }