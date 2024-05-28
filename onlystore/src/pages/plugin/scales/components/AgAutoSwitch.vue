<template>
  <div>
    <q-toggle v-model="switchStore" :true-value="1" v-if="authorityMeta('edit')" :false-value="0" @input="statusBut()" color="green" />
  </div>
</template>

<script>
export default {
  name: 'AgAutoSwitch',
  data () {
    return {
      switchStore: 0
    }
  },

  mounted () {},
  created () {
    this.switchStore = this.params.data.psc_auto_open == '1' ? 1 : 0
  },
  computed: {},
  methods: {
    // 修改状态
    statusBut () {
      const obj = {
        id: this.params.data.id,
        psc_auto_open: this.switchStore
      }
      this.$store
        .dispatch('scales/setData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '串口状态修改成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            setTimeout(() => {
              this.params.context.getList()
            }, 100)
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '修改失败',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
