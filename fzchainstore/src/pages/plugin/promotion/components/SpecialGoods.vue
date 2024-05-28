<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-pb-md">
      <div class="q-gutter-x-xs row">
        <div class="col-12 col-md-4 q-mr-xs">
          <q-radio dense v-model="dataForm.ppi_special_goods_type" val="1" label="按整款" />
          <q-radio dense v-model="dataForm.ppi_special_goods_type" val="2" label="按SKU" />
          <q-btn color="primary" class="q-ma-sm" v-if="dataForm.ppi_special_goods_type == '1'" @click="chooseWxgoods" unelevated label="选择商品" />
          <q-btn color="primary" class="q-ma-sm" v-if="dataForm.ppi_special_goods_type == '2'" @click="selectBut" unelevated label="选择商品" />
          <q-btn
            :disabled="dataListSelections.length > 0 ? false : true"
            @click="delGoodsRow()"
            color="red"
            class="col-12 col-md-1"
            unelevated
            label="删除"
          />
          <q-btn class="q-ma-sm" color="green" @click="batchImport()" unelevated>Xlxs 文件批量导入</q-btn>
        </div>
      </div>
    </div>

    <upload-table-goods-info v-if="goodsUploadStatus" ref="returnTypes" @closeUpload="uploadTable"> </upload-table-goods-info>

    <choose-goods-spe ref="specificationTree" v-show="showGoodsList" @getSelectedGoodsData="getSelectedGoodsData"></choose-goods-spe>
    <choose-goods
      v-if="chooseVisible"
      ref="chooseWxgoodsList"
      @getChooseGoods="receivingAdministrator"
      @closeChooseGoods="closeChooseGoods"
    ></choose-goods>
    <div class="col-shrink full-height">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="specialGoods"
        rowSelection="multiple"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="40"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCharts="true"
        :enableRangeSelection="true"
        :enableCellTextSelection="true"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :rowMultiSelectWithClick="true"
        :singleClickEdit="true"
        :stopEditingWhenGridLosesFocus="true"
        :localeText="localeText"
        :context="context"
        @gridReady="onFirstDataRendered"
        @rowSelected="rowSelectedAg"
      ></ag-grid-vue>
    </div>
  </div>
