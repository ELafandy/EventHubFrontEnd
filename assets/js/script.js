// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", savedTheme)
  updateThemeIcon(savedTheme)
}

function updateThemeIcon(theme) {
  const themeIcons = document.querySelectorAll(".theme-icon")
  themeIcons.forEach((icon) => {
    icon.textContent = theme === "dark" ? "☀️" : "🌙"
  })
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeIcon(newTheme)
}

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", () => {
  initTheme()

  // Add theme toggle listeners
  const themeToggles = document.querySelectorAll("#themeToggle")
  themeToggles.forEach((toggle) => {
    toggle.addEventListener("click", toggleTheme)
  })

  // Scroll animations
  observeElements()
})

// Scroll Animation Observer
function observeElements() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  // Observe slide-up elements
  document.querySelectorAll(".slide-up").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
    observer.observe(el)
  })
}

// Initialize sample data if none exists
function initSampleData() {
  if (!localStorage.getItem("events")) {
    const sampleEvents = [
      {
        id: "E1",
        name: "Medo Orabi",
        date: "2025-12-11T18:00",
        location: "Elgomhoria , Sirs Elyan",
        category: "Concert",
        price: 20.0,
        totalTickets: 100,
        availableTickets: 100,
        description: "Join us for an unforgettable evening of live music featuring top artist in the world.",
        organizerId: "U1",
        organizerName: "EventPro Inc.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "E2",
        name: "Shehab Elgen",
        date: "2025-10-31T09:00",
        location: "San Stefano, Alexandria",
        category: "Concert",
        price: 75.0,
        totalTickets: 300,
        availableTickets: 300,
        description: "Come to the  best concert from Shehab Elsayed in Alexandria .",
        organizerId: "U1",
        organizerName: "TechEvents LLC",
        createdAt: new Date().toISOString(),
      },
      {
        id: "E3",
        name: "Photography Workshop",
        date: "2024-06-10T10:00",
        location: "Downtown , Cairo",
        category: "workshop",
        price: 45.0,
        totalTickets: 20,
        availableTickets: 20,
        description: "Master the art of portrait photography with professional photographer Jane Smith.",
        organizerId: "U1",
        organizerName: "Creative Workshops",
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("events", JSON.stringify(sampleEvents))
  }
}

// Initialize sample data on first load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSampleData)
} else {
  initSampleData()
}

// Utility function to format dates
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Utility function to generate unique IDs
function generateId(prefix) {
  return prefix + Date.now() + Math.random().toString(36).substr(2, 9)
}
