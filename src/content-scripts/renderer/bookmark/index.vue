<template>
  <div class="bookmark-container" :style="wrapperStyle">
    <CommonHeader :handleClose="handleClose"/>

    <div class="bookmark-body">
      <PageTitle/>
      <!-- <el-input class="bookmark-hint" v-model="desc" placeholder="Add description ..."/> -->
      <TagList :tags="tags" :onTagsChange="onTagsChange" />
    </div>

    <div class="bookmark-footer">
      <el-checkbox style="font-size: 12px;color: #666;"
          v-model="sentToPrism"
          >Post to Prism</el-checkbox
      >
      <el-button type="primary" @click="onSave" size="small" style="margin-left: 12px;">
        Save Page
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
import { SavedPage } from "../../../types/common"
import { v4 as uuid } from "uuid";
import { addItemToArr } from "@/utils/storage";
import { StorageKeys } from "@/utils/constant";
import { _get, _set } from "../../../utils/storage";
import PageTitle from "../../components/page-title/index.vue";

export default {
  components: {
    CommonHeader,
    Link,
    TagList,
    PageTitle
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
        newTags: []
      });

      const currentPage = computed(() => {
        return (storage.pages || []).find((page) => page.url === window.location.href);
      });

      const appWidth = ref<AppWidth>(AppWidth.normal);
      const sentToPrism = ref(false)

      const pageTitle = ref(currentPage?.value?.title || document.title);
      const pageUrl = ref(currentPage?.value?.url || window.location.href);
      const desc = ref(currentPage?.value?.desc || "");
      
      const tags = ref((() => {
        if(!currentPage.value) return [];

        const page = currentPage.value;
        const tagIds = page?.tagIds;
        return (storage.newTags || []).filter((tag) => tagIds?.includes(tag.id));
      })());

      const onTagsChange = (newTags: TagV2[]) => {
          tags.value = newTags;
      };

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
        const pageItem: SavedPage = {
          url: pageUrl.value,
          title: pageTitle.value,
          desc: desc.value,
          tagIds: tags.value.map((tag) => tag.id),
          createdTime: currentPage.value?.createdTime || Date.now(),
          updatedTime: Date.now(),
        }

        const oldSavedPages = await _get(StorageKeys.pages) as SavedPage[];
        const newSavedPages = (oldSavedPages || []).filter((page) => page.url !== pageUrl.value);
        newSavedPages.push(pageItem);
        await _set(StorageKeys.pages, newSavedPages);

        const oldTags = (await _get(StorageKeys.newTags)  || [])as TagV2[];
        const newAddedTags = tags.value.filter((tag) => !oldTags.find((oldTag) => oldTag.id === tag.id));
        const newTags = oldTags.concat(newAddedTags);
        await _set(StorageKeys.newTags, newTags);

        storage.pages = newSavedPages;
        storage.newTags = newTags;

        props.handleClose();
      }


      return {
          wrapperStyle,
          pageTitle,
          pageUrl,
          desc,
          tags,
          sentToPrism,
          onTagsChange,
          onSave
      }
  }
}
</script>

<style lang="less" scoped>
.bookmark-container {
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

.bookmark-body {
  width: 100%;
  height: calc(100% - 48px - 48px);
  padding: 20px;
  background-color: #fafafa;
}

.bookmark-hint {
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

.bookmark-title {
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

.bookmark-title__text {
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bookmark-footer {
  display: flex;
  width: 100%;
  height: 48px;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;

  border-top: solid 1px #ebebeb;

}
</style>