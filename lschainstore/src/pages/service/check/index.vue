<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        卡券核销
      </div>
      <div class="col-shrink bg-white full-height bg-grey-2 q-mt-xs">
        <div class="row fit bg-white justify-around">
          <q-form @submit="countCardInquirenCheck" ref="submitFormRef" class="col-12  col-md-4 text-center q-px-xs  q-pt-md">
            <q-card square flat class="full-width">
              <q-input
                label="次卡核销码"
                outlined
                bottom-slots
                @keyup.enter.native="couponCheck"
                v-model="markCode"
                lazy-rules
                class="text-h6 full-width"
                :rules="[(val) => !!val || '请填写次卡核销码']"
                :disable="countCardInfo && countCardInfo.id ? true : false"
              >
              </q-input>
            </q-card>

            <q-card flat bordered v-if="countCardInfo && countCardInfo.id">
              <q-list>
                <q-item>
                  <q-item-section avatar>
                    <q-icon color="amber" name="assignment" />
                  </q-item-section>
                  <q-item-section class="text-dark" side>
                    <q-item-label>{{ countCardInfo.mrc_goodsName }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon color="amber" name="av_timer" />
                  </q-item-section>

                  <q-item-section class="text-dark" side>
                    <q-item-label>到期时间</q-item-label>
                    <q-item-label caption> {{ expireDate(countCardInfo) }} </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon color="red" name="device_unknown" />
                  </q-item-section>

                  <q-item-section class="text-dark" side>
                    <q-item-label>使用规则</q-item-label>
                    <q-item-label lines="2">
                      {{ rulesUse(countCardInfo) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

              </q-list>
              <div class="q-pa-sm q-pr-xl">
                <q-input outlined dense :rules="[(val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val > 0 : true) || '请输入正确的数值']" v-model="deductcount"  label="本次扣除">
                  <template v-slot:before>
                    <div class="text-dark text-caption">
                      可用 <span class="text-h6 text-red">{{ countCardInfo.mrc_count }}</span> 次
                    </div>
                  </template>

                  <template v-slot:append>

                     <div class="text-dark text-caption">
                       次
                     </div>
                  </template>
                </q-input>
              </div>
            </q-card>
          </q-form>
        </div>
      </div>
      <div class="col-shrink bg-white q-pb-md q-gutter-md  q-mt-xs text-center">
        <q-btn unelevated color="amber-8" class="q-px-xl" label="重置" :disable="!markCode" @click="refreshBut()" size="lg" />
        <q-btn unelevated color="positive" class="q-px-xl" label="核销" @click="timeCardCheck" v-if="countCardInfo && countCardInfo.id" :disable="!markCode" size="lg" />
        <q-btn unelevated color="primary" class="q-px-xl" label="查询" v-else :disable="!markCode" size="lg" @click="countCardInquirenCheck" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'TimeCardCheck',
  data () {
    return {
      markCode: '',
      countCardInfo: {},
      deductcount: '1'
    }
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    countCardInquirenCheck () {
      this.$refs.submitFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            mark_code: this.markCode
          }
          this.$store
            .dispatch('deductCount/getCheckCountCard', obj)
            .then((res) => {
              if (res.code == 200) {
                this.countCardInfo = res.data
              } else {
                this.markCode = ''
                this.countCardInfo = {}
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {})
        }
      })
    },

    timeCardCheck () {
      this.$refs.submitFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            mark_code: this.markCode,
            deductcount: this.deductcount
          }
          this.$store
            .dispatch('deductCount/timecardcheck', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  color: 'green',
                  message: '成功',
                  caption: '核销成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.countCardInfo = {}
                this.markCode = ''
              } else {
                this.countCardInfo = {}
                this.markCode = ''
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {})
        }
      })
    },

    rulesUse (p) {
      if (parseInt(p.mrc_limitTime) == 1) {
        return '不限制规定时间使用次数'
      } else if (parseInt(p.mrc_limitTime) == 2) {
        return '使用限制为每年可使用' + p.mrc_limitCount + '次'
      } else if (parseInt(p.mrc_limitTime) == 3) {
        return '使用限制为每季度可使用' + p.mrc_limitCount + '次'
      } else if (parseInt(p.mrc_limitTime) == 4) {
        return '使用限制为每月可使用' + p.mrc_limitCount + '次'
      } else if (parseInt(p.mrc_limitTime) == 5) {
        return '使用限制为每周可使用' + p.mrc_limitCount + '次'
      } else {
        return '使用限制为每天可使用' + p.mrc_limitCount + '次'
      }
    },

    expireDate (p) {
      if (parseInt(p.mrc_endTime) >= 2147457847) {
        return '永久有效'
      } else {
        return this.$q_date.formatDate(p.mrc_endTime * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },

    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },
    refreshBut () {
      this.markCode = ''
      this.countCardInfo = {}
      this.deductcount = ''
    }
  }
}
</script>
