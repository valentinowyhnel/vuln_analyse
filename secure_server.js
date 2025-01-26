// Import required modules
const express = require("express");
const session = require("express-session");
const fs = require("fs");
const bcrypt = require("bcrypt");
const csrf = require("csurf");
require("dotenv").config(); // Pour charger les variables d'environnement depuis le fichier .env

// Initialize the app
const app = express();
const PORT = 3000;
const DATA_FILE = "./database.json";

// Middleware setup
const csrfProtection = csrf({ cookie: true });

// Sécurisation des cookies de session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Utilisation de la variable d'environnement pour la clé secrète
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // Empêche l'accès au cookie via JavaScript
      secure: process.env.NODE_ENV === "production", // En production, le cookie sera envoyé seulement sur HTTPS
      maxAge: 60000, // Durée d'expiration du cookie (1 minute dans cet exemple)
    },
  })
);

app.use(express.json());
app.use(csrfProtection); // Protection CSRF pour toutes les routes suivantes

// Serve static files
app.use("/public", express.static("public"));
app.use("/protected", (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized");
  }
  next();
});
app.use("/protected", express.static("private/protected"));

// Helper function to read and write to the JSON file
const readData = async () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      // Initialiser un fichier vide avec des valeurs par défaut
      await writeData({ users: [], tasks: [] });
    }
    const data = await fs.promises.readFile(DATA_FILE);
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading data:", err);
    throw err;
  }
};

const writeData = async (data) => {
  try {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing data:", err);
    throw err;
  }
};

// Routes

// Home route
app.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/public/login.html");
  }
  res.redirect("/protected/index.html");
});

// Register route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Invalid input");
  }
  try {
    const data = await readData();
    const userExists = data.users.find((u) => u.username === username);

    if (userExists) {
      return res.status(400).send("User already exists");
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    data.users.push({ username, password: hashedPassword });
    await writeData(data);
    res.status(201).send("User registered successfully");
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Invalid input");
  }
  try {
    const data = await readData();
    const user = data.users.find((u) => u.username === username);

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      return res.redirect("/protected/index.html");
    } else {
      return res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

// Dashboard route (protected)
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized");
  }
  res.redirect("/protected/dashboard.html");
});

// Add task route
app.post("/add", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized");
  }

  const { task } = req.body;
  if (!task) {
    return res.status(400).send("Task is required");
  }
  try {
    const data = await readData();
    const taskId = Date.now();
    data.tasks.push({ id: taskId, task, user: req.session.user.username });
    await writeData(data);

    res.redirect("/protected/dashboard.html");
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

// Get tasks for the logged-in user
app.get("/tasks", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const data = await readData();
    const userTasks = data.tasks.filter(
      (task) => task.user === req.session.user.username
    );
    res.json(userTasks);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

// Delete task route
app.delete("/tasks/:id", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized");
  }

  const id = parseInt(req.params.id, 10);
  try {
    const data = await readData();
    data.tasks = data.tasks.filter((t) => t.id !== id);
    await writeData(data);

    res.send("Task deleted");
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/public/login.html");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
