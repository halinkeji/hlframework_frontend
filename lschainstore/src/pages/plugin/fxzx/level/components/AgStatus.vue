<template>
  <q-toggle
    v-model="switchStatus"
    :true-value="1"
    :false-value="-1"
    color="green"
    :disable="params.data.pfl_weights > 0 ? false : true"
    @input="updateStatus"
  />
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
    if (this.params.data.pfl_status == 1) {
      this.switchStatus = 1
    } else {
      this.switchStatus = -1
    }
  },
  mounted () {},
  computed: {},
  methods: {
    updateStatus () {
      const obj = {
        pfl_status: this.switchStatus,
        id: this.params.data.id
      }
      this.$store
        .dispatch('fxzx/setData', obj)
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
            icon: 'ion-close-circle-outlinee',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    }
  }
}
</script>
