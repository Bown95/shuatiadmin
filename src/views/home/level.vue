<template>
  <div class="">
    <div :style="{'height':'40px'}">
      <!-- <Button type="primary" @click="modal=true" :style="{'margin':'-3px 0 5px','float':'right'}">
        添加学段
      </Button> -->
    </div>
    <div>
      <Modal
      v-model="modal"
      title="添加学段" @on-cancel="cancel" width="450">
      <Form ref="formDate" :model="formDate" :rules="ruleDate" :label-width="80">
        <FormItem label="学段名称" prop="levelname">
        <Input :maxlength="15" v-model="formDate.levelname"/>
        </FormItem>
        <FormItem label="学段排序" prop="levelorder">
        <InputNumber :editable="false" :max="999" :min="1" v-model="formDate.levelorder"></InputNumber>
        </FormItem>
      </Form>
      <Modal v-model="modal4" @on-ok="yes"  width="300">
        <div :style="{'font-size':'16px'}">确认删除吗？</div>
      </Modal>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary"  @click="ok('formDate')"
        >确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="modal1"
      title="编辑学段" @on-cancel="cancel" width="450">
      <Form ref="formDate1" :model="formDate1" :rules="ruleDate" :label-width="80">
        <FormItem label="学段名称" prop="levelname">
        <Input :maxlength="15" v-model="formDate1.levelname"/>
        </FormItem>
        <FormItem label="学段排序" prop="levelorder">
        <InputNumber @keyup.native="changeNumber" :max="999" :min="1" v-model="formDate1.levelorder" :style="{'width':'338px'}"></InputNumber>
        <!-- <Input v-model="formDate1.levelorder"/> -->
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary"  @click="ok1('formDate1')"
        >确定</Button>
      </div>
    </Modal>
    <Table highlight-row @on-current-change="handleRowChange" :data="data" :columns="columns" stripe border ></Table>
    <div style="margin: 10px;overflow: hidden">
        <Page :total="count" :current="page" :page-size="limit" @on-change="changePage" @on-page-size-change="pageSize" show-elevator style="float: right" ></Page>
    </div>
    </div>
    
  </div>
</template>

<script>
import {formatDate} from '@/api'
import { truncate } from 'fs';
export default {
  data() {
    return {
      data:[],   
      count:0,
      page:1,
      limit:10,
      modal:false,
      modal1:false,
      modal4:false,
      formDate: {
        levelname: '',
        levelorder: 1
      },
      formDate1: {
        levelname: '',
        levelorder: 1
      },
      ruleDate: {
        levelname: [
          { required: true, message: '学段名称不能为空'}
        ],
        levelorder: [
          { required: true, message: '学段排序不能为空'}
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
          title: '名称',
          key: 'levelname',
          align: 'center'
        },
        {
          title: '排序',
          key: 'levelorder',
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
          key: 'levelid',
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
            // h('Button', {
            //     props: {
            //       type: 'error',
            //       size: 'small'
            //     },
            //     on: {
            //       click: () => {
            //         this.modal4= true
            //         this.levelid = params.row.levelid
            //       }
            //     }
            // }, '删除')
          ]);
        }
        },
      ],
    }
  },
  methods:{
    // input输入框
    changeNumber() {
      let str = '' + this.formDate1.levelorder;
      if (str.indexOf('.') != -1) {
        let arr = str.split('');
        arr.splice(arr.length - 1);
        let str2 = arr.join('');
        this.formDate1.levelorder = +str2;
      }
    },
    // 获取学段
    getLevel(){
      this.axios.post('level/list_level')
      .then(res=>{
        if(res.status ==200 && res.data.code==0){
          this.data = res.data.obj
          this.count = res.data.obj.length
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
      this.getLevel()
    },
    // 条数
    pageSize(i){
      this.limit = i
      this.getLevel()
    },
    ok(name) {
      this.$refs[name].validate((valid) => {
      if (valid) {
      this.axios.post('level/save_level',this.formDate)
      .then(res=>{
        if(res.status ==200 && res.data.code==0){
          this.getLevel()
          this.$refs.formDate.resetFields()
          this.modal = false
          this.$Message.success('添加成功')
        }else {
          this.$Message.error('添加失败')
        }
      }) 
      } 
    })
    },
    cancel() {
      this.modal1 = false
      this.modal = false
      this.$refs.formDate.resetFields()
      this.getLevel()
    },
    ok1(name) {
      this.$refs[name].validate((valid) => {
      if (valid) {
      this.axios.post('level/update_level',this.formDate1)
        .then(res=>{
          if(res.status ==200 && res.data.code==0){
            this.modal1 = false
            this.$Message.success(res.data.msg)
            this.getLevel()
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
      this.axios.post('level/del_level',{levelid:this.levelid}).then(res=>{
        if(res.status ==200 && res.data.code==0){
          this.$Message.success(res.data.msg)
          this.getLevel()
        }else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  created(){
    this.getLevel()
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
