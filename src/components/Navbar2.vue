<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">WADI</div>
      <div class="navbar-links" :class="{ 'active': isMenuOpen }">
        <a href="#home" @click.prevent="scrollTo('home')" :class="{ active: activeSection === 'home' }">Home</a>
        <a href="#about" @click.prevent="scrollTo('about')" :class="{ active: activeSection === 'about' }">About</a>
        <a href="#features" @click.prevent="scrollTo('features')" :class="{ active: activeSection === 'features' }">Features</a>
        <a href="#crops" @click.prevent="scrollTo('crops')" :class="{ active: activeSection === 'crops' }">Calendar</a>
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
      if (!element) return
      
      const yOffset = -80 // Offset for navbar height
      const targetPosition = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      const startPosition = window.pageYOffset
      const distance = targetPosition - startPosition
      const duration = 1000 // Duration in milliseconds
      let start = null

      function easeInOutCubic(t) {
        return t < 0.5 
          ? 4 * t * t * t 
          : 1 - Math.pow(-2 * t + 2, 3) / 2
      }

      function animation(currentTime) {
        if (start === null) start = currentTime
        const timeElapsed = currentTime - start
        const progress = Math.min(timeElapsed / duration, 1)
        const easing = easeInOutCubic(progress)
        
        window.scrollTo(0, startPosition + distance * easing)
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation)
        } else {
          // Ensure we land exactly on target
          window.scrollTo(0, targetPosition)
        }
      }

      requestAnimationFrame(animation)
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
  font-weight: 900;
  background: linear-gradient(45deg, #FFD700, #FFB800);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Montserrat', sans-serif;
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
  transition: all 0.3s ease;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.navbar-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #FFC107;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.navbar-links a:hover::after {
  width: 80%;
}

.navbar-links a.active {
  background-color: #FFC107;
  color: black;
}

.navbar-links a:hover {
  transform: translateY(-2px);
}

.login-btn {
  background-color: #FFC107;
  color: black;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background-color: #FFC107;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.5);
  transform: scale(1.05);
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