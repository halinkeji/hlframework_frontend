<template>
  <q-toggle v-model="params.data.gtg_status" :true-value="'1'" :false-value="'0'" color="green" @input="updateStatus" />
</template>
<script>
export default {
  name: 'AgStatus',
  data () {
    return {}
  },
  created () {},
  computed: {},

  mounted () {},
  methods: {
    updateStatus () {
      const obj = {
        gtg_status: this.params.data.gtg_status,
        id: this.params.data.id
      }
      this.$store.dispatch('goodsTiming/setData', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '修改状态成功',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        } else {
          this.$q.notify({
            message: '注意',
            caption: '失败！',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        }
      })
    }
  }
}
</script>
