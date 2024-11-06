<template>
  <div class="landing-page">
    <Navbar2 :activeSection="activeSection" @update-active-section="scrollToSection" @login="handleLogin" />
    <section id="home" class="home-section">
      <div class="home-content">
        <h1>Women Agriculture Development Initiatives</h1>
        <h2 class="tagline">Sowing Seeds of Change</h2>
        <p>"Empowering Women Farmers for a Sustainable Tomorrow"</p>
      </div>
      <transition name="fade">
        <div class="home-image" :class="loadingClass">
          <div v-if="!imageLoaded" class="skeleton-loader"></div>
          <img
            :src="require('../assets/img/IndiaFarmers.png')"
            alt="Women farmers"
            @load="handleImageLoad"
            :style="{ opacity: imageLoaded ? 1 : 0 }"
          />
        </div>
      </transition>
    </section>
    <section id="about" class="about-section">
      <div class="about-content">
        <h2 class="about-heading">About Us</h2>
        <div class="about-text">
          <p>The WADI initiative is dedicated to empowering women farmers through sustainable horticulture practices and community-driven resilience.</p>
          <p>Our mission is to equip women farmers with the skills, resources, and support necessary to thrive, fostering a brighter future for their families and communities.</p>
          <p>In Chhattisgarh, women play a vital role in maintaining backyard kitchen gardens, known locally as "Badi." These gardens are crucial for ensuring food security, enhancing nutrition, and providing additional income.</p>
          <p class="lead">At the heart of our philosophy is the belief that when women are empowered, entire communities flourish. Through training, guidance, and resource support, we enable women to develop agriculture skills, enhance their economic prospects, build resilience, and drive community-driven prosperity.</p>
          <p class="lead">
            By sowing the seeds of change, we cultivate a brighter future for all.
          </p>
        </div>
      </div>
      <div class="about-images">
        <img src="../assets/img/showcase.jpg" alt="About 1" />
        <img src="../assets/img/showcase.jpg" alt="About 2" />
        <img src="../assets/img/showcase.jpg" alt="About 3" />
        <img src="../assets/img/showcase.jpg" alt="About 4" />
      </div>
    </section>

    <section id="features" class="features-section">
      <h2>Our Features</h2>
      <div class="features-content">
        <div class="features-image">
          <img src="../assets/img/impact.jpg" alt="Features" />
        </div>
        <div class="features-list">
          <div class="feature-item">
            <h3>Knowledge Dissemination</h3>
            <p>Providing IEC materials for best practices, tips, and techniques for successful backyard gardening, including pest management and crop rotation.</p>
          </div>
          <div class="feature-item">
            <h3>Community Engagement</h3>
            <p>Creating a network of women farmers for mutual support and knowledge sharing.</p>
          </div>
          <div class="feature-item">
            <h3 class="feature-title">Targeted Beneficiaries</h3>
            <p class="feature-text">
              Empowering 1,000 women farmers in Mahasamund district to enhance their backyard kitchen gardening practices.
            </p>
          </div>
          <div class="feature-item">
            <h3>Resourceful Kits</h3>
            <p>Distribution of comprehensive kits containing high-quality seeds and other essential materials to facilitate effective gardening.</p>
          </div>
          <div class="feature-item">
            <h3 class="feature-title">Economic Empowerment</h3>
            <p class="feature-text">
              Encouraging women to sell surplus produce in local markets, thereby creating additional income streams and contributing to household economic stability.
            </p>
          </div>
        </div>
      </div>
    </section>



  <section id="crops" class="crops-section">
    <h2 id="Crops-Calendar">Crops Calendar</h2>
    <div class="crops-dropdown">
      <label for="crops-type">Select Crops Type:</label>
      <select id="crops-type" v-model="selectedCropsType">
        <option value="horticulture">Horticulture</option>
        <option value="agriculture">Agriculture</option>
      </select>
    </div>
    
    <div class="crops-calendar">
      <div v-if="selectedCropsType === 'agriculture'">
        <table>
          <thead>
            <tr>
              <th>Vegetables</th>
              <th v-for="month in months" :key="month">{{ month }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vegetable in vegetables" :key="vegetable.name">
              <td>{{ vegetable.name }}</td>
              <td v-for="month in months" :key="`${vegetable.name}-${month}`">
                <span v-if="vegetable.plantingMonths.includes(month)" class="planting-indicator">🌱</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else>
        <table>
          <thead>
            <tr>
              <th>Fruits</th>
              <th v-for="month in months" :key="month">{{ month }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="fruit in fruits" :key="fruit.name">
              <td>
                <span>{{ fruit.icon }} {{ fruit.name }}</span>
              </td>
              <td v-for="month in months" :key="`${fruit.name}-${month}`">
                <span v-if="fruit.plantingMonths.includes(month)" class="planting-indicator">🌱</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>



    <footer class="footer">
      <p>© 2024 WADI. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import Navbar2 from './Navbar2.vue';

export default {
  name: 'LandingPage',
  components: {
    Navbar2
  },
  data () {
    return {
      activeSection: 'home',
      imageLoaded: false,
      isLoading: true,
      selectedCropsType: 'horticulture',
      months: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'Oct', 'Nov', 'Dec'],
      vegetables: [
        { name: '🍅 Tomato', plantingMonths: ['April', 'May', 'June', 'July', 'August', 'September', 'October'] },
        { name: '🫑 Bottle Gourd', plantingMonths: ['March', 'April', 'May', 'June', 'July'] },
        { name: '🌶️ Chilly', plantingMonths: ['March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'] },
        { name: '🥕 Carrot', plantingMonths: ['September', 'October', 'November'] },
        { name: '🥬 Radish', plantingMonths: ['September', 'October', 'November'] },
        { name: '🎃 Pumpkin', plantingMonths: ['March', 'April', 'May'] },
        { name: '🫑 Sponge Gourd', plantingMonths: ['March', 'April', 'May', 'June', 'July'] },
        { name: '🌿 Okra', plantingMonths: ['March', 'April', 'May', 'June', 'July'] },
        { name: '🍠 Sweet Potato', plantingMonths: ['June', 'July', 'August'] },
      ],
      fruits: [
        { name: 'Guava', icon: '🍐', plantingMonths: ['May', 'June'] },
        { name: 'Custard Apple', icon: '🍏', plantingMonths: [] },
        { name: 'Mango', icon: '🥭', plantingMonths: [] },
        { name: 'Papaya', icon: '🍈', plantingMonths: [] },
        { name: 'Lemon', icon: '🍋', plantingMonths: [] },
      ],
    }
  },
  created: function () {
    this.checkSignedin()
  },
  updated () {
    this.checkSignedin()
  },
  computed: {
    loadingClass() {
      return {
        'is-loading': !this.imageLoaded,
        'is-loaded': this.imageLoaded
      }
    }
  },
  methods: {
    checkSignedin: function () {
      if (localStorage.signedIn) {
        this.$router.replace('/dashboard')
      }
    },
    handleImageLoad() {
      setTimeout(() => {
        this.imageLoaded = true;
        this.isLoading = false;
      }, 300);
    },
    updateActiveSection(section) {
      this.activeSection = section;
    },
    scrollToSection(section) {
      const element = document.getElementById(section);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
        this.activeSection = section;
      }
    },
    handleLogin () {
      this.$router.push('/login')
    },
    handleScroll () {
      const sections = ['home', 'about', 'features','crops']
      let current = ''

      for (let section of sections) {
        const element = document.getElementById(section);
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          current = section
          break
        }
      }

      if (current !== this.activeSection) {
        this.activeSection = current;
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<style scoped>
.landing-page {
  font-family: 'Open Sans', sans-serif;
  color: #333;
  padding-top: 80px;
}

.home-section, .about-section, .features-section {
  display: flex;
  padding: 4rem 2rem;
  min-height: 70vh;
  align-items: center;
  gap: 50px;
}

.home-section {
  background-color: #E8F5E9;
}

.home-content, .home-image {
  flex: 1;
}

.home-content h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: black;
  margin-bottom: 1rem;
}

.home-content .tagline {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: green;
  margin-bottom: 1rem;
}

.home-content p {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: black;
}

.home-image {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.home-image img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  display: block;
}

.home-image img:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}


.skeleton-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
  #f0f0f0 0%,
  #f8f8f8 50%,
  #f0f0f0 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
  border-radius: 10px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}


