import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAn_KDOwnUsrYsGb9dmJ0E55s6Cyb57UE4",
  authDomain: "airsync-f4d82.firebaseapp.com",
  projectId: "airsync-f4d82",
  storageBucket: "airsync-f4d82.firebasestorage.app",
  messagingSenderId: "1097633573827",
  appId: "1:1097633573827:web:62f361ea9b240d93dd2b76"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Add Flight
window.addFlight = async function () {
  const flightNo = document.getElementById("flightNo").value;
  const destination = document.getElementById("destination").value;
  const status = document.getElementById("status").value;

  if (!flightNo || !destination) return;

  await addDoc(collection(db, "flights"), {
    flightNo,
    destination,
    status
  });

  loadFlights();
};

// Load Flights
async function loadFlights() {
  const querySnapshot = await getDocs(collection(db, "flights"));
  const table = document.getElementById("flightTable");
  table.innerHTML = "";

  let count = 0;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    count++;
    table.innerHTML += `
      <tr>
        <td>${data.flightNo}</td>
        <td>${data.destination}</td>
        <td>${data.status}</td>
      </tr>
    `;
  });

  calculateCongestion(count);
}

// Congestion Logic
function calculateCongestion(count) {
  const text = document.getElementById("congestionText");

  if (count <= 2) {
    text.innerHTML = "🟢 Low Congestion";
  } else if (count <= 5) {
    text.innerHTML = "🟠 Medium Congestion";
  } else {
    text.innerHTML = "🔴 High Congestion";
  }
}

// Large Gradient Bar Chart
const ctx = document.getElementById('crowdChart').getContext('2d');
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, "#7c3aed");
gradient.addColorStop(1, "#ec4899");

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
    datasets: [{
      label: 'Passenger Count',
      data: [120, 300, 450, 380, 500, 200],
      backgroundColor: gradient,
      borderRadius: 12,
      borderSkipped: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});

loadFlights();