import { UserButton, useUser } from '@clerk/clerk-react';
import React, { useState } from 'react';
import History from './history';
 
function Prediction() {
  const { user } = useUser();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const handleFetchData = () => {
    // Toggle the fetchTrigger to notify the child to fetch data
    setFetchTrigger((prev) => !prev);
  };
  const [confidence, setConfidence] = useState([]);  // Store confidence values for each class
if (!user) {
  return <p>Loading...</p>;
} 

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    console.log(user.fullName, user.primaryEmailAddress.emailAddress);
    formData.append("username", user.fullName);
    formData.append("useremail",user.primaryEmailAddress.emailAddress);
    const serverUrl = process.env.REACT_APP_SERVER_URL;
  
    
    console.log("Server URL:", serverUrl);
  
    
    try {
      setLoading(true);  // Show loading indicator
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/upload-and-predict`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result.image)
        console.log("Prediction:", result.image.class);
        console.log("Confidence values:", result.image.probabilities);

        setPrediction(result.image.class);  // Set the predicted class
        setConfidence(result.image.probabilities);
        handleFetchData()
        // Set the confidence values for all classes
      } else {
        console.error("Error:", response.statusText);
        setPrediction(null);
        alert("Error processing the image. Please try again.");
   
      }
    } catch (err) {
      console.error("Error:", err);
      setPrediction(null);  // Reset prediction on error
    } finally {
      setLoading(false);  // Hide loading indicator after request is done
    }
  };

  const renderPrediction = () => {
    if (prediction === null) return null;
     

    // Display different content based on the prediction
    switch (prediction) {
      case 0:
        return (
          <div className="flex flex-col items-center mt-4">
            <span className="text-6xl">🟢</span> {/* Green Circle for Benign */}
            <p className="mt-2 text-xl font-bold text-green-600">Benign Cancer</p>
            <p className="text-lg text-gray-600">This indicates a non-cancerous condition, meaning the tumor is harmless and typically does not spread.</p>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col items-center mt-4">
            <span className="text-6xl">🔴</span> {/* Red Circle for Malignant */}
            <p className="mt-2 text-xl font-bold text-red-600">Malignant Cancer</p>
            <p className="text-lg text-gray-600">This indicates cancerous growth. Malignant tumors are harmful and may spread to other parts of the body.</p>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center mt-4">
            <span className="text-6xl">🟠</span> {/* Orange Circle for Normal */}
            <p className="mt-2 text-xl font-bold text-orange-600">Normal</p>
            <p className="text-lg text-gray-600">This indicates that the tissue is healthy with no signs of abnormalities or cancerous growth.</p>
          </div>
        );
      default:
        return (
          <div className="mt-4 text-xl text-gray-500">Prediction Unavailable</div>
        );
    }
  };

  return (
    <>
      <div
      className='w-full
      p-4
      bg-gray-100
      justify-between
      flex
      h-full
    '>
    <div></div><UserButton
  appearance={{
    elements: {
      avatarImage: {
        width: "50px", // Controls the avatar image size
        height: "50px", // Ensures it stays a square
        borderRadius: "50%", // Makes it circular
      },
      avatarBox: {
        width: "50px", // Adjust the container size
        height: "50px",
        display: "flex", // Ensures proper alignment
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden", // Clips oversized content
      },
    },
  }}
/>
</div>
    <div className="flex flex-col items-center min-h-screen bg-gray-100 space-y-6">
    
      <h1 className="text-3xl font-bold text-center text-gray-800">Lungs Cancer Detection</h1>
      <p className="text-lg text-center text-gray-600">Please upload your image below to detect the condition</p>

      <input
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            console.log("File Name:", file.name);
            console.log("File Type:", file.type);
            console.log("File Size:", file.size, "bytes");
            uploadImage(file);
          } else {
            console.log("No file selected");
          }
        }}
        type="file"
        className="mt-4 p-2 bg-blue-500 text-white rounded-lg cursor-pointer"
      />

      {/* Show loading state */}
      {loading && <div className="mt-4 text-xl text-blue-500">Processing image...</div>}

      {/* Display prediction result */}
      {renderPrediction()}

      {/* Display confidence for all classes */}
      {confidence.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Confidence Levels:</h2>
          <ul>
            {confidence.map((conf, index) => (
              <li key={index}>
                Class {index} {index===0&&"Benign Cancer"} {index===1&&"Malignant Cancer"} {index===2&&"Normal"}: {Math.round(conf * 100)}%
              </li>
            ))}
          </ul>
        </div>
      )}
      <History
      fetchTrigger={fetchTrigger}
      />
    </div>
    </>
  );
}

export default Prediction;
