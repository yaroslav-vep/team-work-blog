import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosApi from '../api/axiosApi';
import { Category, PostFormData } from '../types';
import axios from 'axios';

const CreatePost: React.FC = () => {
  const [formData, setFormData] = useState<PostFormData>({ title: '', content: '', categoryId: '' });
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosApi.get<Category[]>('/categories');
        setCategories(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(`Ошибка загрузки категорий: ${err.response.data.message || 'Попробуйте снова.'}`);
        } else {
          setError('Ошибка соединения с сервером.');
        }
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      console.log('Sending create post request:', formData);
      await axiosApi.post('/posts', formData);
      navigate('/posts');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error('Create post error:', err.response.data);
        setError(`Ошибка создания поста: ${err.response.data.message || 'Попробуйте снова.'}`);
      } else {
        console.error('Network error:', err);
        setError('Ошибка соединения с сервером.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Создать пост</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Заголовок"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Содержание"
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Выберите категорию</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Создать
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
