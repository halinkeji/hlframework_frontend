<template>
  <q-dialog v-model="visibleDialogStatus" @close="colseDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.8 + 'px',
        'min-width': this.$q.screen.width * 0.8 + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-pb-lg">
          <div class="col-12 row q-px-sm q-py-xs">
            <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
            选择门锁

            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="colseDialog" />
          </div>
          <q-separator />
          <div class="col-12 row q-px-sm q-gutter-sm">
            <div class="col-2">
              <q-input outlined dense v-model="searchQuery" label="锁别名模糊搜索" />
            </div>

            <q-btn label="搜索" unelevated color="primary" @click="getTtlockListData()" />
            <q-btn
              label="重置"
              unelevated
              color="warning"
              @click="
                searchQuery = '';
                getTtlockListData();
              "
            />
          </div>
        </div>
        <div class="col-shrink q-px-xs full-height bg-grey-2">
          <q-table
            separator="cell"
            :pagination="{
              rowsPerPage: 0,
            }"
            :data="lockListData"
            :columns="columnsData"
            row-key="name"
            hide-bottom
            flat
            bordered
            no-data-label="未找到可用门锁"
          >
            <template v-slot:no-data> 未找到可用门锁 </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="lockId" :props="props">
                  {{ props.row.lockId }}
                </q-td>

                <q-td key="lockName" :props="props">
                  {{ props.row.lockName }}
                </q-td>
                <q-td key="lockAlias" :props="props">
                  {{ props.row.lockAlias }}
                </q-td>
                <q-td key="lockMac" :props="props">
                  {{ props.row.lockMac }}
                </q-td>

                <q-td key="id" :props="props">
                  <q-btn
                    label="选择"
                    :disable="parseInt(props.row.is_bind) == 1 ? true : false"
                    unelevated
                    color="primary"
                    @click="checkDoorLock(props.row)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>

        <div class="col-shrink bg-white q-pb-md row item-center justify-center q-pa-sm">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pageSize"
            :total="page.pageTotal"
            layout="total, sizes, prev, pager, next, jumper"
          ></hl-pagination>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'SelectDoorLock',
  components: {},
  data () {
    return {
      searchQuery: '',

      columnsData: [
        { name: 'lockId', label: '锁ID', field: 'lockId', align: 'center' },
        { name: 'lockName', label: '锁的蓝牙名称', field: 'lockName', align: 'center' },
        { name: 'lockAlias', label: '锁别名', field: 'lockAlias', align: 'center' },
        { name: 'lockMac', label: '锁mac地址', field: 'lockMac', align: 'center' },
        { name: 'id', label: '操作', field: 'id', align: 'center' }
      ],

      lockListData: [],

      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },

      gridOptions: {},
      visibleDialogStatus: false,

      localeText: this.$ag_grid_localeText
    }
  },

  computed: {},
  created () {},
  mounted () {},
  methods: {
    init () {
      this.visibleDialogStatus = true

      this.$nextTick(() => {
        this.getTtlockListData()
      })
    },

    getTtlockListData () {
      this.visible = true
      const obj = {
        lockAlias: this.searchQuery,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageIndex
      }
      this.$store
        .dispatch('ttlockManage/getTtlockDoorLockList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.list) {
              this.lockListData = res.data.list
              this.page.pageTotal = parseInt(res.data.total)
            } else {
              this.lockListData = []
              this.page.pageTotal = 0
            }
          }
        })
        .catch((error) => {})
    },

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getTtlockListData()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getTtlockListData()
    },

    colseDialog () {
      this.visibleDialogStatus = false

      this.$emit('colseDialog')
    },

    checkDoorLock (item) {
      this.visibleDialogStatus = false
      this.$emit('checkDoorLock', item)
    }
  }
}
</script>
