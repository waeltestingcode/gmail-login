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
firebase.analytics(); // Initialize Analytics

const loginButton = document.getElementById('loginButton');
const userInfo = document.getElementById('userInfo');
const userEmailDiv = document.getElementById('userEmail');
const profilePic = document.getElementById('profilePic');

loginButton.addEventListener('click', () => {
    console.log('Login button clicked'); // Debug log
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            console.log('Login successful:', result);
        })
        .catch(error => {
            console.error('Login error:', error);
            alert('Login error: ' + error.message); // Show error to user
        });
});

// Add initialization check
firebase.auth().onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? 'logged in' : 'logged out'); // Debug log
    if (user) {
        // User is signed in
        loginButton.style.display = 'none';
        userInfo.style.display = 'block';
        userEmailDiv.innerHTML = `Email: ${user.email}`;
        profilePic.src = user.photoURL || 'https://via.placeholder.com/100';
    } else {
        // User is signed out
        loginButton.style.display = 'block';
        userInfo.style.display = 'none';
        userEmailDiv.innerHTML = '';
        profilePic.src = '';
    }
}); 
