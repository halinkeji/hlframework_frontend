<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
        height: parseInt(this.$q.screen.width * 0.2) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md">
          <div class="text-subtitle1">核销场次</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink bg-white full-height bg-grey-2 q-mt-xs">
          <div class="row fit bg-white justify-around">
            <q-card square flat class="full-width">
              <q-input
                label="核销码"
                outlined
                bottom-slots
                @keyup.enter.native="coupoInquirenCheck"
                v-model="checkCode"
                lazy-rules
                class="text-h6 full-width"
                :rules="[(val) => !!val || '请填写核销码']"
                :disable="recodeInfo && recodeInfo.id ? true : false"
              >
              </q-input>
            </q-card>

            <q-list v-if="recodeInfo && recodeInfo.id">
              <q-item clickable v-if="recodeInfo.site">
                <q-item-section avatar>
                  <q-icon color="primary" name="local_bar" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ recodeInfo.site ? recodeInfo.site.cs_name : '' }} ( {{ parseInt(recodeInfo.cs_attribute) == 1 ? '全场' : '半场' }} ) </q-item-label>
                  <q-item-label caption>场地</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-if="recodeInfo.member">
                <q-item-section avatar>
                  <q-icon color="red" name="local_gas_station" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ recodeInfo.member.mem_memberName }}</q-item-label>
                  <q-item-label caption>卡号：{{ recodeInfo.member.mem_memberCardNum }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="amber" name="local_movies" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{
                    recodeInfo.cr_year +
                    '-' +
                    recodeInfo.cr_month +
                    '-' +
                    recodeInfo.cr_day +
                    ' ' +
                    recodeInfo.cr_start_hour +
                    ':' +
                    recodeInfo.cr_start_minutes +
                    ' - ' +
                    recodeInfo.cr_end_hour +
                    ':' +
                    recodeInfo.cr_end_minutes
                  }}</q-item-label>
                  <q-item-label caption>时间</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
        <div class="col-shrink bg-white q-pb-md q-gutter-md q-mt-xs text-center">
          <q-btn unelevated color="amber-8" class="q-px-xl" label="重置" :disable="!checkCode" @click="refreshBut()" size="lg" />
          <q-btn
            unelevated
            color="positive"
            class="q-px-xl"
            label="核销"
            v-if="recodeInfo && recodeInfo.id"
            :disable="!checkCode"
            size="lg"
            @click="couponCheck"
          />
          <q-btn unelevated color="primary" class="q-px-xl" label="查询" v-else :disable="!checkCode" size="lg" @click="coupoInquirenCheck" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'CdyyRecordCheck',
  data () {
    return {
      checkCode: '',
      recodeInfo: {},
      addStoreSidebar: false
    }
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    init () {
      this.addStoreSidebar = true
    },
    coupoInquirenCheck () {
      const obj = {
        check_code: this.checkCode
      }
      this.$store
        .dispatch('cdyy/queryCodeSiteInfo', obj)
        .then((res) => {
          if (res.code == 200) {
            this.recodeInfo = res.data
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })

            this.checkCode = ''
            this.recodeInfo = {}
          }
        })
        .catch((error) => {})
    },
    couponCheck () {
      const obj = {
        check_code: this.checkCode
      }
      this.$store
        .dispatch('cdyy/checkSite', obj)
        .then((res) => {
          if (res.code == 400) {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            this.checkCode = ''
            this.recodeInfo = {}
            return false
          }
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '核销成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.checkCode = ''
            this.recodeInfo = {}
          }
        })
        .catch((error) => {})
    },
    hideNowPage () {
      this.addStoreSidebar = false
      this.$emit('closeDialog')
    },
    refreshBut () {
      this.checkCode = ''
      this.recodeInfo = {}
    }
  }
}
</script>
