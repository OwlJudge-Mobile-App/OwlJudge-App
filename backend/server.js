// Import necessary libraries
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // path to your Firebase service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const port = 3000; // Backend server running on port 5000

app.use(
  cors({
    origin: "*", // During development, allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse incoming request bodies
app.use(bodyParser.json());

// Firebase Authentication logic
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate user using Firebase Admin SDK
    const userRecord = await admin.auth().getUserByEmail(email);

    if (userRecord) {
      // Simulate Firebase Authentication success
      // You can implement your own logic for checking password, but Firebase Authentication uses JWT tokens
      const token = await admin.auth().createCustomToken(userRecord.uid); // Firebase custom token

      // Respond with the token
      res.status(200).json({ message: "Login successful", token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Sign Up Route
app.post("/signup", async (req, res) => {
  console.log("Hello World!");

  const { id, firstName, lastName, email, phone } = req.body;

  try {
    // Save additional user details in Firestore
    const userRef = db.collection("users").doc(id); // Store the user's Firestore document using their UID
    await userRef.set({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      created_at: admin.firestore.Timestamp.now(),
      updated_at: admin.firestore.Timestamp.now(),
    });

    // Send a response back to the client
    res.status(201).json({
      message: "User created successfully!",
      userId: id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error during signup. Please try again." });
  }
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
