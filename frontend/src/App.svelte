<script>
  import { Router, Route } from 'svelte5-router';
  import Login from './components/Login.svelte';
  import ReadingView from './components/Student/ReadingView.svelte';
  import StudentList from './components/Teacher/StudentList.svelte';
  import WeeklySummary from './components/Parent/WeeklySummary.svelte';
  import { user } from './stores/user.js';
</script>

<Router>
  {#if !$user}
    <Route path="/" component={Login} />
  {:else if $user.role === 'estudiante'}
    <Route path="/" component={ReadingView} />
  {:else if $user.role === 'docente'}
    <Route path="/" component={StudentList} />
  {:else if $user.role === 'padre'}
    <Route path="/" component={WeeklySummary} />
  {/if}
</Router>