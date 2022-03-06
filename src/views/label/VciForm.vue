<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
    :close-on-click-modal="false"
    :before-close="closeFormModal"
  >
    <el-form ref="refForm" label-width="150px" :inline="false" :model="subForm" :rules="formRulesMixin" class="pr-5">
      <el-form-item label="标签名称" prop="sn" :rules="formRulesMixin.isNotNull" label-position="left">
        <el-input v-model="subForm.labelName" class="widthPx-300" placeholder="标签名称" />
      </el-form-item>
      <el-form-item label="标签规则" prop="hardVersion" :rules="formRulesMixin.isNotNull" label-position="left">
        <el-input v-model="subForm.rules" class="widthPx-300" placeholder="标签规则: 使用 | (英文分隔)" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeFormModal">取 消</el-button>
        <el-button type="primary" @click="confirmBtnClick">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
/*1.初始化引入和实例化*/
// import { useCommon } from '@/hooks/global/useCommon'
import { getCurrentInstance, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
let { proxy } = getCurrentInstance()

const emit = defineEmits(['selectPageReq', 'hideComp'])

/*2.modal新增和修改*/
//新增
const refForm = ref(null)
let subForm = reactive({
  id: '',
  labelName: '',
  rules: ''
})
let confirmBtnClick = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      if (subForm.id) {
        updateReq()
      } else {
        insertReq()
      }
    } else {
      return false
    }
  })
}
const insertReq = () => {
  const data = JSON.parse(JSON.stringify(subForm))
  delete data.id
  proxy
    .$axiosReq({
      url: '/integration-front/vci/insert',
      data: data,
      method: 'post',
      bfLoading: true
    })
    .then((res) => {
      ElMessage({ message: '保存成功', type: 'success' })
      emit('selectPageReq')
      emit('hideComp')
    })
}
//修改
const reshowData = (row) => {
  Object.keys(row).forEach((fItem) => {
    Object.keys(subForm).forEach((sItem) => {
      if (fItem === sItem) {
        subForm[sItem] = row[sItem]
      }
    })
  })
}
let updateReq = () => {
  proxy
    .$axiosReq({
      url: '/integration-front/vci/updateById',
      data: subForm,
      method: 'put',
      bfLoading: true
    })
    .then(() => {
      ElMessage({ message: '更新成功', type: 'success' })
      emit('selectPageReq')
      emit('hideComp')
    })
}

/*3.弹框相关*/
const dialogTitle = ref(null),
  dialogVisible = ref(null)
let showModal = (isEdit, detailData) => {
  if (isEdit) {
    dialogTitle.value = `编辑【${detailData.labelName}】`
    dialogVisible.value = true
    reshowData(detailData)
  } else {
    dialogTitle.value = '添加标签规则'
    dialogVisible.value = true
  }
}

//关闭弹框
let closeFormModal = () => {
  emit('hideComp')
}

//导出内部组件属性
defineExpose({
  showModal
})
//导出属性到页面中使用
// let {levelList} = toRefs(state);
</script>

<style scoped lang="scss"></style>
