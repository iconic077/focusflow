const storedTasks = JSON.parse(localStorage.getItem('focusflow-tasks') || '[]');
let tasks = storedTasks;
const list = document.querySelector('#task-list');
const empty = document.querySelector('#empty-state');
const progressBar = document.querySelector('#progress-bar');
const progressText = document.querySelector('#progress-text');
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');

document.querySelector('#today').textContent = new Intl.DateTimeFormat('en-US', { weekday:'long', month:'long', day:'numeric' }).format(new Date());
function save() { localStorage.setItem('focusflow-tasks', JSON.stringify(tasks)); }
function render() {
  list.innerHTML = '';
  const completed = tasks.filter(task => task.done).length;
  const percent = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  progressBar.style.width = `${percent}%`;
  progressText.textContent = tasks.length ? `${completed} of ${tasks.length} complete` : 'No tasks yet — enjoy the calm.';
  empty.hidden = tasks.length > 0;
  tasks.forEach(task => {
    const item = document.createElement('li'); item.className = `task${task.done ? ' done' : ''}`;
    item.innerHTML = `<input class="task-check" type="checkbox" ${task.done ? 'checked' : ''} aria-label="Complete ${task.text}"><span class="task-name"></span><button class="delete" aria-label="Delete ${task.text}">×</button>`;
    item.querySelector('.task-name').textContent = task.text;
    item.querySelector('.task-check').addEventListener('change', () => { task.done = !task.done; save(); render(); });
    item.querySelector('.delete').addEventListener('click', () => { tasks = tasks.filter(item => item.id !== task.id); save(); render(); });
    list.append(item);
  });
}
form.addEventListener('submit', event => { event.preventDefault(); const text = input.value.trim(); if (!text) return; tasks.unshift({ id: Date.now(), text, done:false }); save(); input.value=''; render(); });
document.querySelector('#clear-completed').addEventListener('click', () => { tasks = tasks.filter(task => !task.done); save(); render(); });
const theme = localStorage.getItem('focusflow-theme'); if (theme === 'dark') document.body.classList.add('dark');
document.querySelector('#theme-toggle').addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('focusflow-theme', document.body.classList.contains('dark') ? 'dark' : 'light'); });
render();
