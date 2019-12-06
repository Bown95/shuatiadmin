<template>
  <div>
    <!-- <div :style="{'height':'40px','margin-top':'3px'}">
      <Button type="primary" @click="modal=true" :style="{'margin':'-3px 0 5px','float':'right'}">
        添加科目
      </Button>
      <Select ref="xform" placeholder="请选择学段" v-model="xmodel" :style="{'width':'180px','margin-bottom':'15px'}" @on-change="xchange" >
        <Option v-for="(item,i) in data1" :value="item.levelid" :key="i">{{ item.levelname }}</Option>
      </Select>
      <Button type="primary" @click="getSubject1()" :style="{'margin-left':'15px','margin-bottom':'15px'}">
        搜索
      </Button>
    </div> -->
    <div :style="{'height':'40px'}">
      <Button type="primary" @click="modal=true" :style="{'margin':'-3px 0 5px','float':'right'}">
        添加管理用户
      </Button>
    </div>
      
    <div>
      <Modal
      v-model="modal"
      title="添加管理用户" @on-cancel="cancel" width="450">
      <Form ref="formDate" :model="formDate" :rules="ruleDate" :label-width="80">
        <FormItem label="登录账号" prop="aloginname">
          <Input :maxlength="25" v-model="formDate.aloginname"/>
        </FormItem>
        <FormItem label="登录密码" prop="aloginpwd">
          <Input type="password" v-model="formDate.aloginpwd"></Input>
        </FormItem>
        <FormItem label="姓名" prop="ausername">
          <Input v-model="formDate.ausername"/>
        </FormItem>
        <FormItem label="学校" prop="schoolid">
          <Select placeholder="请选择学校" v-model="formDate.schoolid" :style="{}" @on-change="vchange" >
            <Option v-for="item in data1" :value="item.schoolid" :key="item.schoolid">{{ item.schoolname }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary"  @click="ok('formDate')"
        >确定</Button>
      </div>
    </Modal>
      <Modal
      v-model="modal1"
      title="修改管理用户" @on-cancel="cancel" width="450">
      <Form ref="formDate1" :model="formDate1" :rules="ruleDate1" :label-width="80">
        <FormItem label="登录账号" prop="aloginname">
          <Input v-model="formDate1.aloginname"/>
        </FormItem>
        <FormItem label="登录密码" prop="aloginpwd">
          <Input type="password" v-model="formDate1.aloginpwd"></Input>
        </FormItem>
        <FormItem label="姓名" prop="ausername">
          <Input v-model="formDate1.ausername"/>
        </FormItem>
        <FormItem label="学校" prop="schoolid">
          <Select placeholder="请选择学校" v-model="formDate1.schoolid" :style="{}" @on-change="vchange" >
            <Option v-for="item in data1" :value="item.schoolid" :key="item.schoolid">{{ item.schoolname }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary"  @click="ok1('formDate1')"
        >确定</Button>
      </div>
    </Modal>
    <Modal v-model="modal4" @on-ok="yes"  width="300">
      <div :style="{'font-size':'16px'}">确认删除吗？</div>
    </Modal>
    <Table highlight-row :data="data" :columns="columns" stripe border></Table>
    <div style="margin: 10px;overflow: hidden">
      <Page :total="count" :current="currentpage" :page-size="limit" @on-change="changePage" @on-page-size-change="pageSize" show-elevator style="float: right" ></Page>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      schoolid:localStorage.getItem('schoolid'),
      levelid: localStorage.getItem('levelid'),
      createid:localStorage.getItem('auserid'),
      data:[],
      data1:[], 
      count:0,
      currentpage:1,
      limit:10,
      modal:false,
      modal1:false,
      modal4:false,
      auserid:'',
      vmodel: '',
      formDate: {
        aloginname: '',
        aloginpwd:'',
        ausername: '',
        schoolid:''
      },
      formDate1: {
        aloginname: '',
        aloginpwd:'',
        ausername: '',
        schoolid:''
      },
      ruleDate: {
        aloginname: [
          { required: true, message: '账号不能为空',trigger: 'blur'}
        ],
        aloginpwd: [
          { required: true, message: '密码不能为空'},
          {type: 'string', min: 6, mix: 16, message: '密码长度为6-16位', trigger: 'blur'}
        ],
        ausername: [
          { required: true, message: '姓名不能为空'}
        ],
        ausername: [
          { required: true, message: '姓名不能为空'}
        ],
        schoolid: [
          { required: true,message: '学校不能为空'}
        ],
      },
      ruleDate1: {
        aloginname: [
          { required: true, message: '账号不能为空',trigger: 'blur'}
        ],
        aloginpwd: [
          // { required: true, message: '密码不能为空'}
          {type: 'string', min: 6, mix: 16, message: '密码长度为6-16位', trigger: 'blur'}
        ],
        ausername: [
          { required: true, message: '姓名不能为空'}
        ],
        ausername: [
          { required: true, message: '姓名不能为空'}
        ],
        schoolid: [
          { required: true,message: '学校不能为空'}
        ],
      },
      columns: [
        {
          title: '序号',
          type: 'rowNumber',
          width: 60,
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + (this.currentpage- 1) * this.limit + 1);
          }
        },
        {
          title: '学校',
          key: 'schoolname',
          align: 'center'
        },
        {
          title: '姓名',
          key: 'ausername',
          align: 'center'
        },
        {
          title: '账号',
          key: 'aloginname',
          align: 'center'
        },
        {
          title: '操作',
          key: 'auserid',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.modal1 = true
                    this.formDate1 = params.row
                    this.formDate1.schoolid = params.row.schoolid
                    this.formDate1.aloginpwd = ''
                  }
                }
            }, '修改'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  this.modal4= true
                  this.auserid = params.row.auserid
                }
              }
            }, '删除')
          ]);
        }
        },
      ],
    }
  },
  methods:{
    // 获取学校id
    getschoolid(){
      this.axios.post('school/list_school',{currentpage:this.currentpage})
      .then(res=>{
        // console.log(res)
        if(res.status ==200 && res.data.code==0){
          this.data1 = res.data.obj;
        }
      })
    },
    vchange(e){
      this.schoolid = e
    },
    // 获取用户列表
    getAdminuser(){
      this.axios.post('adminuser/list_adminuser',{currentpage:this.currentpage})
      .then(res=>{
        console.log(res)
        if(res.status ==200 && res.data.code==0){
          this.data = res.data.obj
          this.count = res.data.totalcount
        }else {
          this.$Message.error(res.data.msg)
        }
      })
      .catch(err=> {
        this.$Message.error(this.$api.monmsg)
      })
    },
    // 页数
    changePage (i) {
      this.currentpage = i
      this.getAdminuser()
    },
    // 条数
    pageSize(i){
      this.limit = i
      this.getAdminuser()
    },
    // 添加用户
    ok(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
        this.axios.post('adminuser/save_adminuser',{
          aloginname:this.formDate.aloginname,
          aloginpwd:this.formDate.aloginpwd,
          ausername:this.formDate.ausername,
          schoolid:this.formDate.schoolid,
          createid:this.createid
        })
        .then(res=>{
          if(res.status ==200 && res.data.code==0){
            this.modal = false
            this.$Message.success(res.data.msg)
            this.getAdminuser()
            this.$refs.formDate.resetFields()
          }else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err=> {
          this.$Message.error(this.$api.monmsg)
        })        
        } 
      })
    },
    ok1(name) {
      this.$refs[name].validate((valid) => {
      if (valid) {
      this.axios.post('adminuser/update_adminuser',{
        auserid:this.formDate1.auserid,
        aloginname:this.formDate1.aloginname,
        aloginpwd:this.formDate1.aloginpwd,
        ausername:this.formDate1.ausername,
        schoolid:this.formDate1.schoolid,
        })
        .then(res=>{
          if(res.status ==200 && res.data.code==0){
            this.getAdminuser()
            this.$refs.formDate.resetFields()
            this.modal1 = false
            this.$Message.success(res.data.msg)
          }else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err=> {
          this.$Message.error(this.$api.monmsg)
        }) 
        }
      })
    },
    cancel() {
      this.modal = false
      this.modal1 = false
      this.$refs.formDate.resetFields()
      this.getAdminuser()
    },
    yes(){
      this.axios.post('adminuser/del_adminuser',{auserid:this.auserid})
      .then(res=>{
        if(res.status ==200 && res.data.code==0){
        this.$Message.success(res.data.msg)
        if (this.data.length == 1) {
            this.data=[]
            if (this.currentpage > 1) {
                this.currentpage -= 1;
            }
        }
        this.getAdminuser()
        }else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  components: {

  },
  created(){
    this.getAdminuser()
    this.getschoolid()
  }
}
</script>

<style scoped lang="less">
.ivu-modal,
.ivu-modal-content{
  width: 450px !important;
  
}
</style>
