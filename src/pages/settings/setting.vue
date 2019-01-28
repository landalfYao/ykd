<template>
    <div>
        <h2>基础设置</h2>
        <div class="line" style="margin-top:15px"></div>
        
        <h3 style="margin-top:20px">默认页码设置</h3>
        <Form :model="wxamsg" :label-width="200" style="margin-top:20px;width:800px">
            <FormItem label="默认页码">
                <Input v-model="wxamsg.current_page" placeholder="默认页码" />
            </FormItem>
            <FormItem label="默认每页条数">
                <Input v-model="wxamsg.page_size" placeholder="默认每页条数" />
            </FormItem>
        </Form>

        <div class="line" style="margin-top:15px"></div>
        
        <h3 style="margin-top:20px">图片水印</h3>
        <Form :model="wxamsg" :label-width="200" style="margin-top:20px;width:800px">
            <FormItem label="是否开启水印">
                <i-switch v-model="wxamsg.watermark" :true-value="1" :false-value="0" size="large">
                    <span slot="open">开启</span>
                    <span slot="close">关闭</span>
                </i-switch>
            </FormItem>
            <FormItem label="水印位置">
                <Select v-model="wxamsg.wm_position" style="width:200px" :disabled="wxamsg.watermark == 0">
                    <Option v-for="item in positions" :value="item" :key="item">{{ item }}</Option>
                </Select>
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
      positions: ["左上", "中上", "右上", "左下", "中下", "右下"],
      wxamsg: {
        current_page: 1,
        page_size: 10,
        watermark: 0,
        wm_position: "右下"
      }
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
          current_page: data.current_page,
          page_size: data.page_size,
          watermark: data.watermark,
          wm_position: data.wm_position
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
        .post(this.com.NODE_API + "admin/update/config_html", {
          data: that.com.secrets.encrypt(
            JSON.stringify(that.wxamsg),
            "utf8",
            that.com.ivkey,
            "hex",
            true
          )
        })
        .then(res => {
          if (res.data.code == 1000) {
            res.data.data = JSON.parse(
              that.com.secrets.decypt(
                res.data.data,
                "base64",
                that.com.ivkey,
                "hex",
                true
              )
            );
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

