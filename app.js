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
        })
        .catch(error => {
            alert('Error saving user details: ' + error.message);
        });
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        loginButton.style.display = 'none';
        
        // Check if user details exist in Firestore
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    // User details exist, show profile
                    userDetailsForm.style.display = 'none';
                    userInfo.style.display = 'block';
                    userEmailDiv.innerHTML = `<i class="fas fa-envelope"></i> ${user.email}`;
                    profilePic.src = user.photoURL || 'https://via.placeholder.com/100';
                    userInfo.classList.add('fade-in');
                } else {
                    // New user, show form
                    userDetailsForm.style.display = 'block';
                    userInfo.style.display = 'none';
                }
            });
    } else {
        loginButton.style.display = 'block';
        userDetailsForm.style.display = 'none';
        userInfo.style.display = 'none';
        userEmailDiv.innerHTML = '';
        profilePic.src = '';
    }
}); 
