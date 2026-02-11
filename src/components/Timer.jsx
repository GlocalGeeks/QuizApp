import React, { useEffect } from 'react';

const Timer = ({ answer, dispatch, seconds }) => {
    const mins = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => clearInterval(id);
  }, [answer, dispatch]);

  return (
    <div className="timer">{`${mins < 10 && "0"}${mins}:${sec}`}</div>
  );
};

export default Timer;
