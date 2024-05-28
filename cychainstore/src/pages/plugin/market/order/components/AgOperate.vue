<template>
   <div>
     <q-btn unelevated color="warning" class="q-mr-sm" label="查看详情" @click="showOrderDetail" v-if="authorityMeta('detailOrder')"> </q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  components: {},
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    showOrderDetail () {
      this.params.context.showOrderDetail(this.params.data.pmr_invoice_id)
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
