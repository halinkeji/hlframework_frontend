<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.3 + 'px',
        'min-width': this.$q.screen.width * 0.3 + 'px',
      }"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2 text-weight-bold">{{ roomTagData.id > 0 ? '修改' : '新增' }}标签</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form ref="roomDataRef" class="row q-col-gutter-sm">

          <div class="col-12">
            <q-item class="bg-grey-2">
              <q-item-section>
                <q-item-label>状态</q-item-label>
              </q-item-section>
              <q-item-section side top >

                <q-option-group
                  v-model="roomTagData.srt_status"
                  :options="[
                    {
                      label: '关闭',
                      value: '0',
                    },
                    {
                      label: '开启',
                      value: '1',
                    },

                  ]"
                  color="primary"
                  inline
                />

              </q-item-section>
            </q-item>
          </div>

          <div class="col-12">
            <q-input outlined dense v-model="roomTagData.srt_sort" label="排序" lazy-rules :rules="[(val) => /^\d+$/.test(val) || '请输入正确的序号']" />
          </div>

          <div class="col-12">
            <q-input outlined dense v-model="roomTagData.srt_title" label="名称" lazy-rules :rules="[(val) => !!val || '请输入名称']" />
          </div>

        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section class="justify-center row q-gutter-sm">

        <q-btn unelevated class="q-px-xl" :disable="addButtonDisabled" color="orange" @click="setData">
          保存
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddRoomTag',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      roomTagData: {
        srt_sort: '0',
        srt_title: '',
        srt_status: '1'
      },
      printerList: [],
      roomGroupData: {},

      roomGroupId: 0,
      roomId: 0,
      roomGroupList: []
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (roomId) {
      this.showDialog = true

      if (roomId > 0) {
        this.roomId = roomId

        this.$nextTick(() => {
          this.getItem()
        })
      }
    },

    getItem () {
      this.$store
        .dispatch('roomTag/getTagItem', this.roomId)
        .then((res) => {
          if (res.code == 200 && res.data && res.data.id) {
            this.roomTagData = res.data
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
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
    },
    setData () {
      this.$refs.roomDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true

          const params = {
            ...this.roomTagData
          }
          this.$store
            .dispatch('roomTag/saveTagData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.roomTagData.id > 0 ? '修改' : '新增'}` + '标签成功',
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
      this.roomTagData.id = ''
      this.roomTagData = {
        dt_name: '',
        dt_sort: '0',
        dt_box_price: '0',
        dt_description: '',
        dt_min_consume: '0',
        dt_extra_consume: '0',
        dt_deposit: '0'
      }
      this.$emit('dataList')
      this.addButtonDisabled = false
    },
    getPrinterList () {
      this.$store
        .dispatch('dishes/getPrinterList')
        .then((res) => {
          if (res.code == 200) {
            this.printerList = res.data ? res.data : []
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    }
  }
}
</script>
