// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");

mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  mobileMenuBtn.querySelector("i").classList.toggle("fa-bars");
  mobileMenuBtn.querySelector("i").classList.toggle("fa-times");
  document.body.style.overflow = navLinks.classList.contains("active")
    ? "hidden"
    : "";
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    !navLinks.contains(e.target) &&
    !mobileMenuBtn.contains(e.target) &&
    navLinks.classList.contains("active")
  ) {
    navLinks.classList.remove("active");
    mobileMenuBtn.querySelector("i").classList.add("fa-bars");
    mobileMenuBtn.querySelector("i").classList.remove("fa-times");
    document.body.style.overflow = "";
  }
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    mobileMenuBtn.querySelector("i").classList.add("fa-bars");
    mobileMenuBtn.querySelector("i").classList.remove("fa-times");
  });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 90;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Close mobile menu if open
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  });
});

// Contact Form Submission
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Here you would typically send the data to your server
    console.log("Form submitted:", data);

    // Show success message
    alert("Thank you for your message. We will get back to you shortly!");
    contactForm.reset();
  });
}

// Enhanced Contact Form Handling
document
  .querySelector(".contact-form form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector(".submit-button");
    const originalText = submitButton.innerHTML;

    // Show loading state
    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    try {
      const formData = new FormData(form);
      console.log("Contact Form Data:", Object.fromEntries(formData));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = "form-success";
      successMessage.innerHTML =
        '<i class="fas fa-check-circle"></i> Thank you! We will contact you shortly.';
      form.replaceWith(successMessage);
    } catch (error) {
      console.error("Form submission error:", error);
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      alert("There was an error submitting the form. Please try again.");
    }
  });

// Add scroll event listener for navbar
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
  } else {
    navbar.style.background = "var(--white)";
    navbar.style.boxShadow = "none";
  }
});

// Add animation on scroll
const observerOptions = {
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll("section").forEach((section) => {
  observer.observe(section);
});

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
    navLinks.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// Quote Popup
const quoteButtons = document.querySelectorAll('[data-popup="quote"]');
const popup = document.querySelector(".popup");
const closePopup = document.querySelector(".close-popup");
const popupForm = document.querySelector(".popup-form");

quoteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

if (closePopup) {
  closePopup.addEventListener("click", () => {
    popup.classList.remove("active");
    document.body.style.overflow = "";
  });
}

// Close popup when clicking outside
popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// Handle popup form submission
if (popupForm) {
  popupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(popupForm);
    console.log("Quote Request:", Object.fromEntries(formData));

    // Show success message
    popupForm.innerHTML =
      "<h3>Thank you!</h3><p>We will contact you shortly.</p>";

    // Close popup after delay
    setTimeout(() => {
      popup.classList.remove("active");
      document.body.style.overflow = "";
      // Reset form
      popupForm.innerHTML = originalFormHtml;
    }, 3000);
  });
}

// Social Proof Counter Animation
const counters = document.querySelectorAll(".count");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute("data-target")) || 0;
        entry.target.textContent = target + (target === 98 ? "%" : "+");
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

// Video Testimonial
const videoPlaceholder = document.querySelector(".video-placeholder");
if (videoPlaceholder) {
  videoPlaceholder.addEventListener("click", () => {
    const videoId = videoPlaceholder.getAttribute("data-video-id");
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.allow = "autoplay; encrypted-media";
    iframe.allowFullscreen = true;
    videoPlaceholder.replaceWith(iframe);
  });
}

// Show popup after delay or scroll
setTimeout(() => {
  if (
    !document.cookie.includes("hidePopup=true") &&
    !popup.classList.contains("active")
  ) {
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}, 30000); // 30 seconds

let scrolled = false;
window.addEventListener("scroll", () => {
  if (!scrolled && window.scrollY > window.innerHeight * 0.5) {
    scrolled = true;
    if (
      !document.cookie.includes("hidePopup=true") &&
      !popup.classList.contains("active")
    ) {
      popup.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }
});

// Trust Indicators hover effect
const trustItems = document.querySelectorAll(".trust-item");
trustItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    item.style.transform = "scale(1.05)";
  });
  item.addEventListener("mouseleave", () => {
    item.style.transform = "scale(1)";
  });
});

// Gallery functionality
function loadGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  if (!galleryGrid) return;

  // Get the current path
  const currentPath = window.location.pathname;
  const isRoot = currentPath === "/" || currentPath.endsWith("index.html");
  const basePath = isRoot ? "" : "../";

  fetch((isRoot ? "" : "../") + "admin/upload.php?action=getGallery")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((images) => {
      console.log("Received images:", images); // Debug log
      if (!Array.isArray(images) || images.length === 0) {
        galleryGrid.innerHTML = "<p>No images available in the gallery.</p>";
        return;
      }

      galleryGrid.innerHTML = images
        .map(
          (image) => `
            <div class="gallery-item">
              <img 
                src="${image.path}" 
                alt="Construction Project" 
                loading="lazy" 
                onerror="this.onerror=null; this.src='images/placeholder.jpg'">
              <div class="overlay">
                <h3>Project Image</h3>
                <p>Click to view full size</p>
              </div>
            </div>
          `
        )
        .join("");

      // Add click handlers for gallery items
      document.querySelectorAll(".gallery-item").forEach((item) => {
        item.addEventListener("click", () => {
          const img = item.querySelector("img");
          if (img.src.includes("placeholder.jpg")) {
            alert("Full size image is not available.");
            return;
          }
          window.open(img.src, "_blank");
        });
      });
    })
    .catch((error) => {
      console.error("Error loading gallery:", error);
      galleryGrid.innerHTML =
        "<p>Error loading gallery images. Please try again later.</p>";
    });
}

// Call loadGallery when the page loads
document.addEventListener("DOMContentLoaded", loadGallery);
