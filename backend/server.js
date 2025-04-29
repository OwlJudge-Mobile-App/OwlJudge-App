// Import necessary libraries
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const multer = require("multer");
const path = require("path");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // path to your Firebase service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "owl-judge-mobile-app.firebasestorage.app", // Firebase storage bucket URL
});

const db = admin.firestore();
const app = express();
const storage = admin.storage().bucket(); // Firebase storage bucket reference
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

// Middleware to get the user's first name (from Firebase Auth)
async function getUserFirstName(userId) {
  try {
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      console.error("User not found for ID:", userId);
      return null;
    }

    const userData = userDoc.data();
    return userData.firstName || null;
  } catch (error) {
    console.error("Error fetching user's first name:", error);
    return null;
  }
}

// Route to get events and display the first name at the top
app.get("/home", async (req, res) => {
  const userId = req.query.userId; // Assuming the user ID is passed in the query

  // Get the user's first name
  const firstName = await getUserFirstName(userId);

  // Fetch all events from Firestore
  const eventsRef = db.collection("events");
  const querySnapshot = await eventsRef
    .where("judgeIds", "array-contains", userId)
    .get();

  if (querySnapshot.empty) {
    return res.status(404).json({ message: "No events found" });
  }

  const events = querySnapshot.docs.map((doc) => {
    const eventData = doc.data();
    return {
      id: doc.id,
      event_name: eventData.name,
      status: eventData.status,
      participants: eventData.projectCount,
    };
  });

  // Send response with the user's first name and the events data
  res.status(200).json({
    message: firstName,
    events: events,
  });
});

// Route to search events by name or status
app.get("/search", async (req, res) => {
  const { searchTerm } = req.query; // User-provided search term (either event name or status)

  // Query Firestore for events that match the search term in either event_name or status
  const eventsRef = db.collection("events");
  const querySnapshot = await eventsRef
    .where("event_name", ">=", searchTerm)
    .where("event_name", "<=", searchTerm + "\uf8ff")
    .get();

  if (querySnapshot.empty) {
    return res
      .status(404)
      .json({ message: "No events found matching your search" });
  }

  const events = querySnapshot.docs.map((doc) => {
    const eventData = doc.data();
    const participantCount = eventData.participants.length; // Get participant count
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

// Route to get event and project details
app.get("/event-details", async (req, res) => {
  const eventId = req.query.eventId; // Event ID passed as a query parameter

  try {
    // Fetch the event data (name, ID, start/end dates)
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    const eventData = eventDoc.data();
    console.log(eventData);

    // Fetch the list of projects associated with the event
    const projectsRef = db.collection("projects");
    const projectSnapshot = await projectsRef
      .where("eventId", "==", eventId)
      .get();

    if (projectSnapshot.empty) {
      return res
        .status(404)
        .json({ message: "No projects found for this event" });
    }

    const projects = projectSnapshot.docs.map((doc) => {
      const projectData = doc.data();

      // Determine the color based on the status of the project
      const statusColor = projectData.status === "Published" ? "green" : "red";

      return {
        id: doc.id,
        project_name: projectData.name,
        grade: projectData.grade,
        published: projectData.status, // "Published" or "Not Published"
      };
    });

    // Send the response with event data and projects
    res.status(200).json({
      event_name: eventData.name,
      event_id: eventId,
      start_date: eventData.startDate.toDate(),
      end_date: eventData.endDate.toDate(),
      projects: projects,
    });
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ message: "Error retrieving event details" });
  }
});

// Route to get event and project details
app.get("/project-details", async (req, res) => {
  const { eventId, projectId } = req.query; // Event and Project ID passed as query parameters

  try {
    // Fetch the event data (name, ID, start/end dates)
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    const eventData = eventDoc.data();

    // Fetch the project data
    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).json({ message: "Project not found" });
    }

    const projectData = projectDoc.data();

    // Send the event and project data as response
    res.status(200).json({
      event_name: eventData.name,
      event_id: eventId,
      start_date: eventData.startDate.toDate(),
      end_date: eventData.endDate.toDate(),
      project: {
        project_name: projectData.name,
        category: projectData.category,
        participant_name: projectData.participantName,
        phone: projectData.phone,
        description: projectData.description,
        link: projectData.link,
        grade: projectData.grade,
        status: projectData.status,
        published: projectData.published,
      },
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ message: "Error retrieving project details" });
  }
});

// Route to publish the project
app.post("/publish", async (req, res) => {
  const { eventId, projectId } = req.body; // Event and Project ID passed in the request body

  try {
    // Fetch the project document
    const projectRef = db
      .collection("events")
      .doc(eventId)
      .collection("projects")
      .doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update the project status to "Published"
    await projectRef.update({
      status: "Published",
    });

    res.status(200).json({ message: "Project published successfully" });
  } catch (error) {
    console.error("Error publishing project:", error);
    res.status(500).json({ message: "Error publishing project" });
  }
});

// Route to submit the project
app.post("/submit", async (req, res) => {
  const { eventId, projectId, grade } = req.body; // Event and Project ID along with the grade

  try {
    // Fetch the project document
    const projectRef = db
      .collection("events")
      .doc(eventId)
      .collection("projects")
      .doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update the project with the grade and mark it as submitted
    await projectRef.update({
      grade: grade,
      submitted: true,
    });

    res.status(200).json({ message: "Project submitted successfully" });
  } catch (error) {
    console.error("Error submitting project:", error);
    res.status(500).json({ message: "Error submitting project" });
  }
});

