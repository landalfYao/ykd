<template>
    <div>
        <h2>配置信息</h2>
        <div class="line" style="margin-top:15px"></div>  
        <h3 style="margin-top:20px">小程序配置</h3>
        <Form :model="wxamsg" :label-width="200" style="margin-top:20px;width:800px">
            <FormItem label="APPID">
                <Input v-model="wxamsg.appid" :disabled="adminId != adminIdse" placeholder="输入APPID"></Input>
            </FormItem>
            <FormItem label="APP SECRET">
                <Input v-model="wxamsg.app_secret" :disabled="adminId != adminIdse" placeholder="输入小程序密钥"></Input>
            </FormItem>
        </Form>

        <div class="line" style="margin-top:15px"></div>
        
        <h3 style="margin-top:20px">微信支付</h3>
        <Form :model="wxamsg" :label-width="200" style="margin-top:20px;width:800px">
            <FormItem label="商户号">
                <Input v-model="wxamsg.mthid" :disabled="adminId != adminIdse" placeholder="输入商户号"></Input>
            </FormItem>
            <FormItem label="商户密钥">
                <Input v-model="wxamsg.mth_secret" :disabled="adminId != adminIdse" placeholder="输入商户密钥"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" :disabled="adminId != adminIdse" :loading="loading" @click="submitUpdate">保存提交</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
var that;
export default {
  data() {
    return {
      loading: false,
      wxamsg: {
        appid: "",
        app_secret: "",
        mthid: "",
        mth_secret: "",
        mth_cert: ""
      },
      adminId: sessionStorage.getItem("adminId"),
      adminIdse: JSON.parse(sessionStorage.getItem("config")).super_admin
    };
  },
  mounted() {
    that = this;
    this.initData();
  },
  methods: {
    initData() {
      if (sessionStorage.getItem("config")) {
        var data = JSON.parse(sessionStorage.getItem("config"));
        this.wxamsg = {
          appid: data.appid,
          app_secret: data.app_secret,
          mthid: data.mthid,
          mth_secret: data.mth_secret,
          mth_cert: data.mth_cert
        };
      } else {
        this.com.getConfig(this, function(res) {
          that.initData();
        });
      }
    },
    submitUpdate() {
      this.loading = true;
      this.$http
        .post(this.com.NODE_API + "admin/update/config_sercet", {
          data: this.com.secrets.encrypt(
            JSON.stringify(this.wxamsg),
            "utf8",
            this.com.ivkey,
            "hex",
            true
          )
        })
        .then(res => {
          res.data.data = JSON.parse(
            that.com.secrets.decypt(
              res.data.data,
              "base64",
              that.com.ivkey,
              "hex",
              true
            )
          );
          if (res.data.code == 1000) {
            that.$message({
              showClose: true,
              message: res.data.msg,
              type: "success"
            });
            that.loading = false;
            sessionStorage.setItem("config", JSON.stringify(res.data.data));
            that.initData();
          } else {
            that.$message({
              showClose: true,
              message: res.data.data,
              type: "error"
            });
          }
        });
    }
  }
};
</script>

