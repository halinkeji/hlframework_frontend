<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white  q-pb-md">
      <div class="row q-gutter-x-sm">
        <q-select
          outlined
          class="col-12 col-md-2 q-mt-sm"
          option-label="mcl_level_name"
          option-value="id"
          emit-value
          map-options
          v-model="levelData"
          :options="levelList"
          option-disable="inactive"
          dense
          label="会员级别"
        />
        <q-input class="col-12 col-md-2 q-mt-sm" :label="`请输入会员所需${$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit}`" outlined v-model="memberLevelPrice" dense />
        <q-btn unelevated color="primary" class="col-12 col-md-1 q-mt-sm" @click="changeStatus()">确认 </q-btn>
        <q-btn unelevated color="warning" class="col-12 col-md-1 q-mt-sm" @click="clearBut()">重置</q-btn>
      </div>
    </div>
    <div class="col-shrink  full-height ">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
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
  name: 'JfmallPointPrice',
  props: ['goods'],
  components: {},
  data () {
    return {
      levelData: '',
      context: null,
      components: {},
      gridOptions: {},
      dataList: [],
      levelList: [],
      columnDefs: [],
      localeText: this.$ag_grid_localeText,
      memberLevelPrice: ''
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getList()
  },
  methods: {
    AgSplicing () {
      const col = [
        {
          headerName: '规格名称',
          field: 'spe'
        }
      ]
      this.levelList.forEach((item) => {
        const colItem = {
          headerName: item.mcl_level_name,
          field: item.id,
          editable: true,
          onCellValueChanged: this.changePrice
        }
        col.push(colItem)
      })

      this.columnDefs = col
    },
    // 获取信息列表
    getList () {
      const obj = {
        goods_id: this.goods
      }
      this.$store
        .dispatch('savingPrice/getList', obj)
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.dataList = res.data.list ? res.data.list : []
            this.levelList = res.data.level ? res.data.level : []
            this.AgSplicing()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: '操作失败',
            color: 'red'
          })
        })
    },
    changePrice (p) {
      const data = p.data
      const regu = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
      if (!regu.test(p.newValue)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正确的金额',
          color: 'red'
        })
        this.getList()
      } else {
        const obj = {
          goods_id: this.goods,
          level_id: parseInt(p.colDef.field),
          spe_id: data.spe_id,
          jsp_price: p.newValue
        }
        this.saveData(obj)
      }
    },
    changeStatus () {
      if (!this.levelData) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请选择会员等级',
          color: 'red'
        })
        return ''
      }
      const regu = /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
      if (!regu.test(this.memberLevelPrice)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正确的金额',
          color: 'red'
        })
        return ''
      }
      const obj = {
        goods_id: this.goods,
        level_id: this.levelData,
        jsp_price: this.memberLevelPrice
        // id: priceId
      }
      this.$store
        .dispatch('savingPrice/SetAll', obj)
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '所需' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '修改成功',
              color: 'green'
            })
            this.clearBut()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    saveData (val) {
      this.$store
        .dispatch('savingPrice/setData', val)
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '所需' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '修改成功',
              color: 'green'
            })
            this.clearBut()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    clearBut () {
      this.memberLevelPrice = ''
      this.levelData = ''
      this.getList()
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
