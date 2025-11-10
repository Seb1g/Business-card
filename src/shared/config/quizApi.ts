import axios from "axios";

export const getCategories = () => {
  return axios.get("https://opentdb.com/api_category.php");
}

export interface GetQuestionsCredential {
  count: string | undefined,
  category: string | undefined,
  difficulty: string | undefined,
  type: string | undefined
}

export const getQuestions = async (credential: GetQuestionsCredential) => {
  let url = "https://opentdb.com/api.php";
  if (credential.count) {
    url += `?amount=${credential.count}`;
  }
  if (credential.category !== undefined) {
    url += `&category=${credential.category}`;
  }
  if (credential.difficulty !== undefined) {
    url += `&difficulty=${credential.difficulty}`;
  }
  if (credential.type !== undefined) {
    url += `&type=${credential.type}`;
  }

  return axios.get(url);
}
