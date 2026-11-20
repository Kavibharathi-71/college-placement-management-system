
"use strict";

// ==========================================
// PLACEPRO - COLLEGE PLACEMENT MANAGEMENT
// ==========================================

// DEMO ADMIN LOGIN
// Email: admin@college.edu
// Password: Admin@123

const ADMIN = {
    email: "admin@college.edu",
    password: "Admin@123",
    name: "Placement Administrator",
    role: "admin"
};

const STORAGE = {
    students: "placepro_students",
    companies: "placepro_companies",
    applications: "placepro_applications",
    currentUser: "placepro_current_user"
};

let currentUser = null;

// ==========================================
// STORAGE FUNCTIONS
// ==========================================

function readData(key, fallback = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
    } catch (error) {
        console.error("Storage reading error:", error);
        return fallback;
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("Storage saving error:", error);
        alert("Unable to save data. Browser storage may be full.");
        return false;
    }
}

function getStudents() {
    return readData(STORAGE.students);
}

function getCompanies() {
    return readData(STORAGE.companies);
}

function getApplications() {
    return readData(STORAGE.applications);
}

// ==========================================
// SAMPLE COMPANY DATA
// ==========================================

function initializeData() {
    if (!localStorage.getItem(STORAGE.companies)) {
        const companies = [
            {
                id: "C001",
                name: "TCS",
                role: "Software Developer",
                package: 7,
                minCgpa: 7,
                description: "Develop software applications and work with modern technologies."
            },
            {
                id: "C002",
                name: "Infosys",
                role: "Systems Engineer",
                package: 6,
                minCgpa: 6.5,
                description: "Work on enterprise software and information systems."
            },
            {
                id: "C003",
                name: "Wipro",
                role: "Project Engineer",
                package: 5.5,
                minCgpa: 6,
                description: "Participate in software development and engineering projects."
            },
            {
                id: "C004",
                name: "Accenture",
                role: "Associate Software Engineer",
                package: 6.5,
                minCgpa: 7,
                description: "Work on digital transformation and technology solutions."
            },
            {
                id: "C005",
                name: "Zoho",
                role: "Junior Developer",
                package: 8,
                minCgpa: 7.5,
                description: "Develop innovative software products and applications."
            },
            {
                id: "C006",
                name: "HCLTech",
                role: "Graduate Engineer Trainee",
                package: 4.5,
                minCgpa: 6,
                description: "Start your career in engineering and technology services."
            }
        ];

        saveData(STORAGE.companies, companies);
    }

    if (!localStorage.getItem(STORAGE.students)) {
        saveData(STORAGE.students, []);
    }

    if (!localStorage.getItem(STORAGE.applications)) {
        saveData(STORAGE.applications, []);
    }
}

// ==========================================
// SECURITY HELPER FOR HTML DISPLAY
// ==========================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// ==========================================
// AUTHENTICATION
// ==========================================

function showAuth(type) {
    document.getElementById("authSection").classList.remove("hidden");

    const registerFields = document.getElementById("registerFields");
    const title = document.getElementById("authTitle");
    const subtitle = document.getElementById("authSubtitle");
    const submit = document.getElementById("authSubmit");
    const switchText = document.getElementById("authSwitch");
    const message = document.getElementById("authMessage");

    document.getElementById("authForm").reset();
    message.textContent = "";

    if (type === "register") {
        registerFields.classList.remove("hidden");
        title.textContent = "Create Your Account";
        subtitle.textContent = "Register to explore placement opportunities.";
        submit.textContent = "Create Account";

        switchText.innerHTML =
            'Already have an account? <a href="#" onclick="showAuth(\'login\'); return false;">Login</a>';
    } else {
        registerFields.classList.add("hidden");
        title.textContent = "Welcome Back!";
        subtitle.textContent = "Login to continue your journey.";
        submit.textContent = "Login";

        switchText.innerHTML =
            'Don\'t have an account? <a href="#" onclick="showAuth(\'register\'); return false;">Register</a>';
    }

    document.body.style.overflow = "hidden";
}

