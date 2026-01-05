<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'delete', 'upload-image'])

const fileInput = ref(null)

const categories = [
  { value: 'rings', label: 'Rings' },
  { value: 'necklaces', label: 'Necklaces' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'bracelets', label: 'Bracelets' },
  { value: 'watches', label: 'Watches' },
  { value: 'other', label: 'Other' }
]

const handleImageClick = () => {
  fileInput.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    emit('upload-image', file)
  }
  event.target.value = ''
}

const confirmDelete = () => {
  if (confirm('Delete this item?')) {
    emit('delete')
  }
}
</script>

<template>
  <div class="table-row">
    <div class="row-image" @click="handleImageClick">
      <img v-if="item.image" :src="item.image" :alt="item.name">
      <span v-else class="row-image-placeholder">💎</span>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      >
    </div>

    <input
      type="text"
      class="editable-field name-field"
      :value="item.name"
      @change="emit('update', 'name', $event.target.value)"
    >

    <select
      class="category-select"
      :value="item.category"
      @change="emit('update', 'category', $event.target.value)"
    >
      <option v-for="cat in categories" :key="cat.value" :value="cat.value">
        {{ cat.label }}
      </option>
    </select>

    <input
      type="text"
      class="editable-field sku-field"
      :value="item.sku || ''"
      placeholder="-"
      @change="emit('update', 'sku', $event.target.value)"
    >

    <input
      type="number"
      class="editable-field price-field"
      :value="item.price"
      step="0.01"
      @change="emit('update', 'price', parseFloat($event.target.value) || 0)"
    >

    <div class="row-actions">
      <button class="action-btn" @click="confirmDelete" title="Delete">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.hidden {
  display: none;
}

.table-row {
  display: grid;
  grid-template-columns: 160px 1fr 140px 120px 100px 80px;
  gap: 10px;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
  transition: background 0.2s;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.row-image {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.row-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.row-image-placeholder {
  font-size: 1.2rem;
}

.row-image:hover::after {
  content: '📷';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.editable-field {
  background: transparent;
  border: 1px solid transparent;
  padding: 8px 10px;
  border-radius: 6px;
  color: #fff;
  font-size: 0.9rem;
  width: 100%;
  transition: all 0.2s;
}

.editable-field:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.editable-field:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(212, 175, 55, 0.5);
}

.name-field {
  font-weight: 500;
}

.price-field {
  color: #d4af37;
  font-weight: 600;
  text-align: right;
}

.sku-field {
  font-family: monospace;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.category-select {
  background: transparent;
  border: 1px solid transparent;
  padding: 8px 10px;
  border-radius: 6px;
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.category-select:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.category-select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(212, 175, 55, 0.5);
}

.category-select option {
  background: #1a1a2e;
}

.row-actions {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.5);
}

.action-btn:hover {
  background: rgba(220, 53, 69, 0.2);
  color: #ff6b6b;
}

@media (max-width: 900px) {
  .table-row {
    grid-template-columns: 100px 1fr 100px 80px;
  }
  .row-image {
    width: 90px;
    height: 90px;
  }
  .table-row > *:nth-child(4),
  .table-row > *:nth-child(5) {
    display: none;
  }
}

@media (max-width: 600px) {
  .table-row {
    grid-template-columns: 75px 1fr 90px 60px;
    padding: 10px 12px;
    gap: 8px;
  }
  .row-image {
    width: 70px;
    height: 70px;
  }
}
</style>
