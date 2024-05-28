<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.3 + 'px',
        'min-width': $q.screen.width * 0.3 + 'px',
      }"
      class="q-pa-md"
    >
      <q-form ref="typeDataRef">
        <q-card-section class="row items-center q-pa-none q-mb-md">
          <div class="text-h6">{{ typeData.id > 0 ? '修改' : '新增' }}寄存分类</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div>
          <q-input outlined dense v-model="typeData.pht_name" label="名称" lazy-rules :rules="[(val) => !!val || '请输入名称']" />
        </div>
        <div>
          <q-select outlined dense v-model="typeData.pht_status" option-label="label" :options="statusOptions" label="状态" emit-value map-options />
        </div>
        <div class="q-mt-lg">

          <hl-upload
            :multiple="false"
            :currentAttach="typeData.coverImage"
            @input="(val)=>{ $nextTick(()=>{ typeData.pht_cover_image = val })}"
            currentTitle="封面图"
          />
        </div>
        <div align="right" class="q-mt-md">
          <q-btn unelevated label="确定" :disable="addButtonDisabled" color="primary" @click="setData" v-if="authorityMeta('saveType')" />
          <q-btn unelevated label="关闭" class="q-ml-sm" color="grey" v-close-popup />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'hyjcAddType',
  components: {},
  data () {
    return {
      multiple: false,

      showDialog: true,
      addButtonDisabled: false,
      typeData: {
        pht_name: '',
        pht_status: '1',
        pht_cover_image: ''
      },
      statusOptions: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '-1' }
      ]
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
          .dispatch('hyjc/getTypeItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.typeData = res.data ? res.data : {}
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
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    setData () {
      this.$refs.typeDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const params = {
            ...this.typeData
          }
          this.$store
            .dispatch('hyjc/setTypeData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.typeData.id > 0 ? '修改' : '新增'}` + '寄存分类成功',
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
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
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
