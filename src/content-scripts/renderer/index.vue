<template>
  <div v-show="visible" v-clickoutside="handleClickOutside">
    <NoteBookPage
      v-if="type === 'noteBookPage'"
     :handleClickOutside="handleClickOutside" 
     :handleClose="handleClose"/>
    <Bookmark
      v-if="type === 'bookmark'"
      :handleClickOutside="handleClickOutside" 
      :handleClose="handleClose"/>
    <PageNotePopup v-if="type === 'pageNote'"
    :handleClickOutside="handleClickOutside" 
      :handleClose="handleClose"/>
    <HighlightNotePopup v-if="type === 'highlightNote'"
    :handleClickOutside="handleClickOutside" 
      :handleClose="handleClose"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref, reactive, computed } from "vue";
import { Note } from "@/types/note";
import { Tag, TagV2 } from "@/types/tag";
import { Storage } from "@/types/storage";
import { get } from "@/utils/storage";
import mitt from "@/utils/mitt";
import { StorageKeys,  } from "@/utils/constant";
import Bookmark from "./bookmark/index.vue"
import NoteBookPage from "./popup/index.vue"
import { SavedPage ,PageNote} from "@/types/common";
import PageNotePopup from "./page-note/index.vue";
import HighlightNotePopup from "./highlight-note/index.vue";

export default defineComponent({
  components: {
    NoteBookPage,
    Bookmark,
    PageNotePopup,
    HighlightNotePopup
  },
  setup() {

    const type = ref<"bookmark" | "noteBookPage" | "pageNote" | "highlightNote">("noteBookPage");


    const visible = ref(false);
    const handleClickOutside = () => {
      console.log("handleClickOutside");
      visible.value = false;
    };
    const handleClose = () => {
       visible.value = false;
    }

    // global reading `notes` and `tags` from storage and provide to sub components.
    const storage = reactive<Storage>({
      [StorageKeys.notes]: [],
      [StorageKeys.tags]: [],
      [StorageKeys.collectedPages]: [],
      [StorageKeys.pages]: [],
      [StorageKeys.newTags]: [],
      [StorageKeys.pageNotes]: []
    });

    const updateStorage = () => {
      get(StorageKeys.notes).then((res) => {
        storage.notes = (res as Note[]) || [];
      });
      get(StorageKeys.tags).then((res) => {
        storage.tags = (res as Tag[]) || [];
      });
      get(StorageKeys.collectedPages).then((res) => {
        storage.collectedPages = (res as string[]) || [];
      });
      get(StorageKeys.pages).then((res) => {
        storage.pages = (res as SavedPage[]) || [];
      });
      get(StorageKeys.newTags).then((res) => {
        storage.newTags = (res as TagV2[]) || [];
      });
      get(StorageKeys.pageNotes).then((res) => {
        storage.pageNotes = (res as PageNote[]) || [];
      });
    };
    updateStorage();
    mitt.on("update-storage", () => {
      updateStorage();
    });

    provide("storage", storage);

    return {
      type,
      visible,
      handleClickOutside,
      handleClose,
    };
  },
});
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
