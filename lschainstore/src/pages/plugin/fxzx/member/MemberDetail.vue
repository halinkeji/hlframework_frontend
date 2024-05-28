<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.7 + 'px',
        'min-width': $q.screen.width * 0.7 + 'px',
      }"
      class="q-pa-md q-px-lg"
    >
      <q-card-section class="row items-center q-pa-none q-mb-lg">
        <div class="text-h6">分销商信息</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <div class="text-subtitle1 text-weight-bold">分销信息</div>
      <q-card-section class="q-pa-sm q-mt-md">
        <div class="row justify-between">
          <div class=" q-gutter-y-sm col-3" v-if="memberData.member">
            <div class="text-weight-bold row">
              <div class="col-5 text-right">用户信息</div>
            </div>
            <div class="row">
              <div class="col-5 text-right">昵称</div>
              <div class="col-7">：{{ memberData.member.mem_memberName }}</div>
            </div>
            <div class="row">
              <div class="col-5 text-right">卡号</div>
              <div class="col-7">：{{ memberData.member.mem_memberCardNum }}</div>
            </div>
            <div class="row">
              <div class="col-5 text-right">联系电话</div>
              <div class="col-7">：{{ memberData.member.mem_memberMobile }}</div>
            </div>
            <div class="row" v-if="memberData.member.memberLevel">
              <div class="col-5 text-right">会员等级</div>
              <div class="col-7">：{{ memberData.member.memberLevel.mcl_level_name }}</div>
            </div>
          </div>
          <div class="q-gutter-y-sm col-3">
            <div class="text-weight-bold row">
              <div class="col-5 text-right">分销商信息</div>
            </div>
            <div class="row" v-if="memberData.level">
              <div class="col-5 text-right">分销等级</div>
              <div class="col-7 row">
                ：{{ memberData.level.pfl_name }}
                <q-btn
                  flat
                  color="primary"
                  dense
                  label="修改"
                  class="q-ml-xs"
                  size="sm"
                  @click="showFxzxLevel(memberData.id, memberData.pfm_level_id)"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-5 text-right">上级分销商</div>
              <div class="col-7">
                ：{{ memberData.parentName }}
                <q-btn flat color="primary" dense label="修改" size="sm" @click="showFxzxLists(memberData.id, memberData.parentFxzxId)" />
              </div>
            </div>
            <div class="row">
              <div class="col-5 text-right">成为分销商时间</div>
              <div class="col-7">：{{ $q_date.formatDate(memberData.pfm_become_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}</div>
            </div>
          </div>
          <div class=" q-gutter-y-sm col-3">
            <div class="text-weight-bold row">
              <div class="col-5 text-right">用户信息</div>
            </div>
            <div class="row">
              <div class="col-5 text-right">
                <q-btn flat color="primary" dense label="全部下级" size="sm" @click="showFxzxSonLists(memberData.pfm_member_id)" v-if="authorityMeta('sonMember')" />
                <span v-else>全部下级</span>
              </div>
              <div class="col-7">
                ：{{ memberData.sonAllCount }}人 (分销商：{{ memberData.sonFxzxAllCount }}人）
              </div>
            </div>
            <div class="row">
              <div class="col-5 text-right">一级</div>
              <div class="col-7">：会员总数{{ memberData.sonOneCount }}人 (其中分销商：{{ memberData.sonFxzxOneCount }}人）</div>
            </div>
            <div class="row">
              <div class="col-5 text-right">二级</div>
              <div class="col-7">：会员总数{{ memberData.sonTwoCount }}人 (其中分销商：{{ memberData.sonFxzxTwoCount }}人）</div>
            </div>
            <div class="row">
              <div class="col-5 text-right">三级</div>
              <div class="col-7">：会员总数{{ memberData.sonThreeCount }}人 (其中分销商：{{ memberData.sonFxzxThreeCount }}人）</div>
            </div>
          </div>
          <div class=" q-gutter-y-sm col-3" v-if="memberData.formFieldName">
            <div class="text-weight-bold row">
              <div class="col-5 text-right">
                关联表单信息
                </div>
                <q-btn flat color="primary" dense label="修改" size="sm" class="q-ml-xs" @click="showAddTemplate" />
            </div>

            <div class="row" v-for="(item, key) in memberData.formFieldName" :key="key">
              <div class="col-5 text-right">{{ item.headerName }}</div>
              <div class="col-7">：{{ fieldData[item.field] }}</div>
            </div>
          </div>
        </div>
      </q-card-section>
      <div class="q-mt-lg">
        <div class="text-subtitle1 text-weight-bold">佣金信息</div>
      </div>
      <div class="row justify-between q-mt-lg">
        <div class="col-3 q-pr-sm">
          <q-card flat bordered class="q-pa-lg row">
            <div class="col-4"><q-avatar size="70px" font-size="32px" color="blue-1" text-color="primary" icon="las la-yen-sign" /></div>
            <div>
              <div class="text-weight-bold">累计佣金</div>
              <div class="text-h5 text-weight-bold q-mt-sm">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ memberData.pfm_total_fxzx_amount }}</div>
            </div>
          </q-card>
        </div>
        <div class="col-3 q-px-sm">
          <q-card flat bordered class="q-pa-lg row">
            <div class="col-4"><q-avatar size="70px" font-size="40px" color="green-1" text-color="green" icon="las la-hand-holding-usd" /></div>
            <div>
              <div class="text-weight-bold">已提现佣金</div>
              <div class="text-h5 text-weight-bold q-mt-sm">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ memberData.pfm_take_fxzx_amount }}</div>
            </div>
          </q-card>
        </div>
        <div class="col-3 q-px-sm">
          <q-card flat bordered class="q-pa-lg row">
            <div class="col-4"><q-avatar size="70px" font-size="36px" color="amber-1" text-color="amber" icon="las la-file-invoice-dollar" /></div>
            <div>
              <div class="text-weight-bold">待入账佣金</div>
              <div class="text-h5 text-weight-bold q-mt-sm">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ memberData.waitFxzxAmount }}</div>
            </div>
          </q-card>
        </div>
        <div class="col-3 q-pl-sm">
          <q-card flat bordered class="q-pa-lg row">
            <div class="col-4"><q-avatar size="70px" font-size="36px" color="blue-1" text-color="primary" icon="las la-file-invoice" /></div>
            <div>
              <div class="text-weight-bold">分销订单</div>
              <div class="text-h5 text-weight-bold  q-mt-sm">{{ memberData.recordCount }}</div>
            </div>
          </q-card>
        </div>
      </div>
    </q-card>
    <fxzx-level ref="fxzxLevelRef" v-if="fxzxLevelPoppupStatus" @dataList="hideFxzxLevelPoppup" />
    <fxzx-lists ref="fxzxListsRef" v-if="fxzxListsPoppupStatus" @dataList="hideFxzxListsPoppup" />
    <fxzx-son-lists ref="fxzxSonListsRef" v-if="fxzxSonListsPoppupStatus" @dataList="hideFxzxSonListsPoppup" />
    <add-template ref="addTemplateRef" v-if="addPoppupStatus" @dataList="hideTemplatePoppup" />
  </q-dialog>
