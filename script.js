
const $ = (selector) => document.querySelector(selector);

// Simulated infrastructure data
const servers = [
  { name: "web-server-01", env: "Production", region: "ap-south-1", status: "Online" },
  { name: "api-server-01", env: "Staging", region: "ap-south-1", status: "Online" },
  { name: "worker-node-01", env: "Development", region: "ap-south-2", status: "Online" }
];

let deployments = 12;

function renderServers() {
  $("#serverTable").innerHTML = servers.map(server => `
    <tr>
      <td>${server.name}</td>
      <td>${server.env}</td>
      <td><span class="status-badge">● ${server.status}</span></td>
      <td>${server.region}</td>
    </tr>
  `).join("");
}

function updateMetrics() {
  const cpu = Math.floor(Math.random() * 55) + 20;
  const memory = Math.floor(Math.random() * 40) + 40;

  $("#cpuValue").textContent = `${cpu}%`;
  $("#memoryValue").textContent = `${memory}%`;
  $("#cpuBar").style.width = `${cpu}%`;
  $("#memoryBar").style.width = `${memory}%`;
  $("#serverValue").textContent =
    `${servers.filter(s => s.status === "Online").length} / ${servers.length}`;
  $("#deployValue").textContent = deployments;
}

function addActivity(message, type = "success") {
  const item = document.createElement("li");
  const dot = document.createElement("span");
  const text = document.createElement("span");
  const time = document.createElement("small");

  dot.className = type;
  dot.textContent = "●";
  text.textContent = message;
  time.textContent = new Date().toLocaleTimeString();

  item.append(dot, text, time);
  $("#activityList").prepend(item);

  // Keep the latest 8 events
  while ($("#activityList").children.length > 8) {
    $("#activityList").lastElementChild.remove();
  }
}

$("#refreshBtn").addEventListener("click", () => {
  updateMetrics();
  addActivity("Infrastructure metrics refreshed");
});

$("#themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  addActivity("Dashboard theme changed");
});

// Terminal simulator: these commands do not access a real shell.
const commands = {
  help: () => [
    "Available practice commands:",
    "help                 Show available commands",
    "clear                Clear terminal output",
    "date                 Display current date",
    "whoami               Display simulated user",
    "ls                   List project files",
    "git status            Simulate Git status",
    "docker ps             List simulated containers",
    "kubectl get pods      List simulated Kubernetes pods",
    "systemctl status nginx  Check simulated Nginx status",
    "deploy               Simulate a deployment",
    "metrics               Show current dashboard metrics"
  ].join("\n"),

  date: () => new Date().toString(),

  whoami: () => "devops",

  ls: () => "index.html\nstyle.css\nscript.js",

  "git status": () =>
    "On branch main\nYour branch is up to date with 'origin/main'.\n" +
    "nothing to commit, working tree clean",

  "docker ps": () =>
    "CONTAINER ID   IMAGE          STATUS\n" +
    "a12bc34        nginx:latest   Up 2 hours\n" +
    "d56ef78        node:20        Up 1 hour",

  "kubectl get pods": () =>
    "NAME                 READY   STATUS\n" +
    "web-app-7d8f         1/1     Running\n" +
    "api-app-5c9b         1/1     Running\n" +
    "worker-app-6a2d      1/1     Running",

  "systemctl status nginx": () =>
    "nginx.service - A simulated web server\n" +
    "Active: active (running)\n" +
    "Note: This is practice output, not your actual system.",

  deploy: () => {
    deployments++;
    updateMetrics();
    addActivity("Simulated deployment completed");
    return "Starting deployment...\nBuild: SUCCESS\nTests: PASSED\nDeployment: SUCCESS";
  },

  metrics: () =>
    `CPU: ${$("#cpuValue").textContent}\n` +
    `Memory: ${$("#memoryValue").textContent}\n` +
    `Servers: ${$("#serverValue").textContent}`
};

function printTerminal(text, className = "") {
  const line = document.createElement("p");
  line.textContent = text;
  if (className) line.className = className;

  $("#terminalOutput").appendChild(line);
  $("#terminalOutput").scrollTop = $("#terminalOutput").scrollHeight;
}

$("#terminalForm").addEventListener("submit", event => {
  event.preventDefault();

  const input = $("#commandInput");
  const command = input.value.trim().toLowerCase();

  if (!command) return;

  printTerminal(`devops@lab:~$ ${command}`, "command-text");
  input.value = "";

  if (command === "clear") {
    $("#terminalOutput").replaceChildren();
    return;
  }

  if (commands[command]) {
    printTerminal(commands[command]());
    addActivity(`Terminal command executed: ${command}`);
  } else {
    printTerminal(
      `Command not found: ${command}\nType "help" to see supported commands.`
    );
    addActivity(`Unknown terminal command: ${command}`, "warning");
  }
});

$("#clearBtn").addEventListener("click", () => {
  $("#terminalOutput").replaceChildren();
  $("#commandInput").focus();
});

// Highlight the current navigation link
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll("nav a").forEach(item => {
      item.classList.remove("active");
    });
    link.classList.add("active");
  });
});

// Initialize the dashboard
renderServers();
updateMetrics();
addActivity("Dashboard initialized");

printTerminal("Try: help");
