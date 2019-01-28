<template>
    <div>
        <h2><el-button @click="navTo('/goods')" size="small" icon="el-icon-arrow-left" circle ></el-button> 商品编辑</h2>
        <div class="line" style="margin-top:15px"></div>

        <div class="panel-start">
            <div style="width:300px;padding-top:20px">
                <!-- <mobile title="富文本实时预览" :bgcolor="bgcolor" :frcolor="frcolor" :content="content2"></mobile> -->
            </div>
            <div style="width:400px;padding-top:20px">
                <Form :model="formData" label-position="top">
                    <FormItem label="商品名称">
                        <Input v-model="formData.name" placeholder="商品名称" style="width:400px" />
                    </FormItem>
                    <FormItem label="商品图片">
                        <el-button @click="dialogTableVisible = true">选择图片</el-button><br>
                        <img v-if="formData.image" :src="formData.image" height="100px" style="margin-top:10px" alt="">
                    </FormItem>
                    
                    <FormItem label="商品价格">
                        <Input v-model="formData.price" placeholder="商品价格" style="width:400px" />
                    </FormItem>
                    <FormItem label="销量">
                        <Input v-model="formData.sales" placeholder="销量" style="width:400px" />
                    </FormItem>
                    <FormItem label="库存" >
                        <Input v-model="formData.stock" :value="formData.type == '地' ? 1:''" :readonly="formData.type == '地'" placeholder="库存" style="width:400px" />
                    </FormItem>
                    <FormItem label="单位">
                        <Input v-model="formData.unit" placeholder="单位" style="width:400px" />
                    </FormItem>
                    <FormItem label="商品类型">
                        <Select v-model="formData.type" @on-change="typechange">
                          <Option v-for="item in types" :key="item" :value="item">{{item}}</Option>
                        </Select>
                    </FormItem>
                    <!-- <FormItem label="封面地址" v-if="formData.type =='地'">
                        <Input v-model="formData.urlImage" placeholder="封面地址" style="width:400px" />
                    </FormItem> -->
                    <FormItem label="直播地址"  v-if="formData.type =='地'">
                        <Input v-model="formData.url" placeholder="直播地址" style="width:400px" />
                    </FormItem>

                    <FormItem label="备注">
                        <Input v-model="formData.remark" placeholder="备注" style="width:400px" />
                    </FormItem>
                    <FormItem label="提交">
                        <div class="panel-between">
                          <i-switch v-model="formData.isshow" :true-value="0" :false-value="1" size="large">
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
import imageval from '../../gallery/gallery'
var that;
export default {
  components:{
    imageval
  },
  data() {
    return {
      types:['种子','农作物','地'],
      updateId: "",
      loading: false,
      dialogTableVisible: false,
      sdVisible:false,
      formData: {
        shopid: "",
        name: "",
        categoryid:"",
        image:"",
        price:"",
        sales:"",
        unit:"",
        isshow:0,
        type:"",
        stock:"",
        remark:"",
        urlImage:"",
        url:""
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
    if(this.$route.query.id){
        this.formData.shopid = this.$route.query.id;
        this.formData.categoryid = this.$route.query.cateid
    }
    
  },
  methods: {
    typechange(e){
      if(e=='地'){
        this.formData.stock = 1
      }
    },
    navTo(path){
       that.$router.go(-1)
    },
    imgClick() {
      this.dialogTableVisible = true;
    },
    submitTichtext() {
      this.loading = true;
      var url = "add";
      if (this.$route.query.data) {
        url = "update";
        delete this.formData.categoryid
      }
      this.formData.urlImage = this.formData.image
      this.$http
        .post(this.com.JAVA_API + "product/" + url, this.formData,{ emulateJSON:true })
        .then(res => {
          that.loading = false;
          if (res.data.code) {
            that.$message({
              showClose: true,
              message: res.data.msg,
              type: "success"
            });
            that.$router.go(-1)
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
