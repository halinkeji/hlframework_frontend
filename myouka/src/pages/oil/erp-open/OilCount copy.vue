<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-xs row">
      <div class="col-12 col-md-2  q-mr-sm" v-if="is_main_store">
        <q-select
          label="查询店铺"
          v-model="selectStoreData"
          option-value="id"
          option-label="name"
          multiple
          emit-value
          map-options
          dense
          outlined
          :options="libInStoreList"
        />
      </div>
      <div class="col-12 col-xs-6 col-sm-2">
        <q-input outlined dense  v-model="text" label="可搜索油品名称" />
      </div>

      <q-btn  color="primary" unelevated @click="getErpTotal" label="搜索" />
      <q-btn color="grey" @click="clearBut"  unelevated label="重置" />
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="erpTotal"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :localeText="localeText"
        :context="context"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="40"
        @first-data-rendered="onFirstDataRendered"
        rowSelection="multiple"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
      ></ag-grid-vue>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OilCount',
  components: {},
  data () {
    return {
      tab: '1',
      localeText: this.$ag_grid_localeText,
      addPoppupStatus: false,
      text: '',
      context: '',
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      gridOptions: {},
      columnDefs: [
        {
          headerName: '油品',
          field: 'op_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '开油金额',
          field: 'lastTotalPrice',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '开油（/吨）',
          field: 'open',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '总借回',
          field: 'turnLend',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '总借出',
          field: 'turnReturn',
          width: this.nowpx(0.1) + 'px'
        }
      ],
      erpTotal: [],
      libInStoreList: [],
      selectStoreData: []
    }
  },
  created () {
    this.getErpTotal()
    this.context = this
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    getErpTotal () {
      const obj = {
        text: this.text,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('openoil/getOilCount', obj)
        .then((res) => {
          if (res.code == 200) {
            this.erpTotal = res.data ? res.data : {}
            if (this.erpTotal.length > 0) {
              setTimeout(() => {
                this.setTopTabel(res.data)
              }, 200)
            }
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
    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          op_name: '数据合计',
          show_status: true,
          lastTotalPrice: '',
          open: '',
          turnLend: '',
          turnReturn: ''
        }
      ])
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },

    countColumnData (data = [], condition = []) {
      if (data.length > 0 && condition.length > 0) {
        const rowData = []
        condition.forEach((i, k) => {
          const oneRowData = {}

          for (var j in i) {
            oneRowData[j] = 0
            if (!i[j]) {
              data.forEach((value, key) => {
                oneRowData[j] += this.formatAmount(value[j])
                oneRowData[j] = this.formatAmount(oneRowData[j])
              })
            } else {
              oneRowData[j] = i[j]
            }
          }

          rowData.push(oneRowData)
        })
        return rowData
      }
    }, // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    clearBut () {
      this.text = ''
      this.selectStoreData = []
      this.getErpTotal()
    }
  }
}
</script>

<style></style>
