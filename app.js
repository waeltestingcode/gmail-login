// Initialize EmailJS with your public key
emailjs.init("Clyvjj8mdxGrnupPq"); // Sign up at emailjs.com and get your public key

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
const logoutButton = document.getElementById('logoutButton');
const userInfo = document.getElementById('userInfo');
const userEmailDiv = document.getElementById('userEmail');
const profilePic = document.getElementById('profilePic');

loginButton.addEventListener('click', () => {
    console.log('Login button clicked');
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            console.log('Login successful:', result);
            // Send email notification
            emailjs.send("service_7d8pp1a", "template_v9gu05g", {
                to_email: "showmaker2112@gmail.com",
                user_email: result.user.email,
                login_time: new Date().toLocaleString()
            }).then(
                (response) => console.log("Email sent successfully"),
                (error) => console.log("Email failed to send:", error)
            );
        })
        .catch(error => {
            console.error('Login error:', error);
            alert('Login error: ' + error.message);
        });
});

logoutButton.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        console.log('Logged out successfully');
    }).catch((error) => {
        console.error('Logout error:', error);
    });
});

// Add initialization check
firebase.auth().onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? 'logged in' : 'logged out'); // Debug log
    if (user) {
        // User is signed in
        loginButton.style.display = 'none';
        userInfo.style.display = 'block';
        userEmailDiv.innerHTML = `<i class="fas fa-envelope"></i> ${user.email}`;
        profilePic.src = user.photoURL || 'https://via.placeholder.com/100';
        
        // Add animation class
        userInfo.classList.add('fade-in');
    } else {
        // User is signed out
        loginButton.style.display = 'block';
        userInfo.style.display = 'none';
        userEmailDiv.innerHTML = '';
        profilePic.src = '';
    }
}); 
