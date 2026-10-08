<script>
  import { onMount } from 'svelte';
  import Navbar from '../Navbar.svelte';
  import Icon from '../Icon.svelte';
  import StudentDetailModal from './StudentDetailModal.svelte';
  import { getAllStudents, downloadClassReport } from '../../lib/api.js';
  import { exportClassPDF } from '../../lib/pdfExport.js';

  let students = [];
  let loading = true;
  let error = '';
  let filter = 'todos';
  let searchTerm = '';
  let selectedStudentId = null;

  onMount(async () => {
    await loadStudents();
  });

  async function loadStudents() {
    loading = true;
    error = '';
    try {
      students = await getAllStudents();
    } catch (e) {
      error = 'No se pudieron cargar los estudiantes. ¿Está el backend activo?';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  function handleExportPDF() {
    if (students.length === 0) return;
    try {
      exportClassPDF(students);
    } catch (e) {
      console.error('Error generando PDF:', e);
      alert('No se pudo generar el PDF');
    }
  }

  $: filteredStudents = students.filter((s) => {
    const matchesFilter =
      filter === 'todos' ||
      (filter === 'alertas' ? s.needsAlert : s.level.toLowerCase().includes(filter));
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  $: totalStudents = students.length;
  $: alertCount = students.filter((s) => s.needsAlert).length;
  $: avgProgress =
    students.length > 0
      ? Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length)
      : 0;

  function getLevelColor(level) {
    if (level === 'En Inicio') return { bg: '#FFF4F3', color: '#D9534F', border: '#F2C8C6' };
    if (level === 'En Proceso') return { bg: '#FFF3E0', color: '#E65100', border: '#FFD8A0' };
    return { bg: '#E8F5E9', color: '#27AE60', border: '#A5D6A7' };
  }

  function openStudent(id) {
    selectedStudentId = id;
  }

  function closeModal() {
    selectedStudentId = null;
    loadStudents();
  }
</script>

<div class="app-container">
  <Navbar />

  <div class="page-content">
    <div class="page-header">
      <div>
        <h1 class="page-title">Panel de Estudiantes</h1>
        <p class="page-subtitle">Monitorea el progreso de tus estudiantes en tiempo real</p>
      </div>
      <div class="header-actions">
        <button class="btn-export secondary" onclick={downloadClassReport}>
          <Icon name="download" size={16} />
          <span>CSV</span>
        </button>
        <button class="btn-export" onclick={handleExportPDF}>
          <Icon name="file-text" size={16} />
          <span>PDF</span>
        </button>
      </div>
    </div>

    {#if loading}
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Cargando estudiantes...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <Icon name="alert-triangle" size={32} color="#D9534F" />
        <p>{error}</p>
        <button class="btn-primary" onclick={loadStudents}>Reintentar</button>
      </div>
    {:else}
      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-primary">
            <Icon name="user" size={22} />
          </div>
          <div>
            <div class="stat-value">{totalStudents}</div>
            <div class="stat-label">Estudiantes</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-alert">
            <Icon name="alert-triangle" size={22} />
          </div>
          <div>
            <div class="stat-value">{alertCount}</div>
            <div class="stat-label">Alertas activas</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-success">
            <Icon name="trending-up" size={22} />
          </div>
          <div>
            <div class="stat-value">{avgProgress}%</div>
            <div class="stat-label">Promedio general</div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-bar">
        <div class="filter-group">
          <button class="filter-btn" class:active={filter === 'todos'} onclick={() => (filter = 'todos')}>
            Todos
          </button>
          <button class="filter-btn" class:active={filter === 'inicio'} onclick={() => (filter = 'inicio')}>
            En Inicio
          </button>
          <button class="filter-btn" class:active={filter === 'proceso'} onclick={() => (filter = 'proceso')}>
            En Proceso
          </button>
          <button class="filter-btn" class:active={filter === 'satisfactorio'} onclick={() => (filter = 'satisfactorio')}>
            Satisfactorio
          </button>
          <button class="filter-btn filter-alert" class:active={filter === 'alertas'} onclick={() => (filter = 'alertas')}>
            <Icon name="alert-triangle" size={13} />
            Alertas
          </button>
        </div>
        <input
          type="text"
          class="search-input"
          placeholder="Buscar estudiante..."
          bind:value={searchTerm}
        />
      </div>

      <!-- Tabla -->
      <div class="card table-card">
        <table>
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Nivel</th>
              <th>Progreso</th>
              <th>Sesiones</th>
              <th>Última sesión</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {#each filteredStudents as student (student.id)}
              {@const levelStyle = getLevelColor(student.level)}
              <tr onclick={() => openStudent(student.id)} class="clickable-row">
                <td>
                  <div class="student-cell">
                    <div class="student-avatar">
                      <Icon name="user-graduate" size={18} />
                    </div>
                    <span>{student.name}</span>
                  </div>
                </td>
                <td>
                  <span class="badge" style="background: {levelStyle.bg}; color: {levelStyle.color}; border-color: {levelStyle.border};">
                    {student.level}
                  </span>
                </td>
                <td>
                  <div class="progress-cell">
                    <div class="mini-progress">
                      <div style="width: {student.progress}%; background: {levelStyle.color};"></div>
                    </div>
                    <span>{student.progress}%</span>
                  </div>
                </td>
                <td class="text-muted">{student.totalSessions}</td>
                <td class="text-muted">{student.lastSession}</td>
                <td>
                  {#if student.needsAlert}
                    <span class="status status-alert">
                      <Icon name="alert-triangle" size={13} />
                      Requiere atención
                    </span>
                  {:else}
                    <span class="status status-ok">
                      <Icon name="check-circle" size={13} />
                      Al día
                    </span>
                  {/if}
                </td>
                <td class="action-cell">
                  <Icon name="chevron-right" size={18} color="#96A5AE" />
                </td>
              </tr>
            {/each}
          </tbody>
        </table>

        {#if filteredStudents.length === 0}
          <div class="empty-state">
            <Icon name="user" size={40} color="#96A5AE" />
            <p>No se encontraron estudiantes con ese criterio.</p>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

{#if selectedStudentId !== null}
  <StudentDetailModal studentId={selectedStudentId} onClose={closeModal} />
{/if}

<style>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
    gap: 20px;
    flex-wrap: wrap;
  }

  .header-actions {
    display: flex;
    gap: 10px;
  }

  .btn-export {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: #176B87;
    color: white;
    border: none;
    border-radius: 10px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 650;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(23, 107, 135, 0.18);
  }

  .btn-export:hover {
    background: #12566D;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(23, 107, 135, 0.25);
  }

  .btn-export.secondary {
    background: white;
    color: #667985;
    border: 1px solid #DCE6EA;
    box-shadow: none;
  }

  .btn-export.secondary:hover {
    background: #F7FAFC;
    border-color: #176B87;
    color: #176B87;
  }

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

  /* Stats */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--surface);
    padding: 22px;
    border-radius: 12px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
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

  .stat-icon-primary { background: var(--primary-light); color: var(--primary); }
  .stat-icon-alert { background: var(--error-bg); color: var(--error); }
  .stat-icon-success { background: var(--success-bg); color: var(--success); }

  .stat-value {
    font-size: 26px;
    font-weight: 750;
    color: var(--text);
    line-height: 1.1;
  }

  .stat-label {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 2px;
  }

  /* Filtros */
  .filters-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 1px solid var(--border);
    border-radius: 20px;
    background: var(--surface);
    color: var(--text-secondary);
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  .filter-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  .filter-alert { color: var(--error); border-color: #F2C8C6; }
  .filter-alert:hover { border-color: var(--error); color: var(--error); }
  .filter-alert.active {
    background: var(--error);
    color: white;
    border-color: var(--error);
  }

  .search-input {
    padding: 10px 16px;
    border: 1px solid var(--border);
    border-radius: 20px;
    font-family: inherit;
    font-size: 13px;
    outline: none;
    background: var(--surface);
    color: var(--text);
    min-width: 240px;
  }

  .search-input:focus {
    border-color: var(--primary);
  }

  /* Tabla */
  .card {
    background: var(--surface);
    border-radius: 12px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  .table-card {
    padding: 0;
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    text-align: left;
    padding: 16px 20px;
    background: var(--background);
    color: var(--text-secondary);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--border);
  }

  td {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    font-size: 14px;
    color: var(--text);
  }

  .clickable-row {
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .clickable-row:hover td {
    background: var(--background);
  }

  .student-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .student-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--primary-light);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 650;
    border: 1px solid;
  }

  .progress-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .mini-progress {
    width: 80px;
    height: 6px;
    background: var(--border);
    border-radius: 3px;
    overflow: hidden;
  }

  .mini-progress div {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  .status-ok { color: var(--success); }
  .status-alert { color: var(--error); }

  .text-muted {
    color: var(--text-muted);
    font-size: 13px;
  }

  .action-cell {
    text-align: right;
    width: 40px;
  }

  .empty-state {
    padding: 60px;
    text-align: center;
    color: var(--text-muted);
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  @media (max-width: 900px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .table-card {
      overflow-x: auto;
    }

    table {
      min-width: 800px;
    }

    .header-actions {
      width: 100%;
    }

    .btn-export {
      flex: 1;
      justify-content: center;
    }
  }
</style>