<template>
  <q-breadcrumbs
    class="flex items-center q-my-xs"
    active-color="primary"
    separator-color="primary"
    separator="/"
  >
    <template v-for="(v, i, k) in breadcrumbs">
      <q-breadcrumbs-el
        v-if="v.title"
        class="items-center"
        :label="v.title"
        :icon="k == 0 ? 'ion-home' : v.icon"
        :key="i + v.title"
        :to="{
          path: breadcrumbs.length === i + 1 ? false : v.path
        }"
      >
      </q-breadcrumbs-el>
    </template>
  </q-breadcrumbs>
</template>

<script>
export default {
  name: "Breadcrumbs",
  data() {
    return {
      breadcrumbs: []
    };
  },
  mounted() {
    this.breadcrumbs = this.$store.getters["settings/getBreadcrumbs"];
  },
  computed: {
    getBreadcrumbs() {
      return this.$store.getters["settings/getBreadcrumbs"];
    }
  },
  watch: {
    getBreadcrumbs(newVal, oldVal) {
      this.breadcrumbs = newVal;
    }
  }
};
</script>
