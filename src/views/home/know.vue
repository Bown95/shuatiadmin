<template>
  <div>
    <div class="top">
      <div :style="{'height':'40px','margin-top':'3px'}">
        <Button type="primary" @click="modal=true" :style="{'margin':'0 0 5px 0','float':'right'}">
          添加知识点
        </Button>
        <div class="top-r">
        <Select placeholder="请选择科目" v-model="kmodel" :style="{'width':'200px','margin-right':'15px'}" @on-change="kchange" >
          <Option v-for="(item,i) in data4" :value="item.subjectid" :key="i">{{ item.subjectname }}</Option>
        </Select>
        <Input search enter-button="搜索" placeholder="请输入关键字" v-model="cxmodel" :style="{'width':'230px','margin-left': '5px'}" @on-search="search"/>
      </div>
    </div>   
    </div>
    <Modal
      v-model="modal"
      title="添加知识点" @on-cancel="cancel" width="460">
      <Form ref="formDate" :model="formDate" :rules="ruleDate" :label-width="85">
        <FormItem label="科目" prop="subjectid">
          <Select placeholder="请选择科目" v-model="formDate.subjectid" :style="{}" @on-change="kchange" >
            <Option v-for="(item,i) in data4" :value="item.subjectid" :key="i">{{ item.subjectname }}</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="所属知识点" prop="knowpid">
          <Select placeholder="请选择所属知识点" v-model="formDate.knowpid" :style="{}" @on-change="zschange" >
            <Option :value="0">请选择所属知识点</Option>
          </Select>
        </FormItem> -->
        <FormItem label="所属知识点" prop="knowpid">
          <Cascader :data="know" v-model="formDate.knowpid" change-on-select></Cascader>
          <!-- <Option v-for="(item,i) in data" :value="item.directorid" :key="i">{{ item.directorname }}</Option> -->
        </FormItem>
        <FormItem label="知识点节点">
          <RadioGroup v-model="formDate.leaf">
            <Radio label="0">
              <span>否</span>
            </Radio>
            <Radio label="1">
              <span>是</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="知识点名称" prop="knowname">
          <Input v-model="formDate.knowname"/>
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
      title="编辑知识点"
      @on-ok="ok1"
      @on-cancel="cancel" width="460">
      <Form ref="formDate1" :model="formDate1" :rules="ruleDate" :label-width="85">
        <FormItem label="科目" prop="subjectid">
          <Select placeholder="请选择科目" v-model="formDate1.subjectid" :style="{}" @on-change="kchange" >
            <Option v-for="(item,i) in data4" :value="item.subjectid" :key="i">{{ item.subjectname }}</Option>
          </Select>
        </FormItem>
        <FormItem label="所属知识点" prop="knowpid">
          <Select placeholder="请选择所属知识点" v-model="formDate1.knowpid" :style="{}" @on-change="zschange" >
            <Option :value=0>请选择所属知识点</Option>
            <!-- <Option v-for="(item,i) in data" :value="item.directorid" :key="i">{{ item.directorname }}</Option> -->
          </Select>
        </FormItem>
        <FormItem label="知识点名称" prop="knowname">
          <Input v-model="formDate1.knowname"/>
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
    <Table highlight-row @on-current-change="handleRowChange" :data="data" :columns="columns" stripe border ></Table>
    <!-- <div style="margin: 10px;overflow: hidden">
        <Page :total="count" :current="currentpage" :page-size="limit" @on-change="changePage" @on-page-size-change="pageSize" show-elevator show-sizer style="float: right" ></Page>
    </div> -->
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
      data3:[], 
      data4:[],
      know:[],
      count:0,
      currentpage:1,
      limit:10,
      modal:false,
      modal1:false,
      modal4:false,
      xmodel:'',
      kmodel:'',
      cxmodel:'',
      formDate: {
        knowname: '',
        // createid:'',
        // schoolid:'',
        subjectid:'',
        knowpid:[],
        leaf: "0"
      },
      formDate1: {
        knowname: '',
        // createid:'',
        subjectid:'',
        // schoolid:'',
        knowpid:[],
        leaf: "0"
      },
      ruleDate: {

        knowname: [
          { required: true, message: '知识点名称不能为空'}
        ],
        levelid: [
          { required: true, message: '学段不能为空'}
        ],
        subjectid: [
          { required: true, message: '学科不能为空'}
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
          title: '知识点名字',
          key: 'knowname',
          align: 'center'
        },
        // {
        //   title: '知识点code',
        //   key: 'knowcode',
        //   align: 'center'
        // },
        // {
        {
        title: '创建时间',
        key: 'createtime',
        align: 'center',
        render: (h,params)=>{
          return h('div',
            formatDate(new Date(params.row.createtime*1000),'yyyy-MM-dd hh:mm:ss')
          )
        }
        },
        {
          title: '学校',
          key: 'schoolname',
          align: 'center'
        },
        // {
        //   title: '科目',
        //   key: 'tsubject',
        //   align: 'center'
        // },
        {
          title: '操作',
          key: 'knowid',
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
                    // this.formDate1.knoworder = params.row.knoworder
                    // knowid
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
                    this.knowid=params.row.knowid
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
    // 获取科目
    getSubject(){
      this.axios.post('subject/list_subject',{
        schoolid:this.schoolid,
        levelid:this.levelid
      }).then(res=>{
        if(res.status ==200 && res.data.code==0){
          this.data4 = res.data.obj 
          if (res.data.obj==null) {
            this.kmodel=''
            return
          }
          this.kmodel = this.data4[0].subjectid
          this.getknow()
        }
      })
    },
    // 科目id
    kchange(e){
      this.subjectid = e
    },
    zschange(e){

    },
    // 知识点查询
    search(){
      this.axios.post('know/list_know',{
        subjectid:this.subjectid,
        keyword:this.cxmodel
      })
      .then(res=>{
        if(res.status ==200 && res.data.code==0){
          this.data = res.data.obj
          for (let i = 0; i < this.data.length; i++) {
            this.data[i].schoolname = this.data[i].school.schoolname
            this.data[i].subjectname = this.data[i].tsubject.subjectname
          }
        }
      })
      .catch(err=> {
        this.$Message.error(this.$api.monmsg)
      })
    },
    // 获取知识点
    getknow(){
      this.axios.post('know/list_know',{subjectid:this.kmodel,keyword:this.cxmodel}).then(res=>{
        if (res.data.obj == null) {
          return
        }
        this.data = res.data.obj
        for (let i = 0; i < this.data.length; i++) {
          this.data[i].schoolname = this.data[i].school.schoolname
          this.data[i].subjectname = this.data[i].tsubject.subjectname
        }
      })
    },
    handleRowChange(currentRow){
    },
    // 页数
    changePage (i) {
      this.currentpage = i
    },
    // 条数
    pageSize(i){
      this.limit = i
    },
    // 添加知识点
    ok(name) {
    this.$refs[name].validate((valid) => {
    if (valid) {
      this.axios.post('know/save_know',{
        knowname:this.formDate.knowname,
        knowpid:this.formDate.knowpid,
        subjectid:this.subjectid,
        schoolid:this.schoolid,
        createid:this.createid,
        leaf:this.formDate.leaf
      })
      .then(res=>{
        console.log(res)
        if(res.status ==200 && res.data.code==0){
          this.getknow()
          this.modal = false
          this.$Message.success(res.data.msg)
          // this.$Message.info('修改成功')
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
      this.getknow()
      this.$refs.formDate.resetFields()
    },
    // 修改知识点
    ok1(name) {
      this.$refs[name].validate((valid) => {
      if (valid) {
        this.axios.post('know/update_know',{
        knowcode:this.formDate1.knowcode,
        knowname:this.formDate1.knowname,
        knowid:this.formDate1.knowid,
        schoolid:this.schoolid,
        subjectid:this.subjectid,
        knowpid:this.knowpid
        })
        .then(res=>{
        if(res.status ==200 && res.data.code==0){
          this.getknow()
          his.modal1 = false
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
    // 删除知识点
    yes(){
      this.axios.post('know/delete_know',{knowid:this.knowid}).then(res=>{
        if(res.status ==200 && res.data.code==0){
          this.$Message.success(res.data.msg)
          this.getknow()
        }else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  created(){
    // this.getknow()
    // this.getLevel()
    this.getSubject()
  },
  components: {

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
// .top {
//   display: flex;
//   justify-content: space-between;
  .top-r {
    display: flex;
    justify-content: flex-start;
  }
// }
</style>
