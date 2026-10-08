<script>
  import { onMount } from 'svelte';
  import Icon from '../Icon.svelte';
  import { getStudentProgress } from '../../lib/api.js';

  export let studentId = null;
  export let studentName = '';
  export let onClose = () => {};

  let history = null;
  let loading = true;
  let error = '';

  onMount(async () => {
    await loadHistory();
  });

  async function loadHistory() {
    loading = true;
    error = '';
    try {
      history = await getStudentProgress(studentId);
    } catch (e) {
      error = 'No se pudo cargar el historial';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  function getLevelColor(level) {
    if (level === 'En Inicio') return { bg: '#FFF4F3', color: '#D9534F' };
    if (level === 'En Proceso') return { bg: '#FFF3E0', color: '#E65100' };
    return { bg: '#E8F5E9', color: '#27AE60' };
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }
</script>

<div class="modal-backdrop" onclick={handleBackdrop} role="presentation">
  <div class="modal" role="dialog" aria-modal="true">
    <div class="modal-header">
      <div>
        <span class="modal-tag">HISTORIAL COMPLETO</span>
        <h2>Textos leídos por {studentName}</h2>
      </div>
      <button class="btn-close" onclick={onClose} aria-label="Cerrar">
        <Icon name="x" size={20} />
      </button>
    </div>

    {#if loading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Cargando historial...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <Icon name="alert-triangle" size={32} color="#D9534F" />
        <p>{error}</p>
        <button class="btn-primary" onclick={loadHistory}>Reintentar</button>
      </div>
    {:else if history}
      <!-- Resumen -->
      <div class="summary-row">
        <div class="summary-item">
          <span class="summary-value">{history.sessions}</span>
          <span class="summary-label">Sesiones</span>
        </div>
        <div class="summary-item">
          <span class="summary-value">{history.averageScore}%</span>
          <span class="summary-label">Promedio</span>
        </div>
        <div class="summary-item">
          <span class="summary-value">{history.points}</span>
          <span class="summary-label">Puntos</span>
        </div>
      </div>

      <!-- Evolución -->
      {#if history.evolution && history.evolution.length > 0}
        <div class="history-list">
          {#each [...history.evolution].reverse() as session}
            <div class="history-item">
              <div class="history-icon" style="background: {getLevelColor(session.level).bg}; color: {getLevelColor(session.level).color};">
                <Icon name="book-marked" size={18} />
              </div>
              <div class="history-info">
                <div class="history-date">{formatDate(session.date)}</div>
                <div class="history-level" style="color: {getLevelColor(session.level).color};">
                  {session.level}
                </div>
              </div>
              <div class="history-score">
                <span class="score-value">{session.score}%</span>
                <span class="score-label">aciertos</span>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="empty-history">
          <Icon name="book" size={48} color="#96A5AE" />
          <p>Aún no ha leído ningún texto</p>
          <span>Cuando complete su primera lectura, aparecerá aquí</span>
        </div>
      {/if}
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
    max-width: 560px;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #E5EDF1;
    gap: 16px;
  }

  .modal-tag {
    display: block;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
    color: #176B87;
    margin-bottom: 6px;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 750;
    color: #183B4E;
    letter-spacing: -0.3px;
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
    flex-shrink: 0;
  }

  .btn-close:hover {
    background: #FFF4F3;
    color: #D9534F;
  }

  .summary-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }

  .summary-item {
    background: #F7FAFC;
    padding: 16px;
    border-radius: 12px;
    text-align: center;
  }

  .summary-value {
    display: block;
    font-size: 22px;
    font-weight: 750;
    color: #176B87;
    margin-bottom: 4px;
  }

  .summary-label {
    font-size: 11px;
    font-weight: 700;
    color: #96A5AE;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .history-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px;
    background: white;
    border: 1px solid #E5EDF1;
    border-radius: 12px;
    transition: all 0.2s;
  }

  .history-item:hover {
    border-color: #176B87;
    background: #F7FAFC;
  }

  .history-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .history-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .history-date {
    font-size: 13px;
    font-weight: 700;
    color: #183B4E;
    text-transform: capitalize;
  }

  .history-level {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .history-score {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .score-value {
    font-size: 18px;
    font-weight: 800;
    color: #176B87;
  }

  .score-label {
    font-size: 10px;
    color: #96A5AE;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .empty-history {
    text-align: center;
    padding: 60px 20px;
    color: #96A5AE;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .empty-history p {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #667985;
  }

  .empty-history span {
    font-size: 13px;
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
</style>