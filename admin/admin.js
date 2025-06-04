// Firebase Admin Panel for WorkBridge Jobs
// This file handles job posting, management, and applications viewing

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
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

// Collections
const jobsCollection = collection(db, 'jobs');
const applicationsCollection = collection(db, 'applications');

// Global state
let currentJobs = [];
let currentApplications = [];

// DOM Elements
const tabs = {
    postJob: document.getElementById('postJobTab'),
    manageJobs: document.getElementById('manageJobsTab'),
    applications: document.getElementById('applicationsTab')
};

const panels = {
    postJob: document.getElementById('postJobPanel'),
    manageJobs: document.getElementById('manageJobsPanel'),
    applications: document.getElementById('applicationsPanel')
};

const jobForm = document.getElementById('jobForm');
const connectionStatus = document.getElementById('connectionStatus');

// Initialize the admin panel
document.addEventListener('DOMContentLoaded', async () => {
    initializeTabs();
    setupEventListeners();
    await testFirebaseConnection();
    loadJobs();
    loadApplications();
});

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
