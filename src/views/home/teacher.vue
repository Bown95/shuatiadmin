<template>
  <div class>
    <div :style="{'height':'40px'}">
      <Button
        type="primary"
        @click="modal=true"
        :style="{'margin':'-3px 0 5px','float':'right'}"
      >添加老师</Button>
      <Input
        search
        enter-button="搜索"
        placeholder="请输入关键字"
        v-model="cxmodel"
        :style="{'width':'230px'}"
        @on-search="getteacher"
      />
    </div>
    <div>
      <Modal v-model="modal" title="添加教师" @on-cancel="cancel" width="450">
        <Form ref="formDate" :model="formDate" :rules="ruleDate" :label-width="80">
          <FormItem label="登陆账号" prop="aloginname">
            <Input :maxlength="25" v-model="formDate.aloginname" />
          </FormItem>
          <FormItem label="密码" prop="aloginpwd">
            <Input  v-model="formDate.aloginpwd" />
          </FormItem>
          <FormItem label="姓名" prop="ausername">
            <Input v-model="formDate.ausername" />
          </FormItem>
        </Form>
        <Modal v-model="modal4" @on-ok="yes" width="300">
          <div :style="{'font-size':'16px'}">确认删除吗？</div>
          <div slot="footer">
            <Button type="text" @click="cancel">取消</Button>
            <Button type="primary" :loading="btnloading" @click="yes">确定</Button>
          </div>
        </Modal>
        <div slot="footer">
          <Button type="text" @click="cancel">取消</Button>
          <Button type="primary" :loading="btnloading" @click="ok('formDate')">确定</Button>
        </div>
      </Modal>
      <Modal v-model="modal1" title="修改教师信息" @on-cancel="cancel" width="450">
        <Form ref="formDate1" :model="formDate1" :rules="ruleDate1" :label-width="80">
          <FormItem label="登陆账号" prop="aloginname">
            <Input :maxlength="25" v-model="formDate1.aloginname" />
          </FormItem>
          <FormItem label="密码" prop="aloginpwd">
            <Input placeholder="不输入,使用原密码!" v-model="formDate1.aloginpwd" />
          </FormItem>
          <FormItem label="姓名" prop="ausername">
            <Input v-model="formDate1.ausername" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" @click="cancel">取消</Button>
          <Button type="primary" :loading="btnloading" @click="ok1('formDate1')">确定</Button>
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
  </div>
</template>

