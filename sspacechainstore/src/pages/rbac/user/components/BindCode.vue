<template>
  <q-dialog @hide="hideNowPage" v-model="bindCodeDialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.2) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.2) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs text-h6 q-mb-xs">绑定终端</div>

        <div class="col-shrink q-pa-sm full-height">
          <div class="q-gutter-sm">
            <q-radio  v-model="bindClientType" val="wechat" label="微信公众号" />
          </div>

          <div class="text-center">
             <qrcode-vue :value="dataUrl" :size="'200'" level="H" />
          </div>
        </div>
        <div class="col-shrink bg-white q-py-sm text-center q-gutter-sm q-mt-xs">
          <q-btn unelevated color="grey" @click="bindCodeDialogStatus = false" class="q-px-xl" label="关闭" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  components: {},
  name: 'BindCode',
  props: {},
  data () {
    return {
      bindCodeDialogStatus: false,
      bindClientType: 'wechat',
      dataUrl: '',
      relation_user_id: '',
      bind_code: ''
    }
  },
  computed: {},
  created () {},
  watch: {},
  mounted () {},
  methods: {
    init (userId) {
      this.bindCodeDialogStatus = true

      this.$nextTick(() => {
        this.relation_user_id = userId
        this.setBindCode()
      })
    },
    setBindCode () {
      this.bind_code = (parseInt(Date.now() / 1000)).toString()
      const payload = {
        relation_user_id: parseInt(this.relation_user_id),
        bind_code: this.bind_code
      }

      this.$store
        .dispatch('user/setUserItem', payload)
        .then((res) => {
          if (res.code == 200) {
            this.setCodeUrl()
            this.$q.notify({
              message: '成功',
              caption: '请扫描进行绑定！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    setCodeUrl () {
      const system_local = this.$q.localStorage.getItem('sspacechainstore_system_local')
      const account_info = this.$q.localStorage.getItem('sspacechainstore_account_info')
      if (system_local && account_info) {
        switch (this.bindClientType) {
          case 'wechat':
            this.dataUrl = system_local.systemInfo.site_url + '/m/chainstore/manage-ouath?bind_code=' + this.bind_code + '&id=' + account_info.lib_id
            break
        }
      }
    },
    hideNowPage () {
      this.$emit('closeDialog')
    }
  }
}
</script>