.home-image.is-loading {
  min-height: 300px;
}

.home-image.is-loaded img {
  opacity: 1;
  transform: translateY(0);
}

.home-image img {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.about-section {
  background-color: white;
}

.about-content, .about-images {
  flex: 1;
}

.about-content h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: #2E7D32;
  margin-bottom: 1rem;
  text-shadow: -1px -1px 0 #fff, 1px 1px 0 rgba(0, 0, 0, 0.2);
}

.about-text p {
  font-size: clamp(1.1rem, 2vw, 1.2rem);
  line-height: 1.7;
  margin-bottom: 1.4rem;
}

.about-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.about-images img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-images img:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.features-section {
  background-color: #E8F5E9;
  flex-direction: column;
}

.features-section h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: #2E7D32;
  margin-bottom: 2rem;
}

.features-content {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.features-image, .features-list {
  flex: 1;
}

.features-image img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.features-image img:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.feature-item {
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.feature-item h3 {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  color: #2E7D32;
  margin-bottom: 0.5rem;
}

.feature-item p {
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: #555;
}

.footer {
  background-color: #4CAF50;
  color: white;
  text-align: center;
  padding: 1rem;
}

@media (max-width: 768px) {
  .home-section, .about-section, .features-section {
    flex-direction: column;
    padding: 2rem 1rem;
  }

  .home-content, .home-image, .about-content, .about-images, .features-image, .features-list {
    width: 100%;
  }

  .about-images {
    grid-template-columns: 1fr;
  }

  .features-content {
    flex-direction: column;
  }
}

  #Crops-Calendar {
  margin-top: 2rem;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: #2E7D32;
  font-weight: bold;
}

/*STYLES FOR CROPS SECTION */
.crops-section {
  padding: 2rem;
  background-color: #f5f5f5;
}

.crops-dropdown {
  margin: 2rem 0;
  text-align: center;
}

.crops-dropdown label {
  margin-right: 1rem;
  font-weight: bold;
}

.crops-dropdown select {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 2px solid #4CAF50;
  font-size: 1rem;
  cursor: pointer;
}

.crops-calendar {
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: auto;
}

.crops-calendar table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.crops-calendar th,
.crops-calendar td {
  padding: 1rem;
  text-align: center;
  border: 1px solid #ddd;
}

.crops-calendar th {
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
}

.crops-calendar tr:hover {
  background-color: #f9f9f9;
}

.planting-indicator {
  font-size: 1.5rem;
  color: #4CAF50;
}

@media (max-width: 768px) {
  .crops-calendar {
    margin: 0 -1rem;
  }
  
  .crops-calendar th,
  .crops-calendar td {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  .planting-indicator {
    font-size: 1.2rem;
  }
}
</style>
