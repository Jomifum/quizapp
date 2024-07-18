import React from "react";

function Questionaire({
  handleAnswer,
  showAnswers,
  handleNextQuestion,
  handlePreviousQuestion,
  data: { question, correct_answer, answers, imageUrl },
}) {
  return (
    <>
      <div className="questionClass">
        <h1 dangerouslySetInnerHTML={{ __html: question }} />
        {imageUrl && <img src={imageUrl} alt="related to question" className="question-image" />}
      </div>
      <div className="button-overall">
        {answers.map((answer, idx) => {
          const specialClassName = showAnswers
            ? answer === correct_answer
              ? "green-button"
              : "red-button"
            : "";
          return (
            <button
              key={idx}
              className={`normal-button ${specialClassName}`}
              onClick={() => handleAnswer(answer)}
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          );
        })}
      </div>
      {showAnswers && (
        <>
          <button onClick={handleNextQuestion} className="next-question">
            Next Question
          </button>
          <br />
          <button onClick={handlePreviousQuestion} className="next-question">
            Previous Question
          </button>
        </>
      )}
    </>
  );
}

export default Questionaire;

