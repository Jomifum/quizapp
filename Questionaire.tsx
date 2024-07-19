import React from "react";

function Questionaire({
  handleAnswer,
  showAnswers,
  handleNextQuestion,
  handlePreviousQuestion,
  data: { question, correct_answer, answers, imageUrl },
  toggleDarkMode
}) {
  return (
    <>
      <div className={`questionClass ${toggleDarkMode ? 'dark-mode' : ''}`}>
        <h1 dangerouslySetInnerHTML={{ __html: question }} />
        {imageUrl && <img src={imageUrl} alt="Question related" style={{ width: '100%', borderRadius: '10px' }} />}
      </div>
      <div className={`button-overall ${toggleDarkMode ? 'dark-mode' : ''}`}>
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
              style={{ fontSize: '1.2em', padding: '20px', width: '45%', margin: '1%' }}
            />
          );
        })}
      </div>
      {showAnswers && (
        <div className="navigation-buttons">
          <button onClick={handlePreviousQuestion} className={`next-question ${toggleDarkMode ? 'dark-mode' : ''}`}>
            Previous Question
          </button>
          <button onClick={handleNextQuestion} className={`next-question ${toggleDarkMode ? 'dark-mode' : ''}`}>
            Next Question
          </button>
        </div>
      )}
    </>
  );
}

export default Questionaire;
