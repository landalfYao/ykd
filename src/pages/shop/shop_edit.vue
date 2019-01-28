<template>
    <div>
        <h2><el-button v-if="formData.id" @click="navTo('/shop')" size="small" icon="el-icon-arrow-left" circle ></el-button> 基地编辑</h2>
        <div class="line" style="margin-top:15px"></div>

        <div class="panel-start">
            <div style="width:300px;padding-top:20px">
                <!-- <mobile title="富文本实时预览" :bgcolor="bgcolor" :frcolor="frcolor" :content="content2"></mobile> -->
            </div>
            <div style="width:400px;padding-top:20px">
                <Form :model="formData" label-position="top">
                    
                    <FormItem label="基地图片">
                        <el-button @click="dialogTableVisible = true">选择图片</el-button><br>
                        <img v-if="formData.image" :src="formData.image" height="100px" style="margin-top:10px" alt="">
                    </FormItem>
                    <FormItem label="基地名称">
                        <Input v-model="formData.name" placeholder="基地名称" style="width:400px" />
                    </FormItem>
                    <FormItem label="评分">
                        <el-rate
                            v-model="formData.core"
                            :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                        </el-rate>
                    </FormItem>
                    <FormItem label="库存">
                        <Input v-model="formData.stock" placeholder="库存"  style="width:400px" />
                    </FormItem>
                    <FormItem label="基地公告">
                        <Input v-model="formData.title" placeholder="基地公告" style="width:400px" />
                    </FormItem>
                    <FormItem label="地址">
                        <Input v-model="formData.address" placeholder="地址" style="width:400px" />
                    </FormItem>
                    <FormItem label="电话">
                        <Input v-model="formData.phone" placeholder="电话" style="width:400px" />
                    </FormItem>
                    <FormItem label="上线提交">
                        <div class="panel-between">
                            <i-switch v-model="formData.status" :true-value="0" :false-value="1" size="large">
                                <span slot="open">上线</span>
                                <span slot="close">下线</span>
                            </i-switch>
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
import imageval from "../gallery/gallery";
import richtext from '../gallery/richtext_list'
var that;
export default {
  components: {
    imageval,richtext
  },

  data() {
    return {
      updateId: "",
      loading: false,
      dialogTableVisible: false,
      sdVisible:false,
      formData: {
        id: "",
        name: "",
        image: "",
        core: null,
        stock:'',
        status: 0,
        admin_id: sessionStorage.getItem("adminId"),
        title:'',
      },
      editorOption: {
        modules: {
          toolbar: "#toolbar"
        }
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
      this.formData.admin_id = sessionStorage.getItem("adminId");
      delete this.formData.createtime
      delete this.formData.mqo
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
        .post(this.com.JAVA_API + "shop/" + url, this.formData,{ emulateJSON:true })
        .then(res => {
          that.loading = false;
          if (res.data.code) {
            that.$message({
              showClose: true,
              message: res.data.msg,
              type: "success"
            });
            this.$router.push({path:'shop'})
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
