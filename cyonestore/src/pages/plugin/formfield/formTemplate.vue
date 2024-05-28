<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <add-template ref="addTemplateRef" v-if="addPoppupStatus" @dataList="hideTemplatePoppup" />
      <div class="col-shrink bg-white q-px-xs q-py-sm row q-gutter-xs">
        <div class="col-12 col-md-2">
          <q-input square outlined readonly dense v-model="startTime" label="开始日期">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="startTime" minimal mask="YYYY-MM-DD HH:mm:ss">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-md-2 col-12">
          <q-input square outlined readonly dense label="结束日期" v-model="endTime">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="endTime" minimal mask="YYYY-MM-DD HH:mm:ss">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-btn unelevated color="warning" dense label="搜索" class="q-px-md" @click="getList"  />
        <q-btn unelevated color="grey" dense label="重置" @click="clearBtn" class="q-px-md"  />
        <q-btn unelevated color="primary" dense label="新增" @click="showAddTemplate" class="q-px-md" v-if="authorityMeta('addTemplate')" />
        <q-btn unelevated color="green" dense label="全部导出" @click="exportBtn" class="q-px-md"  />
        <q-btn unelevated color="grey" dense label="返回" class="q-px-md" :to="{ name: 'formfield' }" />
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="templateData"
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
import TemplateAgOperate from './components/TemplateAgOperate'
import AddTemplate from './AddTemplate'
export default {
  name: 'formTemplate',
  components: {
    TemplateAgOperate,
    AddTemplate
  },
  data () {
    return {
      addPoppupStatus: false,
      startTime: '',
      endTime: '',
      context: '',
      templateData: [],
      gridOptions: {
        onGridReady: function (p) {
          p.api.sizeColumnsToFit()
        }
      },
      columnDefs: [],
      columnDefsHead: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: 60
        }
      ],
      columnDefsFoot: [
        {
          headerName: '添加时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: 260
        },
        {
          headerName: '操作',
          cellRendererFramework: 'TemplateAgOperate',
          width: 250
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
      let start = ''
      let end = ''
      if (this.startTime) {
        start = new Date(this.startTime).getTime() / 1000
      }
      if (this.endTime) {
        end = new Date(this.endTime).getTime() / 1000
      }
      const params = {
        startTime: start,
        endTime: end,
        formId: this.$route.query.id,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('formfield/getTemplateList', params)
        .then((res) => {
          if (res.code == 200) {
            this.templateData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? parseInt(res.data.page.totalCount) : 0
            if (res.data.columnDefs.length > 0) {
              const columnDefs = this.columnDefsHead.concat(res.data.columnDefs)
              this.gridOptions.api.setColumnDefs(columnDefs.concat(this.columnDefsFoot))
              this.gridOptions.api.sizeColumnsToFit()
            }
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
    showAddTemplate (id) {
      this.addPoppupStatus = true
      const idData = {
        formId: this.$route.query.id,
        templateId: parseInt(id) > 0 ? id : false
      }
      this.$nextTick(() => {
        this.$refs.addTemplateRef.getList(idData)
      })
    },
    clearBtn () {
      this.startTime = ''
      this.endTime = ''
      this.getList()
    },
    exportBtn () {
      this.gridOptions.api.exportDataAsCsv()
    },
    hideTemplatePoppup () {
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
