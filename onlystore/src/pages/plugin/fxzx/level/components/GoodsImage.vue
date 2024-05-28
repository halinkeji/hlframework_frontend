<template>
  <div class="row items-center">
    <q-img :src="goodsCoverImage && goodsCoverImage.id ? $q.localStorage.getItem('onlystore_system_local').attach_url + goodsCoverImage.path : ''" width="50px" height="50px">
      <template v-if="!goodsCoverImage">
        <div class="absolute-full flex flex-center bg-grey-3 text-dark">
          <q-icon name="wallpaper" color="grey" size="20px"> </q-icon>
        </div>
      </template>
      <template v-slot:error>
        <div class="absolute-full flex flex-center bg-grey-3  text-dark">
          <q-icon name="wallpaper" color="grey" size="20px"> </q-icon>
        </div>
      </template>
    </q-img>
  </div>
</template>
<script>
export default {
  name: 'GoodsImage',
  data () {
    return {
      goodsCoverImage: ''
    }
  },
  mounted () {},
  created () {
    this.goodsCoverImage = this.params.data.coverImage
  },
  computed: {},
  methods: {}
}
</script>
