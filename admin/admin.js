// Firebase Admin Panel for WorkBridge Jobs
// This file handles authentication, job posting, management, and applications viewing

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import {
    browserLocalPersistence,
    getAuth,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    orderBy,
    query,
    Timestamp
} from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

// Firebase configuration (using environment variables pattern)
const firebaseConfig = {
    apiKey: "AIzaSyB7tV28HxBcxU6nKMgqZpAe5RnyC-jvJU8",
    authDomain: "workbridge-273ad.firebaseapp.com",
    projectId: "workbridge-273ad",
    storageBucket: "workbridge-273ad.firebasestorage.app",
    messagingSenderId: "1092375078581",
    appId: "1:1092375078581:web:9d9c4d58996ede2da7c0fc",
    measurementId: "G-T8DZ5Z73Z9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Set authentication persistence to local (survives browser restarts)
setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Error setting auth persistence:', error);
});

// ADMIN CONFIGURATION - Add your email address here
const ADMIN_EMAILS = [
    'nkstefaans1@gmail.com'  // Authorized admin email
];

// SESSION MANAGEMENT CONFIGURATION
const SESSION_CONFIG = {
    idleTimeoutMinutes: 30,        // Auto-logout after 30 minutes of inactivity
    warningTimeoutMinutes: 25,     // Show warning 5 minutes before logout
    activityCheckInterval: 60000,  // Check activity every minute
    tokenRefreshInterval: 300000   // Refresh token every 5 minutes
};

// Activity tracking variables
let lastActivityTime = Date.now();
let sessionTimer = null;
let warningTimer = null;
let activityCheckTimer = null;
let tokenRefreshTimer = null;

// Collections
const jobsCollection = collection(db, 'jobs');
const applicationsCollection = collection(db, 'applications');

// Global state
let currentJobs = [];
let currentApplications = [];
let currentUser = null;

// DOM Elements - Authentication
const loadingScreen = document.getElementById('loadingScreen');
const loginScreen = document.getElementById('loginScreen');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const loginErrorMessage = document.getElementById('loginErrorMessage');
const logoutBtn = document.getElementById('logoutBtn');
const userEmail = document.getElementById('userEmail');

// DOM Elements - Admin Panel
const tabs = {
    postJob: document.getElementById('postJobTab'),
    extractJobs: document.getElementById('extractJobsTab'),
    manageJobs: document.getElementById('manageJobsTab'),
    applications: document.getElementById('applicationsTab')
};

const panels = {
    postJob: document.getElementById('postJobPanel'),
    extractJobs: document.getElementById('extractJobsPanel'),
    manageJobs: document.getElementById('manageJobsPanel'),
    applications: document.getElementById('applicationsPanel')
};

const jobForm = document.getElementById('jobForm');
const connectionStatus = document.getElementById('connectionStatus');
const sessionStatus = document.getElementById('sessionStatus');

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', async () => {
    setupAuthenticationListeners();
    // Don't initialize auth state immediately - let onAuthStateChanged handle it
    // Wait for Firebase Auth to determine current state
    console.log('Admin panel loaded, waiting for auth state...');
});

// Authentication Functions
function setupAuthenticationListeners() {
    // Login form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Auth state change listener with proper handling
    onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed:', user ? user.email : 'No user');
        
        // Hide loading screen once we have auth state
        hideLoadingScreen();
        
        if (user && isAuthorizedUser(user.email)) {
            console.log('Authorized user detected, showing admin panel');
            currentUser = user;
            showAdminPanel();
        } else if (user && !isAuthorizedUser(user.email)) {
            // User is logged in but not authorized
            console.log('Unauthorized user detected, signing out');
            showLoginError('Access denied. You are not authorized to access this admin panel.');
            signOut(auth);
        } else {
            console.log('No user or signed out, showing login screen');
            currentUser = null;
            showLoginScreen();
        }
    });
}

function isAuthorizedUser(email) {
    return ADMIN_EMAILS.includes(email);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Check if email is in whitelist first
    if (!isAuthorizedUser(email)) {
        showLoginError('Access denied. This email is not authorized to access the admin panel.');
        return;
    }
    
    try {
        // Show loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i data-lucide="loader-2" class="h-4 w-4 mr-2 loading"></i>Signing in...';
        hideLoginError();
        
        // Sign in with Firebase Auth
        await signInWithEmailAndPassword(auth, email, password);
        
        // Success will be handled by onAuthStateChanged listener
        
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. Please check your credentials.';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email address.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address format.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your connection.';
                break;
        }
        
        showLoginError(errorMessage);
    } finally {
        // Reset button
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<span class="absolute left-0 inset-y-0 flex items-center pl-3"><i data-lucide="lock" class="h-5 w-5 text-blue-500 group-hover:text-blue-400"></i></span>Sign in';
        lucide.createIcons();
    }
}

async function handleLogout() {
    try {
        await signOut(auth);
        showMessage('Successfully logged out', 'success');
    } catch (error) {
        console.error('Logout error:', error);
        showMessage('Error logging out', 'error');
    }
}

function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
}

function showLoginScreen() {
    hideLoadingScreen();
    loginScreen.classList.remove('hidden');
    adminPanel.classList.add('hidden');
    document.title = 'WorkBridge Admin - Login';
    
    // Clear session management when showing login screen
    clearAllTimers();
    hideSessionWarning();
}

function showAdminPanel() {
    hideLoadingScreen();
    loginScreen.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    document.title = 'WorkBridge Admin - Job Management';
    
    // Update user info
    if (currentUser) {
        userEmail.textContent = currentUser.email;
    }
    
    // Initialize admin panel
    initializeTabs();
    setupEventListeners();
    initializeJobExtraction(); // Initialize job extraction functionality
    testFirebaseConnection();
    loadJobs();
    loadApplications();
    
    // Initialize session management
    initializeSessionManagement();
}

function showLoginError(message) {
    loginErrorMessage.textContent = message;
    loginError.classList.remove('hidden');
    lucide.createIcons();
}

function hideLoginError() {
    loginError.classList.add('hidden');
}

