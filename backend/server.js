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
const port = 5000; // Backend server running on port 5000

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

// Middleware to get the user's first name (from Firebase Auth)
async function getUserFirstName(userId) {
  try {
    const userRecord = await admin.auth().getUser(userId);
    return userRecord.displayName.split(' ')[0]; // Extract the first name
  } catch (error) {
    console.error('Error fetching user:', error);
    return 'Guest'; // Default name if there's an issue
  }
}

// Route to get events and display the first name at the top
app.get('/home', async (req, res) => {
  const userId = req.query.userId;  // Assuming the user ID is passed in the query

  // Get the user's first name
  const firstName = await getUserFirstName(userId);

  // Fetch all events from Firestore
  const eventsRef = db.collection('events');
  const querySnapshot = await eventsRef.get();

  if (querySnapshot.empty) {
    return res.status(404).json({ message: 'No events found' });
  }

  const events = querySnapshot.docs.map(doc => {
    const eventData = doc.data();
    const participantCount = eventData.participants.length;  // Assuming participants are stored as an array
    return {
      id: doc.id,
      event_name: eventData.event_name,
      status: eventData.status,
      participants: participantCount,
    };
  });

  // Send response with the user's first name and the events data
  res.status(200).json({
    message: `Welcome back, ${firstName}`,
    events: events,
  });
});

// Route to search events by name or status
app.get('/search', async (req, res) => {
  const { searchTerm } = req.query;  // User-provided search term (either event name or status)

  // Query Firestore for events that match the search term in either event_name or status
  const eventsRef = db.collection('events');
  const querySnapshot = await eventsRef
    .where('event_name', '>=', searchTerm)
    .where('event_name', '<=', searchTerm + '\uf8ff')
    .get();

  if (querySnapshot.empty) {
    return res.status(404).json({ message: 'No events found matching your search' });
  }

  const events = querySnapshot.docs.map(doc => {
    const eventData = doc.data();
    const participantCount = eventData.participants.length;  // Get participant count
    return {
      id: doc.id,
      event_name: eventData.event_name,
      status: eventData.status,
      participants: participantCount,
    };
  });

  // Return filtered events
  res.status(200).json({ events });
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
