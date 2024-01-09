<template>
  <div class="page-note-container" :style="wrapperStyle">
    <CommonHeader :handleClose="handleClose"/>

    <div class="page-note-body">
      <div class="page-note-title">
        <el-icon :size="20"><Link /></el-icon>
        <div class="page-note-title__text">{{ pageTitle }}</div>
      </div>
      <el-input class="page-note-hint" v-model="note" placeholder="Add note ..." type="textarea" rows="3"/>
    </div>

    <div class="page-note-footer">
      <el-checkbox style="font-size: 12px;color: #666;"
          v-model="sentToPrism"
          >Post to Prism</el-checkbox
      >
      <el-button type="primary" @click="onSave" size="small" style="margin-left: 12px;">
        Save Note
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, inject, mergeProps } from "vue";
import {  AppWidth } from "@/utils/constant";
import CommonHeader from "../../components/common-header/index.vue";
import { Link } from "@element-plus/icons";
import TagList from "../../components/tag-list/index.vue";
import { TagV2 } from "../../../types/tag"
import { Storage } from "../../../types/storage"
import { SavedPage , PageNote} from "../../../types/common"
import { v4 as uuid } from "uuid";
import { StorageKeys } from "@/utils/constant";
import { _get, _set } from "../../../utils/storage";

export default {
  components: {
    CommonHeader,
    Link,
    TagList,
  },
  props: {
    handleClose: {
      type: Function,
      default: () => {}
    },
  },
  setup(props) {
    const storage: Storage = inject("storage",{
        pages: [],
        newTags: [],
        pageNotes: []
      });

      const note = ref("");
      const pageTitle = ref(document.title);
      const sentToPrism = ref(false)
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

      const onSave = async () => {
        if(!note.value) {
          return;
        }

        const oldNotes  = await _get(StorageKeys.pageNotes) as PageNote[];
        const newNote: PageNote = {
          id: uuid(),
          url: window.location.href,
          content: note.value,
          createdTime: Date.now(),
          updatedTime: Date.now(),
        }
        await _set(StorageKeys.pageNotes, (oldNotes || []).concat(newNote));
        storage.pageNotes = (oldNotes || []).concat(newNote);

        props.handleClose();
      }

      return {
          wrapperStyle,
          pageTitle,
          sentToPrism,
          note,
          onSave
      }
  }
}
</script>

<style lang="less" scoped>
.page-note-container {
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

.page-note-body {
  width: 100%;
  height: calc(100% - 48px - 48px);
  padding: 20px;
  background-color: #fafafa;
}

.page-note-hint {
  width: 100%;
  margin-bottom: 12px;

  & :deep(.el-input__inner[type="text"]) {
    border: none;
    box-shadow: none;
    height: 24px;
    padding: 4px;
    margin: 0;
    color: #666;
    background: transparent;
  }
}

.page-note-title {
  width: 100%;
  display: flex;
  align-items: center;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  cursor: pointer;
}

.page-note-title__text {
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-note-footer {
  display: flex;
  width: 100%;
  height: 48px;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;

  border-top: solid 1px #ebebeb;

}
</style>