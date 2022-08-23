import { useDispatch, useSelector } from "react-redux"
import { useAppDispatch } from "../../../app/hooks"
import { anyQuestionIsSelecteed, selectAllQuestionIds, selectSelectedQuestion, setSelectedQuestion, setToNextQuestion } from "../quizSlice"

export default () => {
    const anyIsSelected = useSelector(anyQuestionIsSelecteed)

    if (!anyIsSelected) return NotStartedQuiz()

    return (<>
        <ShowSelectedQuestion></ShowSelectedQuestion>
        <ShowSelectableQuestions></ShowSelectableQuestions>
    </>)
}

function NotStartedQuiz() {
    const dispatch = useAppDispatch()

    const startQuiz = () => dispatch(setToNextQuestion())

    return (
        <div>
            <span>
                Welcome to the Friends Quiz
            </span>
            <div>
                <button onClick={startQuiz}>lets get Started!</button>
            </div>
        </div>
    )
}

function ShowSelectedQuestion() {
    const selected = useSelector(selectSelectedQuestion)!

    return <div>
        {selected.text}
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
        <a>
            <span
                onClick={switchToQuestion}
                className="px-2 py-2 mx-1 rounded-md bg-green-300 cursor-pointer">
                {id}
            </span>
        </a>
    )
}