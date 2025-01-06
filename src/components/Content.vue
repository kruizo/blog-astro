<template #content>
  <div class="flex-grow w-3/4 text-white">
    <div class="px-2 text-start">
      <p class="text-blue-400 uppercase tracking-widest text-sm mb-8 max-h-5">
        you might like
      </p>
    </div>
    <ul>
      <div class="flex flex-col gap-4">
        <li v-for="blog in blogs" :key="blog.id">
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
                <p
                  class="text-sm text-primary text-content m-0 p-0 leading-tight"
                >
                  <span class="font-extralight font text-gray-500"
                    >@{{ blog.data.author }}</span
                  >
                </p>
                <p
                  class="text-gray-500 text-sm m-0 p-0 text-content line-clamp-1 text-ellipsis"
                >
                  {{ blog.data.description }}
                </p>
              </div>
              <p class="font-medium text-sm text-primary text-gray-500">
                {{ formatDate(blog.data.pubDate) }}
              </p>
            </div>
          </GlowEffect>
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
import { getCollection } from "astro:content";
import GlowEffect from "./GlowEffect.vue";

const blogs = (await getCollection("blog")).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default {
  components: {
    GlowEffect, // Register GlowEffect component here
  },

  setup() {
    return {
      blogs,
      formatDate,
    };
  },
};
</script>

<style scoped></style>
