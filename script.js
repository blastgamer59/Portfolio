// active hamburger menu
let menuIcon = document.querySelector(".menu-icon");
let navlist = document.querySelector(".navlist");
menuIcon.addEventListener("click", () => {
  menuIcon.classList.toggle("active");
  navlist.classList.toggle("active");
  document.body.classList.toggle("open");
});

// remove navlist
navlist.addEventListener("click", () => {
  navlist.classList.remove("active");
  menuIcon.classList.remove("active");
  document.body.classList.remove("open");
});

// rotate text js code
let text = document.querySelector(".text p");

text.innerHTML = text.innerHTML
  .split("")
  .map((char, i) => `<b style="transform:rotate(${i * 6.3}deg")>${char}</b>`)
  .join("");

// switch between about buttons

const buttons = document.querySelectorAll(".about-btn button");
const contents = document.querySelectorAll(".content");

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    contents.forEach((content) => (content.style.display = "none"));
    contents[index].style.display = "block";
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

// portfolio fillter

var mixer = mixitup(".portfolio-gallery", {
  selectors: {
    target: ".portfolio-box",
  },
  animation: {
    duration: 500,
  },
});

// Initialize swiperjs

var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },

  breakpoints: {
    576: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  },
});

//   skill Progress bar

const first_skill = document.querySelector(".skill:first-child");
const sk_counters = document.querySelectorAll(".counter span");
const progress_bars = document.querySelectorAll(".skills svg circle");

window.addEventListener("scroll", () => {
  if (!skillsPlayed) skillsCounter();
});

function hasReached(el) {
  let topPosition = el.getBoundingClientRect().top;
  if (window.innerHeight >= topPosition + el.offsetHeight) return true;
  return false;
}

function updateCount(num, maxNum) {
  let currentNum = +num.innerText;

  if (currentNum < maxNum) {
    num.innerText = currentNum + 1;
    setTimeout(() => {
      updateCount(num, maxNum);
    }, 12);
  }
}

let skillsPlayed = false;

function skillsCounter() {
  if (!hasReached(first_skill)) return;
  skillsPlayed = true;
  sk_counters.forEach((counter, i) => {
    let target = +counter.dataset.target;
    let strokeValue = 465 - 465 * (target / 100);

    progress_bars[i].style.setProperty("--target", strokeValue);

    setTimeout(() => {
      updateCount(counter, target);
    }, 400);
  });

  progress_bars.forEach(
    (p) => (p.style.animation = "progress 2s ease-in-out forwards")
  );
}

// side progress bar

let calcScrollValue = () => {
  let scrollProgress = document.getElementById("progress");
  let pos = document.documentElement.scrollTop;

  let calcHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrollValue = Math.round((pos * 100) / calcHeight);

  if (pos > 100) {
    scrollProgress.style.display = "grid";
  } else {
    scrollProgress.style.display = "none";
  }

  scrollProgress.addEventListener("click", () => {
    document.documentElement.scrollTop = 0;
  });

  scrollProgress.style.background = `conic-gradient(#fff ${scrollValue}%,#e6006d ${scrollValue}%)`;
};

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;

// active menu

let menuLi = document.querySelectorAll("header ul li a");
let section = document.querySelectorAll("section");

function activeMenu() {
  let len = section.length;
  while (--len && window.scrollY + 97 < section[len].offsetTop) {}
  menuLi.forEach((sec) => sec.classList.remove("active"));
  menuLi[len].classList.add("active");
}
activeMenu();
window.addEventListener("scroll", activeMenu);

// scroll reveal

ScrollReveal({
  distance: "90px",
  duration: 2000,
  delay: 200,
  // reset: true ,
});

ScrollReveal().reveal(".hero-info,.main-text,.proposal,.heading", {
  origin: "top",
});
ScrollReveal().reveal(".about-img,.fillter-buttons,.contact-info", {
  origin: "left",
});
ScrollReveal().reveal(".about-content,.skills", { origin: "right" });
ScrollReveal().reveal(
  ".allServices,.portfolio-gallery,.blog-box,footer,.img-hero",
  { origin: "bottom" }
);

document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("W-nFmnXLDsBcq5tYd"); // Replace with your EmailJS public key

  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    let firstname = document.querySelector(
      'input[placeholder="First Name"]'
    ).value;
    let lastname = document.querySelector(
      'input[placeholder="Last Name"]'
    ).value;
    let email = document.querySelector('input[placeholder="Email"]').value;
    let subject = document.querySelector('input[placeholder="Subject"]').value;
    let message = document.querySelector("textarea").value;

    // EmailJS parameters
    let templateParams = {
      from_name: firstname + " " + lastname,
      from_email: email,
      subject: subject,
      message: message,
    };

    // Send email using EmailJS
    emailjs
      .send("service_w3bcnun", "template_z6lhf2o", templateParams)
      .then(function (response) {
        alert("Message sent successfully!");

        // ✅ Clear input fields after successful submission
        document.querySelector("form").reset();
      })
      .catch(function (error) {
        alert("Error sending message. Please try again.");
        console.error("EmailJS error:", error);
      });
  });
});
// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Check for saved theme preference or default to light
const savedTheme = localStorage.getItem("theme") || "light";
body.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

// Toggle theme on button click
themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

// Update the theme toggle icon (sun/moon)
function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("i");
  icon.className = theme === "light" ? "bx bx-sun" : "bx bx-moon";
}
