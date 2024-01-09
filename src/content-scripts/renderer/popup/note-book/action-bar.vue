<template>
      <div class="action-bar" style="margin-bottom: 20px;">
        <div class="action-button" @click="onCollect">
            <el-icon :size="24" v-if="isCollected"><StarFilled class="action-button__star-filled"/></el-icon>
            <el-icon :size="24" v-else><Star /></el-icon>
        </div>
        <div v-if="isCollected">Collected</div>
        <div v-else>Collect</div>
        </div>
        <div class="action-bar action-bar__add-tag" @click="handleOpenTagBook" ref="tagTrigger">
        <div class="action-button action-button__tag">
            #
        </div>
        <div
          v-for="tag in tags || []"
          :key="tag.id"
          class="note-tag-item"
          :style="getNoteTagItemStyle(tag)"
        >
        {{ tag.name}}
        </div>
        <div>
            + Add tag..
        </div>
    </div>

    <div class="action-bar" style="margin-bottom: 20px; align-items: flex-start;">
        <div class="action-button">
            <el-icon :size="20"><ChatRound /></el-icon>
        </div>
        <div class="note-input">
            <el-input
                placeholder="Please take notes here.."
                type="textarea"
                :rows="2"
                v-model="commentContent"
                class="action-comment-input"
            />
        <div class="note-input__action">
            <el-checkbox style="font-size: 12px;color: #666;"
                v-model="sentToPrism"
                >Post to Prism</el-checkbox
            >
            <el-button type="primary" @click="onSubmitComment" size="small" style="margin-left: 12px;">
                Save
                </el-button>

        </div>
        </div>
        
        
    </div>
    <div v-for="comment in comments" :key="comment.id">
        <SimpleNote
          :note="comment"
          :curNoteId="comment.id"
        />
        </div>

</template>

<script lang="ts">
import {Star, ChatRound, StarFilled, Promotion } from "@element-plus/icons";
import { ref, watch, PropType, mergeProps, computed, onMounted, inject } from "vue";
import mitt from "@/utils/mitt";
import { Coor, Oper } from "@/types/common";
import { generatePageTagId, generatePageCommentId } from "@/content-scripts/renderer/dom/rect"
import { Tag } from "@/types/tag";
import { PREFIX_Page_TAG, PREFIX_Page_COMMENT } from "@/utils/constant";
import dayjs from "dayjs";
import { Rect } from "@/types/common";
import { Storage } from "@/types/storage";
import { Note as TNote } from "@/types/note";
import {
  addItemToArr,
  updateArrItemProperty,
  addItemToArrProperty,
  delItemFromArrProperty,
  delItemFromArr,
} from "@/utils/storage";
import { StorageKeys } from "@/utils/constant";
import { filterArrBySearchText } from "@/utils/text";
import { removeUrlPostfix } from "@/utils/utils";
import SimpleNote from "./simple-note.vue"

export default {
    components: {
        Star,
        ChatRound,
        StarFilled,
        Promotion,
        SimpleNote
    },
    props: {
        noteId: {
            type: Object as PropType<string>,
            required: true,
        },
    },
    setup(props) {
        const storage: Storage = inject("storage", {
            notes: [],
            tags: [],
            collectedPages: []
        });

        const sentToPrism = ref(false);
        

        const isCollected = computed(() => {
            return (storage.collectedPages || []).includes(window.location.href)
        })
        const onCollect = async () => {
            if(isCollected.value) {
                storage.collectedPages = await delItemFromArr(StorageKeys.collectedPages, window.location.href);
            } else {
                storage.collectedPages = await addItemToArr(StorageKeys.collectedPages, window.location.href);
            }

            
        }

        const getNoteTagItemStyle = (tag: Tag) => {
            return {
                background: tag.color
            };
            };
        const tags = computed(() => {
            return storage.tags.filter((tag: Tag) => tag.noteIds.filter(nid => nid.startsWith(PREFIX_Page_TAG) && nid.endsWith(window.location.href))?.length)
        });

        const comments = computed(() => {
            return storage.notes.filter((note: TNote) => note.id.startsWith(PREFIX_Page_COMMENT) && note.rawLink === window.location.href).sort((a, b) => b.createTime - a.createTime)
        })


        const commentContent = ref<string>('');
        const submitCommentBtnShown = computed(() => {
            return !!commentContent.value;
        })

      

        const onSubmitComment = async () => {

            const noteId = generatePageCommentId()

            // 1. create the note item
            const href = window.location.href;
            const note: TNote = {
                id: noteId,
                createTime: dayjs().unix(),
                updateTime: dayjs().unix(),
                link: removeUrlPostfix(href),
                rawLink: href,
                linkTitle: window.document.title ?? '',
                content: commentContent.value,
                rects: { x: 0, y: 0, width: 0, height: 0},
                tags: [],
                isPageComment: true
            };
            storage.notes = await addItemToArr(StorageKeys.notes, note);
            commentContent.value = '';

        }

        const tagTrigger = ref<HTMLElement| null>(null)
        // open tag book
        const handleOpenTagBook = () => {
            if(tagTrigger.value) {
                const rect = tagTrigger?.value?.getBoundingClientRect();
                if (rect) {
                mitt.emit("open-tag-book", {
                    noteId: generatePageTagId() + window.location.href,
                    coor: {
                    x: rect.left,
                    y: rect.top,
                    } as Coor,
                });
             }
            }
        };

        return {
            sentToPrism,

            isCollected,
            onCollect,
            tagTrigger,
            tags,
            getNoteTagItemStyle,

            comments,
            commentContent,
            submitCommentBtnShown,
            onSubmitComment,
            handleOpenTagBook
        }
    }
}

</script>

<style lang="less" scoped>
.action-bar {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 20px;
}

.action-button {
    width: 20px;
    height: 20px;
    margin-right: 20px;
    cursor: pointer;
    display: block;
}
.action-comment-input {
    margin-right: 20px;
    flex: 1,
    
}

.action-button__star-filled {
    color: #FFC107;
}

.action-button__tag {
    font-size: 20px;
    line-height: 20px;
}

.action-bar__add-tag {
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 500;

    .note-tag-item {
        margin: 2px 10px 2px 0;
        color: #fff;
        height: 20px;
        width: max-content;
        padding: 0 4px;
        color: white;
        line-height: 20px;
        border-radius: 4px;
        opacity: 0.8;
      }
}

.note-input {
    display: block;
    flex: 1;
}
.note-input__action {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;

    & :deep(.el-button--small) {
        height: 32px;
        border-radius: 16px;
    }
}
</style>