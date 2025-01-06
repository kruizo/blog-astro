<template #content>
  <div class="flex-grow w-3/4 text-white">
    <div class="px-2 text-start">
      <p class="text-blue-400 uppercase tracking-widest text-sm mb-8 max-h-5">
        you might like
      </p>
    </div>
    <ul class="flex flex-col gap-4">
      <li v-for="blog in blogs" :key="blog.id">
        <BlogCard :blog="blog" :formatDate="formatDate" />
      </li>
    </ul>
  </div>
</template>

<script>
import BlogCard from "./BlogCard.vue";
import { getCollection } from "astro:content";

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
    BlogCard,
  },

  setup() {
    return {
      blogs,
      formatDate,
    };
  },
};
</script>
