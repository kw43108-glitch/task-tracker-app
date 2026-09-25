// ข้อมูลตัวอย่างเริ่มต้น (กรณีไม่มีข้อมูลในระบบ)
const initialTasks = [
  {
    id: "1",
    title: "ทำแบบฝึกหัดเรื่องแคลคูลัส",
    subject: "คณิตศาสตร์",
    date: "2026-10-01",
    priority: "high",
    completed: false
  },
  {
    id: "2",
    title: "เขียนรายงานวิเคราะห์ตัวละครในเรื่องขุนช้างขุนแผน",
    subject: "ภาษาไทย",
    date: "2026-10-05",
    priority: "medium",
    completed: false
  },
  {
    id: "3",
    title: "เตรียมสไลด์นำเสนอโปรเจกต์กลุ่ม",
    subject: "วิทยาการคำนวณ",
    date: "2026-09-28",
    priority: "high",
    completed: true
  }
];

// โหลดข้อมูลจาก LocalStorage หรือใช้ข้อมูลตัวอย่าง
let tasks = JSON.parse(localStorage.getItem('my_tasks')) || initialTasks;
let currentFilter = 'all';

// Element Selectors
const taskForm = document.getElementById('task-form');
const taskListEl = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// Stats Elements
const statTotal = document.getElementById('stat-total');
const statPending = document.getElementById('stat-pending');
const statCompleted = document.getElementById('stat-completed');

// เริ่มต้นทำงาน
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
  updateStats();
});

// ฟังก์ชันเพิ่มงานใหม่
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('task-title').value;
  const subject = document.getElementById('task-subject').value;
  const date = document.getElementById('task-date').value;
  const priority = document.getElementById('task-priority').value;

  const newTask = {
    id: Date.now().toString(),
    title,
    subject,
    date,
    priority,
    completed: false
  };

  tasks.unshift(newTask);
  saveAndRender();
  taskForm.reset();
});

// ฟังก์ชันเปลี่ยนสถานะ (เสร็จแล้ว / ยังไม่เสร็จ)
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveAndRender();
}

// ฟังก์ชันลบงาน
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndRender();
}

// ระบบกรองรายการ (Filter)
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// แสดงรายการงาน
function renderTasks() {
  taskListEl.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'pending') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    taskListEl.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-folder-open" style="font-size: 2rem; margin-bottom: 8px;"></i>
        <p>ไม่มีรายการงานในหมวดนี้</p>
      </div>
    `;
    return;
  }

  filteredTasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'done' : ''}`;

    const priorityLabel = { low: 'ต่ำ', medium: 'ปานกลาง', high: 'ด่วน' }[task.priority];

    taskItem.innerHTML = `
      <div class="task-left">
        <input type="checkbox" class="checkbox-custom" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
        <div>
          <div class="task-title">${task.title}</div>
          <div class="task-details">
            <span><i class="fa-solid fa-book"></i> ${task.subject}</span>
            <span><i class="fa-regular fa-calendar"></i> ${task.date}</span>
            <span class="badge badge-${task.priority}">${priorityLabel}</span>
          </div>
        </div>
      </div>
      <button class="delete-btn" onclick="deleteTask('${task.id}')" title="ลบรายการ">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;

    taskListEl.appendChild(taskItem);
  });
}

// อัปเดตตัวเลขการ์ดสรุปผล
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  statTotal.textContent = total;
  statPending.textContent = pending;
  statCompleted.textContent = completed;
}

// บันทึกลง LocalStorage
function saveAndRender() {
  localStorage.setItem('my_tasks', JSON.stringify(tasks));
  renderTasks();
  updateStats();
}
