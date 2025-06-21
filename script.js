document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show active tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Subject data for each semester
    const semesterCourses = {
        1: [
            { code: 'U23ENG101A', name: 'COMMUNICATION SKILLS IN ENGLISH', credits: 2 },
            { code: 'U23MAT102A', name: 'LINEAR ALGEBRA AND CALCULUS WITH MATLAB', credits: 4 },
            { code: 'U23PHY103B', name: 'ENGINEERING PHYSICS', credits: 3 },
            { code: 'U23GE101', name: 'BASIC APTITUDE-1', credits: 3 },
            { code: 'U23PPR105', name: 'PROBLEM SOLVING USING PYTHON PROGRAMMING', credits: 3 },
            { code: 'U23EGR107', name: 'ENGINEERING GRAPHICS', credits: 3 },
            { code: 'U23PHL110', name: 'ENGINEERING PHYSICS LABORATORY', credits: 1 },
            { code: 'U23PPL112', name: ' PYTHON PROGRAMMING LABORATORY ', credits: 1 },
            { code: 'U23OL1103', name: ' JAPANESE ', credits: 1 },
            { code: 'U23TAM101', name: ' HERITAGE OF TAMILS ', credits: 1 }
        ],
        2: [
            { code: 'U23MAT202D', name: 'DISCRETE MATHEMATICS', credits: 4 },
            { code: 'U23ENG201A', name: 'Technical English', credits: 1 },
            { code: 'U23CHE204C', name: 'APPLIED CHEMISTRY', credits: 3 },
            { code: 'U23CHL211', name: 'CHEMISTRY LABORATORY', credits: 1 },
            { code: 'U23CPR205', name: 'PROGRAMMING IN C', credits: 2 },
            { code: 'U23CPL212', name: 'C PROGRAMMING LABORATORY', credits: 1 },
            { code: 'U23BEE206B', name: 'BASICS OF ELECTRICAL AND ELECTRONICS ENGINEERING', credits: 3 },
            { code: 'U23BEEL213B', name: 'BASICS OF ELECTRICAL AND ELECTRONICS ENGINEERING LABORATORY', credits: 1 },
            { code: 'U23EC203', name: 'DIGITAL PRINCIPLES AND SYSTEM DESIGN', credits: 3 },
            { code: 'U23TAM201', name: 'TAMILS AND TECHNOLOGY', credits: 2 },
            { code: 'U23OL1103', name: 'JAPANESE-2', credits: 2 }
        ],
        // Add more semesters as needed
    };
    
    // GPA Calculator
    const semesterSelect = document.getElementById('semester');
    const gpaCoursesTable = document.getElementById('gpa-courses').querySelector('tbody');
    const resetValuesBtn = document.getElementById('reset-values');
    const calculateGpaBtn = document.getElementById('calculate-gpa');
    const gpaResult = document.getElementById('gpa-result');
    
    // Load courses when semester changes
    semesterSelect.addEventListener('change', function() {
        const semester = this.value;
        gpaCoursesTable.innerHTML = '';
        
        if (semesterCourses[semester]) {
            semesterCourses[semester].forEach(course => {
                addCourseRow(course.code, course.name, course.credits);
            });
        }
    });
    
    // Initialize with semester 1
    semesterSelect.dispatchEvent(new Event('change'));
    
    // Add course row function
    function addCourseRow(code, name, credits) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="course-code" value="${code}" readonly></td>
            <td>${name}</td>
            <td><input type="number" class="course-credits" value="${credits}" min="0.1" step="0.1"></td>
            <td>
                <select class="course-grade">
                    <option value="">Select Grade</option>
                    <option value="4">O (4.0)</option>
                    <option value="3.7">A+ (3.7)</option>
                    <option value="3.3">A (3.3)</option>
                    <option value="3">B+ (3.0)</option>
                    <option value="2.7">B (2.7)</option>
                    <option value="2.3">C (2.3)</option>
                    <option value="2">U (2.0)</option>
                </select>
            </td>
            <td><button class="remove-btn">×</button></td>
        `;
        gpaCoursesTable.appendChild(row);
    }
    
    // Reset values function
    resetValuesBtn.addEventListener('click', () => {
        const rows = gpaCoursesTable.querySelectorAll('tr');
        rows.forEach(row => {
            row.querySelector('.course-grade').value = '';
            row.querySelector('.course-credits').value = row.querySelector('.course-credits').getAttribute('value');
            
            // Reset border styles if they were highlighted as errors
            row.querySelector('.course-grade').style.border = '1px solid #ddd';
            row.querySelector('.course-credits').style.border = '1px solid #ddd';
        });
        
        // Reset results display
        gpaResult.style.display = 'none';
    });
    
    // Calculate GPA
    calculateGpaBtn.addEventListener('click', () => {
        const rows = gpaCoursesTable.querySelectorAll('tr');
        let totalPoints = 0;
        let totalCredits = 0;
        let allValid = true;
        
        rows.forEach(row => {
            const grade = parseFloat(row.querySelector('.course-grade').value);
            const credits = parseFloat(row.querySelector('.course-credits').value);
            
            if (isNaN(grade)) {
                row.querySelector('.course-grade').style.border = '1px solid #e74c3c';
                allValid = false;
            } else {
                row.querySelector('.course-grade').style.border = '1px solid #ddd';
            }
            
            if (isNaN(credits) || credits <= 0) {
                row.querySelector('.course-credits').style.border = '1px solid #e74c3c';
                allValid = false;
            } else {
                row.querySelector('.course-credits').style.border = '1px solid #ddd';
            }
            
            if (!isNaN(grade) && !isNaN(credits)) {
                totalPoints += grade * credits;
                totalCredits += credits;
            }
        });
        
        if (!allValid || rows.length === 0) {
            gpaResult.querySelector('.total-credits span').textContent = '0';
            gpaResult.querySelector('.gpa-value span').textContent = '0.00';
            gpaResult.style.display = 'flex';
            gpaResult.style.color = '#e74c3c';
            return;
        }
        
        const gpa = totalPoints / totalCredits;
        gpaResult.querySelector('.total-credits span').textContent = totalCredits.toFixed(1);
        gpaResult.querySelector('.gpa-value span').textContent = gpa.toFixed(2);
        gpaResult.style.display = 'flex';
        gpaResult.style.color = '#27ae60';
    });
    
    // CGPA Calculator
    const semestersContainer = document.getElementById('semesters');
    const addSemesterBtn = document.getElementById('add-semester');
    const calculateCgpaBtn = document.getElementById('calculate-cgpa');
    const cgpaResult = document.getElementById('cgpa-result');
    
    // Add new semester
    addSemesterBtn.addEventListener('click', () => {
        const semesterCount = document.querySelectorAll('.semester').length + 1;
        const newSemester = document.createElement('div');
        newSemester.className = 'semester';
        newSemester.innerHTML = `
            <div class="semester-header">
                <h3>Semester ${semesterCount}</h3>
                <button class="remove-semester">×</button>
            </div>
            <div class="semester-inputs">
                <input type="number" class="semester-gpa" placeholder="GPA" min="0" max="4" step="0.01">
                <input type="number" class="semester-credits" placeholder="Total Credits" min="0">
            </div>
        `;
        semestersContainer.appendChild(newSemester);
        
        // Add remove functionality
        newSemester.querySelector('.remove-semester').addEventListener('click', () => {
            semestersContainer.removeChild(newSemester);
            // Update semester numbers
            const semesters = document.querySelectorAll('.semester');
            semesters.forEach((sem, index) => {
                sem.querySelector('h3').textContent = `Semester ${index + 1}`;
            });
        });
    });
    
    // Calculate CGPA
    calculateCgpaBtn.addEventListener('click', () => {
        const semesters = document.querySelectorAll('.semester');
        let totalPoints = 0;
        let totalCredits = 0;
        let allValid = true;
        
        semesters.forEach(semester => {
            const gpa = parseFloat(semester.querySelector('.semester-gpa').value);
            const credits = parseFloat(semester.querySelector('.semester-credits').value);
            
            if (isNaN(gpa) || gpa < 0 || gpa > 4) {
                semester.querySelector('.semester-gpa').style.border = '1px solid #e74c3c';
                allValid = false;
            } else {
                semester.querySelector('.semester-gpa').style.border = '1px solid #ddd';
            }
            
            if (isNaN(credits) || credits <= 0) {
                semester.querySelector('.semester-credits').style.border = '1px solid #e74c3c';
                allValid = false;
            } else {
                semester.querySelector('.semester-credits').style.border = '1px solid #ddd';
            }
            
            if (!isNaN(gpa) && !isNaN(credits)) {
                totalPoints += gpa * credits;
                totalCredits += credits;
            }
        });
        
        if (!allValid || semesters.length === 0) {
            cgpaResult.querySelector('.total-credits span').textContent = '0';
            cgpaResult.querySelector('.cgpa-value span').textContent = '0.00';
            cgpaResult.style.display = 'flex';
            cgpaResult.style.color = '#e74c3c';
            return;
        }
        
        const cgpa = totalPoints / totalCredits;
        cgpaResult.querySelector('.total-credits span').textContent = totalCredits.toFixed(1);
        cgpaResult.querySelector('.cgpa-value span').textContent = cgpa.toFixed(2);
        cgpaResult.style.display = 'flex';
        cgpaResult.style.color = '#27ae60';
    });
});
