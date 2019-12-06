<template>
    <div class="">
        <div :style="{'height':'40px','margin-top':'3px'}">
            <Button type="primary" @click="modal=true" :style="{'margin':'-3px 0 5px','float':'right'}">
                添加科目
            </Button>
        </div>

        <Modal
                v-model="modal"
                title="添加学科" @on-cancel="cancel" width="450">
            <Form ref="formDate" :model="formDate" :rules="ruleDate" :label-width="80">
                <FormItem label="学科名称" prop="subjectname">
                    <Input :maxlength="15" v-model="formDate.subjectname"/>
                </FormItem>
                <FormItem label="学科排序" prop="subjectorder">
                    <InputNumber @keyup.native="changeNumber" :max="9999" :min="1" v-model="formDate.subjectorder"
                                 :style="{'width':'338px'}"></InputNumber>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary" @click="ok('formDate')"
                >确定
                </Button>
            </div>
        </Modal>
        <Modal
                v-model="modal1"
                title="修改科目"
                @on-ok="ok1"
                @on-cancel="cancel" width="450">
            <Form ref="formDate1" :model="formDate1" :rules="ruleDate" :label-width="80">
                <FormItem label="学科名称" prop="subjectname">
                    <Input :maxlength="15" v-model="formDate1.subjectname"/>
                </FormItem>
                <FormItem label="学科排序" prop="subjectorder">
                    <InputNumber @keyup.native="changeNumber1" :max="9999" :min="1" v-model="formDate1.subjectorder"
                                 :style="{'width':'338px'}"></InputNumber>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary" @click="ok1('formDate1')"
                >确定
                </Button>
            </div>
        </Modal>
        <Modal v-model="modal4" @on-ok="yes" width="300">
            <div :style="{'font-size':'16px'}">确认删除吗？</div>
        </Modal>
        <Table highlight-row @on-current-change="handleRowChange" :data="data" :columns="columns" stripe border></Table>
        <!-- <div style="margin: 10px;overflow: hidden">
            <Page :total="count" :current="currentpage
            " :page-size="limit" @on-change="changePage" @on-page-size-change="pageSize" show-elevator show-sizer style="float: right" ></Page>
        </div> -->
    </div>
</template>

