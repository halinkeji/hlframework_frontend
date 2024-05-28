<template>
  <div class="q-ma-sm">
    <ag-grid-vue
      ref="agGridTable"
      :gridOptions="gridOptions"
      class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
      :columnDefs="columnDefs"
      :suppressMovableColumns="true"
      :stopEditingWhenGridLosesFocus="true"
      @first-data-rendered="onFirstDataRendered"
      :suppressRowDeselection="true"
      :defaultColDef="defaultColDef"
      :rowData="levelPrice"
      rowSelection="multiple"
      :rowDragManaged="true"
      colResizeDefault="shift"
      :animateRows="false"
      rowHeight="40"
      :floatingFilter="false"
      :enableCellTextSelection="true"
      :suppressCellSelection="true"
      :suppressRowClickSelection="true"
      :suppressRowTransform="true"
      :localeText="localeText"
      :context="context"
      domLayout="autoHeight"
    ></ag-grid-vue>
  </div>
</template>
<script>
export default {
  name: 'LevelPrice',
  props: ['goods_id'],
  components: {},
  data () {
    return {
      defaultColDef: {},
      context: null,
      columnDefs: [
        {
          headerName: '会员等级',
          field: 'level_name',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '等级折扣',
          field: 'mlp_discount',
          filter: false,
          width: this.nowpx(0.2) + 'px',
          editable: (p) => {
            if (p.data.mlp_price > 0) {
              return false
            }
            return true
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeDiscount
        },
        {
          headerName: '价格',
          field: 'mlp_price',
          filter: false,
          width: this.nowpx(0.2) + 'px',
          editable: (p) => {
            if (p.data.mlp_discount > 0) {
              return false
            }
            return true
          },
          singleClickEdit: true,
          onCellValueChanged: this.changePrice
        }

      ],
      gridOptions: {},
      levelPrice: [],
      dataListSelections: [],
      localeText: this.$ag_grid_localeText
    }
  },
  mounted () {},
  created () {
    this.getList()
  },
  computed: {},
  methods: {
    getList () {
      const obj = {
        goods_id: this.goods_id
      }
      this.$store
        .dispatch('goods/getLevelPrice', obj)
        .then(res => {
          if (parseInt(res.code) == 200) {
            this.levelPrice = res.data ? res.data : []
          }
        })
        .catch(error => {
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
    changeDiscount (p) {
      const data = p.data
      const regu = /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100.00$)/
      if (p.newValue) {
        if (!regu.test(p.newValue)) {
          data[p.colDef.field] = !p.oldValue ? '' : p.oldValue
          data.mlp_discount = 0
          const itemsToUpdate = []
          itemsToUpdate.push(data)
          p.api.applyTransaction({ update: itemsToUpdate })
          this.$q.notify({
            message: '错误',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: '请输入正确的数值',
            color: 'red'
          })
          return false
        }
      }
      this.$emit('getMethods', this.levelPrice)
    },
    changePrice (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^([0-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
      if (p.newValue) {
        if (!regu.test(p.newValue)) {
          data[p.colDef.field] = !p.oldValue ? '' : p.oldValue
          data.mlp_price = 0
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
        }
      }
      this.$emit('getMethods', this.levelPrice)
    },
    saveData (val) {
      this.$store
        .dispatch('goods/setLevelPriceData', val)
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
    }
  }
}
</script>
