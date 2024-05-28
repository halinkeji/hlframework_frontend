<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll bg-white">
    <div class="col-shrink bg-white q-px-xs q-pa-sm q-pb-md row">
      <div class="col-6">
        <q-list separator bordered padding>
          <q-item>
            <q-item-section>
              <q-item-label>会员日志功能绑定自定义表单</q-item-label>
              <q-item-label caption>选择以后添加记录时可以填写自定义信息</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-select
                label="请选择自定义表单"
                v-model="trackData.track_config_from"
                option-value="id"
                class="full-width"
                option-label="pff_form_name"
                emit-value
                map-options
                @input="setStatus(trackData.track_config_from, 'track_config_from')"
                dense
                outlined
                :options="formfieldList"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SetConfig',
  data() {
    return {
      trackData: {
        track_config_show: '0',
        track_config_name: '',
        track_config_from: '1',
      },
      formfieldList: [],
    }
  },

  created() {
    this.getFormfieldList()
  },
  mounted() {
    this.getStatus()
  },
  computed: {},
  methods: {
    setStatus(val, keyName) {
      console.log(val, keyName)
      //   const vald = val
      const obj = {}
      obj.value = val
      obj.key = keyName
      this.$store
        .dispatch('track/setStatus', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '修改成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right',
            })
            this.getStatus()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red',
          })
        })
    },
    getStatus() {
      this.$store
        .dispatch('track/getStatus')
        .then((res) => {
          if (res.code == 200) {
            this.trackData = res.data ? res.data : {}
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red',
          })
        })
    },
    getFormfieldList() {
      this.$store
        .dispatch('formfield/getFormFieldFormList')
        .then((res) => {
          if (res.code == 200) {
            this.formfieldList = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red',
          })
        })
    },
  },
}
</script>

<style></style>