<script>
    import {formatDate} from '@/api'
    import {pinyin} from "../../assets/js/Convert_Pinyin"

    export default {
        data() {
            return {
                schoolid: localStorage.getItem('schoolid'),
                levelid: localStorage.getItem('levelid'),
                data: [],
                data1: [],
                data2: [],
                data4: [],
                count: 10,
                currentpage: 1,
                limit: 10,
                modal: false,
                modal1: false,
                modal4: false,
                xmodel: '',
                xmodel1: '',
                smodel: '',
                smodel2: '',
                xmodel12: '',
                formDate: {
                    subjectname: '',
                    subjectcode: '',
                    subjectorder: 1,
                    // schoolid:'',
                    // levelid:'',
                },
                formDate1: {
                    subjectname: '',
                    subjectcode: '',
                    subjectorder: 1,
                    // schoolid:'',
                    levelid: '',
                    subjectid: '',
                },
                ruleDate: {
                    subjectname: [
                        {required: true, message: '学科名称不能为空'}
                    ],
                    subjectcode: [
                        {required: true, message: '学科编码不能为空'}
                    ],
                    subjectorder: [
                        {required: true, message: '学科排序不能为空'}
                    ],
                    // schoolid: [
                    //   { required: true,message: '学校不能为空'}
                    // ],
                    levelid: [
                        {required: true, message: '学段不能为空'}
                    ],
                },
                columns: [
                    {
                        title: '序号',
                        type: 'rowNumber',
                        key: 'subjectid',
                        width: 60,
                        align: 'center',
                        render: (h, params) => {
                            return h('span', params.index + (this.currentpage - 1) * this.limit + 1);
                        }
                    },
                    {
                        title: '科目',
                        key: 'subjectname',
                        align: 'center'
                    },
                    // {
                    //   title: '学段',
                    //   key: 'levelname',
                    //   align: 'center'
                    // },
                    {
                        title: '科目编码',
                        key: 'subjectcode',
                        align: 'center'
                    },
                    {
                        title: '科目排序',
                        key: 'subjectorder',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '操作时间',
                        key: 'createtime',
                        align: 'center',
                        render: (h, params) => {
                            return h('div',
                                formatDate(new Date(params.row.createtime * 1000), 'yyyy-MM-dd hh:mm:ss')
                            )
                        }
                    },
                    {
                        title: '操作',
                        key: 'schoolid',
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
                                            this.subjectid = params.row.subjectid
                                            this.modal4 = true
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    },
                ],
            }
        },
        methods: {
            // input输入框
            changeNumber() {
                let str = '' + this.formDate.subjectorder;
                if (str.indexOf('.') != -1) {
                    let arr = str.split('');
                    arr.splice(arr.length - 1);
                    let str2 = arr.join('');
                    this.formDate.subjectorder = +str2;
                }
            },
            changeNumber1() {
                let str = '' + this.formDate1.subjectorder;
                if (str.indexOf('.') != -1) {
                    let arr = str.split('');
                    arr.splice(arr.length - 1);
                    let str2 = arr.join('');
                    this.formDate1.subjectorder = +str2;
                }
            },
            // 获取学科
            getSubject() {
                this.axios.post('subject/list_subject', {
                    schoolid: this.schoolid,
                    levelid: this.levelid,
                })
                    .then(res => {
                        console.log(res)
                        if (res.status == 200 && res.data.code == 0) {
                            if (res.data.obj) {
                                this.data = res.data.obj;
                                this.count = res.data.obj.length
                            }
                            if (res.data.obj === null) {
                                this.$Message.success(res.data.msg)
                            }
                        }
                    })
                    .catch(err => {
                        this.$Message.error(this.$api.monmsg)
                    })
            },
            handleRowChange(currentRow) {
            },
            // 页数
            changePage(i) {
                this.currentpage = i
                this.getSubject()
            },
            // 条数
            pageSize(i) {
                this.limit = i
                this.getSubject()
            },
            // 添加科目
            ok(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.formDate.subjectcode = pinyin.getFullChars(this.formDate.subjectname);
                        // console.info(pinyin.getFullChars(this.formDate.subjectname));
                        this.axios
                            .post('subject/save_subject', {
                                subjectname: this.formDate.subjectname,
                                subjectcode: this.formDate.subjectcode,
                                subjectorder: this.formDate.subjectorder,
                                schoolid: this.schoolid,
                                levelid: this.levelid
                            })
                            .then(res => {
                                if (res.status == 200 && res.data.code == 0) {
                                    this.getSubject()
                                    this.$refs.formDate.resetFields()
                                    this.modal = false
                                    this.$Message.success(res.data.msg)
                                } else {
                                    this.$Message.error(res.data.msg)
                                }
                            })
                            .catch(err => {
                                this.$Message.error(this.$api.monmsg)
                            })
                    }
                })
            },
            cancel() {
                this.modal = false
                this.modal1 = false
                this.getSubject()
                this.$refs.formDate.resetFields()
            },
            // 修改科目
            ok1(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.formDate1.subjectcode = pinyin.getFullChars(this.formDate1.subjectname);
                        this.axios.post('subject/update_subject', {
                            subjectname: this.formDate1.subjectname,
                            subjectcode: this.formDate1.subjectcode,
                            subjectorder: this.formDate1.subjectorder,
                            schoolid: this.schoolid,
                            subjectid: this.formDate1.subjectid
                        })
                            .then(res => {
                                if (res.status == 200 && res.data.code == 0) {
                                    this.getSubject()
                                    this.modal1 = false
                                    this.$Message.success(res.data.msg)
                                } else {
                                    this.$Message.error(res.data.msg)
                                }
                            })
                            .catch(err => {
                                this.$Message.error(this.$api.monmsg)
                            })
                    }
                })
            },
            yes() {
                this.axios.post('subject/del_subject', {subjectid: this.subjectid})
                    .then(res => {
                        console.log(res)
                        if (res.status == 200 && res.data.code == 0) {
                            this.$Message.success(res.data.msg)
                            if (this.data.length == 1) {
                                this.data=[]
                                if (this.currentpage > 1) {
                                    this.currentpage -= 1;
                                }
                            }
                            // this.$Message.success(res.data.msg)
                            this.getSubject()
                        } else {
                            this.$Message.error(res.data.msg)
                        }
                    })
            }
        },
        created() {
            this.getSubject()
        },
        components: {}
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
