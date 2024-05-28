<template>
  <q-dialog v-model="isSidebarActiveLocal" persistent>
    <q-card
      class="q-pa-sm fit"
      :style="{
        width: this.$q.screen.width * 0.8 + 'px',
        'min-width': this.$q.screen.width * 0.8 + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <div class="row justify-center">
            <h6 class="no-margin">绑定物流单</h6>
            <q-space />
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
        </div>
        <div class="col-shrink full-height bg-white">
          <div class="col-shrink bg-white q-pa-sm full-height">
            <q-form ref="dataFormRef">
              <div v-if="wuliuDataList.length > 1">
                <div class="row" v-for="(normItem, normIndex) in wuliuDataList" :key="normIndex">
                  <div class="col-3 " v-if="normItem.cep_barcode">
                    <q-input  v-model="normItem.cep_barcode" outlined bottom-slots dense readonly label="装箱单据号" />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input
                      v-model="normItem.cew_name"
                      outlined
                      bottom-slots
                      dense
                      label="物流名称"
                      placeholder="请输入物流名称"
                      lazy-rules
                      :rules="[(val) => (val && val.length > 0) || '请输入物流名称']"
                    />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input
                      v-model="normItem.cew_number"
                      outlined
                      bottom-slots
                      dense
                      label="物流单号"
                      lazy-rules
                      :rules="[(val) => (val && val.length > 0) || '请输入物流单号']"
                    />
                  </div>
                  <div class="col-md-3 col-12">
                    <q-input v-model="normItem.cew_note" outlined bottom-slots dense label="物流备注"  />
                  </div>
                </div>
              </div>

              <div class="row" v-else>
                 <div class="col-md-3 " v-if="normItem.cep_barcode">
                    <q-input class="q-mt-md q-mx-sm" v-model="normItem.cep_barcode" outlined bottom-slots dense readonly label="装箱单据号" />
                  </div>
                <div class="col-md-3 col-12">
                  <q-input
                    v-model="normItem.cew_name"
                    outlined
                    bottom-slots
                    dense
                    label="物流名称"
                    class="q-mt-md"
                    placeholder="请输入物流名称"
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '请输入物流名称']"
                  />
                </div>
                <div class="col-md-3 col-12">
                  <q-input
                    v-model="normItem.cew_number"
                    outlined
                    bottom-slots
                    dense
                    label="物流单号"
                    class="q-mt-md q-mx-sm"
                    placeholder="请输入物流单号"
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '请输入物流单号']"
                  />
                </div>
                <div class="col-md-3 col-12">
                  <q-input v-model="normItem.cew_note" outlined bottom-slots dense label="物流备注" class="q-mt-md q-mx-sm" />
                </div>
              </div>
            </q-form>
          </div>
        </div>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
          <q-btn label="确定物流单" unelevated @click="saveDataSubmit" color="primary" class="q-px-xl" />
          <q-btn label="关闭" unelevated @click="isSidebarActiveLocal = false" color="grey" class="q-px-xl" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'ShowWuliuData',
  data () {
    return {
      isSidebarActiveLocal: true,
      logDataList: [],
      wuliuDataList: [],
      normItem: {
        cew_name: '',
        cew_number: '',
        cew_note: ''
      },
      order_id: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (data, type) {
      this.isSidebarActiveLocal = true
      if (data > 0) {
        this.order_id = data
      }
      const obj = {
        order_id: data
      }
      this.$store
        .dispatch('erpDirectOut/getWuliuData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.length > 1) {
              this.wuliuDataList = res.data ? res.data : []
            } else {
              this.normItem = res.data ? res.data[0] : { cew_name: '', cew_number: '', cew_note: '' }
            }
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    saveDataSubmit () {
      if (this.wuliuDataList.length > 0) {
        var obj = {
          type: 1,
          wuliuDataList: this.wuliuDataList
        }
      } else {
        var obj = {
          type: 2,
          out_id: this.order_id,
          wuliuDataList: this.normItem
        }
      }
      this.$store.dispatch('erpDirectOut/setWuliuData', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '关联物流单成功',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          this.wuliuDataList = []
          this.normItem = {}
          this.isSidebarActiveLocal = false
        }
      })
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    }, // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    } // 表格宽度自适应
  }
}
</script>
