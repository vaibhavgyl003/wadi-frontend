<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">WADI</div>
      <div class="navbar-links" :class="{ 'active': isMenuOpen }">
        <a href="#home" @click="scrollTo('home')" :class="{ active: activeSection === 'home' }">Home</a>
        <a href="#about" @click="scrollTo('about')" :class="{ active: activeSection === 'about' }">About</a>
        <a href="#features" @click="scrollTo('features')" :class="{ active: activeSection === 'features' }">Features</a>
      </div>
      <button class="login-btn" @click="$emit('login')">Login</button>
      <div class="menu-icon" @click="toggleMenu" :class="{ 'open': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar2',
  props: ['activeSection'],
  data () {
    return {
      isMenuOpen: false
    }
  },
  methods: {
    scrollTo(section) {
      const element = document.getElementById(section)
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      })
      this.$emit('update-active-section', section)
      this.isMenuOpen = false
    },
    toggleMenu () {
      this.isMenuOpen = !this.isMenuOpen
    }
  }
}
</script>

<style scoped>
.navbar {
  background-color: #38980B;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: 900; /* Very bold */
  background: linear-gradient(45deg, #FFD700, #FFB800); /* Gold gradient */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; /* Gradient effect */
  font-family: 'Montserrat', sans-serif; /* Stylish, modern font */
  letter-spacing: 1px;
}

.navbar-links {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}

.navbar-links a {
  color: white;
  text-decoration: none;
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s, color 0.3s;
  border-radius: 4px;
}

.navbar-links a.active {
  background-color: #FFC107;
  color: black;
}

.login-btn {
  background-color: #FFC107;
  color: black;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}


.login-btn:hover {
  background-color: #FFC107;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease; /* Added transition for transform */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.5);
  transform: scale(1.05); /* Scale the button to 105% of its original size */
}

.menu-icon {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  cursor: pointer;
}

.menu-icon span {
  display: block;
  width: 100%;
  height: 3px;
  background-color: white;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .navbar-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #38980B;
    padding: 1rem 0;
  }

  .navbar-links.active {
    display: flex;
  }

  .navbar-links a {
    margin: 0.5rem 0;
    width: 100%;
    text-align: center;
  }

  .menu-icon {
    display: flex;
    margin-left: 1rem;
  }

  .menu-icon.open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .menu-icon.open span:nth-child(2) {
    opacity: 0;
  }

  .menu-icon.open span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }

  .login-btn {
    margin-left: auto;
  }
}
</style>
