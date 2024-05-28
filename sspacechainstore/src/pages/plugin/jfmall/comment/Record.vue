<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm">
      <div class="q-gutter-x-xs row">
        <div class="col-12 col-md-2">
          <q-select
            outlined
            v-model="status"
            :options="[
              { label: '显示', value: '1' },
              { label: '隐藏', value: '2' },
            ]"
            dense
            label="显示或隐藏"
            emit-value
            map-options
            option-value="value"
            option-label="label"
          />
        </div>
        <q-btn color="primary" unelevated label="搜索" @click="getList" />
        <q-btn unelevated color="warning" label="重置" @click="cleanCondition" />
      </div>
    </div>

    <div class="col-shrink bg-white q-px-xs full-height">
      <q-table
        :data="messageListData"
        :columns="columnTable"
        row-key="name"
        hide-bottom
        flat
        bordered
        :pagination="{
          rowsPerPage: 0,
        }"
        separator="cell"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="gc_nickname" :props="props">
              <div>{{ props.row.gc_nickname }}</div>
            </q-td>
            <q-td key="gc_cover_image" :props="props">
              <q-img :src="props.row.gc_cover_image" :ratio="1" style="height: 50px; width: 50px" />
            </q-td>
            <q-td key="gc_description" :props="props">
              {{ props.row.gc_description }}
            </q-td>

            <q-td key="gc_comment_star_level" :props="props">
              <q-icon :key="`star${k}`" v-for="(i, k) in parseInt(props.row.gc_comment_star_level)" name="star" color="red"></q-icon>
            </q-td>

            <q-td key="star" :props="props">
              <q-list dense>
                <q-item v-for="(item, key) in props.row.commentList" :key="key + props.props.rowIndex + 'star'">
                  <q-item-section avatar>
                    <q-item-label overline>{{ item.wgc_star_label }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label caption>
                      <q-icon :key="`star${k}`" v-for="(i, k) in parseInt(item.wgc_star_value)" name="star" color="red"></q-icon
                    ></q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-td>

            <q-td key="phrase" :props="props">
              <q-badge color="blue" v-for="(item, key) in props.row.commentListPhrase" :key="key + props.props.rowIndex + 'phrase'">
                {{ item.wgc_star_label }}
              </q-badge>
            </q-td>

            <q-td key="gc_store_reply" :props="props">
              {{ props.row.gc_store_reply }}
            </q-td>

            <q-td key="updated_at" :props="props">
              {{ $q_date.formatDate(props.row.updated_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}
            </q-td>

            <q-td key="operator" :props="props">
              <div class="row q-gutter-sm text-center">
                <q-btn color="primary" unelevated label="回复" @click="openReplyMsg(props.row)" />
                <q-btn
                  color="red"
                  v-if="parseInt(props.row.gc_status) == 1"
                  unelevated
                  label="隐藏"
                  @click="saveCommentData({ id: props.row.id, gc_status: 2 })"
                />
                <q-btn
                  color="positive"
                  v-if="parseInt(props.row.gc_status) == 2"
                  unelevated
                  label="显示"
                  @click="saveCommentData({ id: props.row.id, gc_status: 1 })"
                />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div class="col-shrink bg-white q-pb-md q-mt-xs">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'jfCommentList',
  components: {},
  data () {
    return {
      messageListData: [],
      columnTable: [
        {
          label: '会员昵称',
          align: 'left',
          name: 'gc_nickname',
          classes: 'ellipsis'
        },
        {
          label: '会员头像',
          align: 'center',
          name: 'gc_cover_image',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          align: 'center',
          label: '评价描述',
          name: 'gc_description'
        },

        {
          label: '评价星级',
          align: 'center',
          name: 'gc_comment_star_level',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          label: '评价标签',
          align: 'center',
          name: 'phrase',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          align: 'center',
          label: '评价详情',
          name: 'star'
        },
        {
          align: 'center',
          label: '商家回复',
          name: 'gc_store_reply'
        },
        {
          align: 'center',
          label: '最新更新时间',
          name: 'updated_at'
        },
        {
          align: 'center',
          label: '操作',
          name: 'operator'
        }
      ],

      searchQuery: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      dataListSelections: [],
      status: ''
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    getList () {
      this.isPoppupStatus = false
      const obj = {
        status: this.status,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('jfComment/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.page.totalCount = res.data.page.totalCount
              this.messageListData = res.data.list
            } else {
              this.page.totalCount = 0
              this.messageListData = []
            }
          }
        })
        .catch((error) => {})
    },
    cleanCondition () {
      this.status = ''
      this.$nextTick(() => {
        this.getList()
      })
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },

    openReplyMsg (item) {
      this.$q
        .dialog({
          title: '商家回复',
          message: '请输入您的回复',
          prompt: {
            model: item.gc_store_reply,
            type: 'text' // optional
          },
          cancel: true,
          persistent: true
        })
        .onOk((data) => {
          this.saveCommentData({
            gc_store_reply: data,
            gc_status: 2,
            id: item.id
          })
          // console.log('>>>> OK, received', data)
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
    },

    saveCommentData (obj) {
      this.$store
        .dispatch('jfComment/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '更新成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.$nextTick(() => {
              this.getList()
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: 'Error',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
          this.stop = false
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
