<template>
  <q-page class="fit">
    <set-info v-if="showInfo" @getInfo="getWechatInfo"></set-info>
    <info v-if="showWechatInfo"></info>
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll bg-white"  v-if="shpowCard">
      <div class="col-shrink q-pa-sm full-height ">
        <q-card flat class="q-pa-md bg-grey-2">
          <div class="row">
            <div class="col-6">
              <div class="text-subtitle1">
                <q-icon name="create" style="font-size: 4rem; color: #ccc" />
                手动添加公众号
              </div>
              <div class="q-mx-xl text-grey-5">
                通过微信公众平台 基本配置获取AppID和AppSecret，添加成功后，将本平台获取的服务器配置接口绑定到微信公众平台（注：添加过程中，请务必保持参数一致）
              </div>
              <div align="center" class="q-mt-lg">
                <q-btn
                  unelevated
                  color="primary"
                  @click="
                    showInfo = true
                    shpowCard = false
                  "
                  label="手动添加公众号"
                />
              </div>
            </div>
            <q-separator :vertical="true" class="q-mx-sm" />
            <div class="col-5 q-ml-md">
              <div class="text-subtitle1">
                <q-icon name="phone_iphone" style="font-size: 4rem;color: #ccc" />
                授权添加公众号
              </div>
              <div class=" q-mx-xl text-grey-5">
                使用授权添加需认证微信开放平台和全网发布，并在微信开放平台设置中启用
              </div>
              <div align="center" class="q-mt-lg">
                <q-btn :disable="true" unelevated color="primary" label="授权添加公众号" />
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import Info from './Info.vue'
import SetInfo from './SetInfo.vue'
export default {
  components: { SetInfo, Info },
  data () {
    return {
      showInfo: false,
      shpowCard: false,
      showWechatInfo: false
    }
  },
  computed: {},
  created () {
    this.getWechatInfo()
  },
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.3) + 'px'
    }
  },
  methods: {
    getWechatInfo () {
      this.showInfo = false
      this.$store.dispatch('wechatSet/getItem').then((res) => {
        if (res.code == 200) {
          this.shpowCard = !res.data
          this.showWechatInfo = !!res.data
        }
      })
    }
  }
}
</script>
