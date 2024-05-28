<template>
  <div>
    <q-img
      :key="i"
      v-for="i in imageData"
      :src="`${$q.localStorage.getItem('fzchainstore_store_local').attach_url}` + i"
      @click="openImg(`${$q.localStorage.getItem('fzchainstore_store_local').attach_url}` + i)"
      style="height: 50px ;width: 50px"
    >
    </q-img>
  </div>
</template>
<script>
export default {
  name: 'AgPictureItem',
  data () {
    return {
      imageData: [],
      data: {}
    }
  },
  created () {
    const data = this.params.data
    if (data.ptr_loop_image) {
      this.imageData = data.ptr_loop_image.split(',')
    } else {
      this.imageData = []
    }
  },
  mounted () {},
  computed: {},
  methods: {
    openImg (url) {
      this.$q.dialog({
        title: '图片',
        ok: false,
        style: "height='500px';width='600px'",
        class: 'full-widht full-heigth',
        message: `<img src="${url}" height="500px" min-width="700px" />`,
        html: true
      })
    }
  }
}
</script>
<style scoped></style>
