<template>
  <div>
    <q-btn color="primary" class="q-mr-sm" unelevated @click="setSwitch">设置 </q-btn>
    <q-btn color="positive" unelevated @click="dialogShow = true">编辑</q-btn>

    <q-dialog v-model="dialogShow">
      <q-card
        flat
        :style="{
          width: $q.screen.width * 0.5 + 'px',
          'min-width': $q.screen.width * 0.5 + 'px',
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ paramData.st_name }}模板Code设置</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @close="clearFields" />
        </q-card-section>

        <q-card-section>
          <q-input outlined bottom-slots placeholder="模板Code" v-model="paramData.st_templateCode" dense> </q-input>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md">
          <q-btn label="确定" @click="changeTemCode" color="primary" unelevated />
          <q-btn label="取消" @click="clearFields()" color="grey" unelevated />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="switchDialog">
      <q-card
        flat
        :style="{
          width: $q.screen.width * 0.5 + 'px',
          'min-width': $q.screen.width * 0.5 + 'px',
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ paramData.st_name }}模板使用位置</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @close="clearFields" />
        </q-card-section>

        <q-card-section>
          <div class="row">
            <div class="col-auto" v-for="item in paramData.st_location">
              <q-checkbox v-model="selection" :val="item.value" :label="item.lable" color="primary" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md">
          <q-btn label="确定" @click="changeLocation" color="primary" unelevated />
          <q-btn label="取消" @click="clearFields()" color="grey" unelevated />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'AgButton',
  data () {
    return {
      paramData: {},
      selection: [],
      dialogShow: false,
      switchDialog: false
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.paramData = this.params.data
  },
  methods: {
    clearFields () {
      this.switchDialog = false
      this.dialogShow = false
    },

    setSwitch () {
      this.switchDialog = true
      if (this.paramData.st_useLocation) {
        this.selection = this.paramData.st_useLocation.split(',')
      } else {
        this.selection = []
      }
    },

    changeTemCode () {
      this.updataOperate({
        st_templateCode: this.params.data.st_templateCode,
        st_templateCodeType: this.params.data.st_templateCodeType,
        st_name: this.params.data.st_name,
        st_templateContent: this.params.data.st_templateContent
      })
    },

    changeLocation () {
      this.updataOperate({
        st_useLocation: this.selection,
        st_templateCodeType: this.params.data.st_templateCodeType,
        st_name: this.params.data.st_name,
        st_templateContent: this.params.data.st_templateContent
      })
    },

    updataOperate (obj) {
      this.$store.dispatch('alSms/addTel', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '修改信息成功',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'green'
          })
          this.dialogShow = false
          this.params.context.getInfo()
        }
      })
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