// SESSION MANAGEMENT FUNCTIONS
function initializeSessionManagement() {
    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    activityEvents.forEach(event => {
        document.addEventListener(event, updateLastActivity, true);
    });
    
    // Start activity monitoring
    startActivityMonitoring();
    
    // Update session status
    updateSessionStatus('active', 'Session Active', 'green');
    
    console.log('✅ Session management initialized');
}

function updateLastActivity() {
    lastActivityTime = Date.now();
    
    // Clear any existing warning
    hideSessionWarning();
    
    // Reset timers
    resetSessionTimers();
}

function startActivityMonitoring() {
    // Check activity every minute
    activityCheckTimer = setInterval(() => {
        const timeSinceActivity = Date.now() - lastActivityTime;
        const idleTimeoutMs = SESSION_CONFIG.idleTimeoutMinutes * 60 * 1000;
        const warningTimeoutMs = SESSION_CONFIG.warningTimeoutMinutes * 60 * 1000;
        
        if (timeSinceActivity >= idleTimeoutMs) {
            // Auto-logout due to inactivity
            console.log('🕒 Session expired due to inactivity');
            handleSessionExpired();
        } else if (timeSinceActivity >= warningTimeoutMs) {
            // Show warning
            showSessionWarning();
        }
    }, SESSION_CONFIG.activityCheckInterval);
    
    // Start token refresh timer
    startTokenRefresh();
}

function startTokenRefresh() {
    tokenRefreshTimer = setInterval(async () => {
        if (currentUser) {
            try {
                // Force token refresh
                await currentUser.getIdToken(true);
                console.log('🔄 Authentication token refreshed');
            } catch (error) {
                console.error('❌ Token refresh failed:', error);
                // Don't auto-logout on token refresh failure, let user continue
            }
        }
    }, SESSION_CONFIG.tokenRefreshInterval);
}

function resetSessionTimers() {
    // Clear existing timers
    if (sessionTimer) clearTimeout(sessionTimer);
    if (warningTimer) clearTimeout(warningTimer);
    
    const idleTimeoutMs = SESSION_CONFIG.idleTimeoutMinutes * 60 * 1000;
    const warningTimeoutMs = SESSION_CONFIG.warningTimeoutMinutes * 60 * 1000;
    
    // Set new warning timer
    warningTimer = setTimeout(() => {
        showSessionWarning();
    }, warningTimeoutMs);
    
    // Set new session timeout
    sessionTimer = setTimeout(() => {
        handleSessionExpired();
    }, idleTimeoutMs);
}

function showSessionWarning() {
    const timeLeft = SESSION_CONFIG.idleTimeoutMinutes - SESSION_CONFIG.warningTimeoutMinutes;
    
    // Update session status to warning
    updateSessionStatus('warning', `Expires in ${timeLeft}min`, 'yellow');
    
    const warningHtml = `
        <div id="sessionWarning" class="fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-lg z-50 max-w-sm">
            <div class="flex items-center">
                <i data-lucide="clock" class="h-5 w-5 mr-2"></i>
                <div>
                    <h4 class="font-medium">Session Warning</h4>
                    <p class="text-sm">You'll be logged out in ${timeLeft} minutes due to inactivity.</p>
                    <button onclick="extendSession()" class="mt-2 text-sm bg-yellow-200 hover:bg-yellow-300 px-3 py-1 rounded">
                        Stay Logged In
                    </button>
                </div>
                <button onclick="hideSessionWarning()" class="ml-auto text-yellow-500 hover:text-yellow-700">
                    <i data-lucide="x" class="h-4 w-4"></i>
                </button>
            </div>
        </div>
    `;
    
    // Remove existing warning
    hideSessionWarning();
    
    // Add new warning
    document.body.insertAdjacentHTML('beforeend', warningHtml);
    lucide.createIcons();
    
    console.log(`⚠️ Session warning displayed - ${timeLeft} minutes remaining`);
}

function hideSessionWarning() {
    const warning = document.getElementById('sessionWarning');
    if (warning) {
        warning.remove();
    }
    
    // Reset session status to active if user is still logged in
    if (currentUser) {
        updateSessionStatus('active', 'Session Active', 'green');
    }
}

function handleSessionExpired() {
    console.log('🕒 Session expired - logging out user');
    
    // Clear all timers
    clearAllTimers();
    
    // Show expiration message
    showMessage('Your session has expired due to inactivity. Please log in again.', 'info');
    
    // Sign out user
    signOut(auth);
}

function clearAllTimers() {
    if (sessionTimer) clearTimeout(sessionTimer);
    if (warningTimer) clearTimeout(warningTimer);
    if (activityCheckTimer) clearInterval(activityCheckTimer);
    if (tokenRefreshTimer) clearInterval(tokenRefreshTimer);
    
    sessionTimer = null;
    warningTimer = null;
    activityCheckTimer = null;
    tokenRefreshTimer = null;
}

// Global function for extending session
window.extendSession = function() {
    updateLastActivity();
    hideSessionWarning();
    console.log('✅ Session extended by user action');
};

function updateSessionStatus(status, message, color = 'green') {
    if (!sessionStatus) return;
    
    const statusDot = sessionStatus.querySelector('div');
    const statusText = sessionStatus.querySelector('span');
    
    if (statusDot && statusText) {
        statusDot.className = `w-2 h-2 bg-${color}-400 rounded-full mr-2`;
        statusText.textContent = message;
        statusText.className = `text-xs text-${color}-600`;
    }
}

// Tab Management
function initializeTabs() {
    Object.values(tabs).forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = tab.id.replace('Tab', '');
            switchTab(tabName);
        });
    });
}

function switchTab(activeTab) {
    // Update tab buttons
    Object.values(tabs).forEach(tab => {
        tab.classList.remove('active');
        tab.classList.add('text-gray-500', 'hover:text-gray-700');
        tab.classList.remove('text-blue-600', 'bg-blue-50');
    });
    
    tabs[activeTab].classList.add('active');
    tabs[activeTab].classList.remove('text-gray-500', 'hover:text-gray-700');
    tabs[activeTab].classList.add('text-blue-600', 'bg-blue-50');
    
    // Show/hide panels
    Object.values(panels).forEach(panel => panel.classList.add('hidden'));
    panels[activeTab].classList.remove('hidden');
    
    // Load data when switching to manage tabs
    if (activeTab === 'manageJobs') {
        loadJobs();
    } else if (activeTab === 'applications') {
        loadApplications();
    }
}

