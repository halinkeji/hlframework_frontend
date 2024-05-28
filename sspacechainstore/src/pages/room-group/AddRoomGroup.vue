<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog"  persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.2 + 'px',
        'min-width': this.$q.screen.width * 0.2 + 'px',
      }"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2 text-weight-bold">{{ roomGroupData.id > 0 ? '修改' : '新增' }}分组</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form ref="roomGroupDataRef" class="row q-col-gutter-sm">
          <div class="col-12">
            <q-item class="bg-grey-2">
              <q-item-section>
                <q-item-label>状态</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-toggle color="positive" v-model="roomGroupData.qrg_status" true-value="1" false-value="0" />
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12">
            <q-input outlined dense v-model="roomGroupData.qrg_name" label="名称" lazy-rules :rules="[(val) => !!val || '请输入名称']" />
          </div>
          <div class="col-12">
            <q-input
              outlined
              dense
              v-model="roomGroupData.qrg_sort"
              label="排序"
              lazy-rules
              :rules="[(val) => /^\d+$/.test(val) || '请输入正确的序号']"
            />
          </div>

          <div class="col-12">
            <q-input
              outlined
              dense
              v-model="roomGroupData.qrg_default_people_number"
              label="默认人数"
              lazy-rules
              :rules="[(val) => /^\d+$/.test(val) || '请输入默认人数']"
            />
          </div>

           <div class="col-12">
            <q-select
              option-value="id"
              option-label="qcr_name"
              emit-value
              map-options
              dense
              outlined
              v-model="roomGroupData.qrg_default_charge_rule_id"
              :options="chargeRuleListData"
              label="默认计费模式"
              :rules="[(val) => val && val.length > 0 || '请选择默认计费模式']"
            />
          </div>

          <div class="col-12">
            <q-select
              option-value="id"
              option-label="qcr_name"
              emit-value
              map-options
              dense
              outlined
              multiple
              use-chips
              v-model="roomGroupData.qrg_charge_rule_id"
              :options="chargeRuleListData"
              label="计费模式"
              :rules="[(val) => val && val.length > 0 || '请选择默认计费模式']"
            />
          </div>

          <div class="col-12">
            <q-item class="bg-grey-2">
              <q-item-section>
                <q-item-label>即付款模式</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-toggle color="positive" v-model="roomGroupData.qrg_is_now_pay" true-value="1" false-value="0" />
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12">
            <q-select
              option-value="id"
              option-label="qcr_name"
              emit-value
              map-options
              dense
              outlined
              v-model="roomGroupData.qrg_night_charge_rule_id"
              :options="chargeRuleListData"
              label="夜间自助计费模式"
              :rules="[(val) => /^\d+$/.test(val) || '请选择夜间自助计费模式']"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section class="justify-center row q-gutter-sm">
        <q-btn unelevated class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData">
          保存
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddRoomGroup',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      roomGroupData: {
        qrg_sort: '0',
        qrg_name: '',
        qrg_default_people_number: '0',
        qrg_charge_rule_id: [],
        qrg_default_charge_rule_id: '',
        qrg_is_now_pay: '0',
        qrg_night_charge_rule_id: '',
        qrg_status: '1'
      },
      printerList: [],
      chargeRuleListData: [],
      roomGroupId: 0
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.showDialog = true
      this.getChargeRuleList()

      this.roomGroupId = id
      if (id > 0) {
        this.getItem()
      }
    },

    // 获取计费模式
    getChargeRuleList () {
      const params = {}
      this.$store
        .dispatch('chargeRule/getChargeRuleList', params)
        .then((res) => {
          if (res.code == 200) {
            this.chargeRuleListData = res.data ? res.data : []
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
        .dispatch('roomManage/getRoomGroupItem', this.roomGroupId)
        .then((res) => {
          if (res.code == 200 && res.data && res.data.id) {
            this.roomGroupData = res.data
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
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
      this.$refs.roomGroupDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true

          const params = {
            ...this.roomGroupData
          }
          this.$store
            .dispatch('roomManage/saveRoomGroup', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.roomGroupData.id > 0 ? '修改' : '新增'}` + '分组成功',
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
      this.roomGroupData.id = ''
      this.roomGroupData = {
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
    },
    getPrinterList () {
      this.$store
        .dispatch('dishes/getPrinterList')
        .then((res) => {
          if (res.code == 200) {
            this.printerList = res.data ? res.data : []
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    }
  }
}
</script>
