<template>
  <div>
    <q-dialog v-model="isSidebarActiveLocal" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle2">{{ dataId > 0 ? '修改' : '新增' }}供货商分类</div>

          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-form ref="supplierTypeDataRef" class="q-gutter-md" @submit="submitData">
          <q-card-section class="q-pt-lg">
            <div class="col-12">
              <q-input label="名称" outlined v-model="gst_name" dense lazy-rules :rules="[(val) => !!val || '名称是必填的']" />
            </div>
          </q-card-section>
        </q-form>
        <q-card-actions align="center" class="row q-gutter-sm">
          <q-btn unelevated label="确认" class="q-px-xl" color="primary" @click="submitData" />
          <q-btn label="关闭" unelevated color="grey" class="q-px-xl" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'AddGys',
  data () {
    return {
      dialogWidth: '1000px',
      dataId: '',
      isSidebarActiveLocal: false,
      disabledStatus: false,
      gst_name: ''
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
      this.gst_name = ''
      this.isSidebarActiveLocal = true
      if (id > 0) {
        this.$store.dispatch('supplierType/getItemData', id).then((res) => {
          if (res.code == 200) {
            this.gst_name = res.data.gst_name
          }
        })
      }
    },
    submitData () {
      this.$refs.supplierTypeDataRef.validate().then((success) => {
        if (success) {
          this.disabledStatus = true
          const obj = {
            gst_name: this.gst_name,
            id: this.dataId
          }
          this.$store.dispatch('supplierType/addData', obj).then((res) => {
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