// Event Listeners
function setupEventListeners() {
    jobForm.addEventListener('submit', handleJobSubmit);
}

// Firebase Connection Test
async function testFirebaseConnection() {
    try {
        // Try to get jobs collection (just metadata, no documents)
        const testQuery = query(jobsCollection);
        await getDocs(testQuery);
        
        updateConnectionStatus(true, 'Connected to Firebase');
        console.log('✅ Firebase connection successful');
    } catch (error) {
        updateConnectionStatus(false, 'Connection failed');
        console.error('❌ Firebase connection failed:', error);
        showMessage('Firebase connection failed. Please check your configuration.', 'error');
    }
}

function updateConnectionStatus(connected, message) {
    const statusDot = connectionStatus.querySelector('div');
    const statusText = connectionStatus.querySelector('span');
    
    if (connected) {
        statusDot.className = 'w-2 h-2 bg-green-400 rounded-full mr-2';
        statusText.textContent = message;
        statusText.className = 'text-xs text-green-600';
    } else {
        statusDot.className = 'w-2 h-2 bg-red-400 rounded-full mr-2';
        statusText.textContent = message;
        statusText.className = 'text-xs text-red-600';
    }
}

// Job Form Handling
async function handleJobSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitJobBtn');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="h-4 w-4 mr-2 loading"></i>Posting Job...';
        lucide.createIcons();
        
        // Get form data
        const formData = new FormData(jobForm);
        const jobData = {
            title: formData.get('title'),
            company: formData.get('company'),
            location: formData.get('location'),
            description: formData.get('description'),
            job_type: formData.get('job_type'),
            salary_min: formData.get('salary_min') ? parseInt(formData.get('salary_min')) : null,
            salary_max: formData.get('salary_max') ? parseInt(formData.get('salary_max')) : null,
            company_logo: formData.get('company_logo') || null,
            skills: formData.get('skills') ? formData.get('skills').split(',').map(s => s.trim()).filter(s => s) : [],
            posted_date: Timestamp.now()
        };
        
        // Validate required fields
        if (!jobData.title || !jobData.company || !jobData.location || !jobData.description || !jobData.job_type) {
            throw new Error('Please fill in all required fields');
        }
        
        // Add job to Firestore
        const docRef = await addDoc(jobsCollection, jobData);
        console.log('✅ Job posted successfully with ID:', docRef.id);
        
        // Reset form
        jobForm.reset();
        
        // Show success message
        showMessage('Job posted successfully!', 'success');
        
        // Refresh jobs list if on manage tab
        if (!panels.manageJobs.classList.contains('hidden')) {
            loadJobs();
        }
        
    } catch (error) {
        console.error('❌ Error posting job:', error);
        showMessage(error.message || 'Failed to post job. Please try again.', 'error');
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        lucide.createIcons();
    }
}

// Load and Display Jobs
async function loadJobs() {
    const jobsLoading = document.getElementById('jobsLoading');
    const jobsList = document.getElementById('jobsList');
    
    try {
        jobsLoading.classList.remove('hidden');
        jobsList.classList.add('hidden');
        
        const jobsQuery = query(jobsCollection, orderBy('posted_date', 'desc'));
        const snapshot = await getDocs(jobsQuery);
        
        currentJobs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            posted_date: doc.data().posted_date?.toDate()
        }));
        
        displayJobs();
        
    } catch (error) {
        console.error('❌ Error loading jobs:', error);
        showMessage('Failed to load jobs', 'error');
    } finally {
        jobsLoading.classList.add('hidden');
        jobsList.classList.remove('hidden');
    }
}

function displayJobs() {
    const jobsList = document.getElementById('jobsList');
    
    if (currentJobs.length === 0) {
        jobsList.innerHTML = `
            <div class="text-center py-8">
                <i data-lucide="briefcase" class="h-12 w-12 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                <p class="text-gray-500">Start by posting your first job using the form above.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    jobsList.innerHTML = currentJobs.map(job => `
        <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <div class="flex items-center mb-2">
                        ${job.company_logo ? `<img src="${job.company_logo}" alt="Company Logo" class="w-8 h-8 rounded mr-3">` : ''}
                        <h3 class="text-lg font-semibold text-gray-900">${job.title}</h3>
                    </div>
                    <p class="text-gray-600 mb-1">${job.company}</p>
                    <p class="text-sm text-gray-500 mb-2">
                        <i data-lucide="map-pin" class="h-4 w-4 inline mr-1"></i>
                        ${job.location}
                    </p>
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">${job.job_type}</span>
                        ${job.salary_min && job.salary_max ? 
                            `<span>R${job.salary_min.toLocaleString()} - R${job.salary_max.toLocaleString()}</span>` : 
                            job.salary_min ? `<span>From R${job.salary_min.toLocaleString()}</span>` : ''
                        }
                        <span>${formatDate(job.posted_date)}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="viewJobDetails('${job.id}')" 
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-md" title="View Details">
                        <i data-lucide="eye" class="h-4 w-4"></i>
                    </button>
                    <button onclick="deleteJob('${job.id}')" 
                        class="p-2 text-red-600 hover:bg-red-50 rounded-md" title="Delete Job">
                        <i data-lucide="trash-2" class="h-4 w-4"></i>
                    </button>
                </div>
            </div>
            
            ${job.skills && job.skills.length > 0 ? `
                <div class="mb-3">
                    <div class="flex flex-wrap gap-2">
                        ${job.skills.slice(0, 5).map(skill => 
                            `<span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">${skill}</span>`
                        ).join('')}
                        ${job.skills.length > 5 ? `<span class="text-xs text-gray-500">+${job.skills.length - 5} more</span>` : ''}
                    </div>
                </div>
            ` : ''}
            
            <p class="text-gray-700 text-sm line-clamp-3">${job.description.substring(0, 200)}${job.description.length > 200 ? '...' : ''}</p>
        </div>
    `).join('');
    
    lucide.createIcons();
}

