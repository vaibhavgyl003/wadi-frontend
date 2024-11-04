<template>
  <div class="dashboard">
    <div class="card">
      <div class="card-title">Metrics</div>
      <div class="metrics" style="margin-top: 15px">
        <div v-for="metric in visibleMetrics"
             :key="metric.name"
             class="metric-card"
             :class="getColorClass(metric.color)">
          <div class="metric-content">
            <div class="label">{{ metric.label }}</div>
            <div class="value">{{ metric.value }}</div>
          </div>
          <div class="glow"></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Filter</div>
      <div class="filters">
        <div class="dropdown-container">
          <div class="select-wrapper">
            <select v-model="filters.state">
              <option :value="null" disabled>Select State</option>
              <option v-for="state in states" :key="state.id" :value="state">
                {{ state.name }}
              </option>
            </select>
            <span class="select-icon">▼</span>
          </div>

          <div class="select-wrapper">
            <select v-model="filters.district" :disabled="!filters.state">
              <option :value="null" disabled>Select District</option>
              <option v-for="district in districts" :key="district.id" :value="district">
                {{ district.name }}
              </option>
            </select>
            <span class="select-icon">▼</span>
          </div>

          <div class="select-wrapper">
            <select v-model="filters.block" :disabled="!filters.district">
              <option :value="null">Select Block</option>
              <option v-for="block in blocks" :key="block.id" :value="block">
                {{ block.name }}
              </option>
            </select>
            <span class="select-icon">▼</span>
          </div>

          <div class="select-wrapper">
            <select v-model="filters.village" :disabled="!filters.block">
              <option :value="null">Select Village</option>
              <option v-for="village in villages" :key="village.id" :value="village">
                {{ village.name }}
              </option>
            </select>
            <span class="select-icon">▼</span>
          </div>

          <div class="select-wrapper" v-if="isAdmin">
            <select v-model="filters.agent">
              <option :value="null">Select Agent</option>
              <option v-for="agent in agents" :key="agent.id" :value="agent">
                {{ agent.name }}
              </option>
            </select>
            <span class="select-icon">▼</span>
          </div>
        </div>

        <div class="button-container">
          <button class="apply-btn" @click="applyFilter">
          <span class="button-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
            </svg>
            Apply Filter
          </span>
          </button>
          <button v-if="filter_applied" class="reset-btn" @click="resetFilter">
          <span class="button-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            Reset Filters
          </span>
          </button>
        </div>
      </div>
    </div>
    <div class="card2">
