import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

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

export const quizSlice = createSlice(
    {
        name: 'quiz',
        initialState,
        reducers: {

        }
    }
)

export const selectCurrentQuestion = (state: RootState) => {
    const quz = state.quiz
    const slctd = quz.selectedQuestionId

    if (slctd == null) {
        return null
    }

    return quz.questions.find(e => e.id == slctd)
}


export default quizSlice.reducer;