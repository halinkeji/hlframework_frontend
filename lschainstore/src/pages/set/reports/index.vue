<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-pb-lg">
        <div class="row q-px-sm q-gutter-x-sm items-center">
          <q-select
            class="col-12 col-md-2 q-mt-sm"
            outlined
            dense
            option-label="lable"
            option-value="value"
            v-model="packageStatus"
            :options="invoiceTyp"
            @input="getList"
            label="单据类型"
          />
          <q-btn @click="selectInvoice()" color="primary" class="q-mt-sm" unelevated label="选择" />
          <q-btn @click="clearButton()" color="grey" class="q-mt-sm" unelevated label="重置" />
        </div>
      </div>
      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <q-scroll-area class="fit full-height">
          <q-card flat bordered class="q-my-xs">
            <q-card-section class="row items-center q-py-xs">
              <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />查询条件</span>
            </q-card-section>
            <q-separator />
            <q-card-section flat>
              <div class="q-gutter-xs row">
                <div class="col-12 col-md-4" v-if="is_main_store">
                  <q-select
                    label="查询门店"
                    use-chips
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
                <div class="col-12 col-md-4" v-if="is_main_store && invoiceType != 'ConsumeRecord'">
                  <q-select
                    outlined
                    option-value="id"
                    option-label="cd_name"
                    emit-value
                    map-options
                    multiple
                    use-chips
                    v-model="depotId"
                    :options="depotData"
                    dense
                    label="仓库"
                  />
                </div>
                <div class="col-12 col-md-2" v-if="invoiceType != 'ConsumeRecord'">
                  <q-input clearable outlined v-model="searchFrom.searchNumber" label="商品名称/条码" dense />
                </div>

                <div
                  class="col-12 col-md-2"
                  v-if="invoiceType == 'LifeCycle' || invoiceType == 'Invoicing' || invoiceType == 'InventoryHolding' || invoiceType == 'SalesRatio'"
                >
                  <hl-select-tree
                    :list_width="400"
                    @getItem="
                      (item) => {
                        searchFrom.goodsTypeId = item.id;
                      }
                    "
                    @resetValue="searchFrom.goodsTypeId = ''"
                    :dataList="goodsTypeData"
                    textName="请选择分类"
                    :inputLabel="'gt_name'"
                    :inputValue="'id'"
                    :showValue="searchFrom.goodsTypeId"
                    ref="selectTreeRef"
                  />
                </div>
                <div class="col-12 col-md-2">
                  <q-input outlined v-model="startTime" label="开始时间" dense readonly>
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-date v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-md-2">
                  <q-input outlined v-model="endTime" label="结束时间" dense readonly>
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-md-2">
                  <q-input clearable outlined v-model="searchFrom.number" label="单据号" dense />
                </div>

                <div class="col-12 col-md-2" v-if="invoiceType == 'ConsumeRecord'">
                  <q-select
                    outlined
                    option-value="field"
                    option-label="name"
                    emit-value
                    map-options
                    multiple
                    use-chips
                    :options="paymentChannel"
                    v-model="searchFrom.consumePayType"
                    dense
                    clearable
                    label="选择支付方式"
                  />
                </div>

                <div class="col-12 col-md-2" v-if="invoiceType == 'ConsumeRecord'">
                  <q-select
                    outlined
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    v-model="searchFrom.handleType"
                    :options="[
                      { label: '大于', value: 1 },
                      { label: '小于', value: 2 },
                      { label: '大于等于', value: 3 },
                      { label: '小于等于', value: 4 },
                    ]"
                    dense
                    label="折扣比较"
                    clearable
                  />
                </div>

                <div class="col-12 col-md-2" v-if="invoiceType == 'ConsumeRecord'">
                  <q-input clearable outlined v-model="searchFrom.handle" label="折扣率" dense />
                </div>

                <div class="col-12 col-md-2" v-if="invoiceType == 'Inventory'">
                  <q-select
                    outlined
                    use-chips
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    multiple
                    v-model="searchFrom.type"
                    :options="[
                      { label: '采购入库单', value: 1 },
                      { label: '调拨出库单', value: 2 },
                      { label: '调拨入库单', value: 3 },
                      { label: '订货出库单', value: 6 },
                      { label: '订货入库单', value: 7 },
                      { label: '采购退货单', value: 9 },
                      { label: '门店退货入库', value: 11 },
                      { label: '门店退货出库', value: 12 },
                      { label: '库存调整单', value: 13 },
                      { label: '直采出库单', value: 16 },
                      { label: '直采入库单', value: 17 },
                      { label: '消费收银', value: 20 },
                      { label: '库存盘点', value: 21 },
                    ]"
                    dense
                    label="单据类型"
                    clearable
                  />
                </div>

                <div class="col-12 col-md-2" v-if="invoiceType == 'Inventory'">
                  <q-select
                    outlined
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    v-model="searchFrom.inStatus"
                    :options="[
                      { label: '出库单', value: 1 },
                      { label: '入库单', value: 2 },
                    ]"
                    dense
                    label="操作方式"
                    clearable
                  />
                </div>

                <div
                  class="col-12 col-md-2"
                  v-if="invoiceType == 'StoreProfits' || invoiceType == 'ConsumeRecord' || invoiceType == 'ConsumeRecords'"
                >
                  <q-select
                    outlined
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    v-model="searchFrom.summaryType"
                    :options="[
                      { label: '日汇总', value: 1 },
                      { label: '月汇总', value: 2 },
                    ]"
                    dense
                    label="汇总方式"
                    clearable
                  />
                </div>

                <q-btn unelevated label="确定" color="primary" @click="setData(1)" :disable="selectData.length > 0 ? false : true" />
                <q-btn
                  unelevated
                  label="导出"
                  color="positive"
                  @click="setData(2)"
                  :disable="selectData.length > 0 ? false : true"
                />
                <q-btn color="primary" unelevated label="选择商品" @click="bindGoodsTag" />
              </div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="q-my-xs">
            <q-card-section class="row items-center q-py-xs">
              <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />可自定义字段</span>
            </q-card-section>

            <q-separator />

            <q-card-section flat class="row" v-if="showInvoiceData.length > 0">
              <div class="text-subtitle2 q-mt-sm q-mb-xs" v-for="(item, key) in showInvoiceData" :key="key">
                <q-btn
                  outline
                  color="primary"
                  class="q-mx-xs"
                  :label="item.pValue"
                  @click="selectBtn(key)"
                  :class="{ 'bg-primary text-white': parseInt(item.status) == 1 ? true : false }"
                />
              </div>
            </q-card-section>

            <q-card-section flat v-else>
              <div class="q-ml-md">暂未选择单据类型，请选择单据以后继续操作</div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="q-my-xs">
            <q-card-section class="row items-center q-py-xs">
              <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />已选字段</span>
            </q-card-section>

            <q-separator />
            <q-card-section flat class="row" v-if="selectData.length > 0">
              <div class="text-subtitle2 q-mt-sm q-mb-xs" v-for="(item, key) in selectData" :key="key">
                <q-btn color="info" class="q-mx-xs" :label="item.pValue" @click="deleteContent(key)">
                  <q-badge color="red-4" floating> X </q-badge>
                </q-btn>
              </div>
            </q-card-section>

            <q-card-section flat v-else>
              <div class="q-ml-md">暂未选择单据类型，请选择单据以后继续操作</div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="q-my-xs">
            <q-card-section class="row items-center q-py-xs">
              <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />统计数据</span>
            </q-card-section>

            <q-separator />
            <q-card-section flat>
              <div class="bg-grey-2 q-mt-md" style="height: 500px">
                <ag-grid-vue
                  ref="agGridTable"
                  :gridOptions="gridOptions"
                  class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
                  :columnDefs="columnDefs"
                  :suppressMovableMenu="true"
                  :rowData="invoiceData"
                  :rowDragManaged="true"
                  colResizeDefault="shift"
                  :animateRows="false"
                  :floatingFilter="false"
                  :defaultColDef="defaultColDef"
                  :enableCellTextSelection="true"
                  @first-data-rendered="onFirstDataRendered"
                  rowHeight="50"
                  rowSelection="multiple"
                  :suppressCellSelection="true"
                  :suppressRowClickSelection="true"
                  :context="context"
                  :localeText="localeText"
                  :singleClickEdit="true"
                  :stopEditingWhenGridLosesFocus="true"
                  :suppressRowDeselection="true"
                ></ag-grid-vue>
              </div>
            </q-card-section>
          </q-card>
          <hl-goods-table
            ref="specificationTree"
            rowSelection="multiple"
            v-if="showGoodsList"
            @getSelectedGoodsData="getSelectedGoodsData"
            @closeDialog="showGoodsList = false"
          ></hl-goods-table>
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'reports',
  components: {},
  data () {
    return {
      dataListSelections: {},
      invoiceTyp: [],
      packageStatus: '',
      invoiceType: '',
      showInvoiceData: [],
      selectData: [],
      depotId: [],
      depotData: [],
      addDialog: false,
      selectStoreData: [],
      libInStoreList: [],
      invoiceData: [],
      goodsTypeData: [],
      startTime: '',
      endTime: '',
      searchFrom: {
        searchNumber: '',
        goodsTypeId: '',
        number: '',
        depotName: '',
        handleType: '',
        handle: '',
        consumePayType: [],
        type: [],
        inStatus: '',
        summaryType: ''
      },
      context: null,
      components: {},
      gridOptions: {},
      columnDefs: [],
      localeText: this.$ag_grid_localeText,
      defaultColDef: {
        sortable: true
      },
      showGoodsList: false
    }
  },
  created () {
    if (this.$q.localStorage.getItem('lschainstore_store_local') && this.$q.localStorage.getItem('lschainstore_store_local').openPayment) {
      this.paymentChannel = this.$q.localStorage.getItem('lschainstore_store_local').openPayment
    }
  },
  mounted () {
    this.getList()
    this.getGoodsType()
    if (this.is_main_store) {
      this.getDepotList()
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
    getDepotList () {
      this.$store
        .dispatch('erpdepot/getAllListData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.depotData = res.data
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
    selectInvoice () {
      if (this.packageStatus) {
        this.showInvoiceData = this.packageStatus.value
        this.invoiceType = this.packageStatus.type
        this.selectData = []
      }
    },
    getList () {
      this.$store
        .dispatch('reports/geInvoiceTyps')
        .then((res) => {
          if (res.code == 200) {
            this.invoiceTyp = res.data ? res.data : []
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
    getGoodsType () {
      const obj = {
        goodsType: [1]
      }
      this.$store
        .dispatch('goodstype/getTreeList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.goodsTypeData = res.data
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
    clearButton () {
      this.showInvoiceData = []
      this.packageStatus = ''
      this.invoiceType = ''
      this.columnDefs = []
      this.selectData = []
      this.invoiceData = []
      this.selectStoreData = []
      this.depotId = []
      this.startTime = ''
      this.endTime = ''
      this.searchFrom.searchNumber = ''
      this.searchFrom.goodsTypeId = ''
      this.searchFrom.number = ''
      this.searchFrom.handleType = ''
      this.searchFrom.handle = ''
      this.searchFrom.consumePayType = []
      this.searchFrom.type = ''
      this.searchFrom.inStatus = ''
      this.searchFrom.summaryType = ''
      this.getList()
    },
    selectBtn (key) {
      const newlayout = this.showInvoiceData[key]
      const menuArray = this.selectData
      if (menuArray.length > 0) {
        const data = menuArray.findIndex(function (x) {
          return x.pValue == newlayout.pValue
        })
        if (data <= -1) {
          menuArray.push(newlayout)
        }
      } else {
        this.selectData.push(newlayout)
      }
      this.showInvoiceData[key].status = 1
      this.setColumnDefs()
    },
    setColumnDefs () {
      const col = [
        {
          headerName: '#',
          width: 60,
          pinned: 'left',
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null
          }
        }
      ]
      this.selectData.forEach((item, index) => {
        const colItem = {
          headerName: item.pValue,
          field: item.filed
        }
        col.push(colItem)
      })
      this.columnDefs = col
    },
    deleteContent (key) {
      setTimeout(() => {
        const menuArray = this.showInvoiceData
        const newlayout = this.selectData[key]
        if (menuArray.length > 0) {
          const data = menuArray.findIndex(function (x) {
            return x.pValue == newlayout.pValue
          })
          this.showInvoiceData[data].status = ''
        }
        this.selectData.splice(key, 1)
      }, 100)
      this.setColumnDefs()
    },
    setData (val) {
      let startTime = 0
      let endTime = 0
      startTime = this.$q_date.formatDate(this.startTime, 'X')
      endTime = this.$q_date.formatDate(this.endTime, 'X')
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      const obj = {
        startTime: startTime,
        endTime: endTime,
        invoiceType: this.invoiceType,
        selectData: this.selectData,
        selectStoreData: this.selectStoreData,
        depotId: this.depotId,
        showType: val,
        ...this.searchFrom
      }
      this.$store
        .dispatch('reports/setReportsXls', obj)
        .then((res) => {
          if (res.code == 200) {
            if (parseInt(val) == 1) {
              this.invoiceData = res.data ? res.data : []
              if (this.invoiceData.length > 0) {
                setTimeout(() => {
                  this.setTopTabel(this.invoiceData)
                }, 200)
              }
            } else {
              window.location.href = res.data
            }
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },

    setTopTabel (list) {
      const that = this
      const oneColumn = {}
      if (this.columnDefs && this.columnDefs.length > 0) {
        this.columnDefs.forEach(function (item, key) {
          oneColumn[item.field] = ''
        })
      }

      const newRows = this.countColumnData(list, [oneColumn])
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },

    countColumnData (data = [], condition = []) {
      const that = this
      if (data.length > 0 && condition.length > 0) {
        const rowData = []
        condition.forEach((i, k) => {
          const oneRowData = {}
          for (var j in i) {
            oneRowData[j] = 0

            if (!i[j]) {
              data.forEach((value, key) => {
                if (
                  _.findIndex(that.paymentChannel, function (o) {
                    return j == o.key
                  }) > -1
                ) {
                  if (value.hl_pay && JSON.parse(value.hl_pay) && JSON.parse(value.hl_pay).length > 0) {
                    const hlapyArr = JSON.parse(value.hl_pay)
                    hlapyArr.forEach(function (item, k) {
                      if (item.key == j) {
                        oneRowData[j] += that.formatAmount(item.value)
                      }
                    })
                  } else if (value.extend_pay && JSON.parse(value.extend_pay) && JSON.parse(value.extend_pay).length > 0) {
                    const extendArr = JSON.parse(value.extend_pay)
                    extendArr.forEach(function (item, key) {
                      if (item.key == j) {
                        oneRowData[j] += that.formatAmount(item.value)
                      }
                    })
                  }
                } else {
                  oneRowData[j] += that.formatAmount(value[j])
                }
              })
              oneRowData[j] = that.formatAmount(oneRowData[j])
            } else {
              oneRowData[j] = that.formatAmount(i[j])
            }
          }

          rowData.push(oneRowData)
        })
        return rowData
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
    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = false
      if (data && data.length > 0) {
      }
    },
    bindGoodsTag () {
      this.showGoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType([1, 2, 3])
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
