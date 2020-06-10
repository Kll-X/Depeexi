<template>
  <div class="user-detail">
    <content-title :title="title"></content-title>
    <el-form-renderer
      ref="form"
      :content="formContent"
      class="user-form"
      label-width="120px"
    ></el-form-renderer>
    <operate-row>
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="saveUser">提交</el-button>
    </operate-row>
  </div>
</template>

<script>
import ContentTitle from '../../../component/content-title'
import OperateRow from '../../../component/operate-row'
import formConfig from './form-config'

import {newUser, editUser, getUserDetail} from '../../../services/user-manage'

const DEFAULT_PASSWORD = 'EDIT_DEFAULT_PASSWORD'

export default {
  components: {
    ContentTitle,
    OperateRow,
  },
  data() {
    return {
      formContent: formConfig.call(this),
    }
  },
  computed: {
    title() {
      return this.id ? '编辑用户' : '新增用户'
    },
    id() {
      return this.$route.query.id
    },
  },
  async mounted() {
    if (!this.id) return

    try {
      let res = await getUserDetail(this.id)
      let data = res.payload || {}
      data.password = DEFAULT_PASSWORD
      data.checkpassword = DEFAULT_PASSWORD

      this.$refs.form.updateForm(data)
    } catch (e) {}
  },
  methods: {
    saveUser() {
      const form = this.$refs.form
      form.validate(valid => {
        if (!valid) return
        const data = form.getFormValue()

        data.password == DEFAULT_PASSWORD && delete data.password
        data.checkpassword == DEFAULT_PASSWORD && delete data.checkpassword

        const request = this.id ? editUser(this.id, data) : newUser(data)
        request.then(() => {
          this.$router.replace('user-management')
          this.$message.success('保存成功')
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.user-detail {
  padding: 25px;
  padding-bottom: 80px;
}

.user-form {
  width: 580px;
}
</style>
