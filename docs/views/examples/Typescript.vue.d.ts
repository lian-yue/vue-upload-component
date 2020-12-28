import { SetupContext } from 'vue';
import type { VueUploadItem } from '../../../src/FileUpload.vue';
declare const _default: {
    components: {
        FileUpload: import("vue").DefineComponent<{
            inputId: {
                type: StringConstructor;
            };
            name: {
                type: StringConstructor;
                default: string;
            };
            accept: {
                type: StringConstructor;
            };
            capture: {};
            disabled: {
                default: boolean;
            };
            multiple: {
                type: BooleanConstructor;
                default: boolean;
            };
            maximum: {
                type: NumberConstructor;
            };
            addIndex: {
                type: (BooleanConstructor | NumberConstructor)[];
            };
            directory: {
                type: BooleanConstructor;
            };
            createDirectory: {
                type: BooleanConstructor;
                default: boolean;
            };
            postAction: {
                type: StringConstructor;
            };
            putAction: {
                type: StringConstructor;
            };
            customAction: {
                type: import("vue").PropType<(file: VueUploadItem, self: any) => Promise<VueUploadItem>>;
            };
            headers: {
                type: import("vue").PropType<{
                    [key: string]: any;
                }>;
                default: () => {};
            };
            data: {
                type: import("vue").PropType<{
                    [key: string]: any;
                }>;
                default: () => {};
            };
            timeout: {
                type: NumberConstructor;
                default: number;
            };
            drop: {
                default: boolean;
            };
            dropDirectory: {
                type: BooleanConstructor;
                default: boolean;
            };
            size: {
                type: NumberConstructor;
                default: number;
            };
            extensions: {
                type: import("vue").PropType<string | RegExp | string[]>;
                default: () => never[];
            };
            modelValue: {
                type: import("vue").PropType<VueUploadItem[]>;
                default: () => never[];
            };
            thread: {
                type: NumberConstructor;
                default: number;
            };
            chunkEnabled: {
                type: BooleanConstructor;
                default: boolean;
            };
            chunk: {
                type: import("vue").PropType<{
                    headers?: {
                        [key: string]: any;
                    } | undefined;
                    action?: string | undefined;
                    minSize?: number | undefined;
                    maxActive?: number | undefined;
                    maxRetries?: number | undefined;
                    handler?: any;
                }>;
                default: () => import("../../../src/FileUpload.vue").ChunkOptions;
            };
        }, unknown, import("../../../src/FileUpload.vue").Data, {
            uploaded(): boolean;
            chunkOptions(): import("../../../src/FileUpload.vue").ChunkOptions;
            className(): (string | undefined)[];
            forId(): string;
            iMaximum(): number;
            iExtensions(): RegExp | undefined;
        }, {
            newId(): string;
            clear(): true;
            get(id: string | VueUploadItem): false | VueUploadItem;
            add(_files: VueUploadItem | Blob | (VueUploadItem | Blob)[], index?: number | boolean | undefined): VueUploadItem | VueUploadItem[] | undefined;
            addInputFile(el: HTMLInputElement): Promise<VueUploadItem[]>;
            addDataTransfer(dataTransfer: DataTransfer): Promise<VueUploadItem[] | undefined>;
            getFileSystemEntry(entry: import("../../../src/FileUpload.vue").FileSystemDirectoryEntry | import("../../../src/FileUpload.vue").FileSystemFileEntry | File | (import("../../../src/FileUpload.vue").FileSystemDirectoryEntry | import("../../../src/FileUpload.vue").FileSystemFileEntry | File)[], path?: string): Promise<VueUploadItem[]>;
            replace(id1: string | VueUploadItem, id2: string | VueUploadItem): boolean;
            remove(id: string | VueUploadItem): false | VueUploadItem;
            update(id: string | VueUploadItem, data: {
                [key: string]: any;
            }): false | VueUploadItem;
            emitFilter(newFile: VueUploadItem | undefined, oldFile: VueUploadItem | undefined): boolean;
            emitFile(newFile: VueUploadItem | undefined, oldFile: VueUploadItem | undefined): void;
            emitInput(): void;
            upload(id: string | VueUploadItem): Promise<VueUploadItem>;
            shouldUseChunkUpload(file: VueUploadItem): boolean | 0 | undefined;
            uploadChunk(file: VueUploadItem): Promise<VueUploadItem>;
            uploadPut(file: VueUploadItem): Promise<VueUploadItem>;
            uploadHtml5(file: VueUploadItem): Promise<VueUploadItem>;
            uploadXhr(xhr: XMLHttpRequest, ufile: false | VueUploadItem | undefined, body: Blob | FormData): Promise<VueUploadItem>;
            uploadHtml4(ufile: false | VueUploadItem | undefined): Promise<VueUploadItem>;
            watchActive(active: boolean): void;
            watchDrop(newDrop: string | boolean | HTMLElement | null, oldDrop?: string | boolean | HTMLElement | undefined): void;
            onDragenter(e: DragEvent): void;
            onDragleave(e: DragEvent): void;
            onDragover(e: DragEvent): void;
            onDocumentDrop(): void;
            onDrop(e: DragEvent): void;
            inputOnChange(e: Event): Promise<any>;
        }, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "input-filter" | "input-file")[], "update:modelValue" | "input-filter" | "input-file", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
            name: string;
            disabled: boolean;
            multiple: boolean;
            directory: boolean;
            createDirectory: boolean;
            headers: {
                [key: string]: any;
            };
            data: {
                [key: string]: any;
            };
            timeout: number;
            drop: boolean;
            dropDirectory: boolean;
            size: number;
            extensions: string | RegExp | string[];
            modelValue: VueUploadItem[];
            thread: number;
            chunkEnabled: boolean;
            chunk: {
                headers?: {
                    [key: string]: any;
                } | undefined;
                action?: string | undefined;
                minSize?: number | undefined;
                maxActive?: number | undefined;
                maxRetries?: number | undefined;
                handler?: any;
            };
        } & {
            inputId?: string | undefined;
            accept?: string | undefined;
            capture?: unknown;
            maximum?: number | undefined;
            addIndex?: number | boolean | undefined;
            postAction?: string | undefined;
            putAction?: string | undefined;
            customAction?: ((file: VueUploadItem, self: any) => Promise<VueUploadItem>) | undefined;
        }>, {
            name: string;
            disabled: boolean;
            multiple: boolean;
            directory: boolean;
            createDirectory: boolean;
            headers: {
                [key: string]: any;
            };
            data: {
                [key: string]: any;
            };
            timeout: number;
            drop: boolean;
            dropDirectory: boolean;
            size: number;
            extensions: string | RegExp | string[];
            modelValue: VueUploadItem[];
            thread: number;
            chunkEnabled: boolean;
            chunk: {
                headers?: {
                    [key: string]: any;
                } | undefined;
                action?: string | undefined;
                minSize?: number | undefined;
                maxActive?: number | undefined;
                maxRetries?: number | undefined;
                handler?: any;
            };
        }>;
    };
    setup(props: unknown, context: SetupContext): {
        files: import("vue").Ref<never[]>;
        upload: import("vue").Ref<({
            $: import("vue").ComponentInternalInstance;
            $data: import("../../../src/FileUpload.vue").Data;
            $props: Partial<{
                name: string;
                disabled: boolean;
                multiple: boolean;
                directory: boolean;
                createDirectory: boolean;
                headers: {
                    [key: string]: any;
                };
                data: {
                    [key: string]: any;
                };
                timeout: number;
                drop: boolean;
                dropDirectory: boolean;
                size: number;
                extensions: string | RegExp | string[];
                modelValue: VueUploadItem[];
                thread: number;
                chunkEnabled: boolean;
                chunk: {
                    headers?: {
                        [key: string]: any;
                    } | undefined;
                    action?: string | undefined;
                    minSize?: number | undefined;
                    maxActive?: number | undefined;
                    maxRetries?: number | undefined;
                    handler?: any;
                };
            }> & Pick<Readonly<{
                name: string;
                disabled: boolean;
                multiple: boolean;
                directory: boolean;
                createDirectory: boolean;
                headers: {
                    [key: string]: any;
                };
                data: {
                    [key: string]: any;
                };
                timeout: number;
                drop: boolean;
                dropDirectory: boolean;
                size: number;
                extensions: string | RegExp | string[];
                modelValue: VueUploadItem[];
                thread: number;
                chunkEnabled: boolean;
                chunk: {
                    headers?: {
                        [key: string]: any;
                    } | undefined;
                    action?: string | undefined;
                    minSize?: number | undefined;
                    maxActive?: number | undefined;
                    maxRetries?: number | undefined;
                    handler?: any;
                };
            } & {
                inputId?: string | undefined;
                accept?: string | undefined;
                capture?: unknown;
                maximum?: number | undefined;
                addIndex?: number | boolean | undefined;
                postAction?: string | undefined;
                putAction?: string | undefined;
                customAction?: ((file: VueUploadItem, self: any) => Promise<VueUploadItem>) | undefined;
            }> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, "inputId" | "accept" | "capture" | "maximum" | "addIndex" | "postAction" | "putAction" | "customAction" | "style" | "key" | "ref" | "onVnodeBeforeMount" | "onVnodeMounted" | "onVnodeBeforeUpdate" | "onVnodeUpdated" | "onVnodeBeforeUnmount" | "onVnodeUnmounted" | "class">;
            $attrs: Record<string, unknown>;
            $refs: Record<string, unknown>;
            $slots: Readonly<{
                [name: string]: import("vue").Slot | undefined;
            }>;
            $root: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null;
            $parent: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null;
            $emit: (event: "update:modelValue" | "input-filter" | "input-file", ...args: any[]) => void;
            $el: any;
            $options: import("vue").ComponentOptionsBase<Readonly<{
                name: string;
                disabled: boolean;
                multiple: boolean;
                directory: boolean;
                createDirectory: boolean;
                headers: {
                    [key: string]: any;
                };
                data: {
                    [key: string]: any;
                };
                timeout: number;
                drop: boolean;
                dropDirectory: boolean;
                size: number;
                extensions: string | RegExp | string[];
                modelValue: VueUploadItem[];
                thread: number;
                chunkEnabled: boolean;
                chunk: {
                    headers?: {
                        [key: string]: any;
                    } | undefined;
                    action?: string | undefined;
                    minSize?: number | undefined;
                    maxActive?: number | undefined;
                    maxRetries?: number | undefined;
                    handler?: any;
                };
            } & {
                inputId?: string | undefined;
                accept?: string | undefined;
                capture?: unknown;
                maximum?: number | undefined;
                addIndex?: number | boolean | undefined;
                postAction?: string | undefined;
                putAction?: string | undefined;
                customAction?: ((file: VueUploadItem, self: any) => Promise<VueUploadItem>) | undefined;
            }>, unknown, import("../../../src/FileUpload.vue").Data, {
                uploaded(): boolean;
                chunkOptions(): import("../../../src/FileUpload.vue").ChunkOptions;
                className(): (string | undefined)[];
                forId(): string;
                iMaximum(): number;
                iExtensions(): RegExp | undefined;
            }, {
                newId(): string;
                clear(): true;
                get(id: string | VueUploadItem): false | VueUploadItem;
                add(_files: VueUploadItem | Blob | (VueUploadItem | Blob)[], index?: number | boolean | undefined): VueUploadItem | VueUploadItem[] | undefined;
                addInputFile(el: HTMLInputElement): Promise<VueUploadItem[]>;
                addDataTransfer(dataTransfer: DataTransfer): Promise<VueUploadItem[] | undefined>;
                getFileSystemEntry(entry: import("../../../src/FileUpload.vue").FileSystemDirectoryEntry | import("../../../src/FileUpload.vue").FileSystemFileEntry | File | (import("../../../src/FileUpload.vue").FileSystemDirectoryEntry | import("../../../src/FileUpload.vue").FileSystemFileEntry | File)[], path?: string): Promise<VueUploadItem[]>;
                replace(id1: string | VueUploadItem, id2: string | VueUploadItem): boolean;
                remove(id: string | VueUploadItem): false | VueUploadItem;
                update(id: string | VueUploadItem, data: {
                    [key: string]: any;
                }): false | VueUploadItem;
                emitFilter(newFile: VueUploadItem | undefined, oldFile: VueUploadItem | undefined): boolean;
                emitFile(newFile: VueUploadItem | undefined, oldFile: VueUploadItem | undefined): void;
                emitInput(): void;
                upload(id: string | VueUploadItem): Promise<VueUploadItem>;
                shouldUseChunkUpload(file: VueUploadItem): boolean | 0 | undefined;
                uploadChunk(file: VueUploadItem): Promise<VueUploadItem>;
                uploadPut(file: VueUploadItem): Promise<VueUploadItem>;
                uploadHtml5(file: VueUploadItem): Promise<VueUploadItem>;
                uploadXhr(xhr: XMLHttpRequest, ufile: false | VueUploadItem | undefined, body: Blob | FormData): Promise<VueUploadItem>;
                uploadHtml4(ufile: false | VueUploadItem | undefined): Promise<VueUploadItem>;
                watchActive(active: boolean): void;
                watchDrop(newDrop: string | boolean | HTMLElement | null, oldDrop?: string | boolean | HTMLElement | undefined): void;
                onDragenter(e: DragEvent): void;
                onDragleave(e: DragEvent): void;
                onDragover(e: DragEvent): void;
                onDocumentDrop(): void;
                onDrop(e: DragEvent): void;
                inputOnChange(e: Event): Promise<any>;
            }, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "input-filter" | "input-file")[], string, {
                name: string;
                disabled: boolean;
                multiple: boolean;
                directory: boolean;
                createDirectory: boolean;
                headers: {
                    [key: string]: any;
                };
                data: {
                    [key: string]: any;
                };
                timeout: number;
                drop: boolean;
                dropDirectory: boolean;
                size: number;
                extensions: string | RegExp | string[];
                modelValue: VueUploadItem[];
                thread: number;
                chunkEnabled: boolean;
                chunk: {
                    headers?: {
                        [key: string]: any;
                    } | undefined;
                    action?: string | undefined;
                    minSize?: number | undefined;
                    maxActive?: number | undefined;
                    maxRetries?: number | undefined;
                    handler?: any;
                };
            }>;
            $forceUpdate: import("vue").ReactiveEffect<any>;
            $nextTick: typeof import("vue").nextTick;
            $watch(source: string | Function, cb: Function, options?: import("vue").WatchOptions<boolean> | undefined): import("vue").WatchStopHandle;
        } & Readonly<{
            name: string;
            disabled: boolean;
            multiple: boolean;
            directory: boolean;
            createDirectory: boolean;
            headers: {
                [key: string]: any;
            };
            data: {
                [key: string]: any;
            };
            timeout: number;
            drop: boolean;
            dropDirectory: boolean;
            size: number;
            extensions: string | RegExp | string[];
            modelValue: VueUploadItem[];
            thread: number;
            chunkEnabled: boolean;
            chunk: {
                headers?: {
                    [key: string]: any;
                } | undefined;
                action?: string | undefined;
                minSize?: number | undefined;
                maxActive?: number | undefined;
                maxRetries?: number | undefined;
                handler?: any;
            };
        } & {
            inputId?: string | undefined;
            accept?: string | undefined;
            capture?: unknown;
            maximum?: number | undefined;
            addIndex?: number | boolean | undefined;
            postAction?: string | undefined;
            putAction?: string | undefined;
            customAction?: ((file: VueUploadItem, self: any) => Promise<VueUploadItem>) | undefined;
        }> & import("vue").ShallowUnwrapRef<{}> & import("../../../src/FileUpload.vue").Data & {
            uploaded: boolean;
            chunkOptions: import("../../../src/FileUpload.vue").ChunkOptions;
            className: (string | undefined)[];
            forId: string;
            iMaximum: number;
            iExtensions: RegExp | undefined;
        } & {
            newId(): string;
            clear(): true;
            get(id: string | VueUploadItem): false | VueUploadItem;
            add(_files: VueUploadItem | Blob | (VueUploadItem | Blob)[], index?: number | boolean | undefined): VueUploadItem | VueUploadItem[] | undefined;
            addInputFile(el: HTMLInputElement): Promise<VueUploadItem[]>;
            addDataTransfer(dataTransfer: DataTransfer): Promise<VueUploadItem[] | undefined>;
            getFileSystemEntry(entry: import("../../../src/FileUpload.vue").FileSystemDirectoryEntry | import("../../../src/FileUpload.vue").FileSystemFileEntry | File | (import("../../../src/FileUpload.vue").FileSystemDirectoryEntry | import("../../../src/FileUpload.vue").FileSystemFileEntry | File)[], path?: string): Promise<VueUploadItem[]>;
            replace(id1: string | VueUploadItem, id2: string | VueUploadItem): boolean;
            remove(id: string | VueUploadItem): false | VueUploadItem;
            update(id: string | VueUploadItem, data: {
                [key: string]: any;
            }): false | VueUploadItem;
            emitFilter(newFile: VueUploadItem | undefined, oldFile: VueUploadItem | undefined): boolean;
            emitFile(newFile: VueUploadItem | undefined, oldFile: VueUploadItem | undefined): void;
            emitInput(): void;
            upload(id: string | VueUploadItem): Promise<VueUploadItem>;
            shouldUseChunkUpload(file: VueUploadItem): boolean | 0 | undefined;
            uploadChunk(file: VueUploadItem): Promise<VueUploadItem>;
            uploadPut(file: VueUploadItem): Promise<VueUploadItem>;
            uploadHtml5(file: VueUploadItem): Promise<VueUploadItem>;
            uploadXhr(xhr: XMLHttpRequest, ufile: false | VueUploadItem | undefined, body: Blob | FormData): Promise<VueUploadItem>;
            uploadHtml4(ufile: false | VueUploadItem | undefined): Promise<VueUploadItem>;
            watchActive(active: boolean): void;
            watchDrop(newDrop: string | boolean | HTMLElement | null, oldDrop?: string | boolean | HTMLElement | undefined): void;
            onDragenter(e: DragEvent): void;
            onDragleave(e: DragEvent): void;
            onDragover(e: DragEvent): void;
            onDocumentDrop(): void;
            onDrop(e: DragEvent): void;
            inputOnChange(e: Event): Promise<any>;
        } & import("vue").ComponentCustomProperties) | null>;
        inputFilter: (newFile: VueUploadItem | undefined, oldFile: VueUploadItem | undefined, prevent: (prevent?: boolean | undefined) => boolean) => boolean | undefined;
        inputFile: (newFile: VueUploadItem | undefined, oldFile: VueUploadItem | undefined) => void;
    };
};
export default _default;
