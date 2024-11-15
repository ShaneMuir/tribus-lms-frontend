<template>
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <img :src="gif" alt="Result GIF" class="modal-gif" />
      <p v-if="message" class="modal-message">{{ message }}</p>
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  visible: Boolean,
  gif: String,
  message: String,
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.modal-gif {
  max-width: 100%;
  height: auto;
}

.modal-message {
  margin-top: 15px;
  font-size: 18px;
  color: #333;
}


button {
  margin-top: 10px;
  padding: 10px 20px;
  background: #1e00ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: rgba(30, 0, 255, 0.8);
}
</style>