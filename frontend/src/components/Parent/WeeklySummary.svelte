<script>
  import { onMount } from 'svelte';
  import Navbar from '../Navbar.svelte';
  import Icon from '../Icon.svelte';
  import ReadingHistoryModal from './ReadingHistoryModal.svelte';
  import ReadingRecommendationsModal from './ReadingRecommendationsModal.svelte';
  import { getParentSummary, downloadStudentReport } from '../../lib/api.js';

  let summary = null;
  let loading = true;
  let error = '';
  let showHistory = false;
  let showRecommendations = false;

  onMount(async () => {
    await loadSummary();
  });

  async function loadSummary() {
    loading = true;
    error = '';
    try {
      summary = await getParentSummary();
    } catch (e) {
      error = 'No se pudo cargar el resumen. ¿Está el backend activo?';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  function openHistory() {
    showHistory = true;
  }

  function closeHistory() {
    showHistory = false;
  }

  function openRecommendations() {
    showRecommendations = true;
  }

  function closeRecommendations() {
    showRecommendations = false;
  }

  function handleDownloadReport() {
    if (summary?.studentId) {
      downloadStudentReport(summary.studentId, summary.studentName);
    } else {
      alert('No se pudo identificar al estudiante');
    }
  }

  function getLevelColor(level) {
    if (level === 'En Inicio') return { bg: '#FFF4F3', color: '#D9534F', border: '#F2C8C6' };
    if (level === 'En Proceso') return { bg: '#FFF3E0', color: '#E65100', border: '#FFD8A0' };
    return { bg: '#E8F5E9', color: '#27AE60', border: '#A5D6A7' };
  }

  $: maxScore = summary?.weeklyProgress?.length > 0
    ? Math.max(100, ...summary.weeklyProgress.map(d => d.score))
    : 100;

  $: hasData = summary?.weeklyProgress?.some(d => d.sessions > 0);

  $: levelStyle = summary
    ? getLevelColor(summary.currentLevel)
    : { bg: '#F7FAFC', color: '#667985', border: '#DCE6EA' };

  $: studentFirstName = summary?.studentName?.split(' ')[0] || 'tu hijo';
</script>

<div class="app-container">
  <Navbar />

  <div class="page-content">
    {#if loading}
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Cargando resumen semanal...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <Icon name="alert-triangle" size={32} color="#D9534F" />
        <p>{error}</p>
        <button class="btn-primary" onclick={loadSummary}>Reintentar</button>
      </div>
    {:else if summary}
      <!-- Header -->
      <div class="page-header">
        <div>
          <span class="page-tag">RESUMEN SEMANAL</span>
          <h1 class="page-title">Progreso de {summary.studentName}</h1>
          <p class="page-subtitle">
            Últimos 7 días · {summary.weeklySessions}
            {summary.weeklySessions === 1 ? 'sesión' : 'sesiones'} completadas
          </p>
        </div>

        {#if summary.currentStreak > 0}
          <div class="streak-badge">
            <Icon name="flame" size={18} />
            <span>
              {summary.currentStreak}
              {summary.currentStreak === 1 ? 'día' : 'días'} en racha
            </span>
          </div>
        {/if}
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-primary">
            <Icon name="books" size={22} />
          </div>
          <div>
            <div class="stat-value">{summary.textsRead}</div>
            <div class="stat-label">Textos leídos en total</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-accent">
            <Icon name="target" size={22} />
          </div>
          <div>
            <div class="stat-value">{summary.averageScore}%</div>
            <div class="stat-label">Promedio de aciertos</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-level">
            <Icon name="award" size={22} />
          </div>
          <div>
            <div
              class="stat-value-badge"
              style="background: {levelStyle.bg}; color: {levelStyle.color}; border-color: {levelStyle.border};"
            >
              {summary.currentLevel}
            </div>
            <div class="stat-label">Nivel actual</div>
          </div>
        </div>
      </div>

      <!-- Gráfico semanal -->
      <div class="card chart-card">
        <div class="card-header">
          <div>
            <h3>
              <Icon name="activity" size={18} />
              Progreso de la semana
            </h3>
            <p class="card-subtitle">Puntaje promedio por día</p>
          </div>
          {#if hasData}
            <div class="chart-legend">
              <span class="legend-dot"></span>
              <span>Puntaje</span>
            </div>
          {/if}
        </div>

        {#if !hasData}
          <div class="empty-chart">
            <Icon name="book-marked" size={48} color="#96A5AE" />
            <p>Sin actividad esta semana</p>
            <span>Motívalo a leer para ver su progreso aquí</span>
          </div>
        {:else}
          <div class="chart">
            {#each summary.weeklyProgress as day}
              <div class="chart-col">
                <div class="chart-bar-wrapper">
                  {#if day.score > 0}
                    <span class="chart-value">{day.score}%</span>
                  {/if}
                  <div
                    class="chart-bar"
                    class:empty={day.score === 0}
                    style="height: {(day.score / maxScore) * 100}%"
                  ></div>
                </div>
                <div class="chart-day-group">
                  <span class="chart-day">{day.label}</span>
                  {#if day.sessions > 0}
                    <span class="chart-sessions">{day.sessions} lectura{day.sessions > 1 ? 's' : ''}</span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <div class="content-grid">
        <!-- Recomendaciones -->
        <div class="card">
          <div class="card-header">
            <h3>
              <Icon name="lightbulb" size={18} />
              Recomendaciones personalizadas
            </h3>
          </div>

          <ul class="recommendations-list">
            {#each summary.recommendations as rec, i}
              <li>
                <span class="rec-number">{i + 1}</span>
                <span>{rec}</span>
              </li>
            {/each}
          </ul>
        </div>

        <!-- Acciones rápidas -->
        <div class="card">
          <div class="card-header">
            <h3>
              <Icon name="zap" size={18} />
              Acciones rápidas
            </h3>
          </div>

          <div class="actions-list">
            <button class="action-item" onclick={openHistory}>
              <div class="action-icon" style="background: #EAF4F6; color: #176B87;">
                <Icon name="book-marked" size={20} />
              </div>
              <div class="action-text">
                <span class="action-title">Ver historial completo</span>
                <span class="action-desc">Todos los textos leídos</span>
              </div>
              <Icon name="chevron-right" size={18} color="#96A5AE" />
            </button>

            <button class="action-item" onclick={openRecommendations}>
              <div class="action-icon" style="background: #E8F5E9; color: #27AE60;">
                <Icon name="lightbulb" size={20} />
              </div>
              <div class="action-text">
                <span class="action-title">Recomendaciones de lectura</span>
                <span class="action-desc">Textos sugeridos según su nivel</span>
              </div>
              <Icon name="chevron-right" size={18} color="#96A5AE" />
            </button>

            <button class="action-item" onclick={handleDownloadReport}>
              <div class="action-icon" style="background: #FEF6E0; color: #B8860B;">
                <Icon name="download" size={20} />
              </div>
              <div class="action-text">
                <span class="action-title">Descargar reporte</span>
                <span class="action-desc">En formato CSV</span>
              </div>
              <Icon name="chevron-right" size={18} color="#96A5AE" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mensaje motivacional -->
      <div class="motivational-card">
        <div class="motivational-icon">
          <Icon name="sparkles" size={32} />
        </div>
        <div>
          <h4>Consejo del día</h4>
          <p>
            La constancia es la clave del éxito. Dedica unos minutos cada día para leer
            con {studentFirstName} y verás mejoras significativas en su comprensión lectora.
          </p>
        </div>
      </div>
    {/if}
  </div>
</div>

{#if showHistory && summary}
  <ReadingHistoryModal
    studentId={summary.studentId || 1}
    studentName={summary.studentName}
    onClose={closeHistory}
  />
{/if}

{#if showRecommendations && summary}
  <ReadingRecommendationsModal
    currentLevel={summary.currentLevel}
    onClose={closeRecommendations}
  />
{/if}

<style>
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px;
    gap: 16px;
    color: #667985;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #DCE6EA;
    border-top-color: #176B87;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-state {
    text-align: center;
    padding: 60px 20px;
    background: #FFF4F3;
    border-radius: 12px;
    color: #D9534F;
  }

  .error-state .btn-primary {
    margin-top: 16px;
    padding: 10px 20px;
    background: #176B87;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: inherit;
    font-weight: 600;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 28px;
    gap: 20px;
    flex-wrap: wrap;
  }

  .page-tag {
    display: block;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
    color: #176B87;
    margin-bottom: 8px;
  }

  .streak-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: linear-gradient(135deg, #FFF3E0, #FFE0B2);
    color: #E65100;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(230, 81, 0, 0.15);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: white;
    padding: 22px;
    border-radius: 12px;
    border: 1px solid #DCE6EA;
    box-shadow: 0 2px 8px rgba(24, 59, 78, 0.06);
  }

  .stat-icon {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-icon-primary { background: #EAF4F6; color: #176B87; }
  .stat-icon-accent { background: #FEF6E0; color: #B8860B; }
  .stat-icon-level { background: #F0ECF7; color: #7257A5; }

  .stat-value {
    font-size: 26px;
    font-weight: 750;
    color: #183B4E;
    line-height: 1.1;
  }

  .stat-value-badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 700;
    border: 1px solid;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: #667985;
    margin-top: 2px;
  }

  .card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    border: 1px solid #DCE6EA;
    box-shadow: 0 2px 8px rgba(24, 59, 78, 0.06);
    margin-bottom: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 16px;
  }

  .card-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #183B4E;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-subtitle {
    margin: 4px 0 0;
    font-size: 12px;
    color: #96A5AE;
  }

  .chart-legend {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #667985;
    font-weight: 600;
  }

  .legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    background: linear-gradient(180deg, #176B87, #2A9D8F);
  }

  .chart {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 8px;
    height: 240px;
    padding: 8px 4px 0;
  }

  .chart-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  .chart-bar-wrapper {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    position: relative;
  }

  .chart-bar {
    width: 100%;
    max-width: 44px;
    background: linear-gradient(180deg, #176B87, #2A9D8F);
    border-radius: 8px 8px 0 0;
    min-height: 4px;
    transition: all 0.3s ease;
    box-shadow: 0 -2px 8px rgba(23, 107, 135, 0.15);
  }

  .chart-bar.empty {
    background: #E5EDF1;
    box-shadow: none;
  }

  .chart-value {
    position: absolute;
    top: -22px;
    font-size: 11px;
    font-weight: 800;
    color: #176B87;
  }

  .chart-day-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    margin-top: 10px;
  }

  .chart-day {
    font-size: 11px;
    color: #667985;
    font-weight: 700;
    text-transform: capitalize;
  }

  .chart-sessions {
    font-size: 9px;
    color: #96A5AE;
    font-weight: 600;
  }

  .empty-chart {
    text-align: center;
    padding: 60px 20px;
    color: #96A5AE;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .empty-chart p {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #667985;
  }

  .empty-chart span {
    font-size: 13px;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 20px;
  }

  .recommendations-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .recommendations-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px;
    background: #F7FAFC;
    border-radius: 10px;
    font-size: 13px;
    line-height: 1.5;
    color: #183B4E;
    border-left: 3px solid #2A9D8F;
  }

  .rec-number {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #2A9D8F;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
    flex-shrink: 0;
  }

  .actions-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .action-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px;
    background: white;
    border: 1px solid #DCE6EA;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
    text-align: left;
    width: 100%;
  }

  .action-item:hover {
    border-color: #176B87;
    background: #F7FAFC;
    transform: translateX(2px);
  }

  .action-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .action-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .action-title {
    font-size: 13px;
    font-weight: 700;
    color: #183B4E;
  }

  .action-desc {
    font-size: 11px;
    color: #667985;
  }

  .motivational-card {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    padding: 24px;
    background: linear-gradient(135deg, #FFF7DC, #FFFDF5);
    border: 1px solid #EBD27A;
    border-radius: 12px;
  }

  .motivational-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: linear-gradient(135deg, #F4C95D, #E6A817);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(244, 201, 93, 0.4);
  }

  .motivational-card h4 {
    margin: 0 0 6px;
    font-size: 15px;
    font-weight: 800;
    color: #8B6914;
  }

  .motivational-card p {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: #667985;
  }

  @media (max-width: 900px) {
    .stats-grid { grid-template-columns: 1fr; }
    .content-grid { grid-template-columns: 1fr; }
    .chart { height: 180px; }
    .chart-value { font-size: 9px; }
  }
</style>