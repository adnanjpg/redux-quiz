import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import assert from "assert"
import { AppThunk, RootState } from "../../app/store"

import questions from "../../assets/questions.json"

export interface QuestionAnswer {
    id: string,
    text: string
}

export interface Question {
    id: string,
    text: string,
    answers: Array<QuestionAnswer>,
    correctAnswersIds: Array<string>,
}

// this defines the state of selected
// answers for each questions
export interface SelectedAnswer {
    qid: string,
    ansids: Array<string>
}

export interface QuizState {
    selectedQuestionId?: string,
    questions: Array<Question>,
    selectedAnswers: Array<SelectedAnswer>
}

const initialState: QuizState = {
    questions: questions,
    selectedAnswers: []
}

// this will be used to determine wether to show a radio or a checkbox
const isQuizMultiSelection = (que: Question) => que.correctAnswersIds.length > 1

const isAnswerCorrect = (ans: QuestionAnswer, que: Question) => que.correctAnswersIds.includes(ans.id)

const isFirstQuestion = (que: Question, state: RootState) => {
    let fQ = selectFirstQuestion(state)

    if (fQ == undefined) {
        throw new Error("There is no first question")
    }

    return que.id == fQ.id
}

const isLastQuestion = (que: Question, state: RootState) => {
    let lQ = selectLastQuestion(state)

    if (lQ == undefined) {
        throw new Error("There is no last question")
    }

    return que.id == lQ.id
}

export const quizSlice = createSlice(
    {
        name: 'quiz',
        initialState,
        reducers: {
            setSelectedQuestion: (state, action: PayloadAction<string>) => {
                state.selectedQuestionId = action.payload
            }
        }
    }
)

export const anyQuestionIsSelecteed = (state: RootState) => state.quiz.selectedQuestionId != null

export const selectCurrentQuestionId = (state: RootState) => state.quiz.selectedQuestionId

export const selectFirstQuestion = (state: RootState) => state.quiz.questions.at(0)

export const selectLastQuestion = (state: RootState) => {
    const q = state.quiz
    const ques = q.questions

    const len = ques.length

    return ques.at(len - 1)
}


export const selectSelectedQuestion = (state: RootState) => {
    const quz = state.quiz
    const slctd = selectCurrentQuestionId(state)

    if (slctd == null) {
        return null
    }

    return quz.questions.find(e => e.id == slctd)
}

export const selectAllQuestions = (state: RootState) => state.quiz.questions
export const selectAllQuestionIds = (state: RootState) => selectAllQuestions(state).map(e => e.id)

export const { setSelectedQuestion } = quizSlice.actions

export const setToNextQuestion = (): AppThunk =>
    (dispatch, getState) => {
        const currentValue = selectCurrentQuestionId(getState()) || "1";

        try {
            const intId: number = +currentValue

            dispatch(setSelectedQuestion(String(intId + 1)))

        } catch (error) {
            throw new Error("Ur id should be int convertible!!!");
        }
    };

export default quizSlice.reducer;