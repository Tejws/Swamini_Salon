let queue = JSON.parse(localStorage.getItem("salonQueue")) || [];
let nowServing = parseInt(localStorage.getItem("nowServing")) || 1;

const nowServingDisplay = document.getElementById("nowServing");
const queueList = document.getElementById("queueList");
const queueCount = document.getElementById("queueCount");
const adminPin = document.getElementById("adminPin");
const adminControls = document.getElementById("adminControls");

function updateQueueView() {
  nowServingDisplay.textContent = nowServing;
  queueCount.textContent = queue.length;

  queueList.innerHTML = "";
  queue.forEach((q, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      #${q.number} - ${q.name} (${q.service})
      <button onclick="markDone(${index})" style="float:right; background:#28a745; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Done</button>
    `;
    queueList.appendChild(li);
  });

  localStorage.setItem("salonQueue", JSON.stringify(queue));
  localStorage.setItem("nowServing", nowServing);
}


function nextCustomer() {
  if (nowServing < queue.length + 1) {
    nowServing++;
    updateQueueView();
  }
}

function skipCustomer() {
  nowServing++;
  updateQueueView();
}

function clearQueue() {
  if (confirm("Clear the entire queue?")) {
    queue = [];
    nowServing = 1;
    updateQueueView();
  }
}
function markDone(index) {
  if (confirm(`Mark #${queue[index].number} - ${queue[index].name} as done?`)) {
    queue.splice(index, 1);

    // Adjust nowServing if necessary
    if (nowServing > queue.length + 1) {
      nowServing = queue.length + 1;
    }

    updateQueueView();
  }
}

// Basic PIN Protection
adminPin.addEventListener("input", () => {
  if (adminPin.value === "1234") {
    adminControls.style.display = "block";
  } else {
    adminControls.style.display = "none";
  }
});

updateQueueView();
