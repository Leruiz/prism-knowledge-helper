<template>
  <ActionBar :noteId="curNoteId"/>

  <NoteList :expanded="expanded" :isLimitedCurrentPage="true"></NoteList>
  <TagBook
    v-show="!!curNoteId"
    :noteId="curNoteId"
    :coor="tagBookCoor"
    @close="handleCloseTagBook"
  ></TagBook>
</template>

<script lang="ts">
import { ref } from "vue";
import mitt from "@/utils/mitt";
import { Coor } from "@/types/common";
import TagBook from "../tag-book/index.vue";
import NoteList from "./note-list.vue";
import ActionBar from "./action-bar.vue"

export default {
  components: {
    NoteList,
    TagBook,
    ActionBar
  },
  props: {
    expanded: {
      type: Boolean,
      default: false
    },
  },
  setup() {
    const tagBookCoor = ref<Coor>({ x: 0, y: 0 });
    const curNoteId = ref("");

    mitt.on("open-tag-book", ({ noteId, coor }: any) => {
      if (coor) {
        // `setTimeout` to let `handleCloseTagBook` trigger first.
        setTimeout(() => {
          tagBookCoor.value = coor as Coor;
          curNoteId.value = noteId;
        });
      }
    });
    const handleCloseTagBook = () => {
      curNoteId.value = "";
    };

    return {
      tagBookCoor,
      curNoteId,
      handleCloseTagBook,
    };
  },
};
</script>

<style scoped lang="less">
@primary-color: rgba(64, 88, 255, 1);

.note-save-page-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  color: @primary-color;
  height: 24px;
  padding-left: 20px;
}

.note-save-page-button__text {
  font-size: 14;
  font-weight: 500;
  margin-left: 4px;
}

.note-save-page-button__icon {
  color: @primary-color;
}
</style>
