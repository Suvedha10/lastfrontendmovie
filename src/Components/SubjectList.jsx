import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function SubjectList() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    axios.get("https://project-full-stack-tawny.vercel.app/api/subjects")
      .then((res) => setSubjects(res.data.subjects))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subjects</h1>
      <Link to="/add" className="bg-blue-500 text-white px-4 py-2 rounded">Add Subject</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {subjects.map((subject) => (
          <div key={subject._id} className="border p-4 rounded">
            <img src={`https://project-full-stack-tawny.vercel.app${subject.image}`} alt={subject.bookname} className="w-full h-48 object-cover mb-2" />
            <h2 className="text-xl font-bold">{subject.bookname}</h2>
            <p>{subject.author}</p>
            <Link to={`/subjects/${subject._id}`} className="text-blue-500">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectList;
