<template>
  <!-- 修改弹窗 -->
  <q-dialog v-model="oilmachinestatus" @hide="hideNowPage" persistent>
    <q-card
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth,
      }"
      class="q-pa-sm"
    >
      <q-toolbar class="q-pa-none">
        <q-toolbar-title class="text-subtitle2">{{ dataId > 0 ? '修改' : '新增' }}</q-toolbar-title>
        <q-btn flat round icon="close" @click="hideNowPage()" size="12px" />
      </q-toolbar>

      <q-form ref="oilMachineRef" class="q-gutter-md">

        <div class="row q-px-md q-py-sm q-mt-xs q-col-gutter-md">
          <div class="col-md-6 col-12 q-pt-none">
            <q-input outlined bottom-slots v-model="oilCanFrom.oc_name" label="油罐名称" dense :rules="[(val) => !!val || '油罐名称是必填项']">
            </q-input>
          </div>
          <div class="col-md-6 col-12 q-pt-none">
            <q-input outlined disable bottom-slots label="库存" v-model="oilCanFrom.oc_stock" dense> </q-input>
          </div>
          <div class="col-md-6 col-12 q-pt-none">
            <q-select
              outlined
              option-value="id"
              option-label="op_name"
              emit-value
              map-options
              dense
              v-model="oilCanFrom.oil_id"
              :options="oilList"
              label="请选择油品"
              :rules="[(val) => !!val || '油品是必填项']"
            />
          </div>
          <div class="col-md-6 col-12 q-pt-none">
            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              v-model="oilCanFrom.oc_status"
              :options="[
                { label: '开启', value: '1' },
                { label: '关闭', value: '0' },
              ]"
              dense
              label="状态"
            />
          </div>
        </div>

        <div class="row q-mt-md q-gutter-sm justify-center">
          <q-btn class="q-px-xl" label="保存" @click="saveData()" color="primary" unelevated />
          <q-btn class="q-px-xl" label="关闭" color="grey" unelevated @click="hideNowPage()" />
        </div>

      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddOilCan',
  data () {
    return {
      dialogWidth: '1000px',
      oilCanFrom: {
        oc_name: '',
        oc_stock: '',
        oil_id: '',
        oc_status: '1'
      },
      dataId: 0,
      oilList: [],
      oilmachinestatus: false
    }
  },
  mounted () {
    this.getOillist()
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.4) + 'px'
    }
  },
  computed: {},
  created () {},
  methods: {
    getOillist () {
      this.$store
        .dispatch('product/getCurrentAllOil')
        .then((res) => {
          if (res.code == 200) {
            this.oilList = res.data ? res.data : []
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
    },
    init (id) {
      this.dataId = id
      this.oilmachinestatus = true
      if (id > 0) {
        this.$store.dispatch('can/getItem', id).then((res) => {
          if (res.code == 200) {
            this.oilCanFrom = res.data
          }
        })
      }
    },
    saveData () {
      this.$refs.oilMachineRef.validate().then((success) => {
        if (success) {
          this.stop = true
          const obj = {
            ...this.oilCanFrom,
            id: this.dataId
          }
          this.$store
            .dispatch('can/setData', obj)
            .then((res) => {
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
            .catch((error) => {
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
      this.oilmachinestatus = false
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
