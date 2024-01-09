<template>
  <div class="current-page-notes">
    <PageTitle className="current-page-notes__tag"/>

    <div v-if="isEmpty" class="empty-container">Try to add note...</div>
    <TagList :tags="tags" disableEdit className="current-page-notes__tag"/>
    <NoteCard v-for="pageNt in pageNotes" :key="pageNt.id" :content="pageNt.content" :createTime="pageNt.updatedTime" hint="Page Note" :link="pageNt.url"/>
    <NoteList :expanded="expanded" :isLimitedCurrentPage="true"></NoteList>
    <TagBook
      v-show="!!curNoteId"
      :noteId="curNoteId"
      :coor="tagBookCoor"
      @close="handleCloseTagBook"
    ></TagBook>
</div>
</template>

<script lang="ts">
import { ref,inject, computed } from "vue";
import mitt from "@/utils/mitt";
import { Coor } from "@/types/common";
import TagBook from "../tag-book/index.vue";
import NoteList from "./note-list.vue";
import PageTitle from "../../../components/page-title/index.vue"
import TagList from "../../../components/tag-list/index.vue"
import { Storage } from "../../../../types/storage";
import NoteCard from "../note-book/note-card.vue"

export default {
  components: {
    NoteList,
    TagBook,
    PageTitle,
    TagList,
    NoteCard
  },
  props: {
    expanded: {
      type: Boolean,
      default: false
    },
  },
  setup() {
    const storage: Storage = inject("storage",{
        pages: [],
        newTags: [],
        pageNotes: [],
        notes: [],
      });

      const pageNotes = computed(() => {
        return (storage.pageNotes || []).filter((note) => note.url === window.location.href);
      });

      const notes = computed(() => {
        return (storage.notes || []).filter((note) => note.rawLink === window.location.href);
      });
      const currentPage = computed(() => {
        console.log("storage.pages",storage.pages);
        return (storage.pages || []).find((page) => page.url === window.location.href);
      });

      const tags = ref((() => {
        console.log("storage.tags",storage.tags );

        if(!currentPage.value) return [];

        const page = currentPage.value;
        const tagIds = page?.tagIds;
        return (storage.newTags || []).filter((tag) => tagIds?.includes(tag.id));
      })());

      const isEmpty = computed(() => {
        return !notes.value.length && !pageNotes.value.length && !currentPage.value;
      });

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
      tags,
      pageNotes,
      isEmpty
    };
  },
};
</script>

<style scoped lang="less">
.current-page-notes {
  background-color: #fafafa;
}

.current-page-notes__tag {
  padding: 0 20px;
}

.empty-container {
  width: 100%;
  font-size: 20px;
  line-height: 48px;
  text-align: center;
  color: #666;
  font-weight: 600;
}
</style>
