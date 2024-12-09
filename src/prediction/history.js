import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import ImagePredictionCard from "./ImageCard"; // Assuming ImagePredictionCard is the correct component

const History = ({ fetchTrigger }) => {
  const { user } = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const getData = async () => {
      setLoading(true); // Start loading when fetching data
      setError(null); // Reset any previous errors

      try {
        const formData=new FormData();
        console.log("useremail", user.primaryEmailAddress.emailAddress);
        formData.append("useremail", user.primaryEmailAddress.emailAddress);
        const response = await fetch(process.env.REACT_APP_SERVER_URL, {
          method: "POST",
          body:formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Fetched Data:", result);
          setData(result); // Save data to state
        } else {
          console.error("Error fetching data:", response.statusText);
          setError("Failed to fetch data. Please try again later.");
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false); // Stop loading once the data is fetched or error occurs
      }
    };

    if (user?.primaryEmailAddress?.emailAddress) {
      getData();
    }
  }, [user, fetchTrigger]);

  if (!user) {
    return null; // If no user, return nothing
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col w-full items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">
          Prediction History
        </h1>
        <div className="flex justify-center">
          <div className="loader"></div>{" "}
          {/* You can use a CSS spinner or any loading indicator */}
        </div>
        <p className="text-gray-500">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">
        Prediction History
      </h1>
      <div className="flex flex-wrap gap-4 justify-center">
        {data.length > 0 ? (
          data.map((card) => <ImagePredictionCard key={card._id} data={card} />)
        ) : (
          <p className="text-gray-500">No history available yet.</p>
        )}
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}{" "}
      {/* Display error message if any */}
    </div>
  );
};

export default History;
