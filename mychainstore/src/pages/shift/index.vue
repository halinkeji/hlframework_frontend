<template>
  <div>
    <q-dialog v-model="shiftDialogStatus" persistent>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.5) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
          height: parseInt(this.$q.screen.width * 0.7) + 'px',
        }"
        class="fit"
      >
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
            <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
            交接班
          </div>
          <q-separator />

          <div class="col-shrink q-pa-sm full-height bg-white">
            <q-scroll-area class="fit full-height">
              <div class="row q-col-gutter-xs items-center">
                <div class="col-5">
                  <q-item clickable v-ripple class="bg-grey-3">
                    <q-item-section>
                      <q-item-label caption> 交班时间 </q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-primary text-weight-bold">
                        {{ psr_heir_time }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-5">
                  <q-item clickable v-ripple class="bg-grey-3">
                    <q-item-section>
                      <q-item-label caption> 接班时间 </q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-primary text-weight-bold">
                        {{ psr_transfer_time }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>

                <div class="col text-center">
                  <q-btn color="primary" unelevated label="选择时间" v-if="current_user_id" @click="openSelectDialog" />
                </div>
              </div>
              <div class="row q-col-gutter-xs q-mt-sm">
                <div :class="`col-${item.col}`" :key="key" v-for="(item, key) in totalCountData">
                  <q-table
                    title-class="text-subtitle2"
                    flat
                    bordered
                    :pagination="{
                      rowsPerPage: 0,
                    }"
                    :title="item.title"
                    :data="[item.data]"
                    :columns="item.column"
                    row-key="field"
                    hide-bottom
                    separator="cell"
                  >
                  </q-table>
                </div>
                <div class="col-12">
                  <q-input v-model="psr_note" filled type="textarea" label="交接班备注" />
                </div>
              </div>
            </q-scroll-area>
          </div>

          <div class="col-shrink bg-white q-mt-xs q-py-sm text-center q-gutter-sm">
            <q-btn class="q-px-xl" unelevated label=" 交 班 " @click="saveData" color="primary" />
            <q-btn unelevated label="取消" class="q-px-xl" color="grey" @click="shiftDialogStatus = false" />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="timePeriodDialog" persistent>
      <q-card
      :style="{
          width: parseInt(this.$q.screen.width * 0.2) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.2) + 'px',
        }"
        >
        <q-card-section class="q-pa-sm">
          <div class="text-subtitle2">选择接班时间</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input outlined dense label="开始时间" v-model="psr_heir_time" readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer" v-if="changeHeirTimeStatus">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="psr_heir_time" mask="YYYY-MM-DD HH:mm:ss">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer" v-if="changeHeirTimeStatus">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="psr_heir_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <q-input outlined dense label="结束时间" v-model="psr_transfer_time" readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="psr_transfer_time" mask="YYYY-MM-DD HH:mm:ss">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="psr_transfer_time" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>

        <q-separator />

        <q-card-actions class="row" align="center">
          <q-btn unelevated label="确认" class="q-px-xl" color="primary" @click="getSummaryList" />
             <q-btn unelevated label="取消" class="q-px-xl" color="grey" @click="closeDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { LocalStorage } from 'quasar'

export default {
  name: 'shiftIndex',
  components: {},
  data () {
    return {
      psr_heir_time: '', // 接班时间
      psr_transfer_time: '', // 交班时间
      psr_note: '',
      totalCountData: [],
      timePeriodDialog: true,
      current_user_id: 0,
      changeHeirTimeStatus: true,
      shiftDialogStatus: false
    }
  },
  created () {
    const accountInfo = LocalStorage.getItem('mychainstore_account_info')
    if (accountInfo && accountInfo.user_id) {
      this.current_user_id = accountInfo.user_id
      this.getLastData()
    } else {
      this.timePeriodDialog = false
      this.$q.notify({
        message: '失败',
        icon: 'ion-close-circle-outline',
        timeout: 500,
        position: 'top-right',
        caption: '系统错误',
        color: 'red'
      })
    }
  },
  mounted () {},
  computed: {},

  methods: {
    init () {
      this.timePeriodDialog = true
      this.$nextTick(() => {
        this.getLastData()
      })
    },
    // 获取最后一条数据
    getLastData () {
      this.$store
        .dispatch('commonShift/getLastData')
        .then((res) => {
          if (res.code == 200) {
            const heir_time = res.data ? res.data * 1000 : new Date()
            this.psr_heir_time = this.$q_date.formatDate(heir_time, 'YYYY-MM-DD HH:mm:ss')
            this.psr_transfer_time = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
            this.changeHeirTimeStatus = !res.data
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
    // 获取汇总数据
    getSummaryList () {
      if (this.psr_heir_time && this.psr_transfer_time) {
        this.timePeriodDialog = false
        this.shiftDialogStatus = true
        this.$store
          .dispatch('commonShift/getSummary', {
            psr_heir_time: this.psr_heir_time,
            psr_transfer_time: this.psr_transfer_time,
            current_user_id: this.current_user_id
          })
          .then((res) => {
            if (res.code == 200) {
              this.totalCountData = res.data ? res.data : []
            } else {
              this.$q.notify({
                message: '错误',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: res.message,
                color: 'red'
              })
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
      }

      return false
    },

    openSelectDialog () {
      this.timePeriodDialog = true
    },

    saveData () {
      this.$q
        .dialog({
          title: '确认交班',
          message: '交班统计数据无误?',
          cancel: {
            title: '取消',
            color: 'grey'
          },
          ok: {
            title: '确认',
            color: 'positive'
          },
          persistent: true
        })

        .onOk(() => {
          const obj = {
            ...this.totalCountData,
            psr_heir_time: this.$q_date.formatDate(this.psr_heir_time, 'X'),
            psr_transfer_time: this.$q_date.formatDate(this.psr_transfer_time, 'X'),
            psr_note: this.psr_note
          }
          this.$store
            .dispatch('commonShift/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q
                  .dialog({
                    title: '成功！',
                    message: '交接班成功，是否退出当前账号?',
                    cancel: {
                      title: '在等等',
                      color: 'primary'
                    },
                    ok: {
                      title: '确认',
                      color: 'positive'
                    },
                    persistent: true
                  })

                  .onOk(() => {
                    this.shiftDialogStatus = false
                    this.$emit('logoutAccount')
                  })
                  .onCancel(() => {
                    this.closeDialog()
                  })
                  .onDismiss(() => {
                    // console.log('I am triggered on both OK and Cancel')
                  })
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
        })
        .onCancel(() => {

        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
    },
    closeDialog () {
      this.timePeriodDialog = false
      this.timePeriodDialog = false
      this.$emit('closeDialog')
    }
  }
}
</script>
