<template>

    <!-- 修改弹窗 -->
    <q-dialog v-model="suppliertypestatus" @hide="hideNowPage" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth
        }"
        class="q-pa-sm "
      >
        <q-toolbar class="q-px-none">
          <q-toolbar-title class="text-subtitle1">{{
            dataId > 0 ? "修改" : "新增"
          }}</q-toolbar-title>
          <q-btn flat round icon="close" @click="hideNowPage()" size="12px" />
        </q-toolbar>
        <q-form ref="oilGunRef" class="q-gutter-md">
          <q-card flat >
            <div class="row q-py-sm q-px-md q-mt-xs q-col-gutter-md">
              <div class="col-md-12 col-12 q-pt-none">
                分类名称 <span class="text-red q-ml-xs">*</span>
                <q-input
                  outlined
                  bottom-slots
                  v-model="supplierTypeFrom.est_name"
                  dense
                  :rules="[val => !!val || '供应商分类名称是必填项']"
                >
                </q-input>
              </div>
            </div>
          </q-card>
          <div class="row q-mt-md">
            <q-space />
            <q-btn
              class="q-ml-sm q-mb-md"
              label="提交"
              unelevated
              @click="saveData()"
              color="primary"
            />
            <q-btn
              class="q-ml-sm q-mb-md"
              label="关闭"
              color="grey"
              unelevated
              @click="hideNowPage()"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
</template>

<script>
export default {
  name: 'AddOilGun',
  data () {
    return {
      dialogWidth: '1000px',
      supplierTypeFrom: {
        est_name: ''
      },
      dataId: 0,
      suppliertypestatus: false
    }
  },
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.3) + 'px'
    }
  },
  computed: {},
  created () {},
  methods: {
    init (id) {
      this.dataId = id
      this.suppliertypestatus = true
      if (id > 0) {
        this.$store.dispatch('osupplierType/getItem', id).then(res => {
          if (res.code == 200) {
            this.supplierTypeFrom = res.data
          }
        })
      }
    },
    saveData () {
      this.$refs.oilGunRef.validate().then(success => {
        if (success) {
          this.stop = true
          const obj = {
            ...this.supplierTypeFrom,
            id: this.dataId
          }
          this.$store
            .dispatch('osupplierType/setData', obj)
            .then(res => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              }
            })
            .catch(error => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
              this.stop = false
            })
        }
      })
    },

    hideNowPage () {
      this.$emit('getMethods')
      this.suppliertypestatus = false
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
