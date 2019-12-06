<template>
  <div>
    <div>
      <div>
        <Button
          type="primary"
          @click="modal=true"
          :style="{'margin-bottom':'5px','float':'right'}"
        >添加用户</Button>
      </div>
      <div class="top-r">
        <Upload
          ref="upload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :data="{schoolid:this.schoolid,createid:this.createid}"
          :action="this.$api.baseUrl+'user/export_user'"
        >
          <Button icon="ios-cloud-upload-outline">导入用户</Button>
        </Upload>
        <a href="/导入学生模板.xlsx" target="_blank" class="down">下载模板</a>
      </div>
    </div>
    <Modal v-model="modal" title="添加用户" @on-cancel="cancel" width="480">
      <Form ref="formDate" :model="formDate" :rules="ruleDate" :label-width="70">
        <FormItem label="账号" prop="loginname">
          <Input :maxlength="25" v-model="formDate.loginname"></Input>
        </FormItem>
        <FormItem label="密码" prop="loginpwd">
          <Input type="password" :maxlength="16" v-model="formDate.loginpwd"></Input>
        </FormItem>
        <FormItem label="姓名" prop="username">
          <Input :maxlength="7" v-model="formDate.username"></Input>
        </FormItem>
        <FormItem label="性别" prop="usersex">
          <RadioGroup v-model="formDate.usersex">
            <Radio label="0">保密</Radio>
            <Radio label="1">男</Radio>
            <Radio label="2">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="手机号" prop="userphone">
          <Input type="text" v-model="formDate.userphone" :maxlength="11" number></Input>
        </FormItem>
        <FormItem label="邮箱" prop="useremail">
          <Input v-model="formDate.useremail"></Input>
        </FormItem>
        <FormItem label="上传头像" prop="file">
          <input ref="file" @change="uploading" type="file" accept="image/*" :key="filekey" />
          <img :src="src" :style="{'margin-top':'5px','width':'200px'}" />
        </FormItem>
        <FormItem label="爱好" prop="userlike">
          <Input v-model="formDate.userlike"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" :loading="btnloading" @click="ok('formDate')">确定</Button>
      </div>
    </Modal>
    <Modal v-model="modal1" title="修改用户" @on-cancel="cancel" width="480">
      <Form ref="formDate1" :model="formDate1" :rules="ruleDate1" :label-width="70">
        <FormItem label="账号" prop="loginname">
          <Input :maxlength="25" v-model="formDate1.loginname"></Input>
        </FormItem>
        <FormItem label="密码" prop="loginpwd">
          <Input type="password" :maxlength="16" v-model="formDate1.loginpwd"></Input>
        </FormItem>
        <FormItem label="姓名" prop="username">
          <Input :maxlength="7" v-model="formDate1.username"></Input>
        </FormItem>
        <FormItem label="性别" prop="usersex">
          <RadioGroup v-model="formDate1.usersex">
            <Radio label="0">保密</Radio>
            <Radio label="1">男</Radio>
            <Radio label="2">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="手机号" prop="userphone">
          <Input type="text" :maxlength="11" v-model="formDate1.userphone"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="useremail">
          <Input v-model="formDate1.useremail"></Input>
        </FormItem>
        <FormItem label="上传头像" prop="file" class="tupian">
          <input ref="file" @change="uploading" type="file" accept="image/*" :key="filekey" />
          <img :src="src" :style="{'margin-top':'5px','width':'200px'}" />
        </FormItem>
        <FormItem label="爱好" prop="userlike">
          <Input v-model="formDate1.userlike"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" :loading="btnloading" @click="ok1('formDate1')">确定</Button>
      </div>
    </Modal>
    <Modal v-model="modal2" title="用户详情" @on-cancel="cancel" width="600">
      <p>账号: {{formDate1.loginname}}</p>
      <p>姓名: {{formDate1.username}}</p>
      <p v-if="formDate1.usersex=='0'">性别: 保密</p>
      <p v-if="formDate1.usersex=='1'">性别: 男</p>
      <p v-if="formDate1.usersex=='2'">性别: 女</p>
      <p>手机号: {{formDate1.userphone}}</p>
      <p>邮箱: {{formDate1.useremail}}</p>
      <p>爱好: {{formDate1.userlike}}</p>
      <p>
        头像:
        <img :src="src" :style="{'margin-top':'5px','width':'200px','vertical-align':'middle'}" />
      </p>
    </Modal>
    <Modal v-model="modal4" width="300">
      <div :style="{'font-size':'16px'}">确认删除吗？</div>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" :loading="btnloading" @click="yes">确定</Button>
      </div>
    </Modal>
    <Table
      highlight-row
      @on-current-change="handleRowChange"
      :data="data"
      :columns="columns"
      stripe
      border
    ></Table>
    <div style="margin: 10px;overflow: hidden">
      <Page
        :total="count"
        :current="currentpage"
        :page-size="limit"
        @on-change="changePage"
        @on-page-size-change="pageSize"
        show-elevator
        style="float: right"
      ></Page>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Uploader } from "vant";
