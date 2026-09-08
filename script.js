/**
 * EduTrack Matrix ERP - 8 Semester Global Architecture Engine
 */

const App = {
    state: {
        // Data Structure Map: { name, id, email, dept, grades: { sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8, cgpa } }
        students: JSON.parse(localStorage.getItem('matrix_8sem_db')) || [],
        theme: localStorage.getItem('theme') || 'dark'
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.applyTheme();
        this.syncViewEngine();
        
        // Listen dynamically to student selector swap to load existing grade automatically
        this.dom.marksStudentSelect.addEventListener('change', () => this.loadSelectedSemesterGrade());
        this.dom.semesterSelect.addEventListener('change', () => this.loadSelectedSemesterGrade());
    },

    cacheDOM() {
        this.dom = {
            studentForm: document.getElementById('studentForm'),
            studentList: document.getElementById('studentList'),
            marksDisplayList: document.getElementById('marksDisplayList'),
            leaderboardContainer: document.getElementById('leaderboardContainer'),
            marksStudentSelect: document.getElementById('marksStudentSelect'),
            semesterSelect: document.getElementById('semesterSelect'),
            gpaInput: document.getElementById('gpaInput'),
            searchBox: document.getElementById('searchBox'),
            addBtn: document.getElementById('addBtn'),
            saveMarksBtn: document.getElementById('saveMarksBtn'),
            syncStatus: document.getElementById('syncStatus'),
            themeToggle: document.getElementById('themeToggle'),
            formTitle: document.getElementById('formTitle'),
            editIndex: document.getElementById('editIndex'),
            // Identity Registration Hooks
            stuName: document.getElementById('stuName'),
            stuID: document.getElementById('stuID'),
            stuEmail: document.getElementById('stuEmail'),
            stuDept: document.getElementById('stuDept'),
            tabButtons: document.querySelectorAll('.tab-btn'),
            tabContents: document.querySelectorAll('.tab-content')
        };
    },

    bindEvents() {
        this.dom.addBtn.addEventListener('click', () => this.handleStudentSave());
        this.dom.saveMarksBtn.addEventListener('click', () => this.handleGradesCompute());
        this.dom.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        this.dom.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target));
        });

        this.dom.searchBox.addEventListener('input', (e) => this.handleSearch(e.target.value));
    },

    switchTab(targetButton) {
        this.dom.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.dom.tabContents.forEach(content => content.classList.remove('active'));

        targetButton.classList.add('active');
        const activeTabId = targetButton.getAttribute('data-tab');
        document.getElementById(activeTabId).classList.add('active');
        
        this.syncViewEngine();
    },

    syncViewEngine() {
        this.renderRegistryTable(this.state.students);
        this.renderGradesTable();
        this.populateStudentDropdown();
        this.calculateLeaderboard();
    },

    // PROFILE MANAGEMENT ENGINE
    handleStudentSave() {
        const name = this.dom.stuName.value.trim();
        const id = this.dom.stuID.value.trim();
        const email = this.dom.stuEmail.value.trim();
        const dept = this.dom.stuDept.value;
        const editIndex = parseInt(this.dom.editIndex.value);

        if (!this.validateForm(name, id, email, editIndex)) return;

        this.setLoader(true);

        if (editIndex === -1) {
            // Initializing object with all 8 semesters architecture schema mapping
            const newRecord = { 
                name, id, email, dept, 
                grades: { sem1: 0, sem2: 0, sem3: 0, sem4: 0, sem5: 0, sem6: 0, sem7: 0, sem8: 0, cgpa: 0 } 
            };
            this.state.students.push(newRecord);
            this.showToast("Student database pipeline assigned.", "success");
        } else {
            // Updating active identity mapping profile parameters directly
            this.state.students[editIndex].name = name;
            this.state.students[editIndex].id = id;
            this.state.students[editIndex].email = email;
            this.state.students[editIndex].dept = dept;
            this.showToast("Profile identity fields parsed successfully.", "success");
            this.resetFormState();
        }

        this.commitToStorage();
        this.syncViewEngine();
        this.clearInputs();
        this.setLoader(false);
    },

    // INTERACTIVE AUTO FILL FIELD LOGIC
    loadSelectedSemesterGrade() {
        const studentIndex = this.dom.marksStudentSelect.value;
        const selectedSem = this.dom.semesterSelect.value;

        if (studentIndex !== "") {
            const gradeData = this.state.students[studentIndex].grades[selectedSem];
            this.dom.gpaInput.value = gradeData > 0 ? gradeData : "";
        } else {
            this.dom.gpaInput.value = "";
        }
    },

    // COMPUTE DYNAMIC 8-SEMESTER SCALE CGPA
    handleGradesCompute() {
        const studentIndex = this.dom.marksStudentSelect.value;
        const selectedSem = this.dom.semesterSelect.value;
        const inputGpa = parseFloat(this.dom.gpaInput.value) || 0;

        if(studentIndex === "") { this.showToast("Select a valid active profile context!", "error"); return; }
        if(inputGpa < 0 || inputGpa > 10) { this.showToast("GPA parameter out of theoretical bounds (0.00-10.00)!", "error"); return; }

        // Save selected semester value matrix field
        this.state.students[studentIndex].grades[selectedSem] = inputGpa;

        // Process overall non-zero active records average CGPA
        const g = this.state.students[studentIndex].grades;
        const semesterValues = [g.sem1, g.sem2, g.sem3, g.sem4, g.sem5, g.sem6, g.sem7, g.sem8];
        
        const activeSemesters = semesterValues.filter(v => v > 0);
        const overallSum = activeSemesters.reduce((p, c) => p + c, 0);
        
        const calculatedCgpa = activeSemesters.length > 0 ? (overallSum / activeSemesters.length) : 0;
        this.state.students[studentIndex].grades.cgpa = parseFloat(calculatedCgpa.toFixed(2));

        this.commitToStorage();
        this.syncViewEngine();
        this.showToast(`Updated ${selectedSem.toUpperCase()} metrics safely.`, "success");
        this.dom.gpaInput.value = "";
    },

    // RANK CALCULATOR ENGINE
    calculateLeaderboard() {
        const container = this.dom.leaderboardContainer;
        container.innerHTML = "";

        const sortedToppers = [...this.state.students]
            .filter(s => s.grades && s.grades.cgpa > 0)
            .sort((a, b) => b.grades.cgpa - a.grades.cgpa)
            .slice(0, 5); 

        if(sortedToppers.length === 0) {
            container.innerHTML = `<p class="loading-row">No grade metrics available yet across 8 Semesters pipeline.</p>`;
            this.updateAnalyticsBar(0, 0);
            return;
        }

        sortedToppers.forEach((student, rank) => {
            const card = document.createElement('div');
            card.className = `leaderboard-card rank-${rank}`;
            card.innerHTML = `
                <div>
                    <span class="rank-badge">#${rank + 1}</span>
                    <strong>${this.escapeHTML(student.name)}</strong> 
                    <small style="opacity:0.7; margin-left:10px;">(${student.id} | ${student.dept})</small>
                </div>
                <div style="font-weight:bold; color: var(--primary-color);">Cumulative CGPA: ${student.grades.cgpa}</div>
            `;
            container.appendChild(card);
        });

        const total = this.state.students.length;
        const cseCount = this.state.students.filter(s => s.dept === 'CSE').length;
        const nonZeroCgpas = this.state.students.filter(s => s.grades.cgpa > 0).map(s => s.grades.cgpa);
        const campusAvg = nonZeroCgpas.length > 0 ? (nonZeroCgpas.reduce((a, b) => a + b, 0) / nonZeroCgpas.length).toFixed(2) : "0.00";

        this.updateAnalyticsBar(total, cseCount, campusAvg);
    },

    renderRegistryTable(array) {
        this.dom.studentList.innerHTML = "";
        if(array.length === 0) {
            this.dom.studentList.innerHTML = `<tr><td colspan="4" class="loading-row">No active profile matches found.</td></tr>`;
            return;
        }
        array.forEach(s => {
            const index = this.state.students.findIndex(p => p.id === s.id);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${this.escapeHTML(s.name)}</td>
                <td>${this.escapeHTML(s.id)}</td>
                <td>${s.dept}</td>
                <td>
                    <div class="action-btns">
                        <button class="edit-btn" onclick="App.handleEdit(${index})">Edit</button>
                        <button class="delete-btn" onclick="App.handleDelete(${index})">Delete</button>
                    </div>
                </td>
            `;
            this.dom.studentList.appendChild(tr);
        });
    },

    renderGradesTable() {
        this.dom.marksDisplayList.innerHTML = "";
        this.state.students.forEach(s => {
            const g = s.grades;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${this.escapeHTML(s.name)}</strong><br><small style="opacity:0.7">${s.id}</small></td>
                <td>${g.sem1 > 0 ? g.sem1 : '-'}</td>
                <td>${g.sem2 > 0 ? g.sem2 : '-'}</td>
                <td>${g.sem3 > 0 ? g.sem3 : '-'}</td>
                <td>${g.sem4 > 0 ? g.sem4 : '-'}</td>
                <td>${g.sem5 > 0 ? g.sem5 : '-'}</td>
                <td>${g.sem6 > 0 ? g.sem6 : '-'}</td>
                <td>${g.sem7 > 0 ? g.sem7 : '-'}</td>
                <td>${g.sem8 > 0 ? g.sem8 : '-'}</td>
                <td style="font-weight:bold; color: var(--primary-color)">${g.cgpa > 0 ? g.cgpa : 'N/A'}</td>
            `;
            this.dom.marksDisplayList.appendChild(tr);
        });
    },

    populateStudentDropdown() {
        const select = this.dom.marksStudentSelect;
        const savedIndex = select.value; // retain selection context mapping
        select.innerHTML = `<option value="">-- Choose Student Profile --</option>`;
        this.state.students.forEach((s, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.innerText = `${s.name} (${s.id})`;
            select.appendChild(opt);
        });
        if(savedIndex) select.value = savedIndex;
    },

    handleSearch(query) {
        const matches = this.state.students.filter(s => 
            s.name.toLowerCase().includes(query.toLowerCase()) || 
            s.id.toLowerCase().includes(query.toLowerCase())
        );
        this.renderRegistryTable(matches);
    },

    handleEdit(index) {
        const s = this.state.students[index];
        this.dom.stuName.value = s.name;
        this.dom.stuID.value = s.id;
        this.dom.stuEmail.value = s.email;
        this.dom.stuDept.value = s.dept;

        this.dom.editIndex.value = index;
        this.dom.addBtn.innerText = "Commit Changes";
        this.dom.formTitle.innerText = "✏️ Edit Database Record";
    },

    handleDelete(index) {
        if(confirm("Completely wipe this profile record? Data cannot be recovered.")) {
            this.state.students.splice(index, 1);
            this.commitToStorage();
            this.syncViewEngine();
            this.showToast("Profile dropped from database nodes.", "success");
        }
    },

    validateForm(name, id, email, editIndex) {
        if (!name || !id || !email) { this.showToast("All field parameters are mandatory!", "error"); return false; }
        if (editIndex === -1 && this.state.students.some(s => s.id.toLowerCase() === id.toLowerCase())) {
            this.showToast("Roll Number already allocated!", "error");
            return false;
        }
        return true;
    },

    commitToStorage() { localStorage.setItem('matrix_8sem_db', JSON.stringify(this.state.students)); },
    updateAnalyticsBar(t, c, a) {
        document.getElementById('totalCount').innerText = t;
        document.getElementById('cseCount').innerText = c;
        document.getElementById('avgCgpa').innerText = a;
    },
    setLoader(status) {
        this.dom.syncStatus.innerText = status ? "Syncing..." : "Synced";
        this.dom.syncStatus.className = status ? "status-badge loading" : "status-badge";
    },
    resetFormState() {
        this.dom.editIndex.value = "-1";
        this.dom.addBtn.innerText = "Save Student Record";
        this.dom.formTitle.innerText = "Register Student";
    },
    clearInputs() {
        this.dom.stuName.value = ''; this.dom.stuID.value = ''; this.dom.stuEmail.value = '';
        this.dom.stuDept.selectedIndex = 0; this.resetFormState();
    },
    toggleTheme() {
        this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.state.theme);
        this.applyTheme();
    },
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.state.theme);
        this.dom.themeToggle.innerText = this.state.theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    },
    showToast(msg, type) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`; toast.innerText = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },
    escapeHTML(str) { return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
};

App.init();