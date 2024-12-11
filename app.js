import { firebaseConfig } from './firebaseConfig.js';

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const signInBtn = document.getElementById("sign-in-btn");
const signOutBtn = document.getElementById("sign-out-btn");
const chatDiv = document.getElementById("chat");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message-input");

signInBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
        console.log("Signed in as: " + result.user.displayName);
        signInBtn.style.display = "none";
        signOutBtn.style.display = "inline";
        chatDiv.style.display = "block"; // Show the chat interface
    }).catch((error) => {
        console.log("Error signing in: " + error.message);
    });
});

// Sign out the user
signOutBtn.addEventListener("click", () => {
    firebase.auth().signOut().then(() => {
        console.log("Signed out.");
        signInBtn.style.display = "inline";
        signOutBtn.style.display = "none";
        chatDiv.style.display = "none"; // Hide the chat interface
    }).catch((error) => {
        console.log("Error signing out: " + error.message);
    });
});

const sendMessage = () => {
    const messageText = messageInput.value.trim();
    if (messageText !== "") {
        firebase.firestore().collection("messages").add({
            text: messageText,
            user: firebase.auth().currentUser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            messageInput.value = ""; // Clear the input field
        }).catch((error) => {
            console.log("Error sending message: " + error.message);
        });
    }
};

// Listen for new messages in Firestore
const displayMessages = () => {
    firebase.firestore().collection("messages")
        .orderBy("timestamp")
        .onSnapshot((snapshot) => {
            messagesDiv.innerHTML = ""; // Clear previous messages
            snapshot.forEach((doc) => {
                const messageData = doc.data();
                const messageElement = document.createElement("div");
                messageElement.textContent = `${messageData.user}: ${messageData.text}`;
                messagesDiv.appendChild(messageElement);
            });
        });
};

// Send message when the button is clicked
document.getElementById("send-btn").addEventListener("click", sendMessage);

// Call this function to start displaying messages when the app loads
displayMessages();