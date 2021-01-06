import { PropType } from "vue";
export interface ChunkOptions {
    headers: {
        [key: string]: any;
    };
    action: string;
    minSize: number;
    maxActive: number;
    maxRetries: number;
    handler: any;
}
export interface Data {
    active: boolean;
    dropActive: boolean;
    files: VueUploadItem[];
    maps: {
        [key: string]: VueUploadItem;
    };
    destroy: boolean;
    uploading: number;
    features: Features;
    dropElement: null | HTMLElement;
    reload: boolean;
}
export interface Features {
    html5: boolean;
    directory: boolean;
    drop: boolean;
}
export interface VueUploadItem {
    id: string;
    readonly fileObject?: boolean;
    name?: string;
    size?: number;
    type?: string;
    active?: boolean;
    error?: Error | string;
    success?: boolean;
    postAction?: string;
    putAction?: string;
    timeout?: number;
    data?: {
        [key: string]: any;
    };
    headers?: {
        [key: string]: any;
    };
    response?: {
        [key: string]: any;
    };
    progress?: string;
    speed?: 0;
    file?: Blob;
    xhr?: XMLHttpRequest;
    el?: HTMLInputElement;
    iframe?: HTMLElement;
    [key: string]: any;
}
export interface FileSystemEntry {
    isDirectory: boolean;
    isFile: boolean;
    name: string;
    fullPath: string;
    filesystem: string;
}
export interface FileSystemDirectoryReader {
    readEntries: (successCallback: (result: Array<FileSystemDirectoryEntry | FileSystemFileEntry>) => void, errorCallback?: (error: DOMError) => void) => void;
}
export interface FileSystemFlags {
    create?: boolean;
    exclusive?: boolean;
}
export interface FileSystemDirectoryEntry extends FileSystemEntry {
    isDirectory: true;
    isFile: false;
    createReader: () => FileSystemDirectoryReader;
    getFile: (path?: string, options?: FileSystemFlags, successCallback?: (result: FileSystemFileEntry) => void, errorCallback?: (error: DOMError) => void) => void;
    getDirectory: (path?: string, options?: FileSystemFlags, successCallback?: (result: FileSystemDirectoryEntry) => void, errorCallback?: (error: DOMError) => void) => void;
}
export interface FileSystemFileEntry extends FileSystemEntry {
    isDirectory: false;
    isFile: true;
    file: (cb: (file: File) => void) => void;
}
declare const _default: import("vue").DefineComponent<{
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
        type: PropType<(file: VueUploadItem, self: any) => Promise<VueUploadItem>>;
    };
    headers: {
        type: PropType<{
            [key: string]: any;
        }>;
        default: () => {};
    };
    data: {
        type: PropType<{
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
        type: PropType<string | RegExp | string[]>;
        default: () => never[];
    };
    modelValue: {
        type: PropType<VueUploadItem[]>;
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
        type: PropType<{
            headers?: {
                [key: string]: any;
            } | undefined;
            action?: string | undefined;
            minSize?: number | undefined;
            maxActive?: number | undefined;
            maxRetries?: number | undefined;
            handler?: any;
        }>;
        default: () => ChunkOptions;
    };
}, unknown, Data, {
    /**
     * uploading 正在上传的线程
     * @return {[type]} [description]
     */
    /**
     * uploaded 文件列表是否全部已上传
     * @return {[type]} [description]
     */
    uploaded(): boolean;
    chunkOptions(): ChunkOptions;
    className(): Array<string | undefined>;
    forId(): string;
    iMaximum(): number;
    iExtensions(): RegExp | undefined;
}, {
    newId(): string;
    clear(): true;
    get(id: string | VueUploadItem): VueUploadItem | false;
    add(_files: VueUploadItem | Blob | Array<VueUploadItem | Blob>, index?: number | boolean | undefined): VueUploadItem | VueUploadItem[] | undefined;
    addInputFile(el: HTMLInputElement): Promise<VueUploadItem[]>;
    addDataTransfer(dataTransfer: DataTransfer): Promise<VueUploadItem[] | undefined>;
    getFileSystemEntry(entry: Array<File | FileSystemFileEntry | FileSystemDirectoryEntry> | File | FileSystemFileEntry | FileSystemDirectoryEntry, path?: string): Promise<VueUploadItem[]>;
    replace(id1: VueUploadItem | string, id2: VueUploadItem | string): boolean;
    remove(id: VueUploadItem | string): VueUploadItem | false;
    update(id: VueUploadItem | string, data: {
        [key: string]: any;
    }): VueUploadItem | false;
    emitFilter(newFile: VueUploadItem | undefined, oldFile: VueUploadItem | undefined): boolean;
    emitFile(newFile: VueUploadItem | undefined, oldFile: VueUploadItem | undefined): void;
    emitInput(): void;
    upload(id: VueUploadItem | string): Promise<VueUploadItem>;
    /**
     * Whether this file should be uploaded using chunk upload or not
     *
     * @param Object file
     */
    shouldUseChunkUpload(file: VueUploadItem): boolean | 0 | undefined;
    /**
     * Upload a file using Chunk method
     *
     * @param File file
     */
    uploadChunk(file: VueUploadItem): Promise<VueUploadItem>;
    uploadPut(file: VueUploadItem): Promise<VueUploadItem>;
    uploadHtml5(file: VueUploadItem): Promise<VueUploadItem>;
    uploadXhr(xhr: XMLHttpRequest, ufile: VueUploadItem | undefined | false, body: FormData | Blob): Promise<VueUploadItem>;
    uploadHtml4(ufile: VueUploadItem | undefined | false): Promise<VueUploadItem>;
    watchActive(active: boolean): void;
    watchDrop(newDrop: boolean | string | HTMLElement | null, oldDrop?: boolean | string | HTMLElement | undefined): void;
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
export default _default;
