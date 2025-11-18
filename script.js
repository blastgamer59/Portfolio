// ==================== DOM Elements ============================
const menuIcon = document.querySelector(".menu-icon");
const navlist = document.querySelector(".navlist");
const overlay = document.querySelector(".overlay");
const logo = document.querySelector(".logo");
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// ==================== Navigation ============================
class Navigation {
  constructor() {
    this.init();
  }

  init() {
    // Hamburger menu toggle
    menuIcon.addEventListener("click", this.toggleMenu.bind(this));

    // Close menu when clicking nav links or overlay
    navlist.addEventListener("click", this.closeMenu.bind(this));
    overlay.addEventListener("click", this.closeMenu.bind(this));

    // Logo click handler
    logo.addEventListener("click", this.handleLogoClick.bind(this));
  }

  toggleMenu() {
    menuIcon.classList.toggle("active");
    navlist.classList.toggle("active");
    document.body.classList.toggle("open");
  }

  closeMenu() {
    menuIcon.classList.remove("active");
    navlist.classList.remove("active");
    document.body.classList.remove("open");
  }

  handleLogoClick(e) {
    e.preventDefault();
    sessionStorage.setItem("scrollToHome", "true");
    window.location.reload();
  }
}

// ==================== About Section ============================
class AboutSection {
  constructor() {
    this.buttons = document.querySelectorAll(".about-btn button");
    this.contents = document.querySelectorAll(".content");
    this.init();
  }

  init() {
    this.buttons.forEach((button, index) => {
      button.addEventListener("click", () => this.switchContent(index));
    });
  }

  switchContent(index) {
    // Hide all contents
    this.contents.forEach(content => content.style.display = "none");

    // Show selected content
    this.contents[index].style.display = "block";

    // Update active button
    this.buttons.forEach(btn => btn.classList.remove("active"));
    this.buttons[index].classList.add("active");

    // Re-initialize animations
    AnimationManager.initSectionAnimations();
  }
}

// ==================== Portfolio Filter ============================
class PortfolioFilter {
  constructor() {
    this.mixer = null;
    this.init();
  }

  init() {
    this.mixer = mixitup(".portfolio-gallery", {
      selectors: {
        target: ".portfolio-box",
      },
      animation: {
        duration: 500,
      },
      callbacks: {
        onMixEnd: () => {
          AnimationManager.initSectionAnimations();
        }
      }
    });
  }
}

// ==================== Skills Counter ============================
class SkillsCounter {
  constructor() {
    this.firstSkill = document.querySelector(".skill:first-child");
    this.skCounters = document.querySelectorAll(".counter span");
    this.progressBars = document.querySelectorAll(".skills svg circle");
    this.skillsPlayed = false;

    // Only initialize if elements exist
    if (this.firstSkill || this.skCounters.length > 0 || this.progressBars.length > 0) {
      this.init();
    }
  }

  init() {
    window.addEventListener("scroll", () => {
      if (!this.skillsPlayed) this.skillsCounter();
    });
  }

  hasReached(el) {
    // Check if element exists before accessing its properties
    if (!el) return false;

    const topPosition = el.getBoundingClientRect().top;
    return window.innerHeight >= topPosition + el.offsetHeight;
  }

  updateCount(num, maxNum) {
    // Check if counter element exists
    if (!num) return;

    let currentNum = +num.innerText;

    if (currentNum < maxNum) {
      num.innerText = currentNum + 1;
      setTimeout(() => {
        this.updateCount(num, maxNum);
      }, 12);
    }
  }

  skillsCounter() {
    // Check if we have any skills elements to animate
    const hasSkillsElements = this.firstSkill || this.skCounters.length > 0;

    if (!hasSkillsElements) {
      this.skillsPlayed = true;
      return;
    }

    // If firstSkill exists, check if we've reached it
    if (this.firstSkill && !this.hasReached(this.firstSkill)) return;

    this.skillsPlayed = true;

    // Only process counters if they exist
    if (this.skCounters.length > 0) {
      this.skCounters.forEach((counter, i) => {
        const target = +counter.dataset.target;
        const strokeValue = 465 - 465 * (target / 100);

        // Only process progress bars if they exist
        if (this.progressBars[i]) {
          this.progressBars[i].style.setProperty("--target", strokeValue);
        }

        setTimeout(() => {
          this.updateCount(counter, target);
        }, 400);
      });
    }

    // Only animate progress bars if they exist
    if (this.progressBars.length > 0) {
      this.progressBars.forEach(
        p => (p.style.animation = "progress 2s ease-in-out forwards")
      );
    }
  }
}


// ==================== Scroll Progress ============================
class ScrollProgress {
  constructor() {
    this.scrollProgress = document.getElementById("progress");
    this.init();
  }

  init() {
    window.onscroll = this.calcScrollValue.bind(this);
    window.onload = this.calcScrollValue.bind(this);

    this.scrollProgress.addEventListener("click", () => {
      document.documentElement.scrollTop = 0;
    });
  }

  calcScrollValue() {
    const pos = document.documentElement.scrollTop;
    const calcHeight = document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollValue = Math.round((pos * 100) / calcHeight);

    if (pos > 100) {
      this.scrollProgress.style.display = "grid";
    } else {
      this.scrollProgress.style.display = "none";
    }

    this.scrollProgress.style.background =
      `conic-gradient(#fff ${scrollValue}%,#0d9488 ${scrollValue}%)`;
  }
}

