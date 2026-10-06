const API_URL = 'http://localhost:8000/api';

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

export async function getTextByLevel(level) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/texts/level/${level}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

export async function submitQuiz(quizId, answers) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/quizzes/${quizId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ answers })
  });
  return response.json();
}

export async function getStudentProgress(studentId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/students/${studentId}/progress`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}