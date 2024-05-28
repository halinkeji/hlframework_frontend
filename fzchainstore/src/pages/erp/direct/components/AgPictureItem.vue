<template>
  <q-img
    :src="`${$q.localStorage.getItem('fzchainstore_store_local').attach_url}` + params.data.goo_cover_image"
    :ratio="1"
    style="height: 45px; width: 45px"
  >
    <template v-if="!params.data.goo_cover_image">
      <div class="absolute-full flex flex-center bg-grey-3 text-dark">
        <q-icon name="wallpaper" color="grey" size="25px"> </q-icon>
      </div>
    </template>
    <template v-slot:error>
      <div class="absolute-full flex flex-center bg-grey-3 text-dark">
        <q-icon name="wallpaper" color="grey" size="25px"> </q-icon>
      </div>
    </template>
    <template v-if="params.data.goo_cover_image">
      <q-tooltip v-if="params.data.goo_cover_image">
        <q-img
          :src="`${$q.localStorage.getItem('fzchainstore_store_local').attach_url}` + params.data.goo_cover_image"
          width="200px"
          height="200px"
        />
      </q-tooltip>
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
