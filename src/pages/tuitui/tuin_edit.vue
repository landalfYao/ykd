<template>
    <div>
        <h2><el-button v-if="formData.Id" @click="navTo('/carousel')" size="small" icon="el-icon-arrow-left" circle ></el-button> 农场推荐编辑</h2>
        <div class="line" style="margin-top:15px"></div>

        <div class="panel-start">
            <div style="width:300px;padding-top:20px">
                <!-- <mobile title="富文本实时预览" :bgcolor="bgcolor" :frcolor="frcolor" :content="content2"></mobile> -->
            </div>
            <div style="width:400px;padding-top:20px">
                <Form :model="formData" label-position="top">
                    
                    <FormItem label="图片">
                        <el-button @click="dialogTableVisible = true">选择图片</el-button><br>
                        <img v-if="formData.img" :src="formData.img" height="100px" style="margin-top:10px" alt="">
                    </FormItem>
                    <FormItem label="标题">
                        <Input v-model="formData.title" placeholder="标题" style="width:400px" />
                    </FormItem>
                   
                    <FormItem label="备注">
                        <Input v-model="formData.remarks" placeholder="备注" style="width:400px" />
                    </FormItem>
                    <FormItem label="序号">
                        <Input v-model="formData.sort" placeholder="序号" style="width:400px" />
                    </FormItem>
                    <FormItem label="商品ID">
                        <Input v-model="formData.goodsid" placeholder="商品ID" style="width:400px" />
                    </FormItem>
                    <FormItem label="上架提交">
                        <div class="panel-between">
                            <i-switch v-model="formData.status" :true-value="0" :false-value="1" size="large">
                                <span slot="open">显示</span>
                                <span slot="close">关闭</span>
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
      <el-dialog :visible.sync="sdVisible" width="1060px">
          <richtext style="margin-top:-40px"></richtext>
          <div slot="footer" class="dialog-footer">
            <el-button @click="sdVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import imageval from "../gallery/gallery";
import richtext from "../gallery/richtext_list";
var that;
export default {
  components: {
    imageval,
    richtext
  },

  data() {
    return {
      updateId: "",
      loading: false,
      dialogTableVisible: false,
      sdVisible: false,
      formData: {
        Id: "",
        img: "",
        remarks: "",
        sort: "",
        status: 0,
        zt_id:0,
        goodsid: "",
        title: "",
        type: 1
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
    this.formData.zt_id = that.$route.query.id
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
    }
  },
  methods: {
    navTo(path, data) {
      var query = {};
      if (data) {
        query.data = this.com.secrets.encrypt(
          JSON.stringify({ data: data }),
          "utf8",
          this.com.ivkey,
          "hex",
          true
        );
      }
      this.$router.push({ path: path, query: query });
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
        .post(this.com.NODE_API + "tui/" + url, {
          data: this.com.secrets.encrypt(
            JSON.stringify(this.formData),
            "utf8",
            this.com.ivkey,
            "hex",
            true
          )
        })
        .then(res => {
          that.loading = false;
          if (res.data.code == 1000) {
            that.$message({
              showClose: true,
              message: res.data.msg,
              type: "success"
            });
            if (that.$route.query.data) {
              that.$router.push({ path: "/tuin" ,query:{id:that.$route.query.id}});
            } else {
              that
                .$confirm("", "提示", {
                  confirmButtonText: "列表",
                  cancelButtonText: "编辑下一个",
                  type: "warning"
                })
                .then(() => {
                  that.$router.push({ path: "/tuin",query:{id:that.$route.query.id} });
                })
                .catch(() => {
                  that.content = "";
                  that.formData = {
                    Id: "",
                    img: "",
                    remarks: "",
                    sort: "",
                    status: 0,
                    goodsid: "",
                    zt_id:that.$route.query.id,
                    title: "",
                    type:1
                  };
                });
            }
          } else {
            that.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }
        });
    },
    getModelImgs() {
      var li = JSON.parse(sessionStorage.getItem("imgUrls"));
      this.formData.img = li[0].file_url;
      this.dialogTableVisible = false;
      sessionStorage.removeItem("imgUrls");
    },
    getContent() {
      var li = JSON.parse(sessionStorage.getItem("richtexts"));
      this.formData.content_id = li[0].Id;
      this.sdVisible = false;
    }
  }
};
</script>
