<template>
  <div class="flex flex-center q-gutter-sm">
    <q-img v-if="patternPicture.length == 0" style="height: 45px; width: 50px">
      <div class="absolute-full flex flex-center bg-grey-3 text-dark">
        <q-icon name="wallpaper" color="grey" size="20px"> </q-icon>
      </div>
    </q-img>
    <img v-for="(item, key) in patternPicture" :key="key" :src="`${$q.localStorage.getItem('myonestore_system_local').attach_url}` + item.path ? item.path : ''" width="50px" height="45px" v-else />
  </div>
</template>
<script>
export default {
  name: 'AgImg',
  components: {},
  data () {
    return {
      patternPicture: []
    }
  },
  created () {
    if (this.params.data.ppa_loop_image) {
      this.patternPicture = this.params.data.ppa_loop_image.split(',')
    }
  },
  mounted () {},
  computed: {},
  methods: {}
}
</script>
