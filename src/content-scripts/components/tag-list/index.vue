
<template>
  <div class="tag-list-container" :class="className">
    <el-tag
  :key="tag.id"
  v-for="tag in tags"
  closable
  :disable-transitions="false"
  @close="handleClose(tag)">
  {{tag.label}}
</el-tag>
<el-input
  class="input-new-tag"
  v-if="inputVisible"
  v-model="inputValue"
  ref="saveTagInputRef"
  size="mini"
  @keyup.enter.native="handleInputConfirm"
  @blur="handleInputConfirm"
>
</el-input>
<el-button v-if="(!disableEdit) && (!inputVisible)" class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

  </div>

</template> 

<script lang="ts">
import { TagV2 } from "../../../types/tag";
import { PropType, ref } from "vue";
import { v4 as uuid } from "uuid";

  export default {
    props: {
        tags: {
            type: Object as PropType<TagV2[]>,
            default: []
        },
        onTagsChange: {
            type: Function as PropType<(tags: TagV2[]) => void>,
            default: () => {}
        },
        disableEdit: {
            type: Boolean,
            default: false
        },
        className: {
            type: String,
            default: ""
        }
    },
    setup(props, ctx) {
        const inputVisible = ref(false);
        const inputValue = ref("");

        const saveTagInputRef = ref<HTMLElement | null>(null);

        const handleClose = (tag: TagV2) => {
            const updatedTags = props.tags.filter((t) => t.id !== tag.id);

            props?.onTagsChange?.(updatedTags);
        };

        const showInput = () => {
            inputVisible.value = true;
            setTimeout(() => {
              saveTagInputRef?.value?.focus?.();
            }, 0);
            
        };

     const handleInputConfirm = () => {
        if (inputValue.value) {
            const newTag: TagV2 = {
                id: uuid(),
                label: inputValue.value,
                createTime: Date.now(),
            };
            props?.onTagsChange?.([...props.tags, newTag]);
        }

        inputVisible.value = false;
        inputValue.value = "";
      }

      return {
        inputVisible,
        inputValue,
        saveTagInputRef,
        handleClose,
        showInput,
        handleInputConfirm,
      };
      }    
  }
</script>
<style>
.tag-list-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.el-tag {
  margin-top: 8px;
}
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    margin-top:8px;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
    margin-top:8px;
  }
</style>
