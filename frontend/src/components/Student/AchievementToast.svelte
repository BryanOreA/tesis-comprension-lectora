<script>
  import { getRarityColor } from '../../lib/achievements.js';
  import Icon from '../Icon.svelte';

  export let achievement = null;

  $: rarityStyle = achievement ? getRarityColor(achievement.rarity) : {};
</script>

{#if achievement}
  <div class="toast-overlay">
    <div
      class="toast"
      style="
        --rarity-bg: {rarityStyle.bg};
        --rarity-color: {rarityStyle.color};
        --rarity-border: {rarityStyle.border};
      "
    >
      <div class="toast-glow"></div>

      <div class="toast-content">
        <div class="toast-label">
          <Icon name="sparkles" size={14} />
          <span>LOGRO DESBLOQUEADO</span>
        </div>

        <div class="toast-icon-wrapper">
          <div class="toast-icon-ring"></div>
          <div class="toast-icon">
            <Icon name={achievement.icon} size={56} strokeWidth={1.5} />
          </div>
        </div>

        <div class="toast-name">{achievement.name}</div>
        <div class="toast-description">{achievement.description}</div>

        <div class="toast-footer">
          <span class="toast-rarity">{achievement.rarity}</span>
          <span class="toast-points">+{achievement.points} pts</span>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .toast-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(24, 59, 78, 0.55);
    z-index: 9999;
    animation: fadeIn 0.3s ease;
    backdrop-filter: blur(6px);
  }

  .toast {
    position: relative;
    background: white;
    border-radius: 24px;
    padding: 40px 44px 32px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.35);
    border: 2px solid var(--rarity-border);
    animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    overflow: hidden;
  }

  .toast-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, var(--rarity-bg), transparent 65%);
    pointer-events: none;
  }

  .toast-content {
    position: relative;
    z-index: 1;
  }

  .toast-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
    color: var(--rarity-color);
    margin-bottom: 24px;
    padding: 6px 14px;
    background: var(--rarity-bg);
    border-radius: 20px;
  }

  .toast-icon-wrapper {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toast-icon-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid var(--rarity-border);
    animation: pulse 2s ease-in-out infinite;
  }

  .toast-icon-ring::before {
    content: '';
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    border: 1px dashed var(--rarity-border);
    opacity: 0.6;
  }

  .toast-icon {
    position: relative;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: var(--rarity-bg);
    color: var(--rarity-color);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: bounce 0.8s ease infinite alternate;
    box-shadow: 0 10px 30px var(--rarity-border);
  }

  .toast-name {
    font-size: 24px;
    font-weight: 800;
    color: #183B4E;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }

  .toast-description {
    font-size: 14px;
    color: #667985;
    margin-bottom: 24px;
    line-height: 1.5;
    padding: 0 10px;
  }

  .toast-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }

  .toast-rarity {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--rarity-color);
    padding: 6px 12px;
    border: 1px solid var(--rarity-border);
    border-radius: 20px;
  }

  .toast-points {
    display: inline-block;
    padding: 8px 18px;
    background: var(--rarity-color);
    color: white;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 700;
    box-shadow: 0 4px 12px var(--rarity-border);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes popIn {
    0% {
      transform: scale(0.5) translateY(20px);
      opacity: 0;
    }
    100% {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }

  @keyframes bounce {
    from { transform: scale(1); }
    to { transform: scale(1.05); }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.08);
      opacity: 0.6;
    }
  }
</style>