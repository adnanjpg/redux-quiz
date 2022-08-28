import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useAppDispatch } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { anyQuestionIsSelecteed, isAnswerSelected, isQuestionMultiSelection, QuestionAnswer, selectAllQuestionIds, selectSelectedAnswersForQ, selectSelectedQuestion, setAnswer, setSelectedQuestion, setToNextQuestion, toggleAnswer } from "../quizSlice"

export default () => {
    const anyIsSelected = useSelector(anyQuestionIsSelecteed)

    if (!anyIsSelected) return NotStartedQuiz()

    return (
        <div className="flex flex-row">
            <div className="w-3 sm:w-10 md:w-36 lg:w-96"></div>
            <div className="grow">
                <ShowSelectedQuestion></ShowSelectedQuestion>
                <ShowSelectableQuestions></ShowSelectableQuestions>
            </div>
            <div className="sm:w-10 md:w-16 lg:w-96"></div>
        </div>
    )
}

function NotStartedQuiz() {
    const dispatch = useAppDispatch()

    const startQuiz = () => dispatch(setToNextQuestion())

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <span className="text-xl">
                Welcome to the Friends Quiz
            </span>
            <div className="my-3"></div>
            <div className="text-xl">
                <button className="primary-button" onClick={startQuiz}>lets get Started!</button>
            </div>
        </div>
    )
}

function ShowSelectedQuestion() {
    const selected = useSelector(selectSelectedQuestion)!

    return <div>
        <div className="my-3">{selected.text}</div>
        <div key={selected.id}>
            <ShowQuestionAnswers></ShowQuestionAnswers>
        </div>
    </div>
}

function ShowQuestionAnswers() {
    const selectedQ = useSelector(selectSelectedQuestion)!

    let answers = selectedQ.answers

    let isMultiSelection = isQuestionMultiSelection(selectedQ)


    if (isMultiSelection) {
        return <div>{answers.map(ShowQAnswerCheckbox)}</div>
    }

    return ShowQuestionAnswersRadio()
}

function ShowQuestionAnswersRadio() {
    const dispatch = useAppDispatch()

    const selectedQ = useSelector(selectSelectedQuestion)!
    const qid = selectedQ.id

    const selectedAnswers = useSelector(state => selectSelectedAnswersForQ({
        state: state as RootState,
        qid: qid,
    }))?.ansids

    // as this is a radio, there is only 1 selected value. 
    // we make sure of that by calling setAnswer and not
    // toggleAnswer
    const selectedAnswerId = selectedAnswers?.at(0)

    let answers = selectedQ.answers

    const onToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        e.persist()

        return dispatch(
            setAnswer({
                ansid: e.target.value, qid: qid
            })
        )
    }

    return (
        <div >
            {
                answers.map(e =>
                    <div key={e.id}>
                        <input
                            className="me-2"
                            type="radio"
                            value={e.id}
                            checked={e.id === selectedAnswerId}
                            onChange={onToggleChange}
                            name={e.id} />
                        <span>{e.text}</span>
                    </div>
                )
            }
        </div>
    )
}

function ShowQAnswerCheckbox(ans: QuestionAnswer) {
    const dispatch = useAppDispatch()

    const selectedQ = useSelector(selectSelectedQuestion)!

    const qid = selectedQ.id
    const ansid = ans.id

    const isAnsSelected = useSelector(state => isAnswerSelected({
        state: state as RootState,
        qid: qid,
        ansid: ansid,
    }))

    const onToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist()

        return dispatch(
            toggleAnswer({
                ansid: ans.id,
                qid: qid,
                ischecked: e.target.checked
            })
        )
    }

    return <div key={ansid}>
        <input
            className="me-2"
            type="checkbox"
            checked={isAnsSelected}
            onChange={onToggleChange}
        />
        <span>{ans.text}</span>
    </div>
}

function ShowSelectableQuestions() {
    const ids = useSelector(selectAllQuestionIds)

    return (
        <div className="my-3">
            {ids.map(ShowSelectableQuestion)}
        </div>
    )
}

function ShowSelectableQuestion(id: string) {
    const dispatch = useAppDispatch()

    const switchToQuestion = () => dispatch(setSelectedQuestion(id))

    return (
        <div key={id}>
            <a>
                <span
                    onClick={switchToQuestion}
                    className="px-2 py-2 mx-1 rounded-md bg-green-300 cursor-pointer">
                    {id}
                </span>
            </a>
        </div>
    )
}