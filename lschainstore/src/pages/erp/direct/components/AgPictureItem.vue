<template>
  <q-img
    :src="params.data.coverImage ? `${$q.localStorage.getItem('lschainstore_system_local').attach_url}` + params.data.coverImage.path : ''"
    :ratio="1"
    style="height: 45px; width: 45px"
  >
    <template v-if="!params.data.coverImage">
      <div class="absolute-full flex flex-center bg-grey-3 text-dark">
        <q-icon name="wallpaper" color="grey" size="25px"> </q-icon>
      </div>
    </template>
    <template v-slot:error>
      <div class="absolute-full flex flex-center bg-grey-3 text-dark">
        <q-icon name="wallpaper" color="grey" size="25px"> </q-icon>
      </div>
    </template>
    <template v-if="params.data.coverImage">
      <q-tooltip v-if="params.data.coverImage">
        <q-img
          :src="params.data.coverImage ? `${$q.localStorage.getItem('lschainstore_system_local').attach_url}` + params.data.coverImage.path : ''"
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
