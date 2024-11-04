<template>
  <div>
    <!-- Collapsed Navbar -->
    <div v-if="!isOpen" class="collapsed-sidebar">
      <img class="T3dots" :src="require('../assets/nabvar_icon.png')" alt="Description of the image" @click="toggleSidebar">
      <nav class="navbar" style="margin-right: 80px">
        <ul style=" margin-right: 0; margin-left: 75px">
          <li :class="{ 'active': $route.path === '/home' }">
            <router-link to="/register" class="nav-link"><img src="../assets/registration_icon.png" alt="Home Icon" class="main-logo"></router-link>
          </li>
          <br>
          <li :class="{ 'active': $route.path === '/audience' }">
            <router-link to="/" class="nav-link"><img src="../assets/dashboard_icon.png" alt="Audience Icon" class="main-logo"></router-link>
          </li>
          <br>

        </ul>
      </nav>
    </div>

    <div v-else class="expanded-sidebar">
      <div class="header">
<!--        <img src="../assets/JeeVika_logo_ai.png" alt="Logo" class="logo">-->
        <img src="../assets/img/wadi_logo3.png" alt="Logo" class="logo">
        <img class="cross" :src="require('../assets/cross.png')" alt="Close Icon" @click="toggleSidebar">
      </div>
      <ul class="menu">
        <li @click="toggleSidebar" :class="{ 'active': $route.path === '/home' }">
          <router-link to="/register" class="nav-link">
            <img src="../assets/registration_icon.png" alt="Home Icon" class="main-logo2"><h4>Registration</h4>
          </router-link>
        </li>
        <li @click="toggleSidebar" :class="{ 'active': $route.path === '/audience' }">
          <router-link to="/" class="nav-link">
            <img src="../assets/dashboard_icon.png" alt="Audience Icon" class="main-logo2"><h4>Dashboard</h4>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    },
    navigate(page) {
      console.log(`Navigating to ${page}`);
      this.toggleSidebar();
    }
  }
}
</script>

<style scoped>

.T3dots {
  height: 45px;
  width: 30px;
}
.navbar {
  padding: 15px;
  width: 140px;
  height: 88vh;
  margin-top: 30%;
  margin-right: -2px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: -10px;
}

.cross {
  height: 35px;
  width: 35px;
}


.logo {
  height: 50px;
  width: 140px;
  margin-bottom: 20px;
}

.main-logo {
  height: 40px;
  width: 40px;
}

.main-logo2 {
  height: 40px;
  width: 40px;
}

.collapsed-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 60px;
  height: 100%;
  background-color: #8ed1c0;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: white;
  z-index: 1000;
}

.expanded-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: #8ed1c0;
  color: white;
  z-index: 1000;
  padding: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
}

.expanded-sidebar .header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.expanded-sidebar .logo {
  height: 40px;
}

.expanded-sidebar .cross {
  cursor: pointer;
  height: 30px;
  width: 30px;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  padding: 15px 0;
  cursor: pointer;
  font-size: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.menu li:hover {
  background-color: #10aca3;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
}

.nav-link {
  color: white;
  text-decoration: none;
  flex-grow: 1;
  text-align: center;
}
@media (max-width: 768px) {
  .expanded-sidebar {
    width: 200px;
  }

  .collapsed-sidebar {
    width: 50px;
  }

  .main-logo2 {
    height: 30px;
    width: 30px;
  }

  .nav-link {
    font-size: 16px;
  }
}
</style>
