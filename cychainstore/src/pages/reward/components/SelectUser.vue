<template>
  <q-page>
    <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
        class="q-pa-sm "
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">职员列表</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>

        <div class="row  q-ml-md q-mt-md">
          <q-input class="col-12 col-md-4 q-mt-sm" outlined v-model="searchValue" label="名称/电话" dense />
          <q-btn color="primary" class=" q-mt-sm q-mx-md" unelevated @click="getUser">搜索</q-btn>
          <q-btn color="grey-6" unelevated @click="handleFormReset" class="q-mt-sm q-mr-md">重置</q-btn>
        </div>
        <div
          class="q-pa-md"
          :style="{
            height: this.$q.screen.height * 0.7 + 'px',
            'max-height': this.$q.screen.height * 0.7 + 'px',
          }"
        >
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham  ag-grid-table full-height hl_header_center hl_content_center goods-select-table"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="userData"
            rowSelection="single"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            :floatingFilter="false"
            :enableCharts="true"
            :enableRangeSelection="true"
            :enableCellTextSelection="true"
            :suppressRowTransform="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="false"
            :rowMultiSelectWithClick="true"
            :localeText="localeText"
            rowHeight="45"
          ></ag-grid-vue>
        </div>
        <q-card-actions class="q-py-xs">
          <div class="row full-width justify-center q-gutter-sm">
           <q-btn class="q-px-xl" unelevated color="green" @click="getSelectedTabel(false)"  label="确定" />
            <q-btn class="q-px-xl" unelevated color="grey"  @click="hideNowPage" label="关闭" />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'SelectUser',
  data () {
    return {
      dialogWidth: '1000px',
      addStoreSidebar: false,
      dataId: 0,
      searchValue: '',
      userData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: ' 职员名称',
          field: 'username',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '联系电话',
          field: 'mobile',
          width: this.nowpx(0.17) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      }
    }
  },
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.4) + 'px'
    }
  },
  computed: {},
  created () {},
  methods: {
    getUser () {
      this.addStoreSidebar = true
      const obj = {
        name: this.searchValue
      }
      this.$store.dispatch('reward/getUserDataLists', obj).then((res) => {
        if (res.code == 200) {
          this.userData = res.data ? res.data : []
        }
      })
    },
    getSelectedTabel (val) {
      const selectedRows = this.gridOptions.api.getSelectedRows()
      this.activePrompt = val
      this.$emit('getSelectedUserData', selectedRows, val)
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    hideNowPage () {
      this.addStoreSidebar = false
    },
    handleFormReset () {
      this.searchValue = ''
      this.getUser()
    }
  }
}
</script>
