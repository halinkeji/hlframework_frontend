<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm q-pb-md">
        <q-form ref="addDataRef" class="row q-gutter-sm">
          <q-btn color="grey" unelevated :to="{ name: 'erpTransfer' }" label="返回" />

          <q-btn
            unelevated
            color="red"
            @click="emptyStorageList()"
            label="清空列表"
           :disable="transferBufferData.length > 0 && turnData.cep_status < 2 ? false : true "
          >
          </q-btn>
          <q-btn
            color="warning"
            :disable="turnData.cep_status == 1 ? false : true"
            v-if="authorityMeta('hangup')"
            @click="hangupOrderData"
            unelevated
            label="挂起"
          />
          <q-btn
            color="primary"
            :disable="turnData.cep_status == 1 || turnData.cep_status == 5 ? false : true"
            v-if="authorityMeta('save')"
            @click="saveOrderData"
            unelevated
            label="保存"
          />
          <q-btn
            color="primary"
            :disable="turnData.cep_status == 1 ? false : true"
            v-if="authorityMeta('confirm')"
            @click="confirmOrderData"
            unelevated
            label="确认"
          />
          <q-btn
            color="primary"
            :disable="turnData.cep_status == 2 ? false : true"
            v-if="authorityMeta('audit')"
            @click="auditOrderData"
            unelevated
            label="审核"
          />
          <q-btn
            color="negative"
            :disable="turnData.cep_status == 3 ? false : true"
            v-if="authorityMeta('revoke')"
            @click="cancelAudit"
            unelevated
            label="取消审核"
          />
          <q-btn
            color="red"
            :disable="turnData.cep_status == 2 ? false : true"
            v-if="authorityMeta('cancel')"
            @click="cancelOrderConfirmData"
            unelevated
            label="取消确定"
          />
          <q-btn
            color="red"
            :disable="turnData.cep_status == 1 ? false : true"
            v-if="authorityMeta('close')"
            @click="closeOrderData"
            unelevated
            label="作废"
          />

          <q-btn color="green" @click="batchImport()" unelevated v-if="turnData.cep_status < 2">Xlxs 文件批量导入</q-btn>
          <q-btn
            unelevated
            v-if="authorityMeta('selectGoods') && turnData.cep_status == 1"
            color="primary"
            @click="selectBut()"
            label="选择商品"
          ></q-btn>
          <div class="col-12 col-md-2" v-if="turnData.cep_status < 2">
            <q-input dense outlined v-model="searchValue" label="请输入编码" />
          </div>
          <q-btn
            color="positive"
            unelevated
            label="添加商品"
            v-if="authorityMeta('code') && turnData.cep_status == 1"
            :disable="searchValue == '' ? true : false"
            @click="addItemData(searchValue)"
          />
          <q-btn
            color="primary"
            unelevated
            @click="exportCsv"
            label="导出Csv文件"
            :disable="transferBufferData.length == 0 && transfer_order_id < 1"
          />

          <q-btn color="info" unelevated @click="erpPrint" label="打印" v-if="transferBufferData.length > 0 && transfer_order_id > 0" />
          <q-space />
          <q-btn flat color="black" icon="dialpad">
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item tag="label" v-ripple v-for="(item, key) in columnDefs" :key="key">
                  <q-item-section side top>
                    <q-checkbox v-model="sideBarColumn" @input="changeShowColumn" :val="item.headerName" />
                  </q-item-section>

                  <q-item-section v-if="item.headerName">
                    <q-item-label>{{ item.headerName }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-form>
      </div>

      <div class="col-shrink bg-white q-pb-md q-gutter-sm">

        <q-form ref="erpInRef" class="row" v-if="turnData && turnData.cep_contract_number">
          <div class="col-2">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ turnData.cep_contract_number }}</q-item-label>
                <q-item-label caption lines="2">调拨单据号</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ turnData.inDepot ? turnData.inDepot.cd_name : '' }}</q-item-label>
                <q-item-label caption lines="2">入库仓库</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ turnData.inDepot ? turnData.outDepot.cd_name : '' }}</q-item-label>
                <q-item-label caption lines="2">出库仓库</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ turnData.cep_total_purchase_amount }}</q-item-label>
                <q-item-label caption lines="2">账单小计</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ turnData.cep_total_purchase_num }}</q-item-label>
                <q-item-label caption lines="2">总数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col" v-if="turnData.cep_status > 0">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">
                  <span v-if="turnData.cep_status == 1" class="text-primary">已保存</span>
                  <span v-if="turnData.cep_status == 2" class="text-primary">已确定</span>
                  <span v-if="turnData.cep_status == 3" class="text-positive">已审核</span>
                  <span v-if="turnData.cep_status == 4" class="text-red">已作废</span>
                  <span v-if="turnData.cep_status == 5" class="text-warning">挂起</span>
                  <span v-if="turnData.cep_status == 6" class="text-primary">已分配出库</span>
                  <span v-if="turnData.cep_status == 7" class="text-primary">已分配入库</span>
                </q-item-label>
                <q-item-label caption lines="2">单据状态</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-3">
            <q-input
              type="textarea"
              outlined
              v-model="turnData.cep_note"
              :disable="turnData.cep_status < 2 ? false : true"
              label="备注"
              dense
              :rows="1"
            />
          </div>
        </q-form>

      </div>

      <div class="col-shrink q-px-xs q-py-none full-height bg-white q-pb-sm">
        <ag-grid-vue
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center erp-turn-table full-height"
          ref="agGridTable"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="transferBufferData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :gridOptions="gridOptions"
          @first-data-rendered="onFirstDataRendered"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :context="context"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :localeText="localeText"
        >
        </ag-grid-vue>
      </div>

      <upload-table-purchase v-if="uploadStatus" ref="returnTypes" @closeUpload="uploadTable"></upload-table-purchase>

      <hl-erp-print ref="erpPrintRef" v-show="erpPrintStatus" @getSelectedGoodsData="erpPrintStatus = false"></hl-erp-print>
      <hl-specification-tree-erp
        ref="specificationTree"
        v-if="showGoodsList"
        @getSelectedGoodsData="getSelectedGoodsData"
        @closeDialog="showGoodsList = false"
      ></hl-specification-tree-erp>
    </div>
  </q-page>
