<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.3 + 'px',
        'min-width': this.$q.screen.width * 0.6 + 'px',
        height: this.$q.screen.height * 0.9 + 'px',
      }"
      class="fit column justify-between no-wrap"
    >
      <q-card-section class="row items-center q-py-sm col-shrink">
        <div class="text-subtitle2 text-weight-bold">设备管理</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="hideNowPage" />
      </q-card-section>

      <q-separator />

      <q-card-section class="col-shrink full-height">
        <q-scroll-area class="fit">
          <q-form ref="roomDataRef" class="row">
            <q-card flat bordered class="col-12">
              <q-card-section class="q-pa-sm"> 选择播报音响 </q-card-section>
              <q-separator />
              <q-card-section class="q-pa-sm">
                <q-select
                  outlined
                  dense
                  v-model="roomDeviceData.srd_spack_sound_id"
                  :options="spaekListData"
                  label="请选择播报音响"
                  option-value="id"
                  option-label="psc_name"
                  option-disable="psc_disable"
                  emit-value
                  map-options
                />
              </q-card-section>
            </q-card>

            <q-card flat bordered class="col-12 q-mt-sm">
              <q-card-section class="q-pa-sm"> 选择通通锁-门锁 </q-card-section>
              <q-separator />
              <q-card-section class="q-pa-sm">
                <q-item class="bg-grey-2">
                  <q-item-section>
                    <q-item-label>锁ID：{{ roomDeviceData.srd_ttlock_lock_id ? roomDeviceData.srd_ttlock_lock_id : '未绑定' }}</q-item-label>
                    <q-item-label caption
                      >锁蓝牙名称：{{ roomDeviceData.srd_ttlock_lock_name ? roomDeviceData.srd_ttlock_lock_name : '未绑定' }}</q-item-label
                    >
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>锁别名：{{ roomDeviceData.srd_ttlock_lock_alias ? roomDeviceData.srd_ttlock_lock_alias : '未绑定' }}</q-item-label>
                    <q-item-label caption
                      >锁mac地址：{{ roomDeviceData.srd_ttlock_lock_mac ? roomDeviceData.srd_ttlock_lock_mac : '未绑定' }}</q-item-label
                    >
                  </q-item-section>

                  <q-item-section side>
                    <q-btn unelevated label="选择门锁" @click="openSelectDoorLockDialog" color="primary" />
                  </q-item-section>
                </q-item>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="col-12 q-mt-sm">
              <q-card-section class="q-pa-sm"> 选择智能控制器 </q-card-section>
              <q-separator />
              <q-card-section class="q-pa-sm">
                <q-item class="bg-grey-2">
                  <q-item-section>
                    <q-item-label>设备名：{{ roomDeviceData.srd_relay_name ? roomDeviceData.srd_relay_name : '未绑定' }}</q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>设备唯一ID：{{ roomDeviceData.srd_relay_client_id ? roomDeviceData.srd_relay_client_id : '未绑定' }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn unelevated label="选择控制器" @click="openSelectRelayDialog" color="primary" />
                  </q-item-section>
                </q-item>
              </q-card-section>

              <q-markup-table separator="cell" flat bordered>
                <thead>
                  <tr>
                    <th class="text-center">线路</th>
                    <th class="text-center">设备名称</th>
                    <th class="text-center">已绑定房间</th>
                    <th class="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="key" v-for="(item, key) in deviceListData">
                    <td class="text-center">{{ '第' + (key + 1) + '路' }}</td>
                    <td class="text-center"> {{ item.drc_name ? item.drc_name : '' }} </td>
                    <!-- <td class="text-center">
                  <q-toggle v-model="item.drc_status" color="green" true-value="1" false-value="0" />
                </td> -->

                    <td class="text-center">
                      {{ item.bindRoom ? item.bindRoom.qrt_name : '' }}
                    </td>
                    <td class="text-center">
                       <q-btn unelevated label="解绑" v-if="parseInt(item.room_id) > 0 && parseInt(item.room_id) == parseInt(roomId)"  @click="item.room_id = 0" color="orange" ></q-btn>
                       <q-btn unelevated label="不可绑定" v-else-if="parseInt(item.room_id) > 0 && parseInt(item.room_id) != parseInt(roomId)"  :disable="true" color="red" ></q-btn>
                        <q-btn unelevated label="绑定" v-else-if="!parseInt(item.room_id)"  color="primary"  @click="item.room_id = parseInt(roomId)"></q-btn>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card>
          </q-form>
        </q-scroll-area>
      </q-card-section>

      <q-separator />

      <q-card-section class="justify-center row q-gutter-sm col-shrink">
        <q-btn unelevated class="q-px-xl" :disable="addButtonDisabled" color="orange" @click="setData"> 保存 </q-btn>
      </q-card-section>
    </q-card>

    <select-door-lock ref="selectDoorLockRef" v-if="selectDoorLockDialog" @checkDoorLock="checkDoorLock" @colseDialog="colseDialog" />

    <select-relay-list ref="selectRelayRef" v-if="selectRelaykDialog" @checkRelayClient="checkDeviceRelay" @colseDialog="colseRelayDialog" />
  </q-dialog>
</template>
<script>
import SelectDoorLock from '../device/tt-lock/SelectDoorLock.vue'
import SelectRelayList from '../device/smart-controller/SelectRelayList.vue'
export default {
  name: 'RoomDeviceManage',
  components: {
    SelectDoorLock,
    SelectRelayList
  },
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      roomDeviceData: {
        srd_ttlock_lock_id: '',
        srd_ttlock_lock_name: '',
        srd_ttlock_lock_alias: '',
        srd_ttlock_lock_mac: '',
        srd_spack_sound_id: '', // 语音音响ID
        srd_room_id: '', // 桌台ID

        srd_relay_id: '',
        srd_relay_client_id: '',
        srd_relay_name: ''
      },
      spaekListData: [],
      selectDoorLockDialog: false,
      selectRelaykDialog: false,
      deviceListData: []
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (roomId) {
      this.getSpaekListData()

      if (roomId > 0) {
        this.roomId = roomId

        this.$nextTick(() => {
          this.getItem()
        })
      }
    },
    getSpaekListData () {
      const params = {}
      this.$store
        .dispatch('speakTempate/getSpaekListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.spaekListData = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    getItem () {
      this.$store
        .dispatch('roomManage/getRoomDeviceData', {
          roomId: this.roomId
        })
        .then((res) => {
          if (res.code == 200 && res.data && res.data.id) {
            this.roomDeviceData = res.data
            if (this.roomDeviceData.srd_relay_id) {
              this.$nextTick(() => {
                this.getDeviceListData()
              })
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
    setData () {
      this.$refs.roomDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          this.roomDeviceData.srd_room_id = this.roomId
          const params = {
            ...this.roomDeviceData,
            roomId: this.roomId,
            deviceListData: this.deviceListData
          }
          this.$store
            .dispatch('roomManage/setRoomDeviceData', params)
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
                this.showDialog = false
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
        }
      })
    },
    openSelectDoorLockDialog () {
      this.selectDoorLockDialog = true
      this.$nextTick(() => {
        this.$refs.selectDoorLockRef.init()
      })
    },
    colseDialog () {
      this.selectDoorLockDialog = false
    },
    checkDoorLock (value) {
      if (value.lockId) {
        this.roomDeviceData.srd_ttlock_lock_id = value.lockId.toString()
        this.roomDeviceData.srd_ttlock_lock_name = value.lockName
        this.roomDeviceData.srd_ttlock_lock_alias = value.lockAlias
        this.roomDeviceData.srd_ttlock_lock_mac = value.lockMac
      }
      this.selectDoorLockDialog = false
    },

    openSelectRelayDialog () {
      this.selectRelaykDialog = true
      this.$nextTick(() => {
        this.$refs.selectRelayRef.init()
      })
    },
    colseRelayDialog () {
      this.selectRelaykDialog = false
    },

    checkDeviceRelay (value) {
      if (value.id) {
        this.roomDeviceData.srd_relay_id = value.id
        this.roomDeviceData.srd_relay_client_id = value.sdr_only_client_id
        this.roomDeviceData.srd_relay_name = value.sdr_name
        this.$nextTick(() => {
          this.getDeviceListData()
        })
      }
      this.selectRelaykDialog = false
    },
    getDeviceListData () {
      const obj = {
        device_relay_client_id: this.roomDeviceData.srd_relay_id
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
    hideNowPage () {
      this.$emit('dataList')
      this.addButtonDisabled = false
    }
  }
}
</script>
