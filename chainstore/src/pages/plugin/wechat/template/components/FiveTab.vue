<template>
  <div>
      <div class="q-pa-sm">
      <div class="bg-green-1 q-pa-md text-green" style="border-radius:5px">
        <div class="q-my-sm">
          进程设置默认为 3 ，设置后最高只能这么多进程。
        </div>
        <div class=" q-my-sm">
          进程参考说明：2G4核推荐多进程数量为5，最高cpu达到80%(发送消息的时候，肯定是有粉丝互动的，并发数上升造成的压力，大多数时间在40%-60%之间波动，发送数量9.3k+，发送时间大概在19分钟的样子
        </div>
      </div>
      <div class="row items-center q-mt-md">
        <div class="col-3"></div>
        <div class="col-md-1 col-12">
          最高多进程数
        </div>
        <div class="col-md-5 col-12">
          <q-input
            outlined
            bottom-slots
            v-model="nameText"
            dense
            class="q-pb-none"
          >
          </q-input>
        </div>
        <div class="col-3"></div>
      </div>
      <div class="row q-mt-md text-center">
        <div class="col q-gutter-md">
          <q-btn unelevated color="primary" label="确定" class="q-px-lg" />
        </div>
      </div>
      </div>
  </div>
</template>

<script>
export default {
name: "FiveTab",
	data() {
        return {
nameText:"",
        };
    },
	mounted() {},
    created() {},
    computed: {},
    methods: {},
}
</script>

<style>

</style>