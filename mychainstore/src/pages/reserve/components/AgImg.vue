<template>
  <q-img v-if="!coverImg" style="height: 50px; width: 50px">
    <div class="absolute-full flex flex-center bg-grey-3 text-dark">
      <q-icon name="wallpaper" color="grey" size="20px"> </q-icon>
    </div>
  </q-img>
  <img :src="coverImg" alt="" v-else style="height: 50px; width: 50px" />
</template>
<script>
export default {
  name: "AgImg",
  data() {
    return {
      coverImg: ""
    };
  },
  mounted() {},
  created() {
    this.coverImg = this.params.data.prp_cover_image;
  },
  computed: {},
  methods: {}
};
</script>