function hideAuth() {
    document.getElementById("authSection").classList.add("hidden");
    document.body.style.overflow = "";
}

document.getElementById("authForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const isRegister = !document.getElementById("registerFields")
        .classList.contains("hidden");

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    const message = document.getElementById("authMessage");

    if (!email || !password) {
        showMessage("Please fill all required fields.", "error");
        return;
    }

    if (password.length < 6) {
        showMessage("Password must contain at least 6 characters.", "error");
        return;
    }

    if (isRegister) {
        registerStudent(email, password);
    } else {
        loginUser(email, password);
    }

    function showMessage(text, type) {
        message.textContent = text;
        message.style.color = type === "error" ? "#d34b4b" : "#16a36a";
    }
});

// ==========================================
// STUDENT REGISTRATION
// ==========================================

function registerStudent(email, password) {
    const name = document.getElementById("studentName").value.trim();
    const registerNumber = document.getElementById("registerNumber").value.trim();
    const department = document.getElementById("department").value;
    const cgpa = Number(document.getElementById("cgpa").value);

    if (!name || !registerNumber || !department) {
        alert("Please fill in all student details.");
        return;
    }

    if (!/^[a-zA-Z\s.'-]+$/.test(name)) {
        alert("Please enter a valid student name.");
        return;
    }

    if (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 10) {
        alert("CGPA must be between 0 and 10.");
        return;
    }

    const students = getStudents();

    const duplicateEmail = students.some(
        student => student.email === email
    );

    const duplicateRegister = students.some(
        student => student.registerNumber.toLowerCase() === registerNumber.toLowerCase()
    );

    if (email === ADMIN.email || duplicateEmail) {
        alert("This email is already registered.");
        return;
    }

    if (duplicateRegister) {
        alert("Register number already exists.");
        return;
    }

    const student = {
        id: "S" + Date.now(),
        name,
        registerNumber,
        department,
        cgpa,
        email,
        password
    };

    students.push(student);

    if (!saveData(STORAGE.students, students)) return;

    alert("Registration successful! Please login.");

    showAuth("login");
}

// ==========================================
// LOGIN
// ==========================================

function loginUser(email, password) {

    if (email === ADMIN.email && password === ADMIN.password) {
        currentUser = ADMIN;
        startDashboard();
        return;
    }

    const student = getStudents().find(
        user => user.email === email && user.password === password
    );

    if (!student) {
        alert("Invalid email or password.");
        return;
    }

    currentUser = {
        ...student,
        role: "student"
    };

    startDashboard();
}

// ==========================================
// DASHBOARD INITIALIZATION
// ==========================================

function startDashboard() {
    hideAuth();

    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("home").classList.add("hidden");
    document.getElementById("features").classList.add("hidden");
    document.getElementById("companies").classList.add("hidden");
    document.querySelector("footer").classList.add("hidden");
    document.getElementById("navActions").classList.add("hidden");

    saveData(STORAGE.currentUser, currentUser);

    const isAdmin = currentUser.role === "admin";

    document.getElementById("welcomeTitle").textContent =
        isAdmin ? "Admin Dashboard" : "Student Dashboard";

    document.getElementById("userName").textContent = currentUser.name;
    document.getElementById("userRole").textContent =
        isAdmin ? "Administrator" : currentUser.department;

    document.getElementById("userAvatar").textContent =
        currentUser.name.charAt(0).toUpperCase();

    document.querySelectorAll(".admin-only").forEach(item => {
        item.classList.toggle("hidden", !isAdmin);
    });

    showPanel("overview");
    refreshDashboard();

    window.scrollTo(0, 0);
}

// ==========================================
// DASHBOARD STATISTICS
// ==========================================

function refreshDashboard() {
    const students = getStudents();
    const companies = getCompanies();
    const applications = getApplications();

    const stats = {
        students: students.length,
        companies: companies.length,
        jobs: companies.length,
        applications: applications.length
    };

    document.getElementById("statStudents").textContent = stats.students;
    document.getElementById("statCompanies").textContent = stats.companies;
    document.getElementById("statJobs").textContent = stats.jobs;

    document.getElementById("statApplications").textContent =
        currentUser.role === "admin"
            ? stats.applications
            : applications.filter(app => app.studentId === currentUser.id).length;

    renderJobs();
    renderApplications();
    renderStudents();
    renderAdminCompanies();
    renderReports();
    renderProfile();
}

// ==========================================
// PANEL NAVIGATION
// ==========================================

function showPanel(panelName, button) {
    if (!currentUser) return;

    const adminPanels = ["students", "manage", "reports"];

    if (adminPanels.includes(panelName) && currentUser.role !== "admin") {
        alert("Admin access required.");
        return;
    }

    document.querySelectorAll(".panel").forEach(panel => {
        panel.classList.add("hidden");
    });

    const target = document.getElementById("panel-" + panelName);

    if (target) target.classList.remove("hidden");

    document.querySelectorAll(".side-link").forEach(link => {
        link.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    } else {
        const links = document.querySelectorAll(".side-link");
        links.forEach(link => {
            if (link.getAttribute("onclick")?.includes("'" + panelName + "'")) {
                link.classList.add("active");
            }
        });
    }

    document.getElementById("welcomeTitle").textContent =
        panelName.charAt(0).toUpperCase() + panelName.slice(1);

    if (panelName === "overview") {
        renderOverview();
    }
}

// ==========================================
// COMPANY DISPLAY
// ==========================================

function renderPublicCompanies() {
    const companies = getCompanies();
    const container = document.getElementById("publicCompanies");

    container.innerHTML = companies.slice(0, 6).map(company => `
        <article class="company-card">
            <div class="feature-icon blue">🏢</div>
            <h3>${escapeHTML(company.name)}</h3>
            <p>${escapeHTML(company.role)}</p>
            <p class="company-package">₹${Number(company.package).toFixed(1)} LPA</p>
            <div class="company-meta">
                <span>Minimum CGPA: ${Number(company.minCgpa).toFixed(1)}</span>
                <span>Full-time</span>
            </div>
            <button class="btn btn-outline full-width"
                onclick="showAuth('login')">View Opportunity</button>
        </article>
    `).join("");
}

// ==========================================
// JOB LIST
// ==========================================

function renderJobs() {
    const container = document.getElementById("jobsList");
    const overview = document.getElementById("overviewJobs");
    const companies = getCompanies();

    if (!companies.length) {
        container.innerHTML = "<p>No placement opportunities available.</p>";
        overview.innerHTML = "<p>No jobs available.</p>";
        return;
    }

    const jobsHTML = companies.map(company => {
        const eligible = currentUser.role === "admin" ||
            currentUser.cgpa >= company.minCgpa;

        const applications = getApplications();

        const applied = currentUser.role === "student" &&
            applications.some(app =>
                app.studentId === currentUser.id &&
                app.companyId === company.id
            );

        return `
            <div class="job-item">
                <h4>🏢 ${escapeHTML(company.name)} - ${escapeHTML(company.role)}</h4>
                <p>${escapeHTML(company.description)}</p>
                <div class="job-actions">
                    <span class="status">₹${Number(company.package).toFixed(1)} LPA</span>
                    <span class="status">CGPA: ${Number(company.minCgpa).toFixed(1)}+</span>
                    ${
                        currentUser.role === "admin"
                            ? '<span class="status">Admin view</span>'
                            : applied
                                ? '<span class="status selected">Already Applied</span>'
                                : eligible
                                    ? `<button class="btn btn-primary" onclick="applyJob('${escapeHTML(company.id)}')">Apply Now</button>`
                                    : '<span class="status rejected">Not Eligible</span>'
                    }
                </div>
            </div>
        `;
    }).join("");

    container.innerHTML = jobsHTML;
    overview.innerHTML = companies.slice(0, 3).map(company => `
        <div class="job-item">
            <h4>${escapeHTML(company.name)} - ${escapeHTML(company.role)}</h4>
            <p>Package: ₹${Number(company.package).toFixed(1)} LPA</p>
        </div>
    `).join("");
}

// ==========================================
// APPLY FOR PLACEMENT
// ==========================================

function applyJob(companyId) {
    if (currentUser.role !== "student") {
        alert("Only students can apply.");
        return;
    }

    const companies = getCompanies();

    const company = companies.find(item => item.id === companyId);

    if (!company) {
        alert("Company not found.");
        return;
    }

    if (currentUser.cgpa < company.minCgpa) {
        alert("Sorry! You do not meet the eligibility criteria.");
        return;
    }

    const applications = getApplications();

    const alreadyApplied = applications.some(app =>
        app.studentId === currentUser.id &&
        app.companyId === companyId
    );

    if (alreadyApplied) {
        alert("You have already applied to this company.");
        return;
    }

    applications.push({
        id: "A" + Date.now(),
        studentId: currentUser.id,
        studentName: currentUser.name,
        companyId: company.id,
        companyName: company.name,
        role: company.role,
        package: company.package,
        status: "Applied",
        appliedDate: new Date().toLocaleDateString("en-IN")
    });

    if (!saveData(STORAGE.applications, applications)) return;

    alert("Application submitted successfully!");

    refreshDashboard();
    showPanel("applications");
}

// ==========================================
// STUDENT APPLICATIONS
// ==========================================

function renderApplications() {
    const tbody = document.getElementById("applicationTable");

    let applications = getApplications();

    if (currentUser.role === "student") {
        applications = applications.filter(app =>
            app.studentId === currentUser.id
        );
    }

    if (!applications.length) {
        tbody.innerHTML = '<tr><td colspan="4">No applications found.</td></tr>';
        return;
    }

    tbody.innerHTML = applications.map(app => `
        <tr>
            <td>${escapeHTML(app.companyName)}</td>
            <td>${escapeHTML(app.role)}</td>
            <td>₹${Number(app.package).toFixed(1)} LPA</td>
            <td><span class="status ${app.status === "Selected" ? "selected" : app.status === "Rejected" ? "rejected" : ""}">
                ${escapeHTML(app.status)}
            </span></td>
        </tr>
    `).join("");
}

// ==========================================
// STUDENT PROFILE
// ==========================================

function renderProfile() {
    if (currentUser.role !== "student") {
        document.getElementById("profileDetails").innerHTML =
            "<p>Administrator account.</p>";
        return;
    }

    document.getElementById("profileDetails").innerHTML = `
        <p><b>Full Name:</b> ${escapeHTML(currentUser.name)}</p>
        <p><b>Register Number:</b> ${escapeHTML(currentUser.registerNumber)}</p>
        <p><b>Department:</b> ${escapeHTML(currentUser.department)}</p>
        <p><b>CGPA:</b> ${Number(currentUser.cgpa).toFixed(2)}</p>
        <p><b>Email:</b> ${escapeHTML(currentUser.email)}</p>
    `;
}

// ==========================================
// ADMIN: STUDENT TABLE
// ==========================================

function renderStudents() {
    const tbody = document.getElementById("studentsTable");

    tbody.innerHTML = getStudents().map(student => `
        <tr>
            <td>${escapeHTML(student.name)}</td>
            <td>${escapeHTML(student.registerNumber)}</td>
            <td>${escapeHTML(student.department)}</td>
            <td>${Number(student.cgpa).toFixed(2)}</td>
        </tr>
    `).join("") || '<tr><td colspan="4">No students registered.</td></tr>';
}

// ==========================================
// ADMIN: ADD COMPANY
// ==========================================

document.getElementById("companyForm").addEventListener("submit", function(event) {
    event.preventDefault();

    if (!currentUser || currentUser.role !== "admin") {
        alert("Admin access required.");
        return;
    }

    const name = document.getElementById("companyName").value.trim();
    const role = document.getElementById("companyRole").value.trim();
    const packageValue = Number(document.getElementById("companyPackage").value);
    const minCgpa = Number(document.getElementById("companyCgpa").value);
    const description = document.getElementById("companyDescription").value.trim();

    if (!name || !role || !description) {
        alert("Please fill in all company details.");
        return;
    }

    if (!Number.isFinite(packageValue) || packageValue <= 0) {
        alert("Enter a valid salary package.");
        return;
    }

    if (!Number.isFinite(minCgpa) || minCgpa < 0 || minCgpa > 10) {
        alert("Minimum CGPA must be between 0 and 10.");
        return;
    }

    const companies = getCompanies();

    companies.push({
        id: "C" + Date.now(),
        name,
        role,
        package: packageValue,
        minCgpa,
        description
    });

    if (!saveData(STORAGE.companies, companies)) return;

    this.reset();

    alert("Placement drive added successfully!");

    refreshDashboard();
});

// ==========================================
// ADMIN: COMPANY MANAGEMENT
// ==========================================

function renderAdminCompanies() {
    const container = document.getElementById("adminCompanyList");

    container.innerHTML = getCompanies().map(company => `
        <div class="company-admin-row">
            <div>
                <b>${escapeHTML(company.name)}</b>
                <br>
                <small>${escapeHTML(company.role)} | ₹${Number(company.package).toFixed(1)} LPA</small>
            </div>
            <button class="delete-btn"
                onclick="deleteCompany('${escapeHTML(company.id)}')">Delete</button>
        </div>
    `).join("") || "<p>No companies added.</p>";
}

function deleteCompany(companyId) {
    if (!currentUser || currentUser.role !== "admin") return;

    const confirmed = confirm("Are you sure you want to delete this placement drive?");

    if (!confirmed) return;

    const companies = getCompanies().filter(company => company.id !== companyId);

    if (!saveData(STORAGE.companies, companies)) return;

    refreshDashboard();

    alert("Placement drive deleted.");
}

// ==========================================
// ADMIN: REPORTS
// ==========================================

function renderReports() {
    const students = getStudents();
    const companies = getCompanies();
    const applications = getApplications();

    document.getElementById("reportStudents").textContent = students.length;
    document.getElementById("reportCompanies").textContent = companies.length;
    document.getElementById("reportApplications").textContent = applications.length;

    document.getElementById("reportSelected").textContent =
        applications.filter(app => app.status === "Selected").length;
}

// ==========================================
// OVERVIEW
// ==========================================

function renderOverview() {
    refreshDashboard();
}

// ==========================================
// LOGOUT
// ==========================================

function logout() {
    currentUser = null;
    localStorage.removeItem(STORAGE.currentUser);

    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("home").classList.remove("hidden");
    document.getElementById("features").classList.remove("hidden");
    document.getElementById("companies").classList.remove("hidden");
    document.querySelector("footer").classList.remove("hidden");
    document.getElementById("navActions").classList.remove("hidden");

    document.body.style.overflow = "";

    renderPublicCompanies();
    updatePublicStats();

    window.scrollTo(0, 0);
}

// ==========================================
// PUBLIC STATISTICS
// ==========================================

function updatePublicStats() {
    document.getElementById("heroStudents").textContent = getStudents().length;
    document.getElementById("heroCompanies").textContent = getCompanies().length;
    document.getElementById("heroJobs").textContent = getCompanies().length;
}

// ==========================================
// APPLICATION START
// ==========================================

function initializeApp() {
    initializeData();

    renderPublicCompanies();
    updatePublicStats();

    // Restore the previous session for this browser.
    const savedUser = readData(STORAGE.currentUser, null);

    if (savedUser && savedUser.role === "admin") {
        currentUser = ADMIN;
        startDashboard();
    } else if (savedUser && savedUser.role === "student") {
        const student = getStudents().find(
            item => item.id === savedUser.id
        );

        if (student) {
            currentUser = { ...student, role: "student" };
            startDashboard();
        } else {
            localStorage.removeItem(STORAGE.currentUser);
        }
    }
}

initializeApp();
