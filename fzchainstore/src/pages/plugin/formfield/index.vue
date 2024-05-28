<template>
  <q-page class="fit">
    <add-form-field ref="addFormFieldRef" v-if="addPoppupStatus" @dataList="hideFormFieldPoppup" />
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm row q-gutter-xs">
        <q-input outlined dense v-model="formData.pff_form_name" label="请输入表单名称" class="col-12 col-md-2" />
        <q-input outlined dense v-model="formData.pff_table_name" label="请输入表名称" class="col-12 col-md-2" />
        <q-btn unelevated color="warning" dense label="搜索" class="q-px-md" @click="getList" v-if="authorityMeta('searchFiled')" />
        <q-btn unelevated color="grey" dense label="重置" @click="clearBtn" class="q-px-md" v-if="authorityMeta('resetFiled')" />
        <q-btn unelevated color="primary" dense label="新增" @click="showAddFormField" class="q-px-md" v-if="authorityMeta('addFiled')" />
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="formFieldData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="onFirstDataRendered"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="40"
          :context="context"
          :localeText="localeText"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :suppressRowTransform="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </div>
  </q-page>
</template>
<script>
import AgOperate from './components/AgOperate'
import AddFormField from './AddFormField'
export default {
  name: 'formField',
  components: {
    AgOperate,
    AddFormField
  },
  data () {
    return {
      addPoppupStatus: false,
      context: '',
      formData: {
        pff_form_name: '',
        pff_table_name: ''
      },
      formFieldData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.04) + 'px'
        },
        {
          headerName: '表单名称',
          field: 'pff_form_name',
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: '表单备注',
          field: 'pff_form_remarks',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '表名称',
          field: 'pff_table_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '添加时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '操作',
          width: this.nowpx(0.2) + 'px',
          cellRendererFramework: 'AgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getList () {
      const params = {
        formName: this.formData.pff_form_name,
        tableName: this.formData.pff_table_name,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('formfield/getListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.formFieldData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 272
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    showAddFormField (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addFormFieldRef.init(id)
      })
    },
    clearBtn () {
      this.formData = {}
      this.getList()
    },
    hideFormFieldPoppup () {
      this.addPoppupStatus = false
      this.getList()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
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
