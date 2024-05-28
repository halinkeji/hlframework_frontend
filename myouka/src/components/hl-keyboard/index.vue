<template>
  <div class="bg-grey-3 full-width">
    <div class="key-container">
      <div class="keyboard text-h5 q-py-xs">
        <div class="key-row row text-center">
          <div
            v-ripple:primary
            class="col q-ma-xs bg-white keyboard-button relative-position"
            @click="handleKeyPress(i)"
            v-for="i in [1, 2, 3]"
          >
            {{ i }}
          </div>

          <div
            v-ripple:primary
            class=" col q-ma-xs bg-white keyboard-button relative-position"
            @click="handleKeyPress('D')"
          >
            <q-icon name=" backspace" />
          </div>
        </div>
        <div class="key-row row text-center items-center">
          <div
            v-ripple:primary
            class="col q-ma-xs bg-white keyboard-button relative-position"
            @click="handleKeyPress(i)"
            v-for="i in [4, 5, 6]"
          >
            {{ i }}
          </div>
          <div
            v-ripple:primary
            class="text-h6 col q-ma-xs bg-white keyboard-button relative-position"
            @click="handleKeyPress('C')"
          >
            清空
          </div>
        </div>
        <div class="key-row row text-center items-center">
          <div class="col-9">
            <div class="row text-center items-center">
              <div
                v-ripple:primary
                class="col q-ma-xs bg-white keyboard-button relative-position"
                @click="handleKeyPress(i)"
                v-for="i in [7, 8, 9]"
              >
                {{ i }}
              </div>
            </div>
            <div class="key-row row text-center items-center">
              <div
                v-ripple:primary
                class=" col q-ma-xs bg-white keyboard-button relative-position"
                @click="handleKeyPress(0)"
              >
                0
              </div>
              <div
                v-ripple:primary
                v-show="decimal"
                class=" col q-ma-xs bg-white keyboard-button relative-position"
                @click="handleKeyPress('.')"
              >
                .
              </div>
            </div>
          </div>
          <div class="col-3">
            <div
              v-ripple:white
              class="key-confirm text-h6 q-ma-xs bg-blue text-white keyboard-button-confirm relative-position"
              @click="handleKeyPress('S')"
            >
              确认
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hl-keyboard',
  data () {
    return {
      dialogStatus: false,
      keyboardNumber: ''
    }
  },
  props: {
    inputNumber: {
      type: [String],
      default: ''
    },
    decimal: {
      type: [Boolean],
      default: false
    }
  },
  watch: {
    inputNumber (v) {
      this.keyboardNumber = v
    },
    keyboardNumber (v) {
      this.$emit('changeNumber', v)
    }
  },
  methods: {
    // 处理按键
    handleKeyPress (num) {
      // 不同按键处理逻辑
      // -1 代表无效按键，直接返回
      if (num == -1) return false
      switch (String(num)) {
        // 小数点
        case '.':
          this.handleDecimalPoint()
          break
        // 删除键
        case 'D':
          this.handleDeleteKey()
          break
        // 清空键
        case 'C':
          this.handleClearKey()
          break
        // 确认键
        case 'S':
          this.handleConfirmKey()
          break
        default:
          this.handleNumberKey(num)

          break
      }
    },
    // 处理小数点函数
    handleDecimalPoint () {
      // 如果包含小数点，直接返回
      if (this.keyboardNumber.indexOf('.') > -1) return false
      // 如果小数点是第一位，补0
      if (!this.keyboardNumber.length) this.keyboardNumber = '0.'
      // 如果不是，添加一个小数点
      else this.keyboardNumber = this.keyboardNumber + '.'
    },
    // 处理删除键
    handleDeleteKey () {
      const S = this.keyboardNumber

      // 如果没有输入，直接返回
      if (!S.length) return false
      // 否则删除最后一个
      this.keyboardNumber = S.substring(0, S.length - 1)
    },
    // 处理清空键
    handleClearKey () {
      this.keyboardNumber = ''
    },
    handleConfirmKey () {
      this.$emit('confirmEvent')
    },
    // 处理数字
    handleNumberKey (num) {
      const S = this.keyboardNumber
      // 如果有小数点且小数点位数不小于2
      // if (S.indexOf(".") > -1 && S.substring(S.indexOf(".") + 1).length < 2)
      //   this.keyboardNumber = S + num;
      // 没有小数点
      // if (!(S.indexOf(".") > -1)) {
      // 如果第一位是0，只能输入小数点
      // if (num == 0 && S.length == 0) this.keyboardNumber = "0.";
      // else {
      // if (S.length && Number(S.charAt(0)) === 0) return;
      this.keyboardNumber = S + num
      // }
      // }
    }
  }
}
</script>
<style scoped>
.keyboard-button {
  border-radius: 10px;
  height: 55px;
  line-height: 55px;
}
.keyboard-button-confirm {
  height: 110px;
  line-height: 110px;
  border-radius: 10px;
}
</style>
