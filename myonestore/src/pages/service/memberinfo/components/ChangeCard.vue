<template>
  <q-dialog v-model="change">
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.2) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.2) + 'px',
      }"
    >
      <q-form ref="memberDataRef">
        <q-toolbar>
          <q-toolbar-title class="text-subtitle2"> 换卡</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup @click="closeButton" />
        </q-toolbar>
        <q-card-section>
          <q-input
            v-model="memberInformation.mem_memberCardNum"
            dense
            outlined
            bottom-slots
            lazy-rules
            readonly
            :rules="[(val) => !!val || '卡号是必填的']"
          >
            <template v-slot:prepend>
              <span class="text-subtitle1">会员卡号</span>
            </template>

            <template v-slot:after v-if="!(storeMemberConfig && parseInt(storeMemberConfig.member_level_defaultMobile) == 1)">
              <q-btn unelevated color="red-6" label="生成新卡号" size="15px" @click="generateNewCardNumber" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions class="row justify-center q-gutter-sm">
          <q-btn unelevated color="grey-7" label="关闭" class="q-px-xl" v-close-popup @click="closeButton" />
          <q-btn unelevated @click="saveBut" color="blue-6" label="保存" class="q-px-xl" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'ChangeCard',
  data () {
    return {
      memberInformation: {
        mem_memberCardNum: ''
      },
      change: false,
      storeMemberConfig: {}
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {

    generateNewCardNumber () {
      let cardNumber = ''
      if (this.storeMemberConfig && this.storeMemberConfig.member_level_cardNumberPrefix) {
        cardNumber += this.storeMemberConfig.member_level_cardNumberPrefix
      }

      if (this.storeMemberConfig && this.storeMemberConfig.member_level_cardNumberLength) {
        cardNumber += this.randomStr(this.storeMemberConfig.member_level_cardNumberLength)
      } else {
        cardNumber += this.randomStr(11)
      }

      if (this.storeMemberConfig && this.storeMemberConfig.member_level_cardNumberSuffix) {
        cardNumber += this.storeMemberConfig.member_level_cardNumberSuffix
      }
      this.memberInformation.mem_memberCardNum = cardNumber
    },

    randomStr (cardNumberLength) {
      const len = parseInt(cardNumberLength) ? parseInt(cardNumberLength) : 11
      const t = '1234567890'
      let val = ''
      for (let i = 0; i < len; i++) {
        val += t.charAt(Math.floor(Math.random() * t.length))
      }
      return val
    },

    init (val) {
      this.change = true
      if (this.$q.localStorage.getItem('myonestore_store_local').storeMemberConfig) {
        this.storeMemberConfig = this.$q.localStorage.getItem('myonestore_store_local').storeMemberConfig
      }
      if (val && val.id) {
        this.memberInformation.id = val.id
        if (this.storeMemberConfig && parseInt(this.storeMemberConfig.member_level_defaultMobile) == 1) {
          this.memberInformation.mem_memberCardNum = val.mem_memberMobile
        }
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
