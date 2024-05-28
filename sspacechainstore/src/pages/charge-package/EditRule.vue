<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" full-height persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.4 + 'px',
        'min-width': this.$q.screen.width * 0.4 + 'px',
        height: this.$q.screen.height * 0.9 + 'px',
      }"
      class="fit column no-wrap"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2 text-weight-bold">{{ chargePackageData.id > 0 ? '修改' : '新增' }}计费套餐</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section class="full-height">
        <q-scroll-area class="fit">
          <q-form ref="chargePackageRef" class="row q-col-gutter-sm">
            <div class="col-12">
              <q-item class="bg-grey-2">
                <q-item-section>
                  <q-item-label>状态</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle color="positive" v-model="chargePackageData.scp_status" true-value="1" false-value="0" />
                </q-item-section>
              </q-item>
            </div>

            <div class="col-6">
              <q-input outlined dense v-model="chargePackageData.scp_name" label="名称" lazy-rules :rules="[(val) => !!val || '请输入名称']" />
            </div>
            <div class="col-6">
              <q-input outlined dense v-model="chargePackageData.scp_sell_price" label="售价" lazy-rules :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的价格']" />
            </div>
            <div class="col-12">
              <q-card flat bordered>
                <q-card-section class="q-pa-none">
                  <q-item class="bg-grey-2">
                    <q-item-section >
                      <q-item-label>
                        <q-radio v-model="chargePackageData.scp_time_type" val="1" label="固定时长" />
                        <q-radio v-model="chargePackageData.scp_time_type" val="2" label="固定时段" />
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>

                <q-separator />

                <q-card-section v-if="parseInt(chargePackageData.scp_time_type) == 1">
                  <q-input
                    outlined
                    dense
                    v-model="chargePackageData.scp_regular_hours"
                    label="时长"
                    lazy-rules
                    :rules="[(val) => !!val || '请输入时长']"
                  >
                   <template v-slot:append>
                    <div class="text-subtitle2 text-black">
                      小时
                    </div>
                  </template>
                  </q-input>
                </q-card-section>

                <q-card-section v-if="parseInt(chargePackageData.scp_time_type) == 2">
                  <q-item>
                    <q-item-section>
                      <q-select
                        borderless
                        outlined
                        bottom-slots
                        v-model="chargePackageData.scp_time_period_start"
                        :options="twentyFourMinutes"
                        dense
                        map-options
                        emit-value
                        option-label="label"
                        option-value="value"
                        label="开始时间"
                      >
                        <template v-slot:after>
                          <span class="text-subtitle2 text-dark">至</span>
                        </template>
                      </q-select>
                    </q-item-section>

                    <q-item-section>
                      <q-select
                        borderless
                        outlined
                        bottom-slots
                        v-model="chargePackageData.scp_time_period_end"
                        :options="fortyEightMinutes"
                        dense
                        map-options
                        emit-value
                        option-label="label"
                        option-value="value"
                        label="结束时间"
                      />
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card>
            </div>

              <div class="col-12">

               <q-select
                  option-value="id"
                  option-label="qcr_name"
                  emit-value
                  map-options
                  dense
                  hint="超出当前套餐时长后默认计费模式"
                  outlined
                  v-model="chargePackageData.scp_charge_rule_id"
                  :options="chargeRuleListData"
                  label="计费模式"
                  :rules="[(val) => val && val.length > 0 || '请选择计费模式']"
                />
            </div>

            <div class="col-12">
              <hl-editor
                @change="
                  (v) => {
                    chargePackageData.scp_description = v;
                  }
                "
                :content="chargePackageData.scp_description"
                :minHeight="$q.screen.height * 0.4"
                titleText="说明"
              ></hl-editor>
            </div>
          </q-form>
        </q-scroll-area>
      </q-card-section>

      <q-separator />

      <q-card-section class="justify-center row q-gutter-sm">
        <q-btn unelevated class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData"> 保存 </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddChargePackage',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      chargePackageData: {
        scp_name: '',
        scp_status: '1',
        scp_is_member_price: 1,
        scp_sell_price: '',
        scp_member_price_set: '',
        scp_time_type: '1',
        scp_regular_hours: '',
        scp_time_period_start: '',
        scp_time_period_end: '',
        scp_description: ''
      },

      roomGroupId: 0,

      fiftyNineMinutes: [],
      sixtyMinutes: [],
      fortyEightMinutes: [],
      twentyFourMinutes: [],
      wholeDayHour: [],

      chargeRuleListData: []
    }
  },
  created () {
    for (var i = 1; i <= 59; i++) {
      this.fiftyNineMinutes.push(i)
    }

    for (var i = 1; i <= 60; i++) {
      this.sixtyMinutes.push(i)
    }

    for (var i = 0; i < 24; i++) {
      this.twentyFourMinutes.push({
        label: i + '点',
        value: i
      })
      this.fortyEightMinutes.push({
        label: i + '点',
        value: i.toString()
      })
    }

    for (var i = 1; i <= 24; i++) {
      this.wholeDayHour.push(i)
    }

    for (var i = 0; i < 24; i++) {
      this.fortyEightMinutes.push({
        label: '次日' + i + '点',
        value: (i + 24).toString()
      })
    }
  },
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
        .dispatch('chargePackage/getChargePackageItem', this.roomGroupId)
        .then((res) => {
          if (res.code == 200 && res.data && res.data.id) {
            this.chargePackageData = res.data
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
      this.$refs.chargePackageRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true

          const params = {
            ...this.chargePackageData
          }
          this.$store
            .dispatch('chargePackage/saveChargePackage', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.chargePackageData.id > 0 ? '修改' : '新增'}` + '计费套餐成功',
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
      this.chargePackageData = {
        id: '',
        scp_name: '',
        scp_status: '1',
        scp_is_member_price: 1,
        scp_sell_price: '',
        scp_member_price_set: '',
        scp_time_type: '1',
        scp_regular_hours: '',
        scp_time_period_start: '',
        scp_time_period_end: '',
        scp_description: ''
      }
      this.$emit('dataList')
      this.addButtonDisabled = false
    }

  }
}
</script>
