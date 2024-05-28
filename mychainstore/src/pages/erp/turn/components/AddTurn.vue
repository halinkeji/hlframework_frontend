<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm ">
        <q-form ref="addDataRef" class=" row q-gutter-md">
          <div class="col-12 col-xs-6 col-sm-2 q-mr-md">
          <q-select
            outlined
            dense
            v-model="turnData.gii_inStoreId"
            :options="libInStoreList"
            label="请选择调入门店"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            :disable="turnData.gii_inStoreId ? true : false"
          />
          </div>

          <q-btn unelevated color="red" @click="resetTurnStore"  label="重置调拨门店" :disable="turnData.gii_inStoreId ? false : true"> </q-btn>
          <div class="col-12 col-md-2">
            <q-input dense outlined v-model="searchValue" label="请输入条码" />
          </div>
          <div class="col-12 col-md-4">
            <q-btn  color="positive" unelevated label="添加商品" :disable="searchValue == '' ? true : false" @click="addItemData(searchValue)" />
            <q-btn unelevated  color="primary" @click="selectBut()" label="选择商品"> </q-btn>
            <q-btn unelevated color="red" @click="confirmCleanBufferList()"  label="清空列表" :disable="detailData.length > 1 ? false : true"> </q-btn>
          </div>
        </q-form>
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
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
        <q-btn
          label="确认调拨"
          unelevated
          @click="submitData"
          :disable="!addButtonDisabled && detailData.length > 1 ? false : true"
          color="primary"
          v-if="authorityMeta('add')"
          class="q-px-xl"
        />
        <q-btn label="返回" unelevated :to="{ name: 'erpTurn' }" color="grey"   class="q-px-xl" />
      </div>
      <hl-specification-tree-erp ref="specificationTree" v-if="showGoodsList" @getSelectedGoodsData="getSelectedGoodsData" @closeDialog="showGoodsList = false"></hl-specification-tree-erp>
    </div>
  </q-page>
</template>
<script>
import PageButton from './PageButton'
import AgInput from './AgInput.vue'
import AgOutDepotSelect from './AgOutDepotSelect'
export default {
  name: 'AddTurn',
  components: {
    PageButton,
    AgInput,
    AgOutDepotSelect
  },
  data () {
    return {
      context: null,
      showGoodsList: false,
      addButtonDisabled: false,
      gridOptions: {},
      detailData: [],
      turnData: {
        gii_inStoreId: ''
      },
      searchValue: '',
      libInStoreList: [],
      defaultColDef: {
        rowDragManaged: true
      },
      columnDefs: [
        {
          headerName: '商品条码',
          field: 'eb_goods_code',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
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
          headerName: '规格',
          field: 'eb_specificationName',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '调出仓库-库存',
          field: 'depot_id',
          filter: false,
          singleClickEdit: true,
          cellRendererFramework: 'AgOutDepotSelect',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '现有库存',
          field: 'eb_goodsNumber',
          width: this.nowpx(0.13) + 'px'
        },

        {
          headerName: '商品单价',
          field: 'eb_goodsPrice',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '调拨数量',
          field: 'eb_returnNumber',
          width: this.nowpx(0.13) + 'px',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber
        },

        {
          headerName: '小计',
          field: 'eb_goodsCashAmount',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '操作',
          field: 'PageButton',
          cellRendererFramework: 'PageButton',
          width: this.nowpx(0.13) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      depotData: []
    }
  },
  computed: {},
  created () {
    this.getBufferList()
    this.getDepotList()
    this.getLibInStoreData()
  },
  mounted () {
    this.context = this
  },
  methods: {
    getDepotList () {
      this.$store
        .dispatch('erpdepot/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.depotData = res.data ? res.data : []
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
    resetTurnStore () {
      this.$q
        .dialog({
          title: '确定',
          message: '确定重置本次调拨列表吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.turnData.gii_inStoreId = ''
          if (this.detailData.length > 0) {
            this.cleanBufferlist()
          }
        })
    },
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'otherAll' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
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
          if (this.turnData.gii_inStoreId <= 0) {
            this.$q.notify({
              message: '注意',
              caption: '请重新选择调入门店！',
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
                .dispatch('erpTurn/setTurnData', obj)
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
                  this.$router.push({ name: 'erpTurn' })
                })
                .catch((error) => {})
            })
        }
      })
    },

    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^[0-9]+\.?[0-9]{0,2}$/

      if (!regu.test(data.eb_returnNumber)) {
        data.eb_returnNumber = 1
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })

        this.$q.notify({
          message: '注意',
          caption: '请输入正整数！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
        return false
      } else {
        data.eb_goodsCashAmount = data.eb_goodsPrice * data.eb_returnNumber
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
      }

      if (!p.newValue || p.newValue == p.oldValue) {
        return false
      }
      this.$store
        .dispatch('erpin/editButtfer', data)
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

    addItemData (searchValue) {
      if (this.turnData.gii_inStoreId <= 0) {
        this.$q.notify({
          message: '注意',
          caption: '请重新选择调入门店！',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      const obj = {
        goodsCode: searchValue,
        in_store_id: this.turnData.gii_inStoreId
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
              in_store_id: this.turnData.gii_inStoreId
            }
            that.addBufferData(obj)
          }, 500)
        }
      }
    },

    addBufferData (obj) {
      this.$store
        .dispatch('erpTurn/setBuffData', obj)
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
      if (this.turnData.gii_inStoreId <= 0) {
        this.$q.notify({
          message: '注意',
          caption: '请重新选择调入门店！',
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
        .dispatch('erpTurn/getBufferData')
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
        .dispatch('erpTurn/cleanBufferlist')
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
