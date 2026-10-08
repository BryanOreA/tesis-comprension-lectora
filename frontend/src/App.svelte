<script>
  import Login from './components/Login.svelte';
  import Profile from './components/Profile.svelte';
  import StudentDashboard from './components/Student/StudentDashboard.svelte';
  import ReadingView from './components/Student/ReadingView.svelte';
  import StudentList from './components/Teacher/StudentList.svelte';
  import WeeklySummary from './components/Parent/WeeklySummary.svelte';
  import { user } from './stores/user.js';

  let studentView = 'dashboard'; // 'dashboard' | 'reading' | 'profile'
  let teacherView = 'list'; // 'list' | 'profile'
  let parentView = 'summary'; // 'summary' | 'profile'
</script>

{#if !$user}
  <Login />
{:else if $user.role === 'estudiante'}
  {#if studentView === 'dashboard'}
    <StudentDashboard
      onStartReading={() => studentView = 'reading'}
      onOpenProfile={() => studentView = 'profile'}
    />
  {:else if studentView === 'reading'}
    <ReadingView onBack={() => studentView = 'dashboard'} />
  {:else}
    <Profile onBack={() => studentView = 'dashboard'} />
  {/if}
{:else if $user.role === 'docente'}
  {#if teacherView === 'list'}
    <StudentList onOpenProfile={() => teacherView = 'profile'} />
  {:else}
    <Profile onBack={() => teacherView = 'list'} />
  {/if}
{:else if $user.role === 'padre'}
  {#if parentView === 'summary'}
    <WeeklySummary onOpenProfile={() => parentView = 'profile'} />
  {:else}
    <Profile onBack={() => parentView = 'summary'} />
  {/if}
{:else}
  <p style="text-align:center; padding: 40px;">Rol no reconocido: {$user.role}</p>
{/if}