<template>
  <div>
 <q-btn
      color="warning"
      class="q-mt-sm"
      unelevated
      label="已关怀"
      v-if="data.prompt===1"
    />
    <q-btn
      color="red"
      class="q-mt-sm"
      v-else
      unelevated
      label="关怀"
      @click="confirmDeleteRecord()"
    />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      addStoreSidebar: false,
      data: {}
    }
  },
  created () {
    this.data = this.params.data
  },
  methods: {
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: '确定生日关怀此会员吗',
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      this.$store
        .dispatch('alSms/setCareData', [{
          mem_memberName: this.data.mem_memberName,
          mem_memberBirthdayMonth: this.data.mem_memberBirthdayMonth,
          mem_memberBirthdayDay: this.data.mem_memberBirthdayDay,
          mem_memberMobile: this.data.mem_memberMobile
        }])
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '关怀成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.params.context.getListData()
          }
        })
        .catch(error => {
          this.$q.notify({
            message: 'Error',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    }
  }
}
</script>
