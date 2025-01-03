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
const userEmailDiv = document.getElementById('userEmail');

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
        loginButton.style.display = 'none';
        userEmailDiv.style.display = 'block';
        userEmailDiv.innerHTML = `Your email: ${user.email}`;
    } else {
        loginButton.style.display = 'block';
        userEmailDiv.style.display = 'none';
    }
}); 