// Load and Display Applications
async function loadApplications() {
    const applicationsLoading = document.getElementById('applicationsLoading');
    const applicationsList = document.getElementById('applicationsList');
    
    try {
        applicationsLoading.classList.remove('hidden');
        applicationsList.classList.add('hidden');
        
        const applicationsQuery = query(applicationsCollection, orderBy('applied_date', 'desc'));
        const snapshot = await getDocs(applicationsQuery);
        
        currentApplications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            applied_date: doc.data().applied_date?.toDate()
        }));
        
        displayApplications();
        
    } catch (error) {
        console.error('❌ Error loading applications:', error);
        showMessage('Failed to load applications', 'error');
    } finally {
        applicationsLoading.classList.add('hidden');
        applicationsList.classList.remove('hidden');
    }
}

function displayApplications() {
    const applicationsList = document.getElementById('applicationsList');
    
    if (currentApplications.length === 0) {
        applicationsList.innerHTML = `
            <div class="text-center py-8">
                <i data-lucide="users" class="h-12 w-12 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p class="text-gray-500">Applications will appear here when candidates apply for jobs.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    applicationsList.innerHTML = currentApplications.map(app => {
        const job = currentJobs.find(j => j.id === app.job_id);
        const jobTitle = job ? job.title : 'Unknown Job';
        
        return `
            <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-900">${app.first_name} ${app.last_name}</h3>
                        <p class="text-gray-600 mb-1">Applied for: ${jobTitle}</p>
                        <div class="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span><i data-lucide="mail" class="h-4 w-4 inline mr-1"></i>${app.email}</span>
                            ${app.phone ? `<span><i data-lucide="phone" class="h-4 w-4 inline mr-1"></i>${app.phone}</span>` : ''}
                            <span>${formatDate(app.applied_date)}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        ${app.resume_file ? `
                            <a href="${app.resume_file}" target="_blank" 
                               class="p-2 text-blue-600 hover:bg-blue-50 rounded-md" title="View Resume">
                                <i data-lucide="file-text" class="h-4 w-4"></i>
                            </a>
                        ` : ''}
                        <button onclick="viewApplicationDetails('${app.id}')" 
                            class="p-2 text-green-600 hover:bg-green-50 rounded-md" title="View Details">
                            <i data-lucide="eye" class="h-4 w-4"></i>
                        </button>
                    </div>
                </div>
                
                ${app.cover_letter ? `
                    <div class="bg-gray-50 p-4 rounded-md">
                        <h4 class="font-medium text-gray-900 mb-2">Cover Letter:</h4>
                        <p class="text-gray-700 text-sm">${app.cover_letter.substring(0, 300)}${app.cover_letter.length > 300 ? '...' : ''}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

// Utility Functions
function formatDate(date) {
    if (!date) return 'Unknown';
    return new Intl.DateTimeFormat('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    const messageId = 'message-' + Date.now();
    
    const colors = {
        success: 'bg-green-100 border-green-500 text-green-700',
        error: 'bg-red-100 border-red-500 text-red-700',
        info: 'bg-blue-100 border-blue-500 text-blue-700'
    };
    
    const icons = {
        success: 'check-circle',
        error: 'x-circle',
        info: 'info'
    };
    
    const messageHtml = `
        <div id="${messageId}" class="border-l-4 p-4 mb-4 rounded-md ${colors[type]} max-w-md">
            <div class="flex">
                <i data-lucide="${icons[type]}" class="h-5 w-5 mr-2 flex-shrink-0"></i>
                <p class="text-sm">${message}</p>
                <button onclick="document.getElementById('${messageId}').remove()" class="ml-auto pl-3">
                    <i data-lucide="x" class="h-4 w-4"></i>
                </button>
            </div>
        </div>
    `;
    
    messageContainer.insertAdjacentHTML('beforeend', messageHtml);
    lucide.createIcons();
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        const element = document.getElementById(messageId);
        if (element) element.remove();
    }, 5000);
}

// Global functions for button handlers
window.viewJobDetails = function(jobId) {
    const job = currentJobs.find(j => j.id === jobId);
    if (!job) return;
    
    const modal = `
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-xl font-bold text-gray-900">${job.title}</h2>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                            <i data-lucide="x" class="h-6 w-6"></i>
                        </button>
                    </div>
                    
                    <div class="space-y-4">
                        <div><strong>Company:</strong> ${job.company}</div>
                        <div><strong>Location:</strong> ${job.location}</div>
                        <div><strong>Job Type:</strong> ${job.job_type}</div>
                        ${job.salary_min && job.salary_max ? `<div><strong>Salary:</strong> R${job.salary_min.toLocaleString()} - R${job.salary_max.toLocaleString()}</div>` : ''}
                        <div><strong>Posted:</strong> ${formatDate(job.posted_date)}</div>
                        
                        ${job.skills && job.skills.length > 0 ? `
                            <div>
                                <strong>Skills:</strong>
                                <div class="flex flex-wrap gap-2 mt-2">
                                    ${job.skills.map(skill => `<span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        <div>
                            <strong>Description:</strong>
                            <div class="mt-2 p-4 bg-gray-50 rounded-md whitespace-pre-wrap">${job.description}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
    lucide.createIcons();
};

window.deleteJob = async function(jobId) {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
        return;
    }
    
    try {
        await deleteDoc(doc(db, 'jobs', jobId));
        showMessage('Job deleted successfully', 'success');
        loadJobs();
    } catch (error) {
        console.error('❌ Error deleting job:', error);
        showMessage('Failed to delete job', 'error');
    }
};

window.viewApplicationDetails = function(appId) {
    const app = currentApplications.find(a => a.id === appId);
    if (!app) return;
    
    const job = currentJobs.find(j => j.id === app.job_id);
    const jobTitle = job ? job.title : 'Unknown Job';
    
    const modal = `
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-xl font-bold text-gray-900">Application Details</h2>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                            <i data-lucide="x" class="h-6 w-6"></i>
                        </button>
                    </div>
                    
                    <div class="space-y-4">
                        <div><strong>Name:</strong> ${app.first_name} ${app.last_name}</div>
                        <div><strong>Email:</strong> ${app.email}</div>
                        ${app.phone ? `<div><strong>Phone:</strong> ${app.phone}</div>` : ''}
                        <div><strong>Job Applied For:</strong> ${jobTitle}</div>
                        <div><strong>Applied Date:</strong> ${formatDate(app.applied_date)}</div>
                        
                        ${app.resume_file ? `
                            <div>
                                <strong>Resume:</strong> 
                                <a href="${app.resume_file}" target="_blank" class="text-blue-600 hover:underline ml-2">
                                    View Resume <i data-lucide="external-link" class="h-4 w-4 inline"></i>
                                </a>
                            </div>
                        ` : ''}
                        
                        ${app.cover_letter ? `
                            <div>
                                <strong>Cover Letter:</strong>
                                <div class="mt-2 p-4 bg-gray-50 rounded-md whitespace-pre-wrap">${app.cover_letter}</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
    lucide.createIcons();
};

// ========================================
// JOB EXTRACTION FUNCTIONALITY
// ========================================

// Store extracted jobs temporarily for review
let extractedJobs = [];

// Initialize job extraction functionality
function initializeJobExtraction() {
    const fileUpload = document.getElementById('jobFileUpload');
    const dropZone = fileUpload?.closest('.border-dashed');
    const approveAllBtn = document.getElementById('approveAllBtn');
    const rejectAllBtn = document.getElementById('rejectAllBtn');

    if (!fileUpload) return;

    // File upload change event
    fileUpload.addEventListener('change', handleFileUpload);

    // Drag and drop functionality
    if (dropZone) {
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleFileDrop);
    }

    // Bulk action buttons
    if (approveAllBtn) approveAllBtn.addEventListener('click', approveAllExtractedJobs);
    if (rejectAllBtn) rejectAllBtn.addEventListener('click', rejectAllExtractedJobs);
}

// Handle file upload
async function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    await processUploadedFiles(files);
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
}

