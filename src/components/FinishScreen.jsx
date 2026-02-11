import React from "react";

const FinishScreen = ({ points, maxPossiblePoints, highScore, dispatch}) => {
  const percentage = (points / maxPossiblePoints) * 100;
  let emoji;
  if (percentage >= 90 && percentage <= 100) {
    emoji = "🥇";
  } else if (percentage >= 80) {
    emoji = "🥈";
  } else if (percentage >= 70) {
    emoji = "🥉";
  } else if (percentage >= 60) {
    emoji = "🏅";
  } else if (percentage >= 50) {
    emoji = "😕";
  } else if (percentage >= 1) {
    emoji = "😢";
  } else {
    emoji = "❌";
  }

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of{" "}
        {maxPossiblePoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">{`High Score: ${highScore} points`} </p>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
};

export default FinishScreen;
