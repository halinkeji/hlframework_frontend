<template>
  <!-- 修改弹窗 -->
  <q-dialog v-model="oilmachinestatus" @hide="hideNowPage" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.2) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.2) + 'px',
      }"
    >
      <q-toolbar class="q-px-sm q-py-xs">
        <q-toolbar-title class="text-subtitle2">{{ dataId > 0 ? '修改' : '新增' }}加油机</q-toolbar-title>
        <q-btn flat round icon="close" @click="hideNowPage()" size="12px" />
      </q-toolbar>
      <q-separator   />
      <q-form ref="oilMachineRef" class="q-pa-sm">
        <q-select
          outlined
          option-value="value"
          option-label="label"
          emit-value
          clearable
          map-options
          :options="[
            {
              label: '开启',
              value: 1,
            },
            {
              label: '关闭',
              value: 0,
            },
          ]"
          multiple
          v-model="oilMachineFrom.om_status"
          dense
          label="状态"
          class="q-mb-md"
        />

        <q-input label="加油机名称" outlined bottom-slots v-model="oilMachineFrom.om_name" dense :rules="[(val) => !!val || '加油机名称是必填项']">
        </q-input>

        <q-input label="位置" outlined bottom-slots v-model="oilMachineFrom.om_where" dense :rules="[(val) => !!val || '位置是必填项']"> </q-input>

        <q-input
          label="描述"
          outlined
          bottom-slots
          v-model="oilMachineFrom.om_description"
          dense
          type="textarea"
          rows="3"
        >
        </q-input>
      </q-form>
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
        <q-btn unelevated label="保存" @click="saveData()" color="primary" class="q-px-xl" />
        <q-btn unelevated label="关闭" type="reset" @click="hideNowPage()" color="grey" class="q-px-xl" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddOilMachine',
  data () {
    return {
      oilMachineFrom: {
        om_name: '',
        om_where: '',
        om_status: 1,
        om_description: ''
      },
      dataId: 0,
      oilmachinestatus: false
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (id) {
      this.dataId = id
      this.oilmachinestatus = true
      if (id > 0) {
        this.$store.dispatch('machine/getItem', id).then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.oilMachineFrom = res.data ? res.data : {}
            }
          }
        })
      }
    },
    saveData () {
      this.$refs.oilMachineRef.validate().then((success) => {
        if (success) {
          this.stop = true
          const obj = {
            ...this.oilMachineFrom,
            id: this.dataId
          }
          this.$store
            .dispatch('machine/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
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
              this.stop = false
            })
        }
      })
    },

    hideNowPage () {
      this.$emit('getMethods')
      this.oilmachinestatus = false
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
