import type { PropType } from "vue";

export interface ChunkOptions {
    headers: { [key: string]: any };
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
    maps: { [key: string]: VueUploadItem };
    destroy: boolean;
    uploading: number;
    features: Features;
    dropElement: null | HTMLElement;
}

export interface Features {
    html5: boolean;
    directory: boolean;
    drop: boolean;
}



export interface VueUploadItem {
    id: string;

    // 是否是文件对象
    readonly fileObject?: boolean,

    // 文件名
    name?: string;

    // 文件字节
    size?: number,

    // 文件 mime 类型
    type?: string,

    // 是否激活中
    active?: boolean,

    // 错误消息
    error?: Error | string,

    // 是否成功
    success?: boolean,

    // post 地址
    postAction?: string;

    // putAction 地址
    putAction?: string;

    // timeout
    timeout?: number;

    // 请求 data
    data?: { [key: string]: any }

    // 请求 headers
    headers?: { [key: string]: any }

    // 响应信息
    response?: { [key: string]: any };

    // 进度
    progress?: string;          // 只读

    // 速度
    speed?: 0; // 只读

    // xhr 信息
    file?: Blob; // 只读
    xhr?: XMLHttpRequest; // 只读

    // el 信息  仅有 html4 使用
    el?: HTMLInputElement;

    // iframe 信息 仅有 html4 使用
    iframe?: HTMLElement;             // 只读

    [key: string]: any;
}


export interface Props{
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
    capture: {
    };
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
}



export interface FileSystemEntry {
    isDirectory: boolean
    isFile: boolean
    name: string
    fullPath: string
    filesystem: string
}
export interface FileSystemDirectoryReader {
    readEntries: (
        successCallback: (result: Array<FileSystemDirectoryEntry | FileSystemFileEntry>) => void,
        errorCallback?: (error: DOMError) => void,
    ) => void
}
export interface FileSystemFlags {
    create?: boolean
    exclusive?: boolean
}
export interface FileSystemDirectoryEntry extends FileSystemEntry {
    isDirectory: true
    isFile: false
    createReader: () => FileSystemDirectoryReader
    getFile: (
        path?: string,
        options?: FileSystemFlags,
        successCallback?: (result: FileSystemFileEntry) => void,
        errorCallback?: (error: DOMError) => void,
    ) => void
    getDirectory: (
        path?: string,
        options?: FileSystemFlags,
        successCallback?: (result: FileSystemDirectoryEntry) => void,
        errorCallback?: (error: DOMError) => void,
    ) => void
}
export interface FileSystemFileEntry extends FileSystemEntry {
    isDirectory: false
    isFile: true
    file: (cb: (file: File) => void) => void
}


