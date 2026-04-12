function nextStep(step) {
	let tabTrigger = document.querySelector(
		`button[data-bs-target="#step${step}"]`
	);
    let tab = new bootstrap.Tab(tabTrigger);
	
	tab.show();
	updateProgress(step);
}



function previousStep(step) {
	let tabTrigger = document.querySelector(
		`button[data-bs-target="#step${step}"]`
	);

	let tab = new bootstrap.Tab(tabTrigger);
	
	tab.show();
	updateProgress(step);
}


function validateStep1() {
	let nameValue = document.getElementById("name").value.trim();
	let emailValue = document.getElementById("email").value.trim();
	

	// if one of them is empty, show danger alert
	if (nameValue === "" || emailValue === "") {
		showAlert("Please fill all fields", "danger");
		return false;
	}
	
	return true;
}


function submitForm() {
	showAlert("Registration completed successfully", "success");
}



function showAlert(message, type) {
	let area = document.getElementById("alert-area");
	let alert = document.createElement("div");

	alert.className = "alert alert-" + type;
	alert.textContent = message;

	area.appendChild(alert);
	
	// remove alert after 3 seconds
	setTimeout(() => alert.remove(), 3000);
}



// dynamically update the progress bar width
function updateProgress(step) {
	let progress = document.getElementById("wizardProgress");
	let percent = (step / 3) * 100;

	progress.style.width = percent + "%";
}