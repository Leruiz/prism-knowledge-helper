<template>
  <div
    class="note-wrapper note-wrapper__notselected"
    :style="wrapperStyle"
  >
    <!-- website link -->
    <div  class="note-link">
      <span class="note-link-content">{{ link }}</span>
    </div>

    <!-- opers area -->
    <div class="note-opers" v-if="createTime">
      <!-- time -->
      <div class="note-time">{{ dayjs.unix(createTime).format("MM/DD HH:mm") }}</div>
    </div>
    <!-- more opers -->
    <div class="note-more-opers">
      <More direction="column" :size="2" :opers="moreOpers" />
    </div>
    <!-- note content -->
    <p class="note-content" v-if="content">{{ content }}</p>
    <!-- note editor -->
  </div>
</template>

<script lang="ts">
import { inject, ref, computed, nextTick, PropType } from "vue";
import randomcolor from "randomcolor";
import dayjs from "dayjs";
import { QuillEditor, Delta } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import { Tag } from "@/types/tag";
import { Coor, Oper } from "@/types/common";

import TagBook from "../tag-book/index.vue";
import More from "../shared/more.vue";

export default {
  components: {
    TagBook,
    QuillEditor,
    More,
  },
  props: {
    content:{ 
      type: Object as PropType<string>,
      default: "",
    },
    createTime: {
      type: Object as PropType<number>,
      default: 0,
    },
    link: {
      type: Object as PropType<string>,
      default: "",
    },
  },
  setup(props, ctx) {
    const wrapperStyle = ref({
      borderTop: `8px solid ${randomcolor({
        alpha: 0.5,
      })}`,
      width: `${450}px`,
      maxWidth: `${450}px`,
    });
   

    /// more opers
    const moreOpers = ref<Oper[]>([
      {
        title: "Delete",
        onClick: () => {
          ctx.emit("delete");
        },
        isConfirm: true,
      },
      {
        title: "Copy to clipboard",
        onClick: () => {
          
        }
      }
    ]);

    /// note tags
    const getNoteTagItemStyle = (tag: Tag) => {
      return {
        color: tag.color,
      };
    };
  




    return {
      dayjs,
      wrapperStyle,


      moreOpers,

      getNoteTagItemStyle,
      
    };
  },
};
</script>

<style lang="less" scoped>
.note-wrapper {
  padding: 10px 16px;
  background: white;
  box-shadow: 1px 2px 2px 1px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  border-radius: 6px 6px 8px 8px;
  position: relative;
  overflow: visible;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box !important;
  height: 100%;
  margin-left: 20px;

  .note-link {
    font-size: 12px;
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
    width: auto;
    color: #409eff;
  }
  .note-link-content {
    cursor: pointer;
  }

  .note-opers {
    font-size: 12px;
    color: #666;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;

    .note-tag-wrapper {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: auto;
      position: relative;
      font-size: 14px;

      .note-tag-adder {
        cursor: pointer;
        user-select: none;
      }
      .note-tag-item {
        margin: 2px 10px 2px 0;
        cursor: pointer;
      }
    }
    .note-time {
      width: 100px;
      min-width: 100px;
      user-select: none;
    }
  }

  .note-content {
    margin: 10px 0;
    font-size: 14px;
    font-weight: 400;
    white-space: pre-wrap;
  }

  .note-editor {
    background-color: #eee;
  }
  .note-editor__readonly {
    > :first-child {
      display: none;
    }
    > :nth-child(2) {
      border-top: solid 1px #d1d5db;
      border-radius: 5px;
    }
  }
  .note-editor__edit {
    > :first-child {
      display: flex;
    }
    > :nth-child(2) {
      border-top: none;
    }
  }
}
.note-wrapper__notselected {
  opacity: 0.5;
}
.note-more-opers {
  position: absolute;
  top: 0px;
  right: 10px;
  cursor: pointer;
  padding: 5px;
}
.note-link-opers {
  padding: 5px 0px;
  cursor: pointer;
}
.note-link-oper {
  margin-right: 10px;
  color: #0077cc;
  &:hover {
    color: #0095ff;
  }
}
</style>
