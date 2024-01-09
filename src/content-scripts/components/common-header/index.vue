<template>
    <div class="common-header">
        Prism Knowledge Helper
        <el-icon :size="18" class="common-header__close" @click="handleClose"><Close class="common-header__closeIcon"/></el-icon>
    </div>
</template>

<script lang="ts">
import { Close } from "@element-plus/icons";

export default {
    components: {
        Close
    },
    props: {
        handleClose: {
            type: Function,
            default: () => {}
        },
    },
    setup(props, ctx) {
        
    }
}
</script>

<style lang="less" scoped>
.common-header {
    width: 100%;
    height: 48px;
    position: relative;
    background: #fff;
    font-size: 16px;
    color: #333;
    line-height: 48px;
    border-bottom: 1px solid #ebeef5;
    text-align: center;
    font-weight: 600;
}

.common-header__close {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

.common-header__closeIcon {
    color: #666;
}
</style>