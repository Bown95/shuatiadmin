<template>
  <div class="">
    <div :style="{'height':'40px','margin-top':'3px'}">
      <Button type="primary" @click="modal=true" :style="{'margin':'-3px 0 5px','float':'right'}">
        添加教材
      </Button>
      <Select ref="cxform" placeholder="请选择科目" v-model="kmodel" :style="{'width':'180px','margin-bottom':'15px'}" @on-change="kchange" >
        <Option v-for="(item,i) in data1" :value="item.subjectid" :key="i">{{ item.subjectname }}</Option>
      </Select>
      <Button type="primary" @click="getBook()" :style="{'margin-left':'15px','margin-bottom':'15px'}">
        搜索
      </Button>
    </div>
    <Modal
      v-model="modal"
      title="添加教材" @on-cancel="cancel" width="450">
      <Form ref="formDate" :model="formDate" :rules="ruleDate" :label-width="80">
        <FormItem label="科目" prop="subjectid">
        <Select ref="kemu" placeholder="请选择科目" v-model="formDate.subjectid" :style="{}" @on-change="kchange" >
          <Option v-for="(item,i) in data1" :value="item.subjectid" :key="i">{{ item.subjectname }}</Option>
        </Select>
        </FormItem>
        <FormItem label="教材名称" prop="bookname">
          <Input v-model="formDate.bookname"/>
        </FormItem>
        <FormItem label="教材排序" prop="bookorder">
          <InputNumber @keyup.native="changeNumber" :max="1000" :min="1" v-model="formDate.bookorder" :style="{'width':'338px'}"></InputNumber>
          <!-- <Input /> -->
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
      title="修改教材"  @on-cancel="cancel1"  width="450">
      <Form ref="formDate1" :model="formDate1" :rules="ruleDate" :label-width="80">
<!-- 
        <FormItem label="科目" prop="subjectid">
        <Select placeholder="请选择科目" v-model="formDate1.subjectid" :style="{}" @on-change="kchange" >
          <Option v-for="(item,i) in data1" :value="item.subjectid" :key="i">{{ item.subjectname }}</Option>
        </Select>
        </FormItem> -->
        <FormItem label="教材名称" prop="bookname">
          <Input v-model="formDate1.bookname"/>
        </FormItem>
        <FormItem label="教材排序" prop="bookorder">
          <InputNumber @keyup.native="changeNumber1" :max="1000" :min="1" v-model="formDate1.bookorder" :style="{'width':'338px'}"></InputNumber>
          <!-- <Input /> -->
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
    <Table highlight-row @on-current-change="handleRowChange" :data="data" :columns="columns" stripe border></Table>
    <div style="margin: 10px;overflow: hidden">
        <!-- <Page :total="count" :current="page" :page-size="limit" @on-change="changePage" @on-page-size-change="pageSize" show-elevator style="float: right" ></Page> -->
    </div>
  </div>
</template>

