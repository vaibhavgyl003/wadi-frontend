
<template>
  <div :class="['metric-card', cardClass]">
    <div class="label">{{ label }}</div>
    <div class="value">{{ value }}</div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    value: Number,
    color: String
  },
  computed: {
    cardClass() {
      return this.color === 'blue' ? 'metric-blue' : 'metric-red';
    }
  }
}
</script>

<style scoped>
.metric-card {
  padding: 20px;
  border-radius: 8px;
  width: 170px;
  text-align: center;
  color: #fff;
}

.label {
  font-size: 14px;
  margin-bottom: 10px;
}

.value {
  font-size: 24px;
  font-weight: bold;
}
</style>
