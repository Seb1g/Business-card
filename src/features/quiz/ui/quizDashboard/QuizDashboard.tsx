import React, { useEffect, useState, useMemo } from "react";
import styles from "./quizDashboard.module.scss";
import { getCategoriesThunk } from "../../model/quizDashboard/getCategoriesThunk.ts";
import { useAppDispatch, useAppSelector } from "../../../../app/store.ts";
import { useNavigate } from "react-router-dom";
import { getQuestionsThunk } from "../../model/quizlet/getQuestionsThunk.ts";
import { setCategoryQuestions } from "../../model/quizlet/getQuestionsSlice.ts";

interface QuizDataInterface {
  correctAnswer: number;
  countQuestions: number;
  category: string | null;
}

interface QuizResultsModalProps {
  results: QuizDataInterface[];
  onClose: () => void;
}

const QuizResultsModal: React.FC<QuizResultsModalProps> = ({ results, onClose }) => {
  if (!results || results.length === 0) {
    return (
      <div
        className={styles['modal-overlay']}
        onClick={onClose}
      >
        <div
          className={styles['modal-card']}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className={styles['modal-title']}>Results history</h3>
          <p className={styles['modal-text']}>You don't have any saved quiz results yet.</p>
          <button
            className={styles['modal-primary-button']}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      className={styles['modal-overlay']}
      onClick={onClose}
    >
      <div
        className={styles['modal-card']}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={styles['modal-main-title']}>Your quiz history</h3>
        <div className={styles['results-list']}>
          {results.map((result, index) => (
            <div
              key={index}
              className={styles['result-item']}
            >
              <div className={styles['result-header']}>
                <span className={styles['result-category']}>
                  {result.category || 'All categories'}
                </span>
              </div>
              <div className={styles['result-score']}>
                <span className={styles['result-correct-answers']}>{result.correctAnswer}</span> / <span
                className={styles['result-total-questions']}>{result.countQuestions}</span>
              </div>
              <p className={styles['result-description']}>
                Correct answers from the total number of questions.
              </p>
            </div>
          ))}
        </div>

        <button
          className={styles['modal-primary-button']}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const difficulty = [
  {
    "id": 1,
    "name": "Easy"
  },
  {
    "id": 2,
    "name": "Medium"
  },
  {
    "id": 3,
    "name": "Hard"
  }
]

const typeQuestion = [
  {
    "id": 1,
    "name": "Boolean"
  },
  {
    "id": 2,
    "name": "Multiple"
  }
]

export const QuizDashboard = () => {
  const dispatch = useAppDispatch();
  const [startQuizOpen, setStartQuizOpen] = useState<boolean>(false);
  const [showResultsModal, setShowResultsModal] = useState<boolean>(false);

  const [userResults, setUserResults] = useState<QuizDataInterface[]>([]);

  const { categories } = useAppSelector((state) => state.quizCategories);
  const navigate = useNavigate();
  const selectedData = useMemo(() => new Map([["count", "10"]]), [])

  useEffect(() => {
    dispatch(getCategoriesThunk())
  }, [dispatch]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setStartQuizOpen(false);
    }
  };

  const handleStartQuiz = async () => {
    await dispatch(getQuestionsThunk({
      count: selectedData.get("count"),
      category: selectedData.get("category"),
      difficulty: selectedData.get("difficulty"),
      type: selectedData.get("type")
    }))

    const selectedCategory = selectedData.get("category")

    if (selectedCategory !== undefined && categories) {
      const selectedCategoryId = parseInt(selectedCategory);

      const foundObject = categories.trivia_categories.find(item => item.id === selectedCategoryId);

      let resultName = null;

      if (foundObject) {
        resultName = foundObject.name;
      }


      if (resultName === null) {
        console.warn("Category name not found for ID:", selectedCategory);
      } else {
        dispatch(setCategoryQuestions(resultName));
      }
    }
    setStartQuizOpen(false);
    navigate("/quiz/let");
  }

  const openResultsModal = () => {
    const results: QuizDataInterface[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const item = key ? localStorage.getItem(key) : null;

      if (item) {
        try {
          const parsedData = JSON.parse(item);
          if (
            typeof parsedData === 'object' && parsedData !== null &&
            typeof parsedData.correctAnswer === 'number' &&
            typeof parsedData.countQuestions === 'number' &&
            (typeof parsedData.category === 'string' || parsedData.category === null)
          ) {
            results.push(parsedData as QuizDataInterface);
          }
        } catch (e) {
          console.log(e)
          continue;
        }
      }
    }

    setUserResults(results);
    setShowResultsModal(true);
  }

  return (
    <div className={styles.dashboard__container}>
      <header className={styles.dashboard__header}>
        <div className={styles['header__title']} onClick={() => navigate("/")}>Anemone Quiz App</div>
        <div className={styles['header__actions']}>
          <button
            onClick={openResultsModal}
            className={styles['header__results-button']}
          >
            My results
          </button>
          {/*<div className={styles['header__profile']}>Profile</div>*/}
        </div>
      </header>
      <div className={styles['dashboard__main-content']}>
        <div className={styles['welcome-card']}>
          <h1 className={styles['welcome-card__title']}>
            Test your knowledge
          </h1>
          <span className={styles['welcome-card__subtitle']}>
            Choose your settings and start the quiz now!
          </span>

          <button
            type="button"
            onClick={() => setStartQuizOpen(true)}
            className={styles['welcome-card__start-button']}
          >
            Start the quiz!
          </button>
        </div>
      </div>
      {startQuizOpen && (
        <div
          onClick={handleOverlayClick}
          className={styles['modal-overlay']}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles['settings-modal']}
          >
            <h3 className={styles['modal-title']}>Quiz settings</h3>
            <div className={styles['settings-modal__form-group']}>
              <input
                type="number"
                min={1}
                defaultValue={selectedData.get("count")}
                max={50}
                className={styles['settings-modal__input']}
                placeholder="Questions count (1-50)"
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  selectedData.set("count", selectedValue);
                }}
              />
              <select
                name="category"
                className={styles['settings-modal__select']}
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  selectedData.set("category", selectedValue);
                }}
              >
                <option value="">Select category</option>
                {categories?.trivia_categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <select
                name="difficulty"
                className={styles['settings-modal__select']}
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  selectedData.set("difficulty", selectedValue.toLowerCase());
                }}
              >
                <option value="">Select difficult</option>
                {difficulty.map((difficult) => (
                  <option key={difficult.id} value={difficult.name}>{difficult.name}</option>
                ))}
              </select>
              <select
                name="typeQuestion"
                className={styles['settings-modal__select']}
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  selectedData.set("type", selectedValue.toLowerCase());
                }}
              >
                <option value="">Select type</option>
                {typeQuestion.map((type) => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className={styles['settings-modal__actions']}>
              <button
                onClick={() => setStartQuizOpen(false)}
                className={styles['modal-secondary-button']}
              >
                Close
              </button>
              <button
                onClick={handleStartQuiz}
                className={styles['modal-primary-button']}
              >
                Begin!
              </button>
            </div>
          </div>
        </div>
      )}

      {showResultsModal && (
        <QuizResultsModal
          results={userResults}
          onClose={() => setShowResultsModal(false)}
        />
      )}
    </div>
  )
}
