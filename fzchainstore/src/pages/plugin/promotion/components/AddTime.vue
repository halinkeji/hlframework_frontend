<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.4) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.4) + 'px',
      }"
      class="q-pa-md"
    >
      <q-card-section class="row items-center">
        <div class="text-h6">{{ dataId > 0 ? '修改' : '新增' }}促销档期</div>
        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>
      <q-form ref="configDataRef">
        <div class="row">
          <div class="col-12">
            <span>档期编号 <span class="text-red q-pl-xs">*</span></span>
            <q-input
              outlined
              dense
              v-model="dataFrom.ppt_number"
              placeholder="请输入档期编号"
              lazy-rules
              :rules="[(val) => !!val || '档期编号不能为空']"
              maxlength="100"
            />
          </div>
          <div class="col-12">
            <span>档期名称 <span class="text-red q-pl-xs">*</span></span>
            <q-input
              outlined
              dense
              v-model="dataFrom.ppt_name"
              placeholder="请输入档期名称"
              lazy-rules
              :rules="[(val) => !!val || '档期名称不能为空']"
              maxlength="100"
            />
          </div>
          <div class="col-6">
            <q-input outlined v-model="startTime" label="开始时间" dense readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                    <q-date v-model="startTime" mask="YYYY-MM-DD" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="关闭" color="primary" flat />
                      </div>
                    </q-date>
                  </q-menu>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:hint> 选择促销开始时间 </template>
            </q-input>
          </div>
          <div class="col-6 ">
            <q-input outlined v-model="endTime" label="结束时间" dense readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                    <q-date v-model="endTime" mask="YYYY-MM-DD" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="关闭" color="primary" flat />
                      </div>
                    </q-date>
                  </q-menu>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:hint> 选择促销结束时间 </template>
            </q-input>
          </div>
          <div class="col-12 q-my-md">
            <q-select
              outlined
              v-model="dataFrom.ppt_status"
              map-options
              emit-value
              dense
              option-label="label"
              option-value="value"
              :options="[
                {
                  label: '开启',
                  value: '1',
                },
                {
                  label: '关闭',
                  value: '0',
                },
              ]"
              :rules="[(val) => !!val || '状态是必填项']"
              label="选择状态"
            />
          </div>
          <div class="col-12">
            <q-input outlined bottom-slots v-model="dataFrom.ppt_note" dense :rows="3" label="档期备注" type="textarea"></q-input>
          </div>
        </div>
      </q-form>
      <div align="center" class="q-mt-lg">
        <q-btn unelevated label="确认" class="q-px-xl" :disable="btnDisable" color="primary" @click="saveData" />
        <q-btn unelevated label="关闭" class="q-ml-sm q-px-xl" color="grey" v-close-popup />
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddTime',
  data () {
    return {
      configData: [],
      dataId: 0,
      dataFrom: {
        ppt_number: '',
        ppt_name: '',
        ppt_start_time: '',
        ppt_end_time: '',
        ppt_status: '1',
        ppt_note: ''
      },
      startTime: '',
      endTime: '',
      dialogWidth: '1020px',
      showDialog: true,
      btnDisable: false
    }
  },
  created () {},
  methods: {
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.getItem(id)
      }
    },
    getItem (id) {
      this.dataId = id
      if (id > 0) {
        this.$store.dispatch('promotion/getTimeItem', id).then((res) => {
          if (res.code == 200) {
            this.dataFrom = res.data ? res.data : {}
            this.startTime = this.$q_date.formatDate(res.data.ppt_start_time * 1000, 'YYYY-MM-DD')
            this.endTime = this.$q_date.formatDate(res.data.ppt_end_time * 1000, 'YYYY-MM-DD')
          }
        })
      }
    },
    saveData () {
      this.$refs.configDataRef.validate().then((success) => {
        if (success) {
          this.btnDisable = true
          const dataForm = this.dataFrom
          if (this.startTime) {
            dataForm.ppt_start_time = this.$q_date.formatDate(this.startTime, 'X')
          } else {
            dataForm.ppt_start_time = this.$q_date.formatDate(new Date(), 'X')
          }
          if (this.endTime) {
            dataForm.ppt_end_time = this.$q_date.formatDate(this.endTime, 'X')
          } else {
            dataForm.ppt_end_time = this.$q_date.formatDate(new Date(), 'X')
          }

          if (dataForm.ppt_end_time <= dataForm.ppt_start_time) {
            this.$q.notify({
              message: '失败',
              caption: '结束时间不得大于等于开始时间,请重新选择',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            this.btnDisable = false
            return false
          }

          const obj = {
            ...this.dataFrom,
            id: this.dataId
          }
          this.$store
            .dispatch('promotion/setTimeData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}促销档期成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.btnDisable = false
                this.hideNowPage()
              } else {
                this.$q.notify({
                  message: '失败',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: res.message,
                  color: 'red'
                })
                this.btnDisable = false
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
              this.btnDisable = false
            })
        }
      })
    },
    // 隐藏采购员信息弹窗
    hideNowPage () {
      this.showDialog = false
      this.dataFrom = {
        ppt_name: '',
        pmc_type: 1,
        pmc_full_amount: '',
        pmc_discount_amount: ''
      }
      this.startTime = ''
      this.endTime = ''
      this.dataId = 0
      this.$emit('dataList')
      this.btnDisable = false
    }
  }
}
</script>
