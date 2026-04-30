// resources/js/types/question.ts
export interface ChoiceOption {
    id?: string | number;
    text?: string;
    markKey?: string;
    choice?: string;
}

export interface QuestionOption {
    choice: ChoiceOption | string;
    reason?: string;
}

export interface QuestionType {
    code: string;
}

export interface Question {
    id: number;
    question: string;
    options: any;
    correct_answer?: string | string[];
    question_type?: QuestionType;
    tabs?: string[] | string;
    solution?: string[] | string;
    intro?: string;
    units: string;
    match_option?: Record<string, unknown> | string | null;
    match_options?: Record<string, unknown> | string | null;
    table_header?: string[] | string;
    mtx_option?: Record<string, string>;
    total_points: any;
}
