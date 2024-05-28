<template>
 <q-img
    :src="pictureData.coverImage && pictureData.coverImage.id ? $q.localStorage.getItem('fzchainstore_system_local').attach_url + pictureData.coverImage.path : ''"
    :ratio="1"
    style="height: 50px ;width: 50px"
  />

</template>

<script>
export default {
  name: 'AgPictureItem',
  data () {
    return {
      pictureData: {}
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.pictureData = this.params.data
  },
  methods: {}
}
</script>

<style scoped></style>
