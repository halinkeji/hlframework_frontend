<template>
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">

      <div class="col-shrink  bg-white q-px-xs full-height bg-grey-2" >
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="deductCountList"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
          :localeText="localeText"
          :context="context"
          :suppressCellSelection="true"
        ></ag-grid-vue>
      </div>

    </div>
</template>
<script>

export default {
  name: 'deductCount',
  components: { },
  data () {
    return {
      printInvoiceStatus: true,
      deductCountList: [],

      memberId: 0,

      gridOptions: {},
      context: '',
      columnDefs: [
        {
          headerName: '消费项目',
          field: 'mrc_goodsName',
          filter: false,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          width: this.nowpx(0.4) + 'px',
          valueGetter: function (p) {
            return p.data.mrc_goodsName + (p.data.mrc_speName ? '-' + p.data.mrc_speName : '')
          }
        },
        {
          headerName: '可用次数',
          field: 'mrc_count',
          width: this.nowpx(0.1) + 'px',
          filter: false
        },

        {
          headerName: '到期时间',
          field: 'mrc_endTime',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: this.expireDate
        },
        {
          headerName: '使用规则',
          filter: false,
          valueGetter: this.rulesUse,
          width: this.nowpx(0.16) + 'px'
        }

      ],

      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      localeText: this.$ag_grid_localeText,
      deductCounts: 0,
      totalCount: 0
    }
  },

  mounted () {},
  created () {
    this.context = this
  },
  watch: {},
  computed: {},
  methods: {
    init (memberId) {
      this.memberId = memberId
      this.$nextTick(() => {
        this.getListData()
      })
    },

    // 获取次卡列表
    getListData () {
      const obj = {
        mId: this.memberId,
        getType: 'all'
      }
      this.$store
        .dispatch('deductCount/getListData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.deductCountList = res.data

            this.$nextTick(() => {
              this.totalCountData()
            })
          }
        })
        .catch((error) => {})
    },
    editCount (data) {
      this.$refs.integralSetEdit.openEditDialog(data)
    },
    // 扣次
    deductionBut () {
      const obj = {
        mId: this.memberId,
        printInvoiceStatus: this.printInvoiceStatus,
        deductCountList: this.deductCountList
      }
      this.$store
        .dispatch('deductCount/addinvoice', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data && res.data.errorArray.length > 0) {
              res.data.errorArray.forEach((i, k) => {
                this.$q.notify({
                  progress: true,
                  position: 'top',
                  color: 'white',
                  textColor: 'primary',
                  message: i,
                  multiLine: true,
                  timeout: 3500
                })
              })
            } else {
              this.$q.notify({
                message: '成功',
                caption: '计次消费成功',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
            }

            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
            this.getListData()
            this.$nextTick(() => {
              this.totalCountData()
            })
          } else {
            this.$q.notify({
              message: '失败',
              caption: '计次消费失败，请重新操作！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '注意',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    totalCountData () {
      let totalCount = 0
      let deductCounts = 0
      this.deductCountList.forEach(function (item) {
        totalCount += parseInt(item.mrc_count)
        deductCounts += parseInt(item.mrc_deductcount) > 0 ? parseInt(item.mrc_deductcount) : 0
      })
      this.deductCounts = deductCounts
      this.totalCount = totalCount
    },

    expireDate (p) {
      if (parseInt(p.data.mrc_endTime) >= 2147457847) {
        return '永久有效'
      } else {
        return this.$q_date.formatDate(p.data.mrc_endTime * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },

    // 使用规则
    rulesUse (p) {
      if (parseInt(p.data.mrc_limitTime) == 1) {
        return '不限制规定时间使用次数'
      } else if (parseInt(p.data.mrc_limitTime) == 2) {
        return '使用限制为每年可使用' + p.data.mrc_limitCount + '次'
      } else if (parseInt(p.data.mrc_limitTime) == 3) {
        return '使用限制为每季度可使用' + p.data.mrc_limitCount + '次'
      } else if (parseInt(p.data.mrc_limitTime) == 4) {
        return '使用限制为每月可使用' + p.data.mrc_limitCount + '次'
      } else if (parseInt(p.data.mrc_limitTime) == 5) {
        return '使用限制为每周可使用' + p.data.mrc_limitCount + '次'
      } else {
        return '使用限制为每天可使用' + p.data.mrc_limitCount + '次'
      }
    },

    // 列表列宽自适应
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    }
  }
}
</script>
