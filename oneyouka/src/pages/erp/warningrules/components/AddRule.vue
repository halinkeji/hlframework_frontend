<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="isSidebarActiveLocal" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ ruleForm.id > 0 ? '修改' : '新增' }}预警规则</div>

          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>
        <q-form ref="ruleDataRef" class="q-gutter-md">
          <q-card-section class="q-pt-lg">
            <div class="row">
              <div class="col-md-6 col-12 q-pr-sm q-mt-xs">
                <q-input
                  label="预警规则标题"
                  outlined
                  v-model="ruleForm.wr_title"
                  dense
                  lazy-rules
                  :rules="[(val) => !!val || '预警规则标题是必填的']"
                />
              </div>
              <div class="col-md-6 col-12 q-pr-sm q-mt-xs">
                <q-select
                  outlined
                  emit-value
                  map-options
                  option-value="value"
                  option-label="label"
                  v-model="ruleForm.wr_type"
                  :options="ruleTypeData"
                  dense
                  label="预警规则类型"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-12 q-pr-sm q-mt-xs">
                <q-input
                  label="预警数量"
                  outlined
                  v-model="ruleForm.wr_count"
                  dense
                  lazy-rules
                  :rules="[(val) => /^\d+$/.test(val) || '预警数量为非负整数']"
                />
              </div>
              <div class="col-md-6 col-12 q-pr-sm q-mt-xs">
                <q-input outlined v-model="ruleForm.wr_time" label="预警时间" dense square readonly>
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="ruleForm.wr_time" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="确定" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy  transition-show="scale" transition-hide="scale">
                        <q-time v-model="ruleForm.wr_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="确定" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>
        </q-form>
        <q-card-actions align="right">
          <q-btn unelevated label="确认" color="primary" @click="submitData" class="q-mb-lg" :disable="stop" />
          <q-btn label="关闭" unelevated @click="hideNowPage" color="grey" class="q-mb-lg q-ml-sm q-mr-lg" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'AddRule',
  data () {
    return {
      dialogWidth: '1000px',
      dataId: '',
      isSidebarActiveLocal: false,
      disabledStatus: false,
      localeText: this.$ag_grid_localeText,
      stop: false,
      ruleForm: {
        wr_title: '',
        wr_count: 0,
        wr_time: '',
        wr_type: '1'
      },
      ruleTypeData: [
        { value: '1', label: '同时满足' },
        { value: '2', label: '单个满足' }
      ]
    }
  },
  created () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.4) + 'px'
    }
  },
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.dataId = id
      this.isSidebarActiveLocal = true
      if (id > 0) {
        this.$store.dispatch('warningRules/getItem', this.dataId).then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.ruleForm = res.data
              this.ruleForm.wr_time = this.ruleForm.wr_time > 0 ? this.$q_date.formatDate(this.ruleForm.wr_time * 1000, 'YYYY-MM-DD HH:mm:ss') : ''
            }
          }
        })
      }
    },
    submitData () {
      this.$refs.ruleDataRef.validate().then((success) => {
        if (success) {
          this.stop = true
          this.disabledStatus = true
          const time = this.$q_date.formatDate(this.ruleForm.wr_time, 'X')
          const obj = {
            wr_title: this.ruleForm.wr_title,
            wr_count: this.ruleForm.wr_count,
            wr_time: time,
            wr_type: this.ruleForm.wr_type,
            id: this.dataId
          }
          this.$store.dispatch('warningRules/setData', obj).then((res) => {
            if (res.code == 200) {
              this.isSidebarActiveLocal = false
              this.$q.notify({
                message: '成功',
                caption: '操作成功！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              this.$nextTick(() => {
                this.disabledStatus = false
                this.hideNowPage()
              })
            } else {
              this.disabledStatus = false
            }
          })
        }
      })
    },

    hideNowPage () {
      this.$emit('refreshDataList')
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
