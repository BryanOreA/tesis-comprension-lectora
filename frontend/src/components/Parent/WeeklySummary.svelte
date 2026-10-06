<script>
  import Navbar from '../Navbar.svelte';

  const summary = {
    studentName: 'Juan Pérez',
    textsRead: 8,
    averageScore: 78,
    currentLevel: 'En Proceso',
    weeklyProgress: [40, 55, 60, 65, 72, 75, 78],
    recommendations: [
      'Practicar la lectura en voz alta 10 minutos al día.',
      'Hacer preguntas sobre lo leído para mejorar la comprensión.',
      'Motivar con pequeñas recompensas por cada texto completado.',
      'Establecer un horario fijo de lectura antes de dormir.'
    ]
  };

  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  $: maxValue = Math.max(...summary.weeklyProgress);
</script>

<div class="app-container">
  <Navbar />

  <div class="page-content">
    <div class="page-header">
      <div>
        <h1 class="page-title">Resumen Semanal</h1>
        <p class="page-subtitle">Progreso de <strong>{summary.studentName}</strong></p>
      </div>
      <div class="week-badge">Esta semana</div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--primary-light); color: var(--primary);">📚</div>
        <div>
          <div class="stat-value">{summary.textsRead}</div>
          <div class="stat-label">Textos leídos</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--success-bg); color: var(--success);">🎯</div>
        <div>
          <div class="stat-value">{summary.averageScore}%</div>
          <div class="stat-label">Promedio de aciertos</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--accent-light); color: #B8860B;">🏆</div>
        <div>
          <div class="stat-value">{summary.currentLevel}</div>
          <div class="stat-label">Nivel actual</div>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <!-- Gráfico de progreso -->
      <div class="card chart-card">
        <h3>Progreso de la semana</h3>
        <div class="chart">
          {#each summary.weeklyProgress as value, i}
            <div class="chart-bar-wrapper">
              <div class="chart-bar" style="height: {(value / maxValue) * 100}%">
                <span class="chart-value">{value}%</span>
              </div>
              <span class="chart-day">{days[i]}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Recomendaciones -->
      <div class="card recommendations-card">
        <h3>📖 Recomendaciones para casa</h3>
        <ul class="recommendations-list">
          {#each summary.recommendations as rec}
            <li>
              <span class="rec-check">✓</span>
              <span>{rec}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- Mensaje motivacional -->
    <div class="card motivational-card">
      <div class="motivational-icon">💡</div>
      <div>
        <h4>Consejo del día</h4>
        <p>
          La constancia es la clave. Dedica unos minutos cada día para leer con tu hijo
          y verás mejoras significativas en su comprensión lectora.
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .page-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 32px; gap: 20px; flex-wrap: wrap;
  }
  .week-badge {
    padding: 8px 16px; background: var(--primary-light); color: var(--primary);
    border-radius: 20px; font-size: 13px; font-weight: 650;
  }

  /* Stats */
  .stats-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 16px; margin-bottom: 28px;
  }
  .stat-card {
    display: flex; align-items: center; gap: 16px;
    background: var(--surface); padding: 22px;
    border-radius: var(--radius); border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }
  .stat-icon {
    width: 52px; height: 52px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; font-size: 24px;
  }
  .stat-value { font-size: 24px; font-weight: 750; color: var(--text); line-height: 1.1; }
  .stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

  /* Grid de contenido */
  .content-grid {
    display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px;
    margin-bottom: 20px;
  }

  /* Gráfico */
  .chart-card h3, .recommendations-card h3, .motivational-card h4 {
    margin: 0 0 20px; font-size: 16px; font-weight: 700; color: var(--text);
  }
  .chart {
    display: flex; align-items: flex-end; justify-content: space-between;
    height: 220px; gap: 8px; padding: 0 4px;
  }
  .chart-bar-wrapper {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: flex-end; height: 100%;
  }
  .chart-bar {
    width: 100%; background: linear-gradient(180deg, var(--primary), var(--secondary));
    border-radius: 6px 6px 0 0; position: relative;
    min-height: 20px; transition: all 0.3s; cursor: pointer;
  }
  .chart-bar:hover { opacity: 0.85; }
  .chart-value {
    position: absolute; top: -22px; left: 50%; transform: translateX(-50%);
    font-size: 11px; font-weight: 700; color: var(--primary);
  }
  .chart-day {
    font-size: 11px; color: var(--text-muted); margin-top: 8px; font-weight: 600;
  }

  /* Recomendaciones */
  .recommendations-list {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column; gap: 12px;
  }
  .recommendations-list li {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px; background: var(--background); border-radius: var(--radius-sm);
    font-size: 13px; line-height: 1.5; color: var(--text);
  }
  .rec-check {
    width: 20px; height: 20px; border-radius: 50%;
    background: var(--secondary); color: white;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; flex-shrink: 0;
  }

  /* Mensaje motivacional */
  .motivational-card {
    display: flex; align-items: flex-start; gap: 16px;
    background: linear-gradient(135deg, var(--accent-light), #FFF);
    border: 1px solid var(--accent);
  }
  .motivational-icon {
    font-size: 32px; flex-shrink: 0;
  }
  .motivational-card h4 { margin: 0 0 6px; color: #8B6914; }
  .motivational-card p {
    margin: 0; font-size: 13px; line-height: 1.6; color: var(--text-secondary);
  }

  @media (max-width: 900px) {
    .stats-grid { grid-template-columns: 1fr; }
    .content-grid { grid-template-columns: 1fr; }
  }
</style>