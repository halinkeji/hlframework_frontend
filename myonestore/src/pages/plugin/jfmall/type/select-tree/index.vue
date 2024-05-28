<template>
  <q-card flat>
    <q-input outlined bottom-slots dense readonly v-model="inputData" :placeholder="textName">
      <q-menu>
        <q-list :style="{ width: list_width + 'px' }">
          <div v-for="item in dataList">
            <item-menu @getItem="getNowItem" v-if="item.childData.length > 0" :menu="item"></item-menu>

            <q-item clickable v-else @click="getNowItem(item)" v-close-popup="item.childData.length > 0 ? false : true">

              <q-item-section>
                {{ item.jt_name }}
              </q-item-section>
              <q-item-section side v-if="item.childData.length > 0">
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-menu>
      <template v-slot:append>
        <q-icon color="grey" v-if="inputData" @click="resetValueData" name="cancel"></q-icon>
      </template>
    </q-input>
  </q-card>
</template>

<script>
import itemMenu from './item'
export default {
  props: ['dataList', 'list_width', 'textName', 'inputLabel', 'inputValue', 'showValue'],
  components: {
    itemMenu
  },
  data () {
    return {
      inputData: ''
    }
  },
  watch: {
    dataList (value) {
      const eachOptionData = this.eachOption(value)

      eachOptionData.forEach((x) => {
        if (parseInt(x.id) == parseInt(this.showValue)) {
          this.getNowOneItem(x)
        }
      })
    },
    showValue (v) {
      const eachOptionData = this.eachOption(this.dataList)

      eachOptionData.forEach((x) => {
        if (parseInt(x.id) == parseInt(v)) {
          this.getNowOneItem(x)
        }
      })
    }
  },
  created: function () {},
  mounted () {},
  methods: {
    getNowItem (item) {
      if (item && item[this.inputLabel]) {
        this.inputData = item[this.inputLabel]
      }
      this.$emit('getItem', item)
    },
    getNowOneItem (item) {
      if (item && item[this.inputLabel]) {
        this.inputData = item[this.inputLabel]
      }
    },
    eachOption (level) {
      const arr = []
      function refining (level, arr) {
        const length = level.length
        for (let i = 0; i < length; i++) {
          arr.push(level[i])
          if (level[i].childData) {
            refining(level[i].childData, arr)
          }
        }
      }
      refining(level, arr)
      return arr
    },
    resetValueData () {
      this.inputData = ''
      this.$emit('resetValue')
    }
  }
}
</script>
