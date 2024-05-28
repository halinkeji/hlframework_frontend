<template>
  <div>
    <q-btn color="secondary" unelevated class="q-mr-sm" label="查看绩效" @click="viewDetail" />
    <q-btn color="info" unelevated class="q-mr-sm" label="注册/加油二维码" @click="creatQrCodeM(dataId)" />
    <q-btn color="primary" class="q-mx-sm" unelevated label="修改" v-if="authorityMeta('edit')" @click="editUser" />
    <q-btn color="red" unelevated label="删除" v-if="authorityMeta('del')" @click="confirmDeleteRecord" />
    <q-dialog v-model="showCodeStatus">
      <q-card
        class="z-top"
        :style="{
          width: this.$q.screen.width * 0.2 + 'px',
          'min-width': this.$q.screen.width * 0.2 + 'px',
        }"
      >
        <div class="q-pa-sm q-mt-md text-center flex flex-center">
          <qrcode-vue :value="noticeUrl" :size="'200'" level="H" />
        </div>
        <div class="q-mt-md text-center full-width text-grey text-caption">右键保存至本地</div>
        <q-card-actions class="q-mt-md">
          <q-btn unelevated color="blue-9" label="关闭" @click="showCodeStatus = false" v-close-popup class="full-width" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      dataId: 0,
      showCodeStatus: false,
      noticeUrl: ''
    }
  },
  created () {
    this.dataId = this.params.data.id
  },
  mounted () {},
  computed: {},
  methods: {
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除姓名为 "${this.params.data.pru_name}" 的员工吗`,
          cancel: true
        })
        .onOk(() => {
          this.$store
            .dispatch('rewardPosition/delUserData', [this.dataId])
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除员工成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.params.context.getList()
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        })
        .onCancel(() => {})
    },
    viewDetail () {
      this.params.context.viewRecord(this.params.data)
    },
    editUser () {
      this.dataId = this.params.data.id
      this.params.context.addUserInfo(this.dataId)
    },
    creatQrCodeM (val) {
      this.showCodeStatus = true
      const accountInfo = this.$q.localStorage.getItem('oneyouka_account_info')
      const systemLocal = this.$q.localStorage.getItem('oneyouka_system_local')
      if (systemLocal && accountInfo) {
        this.noticeUrl = systemLocal.systemInfo.site_url + '/m/' + accountInfo.apply_id + '?id=' + accountInfo.lib_id + '&reward_id=' + val + '&StoreId=' + accountInfo.store_id
      }
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
