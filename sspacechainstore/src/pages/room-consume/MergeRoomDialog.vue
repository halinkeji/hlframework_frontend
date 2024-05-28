<template>
  <!-- 开单弹窗 -->
  <q-dialog v-model="openRoomConsumeDialog" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.6) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.6) + 'px',
        height: parseInt(this.$q.screen.height * 0.9) + 'px',
      }"
      class="fit column no-wrap bg-white"
    >
      <div class="row q-pa-sm items-center">
        合并桌台
        <q-space />
        <q-btn color="grey" round flat dense icon="cancel" class="text-weight-bold" @click="closeBookRoomDialog"></q-btn>
      </div>
      <q-separator />

      <q-form class="full-height" ref="bookRoomFormRef">
        <div class="col-shrink">
          <q-card square flat class="bg-white">
            <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
              <q-tab name="all" label="全部" @click="changeGroupData()" />
              <q-tab :name="key" :label="item.qrg_name" v-for="(item, key) in roomGroupList" :key="key" @click="changeGroupData(item.id)" />
            </q-tabs>
            <q-space />
          </q-card>
        </div>

        <div class="col-shrink full-height" v-if="roomTableDataListData.length > 0">
          <q-scroll-area class="fit">
            <div class="row q-pb-xl">
              <div v-for="(item, key) in roomTableDataListData" :key="key" class="q-pa-sm col-3">
                <q-card
                  @click="checkRoomData(item)"
                  bordered
                  :class="relationRoomId == item.id ? 'shadow-1' : 'no-shadow'"
                  class="text-subtitle1 text-left text-grey-8 full-height cursor-pointer"
                >
                  <q-card-section class="text-left q-py-sm" :class="{
                    'bg-red text-white': item.consumeBuffer && item.consumeBuffer.id && parseInt(item.srd_is_merge_status) > 0,
                    'bg-blue text-white': item.consumeBuffer && item.consumeBuffer.id && parseInt(item.srd_is_merge_status) == 0,
                    'bg-grey text-white': item.qrt_status == 1,

                  }">
                    <div class="text-subtitle2 text-weight-bold">{{ item.qrt_name }}( {{ item.qrt_people_number }}人 )</div>
                  </q-card-section>

                  <q-card-section class="text-center q-mb-md">
                    <!-- 消费中并且未绑定的 -->
                    <div  class="text-subtitle2 text-dark"  v-if="item.consumeBuffer && item.consumeBuffer.id && parseInt(item.srd_is_merge_status) > 0">
                      已绑定
                    </div>
                    <div class="text-subtitle2 text-dark" v-if="item.consumeBuffer && item.consumeBuffer.id && parseInt(item.srd_is_merge_status) == 0">
                      消费中
                    </div>

                    <div class="text-subtitle2 text-dark" v-if="item.qrt_status == 1">空闲中</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-scroll-area>
        </div>
      </q-form>

      <q-separator />
      <q-card-section class="justify-center row q-gutter-sm">
        <q-btn unelevated class="q-px-xl" :disable="relationRoomId ? false : true" color="primary" @click="clickBookRoom"> 确认 </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'SelectRoomGroup',
  components: {},
  data () {
    return {
      roomGroupList: [],
      currentRoomGroupId: 0,
      roomTableDataListData: 0,

      openRoomConsumeDialog: false,
      relationRoomId: 0,
      currentRoomData: {},
      currentRoomName: '',
      tab: 'all',
      currentRoomId: 0
    }
  },
  mounted () {},
  created () {},
  computed: {},

  methods: {
    init (currentRoomId) {
      this.openRoomConsumeDialog = true

      if (currentRoomId > 0) {
        this.currentRoomId = currentRoomId

        this.getRoomGroupData()
        this.getRoomDataList()
      }
    },
    // 获取房间分组
    getRoomGroupData () {
      this.$store
        .dispatch('roomManage/getRoomGroupDataList')
        .then((res) => {
          if (res.code == 200) {
            this.roomGroupList = res.data ? res.data : []
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
    // 更改房间分组
    changeGroupData (id) {
      this.currentRoomGroupId = id
      this.$nextTick(() => {
        this.getRoomDataList()
      })
    },
    // 获取房间列表
    getRoomDataList () {
      const that = this
      const params = {
        room_group_id: this.currentRoomGroupId,
        relationCurrentRoomId: this.currentRoomId
      }
      this.$store
        .dispatch('roomManage/getRoomTableDataList', params)
        .then((res) => {
          if (res.code == 200) {
            this.roomTableDataListData = res.data ? res.data : []
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

    // 选择房间
    checkRoomData (item) {
      if (item.consumeBuffer && item.consumeBuffer.id && parseInt(item.srd_is_merge_status) == 0) {
        this.relationRoomId = item.id
        this.currentRoomData = item

        this.currentRoomName = (item.roomGroup && item.roomGroup.qrg_name ? item.roomGroup.qrg_name : '') + '-' + item.qrt_name
      }
    },

    clickBookRoom () {
      this.openRoomConsumeDialog = false

      this.$emit('clickBookRoom', this.relationRoomId, this.currentRoomData, this.currentRoomName)
    },
    closeBookRoomDialog () {
      this.openRoomConsumeDialog = false

      this.$emit('closeBookRoomDialog')
    }
  }
}
</script>
<style scoped>
.book-time-square-kong {
  width: 13px;
  height: 13px;
  border: 1px solid #3271ae;
}
.book-time-square-left-half {
  width: 13px;
  height: 13px;
  border: 1px solid #3271ae;
  background: linear-gradient(to left, #3271ae 50%, #fff 50%);
}
.book-time-square-right-half {
  width: 13px;
  height: 13px;
  border: 1px solid #3271ae;
  background: linear-gradient(to right, #3271ae 50%, #fff 50%);
}
.book-time-square-fit {
  width: 13px;
  height: 13px;
  background-color: #3271ae;
}
.book-date {
  border-radius: 100px;
  border: 1px solid #3271ae;
}
.book-date-disable {
  border-radius: 100px;
  border: 1px solid #bbb9b9;
}
</style>