<!--      <button class="download-csv" @click="downloadCSV">Download CSV</button>-->
      <div class="card-title">Beneficiary List</div>
      <div class="table-wrapper" style="margin-top: 15px">
        <table class="registration-table">
          <thead>
          <tr style="background-color: lightgray; font-weight: bolder;">
            <th class="fixed-col">S. No</th>
            <th>Name</th>
            <th>Registration No.</th>
            <th>Age</th>
            <th>Phone No.</th>
            <th>Block</th>
            <th>Village</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(beneficiary, index) in paginatedData" :key="beneficiary.id">
            <td class="fixed-col">{{ index + 1 }}</td>
            <td>{{ beneficiary.name }}</td>
            <td>{{ beneficiary.registration_number }}</td>

            <td>{{ beneficiary.dob }}</td>
            <td>{{ beneficiary.phone }}</td>
            <td>{{ beneficiary.block }}</td>
            <td>{{ beneficiary.village }}</td>
            <td @click="showImagesPopup(beneficiary)">{{ beneficiary.image_count }}</td>
            <td>
              <img class="T3dots" :src="require('../assets/edit_icon.png')" alt="Edit image" @click="showEditPopup(beneficiary)">
              <div v-if="isAdmin"><img class="T3dots" :src="require('../assets/delete_icon.png')" alt="Delete image" @click="showDeletePopup(beneficiary)"></div>
              <div v-else><img class="T3dots" :src="require('../assets/view_icon.png')" alt="View image" @click="showViewPopup(beneficiary)"></div>

            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-container">
        <div class="pagination" v-if="pagesToDisplay.length >= 1">
          <div class="pagination-controls">
            <button
              v-if="(this.total_count/this.perPage)>20 && (currentPage1-pagesToDisplay[0])>=4"
              @click="fastPrevPage"
              class="nav-button"
              aria-label="Go to first page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>
              </svg>
            </button>

            <button
              v-if="currentPage1!==1"
              @click="prevPage"
              class="nav-button"
              aria-label="Previous page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            <div class="page-numbers">
              <template v-for="page in pagesToDisplay">
                <template v-if="page === 'ellipsis'">
              <span class="ellipsis" :key="page">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"/>
                  <circle cx="19" cy="12" r="1"/>
                  <circle cx="5" cy="12" r="1"/>
                </svg>
              </span>
                </template>
                <template v-else>
                  <button
                    @click="changePage(page)"
                    :class="{ 'page-number': true, 'active': currentPage1 === page }"
                    :key="page"
                  >
                    {{ page }}
                  </button>
                </template>
              </template>
            </div>

            <button
              v-if="currentPage1!==pagesToDisplay[pagesToDisplay.length-1]"
              @click="nextPage"
              class="nav-button"
              aria-label="Next page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>

            <button
              v-if="(this.total_count/this.perPage)>20 && (pagesToDisplay[pagesToDisplay.length-1]-currentPage1)>=4"
              @click="fastNextPage"
              class="nav-button"
              aria-label="Go to last page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13 17l5-5-5-5M6 17l5-5-5-5"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="ocr-popup-overlay" v-if="showEditModal || showDeleteModal || showViewModal || showImagesModal" @click="closePopup">
      <div class="ocr-popup-content user-details" @click.stop>
        <h2 class="popup-title">{{ getPopupTitle() }}</h2>

        <div v-if="showEditModal">
          <div class="input-box">
            <span class="details">First Name<span class="mandatory">*</span></span>
            <input type="text" v-model="form.firstName" placeholder="Enter your first name" required />
          </div>
          <div class="input-box">
          <span class="details">
            Last Name<span class="mandatory">*</span>
          </span>
            <input type="text" v-model="form.lastName" placeholder="Enter your last name" required />
          </div>

          <div class="input-box">
            <span class="details">Phone Number<span class="mandatory">*</span></span>
            <div style="display: flex; align-items: center;">
              <input type="number" placeholder="+91" disabled style="width: 70px; margin-right: 10px; font-weight: bold; font-size: 20px">
              <input type="text" v-model="form.phoneNumber" placeholder="98******21" required maxlength="10" @input="validatePhoneNumber" />
            </div>
          </div>

          <div class="input-box">
          <span class="details">
            Relation<span class="mandatory">*</span>
          </span>
            <select v-model="form.relation" required>
              <option value="" disabled>Select Relation</option>
              <option value="Father">Father</option>
              <option value="Husband">Husband</option>
            </select>
          </div>
          <div class="input-box">
          <span class="details">
            Father's/Husband's Name<span class="mandatory">*</span>
          </span>
            <input type="text" v-model="form.relationName" placeholder="Enter the name" required />
          </div>
          <div class="input-box">
          <span class="details">
            Gender<span class="mandatory">*</span>
          </span>
            <select v-model="form.gender" required>
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="input-box">
            <span class="details">Age<span class="mandatory">*</span></span>
            <input type="number" v-model="form.age" placeholder="Enter your age" @input="validateAge" required />
          </div>
          <div class="input-box">
            <span class="details">
              Date Of Birth<span class="mandatory">*</span>
            </span>
            <input type="date" class="custom-date-picker" v-model="form.dateOfBirth" @input="updateAge"  required />
          </div>

          <div class="input-box">
            <span class="details">Average Annual Family Income<span class="mandatory">*</span></span>
            <input type="text" v-model="form.income" placeholder="100000/- ₹" @input="validateIncome" required />
          </div>

          <div class="input-box">
            <span class="details">
              Average Land in Acres<span class="mandatory">*</span>
            </span>
            <input type="text" v-model="form.land" placeholder="Land in Acres" @input="validateLand" required />
          </div>

          <div class="input-box">
          <span class="details">
            Whether you are going to use this Kit or Not?<span class="mandatory">*</span>
          </span>
            <div class="checkbox-group">
              <input type="radio" v-model="form.isKitDistributed" value="true" id="kit-yes" required />
              <label for="kit-yes" class="radio-label" >Yes</label>
              <input type="radio" v-model="form.isKitDistributed" value="false" id="kit-no" required />
              <label for="kit-no" class="radio-label" >No</label>
            </div>
          </div>

          <div class="user-details">
            <div class="input-box" v-for="level in levels" :key="level">
            <span class="details">
              {{ capitalize(level) }}<span class="mandatory">*</span>
            </span>
              <select v-model="selectedLocation[level]" @change="handleChange(level)" required class="dropdown-style">
                <option v-for="item in locationData[level]" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="farmer-images">
            <h3>Images</h3>
            <table v-if="farmerImages.length > 0">
              <thead>
              <tr>
                <th>Image</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(image, index) in farmerImages" :key="image.id">
                <td>Image {{ index + 1 }}</td>
                <td>{{ formatDate(image.created_at) }}</td>
                <td>
                  <button @click="viewImage(image.id)">View</button>
                  <button @click="downloadImage(image.id)">Download</button>
                  <button @click="deleteImage(image.id)">Delete</button>
                </td>
              </tr>
              </tbody>
            </table>
            <p v-else>No images available for this farmer.</p>
          </div>

          <div class = "apply-filter-button1">
            <button @click="updateBeneficiary">Save</button>
            <button @click="closePopup">Close</button>
          </div>
        </div>


        <div v-if="showDeleteModal">
          <p>Are you sure you want to delete this beneficiary?</p>
          <br>
          <p>क्या आप वाकई इस लाभार्थी को हटाना चाहते हैं?</p>
          <div class="apply-filter-button1" style="margin: 10px">
            <button @click="closePopup">Close/नहीं</button>
            <button @click="confirmDelete">Confirm/हाँ</button>
          </div>
        </div>
        <div v-if="showImagesModal">
          <h4 class="popup-title">Farmer Images</h4>
          <div class="farmer-images-popup">
            <div class="image-grid" v-if="farmerImages.length > 0">
              <div v-for="image in farmerImages" :key="image.id" class="image-item">
                <img :src="image.full_image_url" @click="viewImage(image.id)" alt="Farmer Image" style="width: 90%; height: 20%; margin: 4px; border: 7px black solid"/>

              </div>
            </div>
            <p v-else>No images available for this farmer.</p>
          </div>
          <div class="apply-filter-button1" style="margin: 10px">
            <button @click="closePopup">Close/नहीं</button>
          </div>
        </div>

        <div v-if="showViewModal">
          <div class="input-box">
            <span class="details">First Name<span class="mandatory">*</span></span>
            <input type="text" v-model="form.firstName" placeholder="Enter your first name" disabled />
          </div>
          <div class="input-box">
          <span class="details">
            Last Name<span class="mandatory">*</span>
          </span>
            <input type="text" v-model="form.lastName" placeholder="Enter your last name" disabled />
          </div>
          <div class="input-box">
          <span class="details">
            Phone Number<span class="mandatory">*</span>
          </span>
            <div style="display: flex; align-items: center;">
              <input type="number" placeholder="+91" disabled style="width: 70px; margin-right: 10px; font-weight: bold; font-size: 20px">
              <input type="text" v-model="form.phoneNumber" placeholder="98******21" style="flex-grow: 1;" maxlength="10" disabled >
            </div>
          </div>

          <div class="input-box">
          <span class="details">
            Relation<span class="mandatory">*</span>
          </span>
            <select v-model="form.relation" disabled>
              <option value="" disabled>Select Relation</option>
              <option value="Father">Father</option>
              <option value="Husband">Husband</option>
            </select>
          </div>
          <div class="input-box">
          <span class="details">
            Father's/Husband's Name<span class="mandatory">*</span>
          </span>
            <input type="text" v-model="form.relationName" placeholder="Enter the name" disabled />
          </div>
          <div class="input-box">
          <span class="details">
            Gender<span class="mandatory">*</span>
          </span>
            <select v-model="form.gender" disabled>
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="input-box">
          <span class="details">
            Age<span class="mandatory">*</span>
          </span>
            <input type="number" v-model="form.age" placeholder="Enter your age" @input="updateDateOfBirth" disabled />
          </div>
          <div class="input-box">
          <span class="details">
            Date Of Birth<span class="mandatory">*</span>
          </span>
            <input type="date" class="custom-date-picker" v-model="form.dateOfBirth" @input="updateAge"  disabled />
          </div>
          <div class="input-box">
            <span class="details">
              Average Land in Acres<span class="mandatory">*</span>
            </span>
            <input type="text" v-model="form.land" placeholder="Land in Acres" disabled />
          </div>
          <div class="input-box">
            <span class="details">
              Whether Kit was Distributed?<span class="mandatory">*</span>
            </span>
            <div class="checkbox-group">
              <input type="radio" v-model="form.isKitDistributed" value="true" id="kit-yes" disabled />
              <label for="kit-yes" class="radio-label" >Yes</label>
              <input type="radio" v-model="form.isKitDistributed" value="false" id="kit-no" disabled />
              <label for="kit-no" class="radio-label" >No</label>
            </div>
          </div>
          <div class="user-details">
            <div class="input-box" v-for="level in levels" :key="level">
            <span class="details">
              {{ capitalize(level) }}<span class="mandatory">*</span>
            </span>
              <select v-model="selectedLocation[level]"  required class="dropdown-style" disabled>
                <option v-for="item in locationData[level]" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="farmer-images">
            <h3>Images</h3>
            <table v-if="farmerImages.length > 0">
              <thead>
              <tr>
                <th>Image</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(image, index) in farmerImages" :key="image.id">
                <td>Image {{ index + 1 }}</td>
                <td>{{ formatDate(image.created_at) }}</td>
                <td>
                  <button @click="viewImage(image.id)">View</button>
                  <button @click="downloadImage(image.id)">Download</button>
                </td>
              </tr>
              </tbody>
            </table>
            <p v-else>No images available for this farmer.</p>
          </div>

          <div class = "apply-filter-button1">
            <button @click="closePopup">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MetricCard from './MetricCard.vue'
