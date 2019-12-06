<template>
  <div class="">
    <div :style="{'height':'40px'}">
      <Button type="primary" @click="modal=true" :style="{'margin':'-3px 0 5px','float':'right'}">
        添加学校
      </Button>
    </div>
    <div>
      <Modal
      v-model="modal"
      title="添加学校"
      @on-cancel="cancel" width="450">
      <Form ref="formDate" :model="formDate" :rules="ruleDate" :label-width="80">
        <FormItem label="学校名称" prop="schoolname">
          <Input v-model="formDate.schoolname"/>
        </FormItem>
        <FormItem label="学校地址" prop="schooladdress">
          <Input v-model="formDate.schooladdress"/>
        </FormItem>
        <FormItem label="负责人" prop="fzrname">
          <Input v-model="formDate.fzrname"/>
        </FormItem>
        <FormItem label="手机号" prop="fzrphone">
          <Input  type="text" :maxlength="11" v-model="formDate.fzrphone"></Input>
          <!-- <Input type='tel' ></Input> -->
          <!-- <Input :maxlength="11" v-model="formDate.fzrphone"/> -->
        </FormItem>
        <FormItem label="所属学段" prop="levelid">
          <Select placeholder="请选择学段" v-model="formDate.levelid" :style="{}" @on-change="levelchange" >
            <Option v-for="item in data1" :value="item.levelid" :key="item.levelid">{{ item.levelname }}</Option>
          </Select>
        </FormItem>
        <FormItem label="套卷题量" prop="papernum">
          <InputNumber @keyup.native="changeNumber" :max="9999" :min="1" v-model="formDate.papernum" :style="{'width':'338px'}"></InputNumber>
        </FormItem>
        <FormItem label="备注" prop="comm">
          <Input v-model="formDate.comm"/>
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
      title="修改学校"  @on-cancel="cancel" width="450">
      <Form ref="formDate1" :model="formDate1" :rules="ruleDate" :label-width="80">
        <FormItem label="学校名称" prop="schoolname">
          <Input v-model="formDate1.schoolname"/>
        </FormItem>
        <FormItem label="学校地址" prop="schooladdress">
          <Input  v-model="formDate1.schooladdress"/>
        </FormItem>
        <FormItem label="负责人" prop="fzrname">
          <Input v-model="formDate1.fzrname"/>
        </FormItem>
        <FormItem label="手机号" prop="fzrphone">
          <Input type="text" :maxlength="11" v-model="formDate1.fzrphone" ></Input>
        </FormItem>
        <FormItem label="所属学段" prop="levelid">
          <Select placeholder="请选择学段" v-model="formDate1.levelid" :style="{}" @on-change="levelchange" >
            <Option v-for="item in data1" :value="item.levelid" :key="item.levelid">{{ item.levelname }}</Option>
          </Select>
        </FormItem>
        <FormItem label="套卷题量" prop="papernum">
          <InputNumber @keyup.native="changeNumber1" :max="9999" :min="1" v-model="formDate1.papernum" :style="{'width':'338px'}"></InputNumber>
        </FormItem>
        <FormItem label="备注" prop="comm">
          <Input v-model="formDate1.comm"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary"  @click="ok1('formDate1')"
        >确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="modal2"
      title="学校详情"
      @on-cancel="cancel" width="480">
      <p>学校名称:{{details.schoolname}}</p>
      <p>学校地址:{{details.schooladdress}}</p>
      <p>所属学段:{{details.levelname}}</p>
      <p>学校负责人:{{details.fzrname}}</p>
      <p>负责人手机号:{{details.fzrphone}}</p>
      <p>试题总量:{{details.papernum}}</p>
      <p>备注:{{details.comm}}</p>
      <div slot="footer"></div>
    </Modal>

    <Modal v-model="modal4" @on-ok="yes"  width="300">
      <div :style="{'font-size':'16px'}">确认删除吗？</div>
    </Modal>
    <Table highlight-row @on-current-change="handleRowChange" :data="data" :columns="columns" stripe border ></Table>
    <div style="margin: 10px;overflow: hidden">
        <Page :total="count" :current="currentpage" :page-size="limit" @on-change="changePage" @on-page-size-change="pageSize" show-elevator style="float: right" ></Page>
    </div>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    // 自定义验证
    const validateMobile = (rule, value, callback) => {
      if (!Number.isInteger(+value)) {
          callback(new Error('请输入正确的手机号'));
      } else {
          callback();
      }
    };
    return {
      levelid:localStorage.getItem('levelid'),
      data:[], 
      data1:[], 
      count:0,
      currentpage:1,
      limit:10,
      modal:false,
      modal1:false,
      modal2:false,
      modal4:false,
      details:[],
      formDate: {
        schoolname: '',
        schooladdress:'',
        fzrname:'',
        fzrphone:'',
        papernum:10,
        comm:'',
        levelid:''
      },
      formDate1: {
        schoolname: '',
        schooladdress:'',
        fzrname:'',
        fzrphone:'',
        papernum:10,
        comm:'',
        schoolid:'',
        levelid:''
      },
      ruleDate: {
        schoolname: [
          { required: true, message: '学校名称不能为空'},
          { type: 'string', max: 35, message: '学校名称不能超过35个字符', trigger: 'blur' }
        ],
        schooladdress: [
          { required: true, message: '学校地址不能为空'},
          { type: 'string', max: 50, message: '学校地址不能超过50个字符', trigger: 'blur' }
        ],
        fzrname: [
          { required: true, message: '负责人不能为空'},
          { type: 'string', max: 7, message: '负责人名字不能超过7个字符', trigger: 'blur' }
        ],
        fzrphone: [
          { required: true, message: '手机号不能为空'},
          {validator: validateMobile, trigger: 'blur'}
        ],
        papernum: [
          { required: true, message: '套卷题量不能为空'}
        ],
        levelid: [
          { required: true, message: '所属学段不能为空'}
        ],
      },
      columns: [
        {
          title: '序号',
          type: 'rowNumber',
          width: 72,
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + (this.currentpage- 1) * this.limit + 1);
          }
        },
        {
          title: '学校名称',
          key: 'schoolname',
          align: 'center'
        },
        {
          title: '学校地址',
          key: 'schooladdress',
          align: 'center',
        },
        {
          title: '学校负责人',
          key: 'fzrname',
          align: 'center',
          width:'98'
        },
        {
          title: '学段',
          key: 'levelname',
          align: 'center',
          width:'75'
        },
        {
          title: '手机号',
          key: 'fzrphone',
          align: 'center',
          width:'120'
        },
        {
          title: '试题总数',
          key: 'papernum',
          align: 'center',
          width:'85'
        },  
        {
          title: '操作',
          key: 'schoolid',
          align: 'center',
          width:'200',
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
                    this.modal2 = true
                    this.axios.post('school/get_school',{schoolid:params.row.schoolid}).then(res=>{
                      this.details = res.data.obj
                    })
                  }
                }
            }, '详情'),
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
                    this.modal4 =true
                    this.schoolid = params.row.schoolid
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
    // input输入框
    changeNumber() {
      let str = '' + this.formDate.papernum;
      if (str.indexOf('.') != -1) {
        let arr = str.split('');
        arr.splice(arr.length - 1);
        let str2 = arr.join('');
        this.formDate.papernum = +str2;
      }
    },
    changeNumber1() {
      let str = '' + this.formDate1.papernum;
      if (str.indexOf('.') != -1) {
        let arr = str.split('');
        arr.splice(arr.length - 1);
        let str2 = arr.join('');
        this.formDate1.papernum = +str2;
      }
    },
    // 获取学段
    getLevel(){
      this.axios.post('level/list_level')
      .then(res=>{
        if(res.status ==200 && res.data.code==0){
          this.data1 = res.data.obj
        }
      })
      .catch(err=> {
        this.$Message.error(this.$api.monmsg)
      })
    },
    levelchange(e){
      this.formDate.levelid = e
    },
    handleRowChange(currentRow){
    },
    // 获取学校列表
    getSchool(){
      this.axios
      .post('school/list_school',{currentpage:this.currentpage})
      .then(res=>{
        console.log(res)
        if (res.status ==200 && res.data.code==0) {
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
      this.getSchool()
    },
    // 条数
    pageSize(i){
      this.limit = i
      this.getSchool()
    },
    // 添加学校
    ok(name) {
      this.$refs[name].validate((valid) => {
      if (valid) {
        this.axios
        .post('school/save_school',this.formDate)
        .then(res=>{
          if(res.status ==200 && res.data.code==0){
            this.$Message.success(res.data.msg)
            this.modal = !this.modal
            this.getSchool()
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
    cancel() {
      this.modal = false
      this.modal1 = false
      this.$refs.formDate.resetFields()
      this.getSchool()
    },
    // 修改学校
    ok1(name) {
      this.$refs[name].validate((valid) => {
      if (valid) {
        this.axios.post('school/update_school',this.formDate1)
        .then(res=>{
          if(res.status ==200 && res.data.code==0){
            this.$Message.success(res.data.msg)
            this.modal1 = false
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
    // 删除学校
    yes(){
      this.axios.post('school/del_school',{schoolid:this.schoolid}).then(res=>{
        if(res.status ==200 && res.data.code==0){
        this.$Message.success(res.data.msg)
        if (this.data.length == 1) {
            this.data=[]
            if (this.currentpage > 1) {
                this.currentpage -= 1;
            }
        }
        this.getSchool()   
        }else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  components: {
  },
  created(){
    this.getSchool()
    this.getLevel()
  }
}
</script>

<style scoped lang="less">
.ivu-modal,
.ivu-modal-content {
  width: 200px !important;
}
.ivu-modal-body {
  p {
    margin-left: 100px;
    font-size: 18px;
  }
}
</style>
