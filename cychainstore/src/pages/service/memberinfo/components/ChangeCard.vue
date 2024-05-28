<template>
  <div>
    <q-dialog v-model="change">
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
      >
        <q-form ref="memberDataRef">
          <q-toolbar>
            <q-toolbar-title> 换卡</q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup @click="closeButton" />
          </q-toolbar>
          <q-card-section>
            <div class="row">
              <div class="col-md-6 col">
                <q-input v-model="memberInformation.mem_memberCardNum" dense outlined bottom-slots lazy-rules :rules="[(val) => !!val || '卡号是必填的', (val) => /^\d+$/.test(val) || '卡号为数字']">
                  <template v-slot:prepend>
                    <span class="text-subtitle1">会员卡号 *</span>
                  </template>
                </q-input>
              </div>
              <div class="col-md-auto">
                <q-btn unelevated color="red-6" label="生成新卡号" size="15px" class="q-ml-sm" @click="math" />
              </div>
            </div>
            <div class="row">
              <q-space />
              <q-btn  unelevated color="grey-7" label="关闭" v-close-popup @click="closeButton" />
              <q-btn unelevated @click="saveBut" color="blue-6" label="保存" class="q-ml-sm" />
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'ChangeCard',
  data () {
    return {
      dialogWidth: '1000px',
      memberInformation: {
        mem_memberCardNum: ''
      },
      change: false
    }
  },
  mounted () {

  },
  created () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.4) + 'px'
    }
  },
  computed: {},
  methods: {
    math () {
      this.memberInformation.mem_memberCardNum = Date.parse(new Date()) / 100
    },
    init (val) {
      this.change = true
      if (val > 0) {
        this.memberInformation.id = val
      }
    },
    // 关闭
    closeButton () {
      this.memberInformation.id = ''
      this.memberInformation.mem_memberCardNum = ''
    },
    saveBut () {
      this.$refs.memberDataRef.validate().then((success) => {
        if (success) {
          this.memberInformation.mem_memberCardNum = this.memberInformation.mem_memberCardNum + ''
          const obj = {
            ...this.memberInformation
          }
          this.$store
            .dispatch('member/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '会员卡号更新成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.change = false
                this.$emit('returnMethod', this.memberInformation.mem_memberCardNum)
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    }
  }
}
</script>