// eslint-disable-next-line camelcase
import pagination_ic from '../assets/pagination_dots.svg'
// eslint-disable-next-line camelcase
import left_ic from '../assets/left.svg'
// eslint-disable-next-line camelcase
import right_ic from '../assets/right.svg'
// eslint-disable-next-line camelcase
import DoubleLeft_ic from '../assets/DoubleLeft.svg'
// eslint-disable-next-line camelcase
import DoubleRight_ic from '../assets/DoubleRight.svg'

export default {
  name: 'Dashboard',
  components: {MetricCard},
  data () {
    return {
      left_ic,
      right_ic,
      pagination_ic,
      DoubleLeft_ic,
      DoubleRight_ic,
      filter_applied: false,
      user_role: null,
      filters: {
        state: null,
        district: null,
        block: null,
        village: null,
        agent: null
      },
      states: [{
        id: 1,
        name: 'Chhatisgarh'
      }],
      districts: [],
      blocks: [],
      villages: [],
      agents: [],
      visibleMetrics: [],
      currentPage1: 1,
      currentPage: 1,
      perPage: 10,
      pagesToShow: 2,
      fastJump: 4,
      total_count: null,
      farmer: null,

      paginatedData: [],
      form: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        relation: '',
        relationName: '',
        gender: '',
        age: '',
        dateOfBirth: '',
        land: '',
        isKitDistributed: '',
        income: ''
      },
      showEditModal: false,
      showDeleteModal: false,
      showViewModal: false,
      beneficiary: null,
      levels: ['state', 'district', 'block', 'village'],
      selectedLocation: {
        state: null,
        district: null,
        block: null,
        village: null
      },
      locationData: {
        state: [],
        district: [],
        block: [],
        village: []
      },
      errors: {
        phoneNumber: null,
        age: null,
        income: null,
        land: null
      },
      farmerImages: [],
      showImagesModal: false
    }
  },
  watch: {
    'filters.state': 'fetchDistricts',
    'filters.district': 'fetchBlocks',
    'filters.block': 'fetchVillages'
  },

  async mounted () {
    await this.fetchMetrics()
    await this.fetchFarmers(1)
    let admin = this.isAdmin
    if (admin) await this.fetchAgents()
  },
  computed: {
    isAdmin () {
      let abc = this.getCookie('user_info')
      if (abc) {
        const userInfo = JSON.parse(abc).role
        if (userInfo !== 'agent') { return true }
      }
      return false
    },
    pages () {
      return Array.from({length: Math.ceil(this.total_count / this.perPage)}, (_, i) => i + 1)
    },
    pagesToDisplay () {
      const pages = []
      const totalPages = this.pages.length
      const start = Math.max(this.currentPage1 - this.pagesToShow, 1)
      const end = Math.min(this.currentPage1 + this.pagesToShow, totalPages)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      if (this.currentPage1 > this.pagesToShow + 1) pages.unshift(this.currentPage1 - (this.currentPage1 - 1), 'ellipsis')
      if (this.currentPage1 < totalPages - this.pagesToShow) pages.push('ellipsis', totalPages)
      return pages
    }
  },
  methods: {
    getColorClass (color) {
      const colorMap = {
        blue: 'metric-blue',
        purple: 'metric-purple',
        green: 'metric-green',
        orange: 'metric-orange',
        red: 'metric-red',
        teal: 'metric-teal',
        indigo: 'metric-indigo',
        pink: 'metric-pink',
        amber: 'metric-amber',
        cyan: 'metric-cyan'
      };
      return colorMap[color] || 'metric-blue';
    },
    validatePhoneNumber () {
      const phoneNumber = this.form.phoneNumber
      const phonePattern = /^[1-9]\d{9}$/
      if (!phonePattern.test(phoneNumber)) {
        this.errors.phoneNumber = 'Phone number must be 10 digits and cannot start with 0.\n\n फ़ोन नंबर 10 अंकों का होना चाहिए और 0 से शुरू नहीं हो सकता है.'
      } else {
        this.errors.phoneNumber = null
      }
    },
    validateAge () {
      if (isNaN(this.form.age) || this.form.age < 0) {
        this.errors.age = 'Age must be a valid number.\n\n आयु एक वैध संख्या होनी चाहिए.'
      } else {
        this.errors.age = null
      }
      this.updateDateOfBirth()
    },
    validateIncome () {
      const incomePattern = /^\d+$/
      if (!incomePattern.test(this.form.income)) {
        this.errors.income = 'Income must be a valid number.\n\n आय एक वैध संख्या होनी चाहिए.'
      } else {
        this.errors.income = null
      }
    },
    validateLand () {
      const landPattern = /^\d+$/
      if (!landPattern.test(this.form.land)) {
        this.errors.land = 'Land area must be a valid number.\n\n भूमि क्षेत्र एक वैध संख्या होनी चाहिए.'
      } else {
        this.errors.land = null
      }
    },
    async showImagesPopup (beneficiary) {
      this.farmer = beneficiary.id
      this.showImagesModal = true
      await this.fetchFarmerImages2()
    },
    formatDate (dateString) {
      return new Date(dateString).toLocaleDateString()
    },
    getCookie (name) {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) {
        let encodedValue = parts.pop().split(';').shift()
        return decodeURIComponent(encodedValue)
      }
    },
    fetchMetrics () {
      this.$http.secured.get('/metrics')
        .then(response => {
          this.visibleMetrics = response.data.visibleMetrics
        })
        .catch(error => {
          console.error('signout_error -> ' + error)
        })
    },
    fetchAgents () {
      this.$http.secured.get('/agents')
        .then(response => {
          this.agents = response.data.agents
        })
        .catch(error => {
          console.error('signout_error -> ' + error)
        })
    },
    fetchDistricts () {
      if (this.filters.state === '') { return }
      this.districts = [{
        id: 2, // change it to 1 in production
        name: 'Mahasamund'
      }]
    },
    async fetchBlocks () {
      if (this.filters.district === '') { return }
      await this.$http.secured.get('/blocks',
        {
          params: {
            district: this.filters.district
          }
        }).then(response => {
        this.blocks = response.data.blocks
      })
    },
    async fetchVillages () {
      if (this.filters.block === '') { return }
      await this.$http.secured.get('/villages',
        {
          params: {
            block: this.filters.block
          }
        }).then(response => {
        this.villages = response.data.villages
      })
    },
    async applyFilter () {
      if (this.filters.state == null && this.filters.district == null && this.filters.block == null && this.filters.village == null && this.filters.agent == null) {
        alert('Please select atleast one filter \n\n कृपया कम से कम एक फ़िल्टर चुनें')
        return
      }
      await this.$http.secured.get('/filtered_data', {
        params: {
          state: this.filters.state ? this.filters.state.id : null,
          district: this.filters.district ? this.filters.district.id : null,
          block: this.filters.block ? this.filters.block.id : null,
          village: this.filters.village ? this.filters.village.id : null,
          agent: this.filters.agent ? this.filters.agent.id : null
        }
      }).then((response) => {
        this.filter_applied = true
        this.visibleMetrics = response.data.visibleMetrics
        this.fetchFarmers(this.currentPage1)
      })
    },
    async resetFilter () {
      this.filters.block = null, this.filters.village = null, this.filters.agent = null
      this.filter_applied = false
      await this.fetchMetrics()
      await this.fetchFarmers(this.currentPage1)
    },
    fetchFarmers (page) {
      this.$http.secured.get('/farmers_data',
        {
          params: {
            page: page,
            state: this.filters.state ? this.filters.state.id : null,
            district: this.filters.district ? this.filters.district.id : null,
            block: this.filters.block ? this.filters.block.id : null,
            village: this.filters.village ? this.filters.village.id : null,
            agent: this.filters.agent ? this.filters.agent.id : null
          }
        })
        .then(response => {
          this.paginatedData = response.data.data
          this.total_count = response.data.count
        })
    },
    downloadCSV () {

    },
    fetchDetails (beneficiary) {
      this.$http.secured.get('/fetch_farmer_data',
        {
          params: {
            id: beneficiary.id
          }
        })
        .then(async response => {
          this.form = response.data.form
          this.selectedLocation = response.data.location
          console.log('his.selectedLocation', this.selectedLocation)
          await this.loadAllLevels()
        })
    },
    async loadAllLevels () {
      let abc = 1
      for (const level of this.levels) {
        console.log(`${abc} -> ${this.selectedLocation[level]}`)
        abc = abc + 1
        await this.loadLevel(level)
        if (!this.selectedLocation[level]) break
      }
      console.log('this.selectedLocation', this.selectedLocation)
    },
    async loadLevel (level) {
      const params = { level }
      if (level !== 'state') {
        const parentLevel = this.levels[this.levels.indexOf(level) - 1]
        params[parentLevel] = this.selectedLocation[parentLevel]
      }

      try {
        const response = await this.$http.secured.get('/location', { params })
        this.locationData[level] = response.data
        console.log('this.locationData', this.locationData)
      } catch (error) {
        console.error(`Error fetching ${level} data:`, error)
      }
    },
    async handleChange (level) {
      const index = this.levels.indexOf(level)
      if (index < this.levels.length - 1) {
        for (let i = index + 1; i < this.levels.length; i++) {
          this.selectedLocation[this.levels[i]] = null
          this.locationData[this.levels[i]] = []
        }
        await this.loadLevel(this.levels[index + 1])
      }
      console.log('hahahaha', this.selectedLocation)
    },
    async showEditPopup (beneficiary) {
      this.farmer = beneficiary.id
      await this.fetchDetails(beneficiary)
      this.showEditModal = true
      await this.fetchFarmerImages()
    },
    showDeletePopup (beneficiary) {
      this.farmer = beneficiary.id
      this.showDeleteModal = true
    },
    async showViewPopup (beneficiary) {
      await this.fetchDetails(beneficiary)
      this.showViewModal = true
      this.farmer = beneficiary.id
      await this.fetchFarmerImages()
    },
    closePopup () {

      this.showEditModal = false
      this.showDeleteModal = false
      this.showViewModal = false
      this.farmer = null
      this.showImagesModal = false
      this.form.firstName = ''; this.form.lastName = ''; this.form.phoneNumber = ''; this.form.relation = ''; this.form.relationName = ''
      this.form.gender = ''; this.form.age = ''; this.form.dateOfBirth = ''; this.form.land = ''; this.form.isKitDistributed = ''

      this.errors.age = null; this.errors.land = null; this.errors.income = null; this.errors.phoneNumber = null
    },
    getPopupTitle () {
      if (this.showEditModal) return 'Edit Beneficiary'
      if (this.showDeleteModal) return 'Delete Beneficiary'
      if (this.showViewModal) return 'View Beneficiary'
      return ''
    },
    async fetchFarmerImages () {
      try {
        const response = await this.$http.secured.get(`/farmers/${this.farmer}/images`)
        this.farmerImages = response.data
      } catch (error) {
        console.error('Error fetching farmer images:', error)
      }
    },
    async fetchFarmerImages2 () {
      try {
        const response = await this.$http.secured.get(`/farmers/${this.farmer}/display_images`)
        this.farmerImages = response.data
      } catch (error) {
        console.error('Error fetching farmer images:', error)
      }
    },
    async viewImage (imageId) {
      try {
        const response = await this.$http.secured.get(`/farmers/${this.farmer}/images/${imageId}/view`)
        window.open(response.data.signed_url, '_blank')
      } catch (error) {
        console.error('Error viewing image:', error)
      }
    },
    async downloadImage (imageId) {
      try {
        const response = await this.$http.secured.get(`/farmers/${this.farmer}/images/${imageId}/download`)
        window.open(response.data.signed_url, '_blank')
      } catch (error) {
        console.error('Error downloading image:', error)
      }
    },
    async deleteImage (imageId) {
      if (confirm('Are you sure you want to delete this image?')) {
        try {
          await this.$http.secured.delete(`/farmers/${this.farmer}/images/${imageId}`)
          await this.fetchFarmerImages()
        } catch (error) {
          console.error('Error deleting image:', error)
        }
      }
    },
    async updateBeneficiary () {
      await this.updateFarmer()
      this.closePopup()
      await this.fetchMetrics()
    },
    async confirmDelete () {
      try {
        const response = await this.$http.secured.delete(`/farmers/${this.farmer}`)
        await this.fetchFarmers(1)
        this.closePopup()
        this.fetchMetrics()
      } catch (error) {
        console.error('Failed to Delete farmer:', error)
        alert('Failed to Delete farmer. Please try again. \n\n किसान विवरण हटाने में विफल. कृपया पुन: प्रयास करें।')
      }
    },
    validateDetails () {
      if (this.form.firstName === '' || this.form.lastName === '' || this.form.phoneNumber === '' || this.form.relation === '' ||
        this.form.relationName === '' || this.form.gender === '' || this.form.age === '' || this.form.dateOfBirth === '' || this.form.land === '' ||
        this.form.isKitDistributed === '' || this.form.income === '') {
        alert('Please fill all the required details\n\nकृपया सभी आवश्यक विवरण भरें')
        return false
      }

      if (this.selectedLocation.state === null || this.selectedLocation.district === null || this.selectedLocation.block === null || this.selectedLocation.village === null) {
        alert('Please select a valid Location\n\n कृपया दिए गए विकल्पों में से एक वैध स्थान चुनें')
        return false
      }
      if (this.errors.phoneNumber) {
        alert(this.errors.phoneNumber)
        return false
      }
      if (this.errors.income) {
        alert(this.errors.income)
        return false
      }
      if (this.errors.age) {
        alert(this.errors.age)
        return false
      }
      if (this.errors.land) {
        alert(this.errors.land)
        return false
      }
      return true
    },
    async updateFarmer () {
      try {
        if (!this.validateDetails()) return
        this.form.gender = this.form.gender.toLowerCase()
        const payload = {
          form: this.form,
          selectedLocation: this.selectedLocation
        }
        const response = await this.$http.secured.put(`/farmers/${this.farmer}`, payload)
        let page = this.currentPage1 || 1
        await this.fetchFarmers(page)
        console.log('response', response)
        this.closePopup()
      } catch (error) {
        console.error('Failed to update farmer:', error)
        alert('Failed to update farmer. Please try again. \n \n किसान विवरण बदलने में विफल. कृपया पुन: प्रयास करें।')
      }
    },
    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    changePage (page) {
      if (page === 'ellipsis') return
      this.currentPage1 = page
      this.pageChanged(this.currentPage1)
    },
    prevPage () {
      if (this.currentPage1 > 1) {
        this.currentPage1--
        this.pageChanged(this.currentPage1)
      }
    },
    nextPage () {
      if (this.currentPage1 < this.pages.length) {
        this.currentPage1++
        this.pageChanged(this.currentPage1)
      }
    },
    fastPrevPage () {
      if (this.currentPage1 > 1) {
        this.currentPage1 -= this.fastJump
        this.pageChanged(this.currentPage1)
      }
    },
    fastNextPage () {
      if (this.currentPage1 < this.pages.length) {
        this.currentPage1 += this.fastJump
        this.pageChanged(this.currentPage1)
      }
    },
    pageChanged (val) {
      this.fetchFarmers(val)
    },
    updateDateOfBirth () {
      if (this.form.age) {
        const today = new Date()
        const birthYear = today.getFullYear() - this.form.age
        const birthDate = new Date(birthYear, today.getMonth(), today.getDate())
        const offsetDate = new Date(birthDate.getTime() - birthDate.getTimezoneOffset() * 60000)
        this.form.dateOfBirth = offsetDate.toISOString().split('T')[0]
      } else {
        this.form.dateOfBirth = ''
      }
    },
    updateAge () {
      if (this.form.dateOfBirth) {
        const dob = new Date(this.form.dateOfBirth)
        const today = new Date()
        const age = today.getFullYear() - dob.getFullYear()
        const monthDifference = today.getMonth() - dob.getMonth()
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
          this.form.age = age - 1
        } else {
          this.form.age = age
        }
      } else {
        this.form.age = ''
      }
    }

  }
}
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}
.T3dots {
  width: 25px;
  height: 25px;
}
.apply-filter-button1 button{
  background-color: black;
  color: white;
  margin-top: 1rem;
}

