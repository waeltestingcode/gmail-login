// Initialize EmailJS with your public key
emailjs.init("Clyvjj8mdxGrnupPq");

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxfapZXARQxbREBs9saaAbeXKRnQ2-CYo",
    authDomain: "waelsimplesignin.firebaseapp.com",
    projectId: "waelsimplesignin",
    storageBucket: "waelsimplesignin.firebasestorage.app",
    messagingSenderId: "9955667810",
    appId: "1:9955667810:web:efa5fd98055f340f6d063b",
    measurementId: "G-CB37BH3T13"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const userInfo = document.getElementById('userInfo');
const userEmailDiv = document.getElementById('userEmail');
const profilePic = document.getElementById('profilePic');
const userDetailsForm = document.getElementById('userDetailsForm');

loginButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            emailjs.send("service_7d8pp1a", "template_v9gu05g", {
                to_email: "showmaker2112@gmail.com",
                user_email: result.user.email,
                login_time: new Date().toLocaleString()
            });
        })
        .catch(error => {
            alert('Login error: ' + error.message);
        });
});

logoutButton.addEventListener('click', () => {
    firebase.auth().signOut();
});

userDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = firebase.auth().currentUser;
    
    const userData = {
        email: user.email,
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        createdAt: new Date()
    };

    db.collection('users').doc(user.uid).set(userData)
        .then(() => {
            userDetailsForm.style.display = 'none';
            userInfo.style.display = 'block';
            // Update profile display with user data
            updateProfileDisplay(user, userData);
        })
        .catch(error => {
            alert('Error saving user details: ' + error.message);
        });
});

// Add this new function to handle profile display
function updateProfileDisplay(user, userData) {
    // Create a clean display of user data
    const userProfile = `
        <div class="profile-container">
            <img id="profilePic" src="${user.photoURL || 'https://via.placeholder.com/100'}" alt="Profile Picture">
            <div class="profile-info">
                <h2>${userData.name}</h2>
                <div class="info-item">
                    <i class="fas fa-envelope"></i>
                    <span>${user.email}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-birthday-cake"></i>
                    <span>${userData.age} years old</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-venus-mars"></i>
                    <span>${userData.gender}</span>
                </div>
            </div>
            <button id="logoutButton" class="logout-btn">Logout</button>
        </div>
    `;
    
    userInfo.innerHTML = userProfile;
    userInfo.classList.add('fade-in');

    // Reattach logout button event listener
    document.getElementById('logoutButton').addEventListener('click', () => {
        firebase.auth().signOut();
    });
}

// Update the auth state change handler
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        loginButton.style.display = 'none';
        
        // Fetch user data from Firestore
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    userDetailsForm.style.display = 'none';
                    userInfo.style.display = 'block';
                    updateProfileDisplay(user, userData);
                } else {
                    userDetailsForm.style.display = 'block';
                    userInfo.style.display = 'none';
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
    } else {
        loginButton.style.display = 'block';
        userDetailsForm.style.display = 'none';
        userInfo.style.display = 'none';
        userInfo.innerHTML = ''; // Clear the user info
    }
}); 
