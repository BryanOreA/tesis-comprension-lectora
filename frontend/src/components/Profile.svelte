<script>
  import Navbar from './Navbar.svelte';
  import Icon from './Icon.svelte';
  import { user } from '../stores/user.js';
  import { studentStats, unlockedAchievements, ACHIEVEMENTS, getRarityColor, getRarityLabel } from '../lib/achievements.js';
  import { dailyChallenges } from '../lib/challenges.js';

  export let onBack = () => {};

  const AVATARS = [
    { id: 'user-graduate', label: 'Estudiante' },
    { id: 'user-teacher', label: 'Docente' },
    { id: 'user', label: 'Persona' },
    { id: 'star', label: 'Estrella' },
    { id: 'trophy', label: 'Trofeo' },
    { id: 'crown', label: 'Corona' },
    { id: 'gem', label: 'Gema' },
    { id: 'crown-2', label: 'Rey' }
  ];

  let selectedAvatar = 'user-graduate';

  function selectAvatar(avatarId) {
    selectedAvatar = avatarId;
    localStorage.setItem('userAvatar', avatarId);
  }

  function resetProgress() {
    if (confirm('¿Estás seguro? Se borrarán todos tus logros y estadísticas.')) {
      studentStats.reset();
      unlockedAchievements.reset();
      dailyChallenges.reset();
      location.reload();
    }
  }

  import { onMount } from 'svelte';
  onMount(() => {
    const saved = localStorage.getItem('userAvatar');
    if (saved) selectedAvatar = saved;
  });

  $: userData = $user || { name: 'Usuario', role: 'estudiante', username: 'usuario' };
  $: roleLabel = {
    estudiante: 'Estudiante',
    docente: 'Docente',
    padre: 'Padre de Familia',
    administrador: 'Administrador'
  }[userData.role] || 'Usuario';

  $: totalAchievements = ACHIEVEMENTS.length;
  $: unlockedCount = $unlockedAchievements.length;
  $: achievementPercent = Math.round((unlockedCount / totalAchievements) * 100);

  function getRarityStyle(rarity) {
    return getRarityColor(rarity);
  }
</script>

