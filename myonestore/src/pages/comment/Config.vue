<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-pa-sm full-height bg-white ">
      <q-scroll-area class="fit full-height">
        <q-form ref="rewardConfigForm" class="row q-col-gutter-md">
          <div class="col-12 col-md-4 ">
            <q-card flat bordered>
              <q-card-section class="row items-center">
                <div class="text-subtitle2">评价功能开关</div>
                <q-space />

                <q-radio v-model="commentConfigData.mcc_status" val="1" label="开启" />
                <q-radio v-model="commentConfigData.mcc_status" val="0" label="关闭" />
              </q-card-section>
            </q-card>

            <q-card flat bordered class="q-mt-sm">
              <q-card-section class="text-subtile2 row items-center">
                自定义评分项 <q-space />
                <q-btn color="primary" label="新增" unelevated @click="addServeStar" />
              </q-card-section>
              <q-separator />

              <q-card-section class="text-subtile2 row items-center">
                <div class="full-width  q-mb-md row q-col-gutter-sm" v-for="(item, key) in commentConfigData.mcc_serve_star">
                  <q-input outlined dense class="col" v-model="item.value" label="评分内容" :rules="[(val) => !!val || '请输入评分内容']">
                    <template v-slot:append>
                      <q-btn @click="delServeStar(key)" color="red" round icon="las la-trash" unelevated size="sm" />
                    </template>
                  </q-input>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="q-mt-sm">
              <q-card-section class="text-subtile2 row items-center">
                评价短语 <q-space />
                <q-btn color="primary" label="新增" unelevated @click="addFastPhrase" />
              </q-card-section>
              <q-separator />

              <q-card-section class="text-subtile2 row items-center">
                <div class="full-width  q-mb-md row q-col-gutter-sm" v-for="(item, key) in commentConfigData.mcc_comment_phrase">
                  <q-input outlined dense class="col" v-model="item.phrase" label="评价短语" :rules="[(val) => !!val || '请输入评价短语']">
                    <template v-slot:append>
                      <q-btn @click="delFastPhrase(key)" color="red" round icon="las la-trash" unelevated size="sm" />
                    </template>
                  </q-input>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-form>
      </q-scroll-area>
    </div>

    <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
      <q-btn unelevated color="primary" class="q-px-xl" label="保存" :disable="addButtonDisabled" @click="setData" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'ReserveConfig',
  data () {
    return {
      addButtonDisabled: false,

      commentConfigData: {
        mcc_status: 0,
        mcc_comment_phrase: [],
        mcc_serve_star: []
      },

      statusOptions: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '0' }
      ]
    }
  },
  mounted () {},
  created () {
    this.getConfigItem()
  },
  computed: {},
  methods: {
    getConfigItem () {
      this.addButtonDisabled = false
      this.$store
        .dispatch('comment/getItemData')
        .then((res) => {
          if (res.code == 200) {
            this.commentConfigData =
              res.data && res.data
                ? res.data
                : {
                    mcc_status: '0',
                    mcc_comment_phrase: [],
                    mcc_serve_star: []
                  }

            this.commentConfigData.mcc_serve_star = res.data && res.data && res.data.mcc_serve_star ? res.data.mcc_serve_star : []
            this.commentConfigData.mcc_comment_phrase = res.data && res.data && res.data.mcc_comment_phrase ? res.data.mcc_comment_phrase : []
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
    },

    setData () {
      this.$refs.rewardConfigForm.validate().then((success) => {
        if (success) {
          const data = {
            ...this.commentConfigData
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('comment/setItemData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存配置成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.getConfigItem()
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

    addFastPhrase () {
      this.commentConfigData.mcc_comment_phrase.push({
        phrase: ''
      })
    },

    delFastPhrase (key) {
      if (this.commentConfigData && this.commentConfigData.mcc_comment_phrase && this.commentConfigData.mcc_comment_phrase.length > 0) {
        this.commentConfigData.mcc_comment_phrase.splice(key, 1)
      }
    },

    addServeStar () {
      this.commentConfigData.mcc_serve_star.push({
        value: '',
        field: this.randomString(6)
      })
    },

    randomString (length) {
      const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let result = ''
      for (let i = length; i > 0; --i) { result += str[Math.floor(Math.random() * str.length)] }
      return result
    },

    delServeStar (key) {
      if (this.commentConfigData && this.commentConfigData.mcc_serve_star && this.commentConfigData.mcc_serve_star.length > 0) {
        this.commentConfigData.mcc_serve_star.splice(key, 1)
      }
    }

  }
}
</script>
