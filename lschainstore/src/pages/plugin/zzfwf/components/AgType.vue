<template>
  <div :style="{ width: params.colDef.width }">
    <q-select v-model="params.data.zrg_link_type" @input="updatedData" option-value="value" option-label="label" emit-value map-options :options="options" label="选择折扣类型" />
  </div>
</template>
<script>
export default {
  name: 'AgType',
  components: {},
  data () {
    return {
      options: [
        {
          label: '折扣',
          value: 'discount'
        },
        {
          label: '固定',
          value: 'fixed'
        },
        {
          label: '关闭',
          value: 'close'
        }
      ]
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    updatedData () {
      const obj = {
        zrg_link_type: this.params.data.zrg_link_type,
        zrg_goods_id: this.params.data.id
      }
      this.$store
        .dispatch('zzfwf/setData', obj)
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
            message: 'Error',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },

    authorityMeta (key) {
      // return true
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
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
