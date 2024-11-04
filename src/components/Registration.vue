<template>
  <div class="container">
    <div class="title">Farmer Registration</div>

    <div class="card">
      <div class="card-title">Personal Information</div>
      <div class="user-details">
        <div class="input-box">
          <span class="details">
            First Name<span class="mandatory">*</span>
          </span>
          <input type="text" v-model="form.firstName" placeholder="पहला नाम" required />
        </div>
        <div class="input-box">
          <span class="details">
            Last Name<span class="mandatory">*</span>
          </span>
          <input type="text" v-model="form.lastName" placeholder="उपनाम" required />
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
            <option value="" disabled>संबंध चुनें</option>
            <option value="Father">Father (पिता)</option>
            <option value="Husband">Husband (पति)</option>
          </select>
        </div>
        <div class="input-box">
          <span class="details">
            Father's/Husband's Name<span class="mandatory">*</span>
          </span>
          <input type="text" v-model="form.relationName" placeholder="पिता/पति का नाम" required />
        </div>
        <div class="input-box">
          <span class="details">
            Gender<span class="mandatory">*</span>
          </span>
          <select v-model="form.gender" required>
            <option value="" disabled>लिंग चुनें</option>
            <option value="Male">Male (पुरुष) </option>
            <option value="Female">Female (महिला)</option>
            <option value="Other">Other (अन्य) </option>
          </select>
        </div>

        <div class="input-box">
          <span class="details">Age<span class="mandatory">*</span></span>
          <input type="number" v-model="form.age" placeholder="अपनी आयु दर्ज करें" @input="validateAge" required />
        </div>
        <div class="input-box">
          <span class="details">
            Date Of Birth<span class="mandatory">*</span>
          </span>
          <input type="date" class="custom-date-picker" v-model="form.dateOfBirth" @input="updateAge"  required />
        </div>
        <div class="input-box">
          <span class="details">Average Annual Family Income (In Rupees रु)<span class="mandatory">*</span></span>
          <input type="text" v-model="form.income" placeholder="औसत पारिवारिक आय (वार्षिक)" @input="validateIncome" required />
        </div>

        <div class="input-box">
      <span class="details">
        Select Crop Type<span class="mandatory">*</span>
      </span>
          <select v-model="form.cropType" @change="handleCropTypeChange" required>
            <option value="" disabled>फसल का प्रकार चुनें</option>
            <option value="Agriculture">Agriculture/कृषि</option>
            <option value="Horticulture">Horticulture/बागवानी</option>
          </select>
        </div>

        <div class="input-box">
        <span class="details">
          Select Crop<span class="mandatory">*</span>
        </span>
          <div
            class="dropdown-wrapper"
            v-click-outside="closeDropdown"
            @focusin="setFocus(true)"
            @focusout="setFocus(false)"
          >
            <div
              class="selected-crops"
              :class="{ 'focused': isFocused || isDropdownOpen, 'has-value': selectedCrops.length > 0 }"
              @click="toggleDropdown"
              tabindex="0"
            >
              <div class="selected-crops-text">{{ selectedCropsText }}</div>
              <div class="dropdown-arrow">▼</div>
            </div>
            <div v-if="isDropdownOpen" class="scrollable-dropdown">
              <div
                v-for="crop in availableCrops"
                :key="crop.english"
                class="crop-option"
                :class="{ 'selected': isSelected(crop) }"
                @click="toggleCropSelection(crop)"
              >
                {{ crop.english }}/{{ crop.hindi }}
              </div>
            </div>
          </div>
        </div>
