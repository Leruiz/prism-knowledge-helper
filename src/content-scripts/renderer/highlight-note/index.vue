<template>
  <div class="highlight-note-container" :style="wrapperStyle">
    <CommonHeader :handleClose="handleClose"/>

    <div class="highlight-note-body">
      <PageTitle className="highlight-note__title"/>
      <NoteBook :expanded="false" v-clickoutside="handleClickOutside" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref, reactive, computed } from "vue";
import NoteBook from "./note-book/index.vue";
import {  AppWidth } from "@/utils/constant";
import CommonHeader from "../../components/common-header/index.vue";
import PageTitle from "../../components/page-title/index.vue";
export default {
  components: {
    NoteBook,
    CommonHeader,
    PageTitle
  },
  props: {
    handleClose: {
      type: Function,
      default: () => {}
    },
    handleClickOutside: {
      type: Function,
      default: () => {}
    }
  },
  setup() {
    const appWidth = ref<AppWidth>(AppWidth.normal);
    const wrapperStyle = computed(() => {
      const maxWidth = window.innerWidth * 0.9;
      const width = appWidth.value > maxWidth ? maxWidth : appWidth.value;
      return {
        width: `${width}px`,
        "min-width": `${width}px`,
        transition: "0.5s",
      };
    });
   
    return {
      wrapperStyle,
    };
  },
}
</script>

<style lang="less" scoped>
.highlight-note-container {
  position: fixed;
  right: 0px;
  top: 1vh;
  width: 500px;
  min-width: 500px;
  height: 98vh;
  overflow-y: scroll;
  background: rgb(255, 255, 255) !important;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 20px !important;
  opacity: 1;
  border-radius: 10px;
  z-index: 9999;
  max-height: 630px;
}

.highlight-note-body {
  width: 100%;
  height: calc(100% - 48px);
  padding: 20px 0;
  background-color: #fafafa;
}

.highlight-note__title {
  padding: 0 20px;
}
</style>
