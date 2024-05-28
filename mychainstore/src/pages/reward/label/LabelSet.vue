<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="q-gutter-x-md row col-shrink bg-white q-px-xs q-pt-sm q-pb-md text-subtitle2">
      <q-input outlined dense class="col-12 col-xs-6 col-sm-2" v-model="name" label="标签名称" />
      <q-btn color="primary" unelevated class="col-12 col-xs-6 col-sm-1" @click="getLabelList" label="查询" />
      <q-btn color="warning" class="col-12 col-xs-6 col-sm-1" unelevated @click="clearBut" label="重置" />
      <q-btn color="primary" unelevated class="col-12 col-xs-6 col-sm-1" @click="addLabelData" label="新增" />
      <q-btn
        color="red"
        unelevated
        class="col-12 col-xs-6 col-sm-1"
        :disable="dataListSelections.length > 0 ? false : true"
        @click="delLabelAll"
        label="批量删除"
      />
    </div>

    <div class="col-shrink q-px-xs full-height bg-white ">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="labelListData"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :context="context"
        :localeText="localeText"
        @first-data-rendered="onFirstDataRendered"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="40"
        rowSelection="multiple"
        @rowSelected="rowSelectedAg"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </div>
    <add-label ref="addLabelRef" @colseDialog="getLabelList" v-if="addLabelStatus" />
  </div>
</template>
<script>
import AddLabel from './AddLabel.vue'
import AgButton from './AgButton.vue'
export default {
  name: 'LabelSet',
  components: {
    AgButton,
    AddLabel
  },
  data () {
    return {
      name: '',
      context: '',
      gridOptions: {},
      labelListData: [],
      dataListSelections: [],
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
          headerName: '标签名称',
          field: 'prl_label_name',
          width: this.nowpx(0.24) + 'px'
        },
        {
          headerName: '绩效方式',
          field: '',
          valueGetter: function (p) {
            if (p.data.prl_mode == 1) {
              return '固定金额'
            }
            if (p.data.prl_mode == 2) {
              return '抽成比例'
            }
          },
          width: this.nowpx(0.24) + 'px'
        },
        {
          headerName: '固定金额',
          field: '',
          valueGetter: (labelListData) => {
            return labelListData.data.prl_label_price
          },
          width: this.nowpx(0.24) + 'px'
        },
        {
          headerName: '抽成比例',
          field: '',
          valueGetter: (labelListData) => {
            return labelListData.data.prl_label_proportion
          },
          width: this.nowpx(0.24) + 'px'
        },

        {
          headerName: '操作',
          cellRendererFramework: 'AgButton',
          width: this.nowpx(0.24) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      addLabelStatus: false
    }
  },
  created () {
    this.context = this
  },
  mounted () {
    this.getLabelList()
  },
  computed: {},
  methods: {
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    getLabelList () {
      this.addLabelStatus = false
      const obj = {
        name: this.name,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('rewardLabel/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.labelListData = res.data ? res.data.list : [] // 三元运算赋值
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.dataListSelections = {}
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
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getLabelList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getLabelList()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearBut () {
      this.name = ''
      this.getLabelList()
    },
    delLabelAll () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除 ${this.dataListSelections.length} 条吗`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const dataListSelections = this.dataListSelections
          if (dataListSelections.length > 0) {
            const obj = dataListSelections.map((item) => {
              return item.id
            })
            this.$store.dispatch('rewardLabel/delData', obj).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green',
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 条'
                })
                this.getLabelList()
                this.dataListSelections = []
              }
            })
          }
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
    },
    addLabelData (labelId) {
      this.addLabelStatus = true

      this.$nextTick(() => {
        this.$refs.addLabelRef.init(labelId)
      })
    }
  }
}
</script>
