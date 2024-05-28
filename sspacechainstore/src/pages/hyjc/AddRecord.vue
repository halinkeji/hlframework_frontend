<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: recordData.id > 0 || currentPageMemberId > 0 ? $q.screen.width * 0.3 + 'px' : $q.screen.width * 0.6 + 'px',
        'min-width':  recordData.id > 0 || currentPageMemberId > 0 ? $q.screen.width * 0.3 + 'px' : $q.screen.width * 0.6 + 'px',
      }"
    >
      <q-form ref="addRecordRef">
        <q-card-section class="row items-center q-pa-none q-px-md">
          <div class="text-subtitle2 q-pr-lg">{{ recordData.id > 0 ? '修改' : '新增' }}寄存记录</div>
          <div class="text-caption text-grey">提示:寄存记录需要绑定会员,修改时不可更改会员。</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="row q-px-sm">
          <div class="col-6 q-pa-xs" v-if="recordData.id > 0 || currentPageMemberId > 0 ? false :true">
            <hl-card-reading ref="memberCardReading" navType="vertical" @refreshDataList="getMemberInfo"></hl-card-reading>
          </div>
          <div class="col-6 q-pa-xs" :class="recordData.id > 0 || currentPageMemberId > 0 ? 'col-12' : 'col-6'">
            <div class="col-12">
              <q-input outlined dense v-model="recordData.phr_name" label="物品名称" :rules="[(val) => (val && val.length > 0) || '请填写名称']" />
            </div>
            <div class="col-12">
              <q-select
                outlined
                dense
                v-model="recordData.phr_type_id"
                option-value="id"
                option-label="pht_name"
                :options="typeOptions"
                label="请选择分类"
                emit-value
                map-options
                :rules="[(val) => (val && val.length > 0) || '请选择分类']"
              />
            </div>

            <div class="col-12">
              <q-input
                outlined
                dense
                :disable="quantityDisable"
                v-model="recordData.phr_quantity"
                label="存入数量"
                lazy-rules
                :rules="[(val) => /^[1-9]\d*$/.test(val) || '存入数量为正整数']"
              />

            </div>
            <div class="col-12">
              <q-input v-model="recordData.phr_remarks" outlined :rows="3" type="textarea" label="备注" dense />
            </div>

            <div class="col-12">
              <hl-upload
                :multiple="true"
                :maxTotal="5"
                :currentAttach="recordData.loopImage"
                @input="
                  (val) => {
                    $nextTick(() => {
                      recordData.phr_loop_image = val;
                    });
                  }
                "
                currentTitle="记录图"
              />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="center" class="q-gutter-sm">
          <q-btn unelevated label="确认" :disable="addButtonDisabled" color="primary" class="q-px-xl" @click="setData" />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddRecord',
  components: {},
  data () {
    return {
      multiple: false,
      showDialog: true,
      addButtonDisabled: true,
      quantityDisable: false,
      recordData: {
        phr_member_id: '',
        phr_name: '',
        phr_type_id: '',
        phr_quantity: '',
        phr_remarks: '',
        phr_loop_image: []
      },
      typeOptions: [],
      currentPageMemberId: 0
    }
  },
  created () {
    this.getTypeList()
  },
  mounted () {},
  computed: {},
  methods: {
    // 查询寄存记录单条记录
    init (id, memberId) {
      this.currentPageMemberId = parseInt(memberId)

      if (parseInt(memberId) > 0) {
        this.recordData.phr_member_id = parseInt(memberId)
        this.addButtonDisabled = false
      }
      if (id > 0) {
        this.quantityDisable = true
        this.$store
          .dispatch('hyjc/getRecordItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.recordData = res.data ? res.data : this.recordData

              if (this.recordData.phr_member_id > 0) {
                this.addButtonDisabled = false
              }
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
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          if (!this.recordData.phr_member_id) {
            this.recordData.phr_member_id = val.id
          }
          if (this.recordData.phr_member_id > 0) {
            this.addButtonDisabled = false
          }
        }
      }
    },
    getTypeList () {
      this.$store
        .dispatch('hyjc/getTypeLists')
        .then((res) => {
          if (res.code == 200) {
            this.typeOptions = res.data ? res.data : []
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
    },

    // 新增或修改寄存记录
    setData () {
      this.$refs.addRecordRef.validate().then((success) => {
        if (success) {
          const data = {
            ...this.recordData
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('hyjc/setRecordData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.recordData.id > 0 ? '修改' : '新增'}` + '寄存记录成功',
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
