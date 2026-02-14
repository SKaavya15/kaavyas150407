let progress = { todo: 0, notes: 0, timer: 0 };
let timerInterval;

/* LOGIN */
function login() {
    loginBox.classList.add("d-none");
    app.classList.remove("d-none");
    loadProfile();
    drawChart();
}

function logout() {
    localStorage.clear();
    location.reload();
}

/* NAV */
function showSection(id) {
    document.querySelectorAll("section").forEach(s => s.classList.add("d-none"));
    document.getElementById(id).classList.remove("d-none");
}

/* THEME */
function toggleTheme() {
    document.body.classList.toggle("dark");
}

/* PROFILE */
function saveProfile() {
    const profile = {
        username: username.value || "User",
        dob: dob.value,
        image: ""
    };

    const img = profileImg.files[0];
    if (img) {
        const r = new FileReader();
        r.onload = () => {
            profile.image = r.result;
            localStorage.setItem("profileData", JSON.stringify(profile));
            loadProfile();
        };
        r.readAsDataURL(img);
    } else {
        localStorage.setItem("profileData", JSON.stringify(profile));
        loadProfile();
    }
}

function loadProfile() {
    const data = localStorage.getItem("profileData");
    if (!data) return;
    const p = JSON.parse(data);
    profileName.innerText = "Name: " + p.username;
    profileDob.innerText = "DOB: " + p.dob;
    if (p.image) preview.src = p.image;
}

/* TODO */
function addTodo() {
    if (!todoInput.value) return;
    progress.todo++; drawChart();

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${todoInput.value}</span><br>
      <button class="btn btn-sm btn-warning" onclick="editItem(this)">Edit</button>
      <button class="btn btn-sm btn-danger" onclick="deleteItem(this)">Delete</button>`;
    todoList.appendChild(li);
    todoInput.value = "";
}

function editItem(btn) {
    const span = btn.parentElement.querySelector("span");
    const text = prompt("Edit:", span.innerText);
    if (text) span.innerText = text;
}

function deleteItem(btn) {
    btn.parentElement.remove();
}

/* TIMER */
function startTimer() {
    let sec = minutes.value * 60;
    progress.timer++; drawChart();
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        display.innerText =
          `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
        sec--;
        if (sec < 0) clearInterval(timerInterval);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

/* NOTES */
function addNote() {
    if (!noteText.value) return;
    progress.notes++; drawChart();

    const div = document.createElement("div");
    div.innerHTML = `
      <p>${noteText.value}</p>
      <button class="btn btn-sm btn-warning" onclick="editNote(this)">Edit</button>
      <button class="btn btn-sm btn-danger" onclick="deleteItem(this)">Delete</button>`;
    notesBox.appendChild(div);
    noteText.value = "";
}

function editNote(btn) {
    const p = btn.parentElement.querySelector("p");
    const t = prompt("Edit note:", p.innerText);
    if (t) p.innerText = t;
}

function downloadNote() {
    const blob = new Blob([noteText.value], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Study_Notes.doc";
    link.click();
}

/* CHART */
function drawChart() {
    const c = progressChart;
    const ctx = c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);

    const max = Math.max(progress.todo, progress.notes, progress.timer, 1);
    drawBar(ctx, 60, progress.todo, max, "#cdb4db", "To-Do");
    drawBar(ctx, 140, progress.notes, max, "#ffc8dd", "Notes");
    drawBar(ctx, 220, progress.timer, max, "#bde0fe", "Timer");
}

function drawBar(ctx, x, val, max, color, label) {
    const h = (val / max) * 120;
    ctx.fillStyle = color;
    ctx.fillRect(x, 140 - h, 40, h);
    ctx.fillStyle = "#555";
    ctx.fillText(label, x - 5, 160);
}
