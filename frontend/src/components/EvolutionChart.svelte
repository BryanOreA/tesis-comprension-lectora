<script>
  export let data = [];
  export let height = 200;
  export let color = '#176B87';

  $: width = 600;
  $: padding = { top: 20, right: 20, bottom: 30, left: 40 };
  $: innerWidth = width - padding.left - padding.right;
  $: innerHeight = height - padding.top - padding.bottom;

  $: maxScore = data.length > 0 ? Math.max(100, ...data.map(d => d.score)) : 100;
  $: minScore = 0;

  $: points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * innerWidth;
    const y = padding.top + innerHeight - ((d.score - minScore) / (maxScore - minScore)) * innerHeight;
    return { x, y, ...d };
  });

  $: pathD = points.length > 0
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';

  $: areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${points[0].x} ${padding.top + innerHeight} Z`
    : '';

  // Grid lines
  $: gridLines = [0, 25, 50, 75, 100].map(pct => ({
    y: padding.top + innerHeight - (pct / 100) * innerHeight,
    label: `${pct}%`
  }));
</script>

<div class="chart-container">
  {#if data.length === 0}
    <div class="empty">
      <p>Sin datos de evolución aún</p>
    </div>
  {:else}
    <svg viewBox="0 0 {width} {height}" preserveAspectRatio="xMidYMid meet" class="chart-svg">
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color={color} stop-opacity="0.3" />
          <stop offset="100%" stop-color={color} stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Grid horizontal -->
      {#each gridLines as line}
        <line
          x1={padding.left}
          y1={line.y}
          x2={width - padding.right}
          y2={line.y}
          stroke="#E5EDF1"
          stroke-width="1"
          stroke-dasharray="4 4"
        />
        <text
          x={padding.left - 8}
          y={line.y + 4}
          text-anchor="end"
          font-size="10"
          fill="#96A5AE"
          font-weight="600"
        >{line.label}</text>
      {/each}

      <!-- Área -->
      <path d={areaD} fill="url(#areaGradient)" />

      <!-- Línea -->
      <path d={pathD} fill="none" stroke={color} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Puntos -->
      {#each points as p}
        <circle cx={p.x} cy={p.y} r="4" fill="white" stroke={color} stroke-width="2.5" />
      {/each}

      <!-- Fechas -->
      {#each points as p, i}
        {#if i % Math.max(1, Math.floor(points.length / 5)) === 0 || i === points.length - 1}
          <text
            x={p.x}
            y={height - 10}
            text-anchor="middle"
            font-size="10"
            fill="#96A5AE"
            font-weight="600"
          >{p.date ? p.date.slice(5) : ''}</text>
        {/if}
      {/each}
    </svg>
  {/if}
</div>

<style>
  .chart-container {
    width: 100%;
    background: white;
    border-radius: 12px;
    padding: 16px;
    border: 1px solid #DCE6EA;
  }
  .chart-svg {
    width: 100%;
    height: auto;
    display: block;
  }
  .empty {
    text-align: center;
    padding: 40px;
    color: #96A5AE;
    font-size: 13px;
  }
</style>