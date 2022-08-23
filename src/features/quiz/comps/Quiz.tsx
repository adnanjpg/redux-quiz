import { useDispatch, useSelector } from "react-redux"
import { useAppDispatch } from "../../../app/hooks"
import { anyQuestionIsSelecteed, selectAllQuestionIds, selectSelectedQuestion, setToNextQuestion } from "../quizSlice"

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
        <div>
            {ids.map(ShowSelectableQuestion)}
        </div>
    )
}

function ShowSelectableQuestion(id: string) {

    return (
        <span>{id}</span>
    )
}