// ==================== Active Menu ============================
class ActiveMenu {
  constructor() {
    this.menuLi = document.querySelectorAll("header ul li a");
    this.sections = document.querySelectorAll("section");
    this.init();
  }

  init() {
    this.activeMenu();
    window.addEventListener("scroll", this.activeMenu.bind(this));
  }

  activeMenu() {
    let len = this.sections.length;
    while (--len && window.scrollY + 97 < this.sections[len].offsetTop) { }

    this.menuLi.forEach(sec => sec.classList.remove("active"));

    if (this.menuLi[len]) {
      this.menuLi[len].classList.add("active");
    }
  }
}

// ==================== Theme Toggle ============================
class ThemeToggle {
  constructor() {
    this.themeToggle = document.getElementById("theme-toggle");
    this.body = document.body;
    this.init();
  }

  init() {
    const savedTheme = localStorage.getItem("theme") || "light";
    this.body.setAttribute("data-theme", savedTheme);
    this.updateThemeIcon(savedTheme);

    this.themeToggle.addEventListener("click", this.toggleTheme.bind(this));
  }

  toggleTheme() {
    const currentTheme = this.body.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    this.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    this.updateThemeIcon(newTheme);
  }

  updateThemeIcon(theme) {
    const icon = this.themeToggle.querySelector("i");
    icon.className = theme === "light" ? "bx bx-sun" : "bx bx-moon";
  }
}

// ==================== Contact Form ============================
class ContactForm {
  constructor() {
    this.init();
  }

  init() {
    // Initialize EmailJS
    emailjs.init("W-nFmnXLDsBcq5tYd");


    document.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleSubmit(event);
    });
  }

  handleSubmit(event) {
    const formData = this.collectFormData();

    if (this.validateForm(formData)) {
      this.sendEmail(formData);
    }
  }

  collectFormData() {

    return {
      firstname: document.querySelector('input[placeholder="First Name"]').value,
      lastname: document.querySelector('input[placeholder="Last Name"]').value,
      email: document.querySelector('input[placeholder="Email"]').value,
      subject: document.querySelector('input[placeholder="Subject"]').value,
      message: document.querySelector("textarea").value
    };
  }

  validateForm(data) {
    // Basic validation
    if (!data.firstname || !data.lastname || !data.email || !data.message) {
      alert("Please fill in all required fields.");
      return false;
    }

    if (!this.isValidEmail(data.email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  sendEmail(data) {
    const templateParams = {
      from_name: data.firstname + " " + data.lastname,
      from_email: data.email,
      subject: data.subject || "No Subject Provided",
      message: data.message,
    };


    emailjs
      .send("service_i7dq7h3", "template_f8f14dj", templateParams)
      .then(() => {
        alert("Message sent successfully!");
        document.querySelector("form").reset();
      })
      .catch((error) => {
        alert("Error sending message. Please try again.");
        console.error("EmailJS error:", error);
      });
  }
}

// ==================== Animation Manager ============================
class AnimationManager {
  static init() {
    this.initScrollToHome();
    this.initSectionAnimations();
    this.setupEventListeners();
  }

  static initScrollToHome() {
    window.addEventListener("load", function () {
      if (sessionStorage.getItem("scrollToHome")) {
        sessionStorage.removeItem("scrollToHome");
        const homeSection = document.getElementById("home");
        if (homeSection) {
          homeSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }

  static initSectionAnimations() {
    const sections = document.querySelectorAll('section');
    const textBoxes = document.querySelectorAll('.text-box');
    const portfolioBoxes = document.querySelectorAll('.portfolio-box');
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Reset animations
    sections.forEach(section => {
      section.classList.remove('animate-in');
    });

    textBoxes.forEach(box => {
      box.classList.remove('animate-in');
    });

    portfolioBoxes.forEach(box => {
      box.classList.remove('animate-in');
    });

    timelineItems.forEach(item => {
      item.classList.remove('animate-in');
    });

    // Trigger animations
    setTimeout(() => {
      this.animateOnScroll();
    }, 100);
  }

  static animateOnScroll() {
    const elements = document.querySelectorAll('section, .text-box, .portfolio-box, .timeline-item');
    const triggerBottom = window.innerHeight * 0.85;

    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < triggerBottom) {
        element.classList.add('animate-in');
      }
    });
  }

  static setupEventListeners() {
    window.addEventListener('scroll', () => {
      this.animateOnScroll();
    });

    window.addEventListener('resize', () => {
      setTimeout(() => this.initSectionAnimations(), 100);
    });
  }
}

// ==================== Swiper Initialization ============================
class SwiperInit {
  constructor() {
    this.init();
  }

  init() {
    if (document.querySelector(".mySwiper")) {
      new Swiper(".mySwiper", {
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
    }
  }
}

// ==================== Application Initialization ============================
class App {
  constructor() {
    this.init();
  }

  init() {
    // Initialize all components
    new Navigation();
    new AboutSection();
    new PortfolioFilter();
    new SkillsCounter();
    new ScrollProgress();
    new ActiveMenu();
    new ThemeToggle();
    new ContactForm();
    new SwiperInit();

    // Initialize animations
    AnimationManager.init();

    console.log("Portfolio website initialized successfully!");
  }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});