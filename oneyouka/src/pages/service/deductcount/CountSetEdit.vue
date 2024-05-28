<template>
  <q-dialog v-model="dialogShow" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.3) + 'px',
        'max-width': parseInt($q.screen.width * 0.3) + 'px',
      }"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">次卡延期</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @close="clearFields" />
      </q-card-section>
      <q-card-section>
        <q-form ref="countDataRef" class="q-gutter-md">
          <q-card flat square class="q-pa-md">
            <div class="text-subtitle2 q-mb-xs">
              <q-icon name="las la-square-full" class="text-primary" />到期时间：
              {{ $q_date.formatDate(countData.mrc_endTime * 1000, 'YYYY-MM-DD HH:mm:ss') }}
            </div>
            <q-separator />
            <div class="row">
              <div class="col-12">
                <div class="text-subtitle1 q-mt-md">延期设置</div>
                <q-option-group
                  v-model="timeType"
                  :options="[
                    {
                      label: '永久有效',
                      value: '1',
                    },
                    {
                      label: '指定时间',
                      value: '3',
                    },
                  ]"
                  color="primary"
                  inline
                  emit-value
                  map-options
                  @input="changeOptions"
                >
                </q-option-group>
              </div>
              <div class="col-12" v-if="timeType == '3'">
                <q-input outlined v-model="endTime" label="到期时间" dense lazy-rules :error="false" class="q-mt-xs" readonly>
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                        <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" today-btn>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="确定" color="primary" flat />
                          </div>
                        </q-date>
                      </q-menu>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                        <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="确定" color="primary" flat />
                          </div>
                        </q-time>
                      </q-menu>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <div class="text-subtitle1 q-mt-md">延期备注</div>
                <q-input outlined bottom-slots v-model="remarks" :rows="3" dense type="textarea"> </q-input>
              </div>
            </div>
          </q-card>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" class="q-pb-md">
        <q-btn label="确定" @click="updateButton()" color="primary" class="text-right q-px-md" unelevated />
        <q-btn label="取消" @click="clearFields()" class="text-right q-px-md" color="grey" unelevated />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'CountSetEdit',
  components: {},
  data () {
    return {
      dialogShow: false,
      timeType: '1',
      endTime: 2147457847,
      remarks: '',
      countData: {}
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    openEditDialog (data) {
      this.countData = JSON.parse(JSON.stringify(data))
      this.dialogShow = true
    },
    clearFields () {
      this.timeType = '1'
      this.endTime = ''
      this.remarks = ''
      this.dialogShow = false
    },
    updateButton () {
      this.$refs.countDataRef.validate().then((success) => {
        if (success) {
          if (this.timeType == '3') {
            const startTime = this.$q_date.formatDate(new Date(new Date().getTime()), 'X')
            const endTime = this.$q_date.formatDate(new Date(this.endTime), 'X')
            if (startTime >= endTime) {
              this.$q.notify({
                message: '注意',
                caption: '到期时间不能大于等于当前时间',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
              return false
            }
            this.endTime = this.$q_date.formatDate(new Date(this.endTime), 'X')
          }

          const obj = {
            endTime: this.endTime,
            remarks: this.remarks,
            ...this.countData
          }
          this.$store
            .dispatch('deductCount/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.clearFields()
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '成功延期',
                  color: 'green'
                })
                this.$emit('setSuccess')
              } else {
                this.clearFields()
                this.$q.notify({
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '失败',
                  caption: res.message,
                  color: 'red'
                })
                this.$emit('setSuccess')
              }
            })
            .catch((error) => {
              this.$q.notify({
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '失败',
                caption: error.message,
                color: 'red'
              })
            })
        }
      })
    },
    changeOptions () {
      if (this.timeType == '3') {
        this.endTime = this.$q_date.formatDate(new Date().getTime(), 'YYYY-MM-DD HH:mm:ss')
      }
      if (this.timeType == '1') {
        this.endTime = 2147457847
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
    }
  }
}
</script>
