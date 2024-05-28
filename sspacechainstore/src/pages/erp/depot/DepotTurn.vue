<template>
  <q-page class="fit">
    <q-form ref="addDataRef" class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm q-gutter-sm row items-center">
        <q-select
          outlined
          dense
          class="col-12 col-xs-6 col-sm-2 q-mr-md"
          v-model="turnData.dtd_out_depot"
          :options="depotDataList"
          label="请选择调出仓库"
          option-value="id"
          option-label="ed_name"
          emit-value
          map-options
          :disable="turnData.dtd_out_depot ? true : false"
          :rules="[(val) => !!val || '请选择调出仓库']"
          @input="getBufferList()"
        />
        <q-btn unelevated color="red" @click="resetTurnStore" class="q-mb-md" label="重置调出仓库" :disable="turnData.dtd_out_depot ? false : true"> </q-btn>
        <div class="col-12 col-md-2 q-mb-md">
          <q-input dense outlined v-model="searchValue" label="请输入编码" />
        </div>
        <q-btn color="positive" unelevated label="添加商品" class="q-mb-md"  :disable="searchValue == '' ? true : false" @click="addItemData(searchValue)" />
        <q-btn unelevated color="primary" @click="selectBut()" class="q-mb-md" :disable="turnData.dtd_out_depot  ? false :  true"  label="选择商品"> </q-btn>
        <q-btn unelevated color="red" @click="confirmCleanBufferList()" class="q-mb-md"  label="清空列表" :disable="detailData.length > 1 ? false : true"> </q-btn>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center erp-turn-table full-height"
          ref="agGridTable"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="detailData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="60"
          :gridOptions="gridOptions"
          @first-data-rendered="onFirstDataRendered"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :context="context"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :localeText="localeText"
          :components="components"
        >
        </ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-py-sm text-center q-gutter-sm">
        <q-btn label="确认调拨" unelevated @click="submitData" :disable="!addButtonDisabled && detailData.length > 1 ? false : true" color="primary"  class="q-px-xl" />
        <q-btn label="返回" unelevated :to="{ name: 'erpdepot' }" color="grey" class="q-px-xl" />
      </div>
      <depot-specification-tree-erp ref="specificationTree" v-if="showGoodsList" @getSelectedGoodsData="getSelectedGoodsData" @closeDialog="showGoodsList = false"></depot-specification-tree-erp>
    </q-form>
  </q-page>