import { setTimeout } from "timers";

Vue.use(Uploader);
export default {
  name: "sample",
  data() {
    // 自定义验证
    const validateMobile = (rule, value, callback) => {
      if (!Number.isInteger(+value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    return {
      // 按钮加载状态
      btnloading: false,
      schoolid: localStorage.getItem("schoolid"),
      createid: localStorage.getItem("auserid"),
      filekey: "file",
      file: "",
      src: "",
      label: "",
      // img:
      data: [],
      data1: [],
      count: 0,
      currentpage: 1,
      limit: 10,
      modal: false,
      modal1: false,
      modal2: false,
      modal4: false,
      vmodel: "",
      details: {},
      formDate: {
        loginname: "",
        loginpwd: "",
        username: "",
        usersex: '0',
        userphone: "",
        useremail: "",
        schoolid: "",
        userlike: "",
        usertype: "",
        file: ""
      },
      formDate1: {
        loginname: "",
        loginpwd: "",
        username: "",
        usersex: "",
        userphone: "",
        useremail: "",
        schoolid: "",
        userlike: "",
        usertype: "",
        file: ""
      },
      ruleDate: {
        loginname: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        loginpwd: [
          { required: true, message: "密码不能为空" },
          {
            type: "string",
            min: 6,
            mix: 16,
            message: "密码长度为6-16位",
            trigger: "blur"
          }
        ],
        username: [{ required: true, message: "姓名不能为空" }],
        userphone: [{ validator: validateMobile, trigger: "blur" }],
        useremail: [],
        userlike: [],
        usersex: [{ required: true, message: "性别不能为空" }],
        usertype: []
      },
      ruleDate1: {
        loginname: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        loginpwd: [],
        username: [{ required: true, message: "姓名不能为空" }],
        userphone: [
          { validator: validateMobile, trigger: "blur" }
          // { required: true, message: '手机号不能为空'}
        ],

        userlike: [
          // { required: true, message: '爱好不能为空'}
        ],
        usersex: [{ required: true, message: "性别不能为空" }],
        usertype: []
      },
      columns: [
        {
          title: "序号",
          type: "rowNumber",
          width: 70,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.index + (this.currentpage - 1) * this.limit + 1
            );
          }
        },
        {
          title: "姓名",
          key: "username",
          align: "center"
        },
        {
          title: "登录名",
          key: "loginname",
          align: "center"
        },
        {
          title: "性别",
          key: "usersex",
          align: "center",
          render: (h, params) => {
            let usersex = params.row.usersex;
            if (usersex == "1") {
              usersex = "男";
            } else if (usersex == "2") {
              usersex = "女";
            } else {
              usersex = "保密";
            }
            return h("span", usersex);
          }
        },
        {
          title: "操作",
          key: "schoolid",
          align: "center",
          width: 250,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.modal2 = true;
                      // console.log(params.row)
                      this.formDate1 = params.row;
                      this.formDate1.usersex = params.row.usersex.toString();
                      this.formDate1.loginpwd = "";
                      if (
                        params.row.headurl == null ||
                        params.row.headurl == "null"
                      ) {
                        return;
                      } else {
                        this.src = this.$api.showImageUrl + params.row.headurl;
                      }
                      this.userid = params.row.userid;
                      this.get_user();
                    }
                  }
                },
                "详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.modal1 = true;
                      this.formDate1 = params.row;
                      this.formDate1.userid = params.row.userid;
                      this.formDate1.usersex = params.row.usersex.toString();
                      this.formDate1.loginpwd = "";
                      if (
                        params.row.headurl == null ||
                        params.row.headurl == "null"
                      ) {
                        return;
                      } else {
                        this.src = this.$api.showImageUrl + params.row.headurl;
                      }
                      // console.log(params.row)
                      // console.log(this.formDate1)
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.modal4 = true;
                      this.userid = params.row.userid;
                      // console.log(params.row)
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
    vchange(e) {
      this.schoolid = e;
    },
    // 上传文件时
    // uploadProgress(event, file){
    // },
    // 上传成功
    uploadSuccess(res, file) {
      this.getUserlist();
      // clearFiles
      this.$Message.info(res.msg);
    },
    // 上传失败
    uploadError(err, file) {
      this.$Message.error("上传失败");
    },
    // 上传图片
    uploading(event) {
      this.file = event.target.files[0];
      if (event.target.files[0]) {
        let windowURL = window.URL || window.webkitURL;
        this.src = windowURL.createObjectURL(event.target.files[0]);
      }
    },
    // 获取用户
    getUserlist() {
      this.axios
        .post("user/list_user", {
          currentpage: this.currentpage,
          schoolid: this.schoolid
        })
        .then(res => {
          // console.log(res)
          if (res.status === 200 && res.data.code === 0) {
            if (res.data.obj) {
              this.data = res.data.obj;
              this.count = res.data.totalcount;
            }
            if (res.data.totalcount === 0) {
              this.$Message.success(res.data.msg);
            }
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error(this.$api.monmsg);
        });
    },
    handleRowChange(currentRow) {},
    // 添加用户
    ok(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.btnloading = true;
          event.preventDefault();
          let formdata = new FormData();
          formdata.append("file", this.file);
          let config = {
            headers: { "Content-Type": "multipart/form-data" }
          };
          let url = this.$api.baseUrl + "user/save_user";
          formdata.append("loginname", this.formDate.loginname);
          formdata.append("loginpwd", this.formDate.loginpwd);
          formdata.append("username", this.formDate.username);
          formdata.append("usersex", this.formDate.usersex);
          formdata.append("userphone", this.formDate.userphone);
          formdata.append("useremail", this.formDate.useremail);
          formdata.append("userlike", this.formDate.userlike);
          // formdata.append('usertype',this.formDate.usertype)
          formdata.append("schoolid", this.schoolid);
          formdata.append("createid", this.createid);
          let xhr = new XMLHttpRequest();
          xhr.open("post", url, true);
          xhr.send(formdata);
          xhr.onreadystatechange = res => {
            if (xhr.readyState === 4 && xhr.status === 200) {
              xhr.onload = data => {
                let item = JSON.parse(data.target.response);
                if (item.code == 0) {
                  this.modal = !this.modal;
                  this.getUserlist();
                  this.$refs.formDate.resetFields();
                  this.$Message.success(item.msg);
                } else {
                  this.$Message.error(item.msg);
                }
                setTimeout(() => {
                  this.btnloading = false;
                }, 1000);
              };
              xhr.onerror = data => {
                this.$Message.error(this.$api.monmsg);
                this.btnloading = false;
              };
            }
          };
        }
      });
    },
    cancel() {
      this.modal = false;
      this.modal1 = false;
      this.modal4 = false;
      this.src = "";
      if (this.file) {
        this.filekey = Date.parse(new Date()) + "";
      }

      this.$refs.formDate.resetFields();
      this.getUserlist();
    },
    // 编辑用户
    ok1(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.btnloading = true;
          event.preventDefault();
          let formdata1 = new FormData();
          formdata1.append("file", this.file);
          let config = {
            headers: { "Content-Type": "multipart/form-data" }
          };
          let url = this.$api.baseUrl + "user/update_user";
          formdata1.append("userid", this.formDate1.userid);
          formdata1.append("loginname", this.formDate1.loginname);
          formdata1.append("loginpwd", this.formDate1.loginpwd);
          formdata1.append("username", this.formDate1.username);
          formdata1.append("usersex", this.formDate1.usersex);
          formdata1.append("userphone", this.formDate1.userphone);
          formdata1.append("useremail", this.formDate1.useremail);
          formdata1.append("userlike", this.formDate1.userlike);
          formdata1.append("usertype", this.formDate1.usertype);
          formdata1.append("schoolid", this.formDate1.schoolid);
          let xhr = new XMLHttpRequest();
          xhr.open("post", url, true);
          xhr.send(formdata1);
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
              xhr.onload = data => {
                let item = JSON.parse(data.target.response);
                if (item.code == 0) {
                  this.modal1 = !this.modal1;
                  this.getUserlist();
                  this.$Message.success(item.msg);
                } else {
                  // console.info(item)
                  this.$Message.error(item.msg);
                }
                setTimeout(() => {
                  this.btnloading = false;
                }, 1000);
              };
              xhr.onerror = data => {
                this.$Message.error(this.$api.monmsg);
                this.btnloading = false;
              };
            }
          };
        }
      });
    },
    // 页数
    changePage(i) {
      this.currentpage = i;
      this.getUserlist();
    },
    // 条数
    pageSize(i) {
      this.limit = i;
      this.getUserlist();
    },
    // 用户详情
    get_user() {
      this.axios
        .post("user/get_user", { userid: this.userid })
        .then(res => {
          if (res.status == 200 && res.data.code == 0) {
            // console.log(res)
            this.details = res.data.obj;
          }
        })
        .catch(err => {
          this.$Message.error(this.$api.monmsg);
        });
    },
    // 删除用户
    yes() {
      this.btnloading = true;
      this.axios
        .post("user/del_user", { userid: this.userid })
        .then(res => {
          if (res.status == 200 && res.data.code == 0) {
            this.$Message.success(res.data.msg);
            this.modal4 = false;
            if (this.data.length == 1) {
              if (this.currentpage > 1) {
                this.currentpage -= 1;
              }
            }
            this.getUserlist();
          } else {
            this.$Message.error(res.data.msg);
            this.$forceUpdate();
          }
          setTimeout(() => {
            this.btnloading = false;
          });
        })
        .catch(err => {
          this.$Message.error(this.$api.monmsg);
          this.btnloading = false;
        });
    }
  },
  created() {
    this.getUserlist();
    // this.getschoolid()
  },
  components: {},
  computed: {}
};
</script>

<style scoped lang="less">
.ivu-form .ivu-form-item-label {
  text-align: justify !important;
}

.iconlabelUrl {
  width: 80px;
  height: 80px;
}

.ivu-upload .ivu-upload-drag {
  p {
    line-height: 15px !important;
  }
}

.top-r {
  display: flex;
  margin-top: 3px;
  justify-content: flex-start;
}

.ivu-modal-body {
  p {
    margin-left: 140px;
    font-size: 18px;
  }
}

.ivu-form-item-content {
  // img {
  //   display: inline;
  //   width: 180px;
  //   height: 180px;
  // }
}

.down {
  width: 80px;
  height: 30px;
  line-height: 30px;
  color: #666;
  text-align: center;
}
</style>
