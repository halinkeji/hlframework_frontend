<template>
  <div>
    <div class="text-right q-my-xs">
      <q-btn unelevated color="green" @click="addData()" label="添加联系人" />
    </div>

    <ag-grid-vue
      ref="agGridTable"
      :gridOptions="gridOptions"
      class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
      :columnDefs="columnDefs"
      :suppressMovableColumns="true"
      :stopEditingWhenGridLosesFocus="true"
      :suppressRowDeselection="true"
      :defaultColDef="defaultColDef"
      @first-data-rendered="adaptiveTable"
      :rowData="supplierContactData"
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
      domLayout="autoHeight"
    ></ag-grid-vue>
  </div>
</template>

<script>
export default {
  props: ['supplierId'],
  name: 'SupplierContactPerson',
  components: {},
  data () {
    return {
      search: '',
      defaultColDef: {},
      context: null,
      localeText: this.$ag_grid_localeText,
      columnDefs: [
        {
          headerName: '联系人姓名',
          field: 'esc_name',
          filter: false,
          singleClickEdit: true,
          editable: true,
          onCellValueChanged: this.changeInfo,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '电话号',
          field: 'esc_telephone',
          filter: false,
          singleClickEdit: true,
          editable: true,
          onCellValueChanged: this.changeTele,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '固定电话',
          field: 'esc_tel_code',
          filter: false,
          singleClickEdit: true,
          editable: true,
          onCellValueChanged: this.changeInfo,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '微信号',
          field: 'esc_wechat_code',
          filter: false,
          singleClickEdit: true,
          editable: true,
          onCellValueChanged: this.changeInfo,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '是否主要联系人',
          field: 'esc_primary',
          filter: false,
          valueGetter: p => {
            if (p.data.esc_primary == '1') {
              return '是'
            } else if (p.data.esc_primary == '2') {
              return '否'
            } else {
              return p.data.esc_primary
            }
          },
          singleClickEdit: true,
          editable: true,
          onCellValueChanged: this.changeMain,
          width: this.nowpx(0.1) + 'px'
        }
      ],
      gridOptions: {},
      supplierContactData: []
    }
  },
  mounted () {},
  created () {
    if (this.supplierId) {
      this.getList()
    }
  },
  computed: {},
  methods: {
    addData () {
      const item = {
        id: 0,
        esc_name: '',
        esc_telephone: '',
        esc_tel_code: '',
        esc_wechat_code: '',
        esc_primary: '是'
      }
      this.supplierContactData.push(item)
      this.$emit('getData', this.supplierContactData)
    },
    getList () {
      const obj = {
        supplier_id: this.supplierId
      }
      this.$store
        .dispatch('osupplier/getContactData', obj)
        .then(res => {
          if (parseInt(res.code) == 200) {
            this.supplierContactData = res.data ? res.data : []
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
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },

    changeMain (p) {
      const itemsToUpdate = []
      if (p.newValue != '是') {
        p.data.esc_primary = '否'
      }
      itemsToUpdate.push(p.data)
      p.api.applyTransaction({ update: itemsToUpdate })
    },
    changeInfo (p) {
      this.$emit('getData', this.supplierContactData)
    },
    changeTele (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^1[3|4|5|7|8][0-9]{9}$/
      if (!regu.test(data.esc_telephone)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正确的电话号码',
          color: 'red'
        })
        data.esc_telephone = ''
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
      }
    },

  }
}
</script>

<style></style>
