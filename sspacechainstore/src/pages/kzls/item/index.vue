<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-xs q-pt-sm">
      <q-input outlined dense v-model="itemData.pki_name" label="请输入开支项" class="col-12 col-md-2" />
      <q-select
        outlined
        class="col-12 col-md-2"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        v-model="activeName"
        :options="[
          { label: '开支', value: 1 },
          { label: '收入', value: 2 },
        ]"
        dense
        label="记录类型"
      />
      <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList()" />
      <q-btn unelevated color="warning" dense label="重置" @click="clearBut()" class="q-px-md" />
      <q-btn unelevated color="primary" dense label="新增开支项" @click="showPopup()" class="q-px-md" />
      <q-btn unelevated color="primary" dense label="新增开支明细" @click="showAddDetail()" class="q-px-md" />
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <q-table
        bordered
        :data="itemListData"
        :pagination="{
          rowsPerPage: 0,
        }"
        hide-bottom
        :columns="columns"
        separator="cell"
        flat
        row-key="name"
        class="full-height"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width class="text-center">
              <q-btn
                size="sm"
                flat
                color="primary"
                round
                dense
                v-if="props.row.detail && props.row.detail.length > 0"
                @click="props.row.expand = !props.row.expand"
                :icon="props.row.expand ? 'las la-angle-down' : 'las la-angle-right'"
              />
            </q-td>
            <q-td key="pki_name" :props="props">
              {{ props.row.pki_name }}
            </q-td>
            <q-td key="pki_status" :props="props">
              <q-chip v-if="props.row.pki_status == '1'" class="text-white" color="red" square> 开支 </q-chip>
              <q-chip v-if="props.row.pki_status == '2'" class="text-white" color="green" square> 收入 </q-chip>
            </q-td>
            <q-td key="pki_detail" :props="props">
              {{ props.row.pki_detail }}
            </q-td>
            <q-td key="priceTotal" :props="props">
              {{ props.row.priceTotal }}
            </q-td>
            <q-td key="id" :props="props">
              <q-btn flat rounded color="primary" class="q-mr-sm" icon="create" @click="showPopup(props.row.id)" />
              <q-btn flat rounded color="warning" class="" icon="visibility" @click="showKzlsDetail(props.row.id)" />
              <q-btn flat rounded color="red" icon="delete_forever" @click="delKzlsData(props.row)" />
            </q-td>
          </q-tr>
          <q-tr v-show="props.row.expand" :props="props" class="q-pa-none">
            <q-td colspan="100%" class="no-padding">
              <q-table
                :pagination="{
                  rowsPerPage: 0,
                }"
                hide-header
                hide-bottom
                :data="props.row.detail"
                flat
                :columns="columnsDetail"
                row-key="name"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="pki_name" :props="props">
                      {{ props.row.pki_name }}
                    </q-td>
                    <q-td key="pki_status" :props="props">
                      <q-chip v-if="props.row.pki_status == '1'" class="text-white" color="red" square> 开支 </q-chip>
                      <q-chip v-if="props.row.pki_status == '2'" class="text-white" color="green" square> 收入 </q-chip>
                    </q-td>
                    <q-td key="pki_detail" :props="props">
                      {{ props.row.pki_detail }}
                    </q-td>
                    <q-td key="priceTotal" :props="props">
                      {{ props.row.priceTotal }}
                    </q-td>
                    <q-td key="id" :props="props">
                      <q-btn flat rounded color="primary" class="q-mr-sm" icon="create" @click="showAddDetail(props.row.id,props.row.pki_status)" />
                      <q-btn flat rounded color="warning" class="" icon="visibility" @click="showKzlsDetail(props.row.id)" />
                      <q-btn flat rounded color="red" icon="delete_forever" @click="delKzlsData(props.row)" />
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div class="col-shrink bg-white q-pb-md">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </div>
    <add-kzls-item ref="addRef" v-if="addPoppupStatus" @dataList="getList" />
    <add-kzls-detail ref="addDetailRef" v-if="addDetailStatus" @dataList="getList"></add-kzls-detail>
    <kzls-detail ref="DetailRef" v-if="detailStatus" @dataList="detailStatus = false"></kzls-detail>
  </div>
