<template>
    <div>
        <h2>修改密码</h2>
        <div class="line" style="margin-top:15px"></div>
        
     
        <Form :model="wxamsg" :label-width="200" style="margin-top:20px;width:800px">
            <FormItem label="旧密码">
                <Input v-model="wxamsg.adminPwd" type="password" placeholder="旧密码"></Input>
            </FormItem>
            <FormItem label="新密码">
                <Input v-model="wxamsg.pwd1" type="password" placeholder="新密码"></Input>
            </FormItem>
            <FormItem label="重复输入">
                <Input v-model="wxamsg.pwd2" type="password" placeholder="重复输入"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" @click="submitData()">保存提交</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      wxamsg: {
        adminName: sessionStorage.getItem("adminName"),
        adminPwd: "",
        pwd1: "",
        pwd2: ""
      }
    };
  },
  mounted() {},
  methods: {
    submitData() {
      var that = this;
      this.loading = true;
      this.$http
        .post(this.com.NODE_API + "admin/update_pwd", {data:this.com.secrets.encrypt(JSON.stringify(this.wxamsg),'utf8', this.com.ivkey, 'hex', true)})
        .then(res => {
          if (res.data.code == 1000) {
            that.$message({
              type: "success",
              message: res.data.msg
            });
            that.wxamsg = {
              adminName: sessionStorage.getItem("adminName"),
              adminPwd: "",
              pwd1: "",
              pwd2: ""
            };
          } else {
            that.$message({
              type: "error",
              message: res.data.msg
            });
          }
          that.loading = false;
        });
    }
  }
};
</script>

