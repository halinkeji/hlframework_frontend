<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="q-gutter-x-xs row">
          <q-input class="col-12 col-md-3 q-mt-sm" @keyup.enter="addItemData(searchCode)" outlined v-model="searchCode" label="请输入条码" dense />
          <q-btn
            color="green"
            class="q-mt-sm"
            unelevated
            v-if="authorityMeta('code')"
            label="条码添加"
            :disable="searchCode"
            @click="addItemData(searchCode)"
          />
          <q-btn color="primary" class="q-mt-sm" unelevated v-if="authorityMeta('select')" label="选择商品" @click="selectBut" />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table erp-change-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="changeData"
          :context="context"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md q-mt-xs q-gutter-sm text-center">
        <q-btn color="primary" class="q-px-xl" unelevated  @click="submitData" label="提交" />
        <q-btn color="grey" class="q-px-xl"  :to="{ name: 'erpChange' }" unelevated label="返回" />
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
import AgCountType from './AgCountType.vue'
import AgInput from './AgInput'
import AgSelect from './AgSelect'
export default {
  name: 'AddErpChange',
  components: {
    AgButton,
    AgCountType,
    AgInput,
    AgSelect
  },
  data () {
    return {
      gridOptions: {},
      context: null,
      showGoodsList: false,
      components: {
        AgButton,
        AgCountType,
        AgInput,
        AgSelect
      },
      searchCode: '',
      columnDefs: [
        {
          headerName: '商品条码',
          field: 'gic_goods_code',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          pinned: 'left'
        },
        {
          headerName: '名称',
          field: 'gic_name',
          cellRendererFramework: 'AgInput',
          width: this.nowpx(0.2) + 'px',
          pinned: 'left'
        },
        {
          headerName: '规格',
          field: 'gic_speName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '盘点仓库',
          field: 'depot_id',
          filter: false,
          singleClickEdit: true,
          cellRendererFramework: 'AgSelect',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '总库存',
          field: 'gic_oldNumber',
          width: this.nowpx(0.12) + 'px',
          valueGetter: (p) => {
            if (p.data.id) {
         
          
              return (
                p.data.gic_oldNumber +
                (p.data.goods && p.data.goods.id && p.data.goods.goodsUnit && p.data.goods.goodsUnit.id ? '/' + p.data.goods.goodsUnit.gu_name : '')
              )
            }
          },
        },
        {
          headerName: '盘点数量',
          field: 'gic_number',
          editable: true,
          // editable: true,
          singleClickEdit: true,
          onCellValueChanged: this.countMethor,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '类型',
          field: 'gic_inventoryChangeType',
          editable: true,
          singleClickEdit: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values: ['正常', '盘盈', '盘亏', '领用', '报废', '其他']
          },
          valueGetter: this.changeModeTitle,
          onCellValueChanged: this.changeModeValue,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '原因',
          field: 'gic_reason',
          editable: true,
          singleClickEdit: true,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgButton',
          width: this.nowpx(0.05) + 'px',
          pinned: 'right'
        }
      ],
      changeData: [],
      localeText: this.$ag_grid_localeText,
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      roleOptions: [
        { title: '正常', id: '6' },
        { title: '盘盈', id: '1' },
        { title: '盘亏', id: '2' },
        { title: '领用', id: '3' },
        { title: '报废', id: '4' },
        { title: '其他', id: '5' }

      ],
      depotData: []
    }
  },
  created () {
    this.getDepotList()
  },
  mounted () {
    this.getList()
  },
  computed: {},
  methods: {
    getDepotList () {
      this.$store
        .dispatch('erpdepot/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.depotData = res.data ? res.data : []
            this.context = this
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
    getList () {
      this.$store.dispatch('erpchange/listin').then((res) => {
        if (res.data) {
          const goodsPackageDetail = []
          res.data.forEach(function (item) {
            const goodsPackage = {}
            goodsPackage.gic_goods_code = item.eb_goods_code
            goodsPackage.gic_name = item.eb_goodsName
            goodsPackage.gic_reason = ''
            goodsPackage.gic_speName = item.eb_specificationName
            goodsPackage.gic_inventoryChangeType = 6
            goodsPackage.gic_number = '0'
            goodsPackage.gic_oldNumber = item.eb_goodsNumber
            goodsPackage.goods_id = item.goods_id
            goodsPackage.spe_id = item.eb_specificationId
            goodsPackage.id = item.id
            goodsPackage.depot_id = item.depot_id
            goodsPackage.depot_number = item.depot_number
            goodsPackage.goods = item.goods
            goodsPackageDetail.push(goodsPackage)
          })
          this.changeData = goodsPackageDetail
        } else {
          this.changeData = []
        }
        // this.changeData.push({})
      })
    },
    addItemData (searchCode) {
      const obj = {
        goodsCode: searchCode
      }
      this.getSelectedGoodsData(obj)
    },
    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      if (data) {
        setTimeout(() => {
          this.addBufferData(data)
        }, 1000)
      }
    },
    searchData () {
      if (this.searchCode) {
        const obj = {
          goodsCode: this.searchCode
        }
        this.addBufferData(obj)
      }
    },
    addBufferData (data) {
      this.$store
        .dispatch('erpchange/addcache', data)
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
            this.getList()
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

          this.searchCode = ''
          this.getList()
        })
        .catch((error) => {})
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

    countMethor (p) {
      const itemsToUpdate = []
      const data = p.data
      const re = /^[0-9]*[1-9][0-9]*$/
      if (!re.test(p.data.gic_number)) {
        data.gic_number = 0
      }
      itemsToUpdate.push(p.data)
      const res = p.api.applyTransaction({ update: itemsToUpdate })
    },

    // 提交盘点
    submitData () {
      if (this.changeData.length <= 1) {
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
            checkData: this.changeData
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

    // 编辑的表格展示部分
    changeModeTitle (p) {
      const titleIndex = _.findIndex(this.roleOptions, function (o) {
        return o.id == p.data.gic_inventoryChangeType
      })
      if (parseInt(titleIndex) >= 0) {
        return this.roleOptions[titleIndex].title
      }
    },

    // 修改的逻辑部分
    changeModeValue (p) {
      const itemsToUpdate = []
      const data = p.data
      const roleOptions = this.roleOptions
      const titleIndex = _.findIndex(roleOptions, function (o) {
        return o.title == p.data.gic_inventoryChangeType
      })
      data.gic_inventoryChangeType = parseInt(roleOptions[titleIndex].id)
      itemsToUpdate.push(data)
      const res = p.api.applyTransaction({ update: itemsToUpdate })
    },

    rowSpan (params) {
      const fields = ['gic_name']
      const data = this.changeData
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
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        // params.api.sizeColumnsToFit()
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
