<template>
  <div>
    <q-toggle
      color="green"
      :true-value="1"
      :false-value="0"
      v-if="authorityMeta('edit')"
      @input="updated"
      v-model="switch1"
    />
  </div>
</template>
<script>
export default {
  name: 'AgMode',
  data () {
    return {
      switch1: true
    }
  },
  mounted () {},
  computed: {},
  created () {
    if (this.params.data.grp_status == 1) {
      this.switch1 = 1
    } else {
      this.switch1 = 0
    }
  },
  methods: {
    updated () {
      let grp_status
      if (this.switch1 == true) {
        grp_status = this.switch1 + 0
      } else {
        grp_status = this.switch1 + 2
      }
      const obj = {
        grp_status: grp_status,
        id: this.params.data.id
      }
      this.$store
        .dispatch('goodscount/setDataMode', obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '修改状态成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch(error => {})
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
