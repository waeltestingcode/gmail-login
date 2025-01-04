// Configuration and Initialization
const firebaseConfig = {
    apiKey: "AIzaSyAxfapZXARQxbREBs9saaAbeXKRnQ2-CYo",
    authDomain: "waelsimplesignin.firebaseapp.com",
    projectId: "waelsimplesignin",
    storageBucket: "waelsimplesignin.firebasestorage.app",
    messagingSenderId: "9955667810",
    appId: "1:9955667810:web:efa5fd98055f340f6d063b",
    measurementId: "G-CB37BH3T13"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
emailjs.init("Clyvjj8mdxGrnupPq");

// Database initialization
const db = firebase.firestore();

// DOM Elements
const elements = {
    loginButton: document.getElementById('loginButton'),
    userInfo: document.getElementById('userInfo'),
    userDetailsForm: document.getElementById('userDetailsForm')
};

// User Interface Functions
function updateProfileDisplay(user, userData) {
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
            <div class="button-group">
                <button id="editButton" class="edit-btn">
                    <i class="fas fa-edit"></i> Edit Profile
                </button>
                <button id="logoutButton" class="logout-btn">Logout</button>
            </div>
        </div>
    `;
    
    elements.userInfo.innerHTML = userProfile;
    elements.userInfo.classList.add('fade-in');
    attachLogoutHandler();
    attachEditHandler(userData);
}

function showUserProfile(user, userData) {
    elements.userDetailsForm.style.display = 'none';
    elements.userInfo.style.display = 'block';
    updateProfileDisplay(user, userData);
}

function showLoginForm() {
    elements.loginButton.style.display = 'block';
    elements.userDetailsForm.style.display = 'none';
    elements.userInfo.style.display = 'none';
    elements.userInfo.innerHTML = '';
}

function showDetailsForm() {
    elements.userDetailsForm.style.display = 'block';
    elements.userInfo.style.display = 'none';
}

// Event Handlers
function handleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            sendLoginNotification(result.user.email);
        })
        .catch(error => {
            alert('Login error: ' + error.message);
        });
}

// Add this function to check if name exists
async function isNameTaken(name, currentUserId) {
    const snapshot = await db.collection('users')
        .where('name', '==', name)
        .get();
    
    // Check if any other user has this name
    return snapshot.docs.some(doc => doc.id !== currentUserId);
}

// Modify the handleUserDetailsSubmit function for initial registration
async function handleUserDetailsSubmit(e) {
    e.preventDefault();
    const user = firebase.auth().currentUser;
    const newName = document.getElementById('name').value;
    
    try {
        // Check if name is taken
        if (await isNameTaken(newName, user.uid)) {
            alert('This name is already taken. Please choose another name.');
            return;
        }

        const userData = {
            email: user.email,
            name: newName,
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            createdAt: new Date()
        };

        await db.collection('users').doc(user.uid).set(userData);
        showUserProfile(user, userData);
    } catch (error) {
        alert('Error saving user details: ' + error.message);
    }
}

function attachLogoutHandler() {
    document.getElementById('logoutButton').addEventListener('click', () => {
        firebase.auth().signOut();
    });
}

function attachEditHandler(userData) {
    document.getElementById('editButton').addEventListener('click', () => {
        const editForm = `
            <div class="profile-container">
                <img id="profilePic" src="${firebase.auth().currentUser.photoURL || 'https://via.placeholder.com/100'}" alt="Profile Picture">
                <form id="editProfileForm" class="profile-info">
                    <div class="form-group">
                        <label for="editName">Name:</label>
                        <input type="text" id="editName" value="${userData.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="editAge">Age:</label>
                        <input type="number" id="editAge" value="${userData.age}" required min="1" max="120">
                    </div>
                    <div class="form-group">
                        <label for="editGender">Gender:</label>
                        <select id="editGender" required>
                            <option value="male" ${userData.gender === 'male' ? 'selected' : ''}>Male</option>
                            <option value="female" ${userData.gender === 'female' ? 'selected' : ''}>Female</option>
                            <option value="other" ${userData.gender === 'other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="button-group">
                        <button type="submit" class="save-btn">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                        <button type="button" id="cancelEdit" class="cancel-btn">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        elements.userInfo.innerHTML = editForm;
        attachEditFormHandlers(userData);
    });
}

// Modify the attachEditFormHandlers function for editing
function attachEditFormHandlers(originalData) {
    const editForm = document.getElementById('editProfileForm');
    const cancelButton = document.getElementById('cancelEdit');
    
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = firebase.auth().currentUser;
        const newName = document.getElementById('editName').value;
        
        try {
            // Only check for name uniqueness if the name has changed
            if (newName !== originalData.name) {
                if (await isNameTaken(newName, user.uid)) {
                    alert('This name is already taken. Please choose another name.');
                    return;
                }
            }

            const updatedData = {
                ...originalData,
                name: newName,
                age: parseInt(document.getElementById('editAge').value),
                gender: document.getElementById('editGender').value,
                updatedAt: new Date()
            };

            await db.collection('users').doc(user.uid).update(updatedData);
            showUserProfile(user, updatedData);
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        }
    });

    cancelButton.addEventListener('click', () => {
        showUserProfile(firebase.auth().currentUser, originalData);
    });
}

function sendLoginNotification(userEmail) {
    emailjs.send("service_7d8pp1a", "template_v9gu05g", {
        to_email: "showmaker2112@gmail.com",
        user_email: userEmail,
        login_time: new Date().toLocaleString()
    });
}

// Event Listeners
elements.loginButton.addEventListener('click', handleLogin);
elements.userDetailsForm.addEventListener('submit', handleUserDetailsSubmit);

// Auth State Observer
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        showLoginForm();
        return;
    }

    elements.loginButton.style.display = 'none';
    
    db.collection('users').doc(user.uid).get()
        .then((doc) => {
            doc.exists ? 
                showUserProfile(user, doc.data()) : 
                showDetailsForm();
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
}); 