// Handle drag leave
function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
}

// Handle file drop
async function handleFileDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const dropZone = event.currentTarget;
    dropZone.classList.remove('border-blue-400', 'bg-blue-50');
    
    const files = Array.from(event.dataTransfer.files);
    await processUploadedFiles(files);
}

// Process uploaded files
async function processUploadedFiles(files) {
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
        const isValidType = file.type.includes('pdf') || file.type.includes('image');
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
        return isValidType && isValidSize;
    });

    if (validFiles.length === 0) {
        showMessage('Please select valid PDF or image files (max 10MB each)', 'error');
        return;
    }

    // Show processing status
    showExtractionStatus(true, `Processing ${validFiles.length} file(s)...`);
    
    try {
        // Process each file
        const extractionPromises = validFiles.map(file => extractJobFromFile(file));
        const results = await Promise.all(extractionPromises);
        
        // Filter successful extractions
        const successfulExtractions = results.filter(result => result !== null);
        
        if (successfulExtractions.length > 0) {
            extractedJobs = [...extractedJobs, ...successfulExtractions];
            displayExtractedJobs();
            showMessage(`Successfully extracted ${successfulExtractions.length} job(s) for review`, 'success');
        } else {
            showMessage('No job information could be extracted from the uploaded files', 'warning');
        }
        
    } catch (error) {
        console.error('Error processing files:', error);
        showMessage('Error processing files. Please try again.', 'error');
    } finally {
        showExtractionStatus(false);
        // Clear file input
        document.getElementById('jobFileUpload').value = '';
    }
}

// Extract job information from a single file
async function extractJobFromFile(file) {
    try {
        let extractedText = '';
        
        if (file.type.includes('pdf')) {
            extractedText = await extractTextFromPDF(file);
        } else if (file.type.includes('image')) {
            extractedText = await extractTextFromImage(file);
        }
        
        if (!extractedText.trim()) {
            console.warn(`No text extracted from file: ${file.name}`);
            return null;
        }
        
        // Use AI to parse the extracted text into job data
        const jobData = await parseJobDataWithAI(extractedText, file.name);
        
        if (jobData) {
            return {
                id: generateTempId(),
                fileName: file.name,
                extractedText: extractedText,
                ...jobData,
                status: 'pending' // pending, approved, rejected
            };
        }
        
        return null;
    } catch (error) {
        console.error(`Error extracting from file ${file.name}:`, error);
        return null;
    }
}

// Extract text from PDF using PDF.js
async function extractTextFromPDF(file) {
    try {
        console.log(`Extracting text from PDF: ${file.name}`);
        
        // Configure PDF.js worker
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        } else {
            console.error('PDF.js library not loaded');
            return getSampleJobText(); // Fallback to sample
        }
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        
        let fullText = '';
        
        // Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            // Combine text items into a single string
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ');
            
            fullText += pageText + '\n';
        }
        
        console.log(`Extracted ${fullText.length} characters from PDF`);
        return fullText.trim();
        
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        console.log('Falling back to sample data for demo');
        return getSampleJobText(); // Fallback for demo
    }
}

// Extract text from image using OCR
async function extractTextFromImage(file) {
    try {
        console.log(`Extracting text from image: ${file.name}`);
        
        if (typeof Tesseract === 'undefined') {
            console.error('Tesseract.js library not loaded');
            return getSampleJobText(); // Fallback to sample
        }
        
        // Create an image URL for Tesseract
        const imageUrl = URL.createObjectURL(file);
        
        // Update extraction status
        showExtractionStatus(true, `Processing image with OCR: ${file.name}...`);
        
        // Use Tesseract.js to extract text
        const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    const progress = Math.round(m.progress * 100);
                    showExtractionStatus(true, `OCR Progress: ${progress}% - ${file.name}`);
                }
            }
        });
        
        // Clean up the object URL
        URL.revokeObjectURL(imageUrl);
        
        console.log(`Extracted ${text.length} characters from image`);
        return text.trim();
        
    } catch (error) {
        console.error('Error extracting image text:', error);
        console.log('Falling back to sample data for demo');
        return getSampleJobText(); // Fallback for demo
    }
}

