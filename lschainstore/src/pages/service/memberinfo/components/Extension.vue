<template>
  <div>
    <q-dialog v-model="delayChange">
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth
        }"
      >
        <q-toolbar>
          <q-toolbar-title>会员延期</q-toolbar-title>
          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
            @click="closeButton"
          />
        </q-toolbar>
        <q-card-section>
          <q-card flat bordered class="q-mt-sm">
            <q-card-section>
              <div class="text-subtitle1">有效期设置</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="row">
                <span class="text-subtitle1 q-mt-sm">有效期</span>
                <q-option-group
                  v-model="extensionType"
                  :options="endTime"
                  color="primary"
                  inline
                  class="q-ml-sm"
                />
              </div>
              <div class="row q-mt-sm" v-if="extensionType == '2'">
                <q-input
                  outlined
                  v-model="extension"
                  label="到期时间"
                  dense
                  square
                  lazy-rules
                  :error="false"
                  class="q-mt-xs"
                  readonly
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        transition-show="scale"
                        transition-hide="scale"
                        class="q-pa-non"
                      >
                        <q-date
                          minimal
                          class="q-pa-none"
                          v-model="extension"
                          mask="YYYY-MM-DD  "
                          today-btn
                        >
                          <div class="row q-pa-non">
                            <q-btn
                              v-close-popup
                              label="确定"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="row q-mt-sm" v-if="extensionType == '3'">
                <span class="q-mt-sm">即日起：</span>
                <div class="col-2">
                  <q-input
                    v-model="number"
                    outlined
                    bottom-slots
                    dense
                    class="q-ml-md"
                  >
                  </q-input>
                </div>
                <div class="col-6">
                  <q-select
                    outlined
                    dense
                    map-options
                    emit-value
                    v-model="relativelyTime"
                    :options="time"
                    label="选择范围"
                    class="q-ml-md"
                  />
                </div>
                <span class="q-mt-sm">内有效</span>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions>
              <div class="q-px-sm">
                当前会员到期时间
                <q-chip
                  square
                  color="green-1"
                  text-color="green"
                  class="q-ml-sm"
                  v-if="extensionType == 2"
                >
                  {{ extension }}
                </q-chip>
                <q-chip
                  square
                  color="green-1"
                  text-color="green"
                  class="q-ml-sm"
                  v-if="extensionType == 3"
                >
                  {{ number }}{{ time[relativelyTime - 1].label }}后
                </q-chip>
                <q-chip
                  square
                  color="green-1"
                  text-color="green"
                  class="q-ml-sm"
                  v-if="extensionType == 1"
                >
                  永久有效
                </q-chip>
              </div>
            </q-card-actions>
          </q-card>
          <div class="row q-mt-md">
            <q-space />
            <q-btn
              outline
              unelevated
              color="grey"
              label="关闭"
              @click="closeButton"
              v-close-popup
            />
            <q-btn
              unelevated
              color="primary"
              label="保存"
              class="q-ml-sm"
              @click="saveBut"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'Extension',
  data () {
    return {
      dialogWidth: '1000px',
      extension: '', // 延期时间
      number: 1,
      extensionType: 1,
      relativelyTime: 1,
      time: [
        { label: '年', value: 1 },
        { label: '季度', value: 2 },
        { label: '月', value: 3 },
        { label: '周', value: 4 },
        { label: '日', value: 5 }
      ],
      endTime: [
        {
          label: '永久有效',
          value: 1
        },
        {
          label: '指定时间',
          value: 2
        },
        {
          label: '相对有效',
          value: 3
        }
      ],
      delayChange: false,
      memberInformation: {
        mem_specifiedEndTime: '',
        changeOperate: 'postpone'
      }
    }
  },
  mounted () {},
  created () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.4) + 'px'
    }
  },
  computed: {},
  methods: {
    init (val) {
      if (val > 0) {
        this.memberInformation.id = val
        this.delayChange = true
      }
    },
    // 关闭
    closeButton () {
      this.delayChange = false
      this.memberInformation.mem_specifiedEndTime = ''
      this.number = 1
      this.extensionType = 1
      this.relativelyTime = 1
      this.extension = ''
    },
    saveBut () {
      const timestamp = new Date().getTime() / 1000
      if (parseInt(this.extensionType) == 1) {
        this.memberInformation.mem_specifiedEndTime = 2147457847
      } else if (parseInt(this.extensionType) == 2) {
        // this.memberInformation.mem_specifiedEndTime = this.extension;
        this.memberInformation.mem_specifiedEndTime = parseInt(
          this.$q_date.formatDate(
            new Date(Date.parse(this.extension.replace(/-/g, '/'))).getTime(),
            'X'
          )
        )
        if (this.memberInformation.mem_specifiedEndTime <= timestamp) {
          this.$q.notify({
            message: '保存失败',
            caption: '延期时间应大于当前时间，请重新选择！',
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
          return false
        }
      } else if (parseInt(this.extensionType) == 3) {
        if (this.relativelyTime == 1) {
          this.memberInformation.mem_specifiedEndTime = parseInt(
            this.number * 31536000 + timestamp
          )
        } else if (this.relativelyTime == 2) {
          this.memberInformation.mem_specifiedEndTime = parseInt(
            this.number * 7776000 + timestamp
          )
        } else if (this.relativelyTime == 3) {
          this.memberInformation.mem_specifiedEndTime = parseInt(
            this.number * 2592000 + timestamp
          )
        } else if (this.relativelyTime == 4) {
          this.memberInformation.mem_specifiedEndTime = parseInt(
            this.number * 604800 + timestamp
          )
        } else if (this.relativelyTime == 5) {
          this.memberInformation.mem_specifiedEndTime = parseInt(
            this.number * 86400 + timestamp
          )
        }
      }

      const obj = {
        ...this.memberInformation
      }
      this.$store
        .dispatch('member/setData', obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '会员延期成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            this.$emit(
              'returnMethod',
              this.memberInformation.mem_specifiedEndTime
            )
            this.closeButton()
          }
        })
        .catch(error => {
          this.$q.notify({
            message: '失败',
            caption: '操作失败！',
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    }
  }
}
</script>
