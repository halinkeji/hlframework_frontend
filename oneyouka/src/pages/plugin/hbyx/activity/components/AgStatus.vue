<template>
  <q-toggle v-model="params.data.pha_status" true-value="1" false-value="0" color="green" @input="updateStatus" />
</template>
<script>
export default {
  name: 'AgStatus',
  components: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    updateStatus () {
      const obj = {
        pha_status: this.params.data.pha_status,
        id: this.params.data.id
      }
      this.$store
        .dispatch('hbyx/setActivityData', obj)
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
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    }
  }
}
</script>
