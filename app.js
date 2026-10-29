
const todoForm = document.getElementById("todoForm"),
    taskInput = document.getElementById("taskInput"),
    taskList = document.getElementById("taskList"),
    emptyMessage = document.getElementById("emptyMessage"),
    noResults = document.getElementById("noResults"),
    searchInput = document.getElementById("searchInput"),
    filterSelect = document.getElementById("filterSelect"),
    taskCounter = document.getElementById("taskCounter");

let tasks = [], nextId = 1;

todoForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return alert("Please enter a task first!");

    tasks.push({ id: nextId++, text, completed: false });
    taskInput.value = "";
    displayTasks();
    taskInput.focus();
});

searchInput.addEventListener("input", displayTasks);
filterSelect.addEventListener("change", displayTasks);

function displayTasks() {
    taskList.innerHTML = "";

    const search = searchInput.value.trim().toLowerCase(),
        filter = filterSelect.value,
        filtered = tasks.filter(t =>
            t.text.toLowerCase().includes(search) &&
            (filter === "all" || (filter === "pending" && !t.completed) ||
            (filter === "completed" && t.completed))
        ),
        done = tasks.filter(t => t.completed).length;

    taskCounter.textContent = `Total: ${tasks.length} | Done: ${done} | Pending: ${tasks.length - done}`;
    emptyMessage.classList.toggle("hidden", tasks.length > 0);
    noResults.classList.toggle("hidden", !tasks.length || filtered.length > 0);

    filtered.forEach(t => {
        const row = document.createElement("tr");
        row.className = "border-b border-slate-500/60 bg-[#10192d] hover:bg-[#182641] transition";

        const cell = (cls, value = "") => {
            const td = document.createElement("td");
            td.className = cls;
            td.textContent = value;
            return td;
        };

        const number = cell("px-2 py-3 text-center text-slate-300",
            tasks.findIndex(x => x.id === t.id) + 1);

        const details = cell("px-3 py-3 break-words max-w-[220px]");
        const span = document.createElement("span");
        span.textContent = t.text;
        span.className = "break-words" + (t.completed ? " line-through text-gray-400" : "");
        details.appendChild(span);

        const checkCell = cell("px-3 py-3 text-center");
        const check = document.createElement("input");
        check.type = "checkbox";
        check.checked = t.completed;
        check.className = "h-4 w-4 cursor-pointer accent-emerald-500";
        check.setAttribute("aria-label", "Mark task as completed: " + t.text);
        check.onchange = () => { t.completed = check.checked; displayTasks(); };
        checkCell.appendChild(check);

        const actions = cell("px-2 py-3");
        const wrapper = document.createElement("div");
        wrapper.className = "flex items-center justify-center gap-3";

        ["Edit", "Delete"].forEach(action => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = action;
            btn.className = action === "Edit"
                ? "text-sky-300 text-xs font-semibold hover:text-sky-100 transition"
                : "text-red-300 text-xs font-semibold hover:text-red-100 transition";

            btn.onclick = () => {
                if (action === "Edit") {
                    const text = prompt("Edit your task:", t.text);
                    if (text === null) return;
                    if (!text.trim()) return alert("Task cannot be empty!");
                    t.text = text.trim();
                } else {
                    if (!confirm("Are you sure you want to delete this task?")) return;
                    tasks = tasks.filter(x => x.id !== t.id);
                }
                displayTasks();
            };

            btn.setAttribute("aria-label", action + " " + t.text);
            wrapper.appendChild(btn);
        });

        actions.appendChild(wrapper);
        row.append(number, details, checkCell, actions);
        taskList.appendChild(row);
    });
}

displayTasks();