// Parse job data using AI (simulated)
async function parseJobDataWithAI(text, fileName) {
    try {
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For demo purposes, we'll extract job data using pattern matching
        // In production, you'd use OpenAI GPT, Google AI, or similar
        const jobData = extractJobDataFromText(text);
        
        return jobData;
    } catch (error) {
        console.error('Error parsing job data with AI:', error);
        return null;
    }
}

// Extract job data from text using enhanced pattern matching
function extractJobDataFromText(text) {
    const lowerText = text.toLowerCase();
    
    // Enhanced pattern matching
    const title = extractTitle(text) || 'Extracted Job Position';
    const company = extractCompany(text) || 'Company Name';
    const location = extractLocation(text) || 'Location';
    const jobType = extractJobType(lowerText) || 'full-time';
    const salary = extractSalary(text);
    const skills = extractSkills(lowerText);
    
    // Try to get a meaningful description
    const description = extractDescription(text) || text.substring(0, 500) + '...';
    
    return {
        title,
        company,
        location,
        job_type: jobType,
        salary_min: salary.min,
        salary_max: salary.max,
        company_logo: '', // Would be extracted separately or added manually
        skills: skills.join(', '),
        description
    };
}

// Enhanced helper functions for text extraction
function extractTitle(text) {
    const titlePatterns = [
        /(?:position|post|job\s*title|role|vacancy|opportunity):\s*([^\n\r,]+)/i,
        /(?:job|position|role)\s*(?:title|name)?\s*:\s*([^\n\r,]+)/i,
        /(?:we\s*are\s*(?:looking\s*for|seeking|hiring)\s*(?:a|an)?\s*)([^\n\r,]+?)(?:\s*to|\s*for|\s*with|\s*in)/i,
        /(?:^|\n)([A-Z][A-Z\s]{2,30})(?:\s*-|\s*\(|\s*at|\s*$)/m, // All caps titles
        /(?:^|\n)([A-Z][a-z\s]{5,50})(?:\s*-|\s*\(|\s*at|\s*$|\s*position)/m // Title case
    ];
    
    for (const pattern of titlePatterns) {
        const match = text.match(pattern);
        if (match && match[1] && match[1].trim().length > 2) {
            let title = match[1].trim();
            // Clean up the title
            title = title.replace(/[:\-\(\)]/g, '').trim();
            if (title.length > 3 && title.length < 100) {
                return title;
            }
        }
    }
    return null;
}

function extractCompany(text) {
    const companyPatterns = [
        /(?:company|employer|organization|firm):\s*([^\n\r,]+)/i,
        /(?:at|with|for)\s+([A-Z][a-zA-Z\s&.]{2,50})(?:\s*(?:is|seeks|requires|offers))/i,
        /([A-Z][a-zA-Z\s&.]{2,50})\s*(?:is\s*(?:looking|seeking|hiring))/i,
        /(?:^|\n)([A-Z][a-zA-Z\s&.]{3,50})\s*(?:job|career|vacancy|position)/im
    ];
    
    for (const pattern of companyPatterns) {
        const match = text.match(pattern);
        if (match && match[1] && match[1].trim().length > 2) {
            let company = match[1].trim();
            // Clean up common suffixes/prefixes
            company = company.replace(/\b(?:jobs?|careers?|vacancies|positions?|hiring|seeking)\b/gi, '').trim();
            if (company.length > 2 && company.length < 100) {
                return company;
            }
        }
    }
    return null;
}

function extractLocation(text) {
    const locationPatterns = [
        /(?:location|address|based\s*in|situated\s*in):\s*([^\n\r,]+)/i,
        /(?:in|at)\s*(johannesburg|cape\s*town|durban|pretoria|port\s*elizabeth|bloemfontein|sandton|rosebank|midrand|centurion|bellville|parow|claremont|wynberg|brackenfell|goodwood|milnerton|tableview|somerset\s*west|strand|stellenbosch|paarl|george|knysna|east\s*london|pietermaritzburg|ballito|umhlanga|westville|pinetown|chatsworth|phoenix)/i,
        /([a-zA-Z\s]+,\s*(?:gauteng|western\s*cape|kwazulu[^\n\r,]*natal|eastern\s*cape|free\s*state|limpopo|mpumalanga|north\s*west|northern\s*cape))/i,
        /(johannesburg|cape\s*town|durban|pretoria|port\s*elizabeth|bloemfontein)[^\n\r]*/i
    ];
    
    for (const pattern of locationPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            return match[1].trim();
        }
    }
    return null;
}

function extractJobType(text) {
    if (/\b(?:part[^\w]*time|part[^\w]*time)\b/i.test(text)) return 'part-time';
    if (/\b(?:contract|contractor|contractual|temporary|temp)\b/i.test(text)) return 'contract';
    if (/\b(?:intern|internship|learnership|graduate\s*program)\b/i.test(text)) return 'internship';
    if (/\b(?:freelance|consultant|consulting)\b/i.test(text)) return 'freelance';
    if (/\b(?:permanent|full[^\w]*time|full[^\w]*time)\b/i.test(text)) return 'full-time';
    return 'full-time';
}

function extractSalary(text) {
    // More comprehensive salary patterns
    const salaryPatterns = [
        /(?:salary|compensation|package|earn|pay)[\s:]*r?\s*(\d+[\s,]*\d*)\s*[-–—to]+\s*r?\s*(\d+[\s,]*\d*)/i,
        /r\s*(\d+[\s,]*\d*)\s*[-–—to]+\s*r?\s*(\d+[\s,]*\d*)/i,
        /(\d+[\s,]*\d*)\s*[-–—to]+\s*(\d+[\s,]*\d*)[\s]*(?:per\s*month|monthly|pm)/i,
        /(?:between|from)\s*r?\s*(\d+[\s,]*\d*)\s*(?:and|to|-|–|—)\s*r?\s*(\d+[\s,]*\d*)/i
    ];
    
    for (const pattern of salaryPatterns) {
        const match = text.match(pattern);
        if (match && match[1] && match[2]) {
            const min = parseInt(match[1].replace(/[\s,]/g, ''));
            const max = parseInt(match[2].replace(/[\s,]/g, ''));
            
            if (min > 0 && max > min && min < 1000000 && max < 1000000) {
                return { min, max };
            }
        }
    }
    
    // Single salary pattern
    const singleSalaryPattern = /(?:salary|pay|earn)[\s:]*r?\s*(\d+[\s,]*\d*)/i;
    const singleMatch = text.match(singleSalaryPattern);
    if (singleMatch && singleMatch[1]) {
        const salary = parseInt(singleMatch[1].replace(/[\s,]/g, ''));
        if (salary > 0 && salary < 1000000) {
            return { min: salary, max: null };
        }
    }
    
    return { min: null, max: null };
}

function extractSkills(text) {
    const commonSkills = [
        // Technical skills
        'javascript', 'typescript', 'python', 'java', 'c#', 'php', 'ruby', 'go', 'rust', 'swift',
        'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
        'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind',
        'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
        'aws', 'azure', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab',
        'linux', 'ubuntu', 'centos', 'windows server',
        
        // Soft skills
        'communication', 'leadership', 'teamwork', 'problem solving', 'analytical', 'creative',
        'project management', 'time management', 'adaptability', 'attention to detail',
        
        // Office skills
        'microsoft office', 'excel', 'word', 'powerpoint', 'outlook', 'google workspace',
        'powerbi', 'tableau', 'salesforce', 'sap', 'jira', 'confluence',
        
        // Industry specific
        'accounting', 'finance', 'marketing', 'sales', 'hr', 'recruiting', 'legal',
        'engineering', 'design', 'ui/ux', 'graphic design', 'video editing'
    ];
    
    const foundSkills = [];
    
    for (const skill of commonSkills) {
        const skillRegex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (skillRegex.test(text)) {
            foundSkills.push(skill);
        }
    }
    
    // Also look for skills mentioned in requirements or qualifications sections
    const skillSectionPattern = /(?:skills?|requirements?|qualifications?|experience)[\s\S]*?(?:\n\n|\r\n\r\n|$)/i;
    const skillSection = text.match(skillSectionPattern);
    
    if (skillSection) {
        const sectionText = skillSection[0];
        for (const skill of commonSkills) {
            const skillRegex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            if (skillRegex.test(sectionText) && !foundSkills.includes(skill)) {
                foundSkills.push(skill);
            }
        }
    }
    
    return foundSkills.slice(0, 10); // Limit to 10 skills
}

function extractDescription(text) {
    // Try to extract a meaningful job description
    const descriptionPatterns = [
        /(?:job\s*description|description|about\s*the\s*role|role\s*overview|overview):\s*([\s\S]+?)(?:\n\n|requirements|qualifications|skills|salary|contact|apply)/i,
        /(?:we\s*are\s*looking\s*for|seeking|hiring)[\s\S]+?(?:\n\n|requirements|qualifications|skills|salary|contact|apply)/i,
        /(?:responsibilities|duties):\s*([\s\S]+?)(?:\n\n|requirements|qualifications|skills|salary|contact|apply)/i
    ];
    
    for (const pattern of descriptionPatterns) {
        const match = text.match(pattern);
        if (match && match[1] && match[1].trim().length > 50) {
            let description = match[1].trim();
            // Clean up the description
            description = description.replace(/\s+/g, ' ').substring(0, 1000);
            return description;
        }
    }
    
    // Fallback: take first substantial paragraph
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 50);
    if (paragraphs.length > 0) {
        return paragraphs[0].replace(/\s+/g, ' ').substring(0, 1000);
    }
    
    return null;
}

