import { apiClient } from "./apiClient";

export enum QuestionModule {
  kanji_reading = "Kanji Reading",
  orthography = "Orthography",
  word_formation = "Word Formation",
  paraphrases = "Paraphrases",
  contextually_defined_expression = "Contextually Defined Expression",
  usage = "Usage",
  selecting_grammar_form = "Selecting Grammar Form",
  sentence_composition = "Sentence Composition",
  text_grammar = "Text Grammar",
  short_passage = "Short Passage",
  mid_passage = "Mid Passage",
  long_passage = "Long Passage",
  integrated_reading_comprehension = "Integrated Reading Comprehension",
  thematic_comprehension = "Thematic Comprehension",
  information_retrieval = "Information Retrieval",
  text_based_comprehension = "Text-Based Comprehension",
  keypoints_comprehension = "Keypoints Comprehension",
  general_outline_comprehension = "General Outline Comprehension",
  verbal_expression = "Verbal Expression",
  quick_response = "Quick Response",
  integrated_listening_comprehension = "Integrated Listening Comprehension",
}

export enum QuestionCategory {
  Moji_Goi = "Moji_Goi",
  Grammar = "Grammar",
  Reading = "Reading",
  Listening = "Listening",
}

export interface Question {
  _id: string;
  refText: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  module: QuestionModule;
  category: QuestionCategory;
  point: number;
  refImage?: string;
  refAudio?: string;
  tags: string[];
}

export const questionApi = {
  getQuestions: (admin?: boolean) =>
    apiClient.get<{ data: Question[] }>(
      `/questions${admin ? "?admin=true" : ""}`,
    ),
  getQuestionsBySection: (sectionId: string) =>
    apiClient.get<{ data: Question[] }>(`/questions/section/${sectionId}`),
  createQuestion: (data: Omit<Question, "_id">) =>
    apiClient.post<{ data: Question }>("/questions", data),
  updateQuestion: (id: string, data: Partial<Question>) =>
    apiClient.put<{ data: Question }>(`/questions/${id}`, data),
  deleteQuestion: (id: string) => apiClient.delete(`/questions/${id}`),
};
