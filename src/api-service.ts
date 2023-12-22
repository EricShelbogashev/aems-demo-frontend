import axios from 'axios';

export async function fetchElements() {
  const response = await axios.get('http://localhost:8080/api/v1/catalogs/reagents');
  return response.data;
}

export async function updateReagent(id, data) {
  await axios.put('http://localhost:8080/api/v1/management/reagents/' + id, data)
}
