const API_URL = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// ============================
// AUTENTICACIÓN
// ============================
export async function login(username, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) throw new Error('Credenciales inválidas');
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
}

// ============================
// TEXTOS
// ============================
export async function getTextByLevel(level) {
  const response = await fetch(`${API_URL}/texts/level/${encodeURIComponent(level)}`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('No se pudo obtener el texto');
  return response.json();
}

export async function getSimplifiedText(textId) {
  const response = await fetch(`${API_URL}/texts/${textId}/simplified`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('No se pudo obtener el texto simplificado');
  return response.json();
}

export async function getAllTexts() {
  const response = await fetch(`${API_URL}/texts/`, { headers: authHeaders() });
  if (!response.ok) throw new Error('No se pudieron obtener los textos');
  return response.json();
}

// ============================
// QUIZZES
// ============================
export async function submitQuiz(textId, answers, studentId = 1) {
  const response = await fetch(`${API_URL}/quizzes/${textId}/submit?student_id=${studentId}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ answers })
  });
  if (!response.ok) throw new Error('Error al enviar el quiz');
  return response.json();
}

// ============================
// ESTUDIANTES
// ============================
export async function getStudentProgress(studentId) {
  const response = await fetch(`${API_URL}/students/${studentId}/progress`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('No se pudo obtener el progreso');
  return response.json();
}

export async function getStudentDetail(studentId) {
  const response = await fetch(`${API_URL}/students/${studentId}/detail`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('No se pudo obtener el detalle');
  return response.json();
}

export async function getAllStudents() {
  const response = await fetch(`${API_URL}/students/all`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('No se pudieron obtener los estudiantes');
  return response.json();
}

// ============================
// PADRES
// ============================
export async function getParentSummary() {
  const response = await fetch(`${API_URL}/parents/summary`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('No se pudo obtener el resumen');
  return response.json();
}

// ============================
// REPORTES
// ============================
export function downloadClassReport() {
  const token = getToken();
  const url = `${API_URL}/reports/class/csv`;
  fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
    .then(res => res.blob())
    .then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `reporte_clase_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    });
}

export function downloadStudentReport(studentId, studentName) {
  const token = getToken();
  const url = `${API_URL}/reports/student/${studentId}/csv`;
  fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
    .then(res => res.blob())
    .then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `reporte_${studentName.replace(/\s+/g, '_')}.csv`;
      a.click();
    });
}

// ============================
// SINCRONIZACIÓN OFFLINE
// ============================
export async function syncPendingEvents(events) {
  const response = await fetch(`${API_URL}/sync/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ events })
  });
  if (!response.ok) throw new Error('Error al sincronizar');
  return response.json();
}
// ============================
// DATOS COMPLETOS PARA PDF
// ============================
export async function getStudentDetailForPDF(studentId) {
  const response = await fetch(`${API_URL}/students/${studentId}/detail`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('No se pudo obtener el detalle');
  return response.json();
}

export async function getAllStudentsForPDF() {
  const response = await fetch(`${API_URL}/students/all`, {
    headers: authHeaders()
  });
  if (!response.ok) throw new Error('No se pudieron obtener los estudiantes');
  return response.json();
}