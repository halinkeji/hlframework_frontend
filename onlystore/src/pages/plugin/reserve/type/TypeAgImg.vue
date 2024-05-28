<template>
  <q-img
    :src="pictureData.coverImage && pictureData.coverImage.id ? $q.localStorage.getItem('onlystore_system_local').attach_url + pictureData.coverImage.path : ''"
    :ratio="1"
    style="height: 50px ;width: 50px"
  />
</template>
<script>
export default {
  name: 'TypeAgImg',
  data () {
    return {
      pictureData: ''
    }
  },
  mounted () {},
  created () {
    this.pictureData = this.params.data
  },
  computed: {},
  methods: {}
}
</script>
