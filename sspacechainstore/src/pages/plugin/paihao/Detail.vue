<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.5 + 'px',
        'min-width': this.$q.screen.width * 0.5 + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white  q-px-xs q-pb-md">
          <div class="row q-pa-sm">
            <div class="text-subtitle1">排队详情</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
          </div>

          <div class="q-mb-sm row">
            <div class="col-auto">
              <q-tabs
                @input="getList"
                v-model="detailTab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="left"
                narrow-indicator
              >
                <q-tab name="1" label="正在排号" />
                <q-tab name="2" label="完成排号" />
                <q-tab name="3" label="排号记录" />
              </q-tabs>
            </div>
            <q-space />
            <div class="col-auto">
              <q-btn
                icon="add"
                unelevated
                class="q-mr-sm"
                color="primary"
                label="新增排号"
                @click="setData"
                v-if="parseInt(projectData.pp_status) == 1 && authorityMeta('addPaihao')"
              />
            </div>
          </div>
        </div>
        <div class="col-shrink q-px-sm full-height">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnData"
            :suppressMovableColumns="true"
            :rowData="detailList"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            rowHeight="40"
            @first-data-rendered="onFirstDataRendered"
            :context="context"
            rowSelection="multiple"
            :localeText="localeText"
            :stopEditingWhenGridLosesFocus="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pb-sm text-center justify-center">
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
    </q-card>
  </q-dialog>
</template>
<script>
import DetailAgOperate from './components/DetailAgOperate'

export default {
  name: 'paihaoDetail',
  components: { DetailAgOperate },
  data () {
    return {
      showDialog: true,
      formFieldPoppupStatus: false,
      detailTab: '1',
      projectData: {},
      listsData: {
        ppl_project_id: '',
        ppl_number: '',
        ppl_status: '1',
        ppl_form_id: 0,
        ppl_member_id: ''
      },
      formItem: {
        formId: '',
        memberId: '',
        otherId: 18
      },
      gridOptions: {},
      context: null,
      detailList: [],
      columnData: [

        {
          headerName: '排号',
          field: 'ppl_number'
        },
        {
          headerName: '会员',
          field: 'member.mem_memberName'
        },
        {
          headerName: '排队时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: '完成时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: '操作',
          cellRendererFramework: 'DetailAgOperate'
        }
      ],
      columnDefsForm: [],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getDetail (projectData) {
      this.projectData = projectData
      this.$nextTick(() => {
        this.getList()
      })
    },

    getList () {
      const obj = {
        projectId: this.projectData.id,
        formId: this.projectData.pp_form_id,
        paihaoStatus: this.detailTab,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('paihao/getDetailData', obj)
        .then((res) => {
          this.detailList = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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

    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    setData () {
      const today = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD')

      const startTime = this.$q_date.formatDate(this.projectData.pp_time_start * 1000, 'HH:mm')
      const endTime = this.$q_date.formatDate(this.projectData.pp_time_end * 1000, 'HH:mm')

      const startDateTime = new Date(today + ' ' + startTime).getTime() / 1000
      const endDateTime = new Date(today + ' ' + endTime).getTime() / 1000

      const nowTime = new Date().getTime() / 1000

      if (startDateTime <= nowTime && nowTime <= endDateTime) {
        this.listsData.ppl_project_id = this.projectData.id
        this.listsData.ppl_number = this.projectData.pp_number_prefix

        const data = {
          ...this.listsData
        }
        this.addButtonDisabled = true
        this.$store
          .dispatch('paihao/setListsData', data)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '新增排号成功',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'green'
              })
              this.getList()
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.addButtonDisabled = false
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
      } else {
        this.$q.notify({
          message: '未到排号时间!',
          timeout: 500,
          position: 'top',
          color: 'red'
        })
        return false
      }
    },

    hideNowPage () {
      this.$emit('dataList')
    },

    nowpx (px) {
      let nowWidth = this.$q.screen.width - 610
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
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