<script>
import { formatDate } from "@/api";
import { truncate } from "fs";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      schoolid: localStorage.getItem("schoolid"),
      createid: localStorage.getItem("auserid"),
      // 按钮加载状态
      btnloading: false,
      data: [],
      count: 0,
      currentpage: 1,
      limit: 10,
      modal: false,
      modal1: false,
      modal4: false,
      cxmodel: "",
      formDate: {
        aloginname: "",
        aloginpwd: "",
        ausername: ""
      },
      formDate1: {
        aloginname: "",
        aloginpwd: "",
        ausername: ""
      },
      ruleDate: {
        aloginname: [{ required: true, message: "账号不能为空" }],
        aloginpwd: [{ required: true, message: "密码不能为空" }],
        ausername: [{ required: true, message: "姓名不能为空" }]
      },
      ruleDate1: {
        aloginname: [{ required: true, message: "账号不能为空" }],
        aloginpwd: [
          //   { required: true, message: '密码不能为空'}
        ],
        ausername: [{ required: true, message: "姓名不能为空" }]
      },
      columns: [
        {
          title: "序号",
          type: "rowNumber",
          width: 60,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.index + (this.currentpage - 1) * this.limit + 1
            );
          }
        },
        {
          title: "教师名字",
          key: "ausername",
          align: "center"
          //   sortable: true
        },
        {
          title: "账号",
          key: "aloginname",
          align: "center"
        },
        {
          title: "操作时间",
          key: "createtime",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              formatDate(
                new Date(params.row.createtime * 1000),
                "yyyy-MM-dd hh:mm:ss"
              )
            );
          }
        },
        {
          title: "操作",
          key: "levelid",
          align: "center",
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
                      this.modal1 = true;
                      this.formDate1 = params.row;
                      this.formDate1.aloginpwd = "";
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
                      this.auserid = params.row.auserid;
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
    // 获取教师
    getteacher() {
      this.axios
        .post("adminuser/list_teacher", {
          currentpage: this.currentpage,
          schoolid: this.schoolid,
          ausername: this.cxmodel
        })
        .then(res => {
          console.log(res)
          if (res.status == 200 && res.data.code == 0) {
            if (res.data.obj) {
              this.data = res.data.obj;
              this.count = res.data.totalcount;
            }
            // console.info(this.data.length)
            if (res.data.totalcount === null) {
              this.data=[]
              this.$Message.success(res.data.msg);
            }
          }
        })
        .catch(err => {
          this.$Message.error(this.$api.monmsg);
        });
    },
    handleRowChange(currentRow) {},
    // 页数
    changePage(i) {
      this.currentpage = i;
      this.getteacher();
    },
    // 条数
    pageSize(i) {
      this.limit = i;
      this.getteacher();
    },
    // 添加教师
    ok(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // 开启按钮加载
          this.btnloading = true;
          this.axios
            .post("adminuser/save_teacher", {
              aloginname: this.formDate.aloginname,
              aloginpwd: this.formDate.aloginpwd,
              ausername: this.formDate.ausername,
              schoolid: this.schoolid,
              createid: this.createid
            })
            .then(res => {
              if (res.status == 200 && res.data.code == 0) {
                this.getteacher();
                this.$refs.formDate.resetFields();
                this.modal = false;
                this.$Message.success(res.data.msg);
              } else {
                this.$Message.error(res.data.msg);
              }
              // 一秒延迟后 关闭 按钮加载
              setTimeout(() => {
                this.btnloading = false;
              }, 1000);
            })
            .catch(err => {
              this.$Message.error(this.$api.monmsg);
              this.btnloading = false;
            });
        }
      });
    },
    cancel() {
      this.modal4 = false;

      this.modal1 = false;
      this.modal = false;
      this.$refs.formDate.resetFields();
      this.getteacher();
    },
    // 修改
    ok1(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.btnloading = true;
          this.axios
            .post("adminuser/update_adminuser", {
              aloginname: this.formDate1.aloginname,
              aloginpwd: this.formDate1.aloginpwd,
              ausername: this.formDate1.ausername,
              auserid: this.formDate1.auserid
            })
            .then(res => {
              if (res.status == 200 && res.data.code == 0) {
                this.modal1 = false;
                this.$Message.success(res.data.msg);
              } else {
                this.$Message.error(res.data.msg);
              }
              setTimeout(() => {
                this.btnloading = false;
              }, 1000);
            })
            .catch(err => {
              this.$Message.error(this.$api.monmsg);
              this.btnloading = false;
            });
        }
      });
    },
    // 删除
    yes() {
      this.btnloading = true;
      this.axios
        .post("adminuser/del_adminuser", { auserid: this.auserid })
        .then(res => {
          if (res.status == 200 && res.data.code == 0) {
            this.$Message.success(res.data.msg);
            this.modal4 = false;
            if (this.data.length == 1) {
              this.data = [];
              if (this.currentpage > 1) {
                this.currentpage -= 1;
              }
            }
            this.getteacher();
            setTimeout(() => {
              this.btnloading = false;
            }, 1000);
          } else {
            this.$Message.error(res.data.msg);
            this.btnloading = false;
          }
        });
    }
  },
  created() {
    this.getteacher();
  }
};
</script>

<style scoped lang="less">
.ivu-modal {
  width: 450px !important;
}
.ivu-modal-content {
  width: 450px !important;
}
</style>
