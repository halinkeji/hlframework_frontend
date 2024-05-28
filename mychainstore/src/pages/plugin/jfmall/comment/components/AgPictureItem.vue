<template>
  <q-img
    :src="pictureData.gc_cover_image"
    :ratio="1"
    style="height: 50px ;width: 50px"
  />
</template>
<script>
export default {
  name: 'PictureItem',
  data () {
    return {
      pictureData: {}
    }
  },
  created () {
    this.pictureData = this.params.data
  },
  mounted () {},
  computed: {},
  methods: {}
}
</script>
<style scoped></style>
