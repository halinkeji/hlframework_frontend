<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.5 + 'px',
        'min-width': this.$q.screen.width * 0.5 + 'px',
      }"
    >
      <div class="row items-center q-pa-none q-pa-sm">
        <div class="text-subtitle2">{{ projectData.id > 0 ? '修改' : '新增' }}项目</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </div>
      <q-form ref="addProjectRef">
        <div class="row q-col-gutter-sm q-pa-sm">
          <div class="col-6">
            <q-input outlined dense v-model="projectData.pp_title" label="项目标题" :rules="[(val) => (val && !!val) || '请输入项目标题']" />
          </div>

          <div class="col-6">
            <q-input
              outlined
              dense
              v-model="projectData.pp_number_prefix"
              label="项目编号前缀"
              :rules="[(val) => (val && !!val) || '请输入项目编号前缀']"
              maxlength="10"
              counter
            />
          </div>

          <div class="col-6">
            <q-input outlined dense v-model="projectData.pp_sort" label="排序" :rules="[(val) => /^\d+$/.test(val) || '请输入正确的序号']" />
          </div>

          <div class="col-6">
            <q-input outlined readonly dense v-model="time_start" label="开始时间">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="time_start" mask="HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-6">
            <q-input outlined readonly dense label="结束时间" v-model="time_end">
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="time_end" mask="HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-6">
            <q-select
              outlined
              dense
              v-model="projectData.pp_status"
              option-label="label"
              :options="statusOptions"
              label="状态"
              emit-value
              map-options
            />
          </div>

          <div class="col-6">
            <hl-upload
              :multiple="false"
              :currentAttach="projectData.coverImage"
              @input="
                (val) => {
                  $nextTick(() => {
                    projectData.pp_cover_image = val;
                  });
                }
              "
              currentTitle="封面图"
              currentDescription=" 用于项目列表页面展示的图片,建议尺寸1:1"
            />
          </div>

          <div class="col-6">
            <hl-upload
              :multiple="true"
              :maxTotal="5"
              :currentAttach="projectData.loopImage"
              @input="
                (val) => {
                  $nextTick(() => {
                    projectData.pp_loop_image = val;
                  });
                }
              "
              currentTitle="项目轮播详情"
              currentDescription="尺寸建议宽度为750*250,最多为3张"
            />
          </div>

          <div class="col-12">
            <q-input outlined dense v-model="projectData.pp_description" label="描述" type="textarea" rows="3" />
          </div>
        </div>
      </q-form>

      <q-card-section align="center" class="q-gutter-sm">
        <q-btn unelevated label="确认" class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData" />
        <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddPaihaoProject',
  data () {
    return {
      persistent: true,

      showDialog: true,
      addButtonDisabled: false,
      time_start: '',
      time_end: '',
      projectData: {
        pp_sort: '0',
        pp_title: '',
        pp_number_prefix: '',
        pp_status: '1',
        pp_is_use_form: '-1',
        pp_form_id: '',
        pp_printer_id: '',
        pp_time_start: '',
        pp_time_end: '',
        pp_cover_image: '',
        pp_loop_image: [],
        pp_description: ''
      },
      statusOptions: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '-1' }
      ]
    }
  },
  created () {

  },
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('paihao/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.projectData = res.data ? res.data : {}

              this.time_start = this.$q_date.formatDate(res.data.pp_time_start * 1000, 'HH:mm')
              this.time_end = this.$q_date.formatDate(res.data.pp_time_end * 1000, 'HH:mm')
            }
          })
          .catch((err) => {
            this.$q.notify({
              message: '失败',
              caption: err.message,
              color: 'red',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },

    setData () {
      this.$refs.addProjectRef.validate().then((success) => {
        if (success) {
          if (!this.time_start) {
            this.$q.notify({
              message: '注意',
              caption: '请选择开始时间！',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            return false
          }
          if (!this.time_end) {
            this.$q.notify({
              message: '注意',
              caption: '请选择结束时间！',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            return false
          }
          const today = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD')
          const startTime = this.$q_date.formatDate(today + ' ' + this.time_start, 'X')
          const endTime = this.$q_date.formatDate(today + ' ' + this.time_end, 'X')
          if (startTime >= endTime) {
            this.$q.notify({
              message: '注意',
              caption: '开始时间不能大于等于结束时间！',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            this.addButtonDisabled = false
            return false
          }
          this.projectData.pp_time_end = endTime
          this.projectData.pp_time_start = startTime
          const data = {
            ...this.projectData
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('paihao/setData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.projectData.id > 0 ? '修改' : '新增'}` + '排号项目成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.showDialog = false
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisabled = false
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },

    hideNowPage () {
      this.addButtonDisabled = false
      this.$emit('dataList')
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
