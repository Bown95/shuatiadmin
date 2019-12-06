<template>
    <div>

        <!-- 添加 -->
        <Modal v-model="addModal" title="题目入库" @on-cancel="cancel_add_or_update_ques" width="1000"
               :mask-closable="false">
            <div :style="{'margin-bottom':'15px'}">
                <Select
                        placeholder="请选择学科"
                        v-model="form_para.subjectid"
                        :style="{'width':'180px','margin-right':'15px','float':'left'}"
                        @on-change="getBook"
                >
                    <Option
                            v-for="(item,i) in form_para.subjects"
                            :value="item.subjectid"
                            :key="i"
                    >{{ item.subjectname }}
                    </Option>
                </Select>
                <Select
                        placeholder="请选择教材"
                        v-model="form_para.bookid"
                        :style="{'width':'180px','margin-right':'15px','float':'left'}"
                        @on-change="getDirector"
                >
                    <Option v-for="(item,i) in form_para.books" :value="item.bookid" :key="i">{{ item.bookname }}
                    </Option>
                </Select>
                <Cascader
                        :data="form_para.directors"
                        v-model="form_para.directorid"
                        @on-change="is_director"
                        :style="{'width':'180px','margin-right':'15px','float':'left'}"
                ></Cascader>
                题型:
                <RadioGroup v-model="qtype" :style="{'margin-right':'15px'}">
                    <Radio label="1">单选</Radio>
                    <Radio label="2">多选</Radio>
                </RadioGroup>
                难度:
                <Select
                        placeholder="请选择难易度"
                        v-model="qcomplex"
                        :style="{'width':'180px','margin-right':'15px'}"
                >
                    <Option v-for="item in qcomplexs" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
            <div :style="{'margin-top':'5px'}">
                <span :style="{'font-size':'16px'}">题干:</span>
                <!-- 题干 -->
                <myeditor ref="editor_tigan_add"></myeditor>
            </div>
            <div :style="{'margin-top':'25px'}">
                <span :style="{'font-size':'16px'}">解析:</span>
                <!-- 解析 -->
                <myeditor ref="editor_jiexi_add"></myeditor>
            </div>
            <span class="xuan">选项:</span>
            <!--单选题-->
            <RadioGroup :style="{'width':'100%'}" v-if="qtype == 1" v-model="danxuan_corrent_index">
                <div class="abc" v-for="(item,i) of opt_arr" :key="item.id">
                    <!-- 选项 -->
                    <div :style="{'font-size':'16px'}">{{ abc[i] }} :</div>
                    <myeditor ref="editor_xuanxiang_add"
                              :value="item.opt"
                              :curr_index="i"
                              :curr_name="'opt'"
                              @myeditor_change="myeditor_change"
                    ></myeditor>
                    <Radio
                            :label="i"
                            style="color:#fff;position: absolute; top: 32px;right: -50px;"
                    ></Radio>
                    <Button type="error" @click="del_opt_click(i)">删除</Button>
                </div>
            </RadioGroup>
            <!--多选题-->
            <CheckboxGroup v-model="duoxuan_corrent_arr" :style="{'width':'100%'}" v-else>
                <div class="abc" v-for="(item,i) of opt_arr" :key="item.id">
                    <!-- 选项 -->
                    <div :style="{'font-size':'16px'}">{{ abc[i] }} :</div>
                    <myeditor ref="editor_xuanxiang_add"
                              :value="item.opt"
                              :curr_index="i"
                              :curr_name="'opt'"
                              @myeditor_change="myeditor_change"
                    ></myeditor>
                    <Checkbox
                            :label="i"
                            style="color:#fff;position: absolute;   top: 32px;right: -50px;"
                    ></Checkbox>
                    <Button type="error" @click="del_opt_click(i)">删除</Button>
                </div>
            </CheckboxGroup>
            <div class="modal-btn">
                <Button type="primary" class="add btn" @click="add_opt_click" :style="{'margin-right':'15px'}">添加选项
                </Button>
                <Button type="primary" class="add btn" @click="save_ques_click">保存试题</Button>
            </div>
            <div slot="footer"></div>
        </Modal>
        <!-- 修改 -->
        <Modal v-model="updateModal" title="修改题目" @on-cancel="cancel_add_or_update_ques" width="1000"
               :mask-closable="false">
            <div :style="{'margin-bottom':'15px'}">
                <Select
                        placeholder="请选择教材"
                        v-model="form_para.bookid"
                        :style="{'width':'180px','margin-right':'15px','float':'left'}"
                        @on-change="getDirector"
                >
                    <Option v-for="(item,i) in form_para.books" :value="item.bookid" :key="i">{{ item.bookname }}
                    </Option>
                </Select>
                <Cascader
                        :data="form_para.directors"
                        v-model="form_para.directorid"
                        @on-change="is_director"
                        :style="{'width':'180px','margin-right':'15px','float':'left'}"
                ></Cascader>
                题型:
                <RadioGroup v-model="qtype" :style="{'margin-right':'15px'}">
                    <Radio label="1">单选</Radio>
                    <Radio label="2">多选</Radio>
                </RadioGroup>
                难度:
                <Select
                        placeholder="请选择难易度"
                        v-model="qcomplex"
                        :style="{'width':'180px','margin-right':'15px'}"
                >
                    <Option v-for="item in qcomplexs" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
            <div :style="{'margin-top':'5px'}">
                <span :style="{'font-size':'16px'}">题干:</span>
                <!-- 题干 -->
                <myeditor ref="editor_tigan_update"></myeditor>
            </div>
            <div :style="{'margin-top':'50px'}">
                <span :style="{'font-size':'16px'}">解析:</span>
                <!-- 解析 -->
                <myeditor ref="editor_jiexi_update"></myeditor>
            </div>
            <span class="xuan">选项:</span>
            <RadioGroup v-model="danxuan_corrent_index" :style="{'width':'100%'}" v-if="qtype == 1">
                <div class="abc" v-for="(item,i) of opt_arr" :key="item.id">
                    <!-- 选项 -->
                    <div :style="{'font-size':'16px'}">{{ abc[i] }} :</div>
                    <myeditor ref="editor_xuanxiang_update"
                              :value="item.opt"
                              :curr_index="i"
                              :curr_name="'opt'"
                              @myeditor_change="myeditor_change"
                    ></myeditor>
                    <Radio
                            :label="i"
                            style="color:#fff;position: absolute; top: 32px;right: -50px;"
                    ></Radio>

                </div>
            </RadioGroup>
            <CheckboxGroup v-model="duoxuan_corrent_arr" :style="{'width':'100%'}" v-else>
                <div class="abc" v-for="(item,i) of opt_arr" :key="item.id">
                    <!-- 选项 -->
                    <div :style="{'font-size':'16px'}">{{ abc[i] }} :</div>
                    <myeditor ref="editor_xuanxiang_update"
                              :value="item.opt"
                              :curr_index="i"
                              :curr_name="'opt'"
                              @myeditor_change="myeditor_change"
                    ></myeditor>
                    <Checkbox
                            :label="i"
                            style="color:#fff;position: absolute;top: 32px;right: -50px;"
                    ></Checkbox>
                </div>
            </CheckboxGroup>


            <div class="modal-btn">
                <Button type="primary" class="add btn" @click="update_ques_click">更新试题</Button>
            </div>
            <div slot="footer"></div>
        </Modal>
        <!--查看详情-->
        <Modal v-model="showDelModal" @on-ok="del_ques_action" width="300">
            <div :style="{'font-size':'16px'}">确认删除吗？</div>
        </Modal>
        <Modal
                v-model="showQuesDetailModal"
                title="试题详情"
                :mask-closable="false"
                width="700">

            <div class="ques_detail">
                <span style="font-size:18px;height: 32px;line-height: 32px">所属章节:</span>
                <p>
                    {{get_director_str(ques_detail.director)}}
                </p>
                <span style="font-size:18px;height: 32px;line-height: 32px">题型/难易度:</span>
                <p>
                    {{get_questype_str(ques_detail.qtype)}}
                    （{{get_qcomplex_str(ques_detail.qcomplex)}}）
                </p>

                <span style="font-size:18px;height: 32px;line-height: 32px">题干:</span>
                <p v-html="ques_detail.questionstem"></p>
                <span style="font-size:18px;height: 32px;line-height: 32px">解析:</span>
                <p v-html="ques_detail.qanalyze"></p>
                <span style="font-size:18px;height: 32px;line-height: 32px">选项:</span>
                <div v-for="(item,i) in ques_detail.list" :key="i" class="opt_item">
                    <div class="abc_item">
                        <span>{{abc[i]}}. &nbsp;</span>
                    </div>
                    <p v-html="item.optiontcontent"></p>
                </div>
                <div slot="footer"></div>

            </div>

        </Modal>
        <div :style="{'margin-top':'3px'}">
            <div class="btn">
                <Button
                        type="primary"
                        @click="showAddModal"
                        :style="{'margin':'0 0 5px','float':'right'}"
                >题目入库
                </Button>
            </div>
            <div :style="{'margin-bottom':'15px'}">
                <Select
                        placeholder="请选择学科"
                        v-model="search_para.subjectid"
                        :style="{'width':'180px','margin-right':'15px','float':'left'}"
                        @on-change="getBook"
                >
                    <Option
                            v-for="(item,i) in search_para.subjects"
                            :value="item.subjectid"
                            :key="i"
                    >{{ item.subjectname }}
                    </Option>
                </Select>
                <Select
                        placeholder="请选择教材"
                        v-model="search_para.bookid"
                        :style="{'width':'180px','margin-right':'15px','float':'left'}"
                        @on-change="getDirector"
                >
                    <Option v-for="(item,i) in search_para.books" :value="item.bookid" :key="i">{{ item.bookname }}
                    </Option>
                </Select>
                <Cascader
                        :data="search_para.directors"
                        v-model="search_para.directorid"
                        @on-change="is_director"
                        :style="{'width':'180px','margin-right':'15px','float':'left'}"
                ></Cascader>
                <Button type="primary" @click="getquestion()">查询题目</Button>
            </div>
        </div>
        <Table
                highlight-row
                :data="ques_list"
                :columns="columns"
                stripe
                border
        ></Table>
        <div style="margin: 10px;overflow: hidden">
            <Page
                    :total="count"
                    :current="pageNum"
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
    import {formatDate} from '@/api'
    import myeditor from "../../components/myeditor";

    export default {
        components: {
            myeditor
        },
        data: function () {
            return {
                schoolid: localStorage.getItem("schoolid"),
                levelid: localStorage.getItem("levelid"),
                createid: localStorage.getItem("auserid"),
                qcomplex: "3",
                qcomplexs: [
                    {
                        value: "1",
                        label: "容易"
                    },
                    {
                        value: "2",
                        label: "较容易"
                    },
                    {
                        value: "3",
                        label: "一般"
                    },
                    {
                        value: "4",
                        label: "较难"
                    },
                    {
                        value: "5",
                        label: "非常难"
                    }
                ],
                showQuesDetailModal: false,
                showDelModal: false,
                ques_list: [],
                count: 0,
                pageNum: 1,
                limit: 10,
                addModal: false,
                updateModal: false,
                ques_detail: {},// 查看
                search_para: {
                    // 学科
                    subjects: [],
                    subjectid: "",
                    // 教材
                    books: [],
                    bookid: "",
                    //  章节三级
                    directors: [],
                    //  绑定的章节id
                    directorid: [],
                },
                form_para: {
                    // 学科
                    subjects: [],
                    subjectid: "",
                    // 教材
                    books: [],
                    bookid: "",
                    //  章节三级
                    directors: [],
                    //  绑定的章节id
                    directorid: [],
                },
                qtype: "1",
                //富文本编辑器个数
                opt_arr: [{
                    "id": "1",
                    "opt": ""
                }, {
                    "id": "2",
                    "opt": ""
                }, {
                    "id": "3",
                    "opt": ""
                }, {
                    "id": "4",
                    "opt": ""
                }],
                danxuan_corrent_index: -1,
                duoxuan_corrent_arr: [],
                // 选项
                abc: ["A", "B", "C", "D", "E", "F", "G", "H"],
                columns: [
                    {
                        title: "序号",
                        type: "rowNumber",
                        width: 60,
                        align: "center",
                        render: (h, params) => {
                            return h(
                                "span",
                                params.index + (this.pageNum - 1) * this.limit + 1
                            );
                        }
                    },
                    {
                        title: "题干",
                        key: "qstemtxt",
                        align: "left"
                    },
                    {
                        title: "题型/难易度",
                        key: "qtype",
                        align: "center",
                        width: 160,
                        render: (h, params) => {
                            var qtype = params.row.qtype;
                            var qtypeStr = "";
                            if (qtype === 1) {
                                qtypeStr = "单选";
                            } else if (qtype === 2) {
                                qtypeStr = "多选";
                            }

                            var qcomplex = params.row.qcomplex;
                            var qcomplex_arr = ["未知", "容易", "较容易", "一般", "较难", "非常难"];
                            var qcomplex_str = qcomplex_arr[qcomplex] || "未知";
                            return h('div', [
                                h('span', {
                                    props: {
                                        type: 'text'
                                    },
                                    domProps: {
                                        innerHTML: qtypeStr + "（" + qcomplex_str + "）"
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: "录题人",
                        key: "ausername",
                        align: "center",
                        width: 160,
                    },
                    {
                        title: '录题时间',
                        key: 'createtime',
                        align: 'center',
                        width: '150',
                        render: (h, params) => {
                            return h('div',
                                formatDate(new Date(params.row.createtime * 1000), 'yyyy-MM-dd hh:mm:ss')
                            )
                        }
                    },
                    {
                        title: "操作",
                        key: "operation",
                        align: "center",
                        width: 200,
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "primary",
                                            size: "small",
                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                                this.showQuesDetailModal = true
                                                this.ques_detail = params.row
                                            }
                                        }
                                    },
                                    "查看"
                                ),
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "primary",
                                            size: "small",

                                        },
                                        style: {
                                            marginRight: "5px"
                                        },
                                        on: {
                                            click: () => {
                                                this.updateModal = true;
                                                this.form_para.subjectid = params.row.subject.subjectid;
                                                this.form_para.bookid = params.row.book.bookid;
                                                this.form_para.directorid = [];
                                                var director = params.row.director;
                                                while (director) {
                                                    this.form_para.directorid.unshift(director.directorid + "_" + director.leaf);
                                                    director = director.director;
                                                }
                                                this.getBook();
                                                this.opt_arr = [];
                                                this.qcomplex = (params.row.qcomplex || 0).toString()
                                                this.qtype = (params.row.qtype || 0).toString()
                                                this.questionid = params.row.questionid;
                                                this.$refs.editor_tigan_update.editor.container.firstChild.innerHTML = params.row.questionstem;
                                                this.$refs.editor_jiexi_update.editor.container.firstChild.innerHTML = params.row.qanalyze;
                                                this.danxuan_corrent_index = -1;
                                                this.duoxuan_corrent_arr = [];
                                                for (let i = 0; i < params.row.list.length; i++) {
                                                    var item = params.row.list[i];
                                                    if (item.corrected === 1) {
                                                        if (this.qtype === "1") {
                                                            this.danxuan_corrent_index = i;
                                                        } else if (this.qtype === "2") {
                                                            this.duoxuan_corrent_arr.push(i);
                                                        }
                                                    }
                                                    this.opt_arr.push(
                                                        {
                                                            "id": item.optionid + "",
                                                            "opt": item.optiontcontent
                                                        });
                                                }

                                            }
                                        }
                                    },
                                    "编辑"
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
                                                this.showDelModal = true;
                                                // console.log(params.row.questionid);
                                                this.questionid = params.row.questionid;
                                                // this.remove(params.index)
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
        computed: {
            is_add_or_update: function () {
                return this.addModal || this.updateModal
            }
        },
        methods: {
            get_questype_str(type) {
                var typestr = "未知";
                if (type) {
                    if (type == 1) {
                        typestr = "单选题";
                    } else {
                        typestr = "多选题";
                    }
                }
                return typestr;
            },

            get_qcomplex_str(qcomplex) {
                var qcomplex_arr = ["未知", "容易", "较容易", "一般", "较难", "非常难"];
                return qcomplex_arr[qcomplex];
            },

            get_director_str(director) {
                var director_name_arr = [];
                while (director) {
                    director_name_arr.unshift(director.directorname);
                    director = director.director;
                }

                return director_name_arr.join("-");
            },
            //选项的值改变
            myeditor_change(content, index, name) {
                var optitem = this.opt_arr[index];
                if (optitem) {
                    optitem.opt = content;
                }
            },
            // 页数
            changePage(i) {
                this.pageNum = i;
                this.getquestion();
            },
            // 条数
            pageSize(i) {
                this.limit = i;
                this.getquestion();
            },
            is_contain_id: function (list, name, id) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i][name] == id) {
                        return true;
                    }
                }
                return false;
            },
            // 获取科目
            getSubject() {
                this.axios
                    .post("subject/list_subject", {
                        levelid: this.levelid,
                        schoolid: this.schoolid
                    })
                    .then(res => {
                        if (res.status == 200 && res.data.code == 0) {
                            if (res.data.obj ==null) {
                                this.$Message.success(res.data.msg)
                            }
                            if (this.is_add_or_update) {
                                //如果更新就不再清空后续数据
                                if (this.addModal) {
                                    this.form_para.subjectid = "";
                                    this.form_para.bookid = "";
                                    this.form_para.directorid = [];
                                }
                                this.form_para.subjects = [];
                                this.form_para.books = [];
                                this.form_para.directors = [];

                            } else {
                                this.search_para.subjects = [];
                                this.search_para.subjectid = "";
                                this.search_para.books = [];
                                this.search_para.bookid = "";
                                this.search_para.directors = [];
                                this.search_para.directorid = [];
                            }

                            if (res.data.obj && res.data.obj.length > 0) {
                                if (this.is_add_or_update) {
                                    this.form_para.subjects = res.data.obj;
                                    if (this.addModal) {
                                        this.form_para.subjectid = res.data.obj[0].subjectid;
                                    } else {
                                        if (!this.is_contain_id(res.data.obj, "subjectid", this.form_para.subjectid)) {
                                            this.form_para.subjectid = res.data.obj[0].subjectid;
                                        }
                                    }
                                } else {
                                    this.search_para.subjects = res.data.obj;
                                    this.search_para.subjectid = res.data.obj[0].subjectid;
                                }
                                this.getBook();
                            }
                        } else {
                            this.form_para.subjectid = "";
                            this.form_para.bookid = "";
                            this.form_para.directorid = [];
                        }
                    });
            },
            // 获取教材
            getBook() {
                var subjectid = "";
                if (this.is_add_or_update) {
                    subjectid = this.form_para.subjectid;
                } else {
                    subjectid = this.search_para.subjectid;
                }
                this.axios
                    .post("book/list_book", {
                        subjectid: subjectid,
                        schoolid: this.schoolid
                    })
                    .then(res => {
                        if (res.status == 200 && res.data.code == 0) {
                            
                            if (this.is_add_or_update) {
                                if (this.addModal) {
                                    this.form_para.bookid = "";
                                    this.form_para.directorid = [];
                                }
                                this.form_para.books = [];
                                this.form_para.directors = [];

                            } else {
                                this.search_para.books = [];
                                this.search_para.bookid = "";
                                this.search_para.directors = [];
                                this.search_para.directorid = [];
                            }

                            if (res.data.obj && res.data.obj.length > 0) {
                                if (this.is_add_or_update) {
                                    this.form_para.books = res.data.obj;
                                    if (this.addModal) {
                                        this.form_para.bookid = res.data.obj[0].bookid;
                                    } else {
                                        if (!this.is_contain_id(res.data.obj, "bookid", this.form_para.bookid)) {
                                            this.form_para.bookid = res.data.obj[0].bookid;
                                        }
                                    }
                                } else {
                                    this.search_para.books = res.data.obj;
                                    this.search_para.bookid = res.data.obj[0].bookid;
                                }
                                this.getDirector();
                            } else {
                                this.form_para.bookid = "";
                                this.form_para.directorid = [];
                            }

                        }
                    });
            },
            // 获取章节
            getDirector() {
                var subjectid = "";
                var bookid = "";

                if (this.is_add_or_update) {
                    subjectid = this.form_para.subjectid;
                    bookid = this.form_para.bookid;
                    this.form_para.directors = [];
                    if (this.addModal) {
                        this.form_para.directorid = [];
                    }
                } else {
                    subjectid = this.search_para.subjectid;
                    bookid = this.search_para.bookid;
                    this.search_para.directors = [];
                    this.search_para.directorid = [];
                }
                this.axios
                    .post("director/list_director", {
                        bookid: bookid,
                        levelid: this.levelid,
                        subjectid: subjectid,
                        schoolid: this.schoolid,
                        type: 3
                    })
                    .then(res => {
                        if (res.status == 200 && res.data.code == 0) {
                            var data = res.data;
                            // console.log(res.data)
                            // 循环把数据处理成可以展示的格式
                            if (data.obj.length > 0) {
                                var directors = [];
                                for (let i = 0; i < data.obj.length; i++) {
                                    var item = data.obj;

                                    directors.push({
                                        value: item[i].directorid + "_" + item[i].leaf,
                                        label: item[i].directorname,
                                        children: []
                                    });
                                    if (item[i].directors.length > 0) {
                                        for (let j = 0; j < item[i].directors.length; j++) {
                                            var item_1 = item[i].directors;
                                            directors[i].children.push({
                                                // id 拼加 字符串 用来判断
                                                value: item_1[j].directorid + "_" + item_1[j].leaf,
                                                label: item_1[j].directorname,
                                                children: []
                                            });
                                            if (item_1[j].directors.length > 0) {
                                                for (let k = 0; k < item_1[j].directors.length; k++) {
                                                    var item_2 = item_1[j].directors;
                                                    directors[i].children[j].children.push({
                                                        value: item_2[k].directorid + "_" + item_2[k].leaf,
                                                        label: item_2[k].directorname
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                                if (this.is_add_or_update) {
                                    this.form_para.directors = directors;
                                    if (this.addModal) {

                                    } else {
                                        if (this.form_para.directorid.length > 0) {
                                            if (!this.is_contain_id(directors, "value", this.form_para.directorid[0])) {
                                                this.form_para.directorid = [];
                                            }
                                        }

                                    }
                                } else {
                                    this.search_para.directors = directors;
                                    this.getquestion();
                                }
                            } else {
                                this.form_para.directorid = [];
                            }
                        } else {
                            this.form_para.directorid = [];
                        }

                    });
            },
            showAddModal: function () {
                this.addModal = true;
                this.opt_arr = [{
                    "id": "1",
                    "opt": ""
                }, {
                    "id": "2",
                    "opt": ""
                }, {
                    "id": "3",
                    "opt": ""
                }, {
                    "id": "4",
                    "opt": ""
                }];
                if (this.form_para.subjects.length === 0) {
                    this.getSubject();
                }
            },
            // 选择章节  //
            is_director: function (index) {
                // 检测拼接的字符串  拼接的有leaf
                // 如果有 不允许添加 并清空数组
                if (index.length > 0) {
                    var directors_index = index.length - 1;
                    if (index[directors_index].indexOf("_0", 0) > 0) {
                        this.$Message.error("该章节非可录入试题章节!");
                        if (this.is_add_or_update) {
                            this.form_para.directorid = [];
                        } else {
                            this.search_para.directorid = [];
                        }

                    }
                }
            },
            // 查询题目
            getquestion() {
                var directorid = "";
                if (this.search_para.directorid.length > 0) {
                    var directorid_ = this.search_para.directorid[this.search_para.directorid.length - 1];
                    var directorid_arr = directorid_.split("_");
                    directorid = directorid_arr[0];
                }

                this.axios
                    .post("question/list_question", {
                        levelid: this.levelid,
                        subjectid: this.search_para.subjectid,
                        bookid: this.search_para.bookid,
                        schoolid: this.schoolid,
                        directorid: directorid,
                        pageNum: this.pageNum
                    })
                    .then(res => {
                        // console.log(res)
                        this.ques_list = res.data.obj;
                        this.count = res.data.totalcount;
                        for (let i = 0; i < this.ques_list.length; i++) {
                            this.ques_list[i].ausername = (this.ques_list[i].createrUser || {}).ausername
                        }
                    });
            },
            cancel_add_or_update_ques() {
                this.$refs.editor_tigan_add.editor.container.firstChild.innerHTML =
                    "";
                this.$refs.editor_jiexi_add.editor.container.firstChild.innerHTML =
                    "";
                for (let i = 0; i < this.$refs.editor_xuanxiang_add.length; i++) {
                    var item = this.$refs.editor_xuanxiang_add[i];
                    item.editor.container.firstChild.innerHTML = "";
                }
                this.danxuan_corrent_index = -1;
                this.duoxuan_corrent_arr = [];

                if(this.qcomplex === ""){
                    this.qcomplex = "3";
                }
            },
            add_opt_click() {
                if (this.opt_arr.length < 8) {
                    this.opt_arr.push(
                        {
                            "id": Date.parse(new Date()) + "",
                            "opt": ""
                        });
                } else {
                    this.$Message.info("已达到最多选项");
                }
            },
            del_opt_click(index) {
                if (this.opt_arr.length > 4) {
                    this.opt_arr.splice(index, 1);
                } else {
                    this.$Message.info("至少保留四个选项");
                }
            },
            save_ques_click: function () {
                if (this.qtype === "1" && this.danxuan_corrent_index === -1) {
                    this.$Message.error("单选答案未选择!");
                    return;
                }
                if (this.qtype === "2" && this.duoxuan_corrent_arr.length < 2) {
                    this.$Message.error("多选题必须设置两个及以上正确答案!");
                    return;
                }

                if(this.qcomplex === ""){
                    this.$Message.error("难易度未选择!");
                    return;
                }

                //   题干
                var conhtml = this.$refs.editor_tigan_add.editor.container.firstChild
                    .innerHTML;
                var context = this.$refs.editor_tigan_add.editor.getText();
                //   解析
                var analysishtml = this.$refs.editor_jiexi_add.editor.container.firstChild
                    .innerHTML;
                if (context.trim() == "" && conhtml.indexOf("img", 0) === -1) {
                    this.$Message.error("题干不能为空!");
                    return;
                }
                if (this.form_para.directorid.length === 0) {
                    this.$Message.error("尚未选择录题章节!");
                    return;
                }
                var data_uditor = [];
                for (let i = 0; i < this.opt_arr.length; i++) {
                    var itemhtml = this.$refs.editor_xuanxiang_add[i].editor.container.firstChild
                        .innerHTML;
                    var itemtext = this.$refs.editor_xuanxiang_add[i].editor.getText();
                    // 验证非空  isBlank
                    if (itemtext.trim() == "") {
                        if (itemhtml.indexOf("img", 0) == -1) {
                            this.$Message.error("选项不能为空!");
                            return;
                        }
                    }

                    //   区分选项正确错误
                    var corrected = 0;
                    if (this.qtype === "1") {
                        corrected = this.danxuan_corrent_index === i ? 1 : 0;
                    } else {
                        if (this.duoxuan_corrent_arr.join("").indexOf("" + i) !== -1) {
                            corrected = 1;
                        } else {
                            corrected = 0;
                        }
                    }
                    data_uditor.push({
                        optiontcontent: itemhtml, //选项 富文本
                        corrected: corrected //选项  是否正确
                    });
                }
                //   对象 转 json  字符串
                var datas = JSON.stringify(data_uditor);

                var directorid_ = this.form_para.directorid[this.form_para.directorid.length - 1];
                var directorid_arr = directorid_.split("_");
                var directorid = directorid_arr[0];
                this.axios
                    .post("question/save_question", {
                        questionstem: conhtml, // 题干  富文本格式
                        qstemtxt: context, // 题干  纯文本格式
                        qanalyze: analysishtml, // 解析  富文本格式
                        levelid: this.levelid,
                        subjectid: this.form_para.subjectid,
                        bookid: this.form_para.bookid,
                        directorid: directorid,
                        schoolid: this.schoolid,
                        auserid: this.createid,
                        qtype: this.qtype,
                        qcomplex: this.qcomplex,
                        options: datas // 选项  json 字符串
                    })
                    .then(res => {
                        if (res.status == 200) {
                            var data = res.data.obj;
                            if (res.data.code == 0) {
                                this.$Message.success(res.data.msg);
                                this.getquestion()
                                // 清空内容
                                this.cancel_add_or_update_ques();
                                this.addModal = false;
                            } else {
                                this.$Message.error(res.data.msg);
                            }
                        } else {
                            this.$Message.error(this.$api.monmsg);
                        }
                    });
            },
            update_ques_click: function () {
                if (this.qtype === "1" && this.danxuan_corrent_index === -1) {
                    this.$Message.error("单选答案未选择!");
                    return;
                }
                if (this.qtype === "2" && this.duoxuan_corrent_arr.length < 2) {
                    this.$Message.error("多选题必须设置两个及以上正确答案!");
                    return;
                }

                if(this.qcomplex === ""){
                    this.$Message.error("难易度未选择!");
                    return;
                }

                var data_uditor = [];
                for (let i = 0; i < this.opt_arr.length; i++) {
                    var optionid = this.opt_arr[i].id;
                    var itemhtml = this.$refs.editor_xuanxiang_update[i].editor.container.firstChild
                        .innerHTML;
                    var itemtext = this.$refs.editor_xuanxiang_update[i].editor.getText();
                    // 验证非空  isBlank
                    if (itemtext.trim() == "") {
                        if (itemhtml.indexOf("img", 0) == -1) {
                            this.$Message.error("选项不能为空!");
                            return;
                        }
                    }


                    //   区分选项正确错误
                    var corrected = 0;
                    if (this.qtype === "1") {
                        corrected = this.danxuan_corrent_index === i ? 1 : 0;
                    } else {
                        if (this.duoxuan_corrent_arr.join("").indexOf("" + i) !== -1) {
                            corrected = 1;
                        } else {
                            corrected = 0;
                        }
                    }
                    data_uditor.push({
                        optionid: optionid,
                        optiontcontent: itemhtml, //选项 富文本
                        corrected: corrected //选项  是否正确
                    });
                }
                //   对象 转 json  字符串
                var datas = JSON.stringify(data_uditor);

                //   题干
                var conhtml = this.$refs.editor_tigan_update.editor.container.firstChild
                    .innerHTML;
                var context = this.$refs.editor_tigan_update.editor.getText();
                //   解析
                var analysishtml = this.$refs.editor_jiexi_update.editor.container.firstChild
                    .innerHTML;
                if (context.trim() == "" && conhtml.indexOf("img", 0) === -1) {
                    this.$Message.error("题干不能为空!");
                    return;
                }

                if (this.form_para.directorid.length == 0) {
                    this.$Message.error("尚未选择录题章节!");
                    return;
                }

                var directorid_ = this.form_para.directorid[this.form_para.directorid.length - 1];
                var directorid_arr = directorid_.split("_");
                var directorid = directorid_arr[0];
                this.axios
                    .post("question/update_question", {
                        directorid: directorid,
                        questionid: this.questionid,
                        questionstem: conhtml, // 题干  富文本格式
                        qstemtxt: context, // 题干  纯文本格式
                        qanalyze: analysishtml, // 解析  富文本格式
                        qtype: this.qtype,
                        qcomplex: this.qcomplex,
                        options: datas // 选项  json 字符串
                    })
                    .then(res => {
                        if (res.status == 200) {
                            var data = res.data.obj;
                            if (res.data.code == 0) {
                                this.$Message.success(res.data.msg);
                                // 清空内容
                                this.cancel_add_or_update_ques();
                                this.getquestion();
                                this.updateModal = false;

                            } else {
                                this.$Message.error(res.data.msg);
                            }
                        } else {
                            this.$Message.error(this.$api.monmsg);
                        }
                    });
            },
            del_ques_action() {
                this.axios
                    .post("question/delete_question", {
                        questionid: this.questionid
                    })
                    .then(res => {
                        if (res.status === 200) {
                            if(res.data.code === 0){
                                this.$Message.success(res.data.msg);
                                if(this.ques_list.length === 1 && this.pageNum > 1){
                                    this.pageNum -= 1;
                                }
                                this.getquestion();
                            }else{
                                this.$Message.error(res.data.msg);
                            }
                        }else{
                            this.$Message.error(this.$api.monmsg);
                        }
                    });
            }
        },
        created() {

        },
        mounted() {
            this.getSubject();
        }
    };
</script>

<style scoped lang="less">
    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal {
            top: 0;
        }
    }

    .abc {
        margin-top: 30px;
        width: 85%;
        position: relative;

        button {
            position: absolute;
            top: 26px;
            right: -110px;
        }
    }

    .xuan {
        // margin-left: 12px;
        font-size: 16px;
    }

    .modal-btn {
        height: 35px;
        margin-top: 12px;
        margin-left: 38%;
    }

    .ivu-radio-wrapper
    .ivu-radio-group-item
    .ivu-radio-wrapper-checked
    .ivu-radio-default {
        color: #fff !important;
    }

    .opt_item {
        display: flex;
        align-items: center;
        justify-content: left;
        margin-top: 4px;
        margin-bottom: 4px;
    }

    .opt_item .abc_item {
        width: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .ques_detail {
        overflow-x: auto;
    }

    .ques_detail img {
        max-width: 100% !important;
    }
</style>
