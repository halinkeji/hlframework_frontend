<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="showDialog">
      <q-card
        :style="{
          width: this.$q.screen.width * 0.3 + 'px',
          'min-width': this.$q.screen.width * 0.3 + 'px',
        }"
      >
        <q-form ref="addTypeRef">
          <q-card-section class="row items-center q-pa-none q-pa-xs">
            <div class="text-subtitle2">{{ dataId ? '修改' : '新增' }}预约分类</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <div class="row q-pa-sm">
            <div class="col-8">
              <div class="q-pr-xl q-mt-xs">
                <q-input
                  outlined
                  dense
                  v-model="typeData.prt_sort"
                  label="分类排序"
                  lazy-rules
                  :rules="[(val) => /^[0-9]\d*$/.test(val) || '请填写排序']"
                />
              </div>
              <div class="q-pr-xl q-mt-xs">
                <q-input outlined dense v-model="typeData.prt_name" label="分类名称" lazy-rules :rules="[(val) => (val && !!val) || '请填写名称']" />
              </div>
              <div class="q-mb-md">
                <q-input class="q-pr-xl q-mt-xs" outlined dense v-model="typeData.prt_description" label="分类描述" type="textarea" rows="3" />
              </div>
            </div>
            <div class="q-mb-lg col-4 text-center">
              <hl-upload
                :multiple="false"
                :currentAttach="typeData.coverImage"
                @input="
                  (val) => {
                    $nextTick(() => {
                      typeData.prt_cover_image = val;
                    });
                  }
                "
                currentTitle="分类图"
                currentDescription="建议尺寸1:1"
              />
            </div>
          </div>
          <div align="center" class="q-my-sm q-gutter-sm">
            <q-btn unelevated label="确认" class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData" />
            <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'AddType',
  data () {
    return {
      multiple: false,
      uploadImgStatus: false,
      showDialog: true,
      addButtonDisabled: false,
      typeData: {
        prt_name: '',
        prt_sort: '0',
        prt_cover_image: '',
        prt_description: ''
      }
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('reserve/getReserveTypeItem', id)
          .then((res) => {
            if (res.code == 200) {
              this.typeData = res.data ? res.data : {}
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '获取失败',
                color: 'red'
              })
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              color: 'red',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    setData () {
      this.$refs.addTypeRef.validate().then((success) => {
        if (success) {
          const data = {
            ...this.typeData
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('reserve/setReserveTypeData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.typeData.id > 0 ? '修改' : '新增'}` + '预约分类成功!',
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
