<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.7 + 'px',
        'min-width': this.$q.screen.width * 0.7 + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <q-form ref="listsRef">
            <div class="row items-center q-pa-none">
              <div class="text-h6">{{ typeId == 1 ? '激活' : '注册' }}卡密列表</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </div>
            <div class="row q-gutter-xs q-mb-xs">
              <q-input
                outlined
                dense
                v-model="listsData.cardNumber"
                label="请输入数量"
                class="col-12 col-md-6"
                :rules="
                  typeId == 1
                    ? [(val) => (parseInt(val) <= 200 && parseInt(val) > 0 ? true : false || '请输入1~200的整数')]
                    : [(val) => (parseInt(val) <= 50 && parseInt(val) > 0 ? true : false || '请输入1~50的整数')]
                "
              >
                <template v-slot:after>
                  <q-btn unelevated color="primary" :disable="addButtonDisabled" label="生成卡密" v-if="authorityMeta('addCardSecret')" class="q-ml-sm q-px-sm full-height" @click="setData" />
                  <q-btn unelevated color="red" label="一键下载二维码" class="q-ml-sm  q-px-sm full-height" @click="oneClickDownload" />
                </template>
              </q-input>
              <div class="text-red">
                注意：为了保证卡密完整创建，每次生成【激活卡密】数量最大为【200】张！生成【注册卡密】数量最大为【50】张！
                一键下载只能下载当前列表下所有二维码
              </div>
            </div>
          </q-form>
        </div>

        <div class="col-shrink q-px-xs full-height bg-grey-2">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="listsListData"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            @first-data-rendered="onFirstDataRendered"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            rowHeight="40"
            :context="context"
            :localeText="localeText"
            rowSelection="multiple"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
            :stopEditingWhenGridLosesFocus="true"
            :suppressRowDeselection="true"
            :suppressRowTransform="true"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pb-md">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pageSize"
            :total="page.pageTotal"
          ></hl-pagination>
        </div>
      </div>
      <div v-show="false" id="allQrcode" ref="qrCodeRef"></div>
      <q-dialog v-model="codePoppupStatus">
        <q-card
          :style="{
            width: this.$q.screen.width * 0.18 + 'px',
            'min-width': this.$q.screen.width * 0.18 + 'px',
          }"
        >
          <q-card-section>
            <div class="text-h6">卡密二维码</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="q-pt-lg text-center  flex flex-center">
              <qrcode-vue :value="dataUrl" :size="'200'" level="H" />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="关闭" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-dialog>
</template>
<script>
const JSZip = require('jszip')
import FileSaver from 'file-saver'

import CardAgOperate from './components/CardAgOperate'

export default {
  name: 'KmjhLists',
  components: { CardAgOperate },
  data () {
    return {
      showDialog: true,
      codePoppupStatus: false,
      addButtonDisabled: false,
      listsData: {
        cardNumber: '',
        pkl_package_id: ''
      },
      packageId: '',
      typeId: '',
      context: null,
      gridOptions: {},
      selected: [],
      listsListData: [],
      columnDefs: [
        {
          headerName: '卡密',
          field: 'pkl_card_secret',
          cellRendererFramework: 'CardAgOperate',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '状态',
          valueGetter: (p) => {
            if (parseInt(p.data.pkl_status) == 2) {
              return '已使用'
            } else {
              return '未使用'
            }
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '会员昵称',
          field: 'member.mem_memberName',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'member.mem_memberCardNum',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '会员电话号',
          field: 'member.mem_memberMobile',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '激活时间',
          valueGetter: (p) => {
            if (parseInt(p.data.pkl_status) == 2) {
              return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD HH:mm:ss')
            }
          },
          width: this.nowpx(0.17) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      pkp_name: '',
      dataUrl: ''
    }
  },
  created () {
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getList (id, type, pkp_name) {
      this.packageId = id
      this.typeId = type
      this.pkp_name = pkp_name
      const params = {
        packageId: id,
        typeId: type,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('kmjh/getCardListsData', params)
        .then((res) => {
          if (res.code == 200) {
            this.listsListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    },
    setData () {
      this.$refs.listsRef.validate().then((success) => {
        if (success) {
          if (parseInt(this.typeId) == 1 && parseInt(this.listsData.cardNumber) > 200) {
            this.$q.notify({
              message: '注意',
              caption: '生成激活卡密数量最大为200',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            return false
          }
          if (parseInt(this.typeId) == 2 && parseInt(this.listsData.cardNumber) > 50) {
            this.$q.notify({
              message: '注意',
              caption: '生成注册卡密数量最大为50',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            return false
          }
          this.$q.loading.show()
          this.addButtonDisabled = true
          this.listsData.pkl_package_id = this.packageId
          this.listsData.pkl_type = this.typeId
          const params = {
            ...this.listsData
          }
          this.$store
            .dispatch('kmjh/setCardData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '新增卡密成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$q.loading.hide()
                this.addButtonDisabled = false
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$q.loading.hide()
                this.addButtonDisabled = false
              }
              this.getList(this.listsData.pkl_package_id, this.typeId, this.pkp_name)
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    creatQrCode (url) {
      this.dataUrl = url
      this.codePoppupStatus = true
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    // 分页变化
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList(this.packageId, this.typeId, this.pkp_name)
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList(this.packageId, this.typeId, this.pkp_name)
    },
    hideNowPage () {
      this.$emit('dataList', [])
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
    },

    oneClickDownload () {
      const that = this
      const newArr = this.listsListData

      const imgArr = []

      for (let i = 0; i < newArr.length; i++) {
        new QRCode(that.$refs.qrCodeRef, {
          width: 200,
          height: 200, // 高度
          text: newArr[i].pkl_card_secret, // 二维码内容
          correctLevel: QRCode.CorrectLevel.H
        })
        const myselfCanvas = document.getElementById('allQrcode').getElementsByTagName('canvas')

        const imgURL = myselfCanvas[0].toDataURL('image/jpg')
        imgArr.push({
          img: imgURL,
          name: newArr[i].pkl_card_secret
        })
      }

      this.downImg(imgArr, that.pkp_name)
    },

    downImg (imgArr, title) {
      // imgArr是我们要下载的图片列表，title就是你下载出来的压缩包的名称
      const zip = new JSZip()
      let file_name = ''
      for (let i = 0; i < imgArr.length; i++) {
        // 循环我们传进来的图片列表，为每一张图片赋值
        const item = imgArr[i].img
        const name = imgArr[i].name // 每一张图片的名字，可以根据自己的规则生成
        file_name = title + '.zip' // 生成的文件的名字
        const img = zip.folder(name) // 生成压缩图片
        const img_arr = item.split(',')

        img.file(name + '.png', img_arr[1], { base64: true }) // 生成图片，采用base64格式
      }
      zip.generateAsync({ type: 'blob' }).then(function (content) {
        FileSaver.saveAs(content, file_name) // 生成文件，调用saveAs
      })
    }
  }
}
</script>
