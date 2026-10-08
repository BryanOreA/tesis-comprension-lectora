<script>
  import { user } from '../stores/user.js';
  import { theme } from '../stores/theme.js';
  import Icon from './Icon.svelte';

  function logout() {
    user.set(null);
  }

  function toggleTheme() {
    theme.toggle();
  }

  $: roleLabel = {
    estudiante: 'Estudiante',
    docente: 'Docente',
    padre: 'Padre de Familia',
    administrador: 'Administrador'
  }[$user?.role] || 'Usuario';

  $: userIcon = {
    estudiante: 'user-graduate',
    docente: 'user-teacher',
    padre: 'user',
    administrador: 'user'
  }[$user?.role] || 'user';
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

  <div class="navbar-actions">
    <button class="btn-theme" onclick={toggleTheme} aria-label="Cambiar tema">
      {#if $theme === 'dark'}
        <Icon name="sun" size={18} />
      {:else}
        <Icon name="moon" size={18} />
      {/if}
    </button>

    <div class="user-info">
      <div class="avatar">
        <Icon name={userIcon} size={22} strokeWidth={1.8} />
      </div>
      <div class="user-details">
        <div class="user-name">{$user?.name || 'Usuario'}</div>
        <div class="user-role">{roleLabel}</div>
      </div>
    </div>

    <button class="btn-logout" onclick={logout}>Cerrar sesión</button>
  </div>
</header>

<style>
  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .brand-logo {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--primary-light);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .brand-logo svg {
    width: 24px;
    height: 24px;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .brand-text strong {
    font-size: 15px;
    color: var(--text);
    font-weight: 700;
  }

  .brand-text span {
    font-size: 12px;
    color: var(--text-secondary);
  }

  .navbar-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .btn-theme {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .btn-theme:hover {
    border-color: var(--primary);
    color: var(--primary);
    transform: rotate(15deg);
  }

  .avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(23, 107, 135, 0.25);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .user-name {
    font-size: 14px;
    font-weight: 650;
    color: var(--text);
  }

  .user-role {
    font-size: 12px;
    color: var(--text-secondary);
  }

  .btn-logout {
    padding: 9px 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text-secondary);
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-logout:hover {
    background: var(--error-bg);
    color: var(--error);
    border-color: var(--error);
  }

  @media (max-width: 768px) {
    .user-details {
      display: none;
    }
    .brand-text {
      display: none;
    }
    .navbar-actions {
      gap: 8px;
    }
  }
</style>