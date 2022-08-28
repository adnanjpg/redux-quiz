import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { anyQuestionIsSelecteed, isAnswered, isAnswerSelected, isQuestionMultiSelection, QuestionAnswer, selectAllQuestionIds, selectIsInFirstQuestion, selectIsInLastQuestion, selectSelectedAnswersForQ, selectSelectedQuestion, setAnswer, setSelectedQuestion, setToNextQuestion, setToPrevQuestion, toggleAnswer } from "../quizSlice"

export default () => {
    const anyIsSelected = useAppSelector(anyQuestionIsSelecteed)

    if (!anyIsSelected) return NotStartedQuiz()

    return (
        <div className="flex flex-row h-screen">

            <div className="w-3 sm:w-10 md:w-36 lg:w-96"></div>

            <div className="grow">

                <div className="flex flex-col h-screen">

                    <div className="grow">
                        <div className="flex flex-col h-full">
                            <div className="my-auto">
                                <ShowSelectedQuestion></ShowSelectedQuestion>
                            </div>
                        </div>
                    </div>

                    <div className="h-12">
                        <ShowSelectableQuestions></ShowSelectableQuestions>
                    </div>

                </div>


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
    const selected = useAppSelector(selectSelectedQuestion)!

    return <div>
        <div className="my-3">{selected.text}</div>
        <div key={selected.id}>
            <ShowQuestionAnswers></ShowQuestionAnswers>
        </div>
    </div>
}

function ShowQuestionAnswers() {
    const selectedQ = useAppSelector(selectSelectedQuestion)!

    let answers = selectedQ.answers

    let isMultiSelection = isQuestionMultiSelection(selectedQ)


    if (isMultiSelection) {
        return <div>{answers.map(ShowQAnswerCheckbox)}</div>
    }

    return ShowQuestionAnswersRadio()
}

function ShowQuestionAnswersRadio() {
    const dispatch = useAppDispatch()

    const selectedQ = useAppSelector(selectSelectedQuestion)!
    const qid = selectedQ.id

    const selectedAnswers = useAppSelector(state => selectSelectedAnswersForQ({
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

    const selectedQ = useAppSelector(selectSelectedQuestion)!

    const qid = selectedQ.id
    const ansid = ans.id

    const isAnsSelected = useAppSelector(state => isAnswerSelected({
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
    const dispatch = useAppDispatch()

    const ids = useAppSelector(selectAllQuestionIds)

    const isFirst = useAppSelector(selectIsInFirstQuestion)
    const isLast = useAppSelector(selectIsInLastQuestion)

    const prevQ = () => isFirst ? null : dispatch(setToPrevQuestion())
    const nextQ = () => isLast ? null : dispatch(setToNextQuestion())

    return (
        <div className="flex flex-row justify-between align-middle">

            <div className="w-10">
                <button
                    className="secondary-button"
                    onClick={prevQ}
                    disabled={isFirst}
                >Previous</button>
            </div>

            <div className="grow">
                <div className="flex flex-row justify-center">
                    <div className="">
                        {ids.map(ShowSelectableQuestion)}
                    </div>
                </div>
            </div>

            <div className="w-10">
                <button
                    className="secondary-button"
                    onClick={nextQ}
                    disabled={isLast}
                >Next</button>
            </div>

        </div>
    )
}

function ShowSelectableQuestion(id: string) {
    const dispatch = useAppDispatch()

    const switchToQuestion = () => dispatch(setSelectedQuestion(id))
    const isAns = useAppSelector(state => isAnswered({ state: state, qid: id }))

    return (
        <span
            className={`bg-secondary px-2 py-2 mx-1 rounded-md cursor-pointer ${isAns ? "bg-cool" : "bg-secondary"}`}
            key={id}
        >
            <a>
                <span
                    className="text-white"
                    onClick={switchToQuestion}>
                    {id}
                </span>
            </a>
        </span>
    )
}