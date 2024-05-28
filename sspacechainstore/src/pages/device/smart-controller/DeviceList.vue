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
        <div class="col-shrink bg-white row q-py-sm items-center">
          <div class="col-12 row q-px-sm q-py-xs">
            <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
            设备列表

            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="colseDialog" />
          </div>
        </div>
        <q-separator />
        <div class="col-shrink q-px-xs full-height q-pt-sm">
            <q-scroll-area class="fit">
          <q-markup-table separator="horizontal"  flat bordered>
            <thead>
              <tr>
                 <th class="text-center">线路</th>
                <th class="text-center">设备名称</th>
                <!-- <th class="text-center">状态</th> -->
                <th class="text-center">开启命令</th>
                <th class="text-center">关闭命令</th>
                 <th class="text-center">绑定桌台</th>
              </tr>
            </thead>
            <tbody>
              <tr :key="key" v-for="(item, key) in deviceListData">
                 <td class="text-center">{{ '第'+(key+1)+'路' }}</td>
                <td class="text-center"><q-input outlined dense v-model="item.drc_name" label="设备名称" /></td>
                <!-- <td class="text-center">
                  <q-toggle v-model="item.drc_status" color="green" true-value="1" false-value="0" />
                </td> -->
                <td class="text-center"><q-input outlined dense v-model="item.drc_all_colse_instruct" label="关闭指令" /></td>
                <td class="text-center"><q-input outlined dense v-model="item.drc_all_open_instruct" label="开启指令" /></td>

                 <td class="text-center">
                  {{ item.bindRoom ? item.bindRoom.qrt_name : '' }}
                </td>
              </tr>

              <tr>
                <!-- <td class="text-center"></td> -->
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-center"></td>
                <td class="text-right">
                  还可新增【{{ maxDeviceCount - deviceListData.length }}】个设备
                  <q-btn unelevated label="新增设备" :disable="maxDeviceCount > deviceListData.length ? false : true" color="orange" @click="addDeviceData"></q-btn>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
            </q-scroll-area>
        </div>

        <q-separator />

        <div class="col-shrink bg-white q-pb-md row item-center justify-center q-pa-sm">
          <q-btn unelevated class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData"> 保存 </q-btn>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'DeviceList',
  components: {},
  data () {
    return {
      deviceListData: [],
      visibleDialogStatus: false,
      deviceRelayClientId: 0,
      addButtonDisabled: false,
      maxDeviceCount: 0
    }
  },

  computed: {},
  created () {},
  mounted () {},
  methods: {
    init (deviceRelayClientId, maxDeviceCount) {
      this.visibleDialogStatus = true
      this.deviceRelayClientId = deviceRelayClientId
      this.maxDeviceCount = maxDeviceCount
      this.$nextTick(() => {
        this.getDeviceListData()
      })
    },
    addDeviceData () {
      if (this.deviceListData.length < this.maxDeviceCount) {
        this.deviceListData.push({
          device_relay_id: this.deviceRelayClientId,
          drc_status: '1',
          drc_name: '',
          drc_all_colse_instruct: '',
          drc_all_open_instruct: ''
        })
      }
    },

    getDeviceListData () {
      const obj = {
        device_relay_client_id: this.deviceRelayClientId
      }
      this.$store
        .dispatch('deviceRelay/getRelayClientDataList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.deviceListData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    setData () {
      this.addButtonDisabled = true

      const params = {
        deviceListData: this.deviceListData,
        deviceRelayClientId: this.deviceRelayClientId
      }
      this.$store
        .dispatch('deviceRelay/setRelayClientDataList', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '保存成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.colseDialog()
          } else {
            this.addButtonDisabled = false
            this.$q.notify({
              message: '失败',
              caption: res.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((err) => {
          this.addButtonDisabled = false
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

    colseDialog () {
      this.visibleDialogStatus = false

      this.$emit('colseDialog')
    }
  }
}
</script>
