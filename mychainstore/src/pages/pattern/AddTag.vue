<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.3 + 'px',
        'min-width': this.$q.screen.width * 0.3 + 'px',
      }"
      class="q-pa-md"
    >
      <q-form ref="tagDataRef">
        <q-card-section class="row items-center q-pa-none q-mb-sm">
          <div class="text-subtitle2">{{ tagData.id > 0 ? '修改' : '新增' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>

          <q-input outlined dense v-model="tagData.ppt_sort" label="排序" lazy-rules :rules="[(val) => /^\d+$/.test(val) || '请输入正确的排序']" />
          <q-input outlined dense v-model="tagData.ppt_name" label="名称" lazy-rules :rules="[(val) => !!val || '请输入名称']" />

          <q-select
            v-model="tagData.ppt_type"
            :options="$store.state.pattern.tagTypeData"
            option-label="label"
            option-value="value"
            map-options
            emit-value
            dense
            outlined
            label="选择属性"
          />
        </q-card-section>

        <div class="text-center q-gutter-sm">
          <q-btn unelevated label="确定" class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData" />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'PatternAddTag',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      tagData: {
        ppt_sort: '0',
        ppt_name: '',
        ppt_pid: '',
        ppt_type: ''
      },
      tagList: []

    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('pattern/getTagItem', { id })
          .then((res) => {
            if (res.code == 200) {
              this.tagData = res.data ? res.data : {}
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
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
      }
    },
    setData () {
      this.$refs.tagDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const params = {
            ...this.tagData
          }
          this.$store
            .dispatch('pattern/setTagData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.tagData.id > 0 ? '修改' : '新增'}` + '成功',
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
      // this.tagData = {
      //   ppt_name: '',
      //   ppt_pid: '',
      //   ppt_sort: ''
      // }
      this.$emit('dataList')
      this.addButtonDisabled = false
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
