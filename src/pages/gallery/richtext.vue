<template>
    <div>
        <h2><el-button v-if="formData.Id" size="small" icon="el-icon-arrow-left" circle></el-button> 富文本编辑</h2>
        <div class="line" style="margin-top:15px"></div>

        <div class="panel-start">
            <div style="width:350px;padding-top:20px">
                <mobile title="富文本实时预览" :bgcolor="bgcolor" :frcolor="frcolor" :content="content2"></mobile>
            </div>
            <div style="width:670px;padding-top:20px">
                <Form :model="formData" label-position="top">
                    <FormItem label="标题">
                        <Input v-model="formData.title" placeholder="标题" style="width:400px" />
                    </FormItem>
                    <FormItem label="编辑人">
                        <Input v-model="formData.author" placeholder="编辑人" style="width:400px" />
                    </FormItem>
                    
                    
                    <FormItem label="富文本编辑" style="height:450px">
                        <quill-editor :style="'height:300px'" v-model="content"
                                    ref="myQuillEditor"
                                    :options="editorOption">
                            <div id="toolbar" slot="toolbar">
                                <span class="ql-formats"><button type="button" class="ql-bold"></button></span>
                                <span class="ql-formats"><button type="button" class="ql-italic"></button></span>
                                <span class="ql-formats"><button type="button" class="ql-underline"></button></span>
                                <span class="ql-formats"><button type="button" class="ql-strike"></button></span>
                                <span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>
                                <span class="ql-formats"><button type="button" class="ql-code-block"></button></span>
                                <span class="ql-formats"><button type="button" class="ql-header" value="1"></button></span>
                                <span class="ql-formats"><button type="button" class="ql-header" value="2"></button></span>
                                <span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>
                                <span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>
                                <span class="ql-formats"><button type="button" class="ql-script" value="sub"></button></span>
                                <span class="ql-formats"><button type="button" class="ql-script" value="super"></button></span>
                                <span class="ql-formats"><button type="button" class="ql-indent" value="-1"></button></span>
                                <span class="ql-formats"><button type="button" class="ql-indent" value="+1"></button></span>
                                <span class="ql-formats"> <button type="button" class="ql-direction" value="rtl"></button></span>
                                <span class="ql-formats"><select class="ql-size">
                                <option value="small"></option>
                                <option selected></option>
                                <option value="large"></option>
                                <option value="huge"></option>
                                </select></span>
                                <span class="ql-formats"><select class="ql-header">
                                <option value="1"></option>
                                <option value="2"></option>
                                <option value="3"></option>
                                <option value="4"></option>
                                <option value="5"></option>
                                <option value="6"></option>
                                <option selected="selected"></option>
                                </select></span>
                                <span class="ql-formats"><select class="ql-color">
                                <option selected="selected"></option>
                                <option value="#e60000"></option>
                                <option value="#ff9900"></option>
                                <option value="#ffff00"></option>
                                <option value="#008a00"></option>
                                <option value="#0066cc"></option>
                                <option value="#9933ff"></option>
                                <option value="#ffffff"></option>
                                <option value="#facccc"></option>
                                <option value="#ffebcc"></option>
                                <option value="#ffffcc"></option>
                                <option value="#cce8cc"></option>
                                <option value="#cce0f5"></option>
                                <option value="#ebd6ff"></option>
                                <option value="#bbbbbb"></option>
                                <option value="#f06666"></option>
                                <option value="#ffc266"></option>
                                <option value="#ffff66"></option>
                                <option value="#66b966"></option>
                                <option value="#66a3e0"></option>
                                <option value="#c285ff"></option>
                                <option value="#888888"></option>
                                <option value="#a10000"></option>
                                <option value="#b26b00"></option>
                                <option value="#b2b200"></option>
                                <option value="#006100"></option>
                                <option value="#0047b2"></option>
                                <option value="#6b24b2"></option>
                                <option value="#444444"></option>
                                <option value="#5c0000"></option>
                                <option value="#663d00"></option>
                                <option value="#666600"></option>
                                <option value="#003700"></option>
                                <option value="#002966"></option>
                                <option value="#3d1466"></option>
                                </select></span>
                                <span class="ql-formats"> <select class="ql-background">
                                <option value="#000000"></option>
                                <option value="#e60000"></option>
                                <option value="#ff9900"></option>
                                <option value="#ffff00"></option>
                                <option value="#008a00"></option>
                                <option value="#0066cc"></option>
                                <option value="#9933ff"></option>
                                <option selected="selected"></option>
                                <option value="#facccc"></option>
                                <option value="#ffebcc"></option>
                                <option value="#ffffcc"></option>
                                <option value="#cce8cc"></option>
                                <option value="#cce0f5"></option>
                                <option value="#ebd6ff"></option>
                                <option value="#bbbbbb"></option>
                                <option value="#f06666"></option>
                                <option value="#ffc266"></option>
                                <option value="#ffff66"></option>
                                <option value="#66b966"></option>
                                <option value="#66a3e0"></option>
                                <option value="#c285ff"></option>
                                <option value="#888888"></option>
                                <option value="#a10000"></option>
                                <option value="#b26b00"></option>
                                <option value="#b2b200"></option>
                                <option value="#006100"></option>
                                <option value="#0047b2"></option>
                                <option value="#6b24b2"></option>
                                <option value="#444444"></option>
                                <option value="#5c0000"></option>
                                <option value="#663d00"></option>
                                <option value="#666600"></option>
                                <option value="#003700"></option>
                                <option value="#002966"></option>
                                <option value="#3d1466"></option>
                                </select></span>
                                <span class="ql-formats"><select class="ql-font">
                                <option selected="selected"></option>
                                <option value="serif"></option>
                                <option value="monospace"></option>
                                </select></span>
                                <span class="ql-formats">
                                <select class="ql-align">
                                <option selected="selected"></option>
                                <option value="center"></option>
                                <option value="right"></option>
                                <option value="justify"></option>
                                </select>
                                </span>
                                <span class="ql-formats">
                                    <button type="button" class="ql-clean"></button>
                                </span>
                                <span class="ql-formats">
                                    <button type="button" class="ql-link"></button>
                                </span>
                                <span class="ql-formats">
                                    <button type="button" @click="imgClick">
                                    <Icon type="ios-images" size="18" />
                                    </button>
                                </span>
                                
                            </div>
                        </quill-editor>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model="formData.remarks" placeholder="备注" style="width:400px" />
                    </FormItem>
                    <FormItem label="上架提交">
                        <div class="panel-between">
                            <i-switch v-model="formData.is_show" :true-value="1" :false-value="0" size="large">
                                <span slot="open">上架</span>
                                <span slot="close">下架</span>
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
import mobile from "../../components/mobile";
import imageval from "./gallery";
var that;
export default {
  components: {
    mobile,
    imageval
  },
  watch: {
    content() {
      this.content2 = this.content.replace(
        new RegExp("<img", "g"),
        '<img width="100%"'
      );
    }
  },
  data() {
    return {
      content: "",
      content2: "",
      updateId: "",
      loading: false,
      dialogTableVisible: false,
      formData: {
        Id: "",
        title: "",
        author: sessionStorage.getItem("adminRemarks"),
        remarks: "",
        is_show: 1,
        content: "",
        admin_id: sessionStorage.getItem("adminId")
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
      this.content = this.formData.content;
    }
  },
  methods: {
    imgClick() {
      this.dialogTableVisible = true;
    },
    submitTichtext() {
      this.loading = true;
      this.formData.content = this.content;
      var url = "add";
      if (this.$route.query.data) {
        url = "update";
      }
      this.$http
        .post(this.com.NODE_API + "richtext/" + url, {
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
              that.$router.push({ path: "/richtext_list" });
            } else {
              that
                .$confirm("", "提示", {
                  confirmButtonText: "文本列表",
                  cancelButtonText: "编辑下一篇",
                  type: "warning"
                })
                .then(() => {
                  that.$router.push({ path: "/richtext_list" });
                })
                .catch(() => {
                  that.content = "";
                  that.formData = {
                    Id: "",
                    title: "",
                    author: sessionStorage.getItem("adminRemarks"),
                    remarks: "",
                    is_show: 1,
                    content: "",
                    admin_id: sessionStorage.getItem("adminId")
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
      var gs = "";
      for (var i in li) {
        if (li[i].mimetype.indexOf("image") > -1) {
          this.editor.insertEmbed(this.content.length, "image", li[i].file_url);
        } else {
          gs += li[i].mimetype + " ";
        }
      }
      if (gs != "") {
        this.$Modal.error({
          title: "格式错误",
          content: "富文本不支持" + gs
        });
      }
      this.content = this.content.replace("<img", '<img style="margin:auto"');
      this.dialogTableVisible = false;
      sessionStorage.removeItem("imgUrls");
    }
  }
};
</script>
