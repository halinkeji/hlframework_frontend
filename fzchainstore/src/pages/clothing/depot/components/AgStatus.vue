<template>
  <q-toggle
    v-model="switchStatus"
    :true-value="1"
    :false-value="0"
    color="green"
    v-if="authorityMeta('edit')"
    @input="updated"
  />
</template>
<script>
export default {
  name: 'AgStatus',
  data () {
    return {
      switchStatus: 1
    }
  },
  created () {
    if (this.params.data.cd_status == 1) {
      this.switchStatus = 1
    } else {
      this.switchStatus = 0
    }
  },
  methods: {
    updated () {
      const obj = {
        cd_status: this.switchStatus,
        id: this.params.data.id
      }
      this.$store
        .dispatch('clothingDepot/setData', obj)
        .then(res => {
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
        .catch(error => {
          this.$q.notify({
            message: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    }, // 更新商品分类状态
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
    }
  }
}
</script>
