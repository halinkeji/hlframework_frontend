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
            选择控制器

            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="colseDialog" />
          </div>
          <q-separator />
          <div class="col-12 row q-px-sm q-gutter-sm">
            <div class="col-2">
              <q-input outlined dense v-model="searchQuery" label="控制器唯一ID|名称模糊搜索" />
            </div>

            <q-btn label="搜索" unelevated color="primary" @click="getRelayListData()" />
            <q-btn
              label="重置"
              unelevated
              color="warning"
              @click="
                searchQuery = '';
                getRelayListData();
              "
            />

            <q-btn unelevated color="primary" label="新增" @click="addRelayData(0)" />
          </div>
        </div>
        <div class="col-shrink q-px-xs full-height bg-grey-2">
          <q-table
            separator="cell"
            :pagination="{
              rowsPerPage: 0,
            }"
            :data="relayListData"
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
                <q-td key="sdr_only_client_id" :props="props">
                  {{ props.row.sdr_only_client_id }}
                </q-td>

                <q-td key="sdr_login_config" :props="props">
                  {{ props.row.sdr_login_config }}
                </q-td>
                <q-td key="sdr_name" :props="props">
                  {{ props.row.sdr_name }}
                </q-td>
                <q-td key="sdr_port_count" :props="props">
                  {{ props.row.sdr_port_count }}
                </q-td>

                <q-td key="sdr_all_open_instruct" :props="props">
                  {{ props.row.sdr_all_open_instruct }}
                </q-td>
                <q-td key="sdr_all_colse_instruct" :props="props">
                  {{ props.row.sdr_all_colse_instruct }}
                </q-td>
                <q-td key="sdr_all_query_instuct" :props="props">
                  {{ props.row.sdr_all_query_instuct }}
                </q-td>

                <q-td key="id" :props="props">
                  <div class="row q-gutter-sm justify-center">
                    <q-btn
                    label="选择"
                    unelevated
                    color="primary"
                    @click="checkRelayClient(props.row)"
                  />
                  </div>
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
  name: 'SelectRelayList',
  components: {

  },
  data () {
    return {
      searchQuery: '',

      columnsData: [
        { name: 'sdr_only_client_id', label: '设备唯一ID', field: 'sdr_only_client_id', align: 'center' },
        { name: 'sdr_login_config', label: '登录信息包', field: 'sdr_login_config', align: 'center' },
        { name: 'sdr_name', label: '设备名称', field: 'sdr_name', align: 'center' },
        { name: 'sdr_port_count', label: '端口数', field: 'sdr_port_count', align: 'center' },
        { name: 'sdr_all_open_instruct', label: '全开指令', field: 'sdr_all_open_instruct', align: 'center' },
        { name: 'sdr_all_colse_instruct', label: '全关指令', field: 'sdr_all_colse_instruct', align: 'center' },
        { name: 'sdr_all_query_instuct', label: '查询指令', field: 'sdr_all_query_instuct', align: 'center' },

        { name: 'id', label: '操作', field: 'id', align: 'center' }
      ],

      relayListData: [],

      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      addRelayStatus: false,
      deviceDialogStatus: false,
      visibleDialogStatus: false
    }
  },

  computed: {},
  created () {},
  mounted () {

  },
  methods: {
    init () {
      this.visibleDialogStatus = true

      this.$nextTick(() => {
        this.getRelayListData()
      })
    },
    colseDialog () {
      this.visibleDialogStatus = false

      this.$emit('colseDialog')
    },

    openDeviceDialog (row) {
      this.deviceDialogStatus = true
      this.$nextTick(() => {
        this.$refs.deviceListDialogRef.init(row.id, row.sdr_port_count)
      })
    },
    colseDeviceDialog () {
      this.deviceDialogStatus = false

      this.$nextTick(() => {
        this.getRelayListData()
      })
    },
    checkRelayClient (item) {
      this.visibleDialogStatus = false
      this.$emit('checkRelayClient', item)
    },

    getRelayListData () {
      const obj = {
        lockAlias: this.searchQuery,
        pSize: this.page.pageSize,
        page: this.page.pageIndex
      }
      this.$store
        .dispatch('deviceRelay/getRelayList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.list) {
              this.relayListData = res.data.list
              this.page.pageTotal = parseInt(res.data.page.totalCount)
            } else {
              this.relayListData = []
              this.page.pageTotal = 0
            }
          }
        })
        .catch((error) => {})
    },

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getRelayListData()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getRelayListData()
    }

  }
}
</script>
