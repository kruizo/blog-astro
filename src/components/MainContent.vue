<script setup>
import SidePanel from "./SidePanel.vue";
</script>

<template>
  <div class="w-full bg-blue-400">
    <div class="flex flex-grow bg-red-400">
      <slot name="header"></slot>
      <SidePanel blogs="blogs" />
    </div>
  </div>
</template>
