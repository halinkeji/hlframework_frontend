<template>
  <div>
    <q-btn
      color="primary"
      icon="ion-eye"
      v-if="authorityMeta('view')"
      unelevated
      flat
      @click="openAddressDialog()"
    />
  </div>
</template>
<script>
export default {
  name: 'AgSeeAddress',
  data () {
    return {}
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map(obj => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },
    openAddressDialog () {
      this.$nextTick(() => {
        this.params.context.openAddRessDialog(this.params.data.id)
      })
    }

  }
}
</script>
