<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-pa-sm full-height bg-white ">
      <q-scroll-area class="fit full-height">
        <q-form ref="rewardConfigForm" class="row q-col-gutter-md">
          <div class="col-12 col-md-4 ">
            <q-card flat bordered>
              <q-card-section class="row items-center">
                <div class="text-subtitle2">绩效开关设置</div>
                <q-space />

                <q-radio v-model="rewardConfigData.mrc_status" val="1" label="开启" />
                <q-radio v-model="rewardConfigData.mrc_status" val="0" label="关闭" />
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="row">
                  <q-checkbox
                    v-for="(item, key) in serviceData"
                    :key="'serve' + key"
                    v-model="rewardConfigData.mrc_open_serve"
                    :label="item.lable"
                    keep-color
                    :val="item.value"
                  />
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section class="text-caption">
                默认不开启。开启后，勾选相应功能，在结算时可进行员工绩效分配。
              </q-card-section>
            </q-card>

            <q-card flat bordered class="q-mt-sm" v-if="parseInt(rewardConfigData.mrc_status) == 1">
              <q-card-section class="row items-center">
                <div class="text-subtitle2">计时项目员工绩效计算设置</div>
                <q-space />
              </q-card-section>

              <q-separator />

              <q-card-section>
                <q-input outlined dense label="时间段" v-model="rewardConfigData.mrc_timing_convert" lazy-rules>
                  <template v-slot:append>
                    <span class="text-dark text-body2">分</span>
                  </template>
                </q-input>
              </q-card-section>

              <q-separator />

              <q-card-section class="text-caption">
                此设置仅限增加计时、套餐充时、计时消费功能的员工绩效分配。例如：员工小A服务客户30分钟/次，获得绩效5{{
                  $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit
                }}，则绩效时间段填写 30，本单客户消费时长为100分钟，则小A本单可得总绩效为20{{
                  $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit
                }}（（100/30 ≈ 4）* 5 ）。
              </q-card-section>
            </q-card>

          </div>
        </q-form>
      </q-scroll-area>
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
      rewardConfigData: {
        mrc_open_serve: [],
        mrc_timing_convert: '',
        mrc_status: 0
      },

      statusOptions: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '0' }
      ],
      serviceData: []
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
        .dispatch('rewardPosition/getItemData')
        .then((res) => {
          if (res.code == 200) {
            this.serviceData = res.data && res.data.serviceData ? res.data.serviceData : []
            this.rewardConfigData =
              res.data && res.data.info
                ? res.data.info
                : {
                    mrc_open_serve: [],
                    mrc_timing_convert: '',
                    mrc_status: '0'
                  }
            this.rewardConfigData.mrc_open_serve = res.data && res.data.info && res.data.info.mrc_open_serve ? res.data.info.mrc_open_serve : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '获取失败',
              color: 'red'
            })
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
      this.$refs.rewardConfigForm.validate().then((success) => {
        if (success) {
          const data = {
            ...this.rewardConfigData
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('rewardPosition/setItemData', data)
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
