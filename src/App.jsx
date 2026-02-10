import React, { act, useEffect, useReducer } from 'react'
import DateCounter from './components/DateCounter'
import Header from "./components/Header"
import Main from './components/Main'
import Loader from './components/Loader'
import Error from "./components/Error"
import StartScreen from './components/StartScreen'
import { Question } from './components/Question'
import Options from './components/Options'
import NextButton from './components/NextButton'

const initialState = {
  questions: [],

  // "loading" "error" "ready" "active" "finished"
  status: "loading",
  index: 0,
  answer: null,
  points: 0
}

function reducer(state, action) {
  const question = state.questions.at(state.index)

  switch(action.type) {
    case "dataReceived":
      return {...state, questions: action.payload, status: "ready"}

    case "dataFailed":
      return {...state, status: "error"}  

    case "start":
      return {...state, status: "active"}  

    case "newAnswer":
      return {
        ...state, 
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points: state.points
        }

    case "nextQuestion":
        return {...state, index: state.index + 1, answer: null}


    default:
      return {...state, status: "error"} 
  }


}

const App = () => {
  const api = "http://localhost:9000/questions"
  const [{questions, status, index, answer}, dispatch] = useReducer(reducer, initialState);
  const numQuestions = questions.length;



  useEffect(function() {
      fetch(api)
      .then((res) => res.json())
      .then((data) => dispatch({type: "dataReceived", payload: data}))
      .catch(() => dispatch({type: "dataFailed"}))
  }, [])



  return (
    <>
      <div className='app'>
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === "active" && <Question questions= {questions[index]} dispatch= {dispatch} answer={answer} />}
      </Main>
    </div>
    <NextButton dispatch= {dispatch} answer={answer}/>
    </>
)}

export default App