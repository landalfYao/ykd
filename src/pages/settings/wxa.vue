<template>
    <div>
        <h2>小程序信息</h2>
        <div class="line" style="margin-top:15px"></div>
        
        <h3 style="margin-top:20px">顶部导航设置</h3>
        <Form :model="wxamsg" :label-width="200" style="margin-top:20px;width:800px">
            <FormItem label="小程序名称">
                <Input v-model="wxamsg.wx_name" placeholder="输入小程序名称" />
            </FormItem>
            <FormItem label="前景色">
                <ColorPicker v-model="wxamsg.wx_front_color" />
            </FormItem>
            <FormItem label="背景色">
                <ColorPicker v-model="wxamsg.wx_background_color" />
            </FormItem>
        </Form>

        <div class="line" style="margin-top:15px"></div>
        
        <h3 style="margin-top:20px">首页分享设置</h3>
        <Form :model="wxamsg" :label-width="200" style="margin-top:20px;width:800px">
            <FormItem label="分享标题">
                <Input v-model="wxamsg.home_share_title" placeholder="输入分享标题（默认为小程序名称）" />
            </FormItem>
            <FormItem label="分享路径">
                <Input v-model="wxamsg.home_share_path" placeholder="输入分享路径（默认为不带参数的首页）" />
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" @click="submitUpdate">保存提交</Button>
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
        wx_name: "",
        wx_front_color: "#000000",
        wx_background_color: "#ffffff",
        home_share_title: "",
        home_share_path: ""
      }
    };
  },
  mounted() {
    that = this;
    this.initData();

  },
  methods: {
    initData() {
      if(sessionStorage.getItem("config")){
          var data = JSON.parse(sessionStorage.getItem("config"));
          this.wxamsg = {
          wx_name: data.wx_name,
          wx_front_color: data.wx_front_color,
          wx_background_color: data.wx_background_color,
          home_share_title: data.home_share_title,
          home_share_path: data.home_share_path
        };
      }else{
        this.com.getConfig(this,function(res){
          that.initData()
        })
      }
      
    },
    submitUpdate() {
      this.loading = true;
      this.$http
        .post(this.com.NODE_API + "admin/update/config_unit", {data:that.com.secrets.encrypt(JSON.stringify(that.wxamsg),'utf8', that.com.ivkey, 'hex', true)})
        .then(res => {
          if (res.data.code == 1000) {
            res.data.data = JSON.parse(that.com.secrets.decypt(res.data.data,'base64', that.com.ivkey, 'hex', true))
            that.$message({
              showClose: true,
              message: res.data.msg,
              type: "success"
            });
            that.loading = false;
            sessionStorage.setItem('config',JSON.stringify(res.data.data))
                        that.initData()
            
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

