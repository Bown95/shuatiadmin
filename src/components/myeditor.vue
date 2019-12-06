<template>
    <div class="in-editor-panel">
        <quill-editor ref="quillEditor" v-model="content" :options="editorOption" @change="onChange"></quill-editor>
    </div>
</template>

<script type="text/ecmascript-6">
    import "quill/dist/quill.core.css";
    import "quill/dist/quill.snow.css";
    import {quillEditor, Quill} from "vue-quill-editor";
    import {ImageResize} from "../assets/quill-image-resize";
    import {container, ImageExtend, QuillWatch} from "../assets/libs/quill-image-extend-module";
    import {api} from "../assets/js/config"

    Quill.register("modules/ImageExtend", ImageExtend);
    Quill.register("modules/imageResize", ImageResize);

    export default {
        props: {
            value: {
                type: String,
                default: ""
            },
            curr_name: {
                type: String,
                default: ""
            },
            curr_index: {
                type: Number,
                default: 0
            },
            placeholder: {
                type: String,
                default: "请输入内容"
            },
            height: {
                type: Number,
                default: 170
            },
        },
        data() {
            return {
                content: "",
                toolbars: [
                    [
                        ["bold", "italic", "underline"],
                        [{list: "ordered"}, {list: "bullet"}],
                        [{align: []}],
                        ["image"]
                    ]
                ],
                editorOption: {
                    modules: {
                        imageResize: {},
                        ImageExtend: {
                            loading: true,
                            name: "file",
                            size: 5,
                            action: api.baseImageUrl + "upload/upload.do",
                            change: (xhr, formData) => {
                                formData.append("fileSource", "shuati/");
                                formData.append("originurl", "");
                            },
                            start: () => {
                            },
                            response: res => {
                                if (res.obj.fileUrl) {
                                    return api.showImageUrl + res.obj.fileUrl;
                                } else {
                                    return "";
                                }
                            }
                        },
                        toolbar: {
                            container: container,
                            handlers: {
                                image: function (value) {
                                    // console.info(value);
                                    QuillWatch.emit(this.quill.id);
                                }
                            }
                        }
                    },
                    placeholder: this.placeholder
                }
            };
        },
        computed: {
            editor() {
                return this.$refs.quillEditor.quill;
            }
        },
        watch: {},
        created() {
            // 指定工具栏
            this.editorOption.modules.toolbar.container = this.toolbars[0];
        },
        mounted() {
            // 设置编辑器高度
            this.editor.container.style.height = `${this.height}px`;
            this.editor.container.firstChild.innerHTML = this.value;
        },
        methods: {
            onChange() {
                // 告知父组件内容发生变化
                this.$emit("myeditor_change", this.content, this.curr_index, this.curr_name);
            }
        },
        components: {
            quillEditor
        }
    };
</script>
