<template>
  <div
    :style="{
      'max-width': params.colDef.width * 0.7 + 'px',
      width: params.colDef.width * 0.7 + 'px',
    }"
  >
    <q-select
      @input="updatedStatus"
      v-model="params.data.pmm_status"
      :options="statusOptions"
      map-options
      dense
      outlined
      emit-value
      option-label="label"
      option-value="value"

    />
  </div>
</template>

<script>
export default {
  name: 'AgSelect',
  data () {
    return {
      statusOptions: [
        {
          label: '审核不通过',
          value: '-2'
        },
        {
          label: '待审核',
          value: '-1'
        },
        {
          label: '停用',
          value: '0'
        },
        {
          label: '运营中',
          value: '1'
        },
        {
          label: '未提交申请',
          value: '-3'
        }
      ]
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    updatedStatus () {
      const obj = {
        pmm_status: this.params.data.pmm_status,
        id: this.params.data.merchantId
      }
      this.$store
        .dispatch('merchantManage/updateMerchant', obj)
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
            this.params.context.getList()
          } else {
            this.$q.notify({
              message: '错误',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: res.message,
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '错误',
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

<style scoped></style>
