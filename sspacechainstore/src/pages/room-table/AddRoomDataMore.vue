<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.3 + 'px',
        'min-width': this.$q.screen.width * 0.3 + 'px',
        height: this.$q.screen.height * 0.9 + 'px',
      }"
      class="fit"
    >
      <div class="fit column justify-between no-wrap">
        <div class="row items-center q-pa-sm col-shrink">
          <div class="text-subtitle2 text-weight-bold">{{ roomData.id > 0 ? '修改' : '新增' }}桌号</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <q-separator />
        <div class="col-shrink full-height q-pa-sm bg-white">
          <q-scroll-area class="fit">
            <q-form ref="roomDataRef" class="row q-col-gutter-sm">
              <div class="col-12">
                <q-select
                  outlined
                  dense
                  v-model="roomData.qrt_room_group_id"
                  :options="roomGroupList"
                  label="请选择桌台分组"
                  option-value="id"
                  option-label="qrg_name"
                  emit-value
                  map-options
                  :rules="[(val) => (val && val.length > 0) || '请选择分组']"
                />
              </div>

              <div class="col-12">
                <q-item class="bg-grey-2">
                  <q-item-section>
                    <q-item-label>状态</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-option-group
                      v-model="roomData.qrt_status"
                      :options="[
                        {
                          label: '关闭',
                          value: '0',
                        },
                        {
                          label: '开启',
                          value: '1',
                        },
                      ]"
                      color="primary"
                      inline
                    />
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="roomData.more_name_prefix"
                  label="桌号名称前缀"
                  lazy-rules
                  :rules="[(val) => !!val || '请输入桌号名称前缀']"
                />
              </div>

              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="roomData.more_name_suffix"
                  label="桌号名称后缀"
                  lazy-rules
                  :rules="[(val) => !!val || '请输入桌号名称后缀']"
                />
              </div>

              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="roomData.more_start_number"
                  label="桌号起始数量"
                  lazy-rules
                  :rules="[(val) => !!val || '请输入桌号起始数量']"
                />
              </div>

              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="roomData.more_create_number"
                  label="共创建数量"
                  lazy-rules
                  :rules="[(val) => !!val || '请输入共创建数量']"
                />
              </div>

              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="roomData.qrt_people_number"
                  label="标准人数"
                  lazy-rules
                  :rules="[(val) => /^\d+$/.test(val) || '请输入正确的数字']"
                />
              </div>

              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="roomData.qrt_hours_price"
                  label="每小时单价"
                  lazy-rules
                  :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的价格']"
                />
              </div>

              <div class="col-12">
                <q-item class="bg-grey-2">
                  <q-item-section avatar>
                    <q-item-label>标签</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="row">
                      <div class="col-auto" :key="'tag-' + key" v-for="(item, key) in roomTagList">
                        <q-checkbox v-model="bindTagData" :label="item.srt_title" :val="item.id" />
                      </div>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12">
                <q-select
                  option-value="id"
                  option-label="scp_name"
                  emit-value
                  map-options
                  dense
                  outlined
                  multiple
                  use-chips
                  v-model="roomData.qrt_charge_package_id"
                  :options="packageListListData"
                  label="计费套餐"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                       <q-item-section>
                      <q-item-label class="text-subtitle2 text-orange row"
                        >【{{ scope.opt.scp_name }}】
                        <q-space />
                        <span class="text-dark">售价：</span> {{ scope.opt.scp_sell_price }}
                      </q-item-label>
                      <q-item-label caption>
                        <span v-if="scope.opt.scp_time_type == 1"
                          ><span class="text-dark">说明：</span>{{ scope.opt.scp_regular_hours }} 小时有效</span
                        >
                        <span v-if="scope.opt.scp_time_type == 2">
                          <span class="text-dark">说明：</span>{{ fortyEightHourText[scope.opt.scp_time_period_start] }} 至
                          {{ fortyEightHourText[scope.opt.scp_time_period_end] }} 有效
                        </span>
                      </q-item-label>
                    </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="col-12">
                <q-item class="bg-grey-2">
                  <q-item-section>
                    <q-item-label>最低消费</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-option-group
                      v-model="roomData.qrt_is_min_consume"
                      :options="[
                        {
                          label: '关闭',
                          value: '0',
                        },
                        {
                          label: '累计最低消费',
                          value: '1',
                        },
                        {
                          label: '人均最低消费',
                          value: '2',
                        },
                      ]"
                      color="primary"
                      inline
                    />
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12" v-if="parseInt(roomData.qrt_is_min_consume) > 0">
                <q-input
                  v-model="roomData.qrt_min_consume_amount"
                  standout
                  dense
                  outlined
                  :label="parseInt(roomData.qrt_is_min_consume) == 1 ? '累计最低消费金额' : '人均最低消费金额'"
                  :rules="[(val) => !!val || '请输入金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '金额为非负两位以内小数']"
                >
                </q-input>
              </div>
            </q-form>
          </q-scroll-area>
        </div>
        <q-separator />
        <div class="justify-center row q-gutter-sm col-shrink bg-white q-pb-md q-mt-xs">
          <q-btn unelevated class="q-px-xl" :disable="addButtonDisabled" color="orange" @click="setData"> 保存 </q-btn>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddRoomData',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      roomData: {
        qrt_sort: '0',
        qrt_name: '',
        qrt_room_group_id: '',
        qrt_people_number: '',
        qrt_is_min_consume: '0',
        qrt_min_consume_amount: '',
        qrt_status: '1',
        more_name_prefix: '',
        more_name_suffix: '',
        more_start_number: '',
        more_create_number: ''
      },
      printerList: [],
      roomGroupData: {},

      roomGroupId: 0,
      roomId: 0,
      roomGroupList: [],
      roomTagList: [],
      bindTagData: [],
      packageListListData: [],

      fortyEightHourText: {}
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init () {
      this.getRoomGroupDataList()

      this.getRoomTagDataList()

      this.getChargePackageListData()

      for (var i = 0; i < 24; i++) {
        this.fortyEightHourText[i] = i + '点'
      }

      for (var i = 0; i < 24; i++) {
        this.fortyEightHourText[i + 24] = '次日' + i + '点'
      }

      this.showDialog = true
    },
    getChargePackageListData () {
      const params = {}
      this.$store
        .dispatch('chargePackage/getChargePackageListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.packageListListData = res.data ? res.data : []
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
    getRoomGroupDataList () {
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
    getRoomTagDataList () {
      this.$store
        .dispatch('roomTag/getTagListData')
        .then((res) => {
          if (res.code == 200) {
            this.roomTagList = res.data ? res.data : []
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

          const params = {
            ...this.roomData,
            bindTagData: this.bindTagData
          }
          this.$store
            .dispatch('roomManage/saveMoreRoomData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功新增' + (res.data || 0) + '个桌号',
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
    hideNowPage () {
      this.roomData.id = ''
      this.roomData = {
        dt_name: '',
        dt_sort: '0',
        dt_box_price: '0',
        dt_description: '',
        dt_min_consume: '0',
        dt_extra_consume: '0',
        dt_deposit: '0'
      }
      this.$emit('dataList')
      this.addButtonDisabled = false
    }
  }
}
</script>
