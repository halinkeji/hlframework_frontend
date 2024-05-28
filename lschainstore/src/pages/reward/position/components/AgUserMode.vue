<template>
  <div>
    <q-toggle color="green" :true-value="1" :false-value="0" @input="updated" v-if="authorityMeta('edit')" v-model="switchStore" />
  </div>
</template>

<script>
export default {
  name: 'AgUserMode',
  data () {
    return {
      switchStore: 1
    }
  },
  created () {
    this.switchStore = this.params.data.pru_status == '1' ? 1 : 0
  },
  mounted () {},
  computed: {},
  methods: {
    updated () {
      const obj = {
        pru_status: this.switchStore,
        id: this.params.data.id
      }
      this.$store
        .dispatch('rewardPosition/setUserData', obj)
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
      return true
    }
  }
}
</script>
