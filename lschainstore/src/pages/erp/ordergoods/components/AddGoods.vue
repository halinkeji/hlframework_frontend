<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-gutterxs ">
        <q-form ref="erpInRef">
          <div class="row q-gutter-sm items-start">
            <q-btn color="grey" unelevated :to="{ name: 'erpOrderGoods' }" label="返回" />
            <div class="col-12 col-md-1" v-if="orderGoodsData.cep_status == 1">
              <q-select
                outlined
                option-value="value"
                option-label="label"
                emit-value
                map-options
                v-model="orderGoodsData.cep_if_pack"
                :options="[
                  {
                    label: '是',
                    value: '1',
                  },
                  {
                    label: '否',
                    value: '2',
                  },
                ]"
                dense
                label="是否装箱"
                :rules="[(val) => !!val || '选择是否装箱']"
              />
            </div>
            <div class="col-12 col-md-2" v-if="authorityMeta('code') && orderGoodsData.cep_status == 1">
              <q-input dense outlined bottom-slots v-model="searchValue" label="请输入SKU码或唯一码" />
            </div>

            <q-btn
              color="positive"
              unelevated
              label="添加商品"
              v-if="authorityMeta('code') && orderGoodsData.cep_status == 1"
              :disable="searchValue == '' ? true : false"
              @keyup.enter="addItemData(searchValue)"
              @click="addItemData(searchValue)"
            />

            <q-btn color="primary" @click="selectBut" v-if="authorityMeta('selectGoods') && orderGoodsData.cep_status == 1" unelevated label="选择商品" />
            <q-btn color="green" @click="batchImport()" unelevated v-if="authorityMeta('import')">
              Xlxs 文件批量导入
            </q-btn>

            <q-btn
              color="red"
              :disable="storeOrderGoodsData.length > 1 ? false : true"
              unelevated
              v-if="orderGoodsData.cep_status < 2"
              label="清空订货列表"
              @click="emptyStorageList()"
            />

            <q-btn
              color="info"
              unelevated
              label="装箱"
              v-if="orderGoodsData.cep_if_pack == '1' && orderGoodsData.cep_status == 1 && authorityMeta('packing')"
              :disable="storeOrderGoodsData.length > 1 ? false : true"
              @click="addPacking()"
            />
            <q-btn
              color="secondary"
              unelevated
              label="装箱信息"
              v-if="orderGoodsData.cep_if_pack == '1' && authorityMeta('packingDetail')"
              @click="showPackingData"
            />
            <q-btn
              color="warning"
              :disable="orderGoodsData.cep_status < 2 ? false : true"
              v-if="authorityMeta('hangup')"
              @click="hangupOrderData"
              unelevated
              label="挂起"
            />
            <q-btn
              color="primary"
              :disable="orderGoodsData.cep_status == 1 || orderGoodsData.cep_status == 5 ? false : true"
              v-if="authorityMeta('save')"
              @click="saveOrderData"
              unelevated
              label="保存"
            />

            <q-btn
              color="primary"
              :disable="orderGoodsData.cep_status == 1 ? false : true"
              v-if="authorityMeta('confirm')"
              @click="confirmOrderData"
              unelevated
              label="确认"
            />
            <q-btn
              color="primary"
              :disable="orderGoodsData.cep_status == 2 ? false : true"
              v-if="authorityMeta('audit')"
              @click="auditOrderData"
              unelevated
              label="审核"
            />
            <q-btn
              color="negative"
              :disable="orderGoodsData.cep_status == 3 ? false : true"
              v-if="authorityMeta('revoke')"
              @click="cancelAudit"
              unelevated
              label="取消审核"
            />
            <q-btn
              color="red"
              :disable="orderGoodsData.cep_status == 2 ? false : true"
              v-if="authorityMeta('cancel')"
              @click="cancelOrderConfirmData"
              unelevated
              label="取消确定"
            />
            <q-btn
              color="red"
              :disable="orderGoodsData.cep_status == 1 ? false : true"
              v-if="authorityMeta('close')"
              @click="closeOrderData"
              unelevated
              label="作废"
            />
            <q-btn color="primary" unelevated @click="exportCsv" label="导出Csv文件" :disable="storeOrderGoodsData.length == 0 && purchase_id < 1" />

            <q-btn color="info" unelevated @click="erpPrint" label="打印" v-if="storeOrderGoodsData.length > 0 && purchase_id > 0" />

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
          </div>
        </q-form>

        <upload-table-purchase v-if="uploadStatus" ref="returnTypes" @closeUpload="uploadTable"></upload-table-purchase>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <q-form ref="erpInRef" class="row">
          <div class="col-2">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ orderGoodsData.cep_contract_number }}</q-item-label>
                <q-item-label caption lines="2">订货单据号</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-2" v-if="patchOrderData && patchOrderData.id">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ patchOrderData.cep_contract_number }}</q-item-label>
                <q-item-label caption lines="2">补货单据号</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <!-- <div class="col" v-if="patchOrderData && patchOrderData.id">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold"></q-item-label>
                <q-item-label caption lines="2">补货实付款</q-item-label>
              </q-item-section>
            </q-item>
          </div> -->
          <div class="col" v-if="patchOrderData && patchOrderData.id">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ patchOrderData.cep_total_purchase_num }}</q-item-label>
                <q-item-label caption lines="2">补货总数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ orderGoodsData.cep_depot_name }}</q-item-label>
                <q-item-label caption lines="2">仓库</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ orderGoodsData.cep_total_purchase_num }}</q-item-label>
                <q-item-label caption lines="2">总数量</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">{{ orderGoodsData.cep_total_purchase_amount }}</q-item-label>
                <q-item-label caption lines="2">账单小计</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold">
                  <span v-if="orderGoodsData.cep_status == 1" class="text-primary">已保存</span>
                  <span v-if="orderGoodsData.cep_status == 2" class="text-primary">已确定</span>
                  <span v-if="orderGoodsData.cep_status == 3" class="text-positive">已审核</span>
                  <span v-if="orderGoodsData.cep_status == 4" class="text-red">已作废</span>
                  <span v-if="orderGoodsData.cep_status == 5" class="text-warning">挂起</span>
                  <span v-if="orderGoodsData.cep_status == 6" class="">已分配</span>
                  <span v-if="orderGoodsData.cep_status == 7" class="">已配货</span>
                  <span v-if="orderGoodsData.cep_status == 8" class="">已分配出库单</span>
                  <span v-if="orderGoodsData.cep_status == 9" class="">已出库</span>
                </q-item-label>
                <q-item-label caption lines="2">
                  单据状态
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-2">
            <q-input type="textarea" outlined v-model="orderGoodsData.cep_note" label="备注" dense :rows="1" />
          </div>

          <div class="col-12 q-pa-sm q-mb-md" v-if="linkTypeBufferData && linkTypeBufferData.length > 0">
            <q-card flat bordered v-if="linkTypeBufferData && linkTypeBufferData.length > 0">
              <div class="row items-center">
                <div class="col-auto">
                  <q-item-label header>
                    补货品类
                  </q-item-label>
                </div>
                <div class="col-4" v-for="(item, key) in linkTypeBufferData">
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        <span class="text-h6 text-primary">{{ item.cel_number }}</span>
                        件
                      </q-item-label>
                      <q-item-label>
                        {{ item.cel_type_name }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </q-card>
          </div>
        </q-form>
      </div>

      <div class="col-shrink q-px-xs q-pb-sm full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham erp-add-table ag-grid-table full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="storeOrderGoodsData"
          :rowDragManaged="true"
          :gridOptions="gridOptions"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          :context="context"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :localeText="localeText"
        >
        </ag-grid-vue>
      </div>
    </div>
    <hl-specification-tree-erp
      ref="specificationTree"
      v-show="showGoodsList"
      @getSelectedGoodsData="getSelectedGoodsData"
    ></hl-specification-tree-erp>
    <show-packing ref="showDataRef" v-if="showPackingStatus" @closeChooseInvoice="getItem" />

    <hl-erp-print ref="erpPrintRef" v-show="erpPrintStatus" @getSelectedGoodsData="erpPrintStatus = false"></hl-erp-print>
  </q-page>
</template>

<script>
import AgOperator from './AgOperator'
import ShowPacking from 'pages/erp/packing/components/ShowPacking'
export default {
  name: 'AddGoods',
  components: {
    AgOperator,
    ShowPacking
  },
  data () {
    return {
      gridOptions: {},
      orderGoodsData: {
        cep_fold_clause: 0,
        cep_real_pay_amount: 0,
        cep_discount_amount: 0,
        cep_total_purchase_num: 0,
        cep_total_purchase_amount: 0,
        cep_note: '',
        cep_depot_id: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_if_pack: '2',
        cep_status: 0,
        cep_type: 4,
        cep_order_store_id: ''
      },
      context: null,
      searchValue: '',
      components: {
        AgOperator
      },
      chooseInvoiceVisible: false,
      showPackingStatus: false,
      storeOrderGoodsData: [],
      columnDefs: [],
      sideBarColumn: [],
      defaultColDef: {
        sortable: true,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      depotData: [],
      showGoodsList: false,
      uploadStatus: false,
      erpPrintStatus: false,
      localeText: this.$ag_grid_localeText,
      inTotalAmount: 0,
      purchase_id: '',
      storeCreditData: {},

      patchOrderData: {},
      typeData: [],
      packingInfo: [],
      linkTypeBufferData: []
    }
  },
  created () {},
  mounted () {
    this.context = this
    this.restColumnData()
  },
  computed: {},
  methods: {
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
      if (this.storeOrderGoodsData.length <= 0) {
        this.$q.notify({
          message: '注意',
          caption: '请选择采购商品!',
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
          message: text + '订货单, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            epd_store_order_goods_id: this.purchase_id,
            ...this.orderGoodsData,
            cepStatus,
            storeOrderGoodsData: this.storeOrderGoodsData
          }
          this.$store
            .dispatch('erpOrderGoods/changeGoodsOrderData', obj)
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
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '商品名称',
          field: 'epd_archives_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '规格',
          field: 'epd_spe_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '装箱编号',
          field: 'packingData.cep_code',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '订货数量',
          field: 'epd_quantity',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0 && this.orderGoodsData.cep_status < 2
          },
          width: this.nowpx(0.06) + 'px',
          onCellValueChanged: this.changeNumber,
          comparator: (a, b) => a - b
        },
        {
          headerName: '订货单价',
          field: 'epd_price',
          filter: false,
          width: this.nowpx(0.07) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '批发价',
          field: 'epd_wholesale_price',
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0 && this.orderGoodsData.cep_status < 2
          },
          filter: false,
          width: this.nowpx(0.07) + 'px',
          onCellValueChanged: this.changeNumber,
          comparator: (a, b) => a - b
        },
        {
          headerName: '折扣率',
          field: 'epd_discount_rate',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0 && this.storeCreditData.csc_if_manually_modify == 1 && this.orderGoodsData.cep_status < 2
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.05) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '折扣额',
          valueGetter: (p) => {
            return p.data.epd_archives_id > 0 ? (p.data.epd_fold_amount > 0 ? p.data.epd_fold_amount : 0) : ''
          },
          filter: false,
          width: this.nowpx(0.05) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '折后单价',
          field: 'epd_discount_after_amount',
          filter: false,
          valueGetter: (p) => {
            return p.data.epd_archives_id > 0 ? (p.data.epd_discount_after_amount > 0 ? p.data.epd_discount_after_amount : p.data.epd_price) : ''
          },
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '订货金额',
          field: 'epd_cash_amount',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '备注',
          field: 'epd_note',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.epd_archives_id > 0
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.08) + 'px',
          pinned: this.pinnedComputed('right')
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgOperator',
          pinned: this.pinnedComputed('right'),
          width: this.nowpx(0.04) + 'px'
        }
      ]
      this.gridOptions.api.setColumnDefs(columnData)
      this.columnDefs = columnData
      this.sideBarColumn = this.columnDefs.map((x) => {
        return x.headerName
      })

      if (this.$route.query.id) {
        this.purchase_id = this.$route.query.id
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

    addItemData (searchValue) {
      if (searchValue) {
        const obj = {
          goodsCode: searchValue,
          current_store_id: this.orderGoodsData.cep_order_store_id,
          epd_store_order_goods_id: this.purchase_id,
          linkTypeBufferData: this.linkTypeBufferData
        }
        this.addBufferData(obj)
      }
    },

    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      const that = this

      if (data && data.length > 0) {
        const obj = {
          bufferDatas: data,
          current_store_id: this.orderGoodsData.cep_order_store_id,
          epd_store_order_goods_id: this.purchase_id,
          linkTypeBufferData: this.linkTypeBufferData
        }
        that.addBufferData(obj)
      }
    },

    addBufferData (obj) {
      this.$store
        .dispatch('erpOrderGoods/addBufferData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.searchValue = ''
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '成功添加' + (res.data || 0) + '条商品',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.getItem()
          } else {
            this.searchValue = ''
            this.$q.notify({
              message: '添加失败',
              caption: res.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },

    getItem () {
      this.showPackingStatus = false
      const obj = {
        id: this.purchase_id
      }
      this.$store
        .dispatch('erpOrderGoods/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.orderGoodsData = res.data.orderGoodsData && res.data.orderGoodsData.id ? res.data.orderGoodsData : {}
            this.storeOrderGoodsData = res.data.storeOrderGoodsData && res.data.storeOrderGoodsData.length > 0 ? res.data.storeOrderGoodsData : []
            this.patchOrderData = res.data.patchOrderData && res.data.patchOrderData.id ? res.data.patchOrderData : {}

            this.linkTypeBufferData = res.data.linkTypeBufferData && res.data.linkTypeBufferData.length > 0 ? res.data.linkTypeBufferData : []

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

    cleanBufferlist () {
      this.$store
        .dispatch('erpOrderGoods/clearBufferData', {
          epd_store_order_goods_id: this.purchase_id
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

            this.$nextTick(() => {
              this.getItem()
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
      const row = p.data
      const storagePrice = this.formatAmount(row.epd_price)
      const epd_quantity = row.epd_quantity
      let epd_discount_rate = this.formatAmount(row.epd_discount_rate)
      if (epd_discount_rate == 0) {
        epd_discount_rate = 100
      }
      const itemsToUpdate = []
      const regu = /^\+?[0-9][0-9]*$/
      if (!regu.test(row.epd_quantity)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.epd_quantity = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }
      const regu2 = /^[0-9]+\.?[0-9]{0,2}$/
      if (!regu2.test(storagePrice)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正两位小数或整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.epd_price = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }
      const regu8 = /^[0-9]+\.?[0-9]{0,2}$/
      if (row.epd_wholesale_price && !regu8.test(row.epd_wholesale_price)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正两位小数或整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.epd_wholesale_price = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }

      const regu3 = /^([1-9][0-9]{0,1}|100)$/
      if (!regu3.test(row.epd_discount_rate)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.epd_discount_rate = p.oldValue ? p.oldValue : 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }
      // 原价
      const originalPrice = this.formatAmount(storagePrice * epd_quantity)
      // 单个商品折扣
      const discountAmount = this.formatAmount(originalPrice * (epd_discount_rate * 0.01))
      // 折扣额
      row.epd_fold_amount = this.formatAmount(originalPrice - discountAmount)
      // 购货金额
      row.epd_cash_amount = this.formatAmount(discountAmount)
      // 数量
      row.epd_quantity = epd_quantity
      // 单价
      row.epd_price = storagePrice
      // 折扣率
      row.epd_discount_rate = epd_discount_rate
      // 折后金额
      row.epd_discount_after_amount = this.formatAmount(storagePrice * (epd_discount_rate * 0.01))

      row.linkTypeBufferData = this.linkTypeBufferData

      this.$store
        .dispatch('erpOrderGoods/editButtfer', row)
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
      this.orderGoodsData.cep_fold_clause = 0
      this.orderGoodsData.cep_discount_amount = 0
      this.orderGoodsData.cep_total_purchase_amount = 0
      const tableData = this.storeOrderGoodsData
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
      this.orderGoodsData.cep_total_purchase_num = this.formatAmount(inTotalNum)
      this.orderGoodsData.cep_total_purchase_amount = this.formatAmount(inTotalAmount)
      this.orderGoodsData.cep_real_pay_amount = this.formatAmount(inTotalAmount)
    },

    addPacking () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          cancel: true,
          message: '是否进行装箱操作'
        })
        .onOk(() => {
          const obj = {
            bufferData: this.storeOrderGoodsData,
            erp_order_id: this.purchase_id
          }
          this.$store
            .dispatch('erpOrderGoods/setPacking', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功装箱' + (res.data || 0) + '件商品',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 800,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.getItem()
                })
              } else {
                this.$q.notify({
                  message: '添加失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
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

    showPackingData () {
      this.showPackingStatus = true
      this.$nextTick(() => {
        this.$refs.showDataRef.init('cep_ordergoods_id', this.purchase_id)
      })
    },

    emptyStorageList () {
      const that = this
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: '确定清空订货列表',
          cancel: true
        })
        .onOk(() => {
          that.cleanBufferlist()
        })
    },

    selectBut () {
      this.showGoodsList = true
      let typeData = []
      if (this.linkTypeBufferData && this.linkTypeBufferData.length > 0) {
        typeData = this.linkTypeBufferData.map(item => { return item.cel_type_id })
      }
      this.$nextTick(() => {
        this.$refs.specificationTree.getInquireType(1, '', typeData)
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
        // params.api.sizeColumnsToFit()
      }
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
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
        fileName: this.orderGoodsData.cep_contract_number + '-订货单详情'
      })
    },
    erpPrint () {
      if (this.storeOrderGoodsData.length > 0) {
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
            this.$refs.erpPrintRef.getInquireType(sideBarColumns, this.purchase_id, 'orderGoods', this.orderGoodsData)
          }, 500)
        })
      }
    },
    uploadTable () {
      this.uploadStatus = false
      this.getItem()
    },
    batchImport () {
      this.uploadStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.returnTypes.receiveType('orderGoods', this.purchase_id)
        }, 500)
      })
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
.erp-add-table .cell-span-erp-add {
  background: white !important;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
