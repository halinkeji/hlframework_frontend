<template>
  <q-dialog v-model="dialogStatus" persistent>
    <q-card
      flat
      :style="{
        width: $q.screen.width * 0.8 + 'px',
        'min-width': $q.screen.width * 0.8 + 'px',
        height: $q.screen.height * 0.8 + 'px',
      }"
      class="full-height column no-wrap "
    >
      <q-card-section class="row col-shrink items-center q-pa-none q-px-md">
        <div class="text-subtitle2 q-pr-lg">寄存记录</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeDialog" />
      </q-card-section>
      <q-separator />

      <q-card-section class="col-shrink q-py-sm q-px-xs row q-gutter-xs">
        <div class="col-12 col-md-2">
          <q-input outlined clearable dense v-model="searchCondition.goodsName" label="物品名称" />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            outlined
            dense
            v-model="searchCondition.goodsType"
            option-value="id"
            option-label="pht_name"
            :options="typeOptions"
            label="请选择分类"
            emit-value
            map-options
            clearable
          />
        </div>
        <div class="col-12 col-md-2">
          <q-input outlined readonly dense v-model="searchCondition.startTime" label="开始时间">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="searchCondition.startTime" minimal mask="YYYY-MM-DD HH:mm:ss">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon color="grey" v-if="searchCondition.startTime" @click="searchCondition.startTime = ''" name="cancel"></q-icon>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="searchCondition.startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-md-2 col-12">
          <q-input outlined readonly dense label="结束时间" v-model="searchCondition.endTime">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="searchCondition.endTime" minimal mask="YYYY-MM-DD HH:mm:ss">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon color="grey" v-if="searchCondition.endTime" @click="searchCondition.endTime = ''" name="cancel"></q-icon>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="searchCondition.endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-2">
          <q-input outlined dense clearable v-model="searchCondition.recordRemarks" label="请输入备注" />
        </div>

        <q-btn unelevated color="primary" label="查询" @click="getList" />
        <q-btn unelevated color="warning" label="重置" @click="clearButton" />
        <q-btn unelevated color="primary" label="新增" @click="showAddRecord(0)" />
      </q-card-section>

      <q-card-section class="col-shrink q-px-xs full-height">
        <q-scroll-area class="fit">
          <q-table
            flat
            hide-bottom
            :pagination="{
              rowsPerPage: 0,
            }"
            bordered
            separator="cell"
            :data="recordData"
            :columns="tableColumns"
            row-key="name"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="phr_name" :props="props">
                  {{ props.row.phr_name }}
                </q-td>
                <q-td key="phr_quantity" :props="props">
                  {{ props.row.phr_quantity }}
                </q-td>
                <q-td key="type" :props="props">
                  {{ props.row.type ? props.row.type.pht_name : '' }}
                </q-td>
                <q-td key="phr_remarks" :props="props">
                  {{ props.row.phr_remarks }}
                </q-td>
                <q-td key="created_at" :props="props">
                  {{ $q_date.formatDate(props.row.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}
                </q-td>
                <q-td key="id" :props="props">
                  <q-btn unelevated color="warning" label="存取处理" @click="showDetail(props.row.id)" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-scroll-area>
      </q-card-section>
    </q-card>
    <hyjc-add-record ref="addRecordRef" v-if="addRecordStatus" @dataList="getList" />
    <hyjc-detail ref="detailRef" v-if="detailStatus" @dataList="getList" />
  </q-dialog>
</template>
<script>
import hyjcDetail from './Detail'
import hyjcAddRecord from './AddRecord'
export default {
  name: 'MemberHyjcRecord',
  components: {
    hyjcDetail,
    hyjcAddRecord
  },
  data () {
    return {
      addRecordStatus: false,
      detailStatus: false,
      dialogStatus: false,
      tableColumns: [
        { name: 'phr_name', align: 'center', label: '物品名称', field: 'phr_name' },
        { name: 'phr_quantity', align: 'center', label: '数量', field: 'phr_quantity' },
        { name: 'type', align: 'center', label: '分类', field: 'type' },
        { name: 'phr_remarks', align: 'center', label: '备注', field: 'phr_remarks' },
        { name: 'created_at', align: 'center', label: '添加时间', field: 'created_at' },
        { name: 'id', align: 'center', label: '操作', field: 'id' }
      ],

      recordData: [],
      typeOptions: [],
      searchCondition: {
        goodsName: '',
        goodsType: '',
        startTime: '',
        endTime: '',
        recordRemarks: ''
      }
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {},
  mounted () {},
  methods: {
    init (roomId, memberId) {
      this.dialogStatus = true
      this.roomId = roomId
      this.getTypeList()
      if (parseInt(memberId) > 0) {
        this.memberId = memberId
        this.$nextTick(() => {
          this.getList()
        })
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

    closeDialog () {
      this.$emit('closeDialog')
    },

    showDetail (id) {
      this.detailStatus = true
      this.$nextTick(() => {
        this.$refs.detailRef.init(id)
      })
    },
    clearButton () {
      this.searchCondition = {
        goodsName: '',
        goodsType: '',
        startTime: '',
        endTime: '',
        recordRemarks: ''
      }
      this.getList()
    },

    showAddRecord (id) {
      this.addRecordStatus = true
      this.$nextTick(() => {
        this.$refs.addRecordRef.init(id, parseInt(this.memberId))
      })
    },

    getList () {
      this.addRecordStatus = false
      this.detailStatus = false
      const obj = {
        memberId: this.memberId,
        ...this.searchCondition
      }
      this.$store
        .dispatch('hyjc/getMemberHyjcRecordList', obj)
        .then((res) => {
          this.recordData = res.data ? res.data : []
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
