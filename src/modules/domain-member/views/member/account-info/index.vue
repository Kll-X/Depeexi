<template>
  <div class="account-info">
    <el-data-table ref="dataTable" v-bind="tableConfig"></el-data-table>

    <import-members-dialog
      :visible.sync="importDialogVisible"
      @close-dialog="importDialogVisible = false"
      @import-success="$refs.dataTable.getList()"
    ></import-members-dialog>
  </div>
</template>

<script>
import StateTag from '^domain-member/components/state-tag'
import {ENABLE_OPTIONS, ENABLE, DISABLE} from '^domain-member/const/const'
import {formatDate} from '^domain-member/const/filter'
import {
  memberList,
  editMemberStatus,
  deleteMember,
  importMembers,
} from '^domain-member/services/deepexi-system-digital-retail'
import importMembersDialog from './components/import-members-dialog.vue'

export default {
  components: {
    StateTag,
    importMembersDialog,
  },

  data() {
    return {
      tableConfig: {
        url: memberList,
        columns: [
          {
            prop: 'username',
            label: '会员账号',
            minWidth: 150,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'phone',
            label: '会员手机号',
            minWidth: 150,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'origin',
            label: '来源渠道',
            minWidth: 150,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'status',
            label: '状态',
            minWidth: 100,
            formatter: ({status}) => {
              if (status == null) return ''
              let type = 'success'
              if (!status) {
                type = 'danger'
              }
              const text = ENABLE_OPTIONS[status]
              return <state-tag type={type}>{text}</state-tag>
            },
          },
          {
            prop: 'registerAt',
            label: '注册时间',
            width: 180,
            formatter: ({createTime}) =>
              formatDate(createTime, 'YYYY-MM-DD HH:mm:ss'),
          },
        ],
        searchForm: [
          {
            type: 'input',
            id: 'username',
            label: '会员账号',
            el: {
              placeholder: '请输入',
            },
          },
          {
            type: 'select',
            id: 'status',
            label: '状态',
            el: {
              placeholder: '请选择',
            },
            options: Object.keys(ENABLE_OPTIONS)
              .reverse()
              .map(key => {
                return {
                  label: ENABLE_OPTIONS[key],
                  value: key,
                }
              }),
          },
          {
            type: 'input',
            id: 'phone',
            label: '会员手机号',
            el: {
              placeholder: '请输入',
            },
          },
        ],
        headerButtons: [
          {
            type: 'primary',
            text: '新增',
            atClick: () => {
              this.$router.push('/member/account-info/new')
              return Promise.reject()
            },
          },
          {
            text: '批量导入会员',
            atClick: () => {
              this.importDialogVisible = true
              return Promise.reject()
            },
          },
        ],
        extraButtons: [
          {
            text: '查看',
            type: 'primary',
            atClick: ({id}) => {
              this.$router.push({
                path: '/member/account-info/view',
                query: {
                  id,
                },
              })
              return Promise.reject()
            },
          },
          {
            text: '编辑',
            type: 'primary',
            atClick: ({id}) => {
              this.$router.push({
                path: '/member/account-info/edit',
                query: {
                  id,
                },
              })
              return Promise.reject()
            },
          },
          {
            text: '启用',
            type: 'primary',
            show: ({status}) => status === DISABLE,
            atClick: ({id}) => {
              this.showMessageBox({
                message: '您确认启用此会员吗？',
                confirm: () =>
                  this.handleEditMemberStatus(id, ENABLE, '启用成功！'),
              })
              return Promise.reject()
            },
          },
          {
            text: '禁用',
            type: 'primary',
            show: ({status}) => status === ENABLE,
            atClick: ({id}) => {
              this.showMessageBox({
                message: '禁用后该会员将无法登陆H5商城，您确认禁用此会员吗？',
                confirm: () =>
                  this.handleEditMemberStatus(id, DISABLE, '禁用成功！'),
              })
              return Promise.reject()
            },
          },
          {
            text: '删除',
            type: 'danger',
            show: ({status}) => status === DISABLE,
            atClick: ({id}) => {
              this.showMessageBox({
                message: '您确认删除此会员吗？',
                confirm: () => this.handleDeleteMember(id),
              })
              return Promise.reject()
            },
          },
        ],
        operationAttrs: {
          width: '200px',
          fixed: 'right',
        },
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
      },
      importDialogVisible: false,
    }
  },
  methods: {
    // 消息提示框
    showMessageBox(params) {
      const {
        title = '提示',
        message,
        confirm,
        confirmButtonText = '确定',
        cancelButtonText = '取消',
        type = 'warning',
      } = params
      this.$msgbox({
        title,
        message,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        type,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            Promise.resolve(confirm()).finally(() => {
              done()
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        },
      }).catch(err => {})
    },
    // 消息弹框
    showMessage(message, type = 'success') {
      this.$message({
        message,
        type,
      })
    },
    // 编辑会员状态
    handleEditMemberStatus(id, statusCode, message) {
      return new Promise(resolve => {
        editMemberStatus(id, statusCode)
          .then(() => {
            this.showMessage(message)
          })
          .finally(() => {
            resolve()
            this.$refs.dataTable.getList()
          })
      })
    },
    // 删除会员
    handleDeleteMember(id) {
      return new Promise(resolve => {
        deleteMember(id)
          .then(() => {
            this.showMessage('删除成功!')
          })
          .finally(() => {
            resolve()
            this.$refs.dataTable.getList()
          })
      })
    },
  },
}
</script>

<style lang="less">
.account-info {
  padding: 20px;
  background-color: #fff;

  .el-table__header {
    font-size: 12px;

    thead {
      .is-leaf {
        background-color: #f4f6fa;
      }
    }
  }
}
</style>
