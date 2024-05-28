<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white row q-pb-lg">
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

             <q-btn unelevated color="primary"  label="新增" @click="addRelayData(0)" />
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
          no-data-label="未找到可用控制器"
        >
          <template v-slot:no-data> 未找到可用控制器 </template>
          <template v-slot:body="props">
            <q-tr :props="props">
               <q-td key="sdr_name" :props="props">
                {{ props.row.sdr_name }}
              </q-td>
              <q-td key="sdr_only_client_id" :props="props">
                {{ props.row.sdr_only_client_id }}
              </q-td>

              <q-td key="sdr_port_count" :props="props">
                {{ props.row.sdr_port_count }}
              </q-td>

              <q-td key="sdr_login_config" :props="props">
                {{ splitFn(2,props.row.sdr_login_config) }}
                  <q-btn round color="secondary" @click="copyData(splitFn(2,props.row.sdr_login_config))" dense icon="filter_none" flat />
              </q-td>

              <q-td key="sdr_heart_beat" :props="props">

                {{ splitFn(2,props.row.sdr_heart_beat) }}
                  <q-btn round color="secondary" @click="copyData(splitFn(2,props.row.sdr_heart_beat))" dense icon="filter_none" flat />
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
                  label="设备列表"
                  unelevated
                  color="primary"
                  @click="openDeviceDialog(props.row)"
                />
                   <q-btn
                  label="编辑"
                  unelevated
                  color="primary"
                  @click="addRelayData(props.row.id)"
                />
                <q-btn
                  label="删除"
                  unelevated
                  color="red"
                  @click="delRelayData(props.row)"
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

      <add-data ref="addRelayDialogRef" v-if="addRelayStatus" @dataList="hideRelayDialog" />

       <device-list ref="deviceListDialogRef" v-if="deviceDialogStatus" @colseDialog="colseDeviceDialog" />
    </div>
  </q-page>
</template>
<script>
import AddData from './AddData'
import DeviceList from './DeviceList'
import { copyToClipboard } from 'quasar'
export default {
  name: 'smart-controller',
  components: {
    AddData,
    DeviceList
  },
  data () {
    return {
      searchQuery: '',

      columnsData: [
        { name: 'sdr_name', label: '设备名称', field: 'sdr_name', align: 'center' },
        { name: 'sdr_only_client_id', label: '设备唯一ID', field: 'sdr_only_client_id', align: 'center' },
        { name: 'sdr_port_count', label: '设备总路数', field: 'sdr_port_count', align: 'center' },
        { name: 'sdr_login_config', label: '登录信息包', field: 'sdr_login_config', align: 'center' },
        { name: 'sdr_heart_beat', label: '心跳包', field: 'sdr_login_config', align: 'center' },

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
      deviceDialogStatus: false

    }
  },

  computed: {},
  created () {},
  mounted () {
    this.getRelayListData()
  },
  methods: {
    copyData (val) {
      copyToClipboard(val)
        .then(() => {
          this.$q.notify({
            message: '成功',
            caption: '已将内容复制到剪贴板!',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
        .catch(() => {
          // fail
        })
    },
    // length 间隔字符串的长度  str字符串
    splitFn (length, str) {
      str = str.toUpperCase()
      const reg = new RegExp('[^\n]{1,' + length + '}', 'g')
      const res = str.match(reg)
      return res.join(' ')
    },

    addRelayData (id) {
      this.addRelayStatus = true
      this.$nextTick(() => {
        this.$refs.addRelayDialogRef.init(id)
      })
    },
    hideRelayDialog () {
      this.addRelayStatus = false

      this.$nextTick(() => {
        this.getRelayListData()
      })
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
    },

    delRelayData (row) {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${row.sdr_name}"的控制器吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$store.dispatch('deviceRelay/deleteRelayData', row.id).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除标签!',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.getRelayListData()
            }
          })
        })
    }

  }
}
</script>