</template>
<script>
import PageButton from './components/PageButton'
import AgInput from './components/AgInput.vue'
import AgInSelect from './components/AgInSelect.vue'
import DepotSpecificationTreeErp from './depot-specification-tree-erp.vue'
export default {
  name: 'depotTurn',
  components: {
    AgInput,
    PageButton,
    AgInSelect,
    DepotSpecificationTreeErp
  },
  data () {
    return {
      context: null,
      components: {
        AgInput,
        PageButton,
        AgInSelect
      },
      showGoodsList: false,
      addButtonDisabled: false,
      gridOptions: {},
      detailData: [],
      turnData: {
        dtd_out_depot: ''
      },
      searchValue: '',
      depotDataList: [],
      defaultColDef: {
        rowDragManaged: true
      },
      columnDefs: [
        {
          headerName: '商品名称',
          field: 'eb_goodsName',
          rowSpan: this.rowSpan,
          cellRendererFramework: 'AgInput',
          cellClassRules: {
            'cell-span-erp-turn': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          width: this.nowpx(0.21) + 'px'
        },
        {
          headerName: '规格名称 ',
          field: 'eb_specificationName',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '商品条码',
          field: 'eb_goods_code',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '仓库数量',
          field: 'out_depot_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '调入仓库-库存',
          field: 'depot_id',
          filter: false,
          singleClickEdit: true,
          cellRendererFramework: 'AgInSelect',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '调拨数量',
          field: 'eb_returnNumber',
          width: this.nowpx(0.13) + 'px',
          editable: (p) => {
            return p.data.goods_id
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeReturnNumber
        },

        {
          headerName: '商品单价',
          field: 'eb_goodsPrice',
          width: this.nowpx(0.13) + 'px'
        },

        {
          headerName: '小计',
          field: 'eb_goodsCashAmount',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '备注',
          field: 'eb_goodsNote',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.goods_id > 0
          },

          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '操作',
          field: 'PageButton',
          cellRendererFramework: 'PageButton',
          width: this.nowpx(0.05) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText
    }
  },
  computed: {},
  created () {
    this.getDepotDataAll()
  },
  mounted () {
    // this.getBufferList()
    this.context = this
  },
  methods: {
    resetTurnStore () {
      this.$q
        .dialog({
          title: '确定',
          message: '确定重置本次调拨列表吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.turnData.dtd_out_depot = ''
          if (this.detailData.length > 0) {
            this.cleanBufferlist()
          }
        })
    },

    getDepotDataAll () {
      this.$store.dispatch('erpdepot/getAllData').then((res) => {
        if (res.code == 200) {
          this.depotDataList = res.data ? res.data : []
          this.context = this
        }
      })
    },

    submitData () {
      this.$refs.addDataRef.validate().then((success) => {
        if (success) {
          if (this.detailData.length <= 0) {
            this.$q.notify({
              message: '注意',
              caption: '请选择商品！',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            return false
          }
          if (this.turnData.dtd_out_depot <= 0) {
            this.$q.notify({
              message: '注意',
              caption: '请重新选择调出仓库！',
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
              message: '确认调拨, 是否继续?'
            })
            .onOk(() => {
              this.addButtonDisabled = true
              const obj = {
                ...this.turnData,
                detailData: this.detailData
              }
              this.$store
                .dispatch('erpdepot/setTurnData', obj)
                .then((res) => {
                  if (res.code == 200) {
                    this.$q.notify({
                      message: '成功',
                      caption: '调拨成功！',
                      icon: 'ion-checkmark-circle-outline',
                      color: 'green',
                      timeout: 500,
                      position: 'top-right'
                    })
                  } else {
                    this.$q.notify({
                      message: '注意',
                      caption: '保存失败！',
                      icon: 'ion-close-circle-outline',
                      timeout: 500,
                      position: 'top-right',
                      color: 'red'
                    })

                    this.addButtonDisabled = false
                  }
                  this.$router.push({ name: 'erpdepot' })
                })
                .catch((error) => {})
            })
        }
      })
    },

    addItemData (searchValue) {
      const obj = {
        goodsCode: searchValue,
        in_store_id: this.turnData.dtd_out_depot
      }
      this.addBufferData(obj)
    },

    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      const that = this
      if (data) {
        if (data && data.length > 0) {
          setTimeout(() => {
            const obj = {
              goodsData: data,
              in_store_id: this.turnData.dtd_out_depot
            }
            that.addBufferData(obj)
          }, 500)
        }
      }
    },

    addBufferData (obj) {
      this.$store
        .dispatch('erpdepot/setTurnBuffer', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '成功添加' + (res.data ? res.data : 0) + '条商品',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.searchValue = ''
            this.getBufferList()
          } else {
            this.$q.notify({
              message: '添加失败',
              caption: res.data.msg,
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
      this.showGoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType(1, this.turnData.dtd_out_depot)
        }, 500)
      })
    },

    rowSpan (params) {
      const fields = ['eb_goodsName']
      const data = this.detailData
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
      const cellValue = row[property]
      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        let countRowspan = 0
        if (prevRow && prevRow[property] === cellValue) {
          return countRowspan
        } else {
          countRowspan = 1
          while (nextRow && nextRow[property] === cellValue) {
            nextRow = data[++countRowspan + rowIndex]
          }
          if (countRowspan > 1) {
            return countRowspan
          }
        }
      }
    },

    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },

    getBufferList () {
      this.$store
        .dispatch('erpdepot/getBufferListData', {
          depotId: this.turnData.dtd_out_depot
        })
        .then((res) => {
          if (res.code == 200) {
            this.detailData = res.data ? res.data : []

            this.detailData.push({})
          }
        })
        .catch((error) => {})
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },

    cleanBufferlist () {
      this.$store
        .dispatch('erpdepot/cleanBufferData')
        .then((res) => {
          if (res.code == 200) {
            this.getBufferList()
          }
        })
        .catch((error) => {})
    },

    confirmCleanBufferList () {
      this.$q
        .dialog({
          title: '确定',
          message: '确定清空本次调拨列表吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.cleanBufferlist()
        })
    },

    changeReturnNumber (p) {
      const row = p.data
      const storagePrice = this.formatAmount(row.eb_goodsPrice)
      const returnNumber = row.eb_returnNumber

      const itemsToUpdate = []

      const regu2 = /^[0-9]+\.?[0-9]{0,2}$/
      if (!regu2.test(returnNumber)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正两位小数或整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        p.data.eb_returnNumber = 0
        itemsToUpdate.push(row)
        p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }

      p.data.eb_goodsCashAmount = this.formatAmount(storagePrice * returnNumber)
      itemsToUpdate.push(row)
      p.api.applyTransaction({ update: itemsToUpdate })
    },
    // 格式化数据
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
<style>
.erp-turn-table .cell-span-erp-turn {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