.dashboard {
  width: 95%;
  background: linear-gradient(135deg, #62d48e, #9f1898);
  padding: 25px 30px;
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  margin-left: 50px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  align-items: center;
  justify-content: center;
}

.download-csv {
  margin-top: 20px;
}

.registration-table {
  width: 100%;
  position: relative;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: smaller;
  table-layout: auto;
}

.registration-table th, .registration-table td {
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  white-space: nowrap;
}

.registration-table th.fixed-col,
.registration-table td.fixed-col {
  position: sticky;
  left: -3px;
  background-color: lightyellow;
  z-index: 2;

  box-shadow: 2px 0 5px -2px rgba(0,0,0,0.1);
}
.registration-table tr:nth-child(odd) {
  background-color: white;
}

.registration-table tr:nth-child(even) {
  background-color: #fbf9eb;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.card {
  background-color: #ffffff;
  padding: 30px 8%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: relative;
  width: 90%;
  transition: box-shadow 0.3s ease;
}
.card2 {
  background-color: #ffffff;
  padding: 30px 8%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: relative;
  width: 90%;
  transition: box-shadow 0.3s ease;

}
.card:hover {
  box-shadow: 0 16px 26px rgba(0, 0, 0, 0.15);
}

.table-wrapper {
  scrollbar-color: orange lightgreen;
  scrollbar-width: thin;
  overflow-x: scroll;
}

.table-wrapper::-webkit-scrollbar {
  height: 10px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, orange, #119491);

  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar {
  display: block;
}
.card-title {
  position: absolute;
  top: 8px;
  left: 20px;
  background-color: #10aca3;
  color: black;
  padding: 8px 20px;
  border-radius: 15px;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  transform: translateY(-50%);
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.dropdown-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.4rem;
  width: 100%;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper select {
  width: 100%;
  padding: 0.75rem 0.5rem 0.75rem 0.5rem;
  font-size: 0.95rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background-color: white;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1a202c;
}

.select-wrapper select:hover {
  border-color: #cbd5e0;
}

.select-wrapper select:focus {
  outline: none;
  border-color: #10aca3;
  box-shadow: 0 0 0 3px rgba(16, 172, 163, 0.2);
}

.select-wrapper select:disabled {
  background-color: #f7fafc;
  cursor: not-allowed;
  opacity: 0.7;
}

.select-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #718096;
  font-size: 0.8rem;
}

.button-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

button {
  flex: 1;
  min-width: 100px;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.apply-btn {
  background: linear-gradient(135deg, #10aca3, #0d8c85);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(16, 172, 163, 0.2),
  0 2px 4px -1px rgba(16, 172, 163, 0.1);
}

.apply-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgba(16, 172, 163, 0.3),
  0 4px 6px -1px rgba(16, 172, 163, 0.2);
}

.reset-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.2),
  0 2px 4px -1px rgba(239, 68, 68, 0.1);
}

.reset-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgba(150, 17, 17, 0.3),
  0 4px 6px -1px rgba(236, 8, 8, 0.2);
}

