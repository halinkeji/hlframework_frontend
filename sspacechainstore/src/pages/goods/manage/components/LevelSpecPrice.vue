<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-lg row">
      <div class="col-md-2 col-12 q-px-xs" v-for="(item, key) in levelList" :key="key">
        <q-input v-model="item.value" @change="synchronizeSpeData(key)" standout dense outlined class="q-mt-md" :label="'请输入' + item.headerName">
          <template v-slot:append>
            <div class="q-pl-none" @click="synchronizeSpeData(key)">
              <q-icon name="las la-arrow-circle-down" />
            </div>
          </template>
        </q-input>
      </div>
    </div>

    <div class="col-shrink full-height bg-grey-2 q-mt-md">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableMenu="true"
        :rowData="dataList"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
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
  </div>
</template>
<script>
export default {
  name: 'LevelSpecPrice',
  props: ['goods_id'],
  components: {},
  data () {
    return {
      context: null,
      components: {},
      gridOptions: {},
      dataList: [],
      levelList: [],
      columnDefs: [],
      localeText: this.$ag_grid_localeText,
      memberLevelPrice: '',
      standardBarCode: ''
    }
  },
  mounted () {},
  created () {
    this.getList()
  },
  computed: {},
  methods: {
    agSplicing () {
      const col = [
        {
          headerName: '规格名称',
          field: 'spe'
        }
      ]
      this.columnDefs.forEach((item, index) => {
        const colItem = {
          headerName: item.headerName,
          field: item.field,
          type: item.type,
          leveId: item.id,
          editable: (p) => {
            if (item.type == 'price' && p.data[item.id + '_discount'] > 0) {
              return false
            }
            if (item.type == 'discount' && p.data[item.id + '_price'] > 0) {
              return false
            }
            return true
          },
          onCellValueChanged: this.changePrice
        }
        col.push(colItem)
      })

      this.columnDefs = col
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    // 获取信息列表
    getList () {
      const obj = {
        goods_id: this.goods_id
      }
      this.$store
        .dispatch('goods/getLevelSpecPrice', obj)
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.dataList = res.data.list ? res.data.list : []
            this.levelList = res.data.columns ? res.data.columns : []
            this.columnDefs = res.data.columns
            this.agSplicing()
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
    changePrice (p) {
      const data = p.data
      const regu = /^([0-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
      const regus = /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100.00$)/
      if (p.newValue) {
        if (!regu.test(p.newValue) && p.colDef.type == 'price') {
          data[p.colDef.field] = !p.oldValue ? '' : p.oldValue
          const itemsToUpdate = []
          itemsToUpdate.push(data)
          p.api.applyTransaction({ update: itemsToUpdate })
          this.$q.notify({
            message: '错误',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: '请输入正确的价格',
            color: 'red'
          })
          return false
        } else if (!regus.test(p.newValue) && p.colDef.type == 'discount') {
          data[p.colDef.field] = !p.oldValue ? '' : p.oldValue
          const itemsToUpdate = []
          itemsToUpdate.push(data)
          p.api.applyTransaction({ update: itemsToUpdate })
          this.$q.notify({
            message: '错误',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: '请输入正确的折扣',
            color: 'red'
          })
          return false
        } else {
          const obj = {
            lsp_goods_id: this.goods_id,
            lsp_level_id: parseInt(p.colDef.leveId),
            lsp_spec_id: data.spe_id
          }
          if (p.colDef.type == 'price') {
            obj.lsp_price = p.newValue
          } else {
            obj.lsp_discount = p.newValue
          }
        }
      }
      this.$emit('getMethods', this.dataList)
    },
    saveData (val) {
      this.$store
        .dispatch('goods/setLevelSpecData', val)
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '会员价修改成功',
              color: 'green'
            })
            this.getList()
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
    synchronizeSpeData (keys = null) {
      if (this.dataList && this.levelList[keys]) {
        const tableData = this.dataList
        const changeSpeValue = this.levelList[keys].value
        const field = this.levelList[keys].field
        const type = this.levelList[keys].type
        if (!this.changeSpeDataVerify(type, changeSpeValue)) {
          this.$q.notify({
            message: '注意',
            caption: '请输入正确的格式！',
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
          return false
        }
        const newsTableData = _(tableData).forEach(function (i, k) {
          i[field] = changeSpeValue
        })

        this.dataList = newsTableData
        setTimeout(() => {
          this.gridOptions.api.refreshCells()
        }, 200)
        this.$emit('getMethods', this.dataList)
      }
    },
    changeSpeDataVerify (p, value) {
      if (!value) {
        return false
      }
      switch (p) {
        case 'price':
          var rg = /^([0-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
          return rg.test(value)
          break
        case 'discount':
          var rg = /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100.00$)/
          return rg.test(value)
          break
        default:
          return true
      }
    }
  }
}
</script>