// Generate sample job text for demo
function getSampleJobText() {
    const samples = [
        `Job Title: Software Developer
Company: TechCorp Solutions
Location: Johannesburg, South Africa
Job Type: Full-time
Salary: R35,000 - R55,000 per month

We are seeking a talented Software Developer to join our growing team. The ideal candidate will have experience with JavaScript, React, and Node.js.

Requirements:
- 3+ years of software development experience
- Proficiency in JavaScript, HTML, CSS
- Experience with React and Node.js
- Strong problem-solving skills
- Excellent communication skills

Responsibilities:
- Develop and maintain web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews`,

        `Position: Marketing Manager
Employer: Digital Marketing Agency
Address: Cape Town, Western Cape
Contract Type: Full-time
Compensation: R45,000 - R65,000

Join our dynamic marketing team as a Marketing Manager. We're looking for someone with strong leadership skills and digital marketing expertise.

Key Skills Required:
- Digital marketing strategy
- Social media management
- Google Analytics
- Project management
- Leadership and teamwork
- Communication skills

Job Description:
Develop and execute marketing campaigns, manage social media presence, analyze campaign performance, and lead a team of marketing specialists.`,

        `Vacancy: Data Analyst
Organization: Financial Services Group
Location: Durban, KwaZulu-Natal
Employment Type: Contract (12 months)
Salary Range: R40,000 - R50,000

We are hiring a Data Analyst to support our business intelligence initiatives.

Required Skills:
- SQL and database management
- Python or R programming
- Data visualization tools
- Excel and PowerPoint
- Analytical thinking
- Problem solving

Duties include data collection, analysis, reporting, and presenting insights to stakeholders.`
    ];
    
    return samples[Math.floor(Math.random() * samples.length)];
}

// Display extracted jobs for review
function displayExtractedJobs() {
    const extractedJobsSection = document.getElementById('extractedJobsSection');
    const extractedJobsList = document.getElementById('extractedJobsList');
    
    if (!extractedJobsSection || !extractedJobsList) return;
    
    // Show the section
    extractedJobsSection.classList.remove('hidden');
    
    // Clear existing jobs
    extractedJobsList.innerHTML = '';
    
    // Display each extracted job
    extractedJobs.forEach((job, index) => {
        const jobCard = createExtractedJobCard(job, index);
        extractedJobsList.appendChild(jobCard);
    });
    
    lucide.createIcons();
}

