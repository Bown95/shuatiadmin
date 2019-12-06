<template>
    <div>
        <div :style="{'height':'40px','margin-top':'3px'}">
            <Button type="primary" @click="add" :style="{'margin':'0 0 5px 0','float':'right'}">添加章节</Button>
            <div :style="{'margin-bottom':'15px'}">
                <Select
                        placeholder="请选择科目"
                        v-model="formDate.subjectid"
                        :style="{'width':'180px','margin-right':'15px'}"
                        @on-change="kchange"
                >
                    <Option v-for="(item,i) in data3" :value="item.subjectid" :key="i">{{ item.subjectname }}</Option>
                </Select>
                <Select
                        placeholder="请选择教材"
                        v-model="formDate.bookid"
                        :style="{'width':'180px','margin-right':'15px'}"
                        @on-change="jchange"
                >
                    <Option v-for="(item,i) in data1" :value="item.bookid" :key="i">{{ item.bookname }}</Option>
                </Select>
                <Button type="primary" @click="getDirector()">搜索</Button>
            </div>
        </div>
        <!-- 添加 -->
        <Modal v-model="modal" :title="title" width="450" class="modal">
            <Form ref="formDate" :model="formDate1" :rules="ruleDate" :label-width="80">
                <FormItem label="科目" prop="subjectid" v-if="is_add">
                    <Select
                            ref="subjectid"
                            placeholder="请选择科目"
                            v-model="formDate1.subjectid"
                            :style="{}"
                            @on-change="getBook"
                    >
                        <Option
                                v-for="(item,i) in subjects"
                                :value="item.subjectid"
                                :key="i"
                        >{{ item.subjectname }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem ref="bookid" label="教材" prop="bookid" v-if="is_add">
                    <Select
                            placeholder="请选择教材"
                            v-model="formDate1.bookid"
                            :style="{}"
                            @on-change="getDirector"
                    >
                        <Option v-for="(item,i) in books" :value="item.bookid" :key="i">{{ item.bookname }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="所属章节" prop="directorpid" v-if="is_add">
                    <Cascader :data="directors" v-model="formDate1.directorpid" change-on-select></Cascader>
                </FormItem>
                <FormItem label="录题章节" v-if="is_add">
                    <RadioGroup v-model="formDate1.leaf">
                        <Radio label="0">
                            <span>否</span>
                        </Radio>
                        <Radio label="1">
                            <span>是</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="章节名称" prop="directorname">
                    <Input v-model="formDate1.directorname"/>
                </FormItem>
                <FormItem label="章节排序" prop="directororder">
                    <InputNumber @keyup.native="changeNumber" :max="1000" :min="1" v-model="formDate1.directororder" :style="{'width':'338px'}"></InputNumber>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary" @click="ok('formDate1')">确定</Button>
            </div>
        </Modal>
        <!-- 修改 -->
        <Modal v-model="modal1" title="修改章节" width="450">
            <Form ref="formDate1" :model="formDate1" :rules="ruleDate" :label-width="80">
                <FormItem label="科目" prop="subjectid">
                    <Select placeholder="请选择科目" v-model="formDate1.subjectid" :style="{}">
                        <Option
                                v-for="(item,i) in data3"
                                :value="item.subjectid"
                                :key="i"
                        >{{ item.subjectname }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="教材" prop="bookid">
                    <Select placeholder="请选择教材" v-model="formDate1.bookid" :style="{}" @on-change="jchange">
                        <Option v-for="(item,i) in data1" :value="item.bookid" :key="i">{{ item.bookname }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="所属章节" prop="directorid">
                    <Select
                            placeholder="请选择所属章节"
                            v-model="formDate1.directorid"
                            :style="{}"
                            @on-change="zchange"
                    >
                        <Option :value="0">请选择所属章节</Option>
                        <Option
                                v-for="(item,i) in data"
                                :value="item.directorid"
                                :key="i"
                        >{{ item.directorname }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="章节名称" prop="directorname">
                    <Input v-model="formDate1.directorname"/>
                </FormItem>
                <FormItem label="章节排序" prop="directororder">
                    <Input :editable="false" v-model="formDate1.directororder"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button type="primary" @click="ok1('formDate1')">确定</Button>
            </div>
        </Modal>
        <Modal v-model="modal4" @on-ok="yes" width="300">
            <div :style="{'font-size':'16px'}">确认删除吗？</div>
        </Modal>
        <Table
                highlight-row
                @on-current-change="handleRowChange"
                :data="data"
                :columns="columns"
                stripe
                border
        ></Table>
    </div>
</template>

<script>
    import {formatDate} from "@/api";
    import {constants} from "crypto";

    export default {
        data() {
            return {
                schoolid: localStorage.getItem("schoolid"),
                levelid: localStorage.getItem("levelid"),
                createid: localStorage.getItem("auserid"),
                modal4: false,
                data: [],
                data1: [], //data1 - data4 为筛选数据
                data3: [],
                count: 0,
                currentpage: 1,
                limit: 10,
                modal: false, // modal 为选项框
                modal1: false,
                lsbid: 1,
                formDate: {
                    bookid: "",
                    subjectid: ""
                },
                //
                title: "添加章节",
                is_add: true,
                subjects: [], //学科
                books: [], // 教材
                directors: [], //章节
                formDate1: {
                    leaf: "0",
                    directorid: "",
                    directorname: "",
                    directororder: 1,
                    directorpid: [],
                    bookid: "",
                    subjectid: ""
                },
                ruleDate: {
                    directorname: [{required: true, message: "章节名称不能为空"}],
                    directororder: [{required: true, message: "章节排序不能为空"}],
                    directorpid: [{required: true, message: "章节父ID不能为空"}],
                    bookid: [{required: true, message: "教材不能为空"}],
                    subjectid: [{required: true, message: "科目不能为空"}],
                    levelid: [{required: true, message: "学段不能为空"}],
                    directorid: [
                        // { required: true, message: '所属章节不能为空'}
                    ]
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
                        title: "章节名称",
                        key: "directorname_s",
                        type: "html",
                        align: "left"
                    },
                    {
                        title: "录题章节",
                        key: "leaf",
                        align: "center",
                        render: (h, params) => {
                            var leaf = params.row.leaf;
                            if(leaf===1){
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'md-checkmark' // iview自带的删除icon
                                        },
                                        style: {
                                            fontSize: '18px', // 改变icon的样式
                                            color: '#666',
                                            width:'20px',
                                            height:"20px"
                                        }
                                    })
                                ])
                            }else{
                                return h('div', [
                                    // h('Icon', {
                                    //     props: {
                                    //         type: 'md-close' // iview自带的删除icon
                                    //     },
                                    //     style: {
                                    //         fontSize: '18px', // 改变icon的样式
                                    //         color: '#666',
                                    //         width:'20px',
                                    //         height:"20px"
                                    //     }
                                    // })
                                ])
                            }

                        }

                    },
                    {
                        title: "章节排序",
                        key: "directororder",
                        align: "center"
                        // sortable: true
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
                        key: "directorid",
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
                                                this.modal = true;
                                                this.delete();
                                                this.is_add = false;
                                                this.title = "修改章节";
                                                this.formDate1.directororder = params.row.directororder;
                                                this.formDate1.directorname = params.row.directorname;
                                                this.formDate1.directorid = params.row.directorid;
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
                                                this.directorid = params.row.directorid;
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
                // input输入框
                changeNumber() {
                let str = '' + this.formDate1.directororder;
                    if (str.indexOf('.') != -1) {
                        let arr = str.split('');
                        arr.splice(arr.length - 1);
                        let str2 = arr.join('');
                        this.formDate1.directororder = +str2;
                    }
                },
            // 获取科目
            getSubject() {
                this.axios
                    .post("subject/list_subject", {
                        schoolid: this.schoolid,
                        levelid: this.levelid
                    })
                    .then(res => {
                        if (res.status == 200 && res.data.code == 0) {
                            if (res.data.obj == null) {
                                this.$Message.success(res.data.msg)
                                return;
                            }
                            this.data3 = res.data.obj;
                            this.subjects = res.data.obj;
                            if (this.data3.length === 0) {
                                this.formDate.subjectid = "";
                            } else {
                                this.formDate.subjectid = this.data3[0].subjectid;
                                this.getBook();
                            }
                        }
                    });
            },
            // 获取教材
            getBook(index) {
                // 每次切换 清除下方data
                this.books = []; // 教材
                this.directors = []; //章节
                this.formDate1.bookid = "";
                this.formDate1.directorpid = [];
                var postdata = {};
                if (index) {
                    postdata = {
                        subjectid: this.formDate1.subjectid,
                        schoolid: this.schoolid
                    };
                } else {
                    postdata = {
                        subjectid: this.formDate.subjectid,
                        schoolid: this.schoolid
                    };
                }
                this.axios.post("book/list_book", postdata).then(res => {
                    if (res.status == 200 && res.data.code == 0) {
                        if (index) {
                            this.books = res.data.obj;
                        } else {
                            this.data1 = res.data.obj;
                            if (this.data1.length == 0) {
                                this.formDate.bookid = "";
                            } else {
                                this.formDate.bookid = this.data1[0].bookid;
                                this.getDirector();
                            }
                        }
                    }
                });
            },
            // 科目id
            kchange(e) {
                this.subjectid = e;
                this.getBook();
            },
            // 教材id
            jchange(e) {
                this.bookid = e;
            },
            zchange(e) {
                this.directorid = e;
            },
            // 获取章节列表
            getDirector(index) {
                var postdata = {};
                if (index) {
                    postdata = {
                        schoolid: this.schoolid,
                        levelid: this.levelid,
                        subjectid: this.formDate1.subjectid,
                        bookid: this.formDate1.bookid,
                        type: 2
                    };
                } else {
                    postdata = {
                        schoolid: this.schoolid,
                        levelid: this.levelid,
                        subjectid: this.formDate.subjectid,
                        bookid: this.formDate.bookid,
                        type: 3
                    };
                }
                this.axios.post("director/list_director", postdata).then(res => {
                    if (res.status == 200 && res.data.code == 0) {
                        if (index) {
                            // 每次请求都先清空data
                            this.directors = [];
                            if (res.data.obj.length > 0) {
                                for (let i = 0; i < res.data.obj.length; i++) {
                                    var item = res.data.obj;
                                    this.directors.push({
                                        value: item[i].directorid,
                                        label: item[i].directorname,
                                        children: []
                                    });
                                    if (item[i].directors.length > 0) {
                                        for (let j = 0; j < item[i].directors.length; j++) {
                                            var item_1 = item[i].directors;
                                            this.directors[i].children.push({
                                                value: item_1[j].directorid,
                                                label: item_1[j].directorname
                                            });
                                        }
                                    }
                                }
                            }
                            // 在数组开始 添加一个默认
                            this.directors.unshift({
                                value: 0,
                                label: "无"
                            });
                        } else {
                            var data = res.data.obj;
                            this.data = [];
                            for (let i = 0; i < data.length; i++) {
                                var item1 = data[i];
                                item1.directorname_s = item1.directorname;
                                this.data.push(item1);
                                for (let j = 0; j < item1.directors.length; j++) {
                                    let item2 = item1.directors[j];
                                    item2.directorname_s = "&nbsp;&nbsp;└─" + item2.directorname;
                                    this.data.push(item2);
                                    for (let k = 0; k < item2.directors.length; k++) {
                                        let item3 = item2.directors[k];
                                        item3.directorname_s =
                                            "&nbsp;&nbsp;&nbsp;&nbsp;└─" + item3.directorname;
                                        this.data.push(item3);
                                    }
                                }
                            }
                            this.count = res.data.obj.length;
                        }
                    }
                });
            },
            handleRowChange(currentRow) {
            },
            // 页数
            changePage(i) {
                this.page = i;
            },
            // 条数
            pageSize(i) {
                this.limit = i;
            },
            add: function () {
                // 点击添加
                this.modal = true;
                this.is_add = true;
                this.title = "添加章节";
                this.delete();
            },
            delete: function () {
                // 删除可选data
                this.books = []; // 教材
                this.directors = []; //章节
                this.$refs.formDate1.resetFields();
            },
            // 添加章节
            ok(name) {
                if (!this.is_add) {
                    this.ok1();
                    return;
                }
                if (this.formDate1.subjectid == "") {
                    this.$Message.error("科目未选择!");
                } else if (this.formDate1.bookid == "") {
                    this.$Message.error("教材未选择!");
                } else if (this.formDate1.directorpid.length == 0) {
                    this.$Message.error("所属章节未选择!");
                } else if (
                    this.formDate1.directorpid.length == 2 &&
                    this.formDate1.leaf == 0
                ) {
                    this.$Message.error({
                        content: "当前章节为最末级,需设置录题章节为是!",
                        duration: 3
                    });
                } else if (this.formDate1.directorname == "") {
                    this.$Message.error("章节名称未输入!");
                } else if (this.formDate1.directorpid == "") {
                    this.$Message.error("章节排序未输入!");
                } else {
                    var directorpid = null;
                    if (this.formDate1.directorpid.length > 1) {
                        directorpid = this.formDate1.directorpid[1];
                    } else {
                        directorpid = this.formDate1.directorpid[0];
                    }
                    this;
                    this.$refs[name].validate(valid => {
                        if (valid) {
                            this.axios
                                .post("director/save_director", {
                                    directorname: this.formDate1.directorname,
                                    directororder: this.formDate1.directororder,
                                    leaf: this.formDate1.leaf,
                                    directorpid: directorpid,
                                    schoolid: this.schoolid,
                                    levelid: this.levelid,
                                    subjectid: this.formDate1.subjectid,
                                    bookid: this.formDate1.bookid,
                                    createid: this.createid
                                })
                                .then(res => {
                                    if (res.status == 200 && res.data.code == 0) {
                                        this.modal = false;
                                        this.$Message.success("添加成功");
                                        // this.formDate1.directorpid = [];
                                        this.formDate1.directorname = "";
                                        this.$refs.formDate.resetFields();
                                        // 重新获取列表信息
                                        this.getDirector();
                                        // this.$refs.formDate1.resetFields();
                                    }
                                });
                        } else {
                            this.$Message.error("添加失败");
                        }
                    });
                }
            },
            cancel() {
                this.modal = false;
                this.modal1 = false;
                this.$refs.formDate.resetFields();
                this.$refs.formDate1.resetFields();
            },
            ok1(name) {
                // 修改
                if (this.formDate1.directorname.trim() == "") {
                    // 非空验证
                    this.$Message.error("章节名称未输入!");
                } else if (this.formDate1.directororder == null) {
                    this.$Message.error("章节排序未输入!");
                } else {
                    this.axios
                        .post("director/update_director", {
                            directorid: this.formDate1.directorid,
                            directorname: this.formDate1.directorname,
                            directororder: this.formDate1.directororder,
                            schoolid: this.schoolid
                        })
                        .then(res => {
                            if (res.status == 200 && res.data.code == 0) {
                                this.modal = false;
                                this.getDirector();
                                this.$Message.success(res.data.msg);
                            } else {
                                this.$Message.error(res.data.msg);
                            }
                        });
                }
            },
            // 删除
            yes() {
                this.axios
                    .post("director/delete_director", {
                        directorid: this.directorid
                    })
                    .then(res => {
                        if (res.status == 200 && res.data.code == 0) {
                            this.$Message.success(res.data.msg);
                            this.getBook();
                        } else {
                            this.$Message.error(res.data.msg);
                        }
                    })
                    .catch(res => {
                        this.$Message.error("网络连接超时,请重试!");
                    });
            }
        },
        created() {
            this.getSubject();
        },
        beforeUpdate() {
        },
        mounted() {
        },
        components: {}
    };
</script>

<style scoped lang="less">
    .ivu-modal,
    .ivu-modal-content {
        width: 450px !important;
    }

    // .modal {
    //   .zjmodal {
    //     margin-left: 10px;
    //     float: left;
    //     height: 500px;
    //   }
    //   .form {

    //   }
    // }
</style>
