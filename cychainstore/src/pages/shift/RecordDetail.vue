<template>
  <q-dialog v-model="dialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md">
          <div class="text-subtitle1">交接班详情 </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white">
          <q-scroll-area class="fit full-height">
            <div class="row q-col-gutter-xs items-center">
              <div class="col-6">
                <q-item clickable v-ripple class="bg-grey-3">
                  <q-item-section>
                    <q-item-label caption> 交班时间 </q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-primary text-weight-bold">
                      {{ $q_date.formatDate(shiftForm.psr_heir_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-6">
                <q-item clickable v-ripple class="bg-grey-3">
                  <q-item-section>
                    <q-item-label caption> 接班时间 </q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-primary text-weight-bold">
                      {{ $q_date.formatDate(shiftForm.psr_transfer_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
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
                <q-input rows="3" v-model="shiftForm.psr_note" readonly filled type="textarea" label="交接班备注" />
              </div>
            </div>
          </q-scroll-area>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'shiftRecordDetail',
  components: {},
  data () {
    return {
      shiftForm: {
        psr_heir_time: '', // 接班时间
        psr_transfer_time: '', // 交班时间
        psr_note: ''
      },

      totalCountData: [],

      dialogStatus: false
    }
  },
  created () {},
  mounted () {},
  computed: {},

  methods: {
    init (recordId) {
      if (recordId > 0) {
        this.dialogStatus = true
        this.$store
          .dispatch('commonShift/getItem', recordId)
          .then((res) => {
            if (res.code == 200) {
              const resultData = res.data ? res.data : {}
              this.totalCountData.push(resultData.psr_cashier_count)
              this.totalCountData.push(resultData.psr_other_count)
              this.shiftForm = resultData
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
    },
    hideNowPage () {
      this.dialogStatus = false
      this.$emit('closeDialog')
    }
  }
}
</script>
