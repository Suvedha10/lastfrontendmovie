import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function SubjectDetail() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    axios.get(`https://project-full-stack-tawny.vercel.app/api/subjects/${id}`)
      .then((res) => setSubject(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!subject) return <p>Loading...</p>;

  return (
    <div>
      <img src={`https://project-full-stack-tawny.vercel.app${subject.image}`} alt={subject.bookname} className="w-full h-64 object-cover mb-4" />
      <h1 className="text-2xl font-bold">{subject.bookname}</h1>
      <p>Author: {subject.author}</p>
      <p>Course: {subject.course}</p>
      <p>Edition: {subject.edition}</p>
      <p>Price: {subject.price}</p>
      <p>Description: {subject.description}</p>
    </div>
  );
}

export default SubjectDetail;
