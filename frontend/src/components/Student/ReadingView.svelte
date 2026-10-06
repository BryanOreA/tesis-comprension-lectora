<script>
  import { onMount } from 'svelte';
  import Navbar from '../Navbar.svelte';
  import { progress } from '../../stores/progress.js';

  const useMock = true;

  const mockText = {
    id: 1,
    title: 'El Zorro y el Cuervo',
    level: 'En Proceso',
    content: `Un zorro muy astuto vio a un cuervo posado en una rama con un pedazo de queso en el pico. El zorro, hambriento, decidió usar su ingenio para conseguir el queso. Se acercó lentamente y comenzó a halagar al cuervo: "¡Qué plumaje tan hermoso tienes! Sin duda tu voz debe ser tan bella como tu apariencia". El cuervo, halagado, abrió el pico para cantar, y el queso cayó directamente a la boca del zorro, que se lo llevó sin perder tiempo.`,
    questions: [
      { id: 1, question: '¿Qué animal tenía el queso?', options: ['El zorro', 'El cuervo', 'El perro', 'El gato'], correctAnswer: 1 },
      { id: 2, question: '¿Qué quería el zorro?', options: ['Dormir', 'El queso', 'Volar', 'Cantar'], correctAnswer: 1 },
      { id: 3, question: '¿Cómo era el zorro?', options: ['Tonto', 'Astuto', 'Perezoso', 'Tímido'], correctAnswer: 1 }
    ]
  };

  let text = null;
  let questions = [];
  let currentQuestion = 0;
  let answers = [];
  let showResults = false;
  let score = 0;
  let selectedAnswer = null;
  let loading = true;
  let questionStartTime = Date.now();
  let feedback = null;

  onMount(() => {
    text = mockText;
    questions = mockText.questions;
    loading = false;
  });

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
      timeSpent: Date.now() - questionStartTime
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

  function finishQuiz() {
    score = answers.filter((a, i) => a.answer === questions[i].correctAnswer).length;
    $progress.points += score * 10;
    if ($progress.points >= 800) $progress.level = 'Satisfactorio';
    else if ($progress.points >= 300) $progress.level = 'En Proceso';
    showResults = true;
  }

  function restart() {
    currentQuestion = 0;
    answers = [];
    selectedAnswer = null;
    showResults = false;
    feedback = null;
    questionStartTime = Date.now();
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
    {:else if showResults}
      <!-- RESULTADOS -->
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

          <button class="btn-primary" onclick={restart}>Leer otro texto</button>
        </div>
      </div>
    {:else if text}
      <!-- LECTURA Y QUIZ -->
      <div class="reading-layout">
        <!-- Panel izquierdo: Progreso y stats -->
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
              <div class="badge-item unlocked" title="Lector Principiante">📖</div>
              <div class="badge-item" title="Detective de Inferencias">🔍</div>
              <div class="badge-item" title="Maestro de la Comprensión">🏆</div>
            </div>
          </div>
        </aside>

        <!-- Panel principal: Lectura -->
        <main class="reading-main">
          <div class="reading-header">
            <span class="reading-tag">LECTURA ADAPTATIVA</span>
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
              disabled={selectedAnswer === null || !!feedback}
              onclick={handleAnswer}
            >
              {currentQuestion < questions.length - 1 ? 'Siguiente pregunta' : 'Finalizar quiz'}
            </button>
          </div>
        </main>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Estados generales */
  .loading-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 80px; gap: 16px;
    color: var(--text-secondary);
  }
  .spinner {
    width: 40px; height: 40px;
    border: 3px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%; animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Layout de lectura */
  .reading-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 24px;
    align-items: start;
  }

  /* Sidebar */
  .sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 24px; }
  .progress-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 12px; font-size: 13px; color: var(--text-secondary);
  }
  .progress-header strong { color: var(--primary); font-size: 15px; }
  .progress-bar {
    height: 8px; background: var(--border); border-radius: 4px; overflow: hidden;
  }
  .progress-fill {
    height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary));
    border-radius: 4px; transition: width 0.4s ease;
  }
  .progress-hint { font-size: 12px; color: var(--text-muted); margin: 12px 0 0; }

  .level-card { text-align: center; }
  .level-badge {
    display: inline-block; padding: 8px 20px;
    background: var(--primary-light); color: var(--primary);
    border-radius: 20px; font-weight: 700; font-size: 14px;
  }
  .level-label { font-size: 12px; color: var(--text-muted); margin: 8px 0 0; }

  .badges-card h4 {
    margin: 0 0 12px; font-size: 13px; color: var(--text-secondary);
    text-transform: uppercase; letter-spacing: 1px;
  }
  .badges-grid { display: flex; gap: 8px; }
  .badge-item {
    width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
    background: var(--background); border-radius: 10px; font-size: 20px;
    opacity: 0.4; filter: grayscale(1); transition: all 0.2s;
  }
  .badge-item.unlocked { opacity: 1; filter: none; background: var(--accent-light); }

  /* Main de lectura */
  .reading-main {
    background: var(--surface); border-radius: var(--radius);
    padding: 40px; box-shadow: var(--shadow-sm); border: 1px solid var(--border);
  }
  .reading-header { margin-bottom: 32px; }
  .reading-tag {
    font-size: 11px; font-weight: 800; letter-spacing: 2px;
    color: var(--primary); display: block; margin-bottom: 8px;
  }
  .reading-header h1 {
    font-size: 32px; font-weight: 750; color: var(--text);
    margin: 0 0 12px; letter-spacing: -0.5px;
  }
  .reading-level {
    display: inline-block; padding: 4px 12px;
    background: var(--secondary-light); color: var(--secondary);
    border-radius: 20px; font-size: 12px; font-weight: 650;
  }
  .reading-text p {
    font-size: 18px; line-height: 1.9; color: var(--text);
    margin: 0 0 40px;
  }

  /* Quiz */
  .quiz-section {
    border-top: 1px solid var(--border); padding-top: 32px;
  }
  .quiz-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 20px;
  }
  .quiz-counter { font-size: 13px; color: var(--text-secondary); font-weight: 600; }
  .quiz-dots { display: flex; gap: 6px; }
  .dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--border); transition: all 0.3s;
  }
  .dot.active { background: var(--primary); transform: scale(1.3); }
  .dot.done { background: var(--secondary); }

  .question-text {
    font-size: 20px; font-weight: 650; color: var(--text); margin: 0 0 24px;
  }

  .options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
  .option {
    display: flex; align-items: center; gap: 16px;
    padding: 16px 20px; border: 2px solid var(--border);
    border-radius: var(--radius); background: var(--surface);
    font-family: inherit; font-size: 15px; color: var(--text);
    cursor: pointer; text-align: left; transition: all 0.2s ease;
  }
  .option:hover:not(:disabled) { border-color: var(--primary); background: var(--primary-light); }
  .option.selected { border-color: var(--primary); background: var(--primary-light); }
  .option.correct { border-color: var(--success); background: var(--success-bg); }
  .option.incorrect { border-color: var(--error); background: var(--error-bg); }
  .option:disabled { cursor: default; }

  .option-letter {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--background); color: var(--text-secondary);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px; flex-shrink: 0;
  }
  .option.selected .option-letter { background: var(--primary); color: white; }
  .option.correct .option-letter { background: var(--success); color: white; }
  .option.incorrect .option-letter { background: var(--error); color: white; }

  .feedback {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 18px; border-radius: var(--radius); margin-bottom: 20px;
    font-size: 14px; animation: fadeIn 0.2s ease;
  }
  .feedback-correct { background: var(--success-bg); color: var(--success); }
  .feedback-wrong { background: var(--error-bg); color: var(--error); }
  .feedback-icon { font-weight: 800; font-size: 18px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

  .btn-submit { width: 100%; }

  /* Resultados */
  .results-wrapper {
    display: flex; justify-content: center; padding: 40px 0;
  }
  .results-card {
    background: var(--surface); border-radius: var(--radius-lg);
    padding: 48px; box-shadow: var(--shadow-lg); border: 1px solid var(--border);
    text-align: center; max-width: 560px; width: 100%;
  }
  .celebration-icon { font-size: 56px; margin-bottom: 12px; }
  .results-card h2 {
    font-size: 28px; font-weight: 750; color: var(--text); margin: 0 0 8px;
  }
  .results-subtitle { color: var(--text-secondary); font-size: 14px; margin: 0 0 32px; }

  .score-display { margin-bottom: 32px; }
  .score-circle {
    width: 130px; height: 130px; border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white; display: flex; align-items: baseline; justify-content: center;
    margin: 0 auto 12px; padding-top: 42px;
    box-shadow: 0 10px 30px rgba(23,107,135,0.25);
  }
  .score-number { font-size: 42px; font-weight: 800; }
  .score-total { font-size: 18px; opacity: 0.8; margin-left: 4px; }
  .score-label { color: var(--text-secondary); font-size: 14px; margin: 0; }

  .stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 12px; margin-bottom: 32px;
  }
  .stat {
    background: var(--background); padding: 16px 12px; border-radius: var(--radius);
  }
  .stat-value {
    display: block; font-size: 18px; font-weight: 750; color: var(--primary); margin-bottom: 4px;
  }
  .stat-label { font-size: 11px; color: var(--text-muted); }

  @media (max-width: 900px) {
    .reading-layout { grid-template-columns: 1fr; }
    .sidebar { position: static; flex-direction: row; flex-wrap: wrap; }
    .sidebar > * { flex: 1; min-width: 140px; }
    .reading-main { padding: 24px; }
    .reading-header h1 { font-size: 24px; }
    .reading-text p { font-size: 16px; }
  }
</style>