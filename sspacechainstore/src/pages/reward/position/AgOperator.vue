<template>
  <div class="q-gutter-sm">
    <q-btn color="secondary"  unelevated v-if="authorityMeta('count')" label="生成绩效汇总" @click="buttonShow" />

    <q-btn color="primary" unelevated label="修改" v-if="authorityMeta('edit')" @click="editPotion" />
    <q-btn color="red" unelevated label="删除" v-if="authorityMeta('del')" @click="confirmDeleteRecord" />

    <q-dialog v-model="dialogShow" persistent @hide="clearFields">
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.3) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
        }"
      >
        <q-card-section class="row items-center q-pa-xs">
          <div class="text-subtitle2">生成绩效记录</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="clearFields" />
        </q-card-section>

        <q-card-section>
          <q-form ref="itemDataRef" class="q-gutter-md">
            <q-list separator bordered>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="ballot" color="primary"></q-icon>
                </q-item-section>

                <q-item-section>
                  <q-item-label>职位名称</q-item-label>
                </q-item-section>

                <q-item-section>
                   <q-item-label class="text-subtitle1 text-center text-primary text-weight-bold">{{ itemData.prp_name }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="restore" color="primary"></q-icon>
                </q-item-section>

                <q-item-section>
                  <q-item-label>绩效记录开始时间</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-input outlined dense label="开始时间" v-model="startTime" readonly>
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm:ss">
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
                          <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="restore" color="primary"></q-icon>
                </q-item-section>

                <q-item-section>
                  <q-item-label>绩效记录结束时间</q-item-label>
                </q-item-section>

                <q-item-section>
                  <q-input outlined dense label="结束时间" v-model="endTime" readonly>
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm:ss">
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
                          <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md">
          <q-btn label="生成记录" @click="addUpdateReward()" color="primary" class="q-px-xl" unelevated />
          <q-btn label="取消" @click="clearFields()" class="q-px-xl" color="grey" unelevated />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      dataId: 0,
      dialogShow: false,
      itemData: {},
      startTime: '',
      endTime: ''
    }
  },
  created () {
    this.dataId = this.params.data.id
    this.itemData = this.params.data
  },
  mounted () {},
  computed: {},
  methods: {
    editPotion () {
      this.dataId = this.params.data.id
      this.params.context.addData(this.dataId)
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.prp_name}" 的职位吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      this.$store
        .dispatch('commonReward/delData', [this.dataId])
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除职位成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.params.context.getList()
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
    buttonShow () {
      this.dialogShow = true
    },
    clearFields () {
      this.dialogShow = false
    },
    addUpdateReward () {
      if (this.startTime == '' && this.endTime == '') {
        this.$q.notify({
          message: '注意',
          caption: '请选择开始和结束时间！',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      const startTime = this.$q_date.formatDate(this.startTime, 'X')
      const endTime = this.$q_date.formatDate(this.endTime, 'X')
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      this.$refs.itemDataRef.validate().then((success) => {
        if (success) {
          this.$q
            .dialog({
              title: '确定',
              message: '确定生成绩效记录？',
              cancel: true,
              persistent: true
            })
            .onOk(() => {
              const obj = {
                startTime,
                endTime,
                position_id: this.dataId
              }
              this.$store
                .dispatch('commonReward/setRecord', obj)
                .then((res) => {
                  if (res.code == 200) {
                    this.$q.notify({
                      icon: 'ion-checkmark-circle-outline',
                      timeout: 500,
                      position: 'top-right',
                      message: '成功',
                      caption: '生成成功',
                      color: 'green'
                    })
                    this.clearFields()
                    this.params.context.getList()
                  } else {
                    this.$q.notify({
                      icon: 'ion-close-circle-outline',
                      timeout: 500,
                      position: 'top-right',
                      message: '失败',
                      caption: res.message,
                      color: 'red'
                    })
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
            })
        }
      })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
