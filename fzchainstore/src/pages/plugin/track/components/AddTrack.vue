<template>
  <div>
    <q-dialog v-model="dialogShow" persistent @hide="hideNowPage">
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.5) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">日志信息</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-sm">
          <q-form ref="trackDataRef" class="q-gutter-md q-mt-md">
            <div class="row q-py-lg q-px-md q-col-gutter-md">
              <div class="col-12">
                <span>标题</span>
                <q-input outlined bottom-slots dense v-model="trackData.ptr_title" :rules="[(val) => (val && val.length > 0) || '请输入日志标题']"> </q-input>
              </div>
              <div class="col-12">
                <span>详情</span>
                <q-input outlined bottom-slots v-model="trackData.ptr_detail" :rows="3" dense type="textarea"> </q-input>
              </div>

              <div class="col-12">

                <hl-upload
                  :multiple="true"
                  :maxTotal="5"
                  :currentAttach="trackData.loopImage"
                  @input="(val)=>{ $nextTick(()=>{ trackData.ptr_loop_image = val })}"
                  currentTitle="记录图"
                />
              </div>

              <template-components ref="formFieldRef" @saveSuccess="saveData"></template-components>
            </div>
          </q-form>
        </q-card-section>
        <div class=" q-gutter-sm text-center q-py-xs">
          <q-btn unelevated label="确认" :disable="submitDisabled" class="q-px-xl" color="primary" @click="setData" />
          <q-btn label="关闭" unelevated color="grey" class="q-px-xl" v-close-popup />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import TemplateComponents from '@/pages/plugin/formfield/TemplateComponents.vue'
export default {
  name: 'AddTrack',
  components: { TemplateComponents },
  data () {
    return {
      dialogShow: false,
      multiple: false,
      trackData: {
        id: 0,
        ptr_member_id: '',
        ptr_title: '',
        ptr_detail: '',
        ptr_loop_image: [],
        prt_form_id: ''
      },
      trackConfigData: {},
      uploadImgStatus: false,
      submitDisabled: false
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (val, id) {
      this.getStatus()
      this.dialogShow = true
      this.trackData.ptr_member_id = val
      this.trackData.id = id
      if (id > 0) {
        this.$store
          .dispatch('track/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.trackData = res.data

              if (this.trackConfigData.track_config_from > 0) {
                this.$nextTick(() => {
                  this.$refs.formFieldRef.getList({
                    formId: this.trackConfigData.track_config_from,
                    memberId: this.trackData.ptr_member_id,
                    otherId: this.trackData.id,
                    templateId: this.trackData.prt_form_id
                  })
                })
              }
            }
          })
          .catch((err) => {
            this.$q.notify({
              message: '失败',
              caption: err.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          })
      }
    },
    setData () {
      this.$refs.trackDataRef.validate().then((success) => {
        if (success) {
          if (this.trackConfigData.track_config_from > 0) {
            this.$nextTick(() => {
              this.$refs.formFieldRef.setData()
            })
            return false
          }
          this.saveData()
        }
      })
    },
    saveData (res) {
      this.submitDisabled = true
      this.trackData.prt_form_id = res || 0
      const obj = {
        ...this.trackData
      }
      this.$store
        .dispatch('track/setTrackData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: `${this.trackData.id > 0 ? '修改' : '新增'}` + '记录成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.$nextTick(() => {
              this.hideNowPage(1)
            })
          } else {
            this.submitDisabled = false
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },

    hideNowPage (type) {
      this.trackData = {
        id: 0,
        ptr_member_id: '',
        ptr_title: '',
        ptr_detail: '',
        ptr_loop_image: []
      }
      this.dialogShow = false
      this.submitDisabled = false
      if (type == 1) {
        this.$emit('getMethods')
      }
    },
    getStatus () {
      this.$store
        .dispatch('track/getStatus')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.trackConfigData = res.data ? res.data : {}
              this.$nextTick(() => {
                this.$refs.formFieldRef.getList({ formId: this.trackConfigData.track_config_from, memberId: this.trackData.ptr_member_id })
              })
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    }
  }
}
</script>

<style></style>
