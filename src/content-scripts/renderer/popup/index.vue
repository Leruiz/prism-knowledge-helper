<template>
  <div class="popup-wrapper" :style="wrapperStyle">
    <CommonHeader :handleClose="handleClose"/>

      <el-tabs v-model="activeTab" :style="tabStyle" class="tab-container">
        <el-tab-pane label="Current Page" :name="tabTypes.notes">
          <CurrentPageNotes :expanded="appExpanded"  />
        </el-tab-pane>
        <el-tab-pane label="All Memories" :name="tabTypes.tags">
          <AllNoteBool :expanded="appExpanded"/>
        </el-tab-pane>
      </el-tabs>
      
      <Footer :width="appWidth" />
    </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref, reactive, computed } from "vue";
import { Close } from "@element-plus/icons";
import Footer from "./footer/index.vue";
import { Note } from "@/types/note";
import AllNoteBool from "./note-book/all-notes.vue"
import { Tag } from "@/types/tag";
import { Storage } from "@/types/storage";
import { get } from "@/utils/storage";
import mitt from "@/utils/mitt";
import { StorageKeys, AppWidth } from "@/utils/constant";
import CommonHeader from "../../components/common-header/index.vue";
import CurrentPageNotes from "./current-page-notes/index.vue";
enum TabType {
    notes = "notes",
    tags = "tags",
}
export default {
  components: {
    Close,
    CurrentPageNotes,
    Footer,
    AllNoteBool,
    CommonHeader
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
    const appExpanded = ref(false);

    /** Tabs */
    const activeTab = ref(TabType.notes);
    const tabTypes = ref(TabType);
    const tabStyle = computed(() => ({
            width: `${appWidth.value}px`,
            "min-width": `${appWidth.value}px`,
            transition: "0.5s",
        }));

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
      activeTab,
      tabTypes,
      tabStyle,

      appExpanded,
      appWidth,
      wrapperStyle,
    };
  },
}
</script>

<style lang="less" scoped>
.popup-wrapper {
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

  .popup-close {
    position: fixed;
    right: 10px;
    top: 14px;
    cursor: pointer;
    color: #4B5966;
  }

  .tab-container :deep(.el-tabs__item) {
    color: #333;
    font-weight: 400;
    padding-left: 20px;

    &:hover {
      color: #333;
    }
  }

  .tab-container :deep(.el-tabs__item.is-active) {
    color: #333;
    font-weight: 600;

    &:hover {
      color: #333;
    }
  }

  .tab-container :deep(.el-tabs__active-bar) {
    background-color: #333;
  }
}
</style>
