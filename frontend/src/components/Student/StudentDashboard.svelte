<script>
  import Navbar from '../Navbar.svelte';
  import Icon from '../Icon.svelte';
  import DailyChallengeCard from './DailyChallengeCard.svelte';
  import { user } from '../../stores/user.js';
  import {
    ACHIEVEMENTS,
    unlockedAchievements,
    studentStats,
    getRarityColor,
    getRarityLabel
  } from '../../lib/achievements.js';

  export let onStartReading = () => {};
  export let onOpenProfile = () => {};

  $: levelProgress = getLevelProgress($studentStats.points, $studentStats.level);
  $: nextAchievements = ACHIEVEMENTS
    .filter((a) => !$unlockedAchievements.includes(a.id))
    .slice(0, 3);

  function getLevelProgress(points, level) {
    if (level === 'En Inicio') {
      return { current: points, target: 300, percent: (points / 300) * 100 };
    }
    if (level === 'En Proceso') {
      return {
        current: points - 300,
        target: 500,
        percent: ((points - 300) / 500) * 100
      };
    }
    return { current: 100, target: 100, percent: 100 };
  }

  function getRarityStyle(rarity) {
    return getRarityColor(rarity);
  }
</script>

<div class="app-container">
  <Navbar />

  <div class="page-content">
    <!-- Hero -->
    <div class="hero">
      <button class="hero-profile-btn" onclick={onOpenProfile} aria-label="Mi perfil">
        <Icon name="user" size={20} />
      </button>

      <div class="hero-content">
        <span class="hero-tag">TU ESPACIO DE APRENDIZAJE</span>
        <h1>
          ¿Listo para leer,
          <span class="hero-name">{$user?.name?.split(' ')[0] || 'lector'}</span>?
        </h1>
        <p>Cada texto que completes te acerca a nuevos logros y te hace mejor lector.</p>

        <button class="btn-hero" onclick={onStartReading}>
          <Icon name="book-open" size={18} />
          <span>Comenzar a leer</span>
        </button>
      </div>

      <div class="hero-decoration">
        <div class="floating-icon icon-1">
          <Icon name="book" size={56} strokeWidth={1.2} />
        </div>
        <div class="floating-icon icon-2">
          <Icon name="trophy" size={56} strokeWidth={1.2} />
        </div>
        <div class="floating-icon icon-3">
          <Icon name="star" size={56} strokeWidth={1.2} />
        </div>
      </div>
    </div>

    <!-- Reto del día -->
    <DailyChallengeCard />

    <!-- Stats -->
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
          <div class="stat-value">{$unlockedAchievements.length}/{ACHIEVEMENTS.length}</div>
          <div class="stat-label">Logros</div>
        </div>
      </div>
    </div>

    <!-- Progreso de nivel -->
    <div class="card level-progress-card">
      <div class="level-progress-header">
        <div>
          <span class="level-progress-label">Nivel actual</span>
          <h3 class="level-progress-name">{$studentStats.level}</h3>
        </div>

        <div class="level-progress-info">
          <span class="level-progress-points">
            {levelProgress.current} / {levelProgress.target} pts
          </span>
        </div>
      </div>

      <div class="level-progress-bar">
        <div
          class="level-progress-fill"
          style="width: {Math.min(levelProgress.percent, 100)}%"
        ></div>
      </div>

      <p class="level-progress-hint">
        {#if $studentStats.level === 'En Inicio'}
          Necesitas {300 - $studentStats.points} puntos más para llegar a "En Proceso"
        {:else if $studentStats.level === 'En Proceso'}
          Necesitas {800 - $studentStats.points} puntos más para llegar a "Satisfactorio"
        {:else}
          ¡Felicidades! Has alcanzado el nivel máximo
        {/if}
      </p>
    </div>

    <div class="content-grid">
      <!-- Logros recientes -->
      <div class="card">
        <div class="card-header">
          <h3>
            <Icon name="trophy" size={18} />
            Logros recientes
          </h3>
          <span class="card-count">{$unlockedAchievements.length} desbloqueados</span>
        </div>

        <div class="achievements-grid">
          {#each ACHIEVEMENTS.slice(0, 6) as ach}
            {@const unlocked = $unlockedAchievements.includes(ach.id)}
            {@const style = getRarityStyle(ach.rarity)}

            <div
              class="achievement-item"
              class:locked={!unlocked}
              title={unlocked ? ach.description : '???'}
              style="
                --rarity-bg: {style.bg};
                --rarity-color: {style.color};
                --rarity-border: {style.border};
              "
            >
              <div class="achievement-icon">
                <Icon name={unlocked ? ach.icon : 'lock'} size={28} strokeWidth={1.8} />
              </div>

              <div class="achievement-name">
                {unlocked ? ach.name : 'Bloqueado'}
              </div>

              <div class="achievement-rarity" style="color: {style.color};">
                {getRarityLabel(ach.rarity)}
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Próximos logros -->
      <div class="card">
        <div class="card-header">
          <h3>
            <Icon name="target" size={18} />
            Próximos logros
          </h3>
        </div>

        {#if nextAchievements.length === 0}
          <p class="empty-text">¡Has desbloqueado todos los logros!</p>
        {:else}
          <div class="next-achievements">
            {#each nextAchievements as ach}
              {@const style = getRarityStyle(ach.rarity)}

              <div
                class="next-achievement"
                style="--rarity-color: {style.color}; --rarity-bg: {style.bg};"
              >
                <div class="next-icon">
                  <Icon name={ach.icon} size={22} strokeWidth={1.8} />
                </div>

                <div class="next-info">
                  <div class="next-name">{ach.name}</div>
                  <div class="next-desc">{ach.description}</div>
                </div>

                <div class="next-points">+{ach.points}</div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .hero {
    position: relative;
    background: linear-gradient(135deg, #176B87 0%, #2A9D8F 100%);
    border-radius: 16px;
    padding: 40px 48px;
    margin-bottom: 24px;
    color: white;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(23, 107, 135, 0.2);
  }

  .hero-profile-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    z-index: 3;
  }

  .hero-profile-btn:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: scale(1.05);
  }

  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 560px;
  }

  .hero-tag {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
    opacity: 0.85;
    display: block;
    margin-bottom: 12px;
  }

  .hero h1 {
    font-size: 34px;
    font-weight: 800;
    margin: 0 0 12px;
    line-height: 1.15;
    letter-spacing: -1px;
  }

  .hero-name {
    color: #F4C95D;
  }

  .hero p {
    font-size: 15px;
    line-height: 1.6;
    opacity: 0.9;
    margin: 0 0 24px;
  }

  .btn-hero {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: white;
    color: #176B87;
    padding: 14px 28px;
    font-size: 15px;
    border-radius: 10px;
    border: none;
    font-family: inherit;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .btn-hero:hover {
    background: #F4C95D;
    color: #5B4A19;
    transform: translateY(-2px);
  }

  .hero-decoration {
    position: absolute;
    right: 20px;
    top: 0;
    bottom: 0;
    width: 300px;
    pointer-events: none;
  }

  .floating-icon {
    position: absolute;
    opacity: 0.18;
    color: white;
    animation: float 4s ease-in-out infinite;
  }

  .icon-1 { top: 20%; right: 40%; animation-delay: 0s; }
  .icon-2 { top: 55%; right: 15%; animation-delay: 1.3s; }
  .icon-3 { top: 10%; right: 10%; animation-delay: 2.6s; }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(-5deg); }
    50% { transform: translateY(-15px) rotate(5deg); }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
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
    transition: background-color 0.3s ease;
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

  .card {
    background: var(--surface);
    border-radius: 12px;
    padding: 24px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
    transition: background-color 0.3s ease;
  }

  .level-progress-card {
    margin-bottom: 24px;
  }

  .level-progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .level-progress-label {
    font-size: 12px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
  }

  .level-progress-name {
    margin: 4px 0 0;
    font-size: 20px;
    font-weight: 750;
    color: var(--primary);
  }

  .level-progress-points {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-secondary);
  }

  .level-progress-bar {
    height: 12px;
    background: var(--border);
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .level-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #176B87, #2A9D8F);
    border-radius: 6px;
    transition: width 0.6s ease;
  }

  .level-progress-hint {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .card-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-count {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 600;
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .achievement-item {
    padding: 16px 12px;
    text-align: center;
    border-radius: 12px;
    border: 2px solid var(--rarity-border);
    background: var(--rarity-bg);
    transition: transform 0.2s ease, background-color 0.3s ease;
    cursor: pointer;
  }

  .achievement-item:hover {
    transform: translateY(-3px);
  }

  .achievement-item.locked {
    background: var(--background);
    border-color: var(--border);
    opacity: 0.7;
  }

  .achievement-icon {
    width: 52px;
    height: 52px;
    margin: 0 auto 10px;
    border-radius: 50%;
    background: var(--surface);
    color: var(--rarity-color);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    transition: background-color 0.3s ease;
  }

  .achievement-item.locked .achievement-icon {
    color: var(--text-muted);
  }

  .achievement-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
    line-height: 1.2;
  }

  .achievement-rarity {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .achievement-item.locked .achievement-rarity {
    color: var(--text-muted) !important;
  }

  .next-achievements {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .next-achievement {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--rarity-bg);
    border-radius: 10px;
    border-left: 3px solid var(--rarity-color);
    transition: background-color 0.3s ease;
  }

  .next-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--surface);
    color: var(--rarity-color);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    transition: background-color 0.3s ease;
  }

  .next-info {
    flex: 1;
    min-width: 0;
  }

  .next-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 2px;
  }

  .next-desc {
    font-size: 11px;
    color: var(--text-secondary);
    line-height: 1.4;
  }

  .next-points {
    font-size: 12px;
    font-weight: 800;
    color: var(--rarity-color);
    flex-shrink: 0;
  }

  .empty-text {
    text-align: center;
    padding: 32px;
    color: var(--text-muted);
    font-size: 13px;
  }

  /* ============================================
     OVERRIDES PARA MODO OSCURO
     ============================================ */
  :global([data-theme="dark"]) .stat-icon-flame {
    background: #3D2E15;
    color: #FBBF24;
  }

  :global([data-theme="dark"]) .stat-icon-accent {
    background: #3D3420;
    color: #F4C95D;
  }

  :global([data-theme="dark"]) .achievement-item:not(.locked) {
    background: var(--surface);
    border-color: var(--rarity-color);
  }

  :global([data-theme="dark"]) .achievement-item:not(.locked) .achievement-icon {
    background: var(--rarity-color);
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  :global([data-theme="dark"]) .next-achievement {
    background: var(--surface);
    border-left-color: var(--rarity-color);
  }

  :global([data-theme="dark"]) .next-icon {
    background: var(--rarity-color);
    color: white;
  }

  :global([data-theme="dark"]) .next-achievement .next-points {
    color: var(--rarity-color);
  }

  /* ============================================
     RESPONSIVE
     ============================================ */
  @media (max-width: 900px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .content-grid { grid-template-columns: 1fr; }
    .achievements-grid { grid-template-columns: repeat(2, 1fr); }
    .hero { padding: 28px; }
    .hero h1 { font-size: 26px; }
    .hero-decoration { display: none; }
  }
</style>