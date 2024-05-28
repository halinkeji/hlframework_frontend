<template>
  <div>
    <q-btn
      icon="las la-trash-alt"
      color="red"
      outlined
      size="sm"
      dense

      flat
      round
      @click="deleteData()"
    ></q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgOperating',
  methods: {
    deleteData () {
      const obj = {
        buff_id: this.params.data.id
      }

      this.params.context.delCarData(obj)
    }
  }
}
</script>
