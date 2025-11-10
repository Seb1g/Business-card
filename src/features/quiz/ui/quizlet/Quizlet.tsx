import React, {useState} from "react";
import styles from "./quizlet.module.scss";
import {useAppSelector} from "../../../../app/store.ts";
import {Navigate, useNavigate} from "react-router-dom";

function htmlDecode(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

export const Quizlet: React.FC = () => {
  const navigate = useNavigate();
  const {questions, categoryQuestions} = useAppSelector((state) => state.quizQuestions);
  const answers: (string[] | undefined)[] | undefined = questions?.results.map((q) => [
      q.correct_answer,
      ...(Array.isArray(q.incorrect_answers) ? q.incorrect_answers : [q.incorrect_answers])
    ].sort(() => Math.random() - 0.5)
  );
  const allQuestions: string[] | undefined = questions?.results.map((q) => q.question);
  const questionsCount: number = questions ? questions.results.length : 0;
  const [step, setStep] = useState<number>(0);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);

  const isFinished = step >= questionsCount && questionsCount > 0;

  if (!questions || !allQuestions || !answers) {
    return <Navigate to="/quiz" replace/>;
  }

  const handleAnswerClick = (selectedAnswer: string) => {
    if (selectedAnswer === htmlDecode(questions.results[step].correct_answer)) {
      setCorrectAnswer(correctAnswer + 1);
    }
    if (step < questionsCount) {
      setStep(step + 1);
    }
  };

  const progressPercent = Math.min(Math.max(((step + 1) / questionsCount) * 100, 0), 100);
  const currentQuestionText = allQuestions[step] || '';
  const currentAnswers = answers[step] || [];

  if (isFinished) {
    interface QuizResult {
      correctAnswer: number;
      countQuestions: number;
      category: string | null;
    }

    const result: QuizResult = {
      correctAnswer: correctAnswer,
      countQuestions: questionsCount,
      category: categoryQuestions,
    };

    function saveResultToLocalStorage(result: QuizResult) {
      let key;
      for (let index = 0; ; index++) {
        key = index;
        if (!localStorage.getItem(key.toString())) {
          break;
        }
      }
      localStorage.setItem(key.toString(), JSON.stringify(result));
    }
    saveResultToLocalStorage(result);

    return (
      <div className={`${styles.quizlet__container} ${styles['quizlet__container--finished']}`}>
        <div className={styles.quizlet__card}>
          <h2 className={styles.quizlet__finish_title}>The quiz is over!</h2>
          <p className={styles.quizlet__finish_text}>You answered {correctAnswer} questions out
            of {questionsCount} correctly.</p>
          <button
            onClick={() => navigate("/quiz")}
            className={styles.quizlet__restart_button}
          >
            Go through one more
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quizlet__container}>
      <div className={styles.quizlet__card}>
        <div className={styles.quizlet__progress_bar_wrapper}>
          <div
            className={styles.quizlet__progress_bar}
            style={{width: `${progressPercent}%`}}
          />
        </div>

        <div className={styles.quizlet__step_indicator}>
          Вопрос {step + 1} из {questionsCount}
        </div>

        <div className={styles.quizlet__question}>
          <p>{htmlDecode(currentQuestionText)}</p>
        </div>

        <div className={styles.quizlet__answers_container}>
          {currentAnswers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(answer)}
              className={styles.quizlet__answer_button}
            >
              {htmlDecode(answer)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
