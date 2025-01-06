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
      isScrolling: false,
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

    let scrollTimeout = null;

    const carouselInterval = ref(null);
    const startCarousel = () => {
      stopCarousel(); // Clear any previous interval before starting a new one
      carouselInterval.value = setInterval(() => {
        if (state.isDown) {
          console.log("Carousel paused (isDown=true)");
          return; // Skip sliding while the user is interacting
        }
        console.log("Sliding to next...");
        const nextIndex = (state.currentIndex + 1) % featuredBlogs.length;
        goToSlide(nextIndex);
      }, 3000);
    };
    const stopCarousel = () => {
      if (carouselInterval.value) {
        clearInterval(carouselInterval.value);
        carouselInterval.value = null;
      }
    };

    const handleScroll = () => {
      state.isScrolling = true;
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        state.isScrolling = false;
        snapToClosest();
      }, 100); // Adjust debounce time as needed
    };

    const snapToClosest = () => {
      const items = carousel.value.querySelectorAll(".carousel-item");
      const scrollLeft = carousel.value.scrollLeft;

      let closestIndex = state.currentIndex;
      let minDistance = Infinity;

      items.forEach((item, index) => {
        const itemLeft = item.offsetLeft;
        const distance = Math.abs(itemLeft - scrollLeft);

        if (distance < minDistance) {
          closestIndex = index;
          minDistance = distance;
        }
      });

      goToSlide(closestIndex);
    };

    const goToSlide = (index) => {
      const carouselElement = carousel.value;
      const targetElement = carouselElement.querySelector(
        `#carousel-item-${index}`
      );

      if (targetElement) {
        carouselElement.scrollTo({
          left: targetElement.offsetLeft,
          behavior: "smooth",
        });

        state.currentIndex = index;
      }
    };

    const handleMouseDown = (e) => {
      state.isDown = true;
      stopCarousel();
      state.startX = e.pageX - carousel.value.offsetLeft;
      state.scrollLeft = carousel.value.scrollLeft;
    };

    const handleMouseMove = (e) => {
      if (!state.isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.value.offsetLeft;
      const walk = x - state.startX;
      carousel.value.scrollLeft = state.scrollLeft - walk;
    };

    const handleMouseUp = () => {
      state.isDown = false;
      snapToClosest();
      startCarousel();
    };

    const observeCarouselItems = () => {
      const observerOptions = {
        root: carousel.value,
        threshold: 0.5,
      };

      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index, 10);
            state.currentIndex = index;
          }
        });
      };

      const observer = new IntersectionObserver(
        observerCallback,
        observerOptions
      );

      const items = carousel.value.querySelectorAll(".carousel-item");
      items.forEach((item) => {
        observer.observe(item);
      });

      return observer;
    };

    onMounted(() => {
      const observer = observeCarouselItems();
      const carousel = startCarousel();
      carousel.value.addEventListener("scroll", handleScroll);

      onUnmounted(() => {
        observer.disconnect();
        stopCarousel();
        carousel.value.removeEventListener("scroll", handleScroll);
        clearTimeout(scrollTimeout);
      });
    });

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
  <section class="py-5 w-full relative mb-10">
    <div class="px-2 text-start">
      <p class="text-blue-400 uppercase tracking-widest text-sm mb-8 max-h-5">
        Featured
      </p>
    </div>
    <div
      class="carousel h-[25rem] snap-x snap-mandatory max-h[25rem] overflow-x-auto flex"
      ref="carousel"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mousemove="handleMouseMove"
      @touchstart="handleMouseDown"
      @touchmove="handleMouseMove"
      @touchend="handleMouseUp"
      @mouseleave="handleMouseUp"
      @touchcancel="handleMouseUp"
    >
      <!-- Carousel -->
      <div
        v-for="(blog, index) in featuredBlogs"
        :key="index"
        :data-index="index"
        :id="'carousel-item-' + index"
        class="carousel-item min-w-full flex-grow shadow-md rounded-md flex"
      >
        <div class="m-2 w-1/2">
          <div class="h-3/4">
            <h3 class="text-[6vh] font-semibold text-primary mb-2 text-content">
              {{ blog.data.title }}
            </h3>
            <p class="text-sm text-primary mb-1 text-content">
              <span class="font-medium">
                {{ formatDate(blog.data.pubDate) }}
              </span>
              • By <span class="font-medium">{{ blog.data.author }}</span>
            </p>
            <p class="text-gray-500 mt-3 text-lg text-content line-clamp-3">
              {{ blog.data.description }}
            </p>
          </div>
          <div class="ring-1 text-[1rem] w-fit px-4 py-1">
            <button type="button">Read</button>
          </div>
        </div>

        <div class="w-1/2">
          <img
            :src="blog.data.heroImage"
            :alt="blog.data.title"
            class="w-fit h-[25rem] aspect-video object-cover rounded-md"
            draggable="false"
          />
        </div>
      </div>

      <!-- Indicators -->
    </div>
    <div class="absolute flex justify-start my-4 bottom-0">
      <button
        v-for="(_, index) in featuredBlogs"
        :key="index"
        :class="[
          'indicator w-3 h-3 mx-1 rounded-full',
          state.currentIndex === index
            ? 'bg-[color:var(--accent)]'
            : 'bg-gray-400',
        ]"
        @click="goToSlide(index)"
      ></button>
    </div>
  </section>
</template>

<style>
.test {
  @apply ring-1 ring-red-600;
}

.carousel {
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: x mandatory;
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
