<template>
  <div>
    <q-dialog v-model="isSidebarActiveLocal" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
      >
        <q-card-section class="row items-center q-pa-sm">
          <div class="text-subtitle2">{{ dataId > 0 ? '修改' : '新增' }}客户组别</div>

          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-form ref="clientGroupDataRef"  @submit="submitData">
          <q-card-section class="q-pa-sm">
            <div class="col-12">
              <q-input label="组别名称" outlined v-model="ecg_name" dense lazy-rules :rules="[(val) => !!val || '名称是必填的']" />
            </div>
          </q-card-section>
        </q-form>
        <q-card-actions align="center" class="q-gutter-sm">
          <q-btn unelevated label="确认" color="primary" class="q-px-xl" @click="submitData" />
          <q-btn label="关闭" unelevated color="grey" class="q-px-xl" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'AddClientGroup',
  data () {
    return {
      dialogWidth: '1000px',
      dataId: '',
      isSidebarActiveLocal: false,
      disabledStatus: false,
      ecg_name: ''
    }
  },
  created () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.2) + 'px'
    }
  },
  mounted () {},
  methods: {
    init (id) {
      this.dataId = id
      this.ecg_name = ''
      this.isSidebarActiveLocal = true
      if (id > 0) {
        this.$store.dispatch('erpCustomerGroup/getItem', id).then((res) => {
          if (res.code == 200) {
            this.ecg_name = res.data.ecg_name
          }
        })
      }
    },
    submitData () {
      this.$refs.clientGroupDataRef.validate().then((success) => {
        if (success) {
          this.disabledStatus = true
          const obj = {
            ecg_name: this.ecg_name,
            id: this.dataId
          }
          this.$store.dispatch('erpCustomerGroup/setData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '操作成功！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })

              this.disabledStatus = false
              this.isSidebarActiveLocal = false
              this.$nextTick(() => {
                this.$emit('refreshDataList')
              })
            } else {
              this.disabledStatus = false
            }
          })
        }
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
