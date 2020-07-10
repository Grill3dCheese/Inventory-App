const pageBody = document.querySelector("body");
const mainPage = document.querySelector(".container-fluid");
const navButton = document.querySelector("button.navbar-toggler");
const navLinks = document.getElementById("navLinks");
const sideLinks = document.querySelector(".nav-link");
const greet = document.querySelector("#greeting");
const today = new Date();
const curHr = today.getHours();

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

function timeCheck() {
if (curHr < 12) {
  greet.innerText = '🌅 \n Good Morning,';
} else if (curHr < 18) {
  greet.innerText = '☀ \n Good Afternoon,';
} else {
  greet.innerText = '🌙 \n Good Evening,';
	}
}

navButton.addEventListener('click', openNav);
navButton.addEventListener('click', timeCheck);
navLinks.addEventListener('click', closeNav);
mainPage.addEventListener('click', closeNav);