// Multer setup for handling image uploads
const storageConfig = multer.memoryStorage(); // Store files in memory
const upload = multer({
  storage: storageConfig,
  fileFilter: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (
      fileExtension === ".jpg" ||
      fileExtension === ".jpeg" ||
      fileExtension === ".png"
    ) {
      cb(null, true); // Accept image files
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Route to get user details
app.get("/profile", async (req, res) => {
  const userId = req.query.userId; // User ID passed as a query parameter

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();
    res.status(200).json({
      first_name: userData.first_name,
      last_name: userData.last_name,
      telephone: userData.telephone,
      email: userData.email,
      role: userData.role,
      profile_picture_url: userData.profile_picture_url || "",
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error retrieving user profile" });
  }
});

// Route to update user details
app.post(
  "/update-profile",
  upload.single("profile_picture"),
  async (req, res) => {
    const { userId, firstName, lastName, telephone, email, role } = req.body;
    const profilePicture = req.file;

    try {
      // Upload the profile picture to Firebase Storage if a new one is provided
      let profilePictureUrl = "";
      if (profilePicture) {
        const fileName = `${userId}_${Date.now()}${path.extname(
          profilePicture.originalname
        )}`;
        const file = storage.file(fileName);
        const stream = file.createWriteStream({
          metadata: {
            contentType: profilePicture.mimetype,
          },
        });

        stream.on("error", (err) => {
          console.error("Error uploading profile picture:", err);
          return res
            .status(500)
            .json({ message: "Error uploading profile picture" });
        });

        stream.on("finish", async () => {
          profilePictureUrl = `https://storage.googleapis.com/${storage.name}/${fileName}`; // Get the public URL of the uploaded file
          await file.makePublic(); // Make the file publicly accessible
        });

        stream.end(profilePicture.buffer);
      }

      // Update user data in Firestore
      const userRef = db.collection("users").doc(userId);
      await userRef.update({
        first_name: firstName,
        last_name: lastName,
        telephone: telephone,
        email: email,
        role: role,
        profile_picture_url: profilePictureUrl, // Update the profile picture URL if it was uploaded
        updated_at: admin.firestore.Timestamp.now(),
      });

      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Error updating profile" });
    }
  }
);

// Route to create a new event
app.post("/create-event", async (req, res) => {
  const {
    eventName,
    startDate,
    endDate,
    location,
    numParticipants,
    judges,
    criteria,
  } = req.body;

  // Validate required fields
  if (
    !eventName ||
    !startDate ||
    !endDate ||
    !location ||
    numParticipants == null ||
    !judges ||
    !criteria
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new event in Firestore
    const eventRef = db.collection("events").doc(); // Generate a new event ID automatically
    await eventRef.set({
      event_name: eventName,
      start_date: admin.firestore.Timestamp.fromDate(new Date(startDate)),
      end_date: admin.firestore.Timestamp.fromDate(new Date(endDate)),
      location: location,
      num_participants: numParticipants,
      judges: judges, // judges should be an array of judge IDs or names
      criteria: criteria,
      created_at: admin.firestore.Timestamp.now(),
      updated_at: admin.firestore.Timestamp.now(),
    });

    res
      .status(201)
      .json({ message: "Event created successfully", eventId: eventRef.id });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event" });
  }
});

// Route to get all projects for an event
app.get("/projects", async (req, res) => {
  const eventId = req.query.eventId; // Event ID passed as a query parameter

  try {
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Fetch projects under the event
    const projectsRef = eventRef.collection("projects");
    const projectSnapshot = await projectsRef.get();

    if (projectSnapshot.empty) {
      return res
        .status(404)
        .json({ message: "No projects found for this event" });
    }

    const projects = projectSnapshot.docs.map((doc) => {
      const projectData = doc.data();
      return {
        id: doc.id,
        project_name: projectData.project_name,
        grade: projectData.grade,
        status: projectData.status,
        submission_date: projectData.submission_date.toDate(),
        criteria: projectData.criteria,
      };
    });

    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Error retrieving projects" });
  }
});

// Route to delete a project by its ID
app.delete("/delete-project", async (req, res) => {
  const { eventId, projectId } = req.body;

  try {
    const projectRef = db
      .collection("events")
      .doc(eventId)
      .collection("projects")
      .doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete the project
    await projectRef.delete();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Error deleting project" });
  }
});

// Route to add a new project to an event
app.post("/add-project", async (req, res) => {
  const {
    eventId,
    projectName,
    category,
    participantName,
    telephone,
    description,
    link,
    grade,
  } = req.body;

  try {
    const eventRef = db.collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Add new project to Firestore
    const newProjectRef = eventRef.collection("projects").doc(); // Generate a new project ID
    await newProjectRef.set({
      project_name: projectName,
      category: category,
      participant_name: participantName,
      telephone: telephone,
      description: description,
      link: link,
      grade: grade,
      status: "Not Published", // Default status
      submission_date: admin.firestore.Timestamp.now(),
      criteria: "Criteria to be defined", // Placeholder for criteria
    });

    res.status(201).json({
      message: "Project created successfully",
      projectId: newProjectRef.id,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error creating project" });
  }
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
