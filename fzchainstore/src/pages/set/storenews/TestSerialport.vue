<template>
  <q-page
        class="flex column"
        style="align-items: center;"
    >
        <section class="q-mt-md">
            SerialPort: {{ serialPortAvailable }}
        </section>
        <q-btn
            v-ripple
            label="刷新串口列表"
            @click="portList()"
        />
        <section class="q-mt-md">
            <div
                v-for="(device, index) in deviceList"
                :key="index"
            >
                <pre>{{ device }}</pre>
            </div>
        </section>

        <q-btn
            v-ripple
            label="打开串口"
            @click="openPort()"
        />

        <q-btn
            v-ripple
            label="关闭串口"
            @click="closePort()"
        />

        <q-btn
            v-ripple
            label="转码"
            @click="decodeRes()"
        />
        <q-btn
            v-ripple
            label="称重"
            @click="getWeighing()"
        />
        <q-btn
            v-ripple
            label="测试计算"
            @click="testNumber()"
        />
        <q-input outlined v-model="portWeight"  :dense="false" readonly label="称重结果"/>
    </q-page>
</template>
<script>
// import Decimal from 'decimal.js'
import { machineIdSync } from 'node-machine-id'
export default {
  name: 'sss',
  components: {

  },
  data () {
    return {
      serial_port: {},
      portWeight: 0,

      serialPortAvailable: false,
      deviceList: []

    }
  },
  mounted () {
    // const printerList = this.getEscposPrinterList()
    // console.log('printerList',printerList)

    this.portList()

    if (window.serialport) {
      this.serialPortAvailable = true
    }
  },
  computed: {},
  created () {
    // 加密 机器ID
    console.log('machineIdSync', machineIdSync())
    // 未加密 机器ID
    console.log('machineIdSync(true)', machineIdSync(true))
  },
  methods: {
    // 关闭串口 A
    closePort () {
      console.group('closePort()')
      const that = this
      this.serial_port.close(function (error) {
        if (error) {
          console.log('关闭串口失败')
        } else {
          console.log('关闭串口成功')
          console.log('最后称重结果：', that.portWeight)
        }
      })
    },

    // 打开串口
    openPort (name) {
      const SerialPort = window.serialport
      const option = {
        baudRate: 9600, // 波特率
        dataBits: 8, // 数据位
        parity: 'none', // 奇偶校验
        stopBits: 1, // 停止位
        flowControl: false,
        autoOpen: false
      }
      console.group('openPort()')
      try {
        this.port = new SerialPort('COM1', option)
        const _port = this.port
        // 发送指令01，以十六进制发送
        const senddata = [0x01, 0x0d, 0x0a]

        _port.open(function (err) {
          if (err) {
            return console.log('打开串口失败: ', err.message)
          }
          console.log('打开端口成功，正在监听数据中')
          _port.write(senddata, function (err) {
            if (err) {
              return console.log('发送指令失败: ', err.message)
            }
            console.log('发送指令成功')
            // _port.removeAllListeners()
            let i = 0
            _port.on('data', function (data) {
              console.log(i++ + ' - 数据流:', data)
            })
          })
        })
      } catch (err) {
        console.log('err', err)
      }
      console.groupEnd()
    },

    // 串口列表
    portList () {
      const SerialPort = window.serialport
      console.group('portList()')
      if (SerialPort) {
        try {
          SerialPort.list().then(
            ports => {
              console.log('ports', ports)
              this.deviceList = []
              this.deviceList.push(...ports)
            },
            err => {
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
      console.groupEnd()
    },
    // 解码
    decodeRes () {
      console.group('decodeRes()')
      const buf_data = [1, 2, 83, 32, 48, 53, 46, 51, 53, 50, 107, 103, 96, 3, 4, 0]
      const data = new Buffer(buf_data, 'utf-8').toString()
      console.log('解码结果：', data)
    },
    // 商品称重 A
    getWeighing () {
      console.group('getWeighing()')
      const SerialPort = window.serialport
      try {
        // PS：port_com和option均是从数据库内拿到得串口配置信息
        const port_com = 'COM1'
        const option = {
          baudRate: 9600, // 波特率
          dataBits: 8, // 数据位
          parity: 'none', // 奇偶校验
          stopBits: 1, // 停止位
          flowControl: false,
          autoOpen: false
        }
        this.serial_port = new SerialPort(port_com, option, false)
        this.serial_port.open((error) => {
          if (!error) {
            console.log('打开端口成功，正在监听数据中')
          } else {
            console.log('打开端口' + port_com + '错误：' + JSON.stringify(error))
          }
        })

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
              this.portWeight = new Decimal(num / 1000000000).toFixed(3)
              break
            case '2':
              // 顶尖计算格式
              this.portWeight = new Decimal(num / 1000).toFixed(3)
              break
            default:
              // 其他通用计算格式
              this.portWeight = new Decimal(num / 1000).toFixed(3)
              break
          }
          if (data.indexOf('U') == -1 && data.indexOf('S') == -1) {
            datas = ''
          }
        })
        console.log('datas', datas)
        console.log('this.portWeight', this.portWeight)

        // const buf = Buffer.from([0xab, 0x00000000, 0x8004, 0x0000, 0x00, 0x0000])

        // 错误监听
        this.serial_port.on('error', (error) => {
          console.log('打开端口' + port_com + '错误：' + error)
        })
      } catch (err) {
        console.log('err', err)
      }
      console.groupEnd()
    },
    // 计算测试
    testNumber () {
      console.group('testNumber()')
      const num = '00164'
      const res = this.$q_decimal(num / 1000).toFixed(3)
      console.log('res', res)
      console.groupEnd()
    },
    // 获取node-printer打印机
    getPrinterList () {
      // const printer = require('printer')
      // const list = printer.getPrinterList()
      // const res = []
      // list.forEach(item => res.push(item.name))
      // return res
    },

    // 获取escpos 打印机
    getEscposPrinterList () {
      // const escpos = require('escpos')
      // escpos.USB = require('escpos-usb')
      // const usbDevice = new escpos.USB();
      // const usbPrinter = new escpos.Printer(usbDevice);
      // return usbPrinter
    }

  }
}
</script>
