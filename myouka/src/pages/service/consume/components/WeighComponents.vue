<template>
  <div class="flex flex-wrap">
    <q-dialog v-model="weighComponentsDialog" persistent>
      <q-card
        flat
        :style="{
          width: parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.6 : 0.4)) + 'px',
          'max-width': parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.6 : 0.4)) + 'px',
        }"
      >
        <q-form ref="consumeFormRef">
          <q-toolbar>
            <q-toolbar-title class="text-center"> 请将{{ otherValue.goo_name }}放到秤上</q-toolbar-title>
          </q-toolbar>
          <q-card-section>
            <div class="text-h4">{{ otherValue.goo_listPrice }}</div>
            <div class="text-caption text-grey">单价（{{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneyUnit }}/千克）</div>
          </q-card-section>
          <q-card-section class="row">
            <div class="col-6">
              <q-input outlined dense readonly v-model="old_consumeNumber" class="q-mb-sm" label="原重量/KG" />
              <q-input
                outlined
                dense
                :rules="[(val) => val > 0 || '请输入正确的数量']"
                ref="consumeNumberRef"
                v-model="chud_consumeNumber"
                label="当前重量/KG"
                hide-bottom-space
                class="q-mb-sm"
              />
              <q-input outlined dense readonly v-model="amountSubtotal" label="小计" />
            </div>
            <div class="col-6">
              <hl-keyboard
                @changeNumber="
                  (v) => {
                    chud_consumeNumber = v
                  }
                "
                :decimal="true"
              />
            </div>
          </q-card-section>

          <q-card-actions align="around">
            <q-btn outline rounded class="q-px-md" @click="cancelWeighResult" color="blue-grey">取 消</q-btn>
            <q-btn unelevated rounded class="q-px-md" @click="confirmWeighResult" color="primary">确 定</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'WeighComponents',
  components: {},
  data () {
    return {
      weighComponentsDialog: false,
      otherValue: {},
      otherType: 0,
      chud_consumeNumber: 0,
      old_consumeNumber: 0,
      amountSubtotal: 0,
      serial_port: {}
    }
  },
  watch: {
    chud_consumeNumber () {
      this.computeAmountSubtotal()
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    // 套餐商品详情
    init (val, type) {
      const that = this
      this.weighComponentsDialog = true
      this.otherValue = val
      this.otherType = type
      if (val && val.chud_consumeNumber) {
        this.old_consumeNumber = this.otherValue.chud_consumeNumber
      }
      // this.$nextTick(() => {
      setTimeout(() => {
        if (that.$refs.consumeNumberRef) {
          that.$refs.consumeNumberRef.focus()
          const systemLocal = LocalStorage.getItem('myouka_plugins_local')
          if (systemLocal && systemLocal.eWeighing && parseInt(systemLocal.eWeighing.psc_status) == 1) {
            const SerialPort = window.serialport
            const weighingConfigInfo = systemLocal.eWeighing
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
                  console.log('打开端口成功，正在监听数据中')
                  that.getWeighing()
                } else {
                  console.log('打开端口错误：' + JSON.stringify(error))
                }
              })
            } catch (err) {
              console.log('err', err)
            }
          }
        }
      }, 500)

      // })
    },
    confirmWeighResult () {
      this.$refs.consumeFormRef.validate().then((success) => {
        if (success) {
          this.closePort()
          this.weighComponentsDialog = false
          this.otherValue.chud_consumeNumber = this.chud_consumeNumber
          this.$emit('confirmWeighResult', this.otherValue, this.otherType)
        }
      })
    },

    cancelWeighResult () {
      this.closePort()
      this.weighComponentsDialog = false
      this.$emit('cancelWeighResult')
    },

    computeAmountSubtotal () {
      if (this.otherValue) {
        this.amountSubtotal = this.formatAmount(this.formatAmount(this.chud_consumeNumber) * this.formatAmount(this.otherValue.goo_listPrice))
      }
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    // 商品称重 A
    getWeighing () {
      // console.group('getWeighing()')
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
          switch (2) {
            case '1':
              // 大华计算格式
              var consumeNumber = this.$q_decimal(num / 1000000000).toFixed(3)
              if (consumeNumber != that.chud_consumeNumber) {
                that.chud_consumeNumber = consumeNumber
              }

              break
            case '2':
              // 顶尖计算格式
              var consumeNumber = this.$q_decimal(num / 1000).toFixed(3)
              if (consumeNumber != that.chud_consumeNumber) {
                that.chud_consumeNumber = consumeNumber
              }
              break
            default:
              // 其他通用计算格式
              var consumeNumber = this.$q_decimal(num / 1000).toFixed(3)
              if (consumeNumber != that.chud_consumeNumber) {
                that.chud_consumeNumber = consumeNumber
              }
              break
          }
          if (data.indexOf('U') == -1 && data.indexOf('S') == -1) {
            datas = ''
          }
        })
        console.log('datas', datas)
        console.log('this.chud_consumeNumber', that.chud_consumeNumber)

        // const buf = Buffer.from([0xab, 0x00000000, 0x8004, 0x0000, 0x00, 0x0000])

        // 错误监听
        this.serial_port.on('error', (error) => {
          console.log('打开端口错误：' + error)
        })
      } catch (err) {
        console.log('err', err)
      }
    },

    // 关闭串口 A
    closePort () {
      console.group('closePort()')
      const that = this

      const systemLocal = LocalStorage.getItem('myouka_plugins_local')
      if (systemLocal && systemLocal.eWeighing && parseInt(systemLocal.eWeighing.psc_status) == 1) {
        this.serial_port.close(function (error) {
          if (error) {
            console.log('关闭串口失败')
          } else {
            console.log('关闭串口成功')
            console.log('最后称重结果：', that.chud_consumeNumber)
          }
        })
        console.log('this.serial_port', this.serial_port)
      }
    }
  }
}
</script>
