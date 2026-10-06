<script>
  import { login } from '../lib/api.js';
  import { user } from '../stores/user.js';

  let username = '';
  let password = '';
  let error = '';
  let loading = false;
  let showPassword = false;

  async function handleLogin(e) {
    e.preventDefault();

    if (loading) return;

    loading = true;
    error = '';

    try {
      const data = await login(username, password);
      user.set(data.user);
    } catch (err) {
      error = 'Usuario o contraseña incorrectos';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Iniciar sesión | Comprensión Lectora</title>
  <meta
    name="description"
    content="Accede a la Plataforma de Comprensión Lectora"
  />
</svelte:head>


<div class="login-page">

  <!-- =================================
       PANEL EDUCATIVO
       ================================= -->

  <section class="brand-panel">

    <div class="brand-content">

      <!-- Logo -->

      <div class="brand-logo">

        <svg
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M8 9.5C8 8.67 8.67 8 9.5 8H21c3.31 0 6 2.69 6 6v25c0-3.31-2.69-6-6-6H9.5C8.67 33 8 32.33 8 31.5v-22Z" />
          <path d="M40 9.5C40 8.67 39.33 8 38.5 8H27c-3.31 0-6 2.69-6 6v25c0-3.31 2.69-6 6-6h11.5c.83 0 1.5-.67 1.5-1.5v-22Z" />
          <path d="M27 14h6" />
          <path d="M27 19h7" />
        </svg>

      </div>


      <span class="brand-tag">
        PLATAFORMA EDUCATIVA
      </span>


      <h1>
        Leer es
        <span>descubrir.</span>
      </h1>


      <p>
        Fortalece tu comprensión lectora mediante
        actividades interactivas, retos y experiencias
        de aprendizaje adaptativas.
      </p>


      <!-- =================================
           TARJETA EDUCATIVA
           ================================= -->

      <div class="learning-card">

        <div class="learning-icon">

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M8.5 14.5A6 6 0 1 1 15.5 14.5c-.9.7-1.5 1.4-1.5 2.5h-4c0-1.1-.6-1.8-1.5-2.5Z" />
            <path d="M12 2v1" />
            <path d="m4.93 4.93.7.7" />
            <path d="M2 12h1" />
            <path d="m19.07 4.93-.7.7" />
            <path d="M22 12h-1" />
          </svg>

        </div>


        <div>

          <strong>
            Aprende a tu ritmo
          </strong>

          <span>
            Cada actividad es una nueva oportunidad
            para aprender y mejorar.
          </span>

        </div>

      </div>


      <!-- =================================
           ELEMENTOS DECORATIVOS
           ================================= -->

      <div class="book-decoration book-one">

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11a3 3 0 0 1 3 3v15a3 3 0 0 0-3-3H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
          <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H14" />
          <path d="M14 18a3 3 0 0 1 3-3h3v-9.5A2.5 2.5 0 0 0 17.5 3H14" />
        </svg>

      </div>


      <div class="book-decoration book-two">

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
        </svg>

      </div>


      <div class="circle-decoration circle-one"></div>
      <div class="circle-decoration circle-two"></div>

    </div>

  </section>


  <!-- =================================
       PANEL LOGIN
       ================================= -->

  <main class="form-panel">

    <div class="login-wrapper">

      <!-- Logo móvil -->

      <div class="mobile-logo">

        <div class="brand-logo">

          <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M8 9.5C8 8.67 8.67 8 9.5 8H21c3.31 0 6 2.69 6 6v25c0-3.31-2.69-6-6-6H9.5C8.67 33 8 32.33 8 31.5v-22Z" />
            <path d="M40 9.5C40 8.67 39.33 8 38.5 8H27c-3.31 0-6 2.69-6 6v25c0-3.31 2.69-6 6-6h11.5c.83 0 1.5-.67 1.5-1.5v-22Z" />
            <path d="M27 14h6" />
            <path d="M27 19h7" />
          </svg>

        </div>

      </div>


      <!-- Encabezado -->

      <header class="form-header">

        <span class="welcome-label">
          BIENVENIDO
        </span>

        <h2>
          Iniciar sesión
        </h2>

        <p>
          Ingresa tus datos para continuar aprendiendo.
        </p>

      </header>


      <!-- Formulario -->

      <form onsubmit={handleLogin}>

        <!-- Usuario -->

        <div class="field">

          <label for="username">
            Usuario
          </label>

          <div class="input-wrapper">

            <span class="input-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>

            </span>


            <input
              id="username"
              type="text"
              placeholder="Ingresa tu usuario"
              bind:value={username}
              autocomplete="username"
              required
              disabled={loading}
            />

          </div>

        </div>


        <!-- Contraseña -->

        <div class="field">

          <label for="password">
            Contraseña
          </label>

          <div class="input-wrapper">

            <span class="input-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="11"
                  rx="2"
                />

                <path d="M8 10V7a4 4 0 0 1 8 0v3" />

              </svg>

            </span>


            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña"
              bind:value={password}
              autocomplete="current-password"
              required
              disabled={loading}
            />


            <!-- Mostrar contraseña -->

            <button
              type="button"
              class="password-toggle"
              onclick={() => (showPassword = !showPassword)}
              aria-label={
                showPassword
                  ? 'Ocultar contraseña'
                  : 'Mostrar contraseña'
              }
              disabled={loading}
            >

              {#if showPassword}

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>

              {:else}

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.9 4.3A10.7 10.7 0 0 1 12 4c6.5 0 10 8 10 8" />
                  <path d="M6.1 6.1C3.5 8.2 2 12 2 12s3.5 8 10 8" />
                </svg>

              {/if}

            </button>

          </div>

        </div>


        <!-- Error -->

        {#if error}

          <div
            class="error-message"
            role="alert"
          >

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>

            <span>
              {error}
            </span>

          </div>

        {/if}


        <!-- Botón -->

        <button
          class="login-button"
          type="submit"
          disabled={loading || !username || !password}
        >

          {#if loading}

            <span class="spinner"></span>

            <span>
              Ingresando...
            </span>

          {:else}

            <span>
              Iniciar sesión
            </span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>

          {/if}

        </button>

      </form>


      <!-- Seguridad -->

      <div class="security-note">

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>

        <span>
          Tu información está protegida.
        </span>

      </div>


      <p class="copyright">
        Plataforma de Comprensión Lectora
      </p>

    </div>

  </main>

</div>


<style>

  /* ============================================
     SISTEMA DE DISEÑO
     ============================================ */

  :global(:root) {

    --primary: #176B87;
    --primary-dark: #12566D;

    --secondary: #2A9D8F;

    --accent: #F4C95D;

    --background: #F7FAFC;
    --surface: #FFFFFF;

    --text: #183B4E;
    --text-secondary: #667985;
    --text-muted: #96A5AE;

    --border: #DCE6EA;

    --error: #D9534F;
    --error-bg: #FFF4F3;

  }


  :global(*) {
    box-sizing: border-box;
  }


  :global(body) {

    margin: 0;

    font-family:
      Inter,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;

    color: var(--text);

    background:
      var(--background);

  }


  /* ============================================
     ESTRUCTURA
     ============================================ */

  .login-page {

    min-height: 100vh;

    display: grid;

    grid-template-columns:
      46% 54%;

    background:
      var(--surface);

  }


  /* ============================================
     PANEL IZQUIERDO
     ============================================ */

  .brand-panel {

    position: relative;

    display: flex;

    align-items: center;

    justify-content: center;

    overflow: hidden;

    padding: 60px;

    background:

      radial-gradient(
        circle at 85% 20%,
        rgba(42,157,143,0.25),
        transparent 30%
      ),

      linear-gradient(
        145deg,
        #12566D 0%,
        #176B87 55%,
        #1D7891 100%
      );

    color: white;

  }


  .brand-content {

    position: relative;

    z-index: 2;

    width: 100%;

    max-width: 510px;

  }


  /* ============================================
     LOGO
     ============================================ */

  .brand-logo {

    width: 64px;

    height: 64px;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 17px;

    background:
      white;

    color:
      var(--primary);

    box-shadow:
      0 10px 30px rgba(0,0,0,0.12);

    margin-bottom: 30px;

  }


  .brand-logo svg {

    width: 34px;

    height: 34px;

  }


  /* ============================================
     TEXTO PRINCIPAL
     ============================================ */

  .brand-tag {

    display: block;

    margin-bottom: 17px;

    font-size: 11px;

    font-weight: 800;

    letter-spacing: 2px;

    color:
      rgba(255,255,255,0.70);

  }


  .brand-panel h1 {

    margin: 0;

    max-width: 480px;

    font-size:
      clamp(44px, 4.2vw, 66px);

    line-height: 1.02;

    letter-spacing: -2.8px;

    font-weight: 800;

  }


  .brand-panel h1 span {

    display: block;

    color:
      var(--accent);

  }


  .brand-panel p {

    max-width: 445px;

    margin: 28px 0 0;

    font-size: 16px;

    line-height: 1.75;

    color:
      rgba(255,255,255,0.78);

  }


  /* ============================================
     TARJETA EDUCATIVA
     ============================================ */

  .learning-card {

    display: flex;

    align-items: center;

    gap: 15px;

    max-width: 400px;

    margin-top: 40px;

    padding: 16px;

    border-radius: 14px;

    background:
      rgba(255,255,255,0.09);

    border:
      1px solid rgba(255,255,255,0.14);

  }


  .learning-icon {

    width: 43px;

    height: 43px;

    flex-shrink: 0;

    display: flex;

    align-items: center;

    justify-content: center;

    border-radius: 11px;

    background:
      var(--accent);

    color:
      #5B4A19;

  }


  .learning-icon svg {

    width: 22px;

    height: 22px;

  }


  .learning-card strong {

    display: block;

    margin-bottom: 4px;

    font-size: 14px;

  }


  .learning-card span {

    display: block;

    font-size: 12px;

    line-height: 1.5;

    color:
      rgba(255,255,255,0.67);

  }


  /* ============================================
     DECORACIONES
     ============================================ */

  .circle-decoration {

    position: absolute;

    border:
      1px solid rgba(255,255,255,0.08);

    border-radius: 50%;

  }


  .circle-one {

    width: 430px;

    height: 430px;

    top: -200px;

    right: -190px;

  }


  .circle-two {

    width: 300px;

    height: 300px;

    bottom: -170px;

    left: -180px;

  }


  .book-decoration {

    position: absolute;

    display: flex;

    align-items: center;

    justify-content: center;

    width: 55px;

    height: 55px;

    border-radius: 15px;

    background:
      rgba(255,255,255,0.07);

    color:
      rgba(255,255,255,0.35);

    transform:
      rotate(-10deg);

  }


  .book-decoration svg {

    width: 25px;

    height: 25px;

  }


  .book-one {

    right: 13%;

    bottom: 15%;

  }


  .book-two {

    right: 8%;

    top: 27%;

    width: 42px;

    height: 42px;

    color:
      var(--accent);

    transform:
      rotate(12deg);

  }


  /* ============================================
     PANEL DERECHO
     ============================================ */

  .form-panel {

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 50px;

    background:
      var(--background);

  }


  .login-wrapper {

    width: 100%;

    max-width: 425px;

  }


  .mobile-logo {

    display: none;

  }


  /* ============================================
     HEADER
     ============================================ */

  .form-header {

    margin-bottom: 32px;

  }


  .welcome-label {

    display: block;

    margin-bottom: 9px;

    color:
      var(--primary);

    font-size: 11px;

    font-weight: 800;

    letter-spacing: 1.7px;

  }


  .form-header h2 {

    margin: 0;

    color:
      var(--text);

    font-size: 34px;

    line-height: 1.15;

    letter-spacing: -1px;

    font-weight: 750;

  }


  .form-header p {

    margin: 10px 0 0;

    color:
      var(--text-secondary);

    font-size: 14px;

    line-height: 1.6;

  }


  /* ============================================
     FORMULARIO
     ============================================ */

  form {

    display: flex;

    flex-direction: column;

    gap: 20px;

  }


  .field {

    display: flex;

    flex-direction: column;

    gap: 8px;

  }


  .field label {

    color:
      var(--text);

    font-size: 13px;

    font-weight: 650;

  }


  /* ============================================
     INPUTS
     ============================================ */

  .input-wrapper {

    position: relative;

    display: flex;

    align-items: center;

  }


  .input-icon {

    position: absolute;

    left: 15px;

    width: 19px;

    height: 19px;

    color:
      #8FA2AC;

    pointer-events: none;

  }


  .input-icon svg {

    width: 100%;

    height: 100%;

  }


  input {

    width: 100%;

    height: 52px;

    padding:
      0 47px;

    border:
      1px solid var(--border);

    border-radius: 10px;

    outline: none;

    background:
      white;

    color:
      var(--text);

    font-family: inherit;

    font-size: 14px;

    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

  }


  input::placeholder {

    color:
      #A5B1B8;

  }


  input:hover {

    border-color:
      #B9CBD3;

  }


  input:focus {

    border-color:
      var(--primary);

    box-shadow:
      0 0 0 4px rgba(23,107,135,0.10);

  }


  input:disabled {

    opacity: 0.6;

    cursor: not-allowed;

  }


  /* ============================================
     PASSWORD
     ============================================ */

  .password-toggle {

    position: absolute;

    right: 10px;

    width: 34px;

    height: 34px;

    display: flex;

    align-items: center;

    justify-content: center;

    padding: 7px;

    border: none;

    border-radius: 7px;

    background:
      transparent;

    color:
      #8FA2AC;

    cursor: pointer;

  }


  .password-toggle:hover {

    color:
      var(--primary);

    background:
      #EDF5F7;

  }


  .password-toggle svg {

    width: 100%;

    height: 100%;

  }


  /* ============================================
     ERROR
     ============================================ */

  .error-message {

    display: flex;

    align-items: center;

    gap: 9px;

    margin-top: -2px;

    padding: 11px 13px;

    border:
      1px solid #F2C8C6;

    border-radius: 9px;

    background:
      var(--error-bg);

    color:
      var(--error);

    font-size: 13px;

    animation:
      errorIn 0.2s ease;

  }


  .error-message svg {

    width: 18px;

    height: 18px;

    flex-shrink: 0;

  }


  @keyframes errorIn {

    from {

      opacity: 0;

      transform:
        translateY(-4px);

    }

    to {

      opacity: 1;

      transform:
        translateY(0);

    }

  }


  /* ============================================
     BOTÓN
     ============================================ */

  .login-button {

    width: 100%;

    height: 52px;

    display: flex;

    align-items: center;

    justify-content: center;

    gap: 10px;

    margin-top: 3px;

    border: none;

    border-radius: 10px;

    background:
      var(--primary);

    color:
      white;

    font-family: inherit;

    font-size: 14px;

    font-weight: 700;

    cursor: pointer;

    box-shadow:
      0 5px 14px rgba(23,107,135,0.18);

    transition:
      background 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;

  }


  .login-button svg {

    width: 18px;

    height: 18px;

    transition:
      transform 0.2s ease;

  }


  .login-button:hover:not(:disabled) {

    background:
      var(--primary-dark);

    transform:
      translateY(-1px);

    box-shadow:
      0 8px 20px rgba(23,107,135,0.22);

  }


  .login-button:hover:not(:disabled) svg {

    transform:
      translateX(3px);

  }


  .login-button:active:not(:disabled) {

    transform:
      translateY(0);

  }


  .login-button:disabled {

    opacity: 0.50;

    cursor: not-allowed;

    box-shadow: none;

  }


  /* ============================================
     LOADING
     ============================================ */

  .spinner {

    width: 17px;

    height: 17px;

    border:
      2px solid rgba(255,255,255,0.35);

    border-top-color:
      white;

    border-radius: 50%;

    animation:
      spin 0.7s linear infinite;

  }


  @keyframes spin {

    to {
      transform:
        rotate(360deg);
    }

  }


  /* ============================================
     SEGURIDAD
     ============================================ */

  .security-note {

    display: flex;

    justify-content: center;

    align-items: center;

    gap: 7px;

    margin-top: 24px;

    color:
      var(--text-muted);

    font-size: 11px;

  }


  .security-note svg {

    width: 15px;

    height: 15px;

    color:
      var(--secondary);

  }


  .copyright {

    margin: 23px 0 0;

    text-align: center;

    color:
      #AAB6BD;

    font-size: 11px;

  }


  /* ============================================
     RESPONSIVE
     ============================================ */

  @media (max-width: 900px) {

    .login-page {

      grid-template-columns: 1fr;

    }


    .brand-panel {

      display: none;

    }


    .form-panel {

      min-height: 100vh;

      padding:
        30px 20px;

    }


    .login-wrapper {

      max-width: 430px;

      padding:
        34px 28px;

      border-radius: 18px;

      background:
        white;

      box-shadow:
        0 10px 35px rgba(24,59,78,0.07);

    }


    .mobile-logo {

      display: flex;

      justify-content: center;

    }


    .mobile-logo .brand-logo {

      width: 58px;

      height: 58px;

      margin-bottom: 25px;

      background:
        #EAF4F6;

      box-shadow:
        none;

    }

  }


  @media (max-width: 480px) {

    .form-panel {

      padding: 16px;

    }


    .login-wrapper {

      padding:
        26px 20px;

      border-radius: 15px;

      box-shadow:
        none;

    }


    .form-header h2 {

      font-size: 29px;

    }


    .form-header {

      margin-bottom: 27px;

    }

  }

</style>