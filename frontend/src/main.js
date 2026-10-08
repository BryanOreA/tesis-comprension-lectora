import { mount } from 'svelte';
import App from './App.svelte';
import './app.css';
import { theme } from './stores/theme.js';

// Aplicar el tema guardado antes de montar la app
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

mount(App, { target: document.getElementById('app') });