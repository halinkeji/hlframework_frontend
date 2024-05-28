<template>
  <q-toggle v-model="switchStatus" :true-value="1" :false-value="0" color="green" @input="updateStatus" />
</template>
<script>
export default {
  name: 'AgStatus',
  components: {},
  data () {
    return {
      switchStatus: 1
    }
  },
  created () {
    this.switchStatus = this.params.data.pmp_status == 1 ? 1 : 0
  },
  mounted () {},
  computed: {},
  methods: {
    updateStatus () {
      const obj = {
        pmp_status: this.switchStatus,
        id: this.params.data.id
      }
      this.$store
        .dispatch('mezs/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '修改状态成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    }
  }
}
</script>
