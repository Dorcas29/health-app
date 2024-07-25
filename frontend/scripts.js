const API_URL = 'https://your-vercel-backend-url.vercel.app/patients';

document.addEventListener('DOMContentLoaded', () => {
    fetchPatients();
});

document.getElementById('complianceForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const patientId = document.getElementById('patientId').value;
    const patientName = document.getElementById('patientName').value;
    const medication = document.getElementById('medication').value;
    const diet = document.getElementById('diet').value;
    const initialPills = parseInt(document.getElementById('initialPills').value);
    const pillsPerDay = parseInt(document.getElementById('pillsPerDay').value);

    const isValid = validateForm(patientName, medication, diet, initialPills, pillsPerDay);
    if (!isValid) return;

    const remainingPills = initialPills; 
    const compliancePercentage = 100; 

    const patientData = {
        patientName,
        medication,
        diet,
        initialPills,
        pillsPerDay,
        remainingPills,
        compliancePercentage
    };

    if (patientId) {
        updatePatient(patientId, patientData);
    } else {
        addPatient(patientData);
    }

    document.getElementById('complianceForm').reset();
    document.getElementById('patientId').value = '';
});

function fetchPatients() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const patientList = document.getElementById('patientList');
            patientList.innerHTML = '';
            data.forEach(patient => {
                addPatientToList(patient);
            });
        })
        .catch(error => console.error('Error:', error));
}

function validateForm(patientName, medication, diet, initialPills, pillsPerDay) {
    let isValid = true;

    if (patientName === '') {
        showError('patientNameError', 'Patient name is required');
        isValid = false;
    } else {
        hideError('patientNameError');
    }

    if (medication === '') {
        showError('medicationError', 'Medication is required');
        isValid = false;
    } else {
        hideError('medicationError');
    }

    if (diet === '') {
        showError('dietError', 'Diet is required');
        isValid = false;
    } else {
        hideError('dietError');
    }

    if (initialPills <= 0) {
        showError('initialPillsError', 'Initial pill count must be greater than zero');
        isValid = false;
    } else {
        hideError('initialPillsError');
    }

    if (pillsPerDay <= 0) {
        showError('pillsPerDayError', 'Pills taken per day must be greater than zero');
        isValid = false;
    } else {
        hideError('pillsPerDayError');
    }

    return isValid;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.style.display = 'none';
}

function addPatient(patientData) {
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
    })
    .then(response => response.json())
    .then(patient => {
        addPatientToList(patient);
    })
    .catch(error => console.error('Error:', error));
}

function updatePatient(patientId, patientData) {
    fetch(`${API_URL}/${patientId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
    })
    .then(response => response.json())
    .then(updatedPatient => {
        const patientListItem = document.getElementById(`patient-${patientId}`);
        patientListItem.remove();
        addPatientToList(updatedPatient);
    })
    .catch(error => console.error('Error:', error));
}

function deletePatient(patientId) {
    fetch(`${API_URL}/${patientId}`, {
        method: 'DELETE'
    })
    .then(() => {
        const patientListItem = document.getElementById(`patient-${patientId}`);
        patientListItem.remove();
    })
    .catch(error => console.error('Error:', error));
}

function addPatientToList(patient) {
    const patientList = document.getElementById('patientList');
    const listItem = document.createElement('li');
    listItem.id = `patient-${patient._id}`;
    listItem.innerHTML = `
        <strong>Name:</strong> ${patient.patientName}<br>
        <strong>Medication:</strong> ${patient.medication}<br>
        <strong>Diet:</strong> ${patient.diet}<br>
        <strong>Initial Pills:</strong> ${patient.initialPills}<br>
        <strong>Pills Per Day:</strong> ${patient.pillsPerDay}<br>
        <strong>Remaining Pills:</strong> ${patient.remainingPills}<br>
        <strong>Compliance Percentage:</strong> ${patient.compliancePercentage}%
        <button class="edit-btn" onclick="editPatient('${patient._id}')">Edit</button>
        <button class="delete-btn" onclick="deletePatient('${patient._id}')">Delete</button>
    `;
    patientList.appendChild(listItem);
}

function editPatient(patientId) {
    fetch(`${API_URL}/${patientId}`)
        .then(response => response.json())
        .then(patient => {
            document.getElementById('patientId').value = patient._id;
            document.getElementById('patientName').value = patient.patientName;
            document.getElementById('medication').value = patient.medication;
            document.getElementById('diet').value = patient.diet;
            document.getElementById('initialPills').value = patient.initialPills;
            document.getElementById('pillsPerDay').value = patient.pillsPerDay;
        })
        .catch(error => console.error('Error:', error));
}

function setNotifications() {
    const reviewDate = document.getElementById('reviewDateInput').value;
    const pillTime = document.getElementById('pillTimeInput').value;
    const dietInfo = document.getElementById('dietInfoInput').value;

    if (!reviewDate || !pillTime || !dietInfo) {
        alert('All fields are required to set notifications.');
        return;
    }

    alert(`Notifications set!\nReview Date: ${reviewDate}\nPill Time: ${pillTime}\nSpecial Diet Info: ${dietInfo}`);
}

function searchContent() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const patientList = document.getElementById('patientList');
    const patients = patientList.getElementsByTagName('li');

    for (let i = 0; i < patients.length; i++) {
        const patient = patients[i];
        if (patient.textContent.toLowerCase().includes(searchInput)) {
            patient.style.display = '';
        } else {
            patient.style.display = 'none';
        }
    }
}

