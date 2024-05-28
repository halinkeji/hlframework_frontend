<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-md">
        <q-chip
          square
          class=" q-pl-sm"
          color="red"
          text-color="white"
          icon="report_problem"
          label="提示：申请模版时，请把示例中的 # 换成 $ 内容随意更换，但是变量不能更换 例： #{userName} 改：${userName} 。"
        />
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham hl_header_center hl_content_center  full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="orderDataFormList"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="adaptiveTable"
          rowHeight="50"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md"></div>
    </div>
  </q-page>
</template>

<script>
import Mode from './AgMode'
import AgButton from './AgButton'
export default {
  name: 'SmsTemplate',
  components: {
    Mode,
    AgButton
  },
  data () {
    return {
      orderDataFormList: [],
      components: {
        Mode,
        AgButton
      },
      dataForm: {},
      isFormValid: true,
      menuListData: [],

      gridOptions: {},
      context: null,

      goodsUnitData: [],
      columnDefs: [
        {
          headerName: '模板名称',
          field: 'st_name',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '模板Code',
          field: 'st_templateCode',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '模板内容',
          field: 'st_templateContent',
          filter: false,
          width: this.nowpx(0.5) + 'px',
          tooltipField: 'st_templateContent'
        },
        {
          headerName: '是否启用',
          field: 'st_templateStatus',
          filter: false,
          cellRendererFramework: 'Mode',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: ' 操作',
          filter: false,
          cellRendererFramework: 'AgButton',
          width: this.nowpx(0.1) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText
    }
  },

  computed: {},
  created () {},
  mounted () {
    this.getInfo()
    this.context = this
  },
  methods: {

    // 自适应
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    getInfo () {
      this.$store.dispatch('alSms/getTemData').then((res) => {
        if (res.code == 200) {
          this.orderDataFormList = res.data ? res.data : []
        }
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
