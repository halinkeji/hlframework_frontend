<template></template>

<script>
export default {
  name: 'print-test',
  props: {
    landscape: {
      type: Boolean,
      default: false
    },
    dpi: {
      type: String,
      default: 'vertical'
    }
  },
  data () {
    return {

    }
  },
  created () {
    //  关于打印机的依赖 ，选取的是https://github.com/Hubertformin/electron-pos-printer#readme
    if (process.env.MODE === 'electron') {
      const { remote } = require('electron')
      const { PosPrinter } = remote.require('electron-pos-printer')

      const webContents = remote.getCurrentWebContents()
      const printers = webContents.getPrinters() // list the printers
    }
  },
  computed: {},
  methods: {
    startPrinter (printerDataList) {
      console.log('printerDataList', printerDataList)
      // return false
      if (process.env.MODE === 'electron') {
        const { remote } = require('electron')
        const { PosPrinter } = remote.require('electron-pos-printer')

        try {
          if (printerDataList && printerDataList.length > 0) {
            for (let i = 0; i < printerDataList.length; i++) {
              const printInfo = printerDataList[i]
              const printParams = printerDataList[i].print_params

              if (
                (printInfo.brand == 'wuba' || printInfo.model == 'A4') &&
                printInfo.templet_content &&
                printParams &&
                printParams.cp_local_printer
              ) {
                PosPrinter.print(printInfo.templet_content, {
                  preview: printInfo.preview,

                  margin: this.margin,
                  copies: printInfo.print_quantity,
                  printerName: printParams.cp_local_printer,
                  timeOutPerLine: 400,
                  silent: true,
                  // pageSize: { height: 301000, width: 71000 },
                  pageSize: printInfo.pageSize, // page size > 352微米
                  dpi: this.dpi,
                  landscape: this.landscape
                })
                  .then((res) => {
                    console.log('xx', res)
                  })
                  .catch((error) => {
                    console.error(error)
                  })
              }
            }
          }
        } catch (err) {
          console.log('err', err)
        }
      }
    }

  }
}
</script>
