<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-form ref="erpInRef">
          <div class="q-gutter-xs row">
            <q-btn color="grey" unelevated :to="{ name: 'erpCheck' }" label="返回" />
            <q-btn
              color="warning"
              unelevated
              :disable="checkFormData.cep_status == 1 ? false : true"
              v-if="authorityMeta('hangup')"
              @click="hangupOrderData"
              label="挂起"
            />
            <q-btn
              color="primary"
              unelevated
              :disable="checkFormData.cep_status == 1 || checkFormData.cep_status == 5 ? false : true"
              v-if="authorityMeta('save')"
              @click="saveOrderData"
              label="保存"
            />
            <q-btn
              color="primary"
              unelevated
              :disable="checkFormData.cep_status == 1 ? false : true"
              v-if="authorityMeta('confirm')"
              @click="confirmOrderData"
              label="确定"
            />
            <q-btn
              color="positive"
              unelevated
              :disable="checkFormData.cep_status == 2 ? false : true"
              v-if="authorityMeta('shenhe')"
              @click="auditOrderData"
              label="审核"
            />
            <q-btn
              color="negative"
              :disable="checkFormData.cep_status == 3 ? false : true"
              v-if="authorityMeta('revoke')"
              @click="cancelAudit"
              unelevated
              label="取消审核"
            />

            <q-btn
              color="warning"
              unelevated
              :disable="checkFormData.cep_status == 3 ? false : true"
              v-if="authorityMeta('difference')"
              @click="changeDepotNumber"
              label="过账"
            />
            <q-btn
              color="red"
              unelevated
              :disable="checkFormData.cep_status == 2 ? false : true"
              v-if="authorityMeta('cancel')"
              @click="cancelOrderConfirmData"
              label="取消确定"
            />
            <q-btn
              color="red"
              :disable="checkFormData.cep_status == 1 ? false : true"
              v-if="authorityMeta('close')"
              @click="closeOrderData"
              unelevated
              label="作废"
            />

            <q-btn
              color="primary"
              unelevated
              :disable="checkFormData.cep_status == 6 ? false : true"
              v-if="authorityMeta('difference')"
              @click="setDifference"
              label="生成差异表"
            />

            <q-btn
              color="red"
              unelevated
              v-if="authorityMeta('cancelDiffer')"
              :disable="checkFormData.cep_status == 7 ? false : true"
              @click="cancelSetDifference"
              label="取消生成"
            />

            <div class="col-12 col-md-2" v-if="checkFormData.cep_check_order_range == 1">
              <q-input outlined v-model="searchCode" label="请输入条码/唯一码" dense />
            </div>

            <q-btn
              color="green"
              unelevated
              v-if="authorityMeta('code') && checkFormData.cep_check_order_range == 1"
              label="条码添加"
              :disable="searchCode == '' ? true : false"
              @keyup.enter="addItemData(searchCode)"
              @click="addItemData(searchCode)"
            />
            <q-btn
              color="primary"
              unelevated
              v-if="authorityMeta('select') && checkFormData.cep_check_order_range == 1"
              label="选择商品"
              @click="selectBut"
              :disable="checkFormData.cep_status < 7 ? false : true"
            />
            <q-btn
              color="green"
              @click="batchImport()"
              unelevated
              v-if="checkFormData.cep_status < 2 && checkFormData.cep_check_order_range == 1"
              :disable="checkFormData.cep_status < 7 ? false : true"
              >Xlxs 文件批量导入</q-btn
            >
            <q-btn color="primary" unelevated @click="exportCsv" label="导出Csv文件" :disable="checkBufferData.length == 0" />
          </div>
        </q-form>

        <div class="row">
          <div class="col-2">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ checkFormData.cep_contract_number }}</q-item-label>
                <q-item-label caption lines="2">盘点表单据</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ checkFormData.cep_depot_name }}</q-item-label>
                <q-item-label caption lines="2">盘点仓库</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ rangeTextObject[checkFormData.cep_check_order_range] }}</q-item-label>
                <q-item-label caption lines="2">盘点范围</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ checkFormData.cep_check_before_quantity }}</q-item-label>
                <q-item-label caption lines="2">应有库存</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ checkFormData.cep_check_real_quantity }}</q-item-label>
                <q-item-label caption lines="2">实盘库存</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-2">
            <q-item>
              <q-item-section>
                <q-item-label caption class="text-subtitle2 text-weight-bold">
                  <span v-if="checkFormData.cep_status == 1" class="text-primary">已保存</span>
                  <span v-if="checkFormData.cep_status == 2" class="text-primary">已确定</span>
                  <span v-if="checkFormData.cep_status == 3" class="text-positive">已审核</span>
                  <span v-if="checkFormData.cep_status == 4" class="text-red">已作废</span>
                  <span v-if="checkFormData.cep_status == 5" class="text-warning">挂起</span>
                  <span v-if="checkFormData.cep_status == 6" class="text-primary">采购入库</span>
                  <span v-if="checkFormData.cep_status == 7" class="text-primary">已生成差异单</span>
                </q-item-label>
                <q-item-label caption>状态</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-input
              type="textarea"
              outlined
              v-model="checkFormData.cep_note"
              :disable="checkFormData.cep_status == 1 ? false : true"
              label="备注"
              dense
              :rows="1"
            />
          </div>
        </div>
      </div>
      <upload-table-purchase v-if="uploadStatus" ref="returnTypes" @closeUpload="uploadTable"></upload-table-purchase>

      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2 q-pb-sm">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="checkBufferData"
          :gridOptions="gridOptions"
          :context="context"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          :defaultColDef="defaultColDef"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          rowHeight="50"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>
    </div>

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
  name: 'AddCheck',
  components: {
    AgButton
  },
  data () {
    return {
      gridOptions: {},
      context: null,
      showGoodsList: false,
      uploadStatus: false,
      components: {
        AgButton
      },
      searchCode: '',
      columnDefs: [],
      checkBufferData: [],
      localeText: this.$ag_grid_localeText,
      defaultColDef: {
        sortable: true,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      checkFormData: [],
      check_order_id: '',
      rangeTextObject: {
        1: '全盘',
        2: '抽盘',
        3: '品类'
      }
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
          headerName: '条码',
          field: 'epd_skc_code',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'epd_archives_name',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '规格',
          field: 'epd_spe_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },

        {
          headerName: '单价',
          field: 'epd_price',
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '原有库存',
          field: 'epd_check_before_number',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '盘点数量',
          field: 'epd_check_number',
          width: this.nowpx(0.1) + 'px',
          singleClickEdit: true,
          comparator: (a, b) => a - b,
          editable: (p) => {
            return p.data.epd_archives_id > 0 && parseInt(this.checkFormData.cep_status) == 1
          },
          onCellValueChanged: this.countCheckNumber
        },
        {
          headerName: '相差数量',
          field: 'epd_discrepancy_quantity',
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '盘点状态',
          field: 'store.name',
          valueGetter: (p) => {
            if (p.data.epd_check_number > p.data.epd_check_before_number) {
              return '盘盈'
            }
            if (p.data.epd_check_number < p.data.epd_check_before_number) {
              return '盘亏'
            }
            if (p.data.epd_check_number == p.data.epd_check_before_number) {
              return '正常'
            }
          },
          width: this.nowpx(0.05) + 'px'
        },

        {
          headerName: '原因',
          field: 'epd_note',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        }
      ]
      this.gridOptions.api.setColumnDefs(columnData)
      this.columnDefs = columnData
      this.sideBarColumn = this.columnDefs.map((x) => {
        return x.headerName
      })

      if (this.$route.query.id) {
        this.check_order_id = this.$route.query.id
        this.getItem()
      }
    },
    getItem () {
      const obj = {
        id: this.check_order_id
      }
      this.$store
        .dispatch('erpCheck/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.checkFormData = res.data.checkFormData ? res.data.checkFormData : {}
            this.checkBufferData = res.data.checkBufferData.length > 0 ? res.data.checkBufferData : []

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

    getDataColumnSum () {
      const tableData = this.checkBufferData
      let checkNumber = 0
      let beforeDepotNumber = 0
      tableData.forEach((item, index) => {
        if (this.formatAmount(item.epd_check_number)) {
          checkNumber = this.formatAmount(checkNumber) + this.formatAmount(item.epd_check_number)
        }
        if (this.formatAmount(item.epd_check_before_number)) {
          beforeDepotNumber = this.formatAmount(beforeDepotNumber) + this.formatAmount(item.epd_check_before_number)
        }
      })

      this.checkFormData.cep_check_before_quantity = this.formatAmount(beforeDepotNumber)

      this.checkFormData.cep_check_real_quantity = this.formatAmount(checkNumber)
    },

    // 订单挂起 5
    hangupOrderData () {
      this.saveDataOperate('挂起', 5)
    },

    // 订单保存 1
    saveOrderData () {
      this.saveDataOperate('保存', 1)
    },

    // 订单确认 2
    confirmOrderData () {
      this.saveDataOperate('确认', 2)
    },

    // 订单审核 3
    auditOrderData () {
      this.saveDataOperate('审核', 3)
    },

    // 取消确定 1
    cancelOrderConfirmData () {
      this.saveDataOperate('取消确定', -2)
    },

    // 作废  4
    closeOrderData () {
      this.saveDataOperate('作废', 4)
    },

    // 取消审核  2
    cancelAudit () {
      this.saveDataOperate('取消审核', -3)
    },

    // 过账
    changeDepotNumber () {
      this.saveDataOperate('过账', 6)
    },

    saveDataOperate (text, cepStatus) {
      if (cepStatus != 4) {
        if (this.checkBufferData.length <= 0) {
          this.$q.notify({
            message: '注意',
            caption: '请选择入库商品!',
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          return false
        }
      }

      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          cancel: true,
          message: text + '采购入库单, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            check_order_id: this.checkFormData.id,
            ...this.checkFormData,
            cepStatus,
            checkBufferData: this.checkBufferData
          }
          this.$store
            .dispatch('erpCheck/changeCheckOrder', obj)
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

    // 生成差异单
    setDifference () {
      this.$q
        .dialog({
          title: '确定',
          message: '确定生成盘点差异单吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            check_order_id: this.check_order_id,
            cepStatus: 7
          }
          this.$store
            .dispatch('erpCheck/editCheck', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '生成差异数据成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.check_order_id = parseInt(res.data.id)
                  this.getItem()
                }, 500)
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        })
    },

    // 取消生成差异单
    cancelSetDifference () {
      this.$q
        .dialog({
          title: '确定',
          message: '取消生成盘点差异单吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            check_order_id: this.check_order_id,
            cepStatus: -4
          }
          this.$store
            .dispatch('erpCheck/editCheck', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '取消生成盘点差异单成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.check_order_id = parseInt(res.data.id)
                  this.getItem()
                }, 500)
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: error.message,
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
    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      const that = this
      if (data && data.length > 0) {
        setTimeout(() => {
          const obj = {
            bufferDatas: data,
            check_order_id: this.check_order_id
          }
          that.addGoodsInBufferData(obj)
        }, 500)
      }
    },

    addItemData (searchCode) {
      if (searchCode) {
        const obj = {
          goodsCode: searchCode,
          check_order_id: this.check_order_id
        }
        this.addGoodsInBufferData(obj)
      }
    },

    addGoodsInBufferData (data) {
      this.$store
        .dispatch('erpCheck/addGoodsInBuffer', data)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '成功添加' + res.data + '条商品',
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

    countCheckNumber (p) {
      if (!p.newValue || p.newValue == p.oldValue) {
        return false
      }
      const itemsToUpdate = []
      const row = p.data

      const regu3 = /^([1-9][0-9]{0,1}|100)$/
      if (!regu3.test(row.epd_check_number)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.epd_check_number = p.oldValue ? p.oldValue : 100
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }

      row.epd_discrepancy_quantity = row.epd_check_number - row.epd_check_before_number

      this.$store
        .dispatch('erpCheck/editBufferData', row)
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
            itemsToUpdate.push(row)
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
          this.$refs.returnTypes.receiveType('check', this.check_order_id, this.check_order_id, this.checkFormData.cep_depot_id)
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
    exportCsv () {
      this.gridOptions.api.exportDataAsCsv({
        fileName: this.checkFormData.cep_contract_number + '-盘点单详情'
      })
    },

    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
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
<style></style>
