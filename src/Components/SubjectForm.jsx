import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SubjectForm() {
  const [formData, setFormData] = useState({
    course: "",
    bookname: "",
    author: "",
    edition: "",
    price: "",
    description: "",
    image: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    axios.post("https://project-full-stack-tawny.vercel.app/api/subjects", data)
      .then(() => navigate("/"))
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="course" placeholder="Course" onChange={handleChange} className="border w-full p-2" />
      <input name="bookname" placeholder="Book Name" onChange={handleChange} className="border w-full p-2" />
      <input name="author" placeholder="Author" onChange={handleChange} className="border w-full p-2" />
      <input name="edition" placeholder="Edition" onChange={handleChange} className="border w-full p-2" />
      <input name="price" placeholder="Price" onChange={handleChange} className="border w-full p-2" />
      <textarea name="description" placeholder="Description" onChange={handleChange} className="border w-full p-2"></textarea>
      <input type="file" onChange={handleFileChange} className="border w-full p-2" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}

export default SubjectForm;
