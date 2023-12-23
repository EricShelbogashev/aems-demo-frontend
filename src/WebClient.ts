import axios, {AxiosResponse} from 'axios';

// Определяем типы для данных реагента и журнала
interface ReagentData {
  name: string;
  latexFormula: string;
  molarWeight: number;
  description: string;
  hazardCategory: string;
}
// Создаем экземпляр axios с базовым URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1/'
});

// Функция для получения всех записей журнала
const getAllJournals = async (): Promise<AxiosResponse> => {
  return await axiosInstance.get('catalogs/journals');
};

// Функция для создания новой записи журнала
const createJournalEntry = async (title: string): Promise<AxiosResponse> => {
  return await axiosInstance.post('catalogs/journals', {title});
};

// Функция для обновления записи журнала
const updateJournalEntry = async (id: number, title: string): Promise<AxiosResponse> => {
  return await axiosInstance.put(`catalogs/journals/${id}`, {title});
};

// Функция для получения всех реагентов
const getAllReagents = async (): Promise<AxiosResponse> => {
  return await axiosInstance.get('catalogs/reagents');
};

// Функция для создания нового реагента
const createReagent = async (reagentData: ReagentData): Promise<AxiosResponse> => {
  return await axiosInstance.post('catalogs/reagents', reagentData);
};

// Функция для обновления существующего реагента
const updateReagent = async (id: number, reagentData: ReagentData): Promise<AxiosResponse> => {
  return await axiosInstance.put(`management/reagents/${id}`, reagentData);
};

// Функция для удаления реагента
const deleteReagent = async (id: number): Promise<AxiosResponse> => {
  return await axiosInstance.delete(`management/reagents/${id}`);
};

interface JournalContent {
  text: string;
}

interface UsageData {
  reagentId: number;
  journalId: number;
  reason: string;
  quantity: number;
  unit: string;
}

// Функция для получения статистики использования всех реагентов
const getAllUsageStats = async (): Promise<AxiosResponse> => {
  return await axiosInstance.get('management/usage-entries');
};

// Функция для получения содержимого журнала
const getJournalContent = async (journalId: number): Promise<AxiosResponse> => {
  return await axiosInstance.get(`sources/journals/${journalId}`);
};

// Функция для получения статистики использования реагента
const getReagentUsageStats = async (id: number): Promise<AxiosResponse> => {
  return await axiosInstance.get(`management/reagents/${id}/consumption-stats`);
};

// Функция для обновления текста в журнале
const updateJournalText = async (journalId: number, text: string): Promise<AxiosResponse> => {
  return await axiosInstance.post(`sources/journals/${journalId}`, {text});
};

// Функция для добавления записи об использовании реагента в журнал
const addReagentUsageEntry = async (journalId: number, usageData: UsageData): Promise<AxiosResponse> => {
  return await axiosInstance.post(`sources/journals/${journalId}/usages`, usageData);
};

// Функция для удаления записи об использовании реагента из журнала
const deleteReagentUsageEntry = async (journalId: number, usageId: number): Promise<AxiosResponse> => {
  return await axiosInstance.delete(`sources/journals/${journalId}/usages/${usageId}`);
};

// Функция для удаления записи журнала
const deleteJournalEntry = async (journalId: number): Promise<AxiosResponse> => {
  return await axiosInstance.delete(`sources/journals/${journalId}`);
};

export {
  getAllJournals,
  createJournalEntry,
  updateJournalEntry,
  getAllReagents,
  createReagent,
  updateReagent,
  deleteReagent,
  getReagentUsageStats,
  getAllUsageStats,
  getJournalContent,
  updateJournalText,
  addReagentUsageEntry,
  deleteReagentUsageEntry,
  deleteJournalEntry,
};
