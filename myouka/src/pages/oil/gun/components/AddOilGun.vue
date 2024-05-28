<template>
  <q-dialog v-model="oilgunstatus" @hide="hideNowPage" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
      }"
    >
      <q-toolbar class="q-px-sm q-py-xs">
        <q-toolbar-title class="text-subtitle2">{{ dataId > 0 ? '修改' : '新增' }}</q-toolbar-title>
        <q-btn flat round icon="close" @click="hideNowPage()" size="md" />
      </q-toolbar>
      <q-separator />
      <q-form ref="oilGunRef" class="q-pa-sm  q-col-gutter-sm">
        <q-card flat>
          <div class="row">
            <div class="q-py-sm q-px-md">是否启用</div>
            <q-space />
            <q-toggle color="green" true-value="1" false-value="2" v-model="oilGunFrom.og_status" />
          </div>

          <div class="row q-py-sm q-px-md q-mt-xs q-col-gutter-md">
            <div class="col-md-6 col-12 q-pt-none">
              油枪名称 <span class="text-red q-ml-xs">*</span>
              <q-input outlined bottom-slots v-model="oilGunFrom.og_name" dense :rules="[(val) => !!val || '油枪名称是必填项']"> </q-input>
            </div>
            <div class="col-md-6 col-12 q-pt-none">
              油枪编号<span class="text-red q-ml-xs">*</span>
              <q-input outlined bottom-slots v-model="oilGunFrom.og_code" dense :rules="[(val) => !!val || '油枪编号是必填项']"> </q-input>
            </div>
            <div class="col-md-6 col-12 q-pt-none">
              加油机选择<span class="text-red q-ml-xs">*</span>
              <q-select
                outlined
                dense
                option-value="id"
                option-label="om_name"
                emit-value
                map-options
                v-model="oilGunFrom.machine_id"
                :options="machineList"
                label="请选择加油机"
                :rules="[(val) => !!val || '加油机是必填项']"
              />
            </div>
            <div class="col-md-6 col-12 q-pt-none">
              油品选择<span class="text-red q-ml-xs">*</span>
              <q-select
                outlined
                option-value="id"
                option-label="op_name"
                emit-value
                map-options
                dense
                v-model="oilGunFrom.oil_id"
                :options="oilList"
                label="请选择油品"
                :rules="[(val) => !!val || '油品是必填项']"
              />
            </div>
            <div class="col-md-6 col-12 q-pt-none">
              油罐选择<span class="text-red q-ml-xs">*</span>
              <q-select
                outlined
                option-value="id"
                option-label="oc_name"
                emit-value
                map-options
                dense
                v-model="oilGunFrom.oilcan_id"
                :options="tankList"
                label="请选择油罐"
                :rules="[(val) => !!val || '油罐是必填项']"
              />
            </div>
            <div class="col-md-6 col-12 q-pt-none" v-if="printerList && printerList.length > 0">
              小票打印机
              <q-select
                outlined
                option-value="id"
                option-label="cp_name"
                emit-value
                map-options
                dense
                v-model="oilGunFrom.printer_id"
                :options="printerList"
                label="请选择小票打印机"
              />
            </div>
          </div>
        </q-card>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
          <q-btn unelevated label="保存" @click="saveData()" color="primary" class="q-px-xl" />
          <q-btn unelevated label="关闭" type="reset" @click="hideNowPage()" color="grey" class="q-px-xl" />
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
      oilGunFrom: {
        og_name: '',
        og_code: '',
        og_status: '1',
        machine_id: '',
        oil_id: '',
        printer_id: '',
        oilcan_id: ''
      },
      dataId: 0,
      model: null,
      machineList: [],
      oilList: [],
      tankList: [],
      printerList: [],
      oilgunstatus: false
    }
  },
  mounted () {
    this.getBasis()
  },
  computed: {},
  created () {},
  methods: {
    init (id) {
      this.dataId = id
      this.oilgunstatus = true
      if (id > 0) {
        this.$store.dispatch('gun/getItem', id).then((res) => {
          if (res.code == 200) {
            this.oilGunFrom = res.data
          }
        })
      }
    },
    getBasis () {
      this.$store
        .dispatch('gun/getBasis')
        .then((res) => {
          if (res.code == 200) {
            this.machineList = res.data.machine ? res.data.machine : []
            this.printerList = res.data.printer ? res.data.printer : []
            this.oilList = res.data.oil ? res.data.oil : []
            this.tankList = res.data.can ? res.data.can : []
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
    saveData () {
      this.$refs.oilGunRef.validate().then((success) => {
        if (success) {
          this.stop = true
          const obj = {
            ...this.oilGunFrom,
            id: this.dataId
          }
          this.$store
            .dispatch('gun/setData', obj)
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
      this.oilgunstatus = false
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
