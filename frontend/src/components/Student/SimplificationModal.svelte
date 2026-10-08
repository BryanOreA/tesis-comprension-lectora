<script>
  import { onMount } from 'svelte';
  import Icon from '../Icon.svelte';
  import { getSimplifiedText } from '../../lib/api.js';

  export let textId = null;
  export let onClose = () => {};

  let data = null;
  let loading = true;
  let error = '';
  let view = 'compare'; // 'original' | 'simplified' | 'compare'

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    loading = true;
    error = '';
    try {
      data = await getSimplifiedText(textId);
    } catch (e) {
      error = 'No se pudo cargar la comparación';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  function calculateReduction(original, simplified) {
    if (!original || original === 0) return 0;
    return Math.round(((original - simplified) / original) * 100);
  }
</script>

<div class="modal-backdrop" onclick={handleBackdrop} role="presentation">
  <div class="modal" role="dialog" aria-modal="true">
    <div class="modal-header">
      <div>
        <span class="modal-tag">MOTOR DE SIMPLIFICACIÓN PLN</span>
        <h2>Cómo el sistema adapta tu texto</h2>
        <p class="modal-subtitle">
          El motor usa Procesamiento de Lenguaje Natural para ajustar el nivel del texto.
        </p>
      </div>
      <button class="btn-close" onclick={onClose} aria-label="Cerrar">
        <Icon name="x" size={20} />
      </button>
    </div>

    {#if loading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Analizando texto...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <Icon name="alert-triangle" size={32} color="#D9534F" />
        <p>{error}</p>
        <button class="btn-primary" onclick={loadData}>Reintentar</button>
      </div>
    {:else if data}
      <!-- Toggle de vista -->
      <div class="view-toggle">
        <button class="toggle-btn" class:active={view === 'original'} onclick={() => (view = 'original')}>
          <Icon name="file-text" size={16} />
          <span>Original</span>
        </button>
        <button class="toggle-btn" class:active={view === 'compare'} onclick={() => (view = 'compare')}>
          <Icon name="git-compare" size={16} />
          <span>Comparar</span>
        </button>
        <button class="toggle-btn" class:active={view === 'simplified'} onclick={() => (view = 'simplified')}>
          <Icon name="sparkles-2" size={16} />
          <span>Simplificado</span>
        </button>
      </div>

      <!-- Contenido -->
      {#if view === 'original'}
        <div class="content-panel original-panel">
          <div class="panel-header">
            <div class="panel-icon" style="background: #FFF4F3; color: #D9534F;">
              <Icon name="file-text" size={20} />
            </div>
            <div>
              <div class="panel-title">Texto Original</div>
              <div class="panel-subtitle">Complejidad completa</div>
            </div>
          </div>
          <p class="text-content">{data.original.content}</p>
        </div>
      {:else if view === 'simplified'}
        <div class="content-panel simplified-panel">
          <div class="panel-header">
            <div class="panel-icon" style="background: #E8F5E9; color: #27AE60;">
              <Icon name="sparkles-2" size={20} />
            </div>
            <div>
              <div class="panel-title">Texto Simplificado</div>
              <div class="panel-subtitle">Nivel "En Inicio"</div>
            </div>
          </div>
          <p class="text-content">{data.simplified.content}</p>
        </div>
      {:else}
        <div class="compare-grid">
          <div class="compare-col original-panel">
            <div class="panel-header-small">
              <Icon name="file-text" size={16} color="#D9534F" />
              <span>Original</span>
            </div>
            <p class="text-content-small">{data.original.content}</p>
          </div>
          <div class="compare-col simplified-panel">
            <div class="panel-header-small">
              <Icon name="sparkles-2" size={16} color="#27AE60" />
              <span>Simplificado</span>
            </div>
            <p class="text-content-small">{data.simplified.content}</p>
          </div>
        </div>
      {/if}

      <!-- Métricas -->
      <div class="metrics-section">
        <h3 class="metrics-title">
          <Icon name="activity" size={16} />
          Métricas de complejidad
        </h3>

        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-label">Palabras</span>
            <div class="metric-values">
              <span class="metric-original">{data.original.metrics.word_count}</span>
              <Icon name="chevron-right" size={14} color="#96A5AE" />
              <span class="metric-simplified">{data.simplified.metrics.word_count}</span>
            </div>
          </div>

          <div class="metric-card">
            <span class="metric-label">Oraciones</span>
            <div class="metric-values">
              <span class="metric-original">{data.original.metrics.sentence_count}</span>
              <Icon name="chevron-right" size={14} color="#96A5AE" />
              <span class="metric-simplified">{data.simplified.metrics.sentence_count}</span>
            </div>
          </div>

          <div class="metric-card">
            <span class="metric-label">Long. oración prom.</span>
            <div class="metric-values">
              <span class="metric-original">{data.original.metrics.avg_sentence_length} pal.</span>
              <Icon name="chevron-right" size={14} color="#96A5AE" />
              <span class="metric-simplified">{data.simplified.metrics.avg_sentence_length} pal.</span>
            </div>
          </div>

          <div class="metric-card">
            <span class="metric-label">Long. palabra prom.</span>
            <div class="metric-values">
              <span class="metric-original">{data.original.metrics.avg_word_length} car.</span>
              <Icon name="chevron-right" size={14} color="#96A5AE" />
              <span class="metric-simplified">{data.simplified.metrics.avg_word_length} car.</span>
            </div>
          </div>
        </div>

        {#if data.original.metrics.avg_sentence_length > data.simplified.metrics.avg_sentence_length}
          <div class="reduction-info">
            <Icon name="trending-down" size={16} color="#27AE60" />
            <span>
              Las oraciones son
              <strong>{calculateReduction(data.original.metrics.avg_sentence_length, data.simplified.metrics.avg_sentence_length)}%</strong>
              más cortas en promedio
            </span>
          </div>
        {/if}
      </div>

      <div class="modal-footer">
        <button class="btn-primary" onclick={onClose}>Entendido</button>
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
    max-width: 820px;
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
    margin-bottom: 24px;
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
    margin: 0 0 6px;
    font-size: 22px;
    font-weight: 750;
    color: #183B4E;
    letter-spacing: -0.3px;
  }

  .modal-subtitle {
    margin: 0;
    font-size: 13px;
    color: #667985;
    line-height: 1.5;
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

  /* Toggle */
  .view-toggle {
    display: flex;
    gap: 6px;
    padding: 6px;
    background: #F7FAFC;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .toggle-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border: none;
    background: transparent;
    color: #667985;
    font-family: inherit;
    font-size: 13px;
    font-weight: 650;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .toggle-btn:hover {
    color: #176B87;
  }

  .toggle-btn.active {
    background: white;
    color: #176B87;
    box-shadow: 0 2px 6px rgba(23, 107, 135, 0.1);
  }

  /* Content */
  .content-panel {
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #E5EDF1;
    margin-bottom: 24px;
  }

  .original-panel {
    background: #FFFCFC;
    border-color: #F2C8C6;
  }

  .simplified-panel {
    background: #F8FDF9;
    border-color: #A5D6A7;
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .panel-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .panel-title {
    font-size: 15px;
    font-weight: 750;
    color: #183B4E;
  }

  .panel-subtitle {
    font-size: 12px;
    color: #667985;
  }

  .text-content {
    font-size: 15px;
    line-height: 1.8;
    color: #183B4E;
    margin: 0;
  }

  /* Compare grid */
  .compare-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .compare-col {
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #E5EDF1;
  }

  .panel-header-small {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 12px;
    font-weight: 800;
    color: #183B4E;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .text-content-small {
    font-size: 13px;
    line-height: 1.7;
    color: #183B4E;
    margin: 0;
  }

  /* Metrics */
  .metrics-section {
    padding: 20px;
    background: #F7FAFC;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .metrics-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px;
    font-size: 13px;
    font-weight: 800;
    color: #183B4E;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .metric-card {
    background: white;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #E5EDF1;
  }

  .metric-label {
    display: block;
    font-size: 11px;
    color: #96A5AE;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .metric-values {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .metric-original {
    font-size: 14px;
    font-weight: 700;
    color: #D9534F;
  }

  .metric-simplified {
    font-size: 14px;
    font-weight: 700;
    color: #27AE60;
  }

  .reduction-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 16px;
    padding: 12px 16px;
    background: #E8F5E9;
    border-radius: 10px;
    font-size: 13px;
    color: #183B4E;
  }

  .reduction-info strong {
    color: #27AE60;
    font-weight: 800;
  }

  /* Footer */
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
    border-top: 1px solid #E5EDF1;
  }

  .btn-primary {
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

  .btn-primary:hover {
    background: #12566D;
    transform: translateY(-1px);
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
    .compare-grid {
      grid-template-columns: 1fr;
    }
    .metrics-grid {
      grid-template-columns: 1fr;
    }
  }
</style>