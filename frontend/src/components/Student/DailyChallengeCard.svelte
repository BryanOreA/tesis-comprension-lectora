<script>
  import Icon from '../Icon.svelte';
  import { dailyChallenges, getTodayChallenge, getChallengeProgress } from '../../lib/challenges.js';

  $: challenge = getTodayChallenge();
  $: isCompleted = $dailyChallenges.completed.includes(challenge.id);
  $: progress = getChallengeProgress(challenge, $dailyChallenges);
  $: progressPercent = Math.round(progress * 100);
</script>

<div class="challenge-card" class:completed={isCompleted}>
  <div class="challenge-glow"></div>

  <div class="challenge-content">
    <div class="challenge-header">
      <div class="challenge-badge">
        <Icon name="sparkles" size={12} />
        <span>RETO DEL DÍA</span>
      </div>
      {#if isCompleted}
        <div class="completed-badge">
          <Icon name="check-circle" size={14} />
          <span>Completado</span>
        </div>
      {/if}
    </div>

    <div class="challenge-body">
      <div class="challenge-icon" class:done={isCompleted}>
        <Icon name={challenge.icon} size={32} strokeWidth={1.6} />
      </div>

      <div class="challenge-info">
        <h3>{challenge.title}</h3>
        <p>{challenge.description}</p>
      </div>
    </div>

    <div class="challenge-footer">
      <div class="progress-wrapper">
        <div class="progress-label">
          <span>Progreso</span>
          <strong>{progressPercent}%</strong>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {progressPercent}%"></div>
        </div>
      </div>

      <div class="points-badge">
        <Icon name="star" size={14} />
        <span>+{challenge.points}</span>
      </div>
    </div>
  </div>
</div>

<style>
  .challenge-card {
    position: relative;
    background: linear-gradient(135deg, #176B87 0%, #2A9D8F 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(23, 107, 135, 0.25);
    margin-bottom: 24px;
    transition: all 0.3s ease;
  }

  .challenge-card.completed {
    background: linear-gradient(135deg, #27AE60 0%, #2A9D8F 100%);
    box-shadow: 0 10px 30px rgba(39, 174, 96, 0.25);
  }

  .challenge-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15), transparent 60%);
    pointer-events: none;
  }

  .challenge-content {
    position: relative;
    z-index: 1;
  }

  .challenge-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .challenge-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.5px;
    backdrop-filter: blur(10px);
  }

  .completed-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    background: rgba(255, 255, 255, 0.9);
    color: #27AE60;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 800;
  }

  .challenge-body {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 20px;
  }

  .challenge-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }

  .challenge-icon.done {
    background: rgba(255, 255, 255, 0.95);
    color: #27AE60;
  }

  .challenge-info h3 {
    margin: 0 0 4px;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.3px;
  }

  .challenge-info p {
    margin: 0;
    font-size: 13px;
    opacity: 0.9;
    line-height: 1.4;
  }

  .challenge-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .progress-wrapper {
    flex: 1;
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 700;
    margin-bottom: 6px;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .progress-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: white;
    border-radius: 4px;
    transition: width 0.6s ease;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  .points-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 14px;
    background: rgba(255, 255, 255, 0.95);
    color: #B8860B;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 800;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>