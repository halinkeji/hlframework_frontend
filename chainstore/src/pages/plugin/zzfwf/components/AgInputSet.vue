<template>
  <div :style="{ width: params.colDef.width }">
    <div v-if="params.data.zrg_link_type == 'discount'">
      <q-input v-model="params.data.zrg_discount_proportion" @change="updatedDataProportion" label="折扣比例" />
    </div>
    <div v-if="params.data.zrg_link_type == 'fixed'">
      <q-input v-model="params.data.zrg_fixed_amount" @change="updatedDataAmount" label="固定金额" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'AgInputSet',
  components: {},
  data () {
    return {
      dataId: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {

    updatedDataProportion () {
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/

      if (!reg.test(this.params.data.zrg_discount_proportion) && !(this.params.data.zrg_discount_proportion > 0 && this.params.data.zrg_discount_proportion <= 100)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入0 ~ 100之间的数值',
          color: 'red'
        })
        this.params.data.zrg_discount_proportion = ''
        return false
      }
      const obj = {
        zrg_discount_proportion: this.params.data.zrg_discount_proportion,
        zrg_goods_id: this.params.data.id
      }
      this.updatedData(obj)
    },
    updatedDataAmount () {
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
      if (!reg.test(this.params.data.zrg_fixed_amount)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入大于等于1的数值',
          color: 'red'
        })
        this.params.data.zrg_fixed_amount = ''
        return false
      }
      const obj = {
        zrg_fixed_amount: this.params.data.zrg_fixed_amount,
        zrg_goods_id: this.params.data.id
      }
      this.updatedData(obj)
    },
    updatedData (obj) {
      this.$store
        .dispatch('zzfwf/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '修改信息成功',
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
