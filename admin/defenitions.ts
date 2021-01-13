export type LogDataItem = string | {
    info: string,
    message: string
};

export interface LogItem {
    startTime: string;
    categoryName: string;
    data: LogDataItem[];
    level: {
        level: number,
        levelStr: string,
        colour: 'blue' | 'cyan' | 'green' | 'yellow' | 'red' | 'magenta';
        class?: string;
    };
    context: any;
    pid: number;
}
