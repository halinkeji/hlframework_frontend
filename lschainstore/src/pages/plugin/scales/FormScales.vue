<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll ">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-h6">
        <q-tabs v-model="scalesTab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left">
          <q-tab name="dingjian" label="顶尖品牌" />
        </q-tabs>
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs" v-if="scalesTab == 'dingjian'">
        <q-scroll-area class="fit full-height">
          <q-form ref="scalesDataRef" class="q-gutter-md" v-if="!scalesEdit">
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
              <q-input
                outlined
                dense
                class=" col-12 col-md-6 q-mt-sm q-px-sm"
                v-model="scalesData.psc_machine_id"
                label="设备ID"
                disable
                lazy-rules
                :rules="[(val) => !!val || '设备ID不能为空']"
              />
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
                class="col-12 col-md-6 q-mt-sm q-px-sm"
                v-model="scalesData.psc_status"
                :options="[
                  { label: '是', value: 1 },
                  { label: '否', value: 0 },
                ]"
              />
            </div>
            <div class="row justify-center">
              <q-list bordered class="col-4">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label
                      >称重结果：<span class="text-h6 text-weight-bold">{{ currentNumber }}</span>KG</q-item-label
                    >
                    <q-item-label caption>开始前，请先确认参数是否完整。测试开始称重功能之后务必点击结束称重！</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn color="primary" v-if="!testStatus" @click="openTest" unelevated label="开始称重" />
                    <q-btn color="negative" v-else @click="openTest" unelevated label="结束称重" />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <!-- 电子秤设置第四行 -->
          </q-form>

          <div class="col-shrink full-height flex flex-center bg-white" v-else>
            <q-card flat>
              <q-card-section class="text-h6 text-red">
                设备ID获取失败
              </q-card-section>
              <q-card-section>
                <q-spinner-gears size="150px" color="primary" />
              </q-card-section>
            </q-card>
          </div>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-py-sm text-center q-mt-xs" v-if="!scalesEdit">
        <q-btn unelevated class="q-px-xl" label="保存" @click="saveData()" color="primary" v-if="authorityMeta('save')" :disable="saveDisable" />
      </div>
    </div>
  </div>
</template>
<script>
// import { machineIdSync } from 'node-machine-id'
export default {
  name: 'FormScales',
  components: {},
  data () {
    return {
      saveDisable: false,
      brandOptions: this.$store.state.scales.brandOptions,
      scalesData: {
        psc_data_bits: '',
        psc_parity: '',
        psc_baud_rate: '',
        psc_stop_bits: '',
        psc_machine_id: '',
        psc_port_com: '',
        psc_status: 1,
        psc_brand: ''
      },
      scalesEdit: true,
      deviceList: [],
      scalesTab: 'dingjian',
      currentNumber: 0,
      serial_port: '',
      testStatus: false
    }
  },
  created () {
    this.portList()
  },
  mounted () {
    this.init()
  },
  computed: {},
  methods: {
    openTest () {
      const that = this
      const SerialPort = window.serialport
      const weighingConfigInfo = this.scalesData
      try {
        // PS：port_com和option均是从数据库内拿到得串口配置信息
        const port_com = weighingConfigInfo.psc_port_com
        const option = {
          baudRate: parseInt(weighingConfigInfo.psc_baud_rate), // 波特率
          dataBits: parseInt(weighingConfigInfo.psc_data_bits), // 数据位
          parity: weighingConfigInfo.psc_parity, // 奇偶校验
          stopBits: parseInt(weighingConfigInfo.psc_stop_bits), // 停止位
          flowControl: false,
          autoOpen: false
        }
        this.serial_port = new SerialPort(port_com, option, false)
        this.serial_port.open((error) => {
          if (!error) {
            this.testStatus = true
            console.log('打开端口成功，正在监听数据中')
            that.getWeighing()
          } else {
            this.testStatus = false
            this.$q.notify({
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '失败',
              caption: '打开端口错误：' + JSON.stringify(error),
              color: 'red'
            })
            console.log('打开端口错误：' + JSON.stringify(error))
          }
        })
      } catch (err) {
        this.testStatus = false
        this.$q.notify({
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          message: '失败',
          caption: err,
          color: 'red'
        })
        console.log('err', err)
      }
    },

    // 商品称重 A
    getWeighing () {
      const that = this
      try {
        let datas = ''
        this.serial_port.on('data', (data) => {
          data = new Buffer(data, 'utf-8').toString()
          console.log('data', data)
          // 不稳定状态
          if (data.indexOf('U') != -1) {
            console.log('不稳定状态')
            datas = data
          } else if (data.indexOf('S') != -1) {
            console.log('稳定状态')
            datas = data
          } else {
            datas += data
          }
          const num = datas.replace(/[^0-9]/gi, '')
          console.log('num', num)
          // this.weightType = 2
          switch (parseInt(that.scalesData.psc_brand)) {
            case '1':
              // 大华计算格式
              var currentNumber = this.$q_decimal(num / 1000000000).toFixed(3)
              if (currentNumber != that.currentNumber) {
                that.currentNumber = currentNumber
              }

              break
            case 'dingjian':
              // 顶尖计算格式
              var currentNumber = this.$q_decimal(num / 1000).toFixed(3)
              if (currentNumber != that.currentNumber) {
                that.currentNumber = currentNumber
              }
              break
            default:
              // 其他通用计算格式
              var currentNumber = this.$q_decimal(num / 1000).toFixed(3)
              if (currentNumber != that.currentNumber) {
                that.currentNumber = currentNumber
              }
              break
          }
          if (data.indexOf('U') == -1 && data.indexOf('S') == -1) {
            datas = ''
          }
        })

        // const buf = Buffer.from([0xab, 0x00000000, 0x8004, 0x0000, 0x00, 0x0000])

        // 错误监听
        this.serial_port.on('error', (error) => {
          this.testStatus = false
          this.$q.notify({
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            message: '失败',
            caption: '打开端口错误：' + error,
            color: 'red'
          })
          console.log('打开端口错误：' + error)
        })
      } catch (err) {
        this.testStatus = false
        this.$q.notify({
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          message: '失败',
          caption: err,
          color: 'red'
        })
        console.log('err', err)
      }
    },
    init () {
      // if (machineIdSync()) {
      //   this.scalesEdit = false
      //   this.scalesData.psc_machine_id = machineIdSync()

      //   this.$store.dispatch('scales/getConifgItem', { psc_machine_id: this.scalesData.psc_machine_id }).then((res) => {
      //     if (res.code == 200 && res.data) {
      //       this.scalesData = res.data
      //     }
      //   })
      // }
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
                this.init()
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
    },
    // 串口列表
    portList () {
      const SerialPort = window.serialport
      // console.group('portList()')
      if (SerialPort) {
        try {
          SerialPort.list().then(
            (ports) => {
              // console.log('ports', ports)
              // this.deviceList = []
              this.deviceList.push(...ports)
            },
            (err) => {
              console.error('serialport.list:', err)
            }
          )
        } catch (e) {
          console.error('SerialPort.list() failed:\n', e)
        }
      } else {
        this.deviceList = []
        console.log('SerialPort not available.')
      }
      // console.groupEnd()
    }
  }
}
</script>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
