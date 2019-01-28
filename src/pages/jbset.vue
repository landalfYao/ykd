<template>
  <div>
    <h2>
      <el-button
        v-if="formData.Id"
        @click="navTo('/carousel')"
        size="small"
        icon="el-icon-arrow-left"
        circle
      ></el-button>金币设置
    </h2>
    <div class="line" style="margin-top:15px"></div>

    <div class="panel-start">
      <div style="width:300px;padding-top:20px">
        <!-- <mobile title="富文本实时预览" :bgcolor="bgcolor" :frcolor="frcolor" :content="content2"></mobile> -->
      </div>
      <div style="width:400px;padding-top:20px">
        <Form :model="formData" label-position="top">
          <FormItem label="浇水">
            <Input v-model="formData.js" placeholder="浇水" style="width:400px"/>
          </FormItem>

          <FormItem label="除草">
            <Input v-model="formData.cc" placeholder="除草" style="width:400px"/>
          </FormItem>
          <FormItem label="施肥">
            <Input v-model="formData.sf" placeholder="施肥" style="width:400px"/>
          </FormItem>
          <FormItem label="提交">
            <div class="panel-between">
              <el-button type="primary" :loading="loading" @click="submitTichtext()">保存提交</el-button>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
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
      sdVisible: false,
      formData: {
        js: 0,
        cc: 0,
        sf: 0
      },
      editorOption: {
        modules: {
          toolbar: "#toolbar"
        }
      }
    };
  },

  mounted() {
    that = this;
    that.getDx();
  },
  methods: {
    getDx() {
      this.$http
        .post(this.com.JAVA_API + "app/find", {}, { emulateJSON: true })
        .then(res => {
          if (res.body.code) {
            that.formData = res.body.params.list;
          }
        });
    },
    submitTichtext() {
      this.loading = true;

      this.$http
        .post(this.com.JAVA_API + "app/update", this.formData, {
          emulateJSON: true
        })
        .then(res => {
          that.loading = false;
          if (res.body.code) {
            that.$message({
              showClose: true,
              message: res.body.msg,
              type: "success"
            });
          } else {
            that.$message({
              showClose: true,
              message: res.body.msg,
              type: "error"
            });
          }
        });
    }
  }
};
</script>
