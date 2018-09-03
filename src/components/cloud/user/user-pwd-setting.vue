<template>
  <div>
    <Form class="pwd-setting" ref="form" :model="value" :rules="rules" :label-width="80">
      <Form-item label="原密码" prop="oldPwd">
        <i-input type="password" v-model="value.oldPwd" placeholder="请输入原密码确认身份"></i-input>
      </Form-item>
      <Form-item label="新密码" prop="newPwd">
        <i-input type="password" v-model="value.newPwd" placeholder="6-20个字母或数字"></i-input>
      </Form-item>
      <Form-item label="确认密码" prop="newPwd2">
        <i-input type="password" v-model="value.newPwd2" placeholder="确认新密码"></i-input>
      </Form-item>
      <Form-item class="action">
        <Button>取消</Button>
        <Button type="primary" @click="confirm">确认</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script type="text/ecmascript-6">
import * as Tool from '../../../common/tool';
import * as API from '../../../vuex/api';

/** 接口地址 */
const SvcUrl = {
  UpdatePwd: API.UPDATE_PWD
};

/** 接口 Mixin */
const SvcApi = {
  methods: {
    ...Tool.ApiMethods,
    apiUpdatePwd(oldPwd, newPwd) {
      let param = {
        pwd: oldPwd,
        newPwd
      };
      return this.request(SvcUrl.UpdatePwd, param);
    }
  }
};

export default {
  mixins: [SvcApi],

  data() {
    return {
      value: {
        oldPwd: '',
        newPwd: '',
        newPwd2: ''
      },

      rules: {
        oldPwd: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入原密码'));
              } else {
                callback();
              }
            }
          }
        ],
        newPwd: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!/^[0-9a-z]{6,20}$/i.test(value)) {
                callback(new Error('请输入6-20个字母或数字'));
              } else {
                callback();
              }
            }
          }
        ],
        newPwd2: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value !== this.value.newPwd) {
                callback(new Error('两次输入的密码不一致，请重新输入'));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },

  methods: {
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.apiUpdatePwd(this.value.oldPwd, this.value.newPwd)
            .then(data => {
              this.$Message.success('修改成功');
              this.$store.dispatch('logout');
              this.$router.replace('/login');
            }, err => {
              this.$Message.error(err.message);
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.pwd-setting {
  width: 520px;
  margin: auto;

  .ivu-form-item {
    margin-bottom: 32px;

    .ivu-form-item-label {
      font-size: 14px;
    }

    .ivu-input {
      width: 430px;
      height: 36px;
    }
  }

  .action {
    margin-top: 40px;
    margin-left: 60px;

    .ivu-btn {
      width: 88px;
      height: 36px;
      margin: 0 8px;
    }
  }
}
</style>
