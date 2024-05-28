<template>
  <div>
    <q-toggle color="green" :true-value="1" :false-value="0" @input="updated"  v-model="switchStore" />
  </div>
</template>

<script>
export default {
  name: 'AgMode',
  data () {
    return {
      switchStore: 1
    }
  },
  created () {
    this.switchStore = this.params.data.prp_status == '1' ? 1 : 0
  },
  mounted () {},
  computed: {},
  methods: {
    updated () {
      const obj = {
        prp_status: this.switchStore,
        id: this.params.data.id
      }
      this.$store
        .dispatch('rewardPosition/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '修改状态成功',
              color: 'green'
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
