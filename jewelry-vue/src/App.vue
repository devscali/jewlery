<script setup>
import { onMounted } from 'vue'
import { useJewelry } from './composables/useJewelry'
import StatsBar from './components/StatsBar.vue'
import ActionsBar from './components/ActionsBar.vue'
import SearchFilter from './components/SearchFilter.vue'
import JewelryTable from './components/JewelryTable.vue'

const {
  loading,
  searchQuery,
  categoryFilter,
  sortBy,
  stats,
  filteredJewelry,
  initializeListener,
  addJewelry,
  updateJewelry,
  deleteJewelry,
  uploadImage,
  clearAll,
  exportToCSV,
  exportToJSON
} = useJewelry()

onMounted(() => {
  initializeListener()
})

// Handlers
const handleAdd = async (item) => {
  try {
    await addJewelry(item)
  } catch (error) {
    alert('Error adding item: ' + error.message)
  }
}

const handleUpdate = async (id, field, value) => {
  try {
    await updateJewelry(id, { [field]: value })
  } catch (error) {
    alert('Error updating item: ' + error.message)
  }
}

const handleDelete = async (id, imageUrl) => {
  try {
    await deleteJewelry(id, imageUrl)
  } catch (error) {
    alert('Error deleting item: ' + error.message)
  }
}

const handleUploadImage = async (id, file) => {
  try {
    const url = await uploadImage(file, id)
    await updateJewelry(id, { image: url })
  } catch (error) {
    alert('Error uploading image: ' + error.message)
  }
}

const handleClearAll = async () => {
  if (!confirm('Delete ALL items? This cannot be undone.')) return
  try {
    await clearAll()
  } catch (error) {
    alert('Error clearing items: ' + error.message)
  }
}

const handleExportCSV = () => {
  const csv = exportToCSV()
  if (!csv) {
    alert('No jewelry to export')
    return
  }
  downloadFile(csv, 'jewelry.csv', 'text/csv')
}

const handleExportJSON = () => {
  const json = exportToJSON()
  if (!json) {
    alert('No jewelry to export')
    return
  }
  downloadFile(json, 'jewelry.json', 'application/json')
}

const handleImportExcel = async (file) => {
  try {
    const XLSX = await import('xlsx')
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        if (jsonData.length === 0) {
          alert('No data found in file')
          return
        }

        const cols = Object.keys(jsonData[0])
        const nameCol = cols.find(c => /name|nombre|item|producto|description/i.test(c))
        const priceCol = cols.find(c => /price|precio|cost|costo|value/i.test(c))

        let imported = 0
        for (const row of jsonData) {
          const name = row[nameCol] || row[cols[0]]
          let price = row[priceCol] || 0
          if (typeof price === 'string') {
            price = parseFloat(price.replace(/[^0-9.-]/g, '')) || 0
          }

          if (name) {
            await addJewelry({
              name: String(name).trim(),
              category: 'other',
              price: price,
              sku: '',
              image: ''
            })
            imported++
          }
        }

        alert(`Imported ${imported} items!`)
      } catch (error) {
        alert('Error reading file: ' + error.message)
      }
    }

    reader.readAsArrayBuffer(file)
  } catch (error) {
    alert('Error importing file: ' + error.message)
  }
}

const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="container">
    <header class="header">
      <h1>💎 Jewelry Organizer</h1>
      <p>Manage your inventory - click any field to edit</p>
    </header>

    <StatsBar :stats="stats" />

    <ActionsBar
      @export-csv="handleExportCSV"
      @export-json="handleExportJSON"
      @clear-all="handleClearAll"
      @import-excel="handleImportExcel"
    />

    <SearchFilter
      v-model:searchQuery="searchQuery"
      v-model:categoryFilter="categoryFilter"
      v-model:sortBy="sortBy"
    />

    <JewelryTable
      :items="filteredJewelry"
      :loading="loading"
      @add="handleAdd"
      @update="handleUpdate"
      @delete="handleDelete"
      @upload-image="handleUploadImage"
    />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  min-height: 100vh;
  color: #fff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  padding: 30px 20px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  margin-bottom: 30px;
}

.header h1 {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #d4af37 0%, #f4e4bc 50%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.header p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
}

@media (max-width: 600px) {
  .header h1 {
    font-size: 1.8rem;
  }
}
</style>