<div class="app-container">
  <Navbar />

  <div class="page-content">
    <button class="btn-back" onclick={onBack}>← Volver</button>

    <div class="page-header">
      <div>
        <span class="page-tag">MI PERFIL</span>
        <h1 class="page-title">Tu cuenta</h1>
        <p class="page-subtitle">Personaliza tu experiencia y revisa tus estadísticas</p>
      </div>
    </div>

    <!-- Header del perfil -->
    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-avatar-large">
          <Icon name={selectedAvatar} size={56} strokeWidth={1.6} />
        </div>
        <div class="profile-info">
          <h2>{userData.name}</h2>
          <span class="profile-role">{roleLabel}</span>
          {#if userData.username}
            <span class="profile-username">@{userData.username}</span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="section">
      <h3 class="section-title">
        <Icon name="activity" size={18} />
        Mis estadísticas
      </h3>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-primary">
            <Icon name="books" size={22} />
          </div>
          <div>
            <div class="stat-value">{$studentStats.textsRead}</div>
            <div class="stat-label">Textos leídos</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-accent">
            <Icon name="star" size={22} />
          </div>
          <div>
            <div class="stat-value">{$studentStats.points}</div>
            <div class="stat-label">Puntos totales</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-flame">
            <Icon name="flame" size={22} />
          </div>
          <div>
            <div class="stat-value">{$studentStats.currentStreak}</div>
            <div class="stat-label">Días en racha</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-success">
            <Icon name="trophy" size={22} />
          </div>
          <div>
            <div class="stat-value">{unlockedCount}/{totalAchievements}</div>
            <div class="stat-label">Logros</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selección de avatar -->
    <div class="section">
      <h3 class="section-title">
        <Icon name="sparkles" size={18} />
        Elige tu avatar
      </h3>

      <div class="avatar-grid">
        {#each AVATARS as avatar}
          <button
            class="avatar-option"
            class:selected={selectedAvatar === avatar.id}
            onclick={() => selectAvatar(avatar.id)}
            title={avatar.label}
          >
            <Icon name={avatar.id === 'crown-2' ? 'crown' : avatar.id} size={26} strokeWidth={1.7} />
          </button>
        {/each}
      </div>
    </div>

    <!-- Progreso de logros -->
    <div class="section">
      <h3 class="section-title">
        <Icon name="trophy" size={18} />
        Progreso de logros
      </h3>

      <div class="achievement-progress">
        <div class="progress-info">
          <span>Has desbloqueado</span>
          <strong>{achievementPercent}%</strong>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {achievementPercent}%"></div>
        </div>
      </div>

      <div class="achievements-mini-grid">
        {#each ACHIEVEMENTS as ach}
          {@const unlocked = $unlockedAchievements.includes(ach.id)}
          {@const style = getRarityStyle(ach.rarity)}
          <div
            class="achievement-mini"
            class:locked={!unlocked}
            title={unlocked ? `${ach.name}: ${ach.description}` : '???'}
            style="--rarity-bg: {style.bg}; --rarity-color: {style.color}; --rarity-border: {style.border};"
          >
            <Icon name={unlocked ? ach.icon : 'lock'} size={20} strokeWidth={1.8} />
          </div>
        {/each}
      </div>
    </div>

    <!-- Zona de peligro -->
    <div class="section danger-section">
      <h3 class="section-title danger-title">
        <Icon name="alert-triangle" size={18} />
        Zona de peligro
      </h3>
      <p class="danger-text">Esta acción reiniciará todas tus estadísticas, logros y progreso diario.</p>
      <button class="btn-danger" onclick={resetProgress}>
        <Icon name="x" size={16} />
        Reiniciar todo mi progreso
      </button>
    </div>
  </div>
</div>

<style>
  .btn-back {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    padding: 6px 0;
    margin-bottom: 16px;
    transition: color 0.2s;
  }

  .btn-back:hover {
    color: var(--primary);
  }

  .page-header {
    margin-bottom: 28px;
  }

  .page-tag {
    display: block;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
    color: var(--primary);
    margin-bottom: 8px;
  }

  /* Profile card */
  .profile-card {
    background: linear-gradient(135deg, #176B87 0%, #2A9D8F 100%);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 24px;
    color: white;
    box-shadow: 0 10px 30px rgba(23, 107, 135, 0.25);
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .profile-avatar-large {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 3px solid rgba(255, 255, 255, 0.3);
  }

  .profile-info h2 {
    margin: 0 0 6px;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .profile-role {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    margin-right: 8px;
  }

  .profile-username {
    font-size: 13px;
    opacity: 0.85;
  }

  /* Sections */
  .section {
    margin-bottom: 32px;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px;
    font-size: 14px;
    font-weight: 800;
    color: var(--text);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  /* Stats */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: var(--surface);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-icon-primary { background: var(--primary-light); color: var(--primary); }
  .stat-icon-accent { background: var(--accent-light); color: #B8860B; }
  .stat-icon-flame { background: #FFF3E0; color: #E65100; }
  .stat-icon-success { background: var(--success-bg); color: var(--success); }

  .stat-value {
    font-size: 22px;
    font-weight: 750;
    color: var(--text);
    line-height: 1.1;
  }

  .stat-label {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 2px;
  }

  /* Avatars */
  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 12px;
  }

  .avatar-option {
    aspect-ratio: 1;
    border-radius: 14px;
    border: 2px solid var(--border);
    background: var(--surface);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    padding: 0;
  }

  .avatar-option:hover {
    border-color: var(--primary);
    color: var(--primary);
    transform: translateY(-2px);
  }

  .avatar-option.selected {
    border-color: var(--primary);
    background: var(--primary-light);
    color: var(--primary);
    box-shadow: 0 4px 12px rgba(23, 107, 135, 0.2);
  }

  /* Achievement progress */
  .achievement-progress {
    background: var(--surface);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid var(--border);
    margin-bottom: 16px;
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .progress-info strong {
    font-size: 18px;
    font-weight: 800;
    color: var(--primary);
  }

  .progress-bar {
    height: 10px;
    background: var(--border);
    border-radius: 5px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    border-radius: 5px;
    transition: width 0.6s ease;
  }

  .achievements-mini-grid {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 10px;
  }

  .achievement-mini {
    aspect-ratio: 1;
    border-radius: 10px;
    background: var(--rarity-bg);
    border: 2px solid var(--rarity-border);
    color: var(--rarity-color);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .achievement-mini:hover {
    transform: translateY(-2px);
  }

  .achievement-mini.locked {
    background: var(--background);
    border-color: var(--border);
    color: var(--text-muted);
    opacity: 0.6;
  }

  /* Danger zone */
  .danger-section {
    background: var(--error-bg);
    border: 1px solid var(--error);
    border-radius: 12px;
    padding: 24px;
  }

  .danger-title {
    color: var(--error);
  }

  .danger-text {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0 0 16px;
    line-height: 1.5;
  }

  .btn-danger {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--error);
    color: white;
    border: none;
    border-radius: 10px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-danger:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(217, 83, 79, 0.3);
  }

  @media (max-width: 900px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .avatar-grid { grid-template-columns: repeat(4, 1fr); }
    .achievements-mini-grid { grid-template-columns: repeat(5, 1fr); }
    .profile-header { flex-direction: column; text-align: center; }
  }
</style>