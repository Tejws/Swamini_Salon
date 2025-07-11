// Booking form logic for salon queue
const form = document.getElementById("bookingForm");
const nameInput = document.getElementById("name");
const serviceInput = document.getElementById("service");
const emailInput = document.getElementById("email");
const yourInfo = document.getElementById("yourInfo");
const yourNumber = document.getElementById("yourNumber");
const waitTime = document.getElementById("waitTime");
const notifyMessage = document.getElementById("notifyMessage");
const nowServingDisplay = document.getElementById("nowServing");
const queueList = document.getElementById("queueList");
const serviceDetails = document.getElementById("serviceDetails");
const progressBar = document.getElementById("progressBar");

let queue = JSON.parse(localStorage.getItem("salonQueue")) || [];
let nowServing = parseInt(localStorage.getItem("nowServing")) || 1;
let userBooking = JSON.parse(localStorage.getItem("userBooking")) || null;

function updateQueueView() {
  nowServingDisplay.textContent = nowServing;
  queueList.innerHTML = "";

  queue.forEach((q, i) => {
    const li = document.createElement("li");
    li.textContent = `#${q.number} - ${q.name} (${q.service})`;
    queueList.appendChild(li);
  });

  const total = queue.length;
  const percent = total ? ((nowServing - 1) / total) * 100 : 0;
  progressBar.style.width = `${percent}%`;

  localStorage.setItem("salonQueue", JSON.stringify(queue));
  localStorage.setItem("nowServing", nowServing);
}

function showBookingInfo(booking) {
  yourNumber.textContent = booking.number;

  // Sum durations of all customers ahead in queue
  let totalWaitTime = 0;
  queue.forEach(q => {
    if (q.number < booking.number) {
      const serviceOption = document.querySelector(`#service option[value='${q.service}']`);
      if (serviceOption) {
        totalWaitTime += parseInt(serviceOption.dataset.time);
      }
    }
  });

  // Add current customer's service time if you want total time until done
  const currentServiceOption = document.querySelector(`#service option[value='${booking.service}']`);
  const currentServiceTime = currentServiceOption ? parseInt(currentServiceOption.dataset.time) : 0;
  const totalTimeIncludingCurrent = totalWaitTime + currentServiceTime;

  // Show either wait time (before turn) or total time (until done)
  waitTime.textContent = `${totalTimeIncludingCurrent} mins (including your service)`;

  yourInfo.style.display = "block";

  if (booking.number - nowServing <= 1) {
    notifyMessage.textContent = "Get ready! You're up next!";
  } else {
    notifyMessage.textContent = "We'll notify you when your turn is near.";
  }
}



form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const service = serviceInput.value;
  const email = emailInput.value.trim();

  const newBooking = {
    name,
    service,
    email,
    number: queue.length + 1
  };
  queue.push(newBooking);
  localStorage.setItem("userBooking", JSON.stringify(newBooking));
  userBooking = newBooking;

  updateQueueView();
  showBookingInfo(newBooking);
  form.reset();
});

function cancelBooking() {
  if (!userBooking) return;
  queue = queue.filter((q) => q.number !== userBooking.number);
  localStorage.removeItem("userBooking");
  userBooking = null;
  yourInfo.style.display = "none";
  updateQueueView();
}

function downloadTicket() {
  if (!userBooking) return;
  const text = `Queue No: ${userBooking.number}\nName: ${userBooking.name}\nService: ${userBooking.service}`;
  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `SalonTicket_${userBooking.number}.txt`;
  link.click();
}

serviceInput.addEventListener("change", () => {
  const selected = serviceInput.options[serviceInput.selectedIndex];
  const time = selected.dataset.time;
  const price = selected.dataset.price;
  serviceDetails.textContent = `⏱ Duration: ${time} mins | 💰 Price: ₹${price}`;
});

// Initialize
updateQueueView();
if (userBooking) showBookingInfo(userBooking);
serviceInput.dispatchEvent(new Event("change"));
