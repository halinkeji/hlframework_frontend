<template>
  <q-dialog v-model="dialogShow" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.3) + 'px',
        'max-width': parseInt($q.screen.width * 0.3) + 'px',
        height: parseInt($q.screen.height * 0.8) + 'px',
         'max-height': parseInt($q.screen.height * 0.8) + 'px',
      }"
      class="fit column no-wrap justify-between items-stretch content-stretch no-scroll"

    >
     <div class="col-shrink bg-white row q-px-xs q-pa-sm">
        <div class="text-subtitle1">{{ channelId ? "修改" : "新增" }}物流渠道 </div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="colseDialog"
        />
      </div>
      <div class="col-shrink full-height">
        <q-scroll-area class="fit">
          <q-form ref="channelConfigFormRef" class="q-gutter-xs q-pa-md">
            <div class="col-12">
              <q-select
                outlined
                label="功能开关"
                bottom-slots
                v-model="channelConfigForm.wc_channel"
                :options="channelArray"
                dense
                emit-value
                map-options
                @input="changeChannel"
              ></q-select>
            </div>
            <div class="col-12" v-for="(item,key) in channelConfigForm.wc_config">
              <q-input
                outlined
                dense
                :label="item.label"
                :rules="[(val) => !!val || '必填项']"
                v-model="item.value"
                maxlength="150"
              ></q-input>
            </div>

          </q-form>
        </q-scroll-area>
      </div>
      <div class="row q-mt-md justify-center q-gutter-sm q-pa-sm">
        <q-btn label="提交" unelevated @click="saveData()" color="primary" class="q-px-xl" />
        <q-btn label="关闭" unelevated color="grey" @click="colseDialog" class="q-px-xl" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ApiChannelDialog',
  components: {},
  data () {
    return {
      dialogShow: false,

      channelId: '',
      channelConfigForm: {
        wc_channel: '',
        wc_config: []
      },
      channelArray: [],
      channelChannelData: {}
    }
  },
  mounted () {},
  computed: {},
  created () {

  },
  methods: {

    init (channelId) {
      this.getChannelConfig()
      this.dialogShow = true
      if (channelId > 0) {
        this.channelId = channelId
        this.$nextTick(() => {
          this.getItem()
        })
      }
    },

    // 获取单条
    getItem () {
      this.$store.dispatch('wuliuapi/getItem', this.channelId).then((res) => {
        if (res.code == 200) {
          this.channelConfigForm = res.data && res.data.id ? res.data : {}
        }
      })
    },
    saveData () {
      this.$refs.channelConfigFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            id: this.channelId,
            ...this.channelConfigForm
          }
          this.$store
            .dispatch('wuliuapi/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.colseDialog()
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
    colseDialog () {
      this.dialogShow = false
      this.$emit('colseDialog')
    },

    getChannelConfig () {
      this.$store.dispatch('wuliuapi/getChannelBase', this.channelId).then((res) => {
        if (res.code == 200) {
          this.channelArray = res.data && res.data.channelArray ? res.data.channelArray : []
          this.channelChannelData = res.data && res.data.channelChannelData ? res.data.channelChannelData : {}
        }
      })
    },
    changeChannel () {
      this.channelConfigForm.wc_config = this.channelChannelData[this.channelConfigForm.wc_channel]
    }

  }
}
</script>

<style scoped></style>
