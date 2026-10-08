<script>
  import { onMount } from 'svelte';
  import Navbar from '../Navbar.svelte';
  import Icon from '../Icon.svelte';
  import AchievementToast from './AchievementToast.svelte';
  import SimplificationModal from './SimplificationModal.svelte';
  import { getTextByLevel, submitQuiz } from '../../lib/api.js';
  import { queueEvent } from '../../lib/offline.js';
  import { progress } from '../../stores/progress.js';
  import { user } from '../../stores/user.js';
  import { updateStatsAfterQuiz } from '../../lib/achievements.js';
  import { registerDailyProgress } from '../../lib/challenges.js';

  export let onBack = () => {};

  let text = null;
  let questions = [];
  let currentQuestion = 0;
  let answers = [];
  let showResults = false;
  let score = 0;
  let selectedAnswer = null;
  let loading = true;
  let error = '';
  let questionStartTime = Date.now();
  let feedback = null;
  let submitting = false;
  let newAchievements = [];
  let currentAchievement = null;
  let showSimplification = false;

  onMount(async () => {
    await loadText();
  });

  async function loadText() {
    loading = true;
    error = '';
    try {
      text = await getTextByLevel($progress.level);
      questions = text.questions;
      currentQuestion = 0;
      answers = [];
      selectedAnswer = null;
      showResults = false;
      questionStartTime = Date.now();
    } catch (e) {
      error = 'No se pudo cargar el texto. ¿Estás conectado?';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  $: progressPercent = Math.min(($progress.points / 1500) * 100, 100);

  function handleAnswer() {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    feedback = {
      correct: isCorrect,
      message: isCorrect
        ? '¡Excelente! Has comprendido bien el texto.'
        : `La respuesta correcta era: "${questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}"`
    };

    answers.push({
      questionId: questions[currentQuestion].id,
      answer: selectedAnswer,
      timeSpent: (Date.now() - questionStartTime) / 1000
    });

    setTimeout(() => {
      feedback = null;
      if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        selectedAnswer = null;
        questionStartTime = Date.now();
      } else {
        finishQuiz();
      }
    }, 1800);
  }

  async function finishQuiz() {
    submitting = true;
    const totalTime = answers.reduce((acc, a) => acc + (a.timeSpent || 0), 0);

    try {
      const result = await submitQuiz(text.id, answers, $user.id);
      score = result.score;
      $progress.points += result.points;
      $progress.level = result.newLevel;

      const unlocked = updateStatsAfterQuiz({
        score: result.score,
        total: result.total,
        points: result.points,
        newLevel: result.newLevel
      });

      if (unlocked.length > 0) {
        newAchievements = unlocked;
        showAchievements();
      }

      // Registrar progreso del reto diario
      registerDailyProgress({
        score: result.score,
        total: result.total,
        timeSpent: totalTime
      });
    } catch (e) {
      console.warn('Sin conexión, guardando en cola offline');
      await queueEvent({
        type: 'quiz_submit',
        textId: text.id,
        answers,
        studentId: $user.id
      });
      score = answers.filter((a, i) => a.answer === questions[i].correctAnswer).length;
      $progress.points += score * 10;

      const unlocked = updateStatsAfterQuiz({
        score,
        total: questions.length,
        points: score * 10,
        newLevel: $progress.level
      });

      if (unlocked.length > 0) {
        newAchievements = unlocked;
        showAchievements();
      }

      registerDailyProgress({
        score: score,
        total: questions.length,
        timeSpent: totalTime
      });
    } finally {
      submitting = false;
      showResults = true;
    }
  }

  async function showAchievements() {
    for (const ach of newAchievements) {
      currentAchievement = ach;
      await new Promise(r => setTimeout(r, 3000));
      currentAchievement = null;
      await new Promise(r => setTimeout(r, 300));
    }
    newAchievements = [];
  }
</script>

<div class="app-container">
  <Navbar />

  <div class="page-content">
    {#if loading}
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Cargando tu texto adaptado...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <Icon name="alert-triangle" size={32} color="var(--error)" />
        <p>{error}</p>
        <button class="btn-primary" onclick={loadText}>Reintentar</button>
      </div>
    {:else if showResults}
      <div class="results-wrapper">
        <div class="results-card">
          <div class="celebration-icon">🎉</div>
          <h2>¡Quiz completado!</h2>
          <p class="results-subtitle">Has terminado la lectura y respondido las preguntas.</p>

          <div class="score-display">
            <div class="score-circle">
              <span class="score-number">{score}</span>
              <span class="score-total">/ {questions.length}</span>
            </div>
            <p class="score-label">Respuestas correctas</p>
          </div>

          <div class="stats-row">
            <div class="stat">
              <span class="stat-value">+{score * 10}</span>
              <span class="stat-label">Puntos ganados</span>
            </div>
            <div class="stat">
              <span class="stat-value">{$progress.points}</span>
              <span class="stat-label">Puntos totales</span>
            </div>
            <div class="stat">
              <span class="stat-value">{$progress.level}</span>
              <span class="stat-label">Nivel actual</span>
            </div>
          </div>

          <div class="results-actions">
            <button class="btn-primary" onclick={onBack}>Volver al inicio</button>
            <button class="btn-secondary" onclick={loadText}>Leer otro texto</button>
          </div>
        </div>
      </div>
    {:else if text}
      <button class="btn-back" onclick={onBack}>← Volver al inicio</button>

      <div class="reading-layout">
        <aside class="sidebar">
          <div class="card progress-card">
            <div class="progress-header">
              <span>Tu progreso</span>
              <strong>{Math.round(progressPercent)}%</strong>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: {progressPercent}%"></div>
            </div>
            <p class="progress-hint">Sigue leyendo para subir de nivel</p>
          </div>

          <div class="card level-card">
            <div class="level-badge">{$progress.level}</div>
            <p class="level-label">Nivel actual</p>
          </div>

          <div class="card badges-card">
            <h4>Insignias</h4>
            <div class="badges-grid">
              <div class="badge-item unlocked">
                <Icon name="book-open" size={22} />
              </div>
              <div class="badge-item">
                <Icon name="target" size={22} />
              </div>
              <div class="badge-item">
                <Icon name="trophy" size={22} />
              </div>
            </div>
          </div>
        </aside>

        <main class="reading-main">
          <div class="reading-header">
            <div class="reading-header-top">
              <span class="reading-tag">LECTURA ADAPTATIVA</span>
              <button class="btn-simplification" onclick={() => showSimplification = true}>
                <Icon name="sparkles-2" size={14} />
                <span>Ver simplificación</span>
              </button>
            </div>
            <h1>{text.title}</h1>
            <span class="reading-level">{text.level}</span>
          </div>

          <div class="reading-text">
            <p>{text.content}</p>
          </div>

          <div class="quiz-section">
            <div class="quiz-header">
              <span class="quiz-counter">
                Pregunta {currentQuestion + 1} de {questions.length}
              </span>
              <div class="quiz-dots">
                {#each questions as _, i}
                  <span class="dot" class:active={i === currentQuestion} class:done={i < currentQuestion}></span>
                {/each}
              </div>
            </div>

            <h3 class="question-text">{questions[currentQuestion].question}</h3>

            <div class="options">
              {#each questions[currentQuestion].options as option, i}
                <button
                  class="option"
                  class:selected={selectedAnswer === i}
                  class:correct={feedback && i === questions[currentQuestion].correctAnswer}
                  class:incorrect={feedback && selectedAnswer === i && i !== questions[currentQuestion].correctAnswer}
                  onclick={() => !feedback && (selectedAnswer = i)}
                  disabled={!!feedback}
                >
                  <span class="option-letter">{String.fromCharCode(65 + i)}</span>
                  <span class="option-text">{option}</span>
                </button>
              {/each}
            </div>

            {#if feedback}
              <div class="feedback" class:feedback-correct={feedback.correct} class:feedback-wrong={!feedback.correct}>
                <span class="feedback-icon">{feedback.correct ? '✓' : '✗'}</span>
                <span>{feedback.message}</span>
              </div>
            {/if}

            <button
              class="btn-primary btn-submit"
              disabled={selectedAnswer === null || !!feedback || submitting}
              onclick={handleAnswer}
            >
              {submitting ? 'Enviando...' : (currentQuestion < questions.length - 1 ? 'Siguiente pregunta' : 'Finalizar quiz')}
            </button>
          </div>
        </main>
      </div>
    {/if}
  </div>
</div>

{#if showSimplification && text}
  <SimplificationModal textId={text.id} onClose={() => showSimplification = false} />
{/if}

<AchievementToast achievement={currentAchievement} />

<style>
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px;
    gap: 16px;
    color: var(--text-secondary);
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-state {
    text-align: center;
    padding: 60px 20px;
    background: var(--error-bg);
    border-radius: var(--radius);
    color: var(--error);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .btn-back {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    padding: 6px 0;
    margin-bottom: 16px;
    transition: color 0.2s;
  }

  .btn-back:hover {
    color: var(--primary);
  }

  .reading-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24px;
    align-items: start;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: sticky;
    top: 24px;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .progress-header strong {
    color: var(--primary);
    font-size: 15px;
  }

  .progress-bar {
    height: 8px;
    background: var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    border-radius: 4px;
    transition: width 0.4s ease;
  }

  .progress-hint {
    font-size: 12px;
    color: var(--text-muted);
    margin: 12px 0 0;
  }

  .level-card {
    text-align: center;
  }

  .level-badge {
    display: inline-block;
    padding: 8px 20px;
    background: var(--primary-light);
    color: var(--primary);
    border-radius: 20px;
    font-weight: 700;
    font-size: 14px;
  }

  .level-label {
    font-size: 12px;
    color: var(--text-muted);
    margin: 8px 0 0;
  }

  .badges-card h4 {
    margin: 0 0 12px;
    font-size: 13px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .badges-grid {
    display: flex;
    gap: 8px;
  }

  .badge-item {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--background);
    border-radius: 10px;
    color: var(--text-muted);
    opacity: 0.4;
    filter: grayscale(1);
    transition: all 0.2s;
  }

  .badge-item.unlocked {
    opacity: 1;
    filter: none;
    background: var(--accent-light);
    color: #B8860B;
  }

  .reading-main {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 40px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border);
  }

  .reading-header {
    margin-bottom: 32px;
  }

  .reading-header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    gap: 16px;
  }

  .reading-tag {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
    color: var(--primary);
    display: block;
  }

  .btn-simplification {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: var(--primary-light);
    color: var(--primary);
    border: 1px solid var(--primary);
    border-radius: 20px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    opacity: 0.9;
  }

  .btn-simplification:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-1px);
    opacity: 1;
  }

  .reading-header h1 {
    font-size: 32px;
    font-weight: 750;
    color: var(--text);
    margin: 0 0 12px;
    letter-spacing: -0.5px;
  }

  .reading-level {
    display: inline-block;
    padding: 4px 12px;
    background: var(--secondary-light);
    color: var(--secondary);
    border-radius: 20px;
    font-size: 12px;
    font-weight: 650;
  }

  .reading-text p {
    font-size: 18px;
    line-height: 1.9;
    color: var(--text);
    margin: 0 0 40px;
  }

  .quiz-section {
    border-top: 1px solid var(--border);
    padding-top: 32px;
  }

  .quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .quiz-counter {
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 600;
  }

  .quiz-dots {
    display: flex;
    gap: 6px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--border);
    transition: all 0.3s;
  }

  .dot.active {
    background: var(--primary);
    transform: scale(1.3);
  }

  .dot.done {
    background: var(--secondary);
  }

  .question-text {
    font-size: 20px;
    font-weight: 650;
    color: var(--text);
    margin: 0 0 24px;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border: 2px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    font-family: inherit;
    font-size: 15px;
    color: var(--text);
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
  }

  .option:hover:not(:disabled) {
    border-color: var(--primary);
    background: var(--primary-light);
  }

  .option.selected {
    border-color: var(--primary);
    background: var(--primary-light);
  }

  .option.correct {
    border-color: var(--success);
    background: var(--success-bg);
  }

  .option.incorrect {
    border-color: var(--error);
    background: var(--error-bg);
  }

  .option:disabled {
    cursor: default;
  }

  .option-letter {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--background);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
  }

  .option.selected .option-letter {
    background: var(--primary);
    color: white;
  }

  .option.correct .option-letter {
    background: var(--success);
    color: white;
  }

  .option.incorrect .option-letter {
    background: var(--error);
    color: white;
  }

  .feedback {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    border-radius: var(--radius);
    margin-bottom: 20px;
    font-size: 14px;
    animation: fadeIn 0.2s ease;
  }

  .feedback-correct {
    background: var(--success-bg);
    color: var(--success);
  }

  .feedback-wrong {
    background: var(--error-bg);
    color: var(--error);
  }

  .feedback-icon {
    font-weight: 800;
    font-size: 18px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .btn-submit {
    width: 100%;
  }

  .results-wrapper {
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }

  .results-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    padding: 48px;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border);
    text-align: center;
    max-width: 560px;
    width: 100%;
  }

  .celebration-icon {
    font-size: 56px;
    margin-bottom: 12px;
  }

  .results-card h2 {
    font-size: 28px;
    font-weight: 750;
    color: var(--text);
    margin: 0 0 8px;
  }

  .results-subtitle {
    color: var(--text-secondary);
    font-size: 14px;
    margin: 0 0 32px;
  }

  .score-display {
    margin-bottom: 32px;
  }

  .score-circle {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    display: flex;
    align-items: baseline;
    justify-content: center;
    margin: 0 auto 12px;
    padding-top: 42px;
    box-shadow: 0 10px 30px rgba(23, 107, 135, 0.25);
  }

  .score-number {
    font-size: 42px;
    font-weight: 800;
  }

  .score-total {
    font-size: 18px;
    opacity: 0.8;
    margin-left: 4px;
  }

  .score-label {
    color: var(--text-secondary);
    font-size: 14px;
    margin: 0;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 32px;
  }

  .stat {
    background: var(--background);
    padding: 16px 12px;
    border-radius: var(--radius);
  }

  .stat-value {
    display: block;
    font-size: 18px;
    font-weight: 750;
    color: var(--primary);
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 11px;
    color: var(--text-muted);
  }

  .results-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-secondary {
    padding: 12px 24px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface);
    color: var(--text-secondary);
    font-family: inherit;
    font-size: 14px;
    font-weight: 650;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-secondary:hover {
    background: var(--background);
    color: var(--primary);
    border-color: var(--primary);
  }

  @media (max-width: 900px) {
    .reading-layout {
      grid-template-columns: 1fr;
    }

    .sidebar {
      position: static;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .sidebar > * {
      flex: 1;
      min-width: 140px;
    }

    .reading-main {
      padding: 24px;
    }

    .reading-header h1 {
      font-size: 24px;
    }

    .reading-text p {
      font-size: 16px;
    }

    .reading-header-top {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  }
</style>