<template>
  <q-dialog @hide="hideNowPage" v-model="addAdDialogStatus" persistent>
    <q-card :style="{ width: dialogWidth, 'max-width': dialogWidth }" class="q-pa-sm">
      <q-card-section class="row items-center">
        <div class="text-h6">
          {{ dataId > 0 ? '修改分类' : '新增分类' }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
      </q-card-section>

      <q-form ref="typeDataRef" class="q-gutter-md">
        <div class="row q-px-sm">
          <div class="col-12 col-md-8 q-pr-xl">
            <q-input
              outlined
              dense
              v-model="typeData.wt_sort"
              label="排序:数字越小，排序越靠前"
              lazy-rules
              :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请输入正整数']"
            />

            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              v-model="typeData.wt_status"
              :options="[
                { label: '开启', value: '1' },
                { label: '关闭', value: '0' },
              ]"
              dense
              label="请选择分类状态"
              bottom-slots
            />

            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              v-model="typeData.wt_top"
              :options="[
                { label: '默认', value: '1' },
                { label: '首页推荐', value: '2' },
              ]"
              dense
              label="请选择分类属性"
              bottom-slots
            />

            <q-input outlined dense v-model="typeData.wt_name" label="分类名称" lazy-rules :rules="[(val) => !!val || '分类名称不能为空']" />
          </div>
          <div class="col-12 col-md-4 q-px-sm text-center">
            <hl-upload
              :maxTotal="1"
              :multiple="false"
              :currentAttach="typeData.coverImage"
              @input="
                (val) => {
                  $nextTick(() => {
                    typeData.wt_cover_image = val;
                  });
                }
              "
              currentDescription="建议尺寸比例4:3"
              currentTitle="分类图"
            />
          </div>
        </div>
        <div class="row">
          <q-input outlined dense class="col-12 q-px-sm" v-model="typeData.wt_description" type="textarea" label="简介" />
        </div>
      </q-form>
      <q-card-actions align="center">
        <q-btn unelevated class="q-px-xl" :disable="disableButton" label="提交" @click="saveData()" color="primary" />
        <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AddType',
  components: {},
  data () {
    return {
      wxGoodsData: {},
      chooseVisible: false,
      dialogWidth: '1000px',
      addAdDialogStatus: false,
      dataId: 0,
      typeData: {
        wt_name: '',
        wt_sort: 0,
        wt_cover_image: '',
        wt_status: '1',
        wt_pid: 0,
        wt_level: 1,
        wt_top: '1'
      },
      disableButton: false,
      typeListData: [],
      multiple: false,
      uploadImgStatus: false
    }
  },
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.5) + 'px'
    }
  },
  computed: {},
  created () {},
  methods: {
    getTypeList () {
      this.$store.dispatch('wxMallType/getListData', { currentId: this.dataId }).then((res) => {
        if (res.code == 200) {
          this.typeListData = res.data ? res.data : []
        }
      })
    },
    setPid (item) {
      if (parseInt(item.wt_level) + 1 > 3) {
        this.$q.notify({
          message: '失败',
          caption: '最大可添加3级',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
        this.$refs.wxmallTypeTreeRef.resetValueData()
        return false
      } else {
        this.typeData.wt_pid = item.id

        this.typeData.wt_level = parseInt(item.wt_level) + 1
      }
    },
    getItem (id) {
      this.dataId = id
      this.getTypeList()
      this.addAdDialogStatus = true
      if (id > 0) {
        this.$store.dispatch('wxMallType/getItem', id).then((res) => {
          if (res.code == 200) {
            this.typeData = res.data ? res.data : {}
          }
        })
      }
    },
    saveData () {
      this.$refs.typeDataRef.validate().then((success) => {
        if (success) {
          this.disableButton = true

          const obj = {
            ...this.typeData,
            id: this.dataId
          }
          this.$store
            .dispatch('wxMallType/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}分类成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.addAdDialogStatus = false
                this.disableButton = false
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              } else {
                this.addAdDialogStatus = false
                this.$q.notify({
                  message: '失败',
                  caption: '创建失败',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
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
              this.disableButton = false
            })
        }
      })
    },

    hideNowPage () {
      this.$emit('getMethods')
    }
  }
}
</script>
