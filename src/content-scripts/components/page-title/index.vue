<template>
<div class="bookmark-title" :class="className">
    <el-icon :size="20"><Link /></el-icon>
    <div class="bookmark-title__text">{{ pageTitle }}</div>
</div>
  </template>
  
  <script lang="ts">
  import { ref,  } from "vue";
  import { Link } from "@element-plus/icons";
  export default {
    components: {
      Link,
    },
    props:{
        className: {
            type: String,
            default: ""
        }
    },
    setup(props) {
        const pageTitle = ref(document.title);
        return {
            pageTitle
        }
    }
  }
  </script>
  
  <style lang="less" scoped>
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
  </style>