</template>
<script>
import FxzxLevel from './components/FxzxLevel'
import FxzxLists from './components/FxzxLists'
import FxzxSonLists from './components/FxzxSonLists'
import AddTemplate from './components/AddTemplate'
export default {
  name: 'FxzxMemberDetail',
  components: {
    FxzxLevel,
    FxzxLists,
    FxzxSonLists,
    AddTemplate
  },
  data () {
    return {
      addPoppupStatus: false,
      fxzxLevelPoppupStatus: false,
      fxzxListsPoppupStatus: false,
      fxzxSonListsPoppupStatus: false,
      showDialog: true,
      fxzxId: '',
      memberData: {},
      fieldData: {}
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.showDialog = true

      if (id > 0) {
        this.fxzxId = id
        this.$store
          .dispatch('fxzx/getMemberItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.memberData = res.data ? res.data : {}
              this.fieldData = res.data.formFieldData ? res.data.formFieldData : {}
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
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    showAddTemplate () {
      this.addPoppupStatus = true
      const idData = {
        formId: parseInt(this.memberData.formFieldData.form_id) > 0 ? parseInt(this.memberData.formFieldData.form_id) : false,
        templateId: parseInt(this.memberData.formFieldData.id) > 0 ? parseInt(this.memberData.formFieldData.id) : false
      }
      this.$nextTick(() => {
        this.$refs.addTemplateRef.getList(idData)
      })
    },
    hideTemplatePoppup () {
      this.addPoppupStatus = false
      this.init(this.fxzxId)
    },
    hideNowPage () {
      this.$emit('dataList')
    },
    showFxzxLevel (id, levelId) {
      this.fxzxLevelPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.fxzxLevelRef.getList(id, levelId)
      })
    },
    showFxzxLists (id, parentFxzxId) {
      this.fxzxListsPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.fxzxListsRef.getList(id, parentFxzxId)
      })
    },
    showFxzxSonLists (id) {
      this.fxzxSonListsPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.fxzxSonListsRef.getList(id)
      })
    },
    hideFxzxLevelPoppup () {
      this.fxzxLevelPoppupStatus = false
      this.init(this.fxzxId)
    },
    hideFxzxLevelRecordPoppup () {
      this.fxzxLevelRecordPoppupStatus = false
      this.init(this.fxzxId)
    },
    hideFxzxListsPoppup () {
      this.fxzxListsPoppupStatus = false
      this.init(this.fxzxId)
    },
    hideFxzxSonListsPoppup () {
      this.fxzxSonListsPoppupStatus = false
      this.init(this.fxzxId)
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
