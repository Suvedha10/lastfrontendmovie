import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';



const App = () => {

  const API_URL = "https://fullstackproject-gilt.vercel.app/api/movie"; 

  const [form, setForm] = useState({
    movie_name: '',
    movie_rating: 0,
    description: '',
    image: null,
    preview: ''
  });

  const [movies, setMovies] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch movies from the backend
  const fetchMovies = async () => {
    try {
      const response = await axios.get(API_URL);
      const updatedMovies = response.data.map((movie) => {
        if (movie.image && movie.image.data) {
          const base64Image = `data:image/jpeg;base64,${Buffer.from(movie.image.data).toString('base64')}`;
          return { ...movie, image: base64Image };
        }
        return movie;
      });
      setMovies(updatedMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Handle form submission for creating or updating a movie

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('movie_name', form.movie_name);
      formData.append('movie_rating', form.movie_rating);
      formData.append('description', form.description);
  
      // Check if image is selected, append to FormData
      if (form.image) {
        formData.append('image', form.image);
      }
  
      // Log form data for debugging purposes
      console.log("Submitting FormData:", formData);
  
      // If editing, update movie; else, create a new movie
      if (editingId) {
        // Updating movie
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null); // Clear editing ID after update
      } else {
        // Creating new movie
        await axios.post(API_URL, formData);
      }
  
      // Reset form fields
      setForm({
        movie_name: '',
        movie_rating: '',
        description: '',
        image: null,
        preview: null,
      });
  
      // Refresh the movies list after the submit
      fetchMovies();
    } catch (error) {
      // Enhanced error logging for better debugging
      console.error("Error submitting movie form:", error);
      if (error.response) {
        console.error("Response Error:", error.response.data);
      }
    }
  };
  
  

  // Delete a movie by ID
  const deleteMovie = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMovies(movies.filter((movie) => movie._id !== id)); // Remove from UI after delete
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  // Handle file change for image upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setForm({ ...form, image: file, preview: reader.result });
      };

      reader.readAsDataURL(file);
    }
  };

  // Set form data for editing a movie
  const editMovie = (movie) => {
    setForm({
      movie_name: movie.movie_name,
      movie_rating: movie.movie_rating,
      description: movie.description,
      image: null,
      preview: movie.image,
    });
    setEditingId(movie._id);
  };

  // Fetch movies on initial load
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Movie Management</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-base-100 p-6 rounded-lg shadow-md max-w-xl mx-auto mb-8"
        >
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Movie Name</span>
            </label>
            <input
              type="text"
              placeholder="Movie Name"
              value={form.movie_name}
              onChange={(e) => setForm({ ...form, movie_name: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Rating</span>
            </label>
            <input
              type="number"
              placeholder="Rating"
              value={form.movie_rating}
              onChange={(e) => setForm({ ...form, movie_rating: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="textarea textarea-bordered w-full"
              required
            />
          </div>
          <div className="form-control mb-4">
            <input type="file" onChange={handleFileChange} className="file-input file-input-bordered w-full" />
            {form.preview && (
              <img
                src={form.preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg mt-4"
              />
            )}
          </div>
          <button type="submit" className="btn btn-primary w-full">
            {editingId ? 'Update Movie' : 'Create Movie'}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie._id} className="card bg-base-100 shadow-md">
              <figure>
                <img
                  src={movie.image}
                  alt={movie.movie_name}
                  className="w-70 h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{movie.movie_name}</h2>
                <p>Rating: {movie.movie_rating}</p>
                <p>{movie.description}</p>
                
                <div className="card-actions justify-end">
                  <button
                    onClick={() => editMovie(movie)}
                    className="btn btn-info btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMovie(movie._id)}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
