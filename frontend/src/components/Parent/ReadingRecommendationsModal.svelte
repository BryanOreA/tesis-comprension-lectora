<script>
  import Icon from '../Icon.svelte';

  export let currentLevel = 'En Inicio';
  export let onClose = () => {};

  // Catálogo de recomendaciones según el nivel
  const RECOMMENDATIONS = {
    'En Inicio': {
      title: 'Textos cortos y sencillos',
      description: 'Empieza con historias breves, con vocabulario simple y oraciones cortas. Ideal para ganar confianza.',
      books: [
        { title: 'El Gato y el Ratón', genre: 'Fábula', duration: '5 min', icon: 'book' },
        { title: 'La Hormiga Trabajadora', genre: 'Cuento corto', duration: '4 min', icon: 'book' },
        { title: 'El Perro y su Reflejo', genre: 'Fábula', duration: '3 min', icon: 'book' },
        { title: 'Los Tres Cerditos', genre: 'Cuento clásico', duration: '6 min', icon: 'book-marked' }
      ],
      tips: [
        'Lee con él en voz alta para modelar la entonación.',
        'Pídele que señale las palabras que no entienda.',
        'Conversa sobre los personajes después de leer.'
      ]
    },
    'En Proceso': {
      title: 'Textos con trama y personajes',
      description: 'Avanza a historias con más personajes y situaciones que requieran inferencias simples.',
      books: [
        { title: 'El Zorro y el Cuervo', genre: 'Fábula', duration: '7 min', icon: 'book' },
        { title: 'Caperucita Roja', genre: 'Cuento clásico', duration: '8 min', icon: 'book' },
        { title: 'El León y el Ratón', genre: 'Fábula', duration: '6 min', icon: 'book' },
        { title: 'La Tortuga y la Liebre', genre: 'Fábula', duration: '9 min', icon: 'book-marked' }
      ],
      tips: [
        'Anímalo a predecir lo que pasará antes de terminar.',
        'Pídele que cuente la historia con sus propias palabras.',
        'Hablen sobre las emociones de los personajes.'
      ]
    },
    'Satisfactorio': {
      title: 'Textos largos y variados',
      description: 'Retos más grandes: historias con múltiples capítulos, diferentes géneros y temas complejos.',
      books: [
        { title: 'El Principito (adaptado)', genre: 'Novela corta', duration: '20 min', icon: 'book-marked' },
        { title: 'Mitos Griegos para Niños', genre: 'Mitos', duration: '15 min', icon: 'book' },
        { title: 'Cuentos de la Selva', genre: 'Cuento', duration: '18 min', icon: 'book' },
        { title: 'Aventuras de Tom Sawyer', genre: 'Novela', duration: '25 min', icon: 'book-marked' }
      ],
      tips: [
        'Anímalo a opinar sobre lo que lee y justificar sus ideas.',
        'Sugiere leer artículos de interés real (deportes, ciencia).',
        'Conversen sobre la relación entre el texto y su vida diaria.'
      ]
    }
  };

  $: rec = RECOMMENDATIONS[currentLevel] || RECOMMENDATIONS['En Inicio'];

  function getLevelColor(level) {
    if (level === 'En Inicio') return '#D9534F';
    if (level === 'En Proceso') return '#E65100';
    return '#27AE60';
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }
</script>

<div class="modal-backdrop" onclick={handleBackdrop} role="presentation">
  <div class="modal" role="dialog" aria-modal="true">
    <div class="modal-header">
      <div>
        <span class="modal-tag">RECOMENDACIONES DE LECTURA</span>
        <h2>{rec.title}</h2>
        <p class="modal-desc">{rec.description}</p>
      </div>
      <button class="btn-close" onclick={onClose} aria-label="Cerrar">
        <Icon name="x" size={20} />
      </button>
    </div>

    <!-- Nivel actual -->
    <div class="level-badge">
      <span class="level-dot" style="background: {getLevelColor(currentLevel)};"></span>
      <span>Nivel actual: <strong>{currentLevel}</strong></span>
    </div>

    <!-- Textos sugeridos -->
    <div class="section">
      <h3 class="section-title">
        <Icon name="books" size={16} />
        Textos sugeridos
      </h3>
      <div class="books-list">
        {#each rec.books as book}
          <div class="book-item">
            <div class="book-icon">
              <Icon name={book.icon} size={20} />
            </div>
            <div class="book-info">
              <div class="book-title">{book.title}</div>
              <div class="book-meta">
                <span>{book.genre}</span>
                <span class="dot"></span>
                <span>{book.duration}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Consejos -->
    <div class="section">
      <h3 class="section-title">
        <Icon name="lightbulb" size={16} />
        Consejos para acompañarlo
      </h3>
      <ul class="tips-list">
        {#each rec.tips as tip}
          <li>
            <Icon name="check-circle" size={16} color="#27AE60" />
            <span>{tip}</span>
          </li>
        {/each}
      </ul>
    </div>

    <div class="modal-footer">
      <button class="btn-primary" onclick={onClose}>Entendido</button>
    </div>
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
    margin-bottom: 20px;
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
    font-size: 20px;
    font-weight: 750;
    color: #183B4E;
    letter-spacing: -0.3px;
  }

  .modal-desc {
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

  .level-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: #F7FAFC;
    border-radius: 20px;
    font-size: 12px;
    color: #667985;
    margin-bottom: 24px;
  }

  .level-badge strong {
    color: #183B4E;
  }

  .level-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .section {
    margin-bottom: 24px;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 12px;
    font-size: 13px;
    font-weight: 800;
    color: #183B4E;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .books-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .book-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #F7FAFC;
    border-radius: 10px;
    transition: all 0.2s;
  }

  .book-item:hover {
    background: #EAF4F6;
    transform: translateX(3px);
  }

  .book-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: white;
    color: #176B87;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .book-info {
    flex: 1;
    min-width: 0;
  }

  .book-title {
    font-size: 13px;
    font-weight: 700;
    color: #183B4E;
    margin-bottom: 2px;
  }

  .book-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #96A5AE;
    font-weight: 600;
  }

  .dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #96A5AE;
  }

  .tips-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .tips-list li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    background: #E8F5E9;
    border-radius: 10px;
    font-size: 13px;
    line-height: 1.5;
    color: #183B4E;
  }

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

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
</style>