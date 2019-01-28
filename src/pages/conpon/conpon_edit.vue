<template>
    <div>
        <h2>优惠券模板编辑</h2>
        <div class="line" style="margin-top:15px"></div>

        <div class="panel-start">
            <div style="width:300px;padding-top:20px">
                <!-- <mobile title="富文本实时预览" :bgcolor="bgcolor" :frcolor="frcolor" :content="content2"></mobile> -->
            </div>
            <div style="width:400px;padding-top:20px">
                <Form :model="formData" label-position="top">
                    
                    <FormItem label="优惠券名称">
                        <Input v-model="formData.name" placeholder="优惠券名称" style="width:400px" />
                    </FormItem>
                    <FormItem label="满价格">
                        <Input v-model="formData.full" placeholder="满价格" style="width:400px" />
                    </FormItem>
                    <FormItem label="减价格">
                        <Input v-model="formData.reduce" placeholder="减价格" style="width:400px" />
                    </FormItem>
                    <FormItem label="有效期">
                        <Input v-model="formData.outDay" placeholder="有效期(天)" style="width:400px" />
                    </FormItem>
                    <FormItem label="提交">
                        <div class="panel-between">
                            <el-button type="primary" :loading="loading" @click="submitTichtext()">保存提交</el-button>
                        </div>
                    </FormItem>
                </Form>
            </div>
        </div>
        <el-dialog :visible.sync="dialogTableVisible" width="1060px">
          <imageval style="margin-top:-40px"></imageval>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click="getModelImgs()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
var that;
export default {

  data() {
    return {
      updateId: "",
      loading: false,
      dialogTableVisible: false,
      sdVisible:false,
      formData: {
        full:'',
        reduce:'',
        name: "",
        outDay:""
      },
      bgcolor: JSON.parse(sessionStorage.getItem("config")).wx_background_color,
      frcolor: JSON.parse(sessionStorage.getItem("config")).wx_front_color
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  mounted() {
    that = this;
    if (this.$route.query.data) {
      this.formData = JSON.parse(
        that.com.secrets.decypt(
          this.$route.query.data,
          "base64",
          that.com.ivkey,
          "hex",
          true
        )
      ).data;
      delete this.formData.createtime
      delete this.formData.mqo
    }
    if(this.$route.query.id){
        this.formData.shopid = this.$route.query.id
    }
    
  },
  methods: {
    navTo(path,data){
        var query = {}
        if(data){
            query.data = this.com.secrets.encrypt( JSON.stringify({data:data}), "utf8", this.com.ivkey, "hex",  true )
            
        }
        this.$router.push({path:path,query:query})
    },
    navTo2(path,data){
      console.log(111)
        var query = {}
        if(data){
            query.id = data
            
        }
        this.$router.push({path:path,query:query})
    },
    imgClick() {
      this.dialogTableVisible = true;
    },
    submitTichtext() {
      this.loading = true;
      var url = "add";
      if (this.$route.query.data) {
        url = "update";
      }
      this.$http
        .post(this.com.JAVA_API + "coupon/" + url, this.formData,{ emulateJSON:true })
        .then(res => {
          that.loading = false;
          if (res.data.code) {
            that.$message({
              showClose: true,
              message: res.data.msg,
              type: "success"
            });
            that.$router.push({path:'/coupon',query:{id:that.$route.query.id}})
          } else {
            that.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }
        })
        
    },
    getModelImgs() {
      var li = JSON.parse(sessionStorage.getItem("imgUrls"));
      this.formData.image = li[0].file_url
      this.dialogTableVisible = false;
      sessionStorage.removeItem("imgUrls");
    },
  }
};
</script>
