<template>
  <div class="">

    <q-input outlined bottom-slots v-model="sendValue" label="发送数据" counter clearable>
      <template v-slot:append>
        <q-btn @click="sendMessage" flat dense round icon="send" />
      </template>
    </q-input>

    <q-btn @click="closeSocket"  color="primary" label="关闭连接" />

    <q-btn @click="connectSocket"  color="primary" label="手动连接" />
  </div>
</template>

<script>
export default {
  name: 'web-sorket',
  data () {
    return {
      sendValue: ''
    }
  },
  mounted () {},
  created () {},
  watch: {
    wsValue (n, o) {
      console.log(n)
    }
  },
  computed: {
    wsValue () {
      return this.$store.state.websorket.msg
    }
  },
  methods: {
    sendMessage () {
      this.$store.dispatch('websorket/sendMessage', {
        value: this.sendValue
      })
    },

    getMessage () {
      this.$store.dispatch('websorket/getMessage', {
        value: this.sendValue
      })
    },

    closeSocket () {
      this.$store.dispatch('websorket/close', {
        value: this.sendValue
      })
    },

    connectSocket () {
      this.$store.dispatch('websorket/connect', {
        value: this.sendValue
      })
    }

  }
}
</script>

<style scoped>
.q-form,
.q-img {
  position: static;
}
</style>