</template>
<script>
import ChooseGoods from './ChooseGoods.vue';
import ChooseGoodsSpe from './ChooseGoodsSpe.vue';
export default {
  name: 'SpecialGoods',
  props: ['specialGoods'],
  components: {
    ChooseGoods,
    ChooseGoodsSpe,
  },
  data() {
    return {
      context: null,
      goodsUploadStatus: false,
      dataForm: { ppi_special_goods_type: '1' },
      chooseVisible: false,
      showGoodsList: false,
      components: {},
      gridOptions: {},
      dataListSelections: [],
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.01) + 'px',
        },
        {
          headerName: '商品名称',
          field: 'psg_goods_name',
          filter: false, // 是否过滤
          width: this.nowpx(0.13) + 'px',
          onCellValueChanged: function(p) {
            const itemsToUpdate = [];
            const data = p.data;
            data.psg_goods_name = Math.floor(Math.random() * 20000 + 20000);
            itemsToUpdate.push(data);
            const res = p.api.applyTransaction({ update: itemsToUpdate });
          },
        },
        {
          headerName: '颜色',
          field: 'psg_color_name',
          filter: false,
          width: this.nowpx(0.06) + 'px',
        },
        {
          headerName: '尺寸',
          field: 'psg_size_name',
          filter: false,
          width: this.nowpx(0.06) + 'px',
        },
        {
          headerName: '编码',
          field: 'psg_code',
          filter: false,
          width: this.nowpx(0.09) + 'px',
        },
        {
          headerName: '吊牌价',
          field: 'psg_price',
          filter: false,
          width: this.nowpx(0.06) + 'px',
        },
      ],
      localeText: this.$ag_grid_localeText,
      memberLevelPrice: '',
    };
  },
  watch: {
    'dataForm.ppi_special_goods_type'(val) {
      this.$emit('goodsType', val);
    },
  },
  mounted() {},
  computed: {},
  created() {
    // this.getList();
  },
  methods: {
    selectBut() {
      this.showGoodsList = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType(1);
        }, 500);
      });
    },
    // 选择商品
    chooseWxgoods() {
      this.chooseVisible = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.chooseWxgoodsList.getGoodsData();
        }, 500);
      });
    },
    // 选择返回的数据
    receivingAdministrator(data) {
      if (data && data.length > 0) {
        const specNewsDataBak = [];
        const list = this.specialGoods.map((item) => {
          return parseInt(item.psg_goods_id);
        });
        for (let i = 0; i < data.length; i++) {
          if (list.indexOf(parseInt(data[i].id)) == -1) {
            const person = {};
            person.psg_goods_id = data[i].id;
            person.psg_goods_name = data[i].ca_name;
            person.psg_code = data[i].ca_article_code;
            person.psg_price = data[i].ca_price;
            specNewsDataBak.push(person);
          } else {
            this.$q.notify({
              color: 'red',
              message: '失败',
              caption: data[i].ca_name + '已存在',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
            });
          }
        }
        this.specialGoods = this.specialGoods.concat(specNewsDataBak);

        this.$emit('giveBack', this.specialGoods);
      }
    },
     // 批量导入
    batchImport() {
      this.goodsUploadStatus = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.returnTypes.receiveType('goods');
        }, 500);
      });
    },
    uploadTable(data) {
      this.goodsUploadStatus = false;
      if (data && data.length > 0) {
        const specNewsDataBak = [];
        const list = this.specialGoods.map((item) => {
          return parseInt(item.psg_goods_id);
        });
        for (let i = 0; i < data.length; i++) {
          if (list.indexOf(parseInt(data[i].id)) == -1) {
            const person = {};

            person.psg_goods_name = data[i][2];
            person.psg_code = data[i][1];
            if (this.dataForm.ppi_special_goods_type == '2') {
              person.psg_size_name = data[i][3];
            }
            person.psg_price = data[i][4];
            specNewsDataBak.push(person);
          } else {
            this.$q.notify({
              color: 'red',
              message: '失败',
              caption: data[i][2] + '已存在',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
            });
          }
        }
        this.specialGoods = this.specialGoods.concat(specNewsDataBak);

        this.$emit('giveBack', this.specialGoods);
      }
    },

    // 关闭
    closeChooseGoods() {
      this.chooseVisible = false;
    },

    delGoodsRow() {
      const selRows = this.gridOptions.api.getSelectedNodes(); // 获取选中的行
      if (selRows.length > 0) {
        const obj = selRows.map((item) => {
          return item.childIndex;
        });
        this.$emit('delSpecialGoodsRow', obj);
      }
      this.dataListSelections = [];
    },
    // 获取选中规格商品数据
    getSelectedGoodsData(data, status = false) {
      this.showGoodsList = status;
      const that = this;
      if (data && data.length > 0) {
        const list = this.specialGoods.map((item) => {
          return parseInt(item.psg_sep_id);
        });
        const specNewsDataBak = [];
        for (let i = 0; i < data.length; i++) {
          if (list.indexOf(parseInt(data[i].id)) == -1) {
            const person = {};
            person.psg_goods_id = data[i].cad_archives_id;
            person.psg_goods_name = data[i].ca_name;
            person.psg_sep_id = data[i].id;
            person.psg_size_name = data[i].cad_size_name;
            person.psg_color_name = data[i].cad_color_name;
            person.psg_code = data[i].cad_skc_code;
            person.psg_price = data[i].cad_price;
            specNewsDataBak.push(person);
          } else {
            this.$q.notify({
              color: 'red',
              message: '失败',
              caption: data[i].ca_name + '已存在',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
            });
          }
        }
        this.specialGoods = this.specialGoods.concat(specNewsDataBak);

        this.$emit('giveBack', this.specialGoods);
      }
    },
    rowSelectedAg(p) {
      this.dataListSelections = p.api.getSelectedRows();
    },
    // 获取信息列表
    getList() {
      const obj = {
        id: this.goods,
      };
      this.$store
        .dispatch('pointPrice/getList', obj)
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.dataList = res.data.list ? res.data.list : [];
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red',
          });
        });
    },
    nowpx(px) {
      let nowWidth = this.$q.screen.width;
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024;
      }
      return parseInt(nowWidth * px);
    },
    onFirstDataRendered(params) {
      const nowWidth = this.$q.screen.width;
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit();
      }
    },
  },
};
</script>
