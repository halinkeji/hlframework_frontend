<template>
  <!-- authorityMeta('confirm')  -->
  <div class="q-gutter-xs">

    <q-btn color="blue"  v-if="authorityMeta('view')" @click="showPopup" unelevated label="详情" />
  </div>
</template>
<script>
export default {
  name: 'AgButton',
  components: {},
  data () {
    return {
      addPoppupStatus: false,
      dataId: ''
    }
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {

    showPopup () {
      this.params.context.showPopup(this.params.data.id)
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
