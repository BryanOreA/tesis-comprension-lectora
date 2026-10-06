<script>
  import { user } from '../stores/user.js';

  function logout() {
    user.set(null);
  }

  $: initials = $user?.name
    ? $user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '??';

  $: roleLabel = {
    estudiante: 'Estudiante',
    docente: 'Docente',
    padre: 'Padre de Familia',
    administrador: 'Administrador'
  }[$user?.role] || 'Usuario';
</script>

<header class="app-header">
  <div class="brand">
    <div class="brand-logo">
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 9.5C8 8.67 8.67 8 9.5 8H21c3.31 0 6 2.69 6 6v25c0-3.31-2.69-6-6-6H9.5C8.67 33 8 32.33 8 31.5v-22Z" />
        <path d="M40 9.5C40 8.67 39.33 8 38.5 8H27c-3.31 0-6 2.69-6 6v25c0-3.31 2.69-6 6-6h11.5c.83 0 1.5-.67 1.5-1.5v-22Z" />
      </svg>
    </div>
    <div class="brand-text">
      <strong>Comprensión Lectora</strong>
      <span>{roleLabel}</span>
    </div>
  </div>

  <div class="user-info">
    <div class="avatar">{initials}</div>
    <div class="user-details">
      <div class="user-name">{$user?.name || 'Usuario'}</div>
      <div class="user-role">{roleLabel}</div>
    </div>
    <button class="btn-logout" onclick={logout}>Cerrar sesión</button>
  </div>
</header>

<style>
  .brand { display: flex; align-items: center; gap: 14px; }
  .brand-logo {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--primary-light); color: var(--primary);
    display: flex; align-items: center; justify-content: center;
  }
  .brand-logo svg { width: 24px; height: 24px; }
  .brand-text { display: flex; flex-direction: column; line-height: 1.2; }
  .brand-text strong { font-size: 15px; color: var(--text); font-weight: 700; }
  .brand-text span { font-size: 12px; color: var(--text-secondary); }
  .user-details { display: flex; flex-direction: column; line-height: 1.2; }
</style>