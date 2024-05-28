<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.8 + 'px',
        'min-width': $q.screen.width * 0.8 + 'px',
      }"
      class="q-pa-md fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll bg-white">
        <div class="col-shrink bg-white q-px-xs q-pa-sm row q-mb-md">
          <div class="text-h6">寄存记录</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="h-120">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="recordLists"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            @first-data-rendered="onFirstDataRendered"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            rowHeight="50"
            :context="context"
            rowSelection="multiple"
            :localeText="localeText"
            :stopEditingWhenGridLosesFocus="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
          ></ag-grid-vue>
        </div>
        <div class="text-h6 q-mt-xl q-mb-md">操作详情:</div>
        <div class="col-shrink  full-height">
          <ag-grid-vue
            ref="agGridTableDetail"
            :gridOptions="gridOptionsDetail"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefsDetail"
            :suppressMovableColumns="true"
            :rowData="detailLists"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            @first-data-rendered="onFirstDataRendered"
            @gridReady="onFirstDataRendered"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            rowHeight="50"
            :context="context"
            rowSelection="multiple"
            :localeText="localeText"
            :stopEditingWhenGridLosesFocus="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink q-pb-md">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pageSize"
            :total="page.pageTotal"
          ></hl-pagination>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'hyjcDetail',
  components: {},
  data () {
    return {
      showDialog: true,
      recordId: '',
      gridOptions: {},
      gridOptionsDetail: {},
      detailRemarks: '',
      context: null,
      recordLists: [],
      detailLists: [],
      columnDefs: [
        {
          headerName: '会员卡号',
          field: 'member.mem_memberCardNum',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '会员昵称',
          field: 'member.mem_memberName',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '物品名称',
          field: 'phr_name',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '剩余数量',
          field: 'phr_quantity',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '备注',
          field: 'phr_remarks',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          width: this.nowpx(0.12) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: '存入(可编辑)',
          field: 'inQuantity',
          width: this.nowpx(0.1) + 'px',
          editable: true,
          singleClickEdit: true,
          onCellValueChanged: this.setDetailData
        },
        {
          headerName: '取出(可编辑)',
          field: 'outQuantity',
          width: this.nowpx(0.1) + 'px',
          editable: true,
          singleClickEdit: true,
          onCellValueChanged: this.setDetailData
        }
      ],
      columnDefsDetail: [
        {
          headerName: '操作时间',
          field: 'created_at',
          width: this.nowpx(0.17) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: '物品名称',
          field: 'phd_name',
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: '操作前数量',
          field: 'phd_quantity',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '状态',
          field: 'phd_status',
          width: this.nowpx(0.16) + 'px',
          valueGetter: (p) => {
            if (p.data.phd_status == 1) {
              return '存入'
            } else if (p.data.phd_status == 2) {
              return '取出'
            }
          }
        },
        {
          headerName: '操作数量',
          field: 'phd_operatel_quantity',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '剩余数量',
          field: 'phd_last_quantity',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '备注',
          field: 'phd_remarks',
          width: this.nowpx(0.17) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    // 查询寄存单条记录
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('hyjc/getRecordItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.recordId = res.data.id
              res.data.inQuantity = ''
              res.data.outQuantity = ''
              this.recordLists = res.data ? [res.data] : []
              this.getDetailList()
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '操作失败',
                color: 'red'
              })
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    // 查询寄存详情
    getDetailList () {
      const obj = {
        recordId: this.recordId,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('hyjc/getDetailListData', obj)
        .then((res) => {
          this.detailLists = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    // 新增寄存详情
    setDetailData (p) {
      const data = p.data
      const reg = /^[1-9]\d*$/
      if (data.inQuantity || data.outQuantity) {
        this.$q
          .dialog({
            title: '提示',
            message: `${data.inQuantity ? '确定添加储存数量？' : '确定取出？'}`,
            cancel: true,
            persistent: true,
            prompt: {
              model: '',
              label: '备注',
              type: 'textarea',
              outlined: true
            }
          })
          .onOk((detailRemarks) => {
            if (data.inQuantity) {
              if (!reg.test(data.inQuantity)) {
                this.$q.notify({
                  message: '注意',
                  caption: '请输入正整数！',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
                this.init(this.recordId)
                return false
              }
            }
            if (data.outQuantity) {
              if (parseInt(data.phr_quantity) == 0) {
                this.$q.notify({
                  message: '注意',
                  caption: '剩余数量为0',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
                this.init(this.recordId)
                return false
              }
              if (!reg.test(data.outQuantity)) {
                this.$q.notify({
                  message: '注意',
                  caption: '请输入正整数！',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
                this.init(this.recordId)
                return false
              }
            }
            if (parseInt(data.outQuantity) > parseInt(data.phr_quantity)) {
              this.$q.notify({
                message: '提示',
                caption: '数量不足',
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.init(this.recordId)
              return false
            }
            const obj = {
              datailData: this.recordLists,
              detailRemarks: detailRemarks
            }
            this.$store.dispatch('hyjc/setDetailData', obj).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${data.inQuantity > 0 ? '物品储存成功' : '物品取出成功'}`,
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.init(this.recordId)
                this.getDetailList()
              }
            })
          })
          .onCancel(() => {
            this.init(this.recordId)
          })
      }
    },
    hideNowPage () {
      this.$emit('dataList')
    },
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 754
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    // 分页
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getDetailList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getDetailList()
    }
  }
}
</script>
<style>
.h-120{
  height: 128px;
}
</style>
