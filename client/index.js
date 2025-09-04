$(function () {
const addBtn = $('.form__btn');
    const todosUl = $('.js--todos-wrapper');
    const textInputUser = $('.js--form__input');
  
    if (!todosUl.length) {
      console.error('Не знайдено .js--todos-wrapper у DOM');
      return
    }
  
    // Збереження у localStorage
    // function saveTodos() {
    //   const todos = [];
    //   $('.todo-item').each(function () {
    //     todos.push({
    //       text: $(this).find('.todo-item__description').text(),
    //       checked: $(this).hasClass('todo-item--checked')
    //     });
    //   });
    //   localStorage.setItem('todos', JSON.stringify(todos));
    // }
  
    // Створення елемента списку
    function createTodoEl(text, checked = false) {
      const $li = $('<li>', {
        class: 'list-group-item todo-item' + (checked ? ' todo-item--checked' : ''), 'data-id': id
      });
  
      const $checkbox = $('<input>', { type: 'checkbox' }).prop('checked', checked);
      const $span = $('<span>', { class: 'todo-item__description', text: text });
      const $btn = $('<button>', {
        type: 'button',
        class: 'btn btn-sm btn-danger todo-item__delete',
        text: 'Видалити'
      });
  
      $li.append($checkbox, ' ', $span, ' ', $btn).appendTo(todosUl);
    }
  
    // Завантаження з localStorage
    // function loadTodos() {
    //   todosUl.empty();
    //   const todos = JSON.parse(localStorage.getItem('todos')) || [];
    //   $.each(todos, function (_, todo) {
    //     createTodoEl(todo.text, todo.checked);
    //   });
    // }
    // loadTodos();
    async function loadTodos() {
      todosUl.empty();
      const res = await fetch("/api/todo-list");
      const todos = await res.json();
      todos.forEach(todo => {
        createTodoEl(todo.text, todo.isDone);
      });
    }
    
    loadTodos();
    
  
    // Додавання елемента
    // addBtn.on('click', function (e) {
    //   e.preventDefault();
    //   const text = $.trim(textInputUser.val());
    //   if (!text) {
    //     alert('Поле не може бути пустим!');
    //     return;
    //   }
    //   createTodoEl(text);
    //   saveTodos();
    //   textInputUser.val('');
    // });
    addBtn.on('click', async function (e) {
      e.preventDefault();
      const text = $.trim(textInputUser.val());
      if (!text) { alert('Поле не може бути пустим!'); return; }
    
      const res = await fetch("/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, isDone: false })
      });
      const newTodo = await res.json();
      createTodoEl(newTodo.text, newTodo.isDone);
      textInputUser.val('');
    });
    
  
    // видалення
    // todosUl.on('click', '.todo-item__delete', function () {
    //   $(this).closest('.todo-item').remove();
    //   saveTodos();
    // });
    todosUl.on('click', '.todo-item__delete', async function () {
      const $li = $(this).closest('.todo-item');
      const id = $li.data('id');
      if (id) {
        await fetch(`/api/todo/${id}`, { method: "DELETE" });
      }
      $li.remove();
    });
  
    // зміна чекбокса
    // todosUl.on('change', 'input[type="checkbox"]', function () {
    //   $(this).closest('.todo-item').toggleClass('todo-item--checked', this.checked);
    //   saveTodos();
    // });
    todosUl.on('change', 'input[type="checkbox"]', async function () {
      const $li = $(this).closest('.todo-item');
      const checked = this.checked;
      $li.toggleClass('todo-item--checked', checked);
    
      const id = $li.data('id'); // збережемо _id після створення
      if (!id) return;
    
      await fetch(`/api/todo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDone: checked })
      });
    });
    

    if ($('#infoModal').length && typeof bootstrap !== 'undefined') {
      const infoModal = new bootstrap.Modal($('#infoModal')[0]);
  
      todosUl.on('click', '.list-group-item', function (e) {
        if ($(e.target).is('button') || $(e.target).is('input')) return;
        const text = $.trim($(this).find('.todo-item__description').text() || $(this).text());
        $('#infoModal .modal-body').text(text);
        infoModal.show();
      });
    } else {
      console.warn('Модалка не ініціалізована: перевір, чи підключено Bootstrap і чи є #infoModal');
    };

async function loadTodos() {
  const res = await fetch("/api/todo-list");
  const todos = await res.json();
  console.log("Todos from server:", todos);
}

async function addTodo(text) {
  const res = await fetch("/api/todo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, isDone: false })
  });
  const newTodo = await res.json();
  console.log("New todo added:", newTodo);
}

loadTodos();

fetch('/api/todo-list')
  .then(resp => resp.json())
  .then(list => {
    const listEl = document.createElement('ul');

    const todoItemEls = list.map(item => {

        const itemEl = document.createElement('li');
        itemEl.textContent = item.text;
        return itemEl;
        })
    listEl.append(...todoItemEls);
    document.body.append(listEl);
  })
})