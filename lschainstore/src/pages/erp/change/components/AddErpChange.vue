<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-form ref="erpInRef" class="q-gutter-xs row">
          <q-btn color="grey" unelevated :to="{ name: 'erpChange' }" label="返回" />

          <q-btn
            color="red"
            :disable="changeBufferData.length > 1 ? false : true"
            unelevated
            label="清空"
            v-if="changeFormData.cep_status < 2"
            @click="emptyStorageList()"
          />

          <q-btn
            color="warning"
            :disable="changeFormData.cep_status == 1 ? false : true"
            @click="hangupOrderData"
            v-if="authorityMeta('hangup')"
            unelevated
            label="挂起"
          />

          <q-btn
            color="primary"
            :disable="changeFormData.cep_status == 1 || changeFormData.cep_status == 5 ? false : true"
            @click="saveOrderData"
            v-if="authorityMeta('save')"
            unelevated
            label="保存"
          />

          <q-btn
            color="primary"
            :disable="changeFormData.cep_status == 1 ? false : true"
            @click="confirmOrderData"
            v-if="authorityMeta('confirm')"
            unelevated
            label="确认"
          />
          <q-btn
            color="positive"
            :disable="changeFormData.cep_status == 2 ? false : true"
            v-if="authorityMeta('audit')"
            @click="auditOrderData"
            unelevated
            label="审核"
          />
          <q-btn
            color="negative"
            :disable="changeFormData.cep_status == 3 ? false : true"
            v-if="authorityMeta('revoke')"
            @click="cancelAudit"
            unelevated
            label="取消审核"
          />
          <q-btn
            color="red"
            :disable="changeFormData.cep_status == 2 ? false : true"
            v-if="authorityMeta('cancel')"
            @click="cancelOrderConfirmData"
            unelevated
            label="取消确定"
          />
          <q-btn
            color="primary"
            :disable="changeFormData.cep_status == 3 ? false : true"
            v-if="authorityMeta('storage')"
            @click="confirmChangeData"
            unelevated
            label="确认调整"
          />
          <q-btn
            color="red"
            :disable="changeFormData.cep_status == 1 ? false : true"
            v-if="authorityMeta('close')"
            @click="closeOrderData"
            unelevated
            label="作废"
          />
          <q-btn color="primary" unelevated @click="exportCsv" label="导出Csv文件" :disable="changeBufferData.length == 0 && change_order_id < 1" />

          <q-btn color="primary" unelevated v-if="authorityMeta('select')" label="选择商品" @click="selectBut" />

          <div class="col-12 col-md-2" v-if="changeFormData.cep_status < 2">
            <q-input  outlined @keyup.enter="addItemData(searchCode)" v-model="searchCode" label="请输入编码" dense />
          </div>

          <q-btn
            color="green"
            unelevated
            v-if="authorityMeta('code')"
            label="条码添加"
            @click="addItemData(searchCode)"
          />

          <q-btn color="info" unelevated @click="erpPrint" label="打印" v-if="changeBufferData.length > 0 && change_order_id > 0" />
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

      <div class="col-shrink q-px-sm full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table erp-change-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="changeBufferData"
          :context="context"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          :gridOptions="gridOptions"
          :defaultColDef="defaultColDef"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>

        <div class="col-shrink bg-white q-pb-md">
        <q-form ref="erpInRef" class="row">

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ changeTypeData && changeTypeData.id ? changeTypeData.ect_name : '' }}</q-item-label>
                <q-item-label caption lines="2">调整类型</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ changeFormData.cep_depot_name }}</q-item-label>
                <q-item-label caption lines="2">仓库名称</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">{{ changeFormData.cep_total_purchase_num }}</q-item-label>
                <q-item-label caption lines="2">总数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col" v-if="changeFormData.cep_status > 0">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold">
                  <span v-if="changeFormData.cep_status == 1" class="text-primary">已保存</span>
                  <span v-if="changeFormData.cep_status == 2" class="text-primary">已确定</span>
                  <span v-if="changeFormData.cep_status == 3" class="text-positive">已审核</span>
                  <span v-if="changeFormData.cep_status == 4" class="text-red">已作废</span>
                  <span v-if="changeFormData.cep_status == 5" class="text-warning">挂起</span>
                  <span v-if="changeFormData.cep_status == 6" class="text-primary">调整中</span>
                  <span v-if="changeFormData.cep_status == 7" class="text-primary">调整完成</span>
                </q-item-label>
                <q-item-label caption lines="2">单据状态</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-3">
            <q-input
              type="textarea"
              outlined
              v-model="changeFormData.cep_note"
              :disable="changeFormData.cep_status < 2 ? false : true"
              label="备注"
              dense
              :rows="2"
            />
          </div>
        </q-form>
      </div>

    </div>
    <hl-erp-print ref="erpPrintRef" v-show="erpPrintStatus" @getSelectedGoodsData="erpPrintStatus = false"></hl-erp-print>
    <hl-specification-tree-erp
      ref="specificationTree"
      v-show="showGoodsList"
      @getSelectedGoodsData="getSelectedGoodsData"
    ></hl-specification-tree-erp>
  </q-page>
