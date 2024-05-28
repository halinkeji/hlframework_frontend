<template>
  <div>
    <q-toggle
      v-model="switchStore"
      :true-value="1"
      :false-value="0"
      @input="updated"
      v-if="authorityMeta('edit')"
      color="green"
    />
  </div>
</template>

<script>
export default {
  name: 'Mode',
  data () {
    return {
      ModeData: {},
      switchStore: true
    }
  },

  mounted () {},
  computed: {},
  created () {
    this.ModeData = this.params.data
    if (this.params.data.gt_ifSetStore == 1) {
      this.switchStore = 1
    } else {
      this.switchStore = 0
    }
  },
  methods: {
    updated () {
      let gt_ifSetStore
      if (this.switchStore == true) {
        gt_ifSetStore = this.switchStore + 0
      } else {
        gt_ifSetStore = this.switchStore + 2
      }
      const obj = {
        gt_ifSetStore: gt_ifSetStore,
        id: this.params.data.id
      }
      this.$store
        .dispatch('goodstype/setData', obj)
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
    },
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

<style scoped></style>
