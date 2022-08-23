import { useDispatch, useSelector } from "react-redux"
import { useAppDispatch } from "../../../app/hooks"
import { anyQuestionIsSelecteed, setToNextQuestion } from "../quizSlice"

export default () => {
    const anyIsSelected = useSelector(anyQuestionIsSelecteed)

    if (!anyIsSelected) return NotStartedQuiz()

    return (<></>)
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