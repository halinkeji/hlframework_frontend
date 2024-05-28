<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-pa-sm full-height bg-white">
      <div style="overflow-y: scroll" class="fit full-height">
        <q-form ref="addProjectRef" class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-select
              outlined
              dense
              v-model="reserveData.src_status"
              option-label="label"
              :options="statusOptions"
              label="预订状态"
              emit-value
              map-options
              class="q-mb-md"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              outlined
              dense
              hint="本设置为了会员在预订的时候撤销时间做限制；该文本框填写单位为 ‘小时’ ，例如填写 3 ，那么会员在预订成功之后的 3 小时内可以撤销，过时间不可撤销！（0或不填为不限制）"
              v-model="reserveData.src_order_cancel_time"
              label="撤销时间"
              lazy-rules
              :rules="[(val) => /^[0-9]\d*$/.test(val) || '撤销时间格式错误']"
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <q-input
              outlined
              dense
              hint="本设置为了会员在预订的时候未支付订单失效时间做限制；该文本框填写单位为 ‘分钟’ ，例如填写 3 ，那么会员在产生预订未支付订单之后的 3 分钟之内可再次支付，过时间后需重新预订！（默认15分钟，填0按默认时间）"
              v-model="reserveData.src_order_lose_time"
              label="未支付失效时间"
              lazy-rules
              :rules="[(val) => /^[0-9]\d*$/.test(val) || '撤销时间格式错误']"
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <q-select
              borderless
              outlined
              bottom-slots
              hint="例如选择 30 ，那么会员在预订选择时间时，会自动展示整点时间。例如：10:00、10:30、11:00、11:30..."
              v-model="reserveData.src_interval_time"
              :options="[30, 60]"
              dense
            >
            </q-select>
          </div>

          <!-- <div class="col-12 col-md-3">
            <q-card flat bordered>
              <q-card-section class="text-subtile2 row items-center">
                撤销原因 <q-space />
                <q-btn color="primary" label="新增" unelevated @click="addCancelReason" />
              </q-card-section>
              <q-separator />

              <q-card-section class="text-subtile2 row items-center">
                <div class="full-width q-mb-md row q-col-gutter-sm" v-for="(item, key) in reserveData.prp_cancel_reason">
                  <q-input outlined dense class="col" v-model="item.reason" label="原因" :rules="[(val) => !!val || '请输入原因']">
                    <template v-slot:append>
                      <q-btn @click="delCancelReason(key)" color="red" round icon="las la-trash" unelevated size="sm" />
                    </template>
                  </q-input>
                </div>
              </q-card-section>
            </q-card>
          </div> -->
          <div class="col-12">
            <hl-editor
              @change="
                (v) => {
                  reserveData.src_note = v;
                }
              "
              :content="reserveData.src_note"
              :minHeight="$q.screen.height * 0.4"
              titleText="预订说明"
            ></hl-editor>
          </div>
        </q-form>
      </div>
    </div>

    <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
      <q-btn unelevated color="primary" class="q-px-xl" label="保存" :disable="addButtonDisabled" @click="setData" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'ReserveConfig',
  data () {
    return {
      addButtonDisabled: false,
      time_start: '',
      time_end: '',
      week_limit: [],
      reserveData: {
        src_status: '1',
        src_note: '',
        src_interval_time: '30',
        src_order_lose_time: '30',
        src_order_cancel_time: '3'
      },
      todayOptions: [
        { label: '可预订当天', value: '1' },
        { label: '不可预订当天', value: '2' }
      ],
      statusOptions: [
        { label: '开启', value: '1' },
        { label: '禁用', value: '-1' }
      ]
    }
  },
  mounted () {},
  created () {
    this.getConfigItem()
  },
  computed: {},
  methods: {
    getConfigItem () {
      this.addButtonDisabled = false
      this.$store
        .dispatch('bookManage/getBookConfigData')
        .then((res) => {
          if (res.code == 200 && res.data.id) {
            this.reserveData = res.data
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    setData () {
      this.$refs.addProjectRef.validate().then((success) => {
        if (success) {
          const data = {
            ...this.reserveData
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('bookManage/setBookConfigData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存配置成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.getConfigItem()
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
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    }
  }
}
</script>
