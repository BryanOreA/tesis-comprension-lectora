<script>
  import Navbar from '../Navbar.svelte';

  let students = [
    { id: 1, name: 'Juan Pérez', level: 'En Inicio', progress: 25, lastSession: 'Hoy', needsAlert: true },
    { id: 2, name: 'María García', level: 'En Proceso', progress: 60, lastSession: 'Hoy', needsAlert: false },
    { id: 3, name: 'Luis Torres', level: 'Satisfactorio', progress: 90, lastSession: 'Ayer', needsAlert: false },
    { id: 4, name: 'Ana Ramírez', level: 'En Inicio', progress: 15, lastSession: 'Hace 3 días', needsAlert: true },
    { id: 5, name: 'Carlos Mendoza', level: 'En Proceso', progress: 55, lastSession: 'Hoy', needsAlert: false },
    { id: 6, name: 'Sofía Rojas', level: 'Satisfactorio', progress: 85, lastSession: 'Hoy', needsAlert: false }
  ];

  let filter = 'todos';
  let searchTerm = '';

  $: filteredStudents = students.filter(s => {
    const matchesFilter = filter === 'todos' || s.level.toLowerCase().includes(filter);
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  $: totalStudents = students.length;
  $: alertCount = students.filter(s => s.needsAlert).length;
  $: avgProgress = Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length);

  function getBadgeClass(level) {
    if (level === 'En Inicio') return 'badge-inicio';
    if (level === 'En Proceso') return 'badge-proceso';
    return 'badge-satisfactorio';
  }

  function exportReport() {
    const csv = 'Nombre,Nivel,Progreso,Última sesión\n' +
      students.map(s => `${s.name},${s.level},${s.progress}%,${s.lastSession}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'reporte-estudiantes.csv'; a.click();
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
      <button class="btn-primary" onclick={exportReport}>
        📊 Exportar reporte
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--primary-light); color: var(--primary);">👥</div>
        <div>
          <div class="stat-value">{totalStudents}</div>
          <div class="stat-label">Estudiantes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--error-bg); color: var(--error);">⚠️</div>
        <div>
          <div class="stat-value">{alertCount}</div>
          <div class="stat-label">Alertas activas</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--success-bg); color: var(--success);">📈</div>
        <div>
          <div class="stat-value">{avgProgress}%</div>
          <div class="stat-label">Promedio general</div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filters-bar">
      <div class="filter-group">
        {#each ['todos', 'inicio', 'proceso', 'satisfactorio'] as f}
          <button
            class="filter-btn"
            class:active={filter === f}
            onclick={() => filter = f}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        {/each}
      </div>
      <input
        type="text"
        class="search-input"
        placeholder="🔍 Buscar estudiante..."
        bind:value={searchTerm}
      />
    </div>

    <!-- Tabla -->
    <div class="card table-card">
      <table>
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Nivel actual</th>
            <th>Progreso</th>
            <th>Última sesión</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredStudents as student (student.id)}
            <tr>
              <td>
                <div class="student-cell">
                  <div class="student-avatar">{student.name.charAt(0)}</div>
                  <span>{student.name}</span>
                </div>
              </td>
              <td>
                <span class="badge {getBadgeClass(student.level)}">{student.level}</span>
              </td>
              <td>
                <div class="progress-cell">
                  <div class="mini-progress">
                    <div style="width: {student.progress}%"></div>
                  </div>
                  <span>{student.progress}%</span>
                </div>
              </td>
              <td class="text-muted">{student.lastSession}</td>
              <td>
                {#if student.needsAlert}
                  <span class="status status-alert">⚠️ Requiere atención</span>
                {:else}
                  <span class="status status-ok">✓ Al día</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      {#if filteredStudents.length === 0}
        <div class="empty-state">
          <p>No se encontraron estudiantes con ese criterio.</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .page-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 32px; gap: 20px; flex-wrap: wrap;
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
  .stat-value { font-size: 26px; font-weight: 750; color: var(--text); line-height: 1.1; }
  .stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

  /* Filtros */
  .filters-bar {
    display: flex; justify-content: space-between; align-items: center;
    gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
  }
  .filter-group { display: flex; gap: 8px; flex-wrap: wrap; }
  .filter-btn {
    padding: 8px 16px; border: 1px solid var(--border); border-radius: 20px;
    background: var(--surface); color: var(--text-secondary);
    font-family: inherit; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s ease;
  }
  .filter-btn:hover { border-color: var(--primary); color: var(--primary); }
  .filter-btn.active {
    background: var(--primary); color: white; border-color: var(--primary);
  }
  .search-input {
    padding: 10px 16px; border: 1px solid var(--border); border-radius: 20px;
    font-family: inherit; font-size: 13px; outline: none;
    background: var(--surface); min-width: 240px;
  }
  .search-input:focus { border-color: var(--primary); }

  /* Tabla */
  .table-card { padding: 0; overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  th {
    text-align: left; padding: 16px 20px;
    background: var(--background); color: var(--text-secondary);
    font-size: 12px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.5px; border-bottom: 1px solid var(--border);
  }
  td {
    padding: 16px 20px; border-bottom: 1px solid var(--border);
    font-size: 14px; color: var(--text);
  }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--background); }

  .student-cell { display: flex; align-items: center; gap: 12px; }
  .student-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: var(--primary-light); color: var(--primary);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px;
  }

  .progress-cell { display: flex; align-items: center; gap: 10px; }
  .mini-progress {
    width: 80px; height: 6px; background: var(--border);
    border-radius: 3px; overflow: hidden;
  }
  .mini-progress div {
    height: 100%; background: var(--primary);
    border-radius: 3px; transition: width 0.3s;
  }

  .status {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600;
  }
  .status-ok { color: var(--success); }
  .status-alert { color: var(--error); }

  .text-muted { color: var(--text-muted); font-size: 13px; }

  .empty-state {
    padding: 60px; text-align: center; color: var(--text-muted);
    font-size: 14px;
  }

  @media (max-width: 900px) {
    .stats-grid { grid-template-columns: 1fr; }
    .table-card { overflow-x: auto; }
    table { min-width: 700px; }
  }
</style>