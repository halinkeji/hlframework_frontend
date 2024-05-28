<template>
  <q-img :src="`${$q.localStorage.getItem('fzchainstore_system_local').attach_url}` + params.data.goo_cover_image" :ratio="1" style="height: 50px ;width: 50px">
    <template v-if="!params.data.goo_cover_image">
      <div class="absolute-full flex flex-center bg-grey-3  text-dark">
        <q-icon name="wallpaper" color="grey" size="25px"> </q-icon>
      </div>
    </template>
    <template v-slot:error>
      <div class="absolute-full flex flex-center bg-grey-3  text-dark">
        <q-icon name="wallpaper" color="grey" size="25px"> </q-icon>
      </div>
    </template>
  </q-img>
</template>
<script>
export default {
  name: 'PictureItem',
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {}
}
</script>
<style scoped></style>