button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .card {
    padding: 1rem;
  }

  .dropdown-container {
    grid-template-columns: 1fr;
  }

  .button-container {
    flex-direction: column;
  }

  button {
    width: 100%;
  }

  .select-wrapper select {
    padding: 0.875rem 2.5rem 0.875rem 1rem;
    font-size: 1rem;
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: nowrap;
  min-height: 40px;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0 0.5rem;
}

.nav-button,
.page-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 60px;
  padding: 0 0.5rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #4b5563;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button {
  background: #f3f4f6;
}

.nav-button:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.page-number {
  border: 2px solid transparent;
}

.page-number:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.page-number.active {
  background: #10aca3;
  color: white;
  font-weight: 600;
}

.page-number.active:hover {
  background: #0d8c85;
}

.ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  color: #6b7280;
}

.ocr-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.ocr-popup-content {
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  text-align: center;
}

.popup-title {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  border-bottom: 2px solid #349e3f;
  padding-bottom: 10px;
}
.details {
  font-size: 15px;
  margin-bottom: 5px;
  text-align: left;
  font-weight: bold;
  color: #2c3e50;
}
.input-box {
  margin-bottom: 15px;
  width: calc(100% - 15px);
  display: flex;
  flex-direction: column;
}

.input-box span.details {
  display: block;
  font-weight: 500;
  margin-bottom: 5px;
}

