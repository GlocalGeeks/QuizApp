import React from 'react'

const NextButton = ({dispatch, answer, numQuestions, index, status}) => {
    if(answer === null) return;

    if(index < numQuestions -1)
      return (
        <button className='btn btn-ui' onClick={()=> dispatch({type: "nextQuestion"})}>
            Next
        </button>
      )

     if(index === numQuestions - 1 && status !== "finished")
      return (
        <button className='btn btn-ui' onClick={()=> dispatch({type: "finished"})}>
            Submit
        </button>
      )
}

export default NextButton