</template>
<script>
import AgChip from './AgChip'
import AgOperate from './AgOperate'
import AddKzlsDetail from './AddKzlsDetail'
import AddKzlsItem from './AddKzlsItem'
import KzlsDetail from './KzlsDetail.vue'
export default {
  name: 'KzlsItem',
  components: {
    AgChip,
    AgOperate,
    AddKzlsDetail,
    AddKzlsItem,
    KzlsDetail
  },
  data () {
    return {
      activeName: '',
      addDetailStatus: false,
      addPoppupStatus: false,
      detailStatus: false,
      typeOptions: [
        {
          label: '开支',
          value: '1'
        },
        {
          label: '收入',
          value: '2'
        }
      ],
      itemData: {
        pki_name: '',
        pki_status: ''
      },
      context: '',
      gridOptions: {},
      itemListData: [],

      columns: [
        {
          name: 'expand',
          label: '',
          align: 'center',
          field: 'expand',
          style: 'width:5%'
        },
        {
          name: 'pki_name',
          label: '开支项',
          align: 'center',
          field: 'pki_name',
          style: 'width:20%'
        },
        {
          name: 'pki_status',
          align: 'center',
          label: '开支类型',
          field: 'pki_status',
          style: 'width:15%'
        },
        {
          name: 'pki_detail',
          align: 'center',
          label: '开支明细',
          field: 'pki_detail',
          style: 'width:30%'
        },
        {
          name: 'priceTotal',
          align: 'center',
          label: '统计',
          field: 'priceTotal',
          style: 'width:15%'
        },

        {
          name: 'id',
          label: '操作',
          align: 'center',
          field: 'id',
          style: 'width:15%'
        }
      ],
      columnsDetail: [
        {
          name: 'pki_name',
          label: '开支项',
          align: 'center',
          field: 'pki_name',
          style: 'width:25%'
        },
        {
          name: 'pki_status',
          align: 'center',
          label: '开支项',
          field: 'pki_status',
          style: 'width:15%'
        },
        {
          name: 'pki_detail',
          align: 'center',
          label: '开支明细',
          field: 'pki_detail',
          style: 'width:30%'
        },
        {
          name: 'priceTotal',
          align: 'center',
          label: '统计',
          field: 'priceTotal',
          style: 'width:15%'
        },
        {
          name: 'id',
          label: '操作',
          align: 'center',
          field: 'id',
          style: 'width:15%'
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
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    // 查询开支项列表
    getList () {
      this.addDetailStatus = false
      this.addPoppupStatus = false
      this.detailStatus = false

      const obj = {
        type: 1,
        text: this.itemData.pki_name,
        status: this.activeName,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('commonKzls/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.itemListData = res.data.list.map((item) => ({
              pki_name: item.pki_name,
              pki_status: item.pki_status,
              pki_detail: item.pki_detail,
              priceTotal: item.priceTotal,
              id: item.id,
              detail: item.detail,
              expand: false
            }))
            // this.itemListData = res.data.list.
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
      let nowWidth = this.$q.screen.width - 280
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 重置按钮方法
    clearBut () {
      this.itemData.pki_name = ''
      this.itemData.pki_status = ''
      this.activeName = ''
      this.getList()
    },
    // 显示开支项弹窗方法
    showPopup (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addRef.init(id)
      })
    },
    // 显示明细弹窗方法
    showAddDetail (id, status) {
      this.addDetailStatus = true
      this.$nextTick(() => {
        this.$refs.addDetailRef.init(id, status)
      })
    },
    showKzlsDetail (id, context) {
      this.detailStatus = true
      this.$nextTick(() => {
        this.$refs.DetailRef.getList(id, context)
      })
    },

    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    // 分页
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    delKzlsData (row) {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${row.pki_name}"的开支项吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: row.id
          }
          this.$store.dispatch('commonKzls/delAll', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除开支项!',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.getList()
            }
          })
        })
    }
  }
}
</script>