.user-details .input-box input,
.user-details .input-box select {
  height: 45px;
  width: 100%;
  outline: none;
  font-size: 16px;
  border-radius: 5px;
  padding-left: 15px;
  border: 1px solid #ccc;
  border-bottom-width: 2px;
  transition: all 0.3s ease;
}

.user-details .input-box input:focus,
.user-details .input-box select:focus,
.user-details .input-box input:valid,
.user-details .input-box select:valid {
  border-color: #10aca3;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group input[type="radio"] {
  display: none;
}

.checkbox-group label {
  margin-right: 20px;
  cursor: pointer;
}

.checkbox-group input[type="radio"]:checked + label {
  font-weight: bold;
  padding: 10px 20px;
  background-color: #10aca3;
  color: white;
}

.radio-label {
  display: inline-block;
  padding: 10px 20px;
  margin: 5px;
  font-size: 14px;
  border: 2px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}
.radio-label:hover {
  background-color: #f0f0f0;
  border-color: #10aca3;
}

.button {
  height: 45px;
  margin: 35px 0;
}

.button input {
  height: 100%;
  width: 100%;
  border-radius: 5px;
  border: none;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
.button input:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  font-size: 18px;
}

.button input:active {
  background: #444;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  transform: translateY(2px);
}

.farmer-images {
  font-size: 14px;
}
.farmer-images h3{
  font-size: 22px;
  margin-bottom: 15px;
}
.farmer-images button{
  margin: 5px;
  padding: 5px 10px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.9);
  transition: transform 0.3s ease;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 2px solid #41095a;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  perspective: 700px;
}

