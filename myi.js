window.addEventListener('load', () => {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let upcomingTasks = JSON.parse(localStorage.getItem('upcomingTasks')) || [];
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');
    const newUpcomingTaskForm = document.querySelector('#upcoming-task-form');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const themeSelect = document.getElementById('theme-select');

    const username = localStorage.getItem('username') || '';
    nameInput.value = username;

    nameInput.addEventListener('change', (e) => {
        localStorage.setItem('username', e.target.value);
    });

    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();
        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime()
        };

        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));

        e.target.reset();
        DisplayTodos();
    });

    newUpcomingTaskForm.addEventListener('submit', e => {
        e.preventDefault();
        const upcomingTask = {
            content: e.target.elements['upcoming-content'].value,
            category: e.target.elements['upcoming-category'].value,
            date: new Date(e.target.elements['upcoming-date'].value).getTime(),
        };

        upcomingTasks.push(upcomingTask);
        localStorage.setItem('upcomingTasks', JSON.stringify(upcomingTasks));

        e.target.reset();
        DisplayUpcomingTasks();
    });

    DisplayTodos();
    DisplayUpcomingTasks();
    DisplayQuotes();

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    });

    // Check local storage on load
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    themeSelect.addEventListener('change', () => {
        document.body.style.backgroundColor = themeSelect.value;
    });

    function DisplayTodos() {
        const todoList = document.querySelector('#todo-list');
        const completedTasksList = document.querySelector('#completed-tasks-list');
        todoList.innerHTML = "";
        completedTasksList.innerHTML = "";

        todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');

            const label = document.createElement('label');
            const input = document.createElement('input');
            const span = document.createElement('span');
            const content = document.createElement('div');
            const actions = document.createElement('div');
            const edit = document.createElement('button');
            const deleteButton = document.createElement('button');

            input.type = 'checkbox';
            input.checked = todo.done;
            span.classList.add('bubble');
            if (todo.category == 'personal') {
                span.classList.add('personal');
            } else {
                span.classList.add('business');
            }
            content.classList.add('todo-content');
            actions.classList.add('actions');
            edit.classList.add('edit');
            deleteButton.classList.add('delete');

            content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
            edit.innerHTML = 'Edit';
            deleteButton.innerHTML = 'Delete';

            label.appendChild(input);
            label.appendChild(span);
            actions.appendChild(edit);
            actions.appendChild(deleteButton);
            todoItem.appendChild(label);
            todoItem.appendChild(content);
            todoItem.appendChild(actions);

            if (todo.done) {
                todoItem.classList.add('done');
                completedTasksList.appendChild(todoItem);
            } else {
                todoList.appendChild(todoItem);
            }

            input.addEventListener('change', (e) => {
                todo.done = e.target.checked;
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            });

            edit.addEventListener('click', (e) => {
                const input = content.querySelector('input');
                input.removeAttribute('readonly');
                input.focus();
                input.addEventListener('blur', (e) => {
                    input.setAttribute('readonly', true);
                    todo.content = e.target.value;
                    localStorage.setItem('todos', JSON.stringify(todos));
                    DisplayTodos();
                });
            });

            deleteButton.addEventListener('click', (e) => {
                todos = todos.filter(t => t != todo);
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            });
        });
    }

    function DisplayUpcomingTasks() {
        const upcomingTasksList = document.querySelector('#upcoming-tasks-list');
        upcomingTasksList.innerHTML = "";

        upcomingTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('todo-item');

            const label = document.createElement('label');
            const span = document.createElement('span');
            const content = document.createElement('div');
            const actions = document.createElement('div');
            const deleteButton = document.createElement('button');
            const dateElement = document.createElement('div');
            const bellIcon = document.createElement('span');

            span.classList.add('bubble');
            if (task.category == 'personal') {
                span.classList.add('personal');
            } else {
                span.classList.add('business');
            }
            content.classList.add('todo-content');
            actions.classList.add('actions');
            deleteButton.classList.add('delete');
            dateElement.classList.add('date-element');
            bellIcon.classList.add('bell-icon');

            content.innerHTML = `<input type="text" value="${task.content}" readonly>`;
            deleteButton.innerHTML = 'Delete';
            dateElement.innerHTML = new Date(task.date).toLocaleString();
            bellIcon.innerHTML = (task.date < Date.now()) ? '⏰ LATE ' : '';

            label.appendChild(span);
            actions.appendChild(deleteButton);
            taskItem.appendChild(label);
            taskItem.appendChild(content);
            taskItem.appendChild(dateElement);
            taskItem.appendChild(bellIcon);
            taskItem.appendChild(actions);

            upcomingTasksList.appendChild(taskItem);

            deleteButton.addEventListener('click', (e) => {
                upcomingTasks = upcomingTasks.filter(t => t != task);
                localStorage.setItem('upcomingTasks', JSON.stringify(upcomingTasks));
                DisplayUpcomingTasks();
            });
        });
    }

    function DisplayQuotes() {
        const quotes = [
            "Punctuality is the soul of business.",
            "Time is money.",
            "Better three hours too soon than a minute too late.",
            "Time waits for no one.",
            "Punctuality is the virtue of the bored."
        ];
        let index = 0;

        const quoteElement = document.querySelector('.quote');

        setInterval(() => {
            quoteElement.innerHTML = quotes[index];
            index = (index + 1) % quotes.length;
        }, 5000);
    }
    
    function checkUpcomingTasks() {
        const now = Date.now();
        upcomingTasks.forEach(task => {
            if (task.date < now && !task.notified) {
                alert(`Task "${task.content}" is due!`);
                task.notified = true;
            }
        });
        localStorage.setItem('upcomingTasks', JSON.stringify(upcomingTasks));
    }

    setInterval(checkUpcomingTasks, 60000); // Check every minute

    function addDragAndDrop() {
        const todoItems = document.querySelectorAll('.todo-item');
        todoItems.forEach(item => {
            item.setAttribute('draggable', true);

            item.addEventListener('dragstart', () => {
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                saveOrder();
            });
        });

        const lists = document.querySelectorAll('.list');
        lists.forEach(list => {
            list.addEventListener('dragover', e => {
                e.preventDefault();
                const draggingItem = document.querySelector('.dragging');
                const afterElement = getDragAfterElement(list, e.clientY);
                if (afterElement == null) {
                    list.appendChild(draggingItem);
                } else {
                    list.insertBefore(draggingItem, afterElement);
                }
            });
        });
    }

    function getDragAfterElement(list, y) {
        const draggableElements = [...list.querySelectorAll('.todo-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function saveOrder() {
        const todoItems = document.querySelectorAll('#todo-list .todo-item');
        todos = [...todoItems].map(item => {
            const content = item.querySelector('.todo-content input').value;
            return todos.find(todo => todo.content === content);
        });
        localStorage.setItem('todos', JSON.stringify(todos));

        const upcomingItems = document.querySelectorAll('#upcoming-tasks-list .todo-item');
        upcomingTasks = [...upcomingItems].map(item => {
            const content = item.querySelector('.todo-content input').value;
            return upcomingTasks.find(task => task.content === content);
        });
        localStorage.setItem('upcomingTasks', JSON.stringify(upcomingTasks));
    }

    addDragAndDrop();
});
// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
});
// Check local storage on load
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Function to add the underline
function addUnderline(event) {
    event.target.style.textDecoration = 'underline';
}

// Function to remove the underline
function removeUnderline(event) {
    event.target.style.textDecoration = 'none';
}

// Attach event listeners to elements with the class 'hover-underline'
document.querySelectorAll('.hover-underline').forEach(function(element) {
    element.addEventListener('mouseenter', addUnderline);
    element.addEventListener('mouseleave', removeUnderline);
});

document.getElementById('night-mode-toggle').addEventListener('click', toggleNightMode);

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const todoItems = document.querySelectorAll('.todo-item');
    todoItems.forEach(item => {
        const content = item.querySelector('.todo-content input').value.toLowerCase();
        if (content.includes(searchTerm)) {
            item.style.backgroundColor = 'lightblue';
        } else {
            item.style.backgroundColor = '';
        }
    });
});