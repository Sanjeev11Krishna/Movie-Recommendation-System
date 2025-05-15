import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore
} from "firebase/firestore";
import { toast } from "react-toastify";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDpDVW6DdKqedzXjlAZS0I_MG6XNDJbiFY",
  authDomain: "movie-recommendation-sys-ba865.firebaseapp.com",
  projectId: "movie-recommendation-sys-ba865",
  storageBucket: "movie-recommendation-sys-ba865.appspot.com",
  messagingSenderId: "888032814687",
  appId: "1:888032814687:web:cde82d422d96bbf8d51dea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup function
const signup = async (name, email, password) => {
  console.log("Signup called with:", name, email, password); // 👈 Debugging
  if (!name || !email || !password) {
    alert("Please fill in all fields!");
    return;
  }

  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Save extra user details to Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name: name,
      authProvider: "local",
      email: email,
    });

    toast.error("Signup successful!");
    console.log("User created:", user);
  } catch (error) {
    console.error("Signup error:", error.code, error.message);
    toast.error("email already in use");
}
};

// Login function
const login = async (email, password) => {
  console.log("Login called with:", email, password); // 👈 Debugging
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    toast.error("Invalid username/password");
}
};

// Logout function
const logout = () => {
  signOut(auth)
    .then(() => {
      alert("Logged out successfully!");
    })
    .catch((error) => {
      console.error("Logout error:", error);
      alert("Logout failed: " + error.message);
    });
};

const logUserInteraction = async (uid, interactionType, movieId) => {
  try {
    await addDoc(collection(db, "user_interactions"), {
      uid: uid,
      interactionType: interactionType,  // e.g., "watch_trailer"
      movieId: movieId,
      timestamp: new Date(),
    });
    console.log("Interaction logged:", interactionType, movieId);
  } catch (error) {
    console.error("Error logging interaction:", error);
  }
};


export { auth, db, login, signup, logout, logUserInteraction};
