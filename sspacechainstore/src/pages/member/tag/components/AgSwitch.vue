<template>
  <div>
    <q-toggle v-model="switchStore" :true-value="1" :false-value="0" @input="statusBut()" color="green" />
  </div>
</template>
<script>
export default {
  name: 'AgSwitch',
  data () {
    return {
      switchStore: 0
    }
  },
  created () {
    this.switchStore = this.params.data.mti_status == '1' ? 1 : 0
  },
  mounted () {},
  computed: {},
  methods: {
    statusBut () {
      const obj = {
        id: this.params.data.id,
        mti_status: this.switchStore
      }
      this.$store
        .dispatch('membertag/setData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '状态修改成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            color: 'red',
            message: '失败',
            caption: error.message,
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    }
  }
}
</script>