</template>
<script>
import PageButton from './PageButton'
export default {
  name: 'AddTransfer',
  components: {
    PageButton
  },
  data () {
    return {
      context: null,
      showGoodsList: false,
      addButtonDisabled: false,
      erpPrintStatus: false,
      gridOptions: {},
      transferBufferData: [],
      turnData: {
        cep_contract_number: '',
        cep_type: 1,
        cep_order_type: 1,
        cep_status: 0,
        cep_transfer_in_depot_id: '',
        cep_transfer_out_depot_id: '',
        cep_total_purchase_amount: '',
        cep_total_purchase_num: '',
        cep_note: ''
      },
      searchValue: '',
      defaultColDef: {
        rowDragManaged: true,
        sortable: true
      },
      columnDefs: [],
      sideBarColumn: [],
      uploadStatus: false,
      localeText: this.$ag_grid_localeText,
      transfer_order_id: ''
    }
  },

  created () {
    this.context = this
  },
  mounted () {
    this.restColumnData()
  },
  computed: {},
  methods: {
    restColumnData () {
      const columnData = [
        {
          headerName: '#',
          width: this.nowpx(0.04) + 'px',
          pinned: 'left',
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null
          }
        },
        {
          headerName: '商品条码',
          field: 'epd_skc_code',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '商品名称 ',
          field: 'epd_archives_name',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '颜色 ',
          field: 'epd_color_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '尺码 ',
          field: 'epd_size_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '现有库存',
          field: 'epd_turn_before_number',
          width: this.nowpx(0.08) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '调拨数量',
          field: 'epd_quantity',
          width: this.nowpx(0.08) + 'px',
          editable: (p) => {
            return !p.data.showEdit && this.turnData.cep_status < 2
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber,
          comparator: (a, b) => a - b
        },
        {
          headerName: '商品单价',
          field: 'epd_price',
          width: this.nowpx(0.08) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '小计',
          field: 'epd_cash_amount',
          width: this.nowpx(0.08) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '备注',
          field: 'epd_note',
          editable: true,
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '操作',
          field: 'PageButton',
          cellRendererFramework: 'PageButton',
          width: this.nowpx(0.06) + 'px'
        }
      ]
      this.gridOptions.api.setColumnDefs(columnData)
      this.columnDefs = columnData
      this.sideBarColumn = this.columnDefs.map((x) => {
        return x.headerName
      })

      if (this.$route.query.id) {
        this.transfer_order_id = this.$route.query.id
        this.getItem()
      }
    },
    changeShowColumn () {
      this.gridOptions.api.setColumnDefs([])
      this.$nextTick(() => {
        const columnDefs = this.columnDefs
        const sideBarColumn = this.sideBarColumn
        const newAgColumnDefs = []
        columnDefs.forEach(function (value) {
          if (_.indexOf(sideBarColumn, value.headerName) >= 0) {
            newAgColumnDefs.push(value)
          }
        })
        this.gridOptions.api.setColumnDefs(newAgColumnDefs)
      })
    },

    hangupOrderData () {
      this.saveDataOperate('挂起', 5)
    },

    saveOrderData () {
      this.saveDataOperate('保存', 1)
    },

    confirmOrderData () {
      this.saveDataOperate('确认', 2)
    },

    auditOrderData () {
      this.saveDataOperate('审核', 3)
    },

    cancelOrderConfirmData () {
      this.saveDataOperate('取消确定', -2)
    },

    closeOrderData () {
      this.saveDataOperate('作废', 4)
    },

    cancelAudit () {
      this.saveDataOperate('取消审核', -3)
    },

    saveDataOperate (text, cepStatus) {
      if (this.transferBufferData.length <= 0) {
        this.$q.notify({
          message: '注意',
          caption: '请选择调拨商品!',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          cancel: true,
          message: text + '调拨单, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            transfer_order_id: this.transfer_order_id,
            ...this.turnData,
            cepStatus,
            transferBufferData: this.transferBufferData
          }
          this.$store
            .dispatch('erpTransfer/changeTransferOrder', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: text + '成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.getItem()
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
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
            })
        })
    },

    uploadTable () {
      this.uploadStatus = false
      this.getItem()
    },
    batchImport () {
      this.uploadStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.returnTypes.receiveType('transfer', this.transfer_order_id)
        }, 500)
      })
    },

    getItem () {
      const obj = {
        id: this.transfer_order_id
      }
      this.$store
        .dispatch('erpTransfer/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.turnData = res.data.turnData && res.data.turnData.id ? res.data.turnData : {}
            this.transferBufferData = res.data.transferBufferData && res.data.transferBufferData.length > 0 ? res.data.transferBufferData : []

            this.$nextTick(() => {
              this.getDataColumnSum()
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
        })
    },

    changeNumber (p) {
      if (!p.newValue || p.newValue == p.oldValue) {
        return false
      }
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/

      if (!regu.test(data.epd_quantity)) {
        this.$q.notify({
          message: '注意',
          caption: '请输入正整数！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
        data.epd_quantity = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
      }

      data.epd_cash_amount = this.formatAmount(data.epd_price * data.epd_quantity)
      data.currentDepotId = this.turnData.cep_transfer_out_depot_id
      this.$store
        .dispatch('erpTransfer/editBufferData', data)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '修改成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })

            itemsToUpdate.push(data)
            p.api.applyTransaction({ update: itemsToUpdate })
            this.$nextTick(() => {
              this.getDataColumnSum()
            })
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            this.getItem()
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
          this.getItem()
        })
    },

    getDataColumnSum () {
      this.turnData.cep_total_purchase_num = 0
      this.turnData.cep_total_purchase_amount = 0

      const tableData = this.transferBufferData
      let inTotalNum = 0
      let inTotalAmount = 0
      tableData.forEach((item, index) => {
        if (this.formatAmount(item.epd_quantity)) {
          inTotalNum = this.formatAmount(inTotalNum) + this.formatAmount(item.epd_quantity)
        }
        if (this.formatAmount(item.epd_cash_amount)) {
          inTotalAmount = this.formatAmount(inTotalAmount) + this.formatAmount(item.epd_cash_amount)
        }
      })
      this.turnData.cep_total_purchase_num = this.formatAmount(inTotalNum)
      this.turnData.cep_total_purchase_amount = this.formatAmount(inTotalAmount)
    },

    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      const that = this
      if (data && data.length > 0) {
        setTimeout(() => {
          const obj = {
            bufferDatas: data,
            transfer_order_id: this.transfer_order_id,
            currentDepotId: this.turnData.cep_transfer_out_depot_id
          }
          that.addGoodsInBufferData(obj)
        }, 500)
      }
    },

    addItemData (searchValue) {
      if (searchValue) {
        const obj = {
          goodsCode: searchValue,
          transfer_order_id: this.transfer_order_id,
          currentDepotId: this.turnData.cep_transfer_out_depot_id
        }
        this.addGoodsInBufferData(obj)
      }
    },

    addGoodsInBufferData (data) {
      this.$store
        .dispatch('erpTransfer/addGoodsInBuffer', data)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '成功添加' + (res.data || 0) + '条商品',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })

            this.searchValue = ''
            this.getItem()
          } else {
            this.$q.notify({
              message: '添加失败',
              caption: res.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.searchValue = ''
          }
        })
        .catch((error) => {})
    },

    selectBut () {
      if (this.turnData.cep_transfer_in_depot_id <= 0) {
        this.$q.notify({
          message: '注意',
          caption: '请重新选择调入仓库!',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      this.showGoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType(1)
        }, 500)
      })
    },
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
    },

    emptyStorageList () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: '确定清空调拨列表',
          cancel: true
        })
        .onOk(() => {
          this.$store
            .dispatch('erpTransfer/clearBufferData', {
              transfer_order_id: this.transfer_order_id
            })
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '清空成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.getItem()
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
        })
    },

    // 格式化数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    exportCsv () {
      this.gridOptions.api.exportDataAsCsv({
        fileName: this.turnData.cep_contract_number + '-调拨单详情'
      })
    },
    erpPrint () {
      if (this.transferBufferData.length > 0) {
        const columnDefs = this.columnDefs
        const sideBarColumn = this.sideBarColumn
        const newAgColumnDefs = []
        columnDefs.forEach(function (value) {
          if (_.indexOf(sideBarColumn, value.headerName) >= 0) {
            newAgColumnDefs.push(value)
          }
        })
        const sideBarColumns = newAgColumnDefs.map((item) => {
          return {
            type: 'text',
            name: item.field,
            value: item.headerName
          }
        })
        this.erpPrintStatus = true
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.erpPrintRef.getInquireType(sideBarColumns, this.transfer_order_id, 'transfer', this.turnData)
          }, 500)
        })
      }
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
<style>
.erp-turn-table .cell-span-erp-turn {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
