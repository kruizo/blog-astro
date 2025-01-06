<template #side-panel>
  <section class="w-1/5 hidden sm:block">
    <div
      class="p-4 w-full text-[color:var(--accent)] bg-[color:var(--accent-dark)]"
    >
      <h2 class="text-lg font-semibold mb-4">ARCHIVE</h2>
      <ul>
        <li v-for="(blogs, key) in archives" :key="key">
          <a href="#" class="text-[color:var(--accent)]">
            {{ key }} ({{ blogs.length }})
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: "SidePanel",
  props: {
    blogs: {
      type: Array,
      required: true,
    },
  },
  computed: {
    archives() {
      return this.blogs.reduce((acc, blog) => {
        const date = new Date(blog.data.pubDate);
        const year = date.getFullYear();
        const month = date.toLocaleString("default", { month: "long" });
        const key = `${month} ${year}`;

        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(blog);

        return acc;
      }, {});
    },
  },
};
</script>
