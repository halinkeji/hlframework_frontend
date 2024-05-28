<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
      <q-card
        class="q-pa-md q-pl-lg"
        :style="{
          width: this.$q.screen.width * 0.5 + 'px',
          'min-width': this.$q.screen.width * 0.5 + 'px',
        }"
      >
        <q-card-section class="row items-center q-pa-none">
          <div class="text-h6">电子秤设置</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-tabs v-model="scalesTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left">
          <q-tab name="dingjian" label="顶尖品牌" />
        </q-tabs>
        <q-form ref="scalesDataRef" class="q-gutter-md" v-if="scalesTab == 'dingjian'">
          <!-- 电子秤设置第一行 -->
          <div class="row">
            <q-select
              outlined
              dense
              emit-value
              map-options
              label="称重机品牌"
              class=" col-12 col-md-6 q-mt-sm q-px-sm"
              v-model="scalesData.psc_brand"
              :rules="[(val) => !!val || '称重机品牌']"
              :options="brandOptions"
            />
            <q-input outlined dense class=" col-12 col-md-6 q-mt-sm q-px-sm" v-model="scalesData.psc_machine_id" label="设备ID" disable lazy-rules :rules="[(val) => !!val || '设备ID不能为空']" />
            <q-select
              outlined
              dense
              emit-value
              map-options
              label="串口"
              class=" col-12 col-md-6 q-mt-sm q-px-sm"
              v-model="scalesData.psc_port_com"
              option-label="path"
              option-value="path"
              :options="deviceList"
            />
            <q-select
              outlined
              dense
              emit-value
              map-options
              label="波特率"
              class=" col-12 col-md-6 q-mt-sm q-px-sm"
              v-model="scalesData.psc_baud_rate"
              :rules="[(val) => !!val || '电子秤波特率不能为空']"
              :options="['110', '300', '1200', '2400', '4800', '9600', '14400', '19200', '38400', '57600', '115200']"
            />
            <q-select
              outlined
              dense
              emit-value
              map-options
              label="数据位"
              class=" col-12 col-md-6 q-mt-sm q-px-sm"
              v-model="scalesData.psc_data_bits"
              :rules="[(val) => !!val || '数据位不能为空']"
              :options="['5', '6', '7', '8']"
            />
            <q-select
              outlined
              dense
              emit-value
              map-options
              label="奇偶校验"
              class=" col-12 col-md-6 q-mt-sm q-px-sm"
              v-model="scalesData.psc_parity"
              :rules="[(val) => !!val || '请填写奇偶校验']"
              :options="['none', 'even', 'mark', 'odd', 'space']"
            />

            <q-select
              outlined
              dense
              emit-value
              map-options
              label="停止位"
              class=" col-12 col-md-6 q-mt-sm q-px-sm"
              v-model="scalesData.psc_stop_bits"
              :rules="[(val) => !!val || '停止位不能为空']"
              :options="['1', '2']"
            />

            <q-select
              outlined
              dense
              emit-value
              map-options
              label="是否开启"
              class=" col-12 col-md-6 q-mt-sm q-px-sm"
              v-model="scalesData.psc_status"
              :options="[
                { label: '是', value: 1 },
                { label: '否', value: 0 },
              ]"
            />
          </div>
          <!-- 电子秤设置第四行 -->
        </q-form>
        <div class="col-shrink bg-white q-py-sm text-center  q-mt-xs" >
          <q-btn unelevated class="q-px-xl" label="提交" @click="saveData()" color="primary" :disable="saveDisable" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'addScales',
  components: {},
  data () {
    return {
      saveDisable: false,
      showDialog: false,
      brandOptions: this.$store.state.scales.brandOptions,
      scalesData: {
        psc_data_bits: '',
        psc_parity: '',
        psc_baud_rate: '',
        psc_stop_bits: '',
        psc_machine_id: '',
        psc_auto_open: 1,
        psc_status: 1,
        psc_brand: ''

      },
      scalesTab: 'dingjian'
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.scalesData.id = id
        this.$store.dispatch('scales/getItem', this.scalesData.id).then((res) => {
          if (res.code == 200 && res.data) {
            this.scalesData = res.data
          }
        })
      } else {
        // if (machineIdSync()) {
        //   this.scalesData.psc_machine_id = machineIdSync()
        // }
      }
    },
    saveData () {
      this.$refs.scalesDataRef.validate().then((success) => {
        if (success) {
          this.saveDisable = true
          const obj = {
            id: this.$route.query.id,
            ...this.scalesData
          }
          this.$store
            .dispatch('scales/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.scalesData.id > 0 ? '修改' : '新增'}` + '电子秤信息成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.saveDisable = false
                this.hideNowPage()
              }
            })
            .catch((error) => {
              this.$q.notify({
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '失败',
                caption: error.message,
                color: 'red'
              })
              this.saveDisable = false
            })
        }
      })
    },
    hideNowPage () {
      this.showDialog = false
      this.scalesData = {
        psc_data_bits: '',
        psc_parity: '',
        psc_baud_rate: '',
        psc_stop_bits: '',
        psc_machine_id: '',
        psc_auto_open: 1,
        psc_status: 1
      }
      this.$emit('dataList')
      this.saveDisable = false
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
