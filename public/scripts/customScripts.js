const mainPage = document.querySelector('.container-fluid');
const navButton = document.querySelector('button.navbar-toggler');
const navLinks = document.getElementById('navLinks');
const sideLinks = document.querySelectorAll('.nav-link');
const greet = document.querySelector('#greeting');
const today = new Date();
const curHr = today.getHours();

window.setTimeout(function () {
	$('.alert').slideUp(500, function () {
		$(this).remove();
	});
}, 3000);

	// hides navbar upon scrolling down and then reappears upon scrolling up

	var c,
		currentScrollTop = 0,
		navbar = $('nav');

	$(window).scroll(function () {
		var a = $(window).scrollTop();
		var b = navbar.height();

		currentScrollTop = a;

		if (c < currentScrollTop && a > b + b) {
			navbar.addClass('scrollUp');
		} else if (c > currentScrollTop && !(a <= b)) {
			navbar.removeClass('scrollUp');
		}
		c = currentScrollTop;
	});

	// Add active class
	var selector = '.top-bar li';
	var url = window.location.href;
	var target = url.split('/');
	$(selector).each(function() {
		if($(this).find('a').attr('href')===('/inventory/'+target[target.length-1])){
			$(selector).removeClass('active');
			$(this).removeClass('active').addClass('active');
		}
	});

function openNav() {
	navLinks.style.width = '270px';
	document.body.style.marginLeft = '270px';
	document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
	return;
}

function closeNav() {
	navLinks.style.width = '0';
	document.body.style.marginLeft = '0';
	document.body.style.backgroundColor = '#edf2f7';
	return;
}

function timeCheck() {
	if (curHr < 12) {
		greet.innerText = '🌅 \n Good Morning,';
	} else if (curHr < 18) {
		greet.innerText = '☀️ \n Good Afternoon,';
	} else {
		greet.innerText = '🌙 \n Good Evening,';
	}
}

navButton.addEventListener('click', timeCheck);
navButton.addEventListener('click', openNav);
sideLinks.forEach((item) => {
	item.addEventListener('click', closeNav);
});
mainPage.addEventListener('click', closeNav);