<template>
  <q-dialog v-model="isSidebarActiveLocal" persistent>
    <q-card
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth,
      }"
    >
      <q-card-section class="row items-center q-pb-none">
        <div>预警设置</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-form ref="numberDataRef" class="q-gutter-md">
        <q-card-section class="q-pt-lg">
          <q-select
            class="col-12 q-mt-sm q-mr-xs"
            outlined
            v-model="warningRulesId"
            :options="warningRules"
            option-value="id"
            @input="selectWarning"
            option-label="wr_title"
            map-options
            dense
            label="库存预警规则"
          />
          <div class="col-12 q-mt-sm q-mr-xs">
            <q-input
              label="库存数量预警"
              v-model="numberForm.gn_count_warning"
              outlined
              dense
              lazy-rules
              :rules="[(val) => !!val || /^\d+$/.test(val) || '库存预警数量为非负整数']"
            />
          </div>
          <div class="col-12 q-mt-sm q-mr-xs">
            <q-input outlined v-model="numberForm.gn_maturity_time" label="开始时间" dense square readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy  transition-show="scale" transition-hide="scale">
                    <q-date v-model="numberForm.gn_maturity_time" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
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
                    <q-time v-model="numberForm.gn_maturity_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" v-if="authorityMeta('warning')" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-card-section>
      </q-form>

      <q-card-actions align="right">
        <q-btn unelevated label="确认" color="primary" @click="submitData" class="q-mb-lg" />
        <q-btn label="关闭" unelevated color="grey" class="q-mb-lg q-ml-sm q-mr-lg" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AgButton',
  data () {
    return {
      dialogWidth: '1000px',
      isSidebarActiveLocal: false,
      numberForm: {
        gn_count_warning: 0,
        gn_maturity_time: ''
      },
      numberData: [],
      warningRules: [],
      warningRulesId: ''
    }
  },
  computed: {},
  created () {
    this.getWarningRules()
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.3) + 'px'
    }
  },
  mounted () {},
  methods: {
    setWarning (val) {
      this.numberForm = {
        gn_count_warning: 0,
        gn_maturity_time: ''
      }
      this.isSidebarActiveLocal = true
      this.numberData = val
    },
    submitData () {
      this.$refs.numberDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            gn_maturity_time: this.$q_date.formatDate(this.numberForm.gn_maturity_time, 'X'),
            gn_count_warning: this.numberForm.gn_count_warning,
            numberData: this.numberData
          }
          this.$store
            .dispatch('erpnumber/setNumber', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  color: 'green',
                  message: '成功',
                  caption: '设置成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.isSidebarActiveLocal = false
                this.$emit('warning')
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.data.msg,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {})
        }
      })
    },
    getWarningRules () {
      this.$store
        .dispatch('warningRules/getData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.warningRules = res.data
            }
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
        })
    },
    selectWarning (val) {
      console.log(val)
      this.numberForm.gn_count_warning = val.wr_count
      this.numberForm.gn_maturity_time = this.$q_date.formatDate(val.wr_time * 1000, 'YYYY-MM-DD  HH:mm:ss')
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