</template>
<script>
import AgButton from './AgButton.vue'
export default {
  name: 'AddErpChange',
  components: {
    AgButton
  },
  data () {
    return {
      gridOptions: {},
      context: null,
      showGoodsList: false,
      erpPrintStatus: false,
      changeFormData: {
        cep_depot_id: '',
        cep_change_type_id: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_status: 0,
        cep_total_purchase_num: '',
        cep_total_shipments_quantity: '',
        cep_type: 13
      },
      depotData: [],
      components: {
        AgButton
      },
      searchCode: '',
      columnDefs: [],
      sideBarColumn: [],
      changeBufferData: [],
      change_order_id: '',
      localeText: this.$ag_grid_localeText,
      defaultColDef: {
        sortable: true,
        rowDragManaged: true
      },
      changeTypeData: {}
    }
  },
  created () {
    this.context = this
  },
  mounted () {
    this.restColumnData()
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
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
          headerName: '条码',
          field: 'epd_skc_code',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '名称',
          field: 'epd_archives_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '规格',
          field: 'epd_spe_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '调整数量',
          field: 'epd_quantity',
          editable: (p) => {
            return p.data.epd_archives_id > 0 && this.changeFormData.cep_status < 2
          },
          singleClickEdit: true,
          onCellValueChanged: this.countMethor,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '价格',
          field: 'epd_price',
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '小计',
          field: 'epd_cash_amount',
          width: this.nowpx(0.07) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '原因',
          field: 'epd_note',
          editable: true,
          singleClickEdit: true,
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgButton',
          onCellValueChanged: this.countMethor,
          width: this.nowpx(0.05) + 'px'
        }
      ]
      this.gridOptions.api.setColumnDefs(columnData)
      this.columnDefs = columnData
      this.sideBarColumn = this.columnDefs.map((x) => {
        return x.headerName
      })
      if (this.$route.query.id) {
        this.change_order_id = this.$route.query.id
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

    getItem () {
      const obj = {
        id: this.change_order_id
      }
      this.$store
        .dispatch('erpchange/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.changeFormData = res.data.changeFormData && res.data.changeFormData.id ? res.data.changeFormData : {}
            this.changeTypeData = res.data.changeTypeData && res.data.changeTypeData.id ? res.data.changeTypeData : {}

            this.changeBufferData = res.data.changeBufferData && res.data.changeBufferData.length > 0 ? res.data.changeBufferData : []

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

    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      const that = this
      if (data && data.length > 0) {
        const obj = {
          bufferDatas: data,
          change_order_id: this.change_order_id
        }
        that.addGoodsInBufferData(obj)
      }
    },

    addItemData (searchCode) {
      if (searchCode) {
        const obj = {
          goodsCode: searchCode,
          change_order_id: this.change_order_id
        }
        this.addGoodsInBufferData(obj)
      }
    },

    addGoodsInBufferData (data) {
      this.$store
        .dispatch('erpchange/addGoodsInBuffer', data)
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

            this.searchCode = ''
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
            this.searchCode = ''
          }
        })
        .catch((error) => {})
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

    confirmChangeData () {
      this.saveDataOperate('确认调整', 7)
    },

    saveDataOperate (text, cepStatus) {
      if (this.changeBufferData.length <= 0) {
        this.$q.notify({
          message: '注意',
          caption: '请选择库存调整商品!',
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
          message: text + '调整单, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            change_order_id: this.change_order_id,
            ...this.changeFormData,
            cepStatus,
            changeBufferData: this.changeBufferData
          }
          this.$store
            .dispatch('erpchange/setChangeOrderData', obj)
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

    emptyStorageList () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: '确定清空调整列表',
          cancel: true
        })
        .onOk(() => {
          this.$store
            .dispatch('erpchange/clearBufferData', {
              change_order_id: this.change_order_id
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

    // 商品选择
    selectBut () {
      this.showGoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType(1)
        }, 500)
      })
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    countMethor (p) {
      if (!p.newValue || p.newValue == p.oldValue) {
        return false
      }
      const itemsToUpdate = []
      const data = p.data
      const regu = /^[0-9]+\.?[0-9]{0,2}$/
      const storagePrice = this.formatAmount(data.epd_price)
      if (!regu.test(data.epd_quantity)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正两位小数或整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        data.epd_quantity = 0
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }

      this.$store
        .dispatch('erpchange/editBufferData', data)
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
            data.epd_cash_amount = storagePrice * Math.abs(data.epd_quantity)
            itemsToUpdate.push(data)
            p.api.applyTransaction({ update: itemsToUpdate })
            this.getDataColumnSum()
          } else {
            this.getItem()
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
          this.getItem()
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
    getDataColumnSum () {
      this.changeFormData.cep_total_purchase_num = 0
      this.changeFormData.cep_total_shipments_quantity = 0

      const tableData = this.changeBufferData
      let inTotalNum = 0
      tableData.forEach((item, index) => {
        if (this.formatAmount(item.epd_quantity)) {
          inTotalNum = this.formatAmount(inTotalNum) + this.formatAmount(item.epd_quantity)
        }
      })
      this.changeFormData.cep_total_purchase_num = this.formatAmount(inTotalNum)

      this.changeFormData.cep_total_shipments_quantity = this.formatAmount(tableData.length)
    },
    // 提交盘点
    submitData () {
      if (this.changeBufferData.length <= 1) {
        this.$q.notify({
          message: '注意',
          caption: '未选择商品！',
          icon: 'ion-close-circle-outline',
          color: 'red',
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
          message: '确定进行盘点',
          cancel: true
        })
        .onOk(() => {
          const obj = {
            ...this.changeFormData,
            checkData: this.changeBufferData
          }
          this.$store.dispatch('erpchange/setData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                color: 'green',
                message: '成功',
                caption: '成功盘点' + res.data + '条商品',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })

              this.$router.push({ name: 'erpChange' })
            } else {
              this.$q.notify({
                message: '盘点失败',
                caption: res.data.msg,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            }
          })
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
    exportCsv () {
      this.gridOptions.api.exportDataAsCsv({
        fileName: this.changeFormData.cep_contract_number + '-库存调整单详情'
      })
    },
    erpPrint () {
      if (this.changeBufferData.length > 0) {
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
            this.$refs.erpPrintRef.getInquireType(sideBarColumns, this.change_order_id, 'change', this.changeFormData)
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
.erp-change-table .cell-span-erp-change {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
