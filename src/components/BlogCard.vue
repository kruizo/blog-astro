<template>
  <GlowEffect>
    <div
      class="group flex justify-between border-2 p-2 border-white/5 rounded-2xl transition-all shadow-lg shadow-black/80 backdrop-blur-md glow:ring-1 glow:border-glow glow:ring-glow glow:bg-glow/[.15]"
    >
      <div class="flex flex-col mb-2 gap-1 break-all break-words">
        <a :href="`/blog/${blog.id}/`">
          <h3 class="text-xl font-semibold text-primary text-content">
            {{ blog.data.title }}
          </h3>
        </a>
        <p class="text-sm text-primary text-content m-0 p-0 leading-tight">
          <span class="font-extralight text-gray-500"
            >@{{ blog.data.author }}</span
          >
        </p>
        <p
          class="text-gray-500 text-sm m-0 p-0 text-content line-clamp-1 text-ellipsis"
        >
          {{ blog.data.description }}
        </p>
      </div>
      <p
        class="font-medium text-sm text-primary text-gray-500 min-w-24 text-right"
      >
        {{ formatDate(blog.data.pubDate) }}
      </p>
    </div>
  </GlowEffect>
</template>

<script>
import GlowEffect from "./GlowEffect.vue";

export default {
  components: {
    GlowEffect,
  },
  props: {
    blog: Object,
    formatDate: Function,
  },
};
</script>
