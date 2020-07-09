const pageBody = document.querySelector("body");
const mainPage = document.querySelector(".container-fluid");
const navButton = document.querySelector("button.navbar-toggler");
const navLinks = document.getElementById("navLinks");
const sideLinks = document.querySelector(".nav-link");

function openNav() {
	navLinks.style.width = "250px";
	pageBody.style.marginLeft = "250px";
	pageBody.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
	return;
}

function closeNav() {
	navLinks.style.width = "0";
	pageBody.style.marginLeft = "0";
	pageBody.style.backgroundColor = "#edf2f7";
	return;
}

navButton.addEventListener('click', openNav);
navLinks.addEventListener('click', closeNav);
mainPage.addEventListener('click', closeNav);