<script>
import { ref, reactive, onMounted, onUnmounted } from "vue";

export default {
  name: "FeaturedCarousel",
  props: {
    blogs: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const carousel = ref(null);
    const state = reactive({
      isDown: false,
      startX: 0,
      scrollLeft: 0,
      currentIndex: 0,
    });

    const featuredBlogs = props.blogs
      .filter((blog) => blog.data.featured === true)
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    const formatDate = (date) =>
      new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

    const startCarousel = () => {
      setInterval(() => {
        const nextIndex = (state.currentIndex + 1) % featuredBlogs.length;
        goToSlide(nextIndex);
      }, 3000);
    };

    const handleMouseDown = (e) => {
      state.isDown = true;
      state.startX = e.pageX - carousel.value.offsetLeft;
      state.scrollLeft = carousel.value.scrollLeft;
    };

    const handleMouseMove = (e) => {
      if (!state.isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.value.offsetLeft;
      const walk = (x - state.startX) * 1;
      carousel.value.scrollLeft = state.scrollLeft - walk;
    };

    const handleMouseUp = () => {
      state.isDown = false;
      snapToCurrentItem();
    };

    const snapToCurrentItem = () => {
      const currentId = `carousel-item-${state.currentIndex}`;
      const currentItem = document.getElementById(currentId);
      if (currentItem) {
        currentItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    };

    const observeCarouselItems = () => {
      const observerOptions = {
        root: carousel.value,
        threshold: 0.5, // At least 50% of the item must be visible
      };

      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index, 10);
            state.currentIndex = index; // Update the current index based on the visible item
          }
        });
      };

      const observer = new IntersectionObserver(
        observerCallback,
        observerOptions
      );

      // Observe each carousel item
      const items = carousel.value.querySelectorAll(".carousel-item");
      items.forEach((item) => {
        observer.observe(item);
      });

      return observer;
    };

    onMounted(() => {
      const observer = observeCarouselItems();
      startCarousel();
      onUnmounted(() => observer.disconnect());
      onUnmounted(() => stopCarousel());
    });

    const goToSlide = (index) => {
      const targetId = `carousel-item-${index}`;
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
        state.currentIndex = index;
      }
    };

    return {
      featuredBlogs,
      carousel,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      formatDate,
      state,
      goToSlide,
    };
  },
};
</script>

<template>
  <div class="py-10 w-full">
    <div class="max-w-6xl px-4 text-start">
      <h2 class="text-gray-500 uppercase tracking-widest text-sm mb-8 max-h-5">
        Featured
      </h2>
    </div>
    <div class="relative max-w-5xl mx-auto">
      <!-- Carousel -->
      <div
        ref="carousel"
        class="carousel flex overflow-x-auto gap-4"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mousemove="handleMouseMove"
        @touchstart="handleMouseDown"
        @touchmove="handleMouseMove"
        @touchend="handleMouseUp"
        @mouseleave="handleMouseUp"
        @touchcancel="handleMouseUp"
      >
        <div
          v-for="(blog, index) in featuredBlogs"
          :key="index"
          :data-index="index"
          :id="'carousel-item-' + index"
          class="carousel-item min-w-full snap-start shadow-md rounded-md overflow-hidden flex flex-col md:flex-row-reverse"
        >
          <!-- Image -->
          <img
            :src="blog.data.heroImage"
            :alt="blog.data.title"
            class="w-full md:w-1/2 object-cover"
            draggable="false"
          />
          <!-- Blog Info -->
          <div class="p-6 w-full md:w-1/2 flex flex-col">
            <h3 class="text-6xl font-semibold text-primary mb-2 text-content">
              {{ blog.data.title }}
            </h3>
            <p class="text-sm text-primary mb-1 text-content">
              <span class="font-medium">
                {{ formatDate(blog.data.pubDate) }}
              </span>
              • By <span class="font-medium">{{ blog.data.author }}</span>
            </p>
            <p class="text-gray-600 mt-3 text-content">
              {{ blog.data.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Indicators -->
      <div class="flex justify-start mt-4 absolute bottom-4 left-0 ml-4">
        <button
          v-for="(_, index) in featuredBlogs"
          :key="index"
          :class="[
            'indicator w-3 h-3 mx-1 rounded-full',
            state.currentIndex === index ? 'bg-gray-800' : 'bg-gray-400',
          ]"
          @click="goToSlide(index)"
        ></button>
      </div>
    </div>
  </div>
</template>

<style>
.carousel {
  scrollbar-width: none;
  -ms-overflow-style: none;
  pointer-events: auto;
}
.carousel::-webkit-scrollbar {
  display: none;
}
.carousel-item {
  cursor: grab;

  user-select: none;
}

.carousel-item .text-content {
  cursor: text;
  user-select: text;
}

.carousel img {
  pointer-events: none;
}
.indicator {
  transition: background-color 0.3s ease;
}
</style>
