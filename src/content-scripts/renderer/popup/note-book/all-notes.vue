<template>
  <div class="all-notes-filters">
    <el-input placeholder="Search" class="all-notes-filters__search"></el-input>
    <div class="all-notes-filters__item">Saved Pages</div>
    <div class="all-notes-filters__item">Notes</div>
    <div class="all-notes-filters__item">Tags</div>
  </div>
  <NoteCard v-for="savedPage in savedPages" :key="savedPage.url" :content="savedPage.title" :createTime="savedPage.updatedTime" hint="Saved Page"/>
  <NoteCard v-for="pageNt in pageNotes" :key="pageNt.id" :content="pageNt.content" :createTime="pageNt.updatedTime" hint="Page Note" :link="pageNt.url"/>

  <NoteList :expanded="expanded"></NoteList>
  <TagBook
    v-show="!!curNoteId"
    :noteId="curNoteId"
    :coor="tagBookCoor"
    @close="handleCloseTagBook"
  ></TagBook>
</template>

<script lang="ts">
import { ref, inject, computed } from "vue";
import mitt from "@/utils/mitt";
import { Coor } from "@/types/common";
import TagBook from "../tag-book/index.vue";
import NoteList from "./note-list.vue";
import NoteCard from "./note-card.vue"
import { PREFIX_Page_TAG, PREFIX_Page_COMMENT } from "@/utils/constant";
import { Note as TNote } from "@/types/note";
import SimpleNote from "./simple-note.vue"
import { Storage } from "../../../../types/storage";

export default {
  components: {
    NoteList,
    TagBook,
    NoteCard,
    SimpleNote
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

    const storage: Storage = inject("storage", {
      pages: [],
      pageNotes: [],

            notes: [],
            tags: [],
        });

      const tags = computed(() => storage.tags);
      const notes = computed(() => storage.notes); 
      const collectedPages = computed(() => storage.collectedPages);

      const savedPages = computed(() => {
        return (storage.pages || []);
      });

      const pageNotes = computed(() => {
        return (storage.pageNotes || []).filter((note) => note.url === window.location.href);
      });

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
      pageNotes,
      collectedPages,
      savedPages,
      notes,
      tags
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


.all-notes-filters {
  display: flex;
  flex-direction: row;
  padding: 0 20px;
  justify-content: flex-start;
  align-items: center;
}

.all-notes-filters__search {
  height: 24px;
  flex:1;

  & :deep(.el-input__inner) {
    height: 24px;
    line-height: 24px;
    display: block;
  }
}

.all-notes-filters__item {
  font-size: 12px;
  font-weight: 500;
  height: 24px;
  width: max-content;
  padding: 0 6px;
  line-height: 24px;
  border: solid 1px rgba(59,130,246,.5);
  border-radius: 12px;
  color: #999;
  margin-left: 12px;
}

.all-notes-filters__item.active {
  color: #fff;
  background: rgba(59,130,246,.5);
  border: solid 1px rgba(59,130,246,.5);
}
</style>
