<template>
  <div>
    <q-btn color="secondary" class="q-mx-sm" unelevated  label="生成绩效记录" @click="buttonShow" />
    <q-btn color="primary" class="q-mx-sm" unelevated label="修改" @click="editPotion" />
    <q-btn color="red" unelevated label="删除" @click="confirmDeleteRecord" />

    <q-dialog v-model="dialogShow" persistent @hide="clearFields">
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.3) + 'px',
          'max-width': parseInt($q.screen.width * 0.3) + 'px',
        }"
      >
        <div class="row items-center q-px-xs">
          <div class="text-subtitle1">生成绩效记录</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @close="clearFields" />
        </div>
        <q-card-section>
          <q-form ref="itemDataRef" class="q-gutter-md">
            <q-card class="my-card" flat bordered>
              <q-item>
                <q-item-section avatar>
                  <q-icon color="accent" size="xs" name="las la-square" />
                </q-item-section>

                <q-item-section>{{ itemData.prp_name }}</q-item-section>
              </q-item>

              <q-separator />
              <q-card-actions class="q-pa-none row">
                <q-scroller v-model="dateScroller" view="date-range" no-footer locale="zh-CN" style="height: 300px"></q-scroller>
              </q-card-actions>
            </q-card>
          </q-form>
        </q-card-section>

        <div class="q-pb-md text-center q-gutter-sm">
          <q-btn label="取消" @click="clearFields()" class="q-px-xl" color="grey" unelevated />
          <q-btn label="生成记录" @click="addUpdateReward()" color="primary" class="q-px-xl" unelevated />
        </div>
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
      endTime: '',
      dateScroller: ''
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
        .dispatch('rewardPosition/delData', [this.dataId])
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
      const startTime = this.$q_date.formatDate(this.dateScroller[0], 'X')
      const endTime = this.$q_date.formatDate(this.dateScroller[1], 'X')
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
                .dispatch('rewardPosition/setRecord', obj)
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
