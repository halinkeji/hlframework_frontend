<template>
  <div class="flex flex-wrap">
    <!-- 规格弹出框 -->
    <q-dialog v-model="specificationPopup" persistent>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.8 : 0.4)) + 'px',
          'max-width': parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.8 : 0.4)) + 'px',
        }"
      >
        <q-toolbar>
          <q-toolbar-title class="text-center"> 商品规格</q-toolbar-title>
        </q-toolbar>
        <q-separator />

        <q-card-section class="q-pa-none">
          <q-table
            grid
            :card-container-class="cardContainerClass"
            :data="specificationData"
            :columns="columns"
            row-key="id"
            hide-header
            hide-bottom
            class="full-width"
            hide-pagination
            :pagination="page"
          >
            <template v-slot:item="props">
              <div class="q-pa-xs col-xs-12 col-sm-6 col-md-2">
                <q-card
                  @click="currentGoodsSpecInfo = props.row"
                  :flat="parseInt(currentGoodsSpecInfo.id) != parseInt(props.row.id)"
                  :class="{ 'bg-primary text-white': parseInt(currentGoodsSpecInfo.id) == parseInt(props.row.id) }"
                  bordered
                >
                  <q-card-section class="q-pa-xs">
                    <div class="text-subtitle2 ellipsis">{{ props.row.sl_title }}</div>
                    <div class=" text-dark">
                      {{ props.row.sl_barCode }}
                    </div>

                    <q-item-label :class="{ 'text-white': parseInt(currentGoodsSpecInfo.id) == parseInt(props.row.id) }" class="text-dark row">
                      {{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ props.row.sl_sellingPrice }}

                      <div>库存: {{ props.row.sl_inventory }}</div>
                    </q-item-label>
                  </q-card-section>
                </q-card>
              </div>
            </template>
          </q-table>
        </q-card-section>
        <q-card flat>
          <q-form ref="consumeFormRef">
            <q-toolbar class="text-center">
              <q-toolbar-title> 请将{{ currentGoodsInfo.goo_name }}/{{ currentGoodsSpecInfo.sl_title }}放到秤上 </q-toolbar-title>
            </q-toolbar>
            <q-card-section class="q-py-none text-center">
              <div class="text-h4">{{ currentGoodsSpecInfo.sl_sellingPrice }}</div>
              <div class="text-caption text-grey">单价（{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit }}/千克）</div>
            </q-card-section>

            <q-card-section class="q-py-none row">
              <div class="col-6">
                <div class="col-12 q-px-sm">
                  <q-input outlined dense readonly class="q-mb-sm" v-model="old_consumeNumber" label="原重量/KG" />
                </div>
                <div class="col-12 q-px-sm">
                  <q-input
                    outlined
                    dense
                    ref="consumeNumberRef"
                    :rules="[(val) => val > 0 || '请输入正确的重量']"
                    v-model="chud_consumeNumber"
                    label="当前重量/KG"
                    hide-bottom-space
                    class="q-mb-sm"
                  />
                </div>
                <div class="col-12 q-px-sm">
                  <q-input outlined dense readonly v-model="amountSubtotal" label="小计" />
                </div>
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
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'WeighSpecComponents',
  components: {},
  data () {
    return {
      specificationPopup: false,
      chud_consumeNumber: 0,
      old_consumeNumber: 0,
      amountSubtotal: 0,
      serial_port: {},
      specificationData: [],
      currentGoodsSpecInfo: {},
      currentGoodsInfo: {},
      columns: [
        { name: 'id', label: 'id', field: 'id' },
        { name: 'sl_title', label: '名称', field: 'sl_title' },
        { name: 'sl_barCode', label: '条码', field: 'sl_barCode' },
        { name: 'sl_sellingPrice', label: '售价', field: 'sl_sellingPrice' },
        { name: 'sl_inventory', label: '库存', field: 'sl_inventory' }
      ],
      page: {
        pageTotal: 0,
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 18
      }
    }
  },

  mounted () {},
  created () {},
  computed: {
    // 处理表格自适应
    cardContainerClass () {
      // if (this.$q.screen.gt.xs) {
      //   return 'grid-masonry grid-masonry--' + (this.$q.screen.gt.sm ? '3' : '2')
      // }

      return void 0
    }
  },
  watch: {
    chud_consumeNumber () {
      this.computeAmountSubtotal()
    }
  },
  methods: {
    confirmWeighResult () {
      this.$refs.consumeFormRef.validate().then((success) => {
        if (success) {
          this.closePort()
          this.specificationPopup = false
          this.currentGoodsSpecInfo.chud_consumeNumber = this.chud_consumeNumber
          this.$emit('confirmWeighResult', this.currentGoodsSpecInfo, 2, this.currentGoodsInfo)
        }
      })
    },
    cancelWeighResult () {
      this.closePort()
      this.specificationPopup = false
      this.$emit('cancelWeighResult')
    },

    // 规格商品
    specificationBut (val, data) {
      const obj = {
        goods_id: val
      }
      this.$store
        .dispatch('consume/getSpecification', obj)
        .then((res) => {
          if (res.data) {
            const that = this
            this.specificationPopup = true
            this.specificationData = res.data
            this.currentGoodsInfo = data

            this.$nextTick(() => {
              if (res.data && res.data.length) {
                this.currentGoodsSpecInfo = res.data[0]
              }
              if (that.$refs.consumeNumberRef) {
                that.$refs.consumeNumberRef.focus()
                const systemLocal = LocalStorage.getItem('myonestore_system_local')
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
            })
          }
        })
        .catch((error) => {})
    },

    computeAmountSubtotal () {
      if (this.currentGoodsSpecInfo) {
        this.amountSubtotal = this.formatAmount(
          this.formatAmount(this.chud_consumeNumber) * this.formatAmount(this.currentGoodsSpecInfo.sl_sellingPrice)
        )
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
        console.log('this.chud_consumeNumber', that.formatAmount(that.chud_consumeNumber))

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

      const systemLocal = LocalStorage.getItem('myonestore_system_local')
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
