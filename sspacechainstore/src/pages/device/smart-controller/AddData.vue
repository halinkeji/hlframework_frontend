<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.3 + 'px',
        'min-width': this.$q.screen.width * 0.3 + 'px',
      }"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2 text-weight-bold">{{ relayForm.id > 0 ? '修改' : '新增' }}控制器</div>
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
                  v-model="relayForm.sdr_status"
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
            <q-input outlined dense v-model="relayForm.sdr_name" label="设备名称" lazy-rules :rules="[(val) => !!val || '请输入设备名称']" />
          </div>

           <div class="col-12">
            <q-input outlined dense v-model="relayForm.sdr_only_client_id" label="设备唯一ID" lazy-rules :rules="[(val) => !!val || '请输入设备唯一ID']" />
          </div>

          <div class="col-12">
            <q-input outlined dense v-model="relayForm.sdr_port_count" label="设备总路数" lazy-rules :rules="[(val) => /^\d+$/.test(val) || '请输入正确的数量']" />
          </div>

           <div class="col-12">
            <q-input outlined dense v-model="relayForm.sdr_all_open_instruct" label="全开指令" lazy-rules :rules="[(val) => !!val || '请输入全开指令']" />
          </div>
           <div class="col-12">
            <q-input outlined dense v-model="relayForm.sdr_all_colse_instruct" label="全关指令" lazy-rules :rules="[(val) => !!val || '请输入全关指令']" />
          </div>
           <div class="col-12">
            <q-input outlined dense v-model="relayForm.sdr_all_query_instuct" label="查询指令" lazy-rules :rules="[(val) => !!val || '请输入查询指令']" />
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
      relayForm: {
        sdr_port_count: '0',
        sdr_name: '',
        sdr_status: '1',
        sdr_only_client_id: '',
        sdr_all_open_instruct: '',
        sdr_all_colse_instruct: '',
        sdr_all_query_instuct: ''
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
        .dispatch('deviceRelay/getRelayItem', this.roomId)
        .then((res) => {
          if (res.code == 200 && res.data && res.data.id) {
            this.relayForm = res.data
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
            ...this.relayForm
          }
          this.$store
            .dispatch('deviceRelay/saveRelayData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.relayForm.id > 0 ? '修改' : '新增'}` + '控制器成功',
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
      this.$emit('dataList')
      this.addButtonDisabled = false
    }

  }
}
</script>