// Create a card for an extracted job
function createExtractedJobCard(job, index) {
    const card = document.createElement('div');
    card.className = 'border border-gray-200 rounded-lg p-6 bg-white';
    
    card.innerHTML = `
        <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i data-lucide="file-text" class="h-4 w-4 text-blue-600"></i>
                </div>
                <div>
                    <h4 class="font-medium text-gray-900">${job.title}</h4>
                    <p class="text-sm text-gray-500">From: ${job.fileName}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="approveExtractedJob(${index})" 
                        class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full text-white bg-green-600 hover:bg-green-700">
                    <i data-lucide="check" class="h-3 w-3 mr-1"></i>
                    Approve
                </button>
                <button onclick="rejectExtractedJob(${index})" 
                        class="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50">
                    <i data-lucide="x" class="h-3 w-3 mr-1"></i>
                    Reject
                </button>
                <button onclick="editExtractedJob(${index})" 
                        class="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50">
                    <i data-lucide="edit" class="h-3 w-3 mr-1"></i>
                    Edit
                </button>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
                <span class="text-gray-500">Company:</span>
                <span class="ml-2 text-gray-900">${job.company}</span>
            </div>
            <div>
                <span class="text-gray-500">Location:</span>
                <span class="ml-2 text-gray-900">${job.location}</span>
            </div>
            <div>
                <span class="text-gray-500">Type:</span>
                <span class="ml-2 text-gray-900">${job.job_type}</span>
            </div>
            <div>
                <span class="text-gray-500">Salary:</span>
                <span class="ml-2 text-gray-900">
                    ${job.salary_min && job.salary_max ? `R${job.salary_min.toLocaleString()} - R${job.salary_max.toLocaleString()}` : 'Not specified'}
                </span>
            </div>
        </div>
        
        ${job.skills ? `
        <div class="mt-4">
            <span class="text-gray-500 text-sm">Skills:</span>
            <div class="mt-1 flex flex-wrap gap-1">
                ${job.skills.split(',').map(skill => `
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        ${skill.trim()}
                    </span>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        <div class="mt-4">
            <p class="text-sm text-gray-600 line-clamp-3">${job.description}</p>
        </div>
    `;
    
    return card;
}

// Individual job actions
window.approveExtractedJob = async function(index) {
    const job = extractedJobs[index];
    if (!job) return;
    
    try {
        // Post the job to Firebase
        await postJobToFirebase(job);
        
        // Remove from extracted jobs
        extractedJobs.splice(index, 1);
        
        // Refresh display
        displayExtractedJobs();
        
        showMessage('Job approved and posted successfully!', 'success');
        
        // Refresh manage jobs panel if it's active
        if (panels.manageJobs && !panels.manageJobs.classList.contains('hidden')) {
            await loadJobs();
        }
    } catch (error) {
        console.error('Error approving job:', error);
        showMessage('Error approving job. Please try again.', 'error');
    }
};

window.rejectExtractedJob = function(index) {
    extractedJobs.splice(index, 1);
    displayExtractedJobs();
    showMessage('Job rejected', 'info');
};

window.editExtractedJob = function(index) {
    const job = extractedJobs[index];
    if (!job) return;
    
    // Fill the post job form with extracted data
    switchTab('postJob');
    
    // Populate form fields
    document.getElementById('title').value = job.title || '';
    document.getElementById('company').value = job.company || '';
    document.getElementById('location').value = job.location || '';
    document.getElementById('job_type').value = job.job_type || 'full-time';
    document.getElementById('salary_min').value = job.salary_min || '';
    document.getElementById('salary_max').value = job.salary_max || '';
    document.getElementById('skills').value = job.skills || '';
    document.getElementById('description').value = job.description || '';
    
    // Remove from extracted jobs
    extractedJobs.splice(index, 1);
    displayExtractedJobs();
    
    showMessage('Job moved to Post Job form for editing', 'info');
};

// Bulk actions
async function approveAllExtractedJobs() {
    if (extractedJobs.length === 0) return;
    
    try {
        const approvalPromises = extractedJobs.map(job => postJobToFirebase(job));
        await Promise.all(approvalPromises);
        
        const count = extractedJobs.length;
        extractedJobs = [];
        displayExtractedJobs();
        
        showMessage(`${count} job(s) approved and posted successfully!`, 'success');
        
        // Refresh manage jobs panel if it's active
        if (panels.manageJobs && !panels.manageJobs.classList.contains('hidden')) {
            await loadJobs();
        }
    } catch (error) {
        console.error('Error approving all jobs:', error);
        showMessage('Error approving jobs. Please try again.', 'error');
    }
}

function rejectAllExtractedJobs() {
    const count = extractedJobs.length;
    extractedJobs = [];
    displayExtractedJobs();
    showMessage(`${count} job(s) rejected`, 'info');
}

// Helper function to post job to Firebase
async function postJobToFirebase(jobData) {
    const job = {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        job_type: jobData.job_type,
        salary_min: jobData.salary_min || null,
        salary_max: jobData.salary_max || null,
        company_logo: jobData.company_logo || '',
        skills: jobData.skills,
        description: jobData.description,
        created_at: Timestamp.now(),
        status: 'active'
    };
    
    await addDoc(collection(db, 'jobs'), job);
}

// Show/hide extraction status
function showExtractionStatus(show, message = '') {
    const statusElement = document.getElementById('extractionStatus');
    const statusText = document.getElementById('extractionStatusText');
    
    if (!statusElement) return;
    
    if (show) {
        statusElement.classList.remove('hidden');
        if (statusText && message) {
            statusText.textContent = message;
        }
    } else {
        statusElement.classList.add('hidden');
    }
}

// Generate temporary ID for extracted jobs
function generateTempId() {
    return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Add some CSS for tab styling
const style = document.createElement('style');
style.textContent = `
    .tab-button {
        transition: all 0.2s;
    }
    .tab-button.active {
        color: #2563eb;
        background-color: #eff6ff;
    }
    .tab-button:not(.active) {
        color: #6b7280;
    }
    .tab-button:not(.active):hover {
        color: #374151;
    }
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
`;
document.head.appendChild(style);