.metric-card {
  position: relative;
  min-height: 50px;
  border-radius: 16px;
  padding: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  transform: translateZ(0);
  backdrop-filter: blur(10px);
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.2),
    0 5px 15px rgba(0, 0, 0, 0.1);
}

.metric-card:hover {
  transform: translateY(-5px) rotateX(5deg);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 15px 25px rgba(0, 0, 0, 0.15);
}

.metric-content {
  position: relative;
  z-index: 1;
}

.label {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  margin-bottom: 0.1rem;
  color: rgba(255, 255, 255, 0.9);
}

.value {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  transform: rotate(-45deg);
  pointer-events: none;
}

@media (max-width: 400px) {
  .metrics {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .metric-card {
    min-height: 140px;
    padding: 1.25rem;
  }

  .value {
    font-size: 2rem;
  }
}
@media (max-width: 600px) {
  .filters {
    flex-wrap: wrap;
  }
  .filters select, .apply-filter-button button {
    flex: 1 1 100%;
    max-width: 100%;
  }
  .card {
    padding: 20px;
  }
  .card2 {
     padding: 13px;
     width: 120%;
    margin-right: -25px;
    margin-left: -20px;
   }
  .registration-table {
    font-size: x-small;
  }
  .pagination {
    padding: 0.25rem;
    max-width: calc(100vw - 2rem);
  }
  .pagination-container{
    margin-top: 0;
  }

  .nav-button,
  .page-number {
    min-width: 32px;
    height: 32px;
    font-size: 0.813rem;
  }

  .page-numbers {
    gap: 0.125rem;
  }

  .pagination-controls {
    gap: 0.125rem;
  }
}

.nav-button svg,
.ellipsis svg {
  flex-shrink: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pagination-controls > * {
  animation: fadeIn 0.2s ease-out;
}

.nav-button:active,
.page-number:active {
  transform: translateY(1px);
}

@supports (backdrop-filter: blur(10px)) {
  .metric-card {
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .metric-blue {
    background: linear-gradient(135deg,
    rgb(16, 172, 163),
    rgb(43, 8, 95));
  }

  .metric-purple {
    background: linear-gradient(135deg,
    rgb(48, 4, 59),
    rgb(65, 9, 90));
  }

  .metric-green {
    background: linear-gradient(135deg,
    rgba(21, 159, 4, 0.85),
    rgba(2, 79, 18, 0.85));
  }

  .metric-orange {
    background: linear-gradient(135deg,
    rgb(235, 192, 5),
    rgb(246, 113, 4));
  }

  .metric-red {
    background: linear-gradient(135deg,
    rgba(198, 16, 66, 0.85),
    rgba(202, 11, 11, 0.85));
  }

  .metric-teal {
    background: linear-gradient(135deg,
    rgba(13, 151, 215, 0.85),
    rgba(4, 79, 83, 0.85));
  }

  .metric-indigo {
    background: linear-gradient(135deg,
    rgba(45, 48, 196, 0.85),
    rgba(25, 24, 46, 0.85));
  }

  .metric-pink {
    background: linear-gradient(135deg,
    rgb(159, 24, 152),
    rgba(192, 9, 86, 0.85));
  }

  .metric-amber {
    background: linear-gradient(135deg,
    rgba(109, 136, 36, 0.85),
    rgba(47, 22, 4, 0.85));
  }

  .metric-cyan {
    background: linear-gradient(135deg,
    rgba(6, 182, 212, 0.85),
    rgba(14, 116, 144, 0.85));
  }
}

</style>