<script>
import {formatDate} from '@/api'
export default {
  data() {
    return {
      schoolid:localStorage.getItem('schoolid'),
      levelid: localStorage.getItem('levelid'),
      createid:localStorage.getItem('auserid'),
      data:[],
      data1:[],
      data2:[],
      count:0,
      page:1,
      limit:10,
      modal:false,
      modal1:false,
      modal4:false,
      kmodel:'',
      xmodel:'',
      formDate: {
        bookname: '',
        bookorder: 1,
        subjectid:'',
        schoolid:'',
      },
      formDate1: {
        bookid:'',
        bookname: '',
        bookorder: 1,
        // schoolid:'',
        subjectid:''
      },
      ruleDate: {
        bookname: [
          { required: true, message: '教材名称不能为空'}
        ],
        bookorder: [
          { required: true, message: '教材排序不能为空'}
        ],
        subjectid: [
          { required: true, message: '科目不能为空'}
        ],
      },

      columns: [
        {
          title: '序号',
          type: 'rowNumber',
          width: 60,
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + (this.page- 1) * this.limit + 1);
          }
        },
        {
          title: '学段',
          key: 'levelname',
          align: 'center'
        },
        {
          title: '教材名称',
          align: 'left',
          width: 280,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.subjectname),
              h('span', ' - '),
              h('span', params.row.bookname),
            ])
          }
        },
        {
          title: '教材排序',
          key: 'bookorder',
          align: 'center',
          sortable: true
        },
        {
          title: '操作时间',
          key: 'createtime',
          align: 'center',
          render: (h,params)=>{
            return h('div',
              formatDate(new Date(params.row.createtime*1000),'yyyy-MM-dd hh:mm:ss')
            )
          }
        },
        {
          title: '操作',
          key: 'operation',
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
                    this.bookid= params.row.bookid
                    this.levelid=params.row.levelid
                    this.subjectid=params.row.subjectid
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
      let str = '' + this.formDate.bookorder;
      if (str.indexOf('.') != -1) {
        let arr = str.split('');
        arr.splice(arr.length - 1);
        let str2 = arr.join('');
        this.formDate.bookorder = +str2;
      }
    },
    changeNumber1() {
      let str = '' + this.formDate1.bookorder;
      if (str.indexOf('.') != -1) {
        let arr = str.split('');
        arr.splice(arr.length - 1);
        let str2 = arr.join('');
        this.formDate1.bookorder = +str2;
      }
    },
    // 获取科目
    getSubject(){
      this.axios.post('subject/list_subject',{
        schoolid:this.schoolid,
        levelid:this.levelid
      })
      .then(res=>{
        if(res.status ==200 && res.data.code==0){
          if (res.data.obj == null) {
            this.$Message.success(res.data.msg)
            return
          }
          this.data1 = res.data.obj
          this.kmodel = this.data1[0].subjectid
          this.getBook()
        }
      })
      .catch(err=> {
        this.$Message.error(this.$api.monmsg)
      })
    },
    // 科目id
    kchange(e){
      this.subjectid = e
    },
    // 获取教材
    getBook(){
      this.axios.post('book/list_book',{
      subjectid:this.kmodel,
      schoolid:this.schoolid
      })
      .then(res=>{
        if(res.status ==200 && res.data.code==0){
        if(res.data.obj){
            this.data = res.data.obj;
            this.count = res.data.obj.length
        }
        // if (res.data.obj.length === 0) {
        //     this.$Message.success(res.data.msg)
        // }
        }else {
          this.$Message.error(res.data.msg)
        }
      })
      .catch(err=> {
        this.$Message.error(this.$api.monmsg)
      })
    },
    handleRowChange(currentRow){
    },
    // 页数
    changePage (i) {
      this.page = i
      this.getBook()
    },
    // 条数
    pageSize(i){
      this.limit = i
      this.getBook()
    },
    // 添加教材
    ok(name) {
    this.$refs[name].validate((valid) => {
    if (valid) {
      this.axios.post('book/save_book',{
        bookname:this.formDate.bookname,
        bookorder:this.formDate.bookorder,
        subjectid:this.formDate.subjectid,
        schoolid:this.schoolid,
        levelid:this.levelid,
        createid:this.createid,
      })
      .then(res=>{
        if(res.status ==200 && res.data.code==0){
          this.modal = false
          this.getBook()
          this.$Message.success(res.data.msg)
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
      this.getBook()
    },
    cancel1() {
      this.modal = false
      this.modal1 = false
      this.getBook()
      this.$refs.formDate1.resetFields()
    },
    // 修改教材
    ok1(name) {
    this.$refs[name].validate((valid) => {
    if (valid) {
      this.axios.post('book/update_book',{
      bookid:this.formDate1.bookid,
      bookname:this.formDate1.bookname,
      bookorder:this.formDate1.bookorder,
      schoolid:this.schoolid
      })
      .then(res=>{
        if(res.status ==200 && res.data.code==0){
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
    yes(){
    this.axios.post('book/del_book',{
      bookid:this.bookid,
      levelid:this.levelid,
      subjectid:this.subjectid
      })
      .then(res=>{
        if(res.status ==200 && res.data.code==0){
          this.$Message.success(res.data.msg)
          this.getBook()
          // this.$Message.success(res.data.msg)
          
        }else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  created(){
    // this.getLevel()
    this.getSubject()
    // this.getBook()
  },
  mounted(){
  },
  beforeUpdate(){
  },
  updated(){
    // this.getBook()
  },
  mounted(){
    // this.getBook()
  }
}
</script>

<style scoped lang="less">
  .ivu-modal {
    width: 450px !important;
  }
  .ivu-modal-content {
    width: 450px !important;
  }
</style>
