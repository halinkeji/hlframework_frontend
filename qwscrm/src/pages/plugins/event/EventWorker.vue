<template>
  <q-dialog v-model="logDialogStatus" persistent full-height>
    <q-layout
      view="Lhh lpR fff"
      container
      class="bg-white"
      :style="{
        width: this.$q.screen.width * 0.4,
      }"
    >
      <q-header class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">跟进事件</div>
        <q-space />
        <q-btn dense @click="closeDialog" flat icon="close" />
      </q-header>
      <q-page-container>
        <q-page class="q-pa-sm">
          <q-form ref="followEventForm" class="row">
            <div class="col-12 q-px-xs">
              <q-input outlined v-model="followForm.order" dense label="排序" :rules="[(val) => !!val || '请输入排序']" />
            </div>
            <div class="col-12 q-px-xs">
              <q-input outlined v-model="followForm.name" dense label="事件名称" :rules="[(val) => !!val || '请输入事件名称']" />
            </div>
            <div class="col-12 q-px-xs">
              <q-select
                dense
                map-options
                outlined
                option-label="label"
                option-value="value"
                emit-value
                label="权重"
                v-model="followForm.level"
                :options="eventLevelArr"
                bottom-slots
              />
            </div>

            <div class="col-12 q-px-xs" v-if="!eventId">
              <q-select
                dense
                map-options
                outlined
                option-label="label"
                option-value="value"
                bottom-slots
                emit-value
                label="状态"
                v-model="followForm.status"
                :options="eventStatusArr"
              />
            </div>

            <div class="col-12 q-px-xs">
              <q-input
                outlined
                v-model="followForm.description"
                type="textarea"
                dense
                label="事件说明"
                :rules="[(val) => !!val || '请输入事件说明']"
              />
            </div>
            <q-card flat bordered class="col-12 q-mb-sm">
              <q-card-section class="text-subtitle2">
                上传图片
              </q-card-section>
              <q-separator />
              <div class="col-12 row q-pa-xs">
                 <hl-upload
                  :multiple="true"
                  :maxTotal="5"
                  :currentAttach="followForm.imageData"
                  @input="(val)=>{ $nextTick(()=>{ followForm.file_attach.image = val })}"
                />
              </div>
            </q-card>

            <hl-file-upload
              :contactId="followForm.contact_id"
              cardTitle="上传附件"
              :valuePath="followForm.fileData"
              @filePath="(val)=>{ $nextTick(()=>{ followForm.file_attach.file = val })}"
            ></hl-file-upload>
          </q-form>
        </q-page>
      </q-page-container>

      <q-footer class="bg-white">
        <q-toolbar class="justify-center">
          <q-btn unelevated rounded color="primary" @click="saveLog" label="保存" class="q-px-xl" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'AddServiceLog',
  components: {},
  data () {
    return {
      logDialogStatus: false,
      eventStatusArr: this.$store.state.eventManage.eventStatusArr,
      eventLevelArr: this.$store.state.eventManage.eventLevelArr,
      applyDataList: [],
      currenApplyInfo: {},
      followForm: {
        contact_id: '',
        order: '0',
        name: '',
        description: '',
        status: '',
        level: '0',
        file_attach: {
          image: [],
          file: []
        },
        imageData: [],
        fileData: []
      },
      eventId: '',
      followFile: [],
      followImage: []
    }
  },
  computed: {},
  mounted () {},
  created () {},
  methods: {
    init (eventId, contact_id) {
      this.logDialogStatus = true
      this.followForm.contact_id = contact_id

      if (eventId > 0) {
        this.eventId = eventId
        this.getEventInfo()
      }
    },
    getEventInfo () {
      this.$store
        .dispatch('eventManage/getItem', this.eventId)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.followForm = res.data
          }
        })
        .catch((error) => {})
    },

    formatDate (val) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY年MM月DD日 HH:mm:ss')
      }
      return '未授权'
    },

    closeDialog () {
      this.logDialogStatus = false
      this.$emit('closeDialog')
    },

    saveLog () {
      this.$refs.followEventForm.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.followForm
          }
          this.$store
            .dispatch('eventManage/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存成功！',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })

                this.closeDialog()
              } else {
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
        }
      })
    }

  }
}
</script>
