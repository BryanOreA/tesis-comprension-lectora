<script>
  import { onMount } from 'svelte';
  import Icon from '../Icon.svelte';
  import EvolutionChart from '../EvolutionChart.svelte';
  import { getStudentDetail, downloadStudentReport } from '../../lib/api.js';
  import { exportStudentPDF } from '../../lib/pdfExport.js';

  export let studentId = null;
  export let onClose = () => {};

  let detail = null;
  let loading = true;
  let error = '';
  let exporting = false;

  onMount(async () => {
    await loadDetail();
  });

  async function loadDetail() {
    loading = true;
    error = '';
    try {
      detail = await getStudentDetail(studentId);
    } catch (e) {
      error = 'No se pudo cargar el detalle';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  function getLevelColor(level) {
    if (level === 'En Inicio') return { bg: '#FFF4F3', color: '#D9534F', border: '#F2C8C6' };
    if (level === 'En Proceso') return { bg: '#FFF3E0', color: '#E65100', border: '#FFD8A0' };
    return { bg: '#E8F5E9', color: '#27AE60', border: '#A5D6A7' };
  }

  function getAlertStyle(type) {
    if (type === 'danger') return { bg: '#FFF4F3', color: '#D9534F', border: '#F2C8C6' };
    if (type === 'warning') return { bg: '#FFF3E0', color: '#E65100', border: '#FFD8A0' };
    if (type === 'success') return { bg: '#E8F5E9', color: '#27AE60', border: '#A5D6A7' };
    return { bg: '#EAF4F6', color: '#176B87', border: '#A8CED9' };
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleExportCSV() {
    if (detail) downloadStudentReport(detail.id, detail.name);
  }

  function handleExportPDF() {
    if (!detail) return;
    exporting = true;
    try {
      exportStudentPDF(
        {
          level: detail.level,
          averageScore: detail.averageScore,
          totalSessions: detail.totalSessions,
          totalPoints: detail.totalPoints,
          alerts: detail.alerts,
          recommendations: []
        },
        detail.evolution,
        detail.name
      );
    } catch (e) {
      console.error('Error generando PDF:', e);
      alert('No se pudo generar el PDF');
    } finally {
      exporting = false;
    }
  }
</script>

<div class="modal-backdrop" onclick={handleBackdrop} role="presentation">
  <div class="modal" role="dialog" aria-modal="true">
    {#if loading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Cargando información...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <Icon name="alert-triangle" size={32} color="#D9534F" />
        <p>{error}</p>
        <button class="btn-primary" onclick={loadDetail}>Reintentar</button>
      </div>
    {:else if detail}
      <!-- Header -->
      <div class="modal-header">
        <div class="modal-title-group">
          <div class="modal-avatar">
            <Icon name="user-graduate" size={26} />
          </div>
          <div>
            <h2>{detail.name}</h2>
            <span class="modal-username">@{detail.username}</span>
          </div>
        </div>
        <button class="btn-close" onclick={onClose} aria-label="Cerrar">
          <Icon name="x" size={20} />
        </button>
      </div>

      <!-- Stats -->
      <div class="modal-stats">
        <div class="modal-stat">
          <span class="modal-stat-label">Nivel actual</span>
          <span
            class="modal-stat-value-badge"
            style="background: {getLevelColor(detail.level).bg}; color: {getLevelColor(detail.level).color}; border-color: {getLevelColor(detail.level).border};"
          >
            {detail.level}
          </span>
        </div>
        <div class="modal-stat">
          <span class="modal-stat-label">Promedio</span>
          <span class="modal-stat-value">{detail.averageScore}%</span>
        </div>
        <div class="modal-stat">
          <span class="modal-stat-label">Sesiones</span>
          <span class="modal-stat-value">{detail.totalSessions}</span>
        </div>
        <div class="modal-stat">
          <span class="modal-stat-label">Puntos</span>
          <span class="modal-stat-value">{detail.totalPoints}</span>
        </div>
      </div>

      <!-- Alertas -->
      {#if detail.alerts.length > 0}
        <div class="modal-section">
          <h3 class="modal-section-title">
            <Icon name="alert-triangle" size={16} />
            Alertas y observaciones
          </h3>
          <div class="alerts-list">
            {#each detail.alerts as alert}
              <div
                class="alert-item"
                style="background: {getAlertStyle(alert.type).bg}; color: {getAlertStyle(alert.type).color}; border-color: {getAlertStyle(alert.type).border};"
              >
                <Icon name={alert.icon || 'alert-triangle'} size={16} />
                <span>{alert.message}</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Evolución -->
      <div class="modal-section">
        <h3 class="modal-section-title">
          <Icon name="activity" size={16} />
          Evolución del desempeño
        </h3>
        <EvolutionChart data={detail.evolution} />
      </div>

      <!-- Acciones -->
      <div class="modal-actions">
        <button class="btn-secondary" onclick={onClose}>Cerrar</button>
        <button class="btn-secondary" onclick={handleExportCSV}>
          <Icon name="download" size={16} />
          CSV
        </button>
        <button class="btn-primary" onclick={handleExportPDF} disabled={exporting}>
          <Icon name="file-text" size={16} />
          {exporting ? 'Generando...' : 'Exportar PDF'}
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(24, 59, 78, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 24px;
    animation: fadeIn 0.2s ease;
  }

  .modal {
    background: white;
    border-radius: 20px;
    padding: 32px;
    max-width: 780px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid #E5EDF1;
  }

  .modal-title-group {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .modal-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #176B87, #2A9D8F);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .modal-title-group h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 750;
    color: #183B4E;
    letter-spacing: -0.5px;
  }

  .modal-username {
    font-size: 13px;
    color: #667985;
  }

  .btn-close {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: none;
    background: #F7FAFC;
    color: #667985;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .btn-close:hover {
    background: #FFF4F3;
    color: #D9534F;
  }

  .modal-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 28px;
  }

  .modal-stat {
    background: #F7FAFC;
    padding: 16px;
    border-radius: 12px;
    text-align: center;
  }

  .modal-stat-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: #96A5AE;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 8px;
  }

  .modal-stat-value {
    font-size: 22px;
    font-weight: 750;
    color: #176B87;
  }

  .modal-stat-value-badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    border: 1px solid;
  }

  .modal-section {
    margin-bottom: 24px;
  }

  .modal-section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 14px;
    font-size: 14px;
    font-weight: 700;
    color: #183B4E;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .alerts-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .alert-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid;
    font-size: 13px;
    font-weight: 600;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid #E5EDF1;
    flex-wrap: wrap;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #176B87;
    color: white;
    border: none;
    border-radius: 10px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 650;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary:hover:not(:disabled) {
    background: #12566D;
    transform: translateY(-1px);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: white;
    color: #667985;
    border: 1px solid #DCE6EA;
    border-radius: 10px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 650;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background: #F7FAFC;
    border-color: #B9CBD3;
  }

  .loading {
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

  .error-state {
    text-align: center;
    padding: 40px;
    color: #D9534F;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @media (max-width: 768px) {
    .modal-stats { grid-template-columns: repeat(2, 1fr); }
    .modal { padding: 24px; }
  }
</style>