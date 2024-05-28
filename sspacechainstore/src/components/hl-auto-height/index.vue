<template>
  <div :style="computedStyle" class="q-mt-sm"><slot name="body"></slot></div>
</template>

<script>
export default {
  props: {
    otherHeigh: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  created: function() {},
  watch: {
    otherHeigh() {
      if (this.otherHeigh > 0) {
       this.computedStyle
      }
    }
  },
  computed: {
    computedStyle() {
      let height = "auto";

      let sub = "- 110px "; //q-page
      if (this.tagsView) {
        sub += "- 40px ";
      } else {
        sub += "- 200px ";
      }
      // TODO 这段代码需要使用自动计算dom高度的方法来代替
      if (
        this._contains("q-pa-sm", ["q-pa-xs", "q-ma-xs", "q-py-xs", "q-my-xs"])
      ) {
        sub += "- 5px ";
      } else if (
        this._contains("q-pa-sm", ["q-pt-xs", "q-pb-xs", "q-mt-xs", "q-mb-xs"])
      ) {
        sub += "- 2px ";
      } else if (
        this._contains("q-pa-sm", ["q-pa-sm", "q-ma-sm", "q-py-sm", "q-my-sm"])
      ) {
        sub += "- 13px ";
      } else if (
        this._contains("q-pa-sm", ["q-pt-sm", "q-pb-sm", "q-mt-sm", "q-mb-sm"])
      ) {
        sub += "- 6px ";
      } else if (
        this._contains("q-pa-sm", ["q-pa-md", "q-ma-md", "q-py-md", "q-my-md"])
      ) {
        sub += "- 30px ";
      } else if (
        this._contains("q-pa-sm", ["q-pt-md", "q-pb-md", "q-mt-md", "q-mb-md"])
      ) {
        sub += "- 15px ";
      } else if (
        this._contains("q-pa-sm", ["q-pa-lg", "q-ma-lg", "q-py-lg", "q-my-lg"])
      ) {
        sub += "- 45px ";
      } else if (
        this._contains("q-pa-sm", ["q-pt-lg", "q-pb-lg", "q-mt-lg", "q-mb-lg"])
      ) {
        sub += "- 23px ";
      } else if (
        this._contains("q-pa-sm", ["q-pa-xl", "q-ma-xl", "q-py-xl", "q-my-xl"])
      ) {
        sub += "- 93px ";
      } else if (
        this._contains("q-pa-sm", ["q-pt-xl", "q-pb-xl", "q-mt-xl", "q-mb-xl"])
      ) {
        sub += "- 47px ";
      }
      height = "calc(100vh " + sub + ")";
      return "height:" + height + ";";
    }
  },
  mounted() {},

  methods: {
    _contains(string, strArray) {
      return strArray.includes(string);
    }
  }
};
</script>