<!--        </div>-->

        <div class="input-box">
          <span class="details">
            Average Land in Acres<span class="mandatory">*</span>
          </span>
          <input type="text" v-model="form.land" placeholder="औसत भूमि जोत (एकड़ में)" @input="validateLand" required />
        </div>

        <div class="input-box">
          <span class="details">
            Whether you are going to use this Kit or Not?<span class="mandatory">*</span>
          </span>
          <div class="checkbox-group">
            <input type="radio" v-model="form.isKitDistributed" value="Yes" id="kit-yes" required />
            <label for="kit-yes" class="radio-label" >Yes (हां)</label>
            <input type="radio" v-model="form.isKitDistributed" value="No" id="kit-no" required />
            <label for="kit-no" class="radio-label" >No (नहीं)</label>
          </div>
        </div>
      </div>
    </div>

      <div class="card">
        <div class="card-title">Address Details</div>
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
      </div>

      <div class="card">
        <div class="image-uploader">
          <div class="card-title">Upload Media</div>
          <div class="upload-icon" @click="triggerFileInput">
            <div class="upload-content">
              <img src="../assets/upload_image_icon.png" alt="Upload Icon" class="upload-image" />
              <span class="upload-text">Upload Image</span>
            </div>
          </div>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="handleFileChange"
            style="display: none"
          />
          <div class="image-preview">
            <div v-for="(image, index) in images" :key="index" class="image-container">
              <img :src="image.thumbnail" @click="viewImage(image.url)" class="preview-img" alt="Image Preview" />
              <div class="remove-icon" @click="removeImage(index)">
                <img src="../assets/cross.png" alt="Remove Icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    <div class="loader-overlay" v-if="isLoading">
      <img src="../assets/img/loader2.gif" alt="Loading..." class="loader-gif"/>
    </div>

    <div class="button">
      <input type="submit" value="Register" @click="submitRegistration" :disabled="isLoading">
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
export default {
  name: 'registration',
  components: {
    Datepicker
  },
  data () {
    return {
      isLoading: false,
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
        income: '',
        cropType: ''
      },
      errors: {
        phoneNumber: null,
        age: null,
        income: null,
        land: null
      },
      agricultureCrops: [
        { english: 'Paddy', hindi: 'धान' },
        { english: 'Black Gram', hindi: 'उड़द' },
        { english: 'Groundnut', hindi: 'मूंगफली' },
        { english: 'Green Gram', hindi: 'मूंग' },
        { english: 'Wheat', hindi: 'गेहूं' },
        { english: 'Sesamum', hindi: 'तिल' },
        { english: 'Rapeseed & Mustard', hindi: 'सरसों' },
        { english: 'Pigeon Pea', hindi: 'अरहर' },
        { english: 'Maize', hindi: 'मक्का' },
        { english: 'Khesari', hindi: 'खेसारी' },
        { english: 'Ragi', hindi: 'रागी' },
        { english: 'Other Pulses', hindi: 'अन्य दालें' },
        { english: 'Gram', hindi: 'चना' },
        { english: 'Peas & Beans', hindi: 'मटर और फलियां' },
        { english: 'Linseed', hindi: 'अलसी' },
        { english: 'Sun Hemp', hindi: 'सन' },
        { english: 'Small Millets', hindi: 'छोटे बाजरा' },
        { english: 'Red Gram', hindi: 'तुअर' },
        { english: 'Soyabean', hindi: 'सोयाबीन' },
        { english: 'Barley', hindi: 'जौ' },
        { english: 'Horse Gram', hindi: 'कुल्थी' },
        { english: 'Mesta', hindi: 'मेस्टा' },
        { english: 'Bajra', hindi: 'बाजरा' },
        { english: 'Jowar', hindi: 'ज्वार' }
      ],
      horticultureCrops: [
        { english: 'Tomato', hindi: 'टमाटर' },
        { english: 'Brinjal', hindi: 'बैंगन' },
        { english: 'Papaya', hindi: 'पपीता' },
        { english: 'Jackfruit', hindi: 'कटहल' },
        { english: 'Banana', hindi: 'केला' },
        { english: 'Green Chilly', hindi: 'हरी मिर्च' },
        { english: 'Mango', hindi: 'आम' },
        { english: 'Onion', hindi: 'प्याज' },
        { english: 'Bottle Gourd', hindi: 'लौकी' },
        { english: 'Other Spices', hindi: 'अन्य मसाले' },
        { english: 'Okra', hindi: 'भिन्डी' },
        { english: 'Guava', hindi: 'अमरूद' },
        { english: 'Bitter Gourd', hindi: 'करेला' },
        { english: 'Radish', hindi: 'मूली' },
        { english: 'Pumpkin', hindi: 'कद्दू' },
        { english: 'Cabbage', hindi: 'पत्ता गोभी' },
        { english: 'Potato', hindi: 'आलू' },
        { english: 'Cauliflower', hindi: 'फूलगोभी' },
        { english: 'Rose', hindi: 'गुलाब' },
        { english: 'Custurd Apple', hindi: 'सीताफल' },
        { english: 'Lemon', hindi: 'नींबू' },
        { english: 'Marigold', hindi: 'गेंदा' },
        { english: 'Musk Melon', hindi: 'खरबूजा' },
        { english: 'Red Chilly', hindi: 'लाल मिर्च' },
        { english: 'Watermelon', hindi: 'तरबूज' },
        { english: 'Beans (All)', hindi: 'सेम' },
        { english: 'Sweet Potato', hindi: 'शकरकंद' },
        { english: 'Carrot', hindi: 'गाजर' },
        { english: 'Ridge Gourd', hindi: 'तोरी' },
        { english: 'Cola Casia', hindi: 'कसिया' },
        { english: 'Garlic', hindi: 'लहसुन' },
        { english: 'Ber', hindi: 'बेर' },
        { english: 'Fresh Turmeric', hindi: 'ताजा हल्दी' },
        { english: 'Leafy Vegetables', hindi: 'पत्तेदार सब्जियां' },
        { english: 'Goodeberry/Amla', hindi: 'आंवला' },
        { english: 'Coriander', hindi: 'धनिया' },
        { english: 'Other Flowers', hindi: 'अन्य फूल' },
        { english: 'Pomegranate', hindi: 'अनार' },
        { english: 'Elephant Foot', hindi: 'जमीकंद' },
        { english: 'Pointed Gourd', hindi: 'परवल' },
        { english: 'Green Pea', hindi: 'हरा मटर' },
        { english: 'Tube Rose', hindi: 'रजनीगंधा' },
        { english: 'Gladiolus', hindi: 'ग्लैडियोलस' },
        { english: 'Sapota', hindi: 'चीकू' },
        { english: 'Knol-Khol', hindi: 'गांठ गोभी' },
        { english: 'Bael', hindi: 'बेल' },
        { english: 'Lemon Grass', hindi: 'नींबू घास' },
        { english: 'Chestnut', hindi: 'शाहबलूत' },
        { english: 'Fenugreek', hindi: 'मेथी' },
        { english: 'Chrysanthemum', hindi: 'गुलदाउदी' },
        { english: 'Jasmine', hindi: 'चमेली' }
      ],
      availableCrops: [],
      selectedCrops: [],
      isDropdownOpen: false,
      isFocused: false,
      loaderOn: true,
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
      lastSavedLocation: null,
      images: []
    }
  },
  async created () {
    await this.initializeFromLastLocation()
  },
  methods: {
    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
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
      if (this.form.income < 0) {
        alert("Income can't be negative\n\nआय 0 से कम नहीं हो सकती")
      }
      const incomePattern = /^\d+$/
      if (!incomePattern.test(this.form.income)) {
        this.errors.income = 'Income must be a valid number.\n\n आय एक वैध संख्या होनी चाहिए.'
      } else {
        this.errors.income = null
      }
    },
    validateLand () {
      if (this.form.land < 0) {
        alert("Land can't be negative\n\nभूमि क्षेत्रफल 0 से कम नहीं हो सकता")
      }
      const landPattern = /^\d+$/
      if (!landPattern.test(this.form.land)) {
        this.errors.land = 'Land area must be a valid number.\n\n भूमि क्षेत्र एक वैध संख्या होनी चाहिए.'
      } else {
        this.errors.land = null
      }
    },
    async loadNextLevel (level) {
      const params = { level }

      if (level === 'district') {
        params.state = this.selectedLocation.state
      } else if (level === 'block') {
        params.district = this.selectedLocation.district
      } else if (level === 'village') {
        params.block = this.selectedLocation.block
      }

      try {
        const response = await this.$http.secured.get('/location', { params })
        this.locationData[level] = response.data
      } catch (error) {
        console.error('Error fetching location data:', error)
      }
    },
    async handleChange (level) {
      const index = this.levels.indexOf(level)
      if (index < this.levels.length - 1) {
        for (let i = index + 1; i < this.levels.length; i++) {
          this.selectedLocation[this.levels[i]] = null
          this.locationData[this.levels[i]] = []
        }
        await this.loadNextLevel(this.levels[index + 1])
      }
      this.updateLastLocation()
    },

    updateLastLocation () {
      const currentLocation = JSON.stringify(this.selectedLocation)
      if (currentLocation !== this.lastSavedLocation) {
        localStorage.setItem('lastLocation', currentLocation)
        this.lastSavedLocation = currentLocation

        this.$http.secured.post('/location/update_last_location', { location: this.selectedLocation })
          .catch(error => console.error('Error updating last location:', error))
      }
    },

    async initializeFromLastLocation () {
      const lastLocation = localStorage.getItem('lastLocation')
      if (lastLocation) {
        this.selectedLocation = JSON.parse(lastLocation)
        this.lastSavedLocation = lastLocation
        console.log('tmkoccc this.lastSavedLocation ->', this.lastSavedLocation)

        for (const level of this.levels) {
          await this.loadNextLevel(level)
          if (!this.selectedLocation[level]) break
        }
      } else {
        try {
          const response = await this.$http.secured.get('/location/last_location')
          if (response.data) {
            this.selectedLocation = response.data
            this.lastSavedLocation = JSON.stringify(response.data)
            localStorage.setItem('lastLocation', this.lastSavedLocation)
            for (const level of this.levels) {
              await this.loadNextLevel(level);
              if (!this.selectedLocation[level]) break;
            }
          } else {
            await this.loadNextLevel('state')
          }
        } catch (error) {
          console.error('Error fetching last location:', error)
          await this.loadNextLevel('state')
        }
      }
    },
    triggerFileInput () {
      this.$refs.fileInput.click()
    },
    handleFileChange (event) {
      if (this.images.length === 5) {
        alert("Can't add more than 5 pictures \n\n 5 से अधिक चित्र नहीं जोड़ सकते")
        return
      }
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.images.push({
            file: file,
            url: e.target.result,
            thumbnail: e.target.result
          })
        }
        reader.readAsDataURL(file)
      }
    },
    viewImage (url) {
      const newWindow = window.open()
      if (newWindow) {
        newWindow.document.write(
          `<html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${url}" alt="Enlarged Image" style="max-width:100%; max-height:100%;"/></body></html>`
        )
        newWindow.document.close()
      } else {
        alert('Please allow popups for this website to view the image. \n \n कृपया इस वेबसाइट पर छवि देखने के लिए पॉपअप की अनुमति दें।')
      }
    },
    validateDetails () {
      if (this.form.firstName === '' || this.form.lastName === '' || this.form.phoneNumber === '' || this.form.relation === '' ||
        this.form.relationName === '' || this.form.gender === '' || this.form.age === '' || this.form.dateOfBirth === '' || this.form.land === '' ||
        this.form.isKitDistributed === '' || this.form.income === '' || this.form.cropType === '') {
        alert('Please fill all the required details\n\nकृपया सभी आवश्यक विवरण भरें')
        return false
      }

      if (this.selectedLocation.state === null || this.selectedLocation.district === null || this.selectedLocation.block === null || this.selectedLocation.village === null) {
        alert('Please select a valid Location\n\n कृपया दिए गए विकल्पों में से एक वैध स्थान चुनें')
        return false
      }
      if (this.images.length < 1) {
        alert('please add atleast one image\n\nकृपया कम से कम एक फोटो जोड़ें')
        return false
      }
      if (this.selectedCrops.length < 1) {
        alert('please add atleast one crop\n\n कृपया कम से कम एक फसल जोड़ें')
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
    async submitRegistration () {
      try {
        let failure = this.validateDetails()
        if (!failure) return

        this.isLoading = true
        this.form.gender = this.form.gender.toLowerCase()
        const payload = {
          form: this.form,
          selectedLocation: this.selectedLocation,
          selectedCrops: this.selectedCrops
        }
        const response = await this.$http.secured.post('/farmers', payload)
        const farmerId = response.data.id

        for (const image of this.images) {
          await this.uploadFile(farmerId, image)
        }
      } catch (error) {
        console.error('Registration failed:', error)
        alert('Registration failed. Please try again. \n\n किसान विवरण संसाधित नहीं किया जा सका.\n कृपया पुन: प्रयास करें')
      } finally {
        this.isLoading = false
        this.images = []
        alert('Farmer registered successfully! \n\n किसान का विवरण सफलतापूर्वक दर्ज किया गया!')
        window.location.reload()
      }
    },
    async uploadFile (farmerId, image) {
      try {
        const signedUrlResponse = await this.$http.secured.get(`farmers/${farmerId}/signed_url`, {
          params: { filename: image.file.name }
        })
        const { signed_url: signedUrl, image_url: imageUrl } = signedUrlResponse.data

        console.log('signedURL = ', signedUrl, imageUrl)
        await fetch(signedUrl, {
          method: 'PUT',
          body: image.file,
          headers: {
            'Content-Type': image.file.type
          }
        })
        await this.$http.secured.post(`farmers/${farmerId}/images`, {
          image_url: imageUrl
        })

        console.log('File uploaded successfully')
      } catch (error) {
        console.error('Error uploading file:', error)
        throw error
      }
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
    },
    removeImage (index) {
      this.images.splice(index, 1)
    },
    handleCropTypeChange () {
      if (this.form.cropType === 'Agriculture') {
        this.availableCrops = this.agricultureCrops
      } else if (this.form.cropType === 'Horticulture') {
        this.availableCrops = this.horticultureCrops
      } else {
        this.availableCrops = []
      }
      this.selectedCrops = []
    },
    toggleDropdown () {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    closeDropdown () {
      this.isDropdownOpen = false
    },
    isSelected (crop) {
      return this.selectedCrops.some(selectedCrop => selectedCrop.english === crop.english)
    },
    toggleCropSelection (crop) {
      const index = this.selectedCrops.findIndex(selectedCrop => selectedCrop.english === crop.english)
      if (index === -1) {
        this.selectedCrops.push(crop)
      } else {
        this.selectedCrops.splice(index, 1)
      }
    },
    setFocus (value) {
      this.isFocused = value
    }
  },

  watch: {
    'form.age': function () {
      if (this.form.age) {
        this.updateDateOfBirth()
      }
    },
    'form.dateOfBirth': function () {
      if (this.form.dateOfBirth) {
        this.updateAge()
      }
    }
  },
  computed: {
    selectedCropsText () {
      if (this.selectedCrops.length === 0) return 'फसल चुनें'
      if (this.selectedCrops.length < 2) {
        return this.selectedCrops.map(crop => `${crop.english} (${crop.hindi})`).join(', ')
      }
      return `${this.selectedCrops.length} फसलें चयनित`
    }
  },
  directives: {
    clickOutside: {
      bind (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event)
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader-gif {
  width: 150px;
  height: 150px;
}

.container {
  width: 95%;
  background: linear-gradient(135deg, #62d48e, #9f1898);
  padding: 25px 30px;
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  margin-left: 4.1%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 25px;
  font-weight: 500;
  position: relative;
  margin-bottom: 15px;
}
.details {
  font-size: 15px;
  margin-bottom: 5px;
  text-align: left;
  font-weight: bold;
  color: #2c3e50;
}

.mandatory {
  color: red;
  margin-left: 2px;
}

.title::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 30px;
  border-radius: 5px;
  background: linear-gradient(135deg, #71e679, #9b59b6);
}

.card {
  background-color: #ffffff;
  padding: 20px 8%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 25px;
  position: relative;
  width: 90%;
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

.user-details {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.input-box {
  margin-bottom: 1.8rem;
  width: calc(100% / 3 - 15px);
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
  color: Black;
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
.custom-date-picker {
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: #EFEFEF;
}

.custom-date-picker:focus {
  border-color: #10aca3;
  box-shadow: 0 0 5px rgba(16, 172, 163, 0.5);
  outline: none;
}
.image-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}
.upload-image {
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
}

.upload-text {
  text-align: center;
  font-size: 14px;
  color: #555;
}

.upload-icon {
  cursor: pointer;
  margin-bottom: 10px;
}
.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon img {
  width: 50px;
  height: 50px;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.preview-img {
  width: 250px;
  height: 150px;
  object-fit: cover;
  cursor: pointer;
  border: 5px solid black;
}
.image-container {
  position: relative;
}

.remove-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.remove-icon img {
  width: 100%;
  height: 100%;
}

select, .selected-crops {
  width: 100%;
  height: 45px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
}

select:focus, select:valid,
.selected-crops.focused, .selected-crops.has-value {
  border-color: #10aca3;
  outline: none;
}

.dropdown-wrapper {
  position: relative;
}

.selected-crops {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-crops-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-arrow {
  font-size: 12px;
}

.scrollable-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
}

.crop-option {
  padding: 8px 10px;
  cursor: pointer;
  font-size: 13px;
}

.crop-option:hover {
  background-color: #f0f0f0;
}

.crop-option.selected {
  background-color: #e6ffe6;
}

.dropdown-style {
  font-size: 1px;
  max-height: 200px;
  overflow-y: auto;
}
select {
  max-height: 200px;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .custom-date-picker {
    font-size: 14px;
    padding: 8px;
  }
}

@media (max-width: 768px) {
  .user-details .input-box {
    width: calc(100% / 2 - 15px);
  }
  .crop-selection {
    max-width: 100%;
  }
}

@media (max-width: 584px) {
  .user-details .input-box {
    width: 100%;
  }
}
</style>
