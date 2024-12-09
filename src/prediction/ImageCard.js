import React from "react";

const ImagePredictionCard = ({ data }) => {
  if (!data) return <p>Loading...</p>;

  const { Url, class: userClass, probabilities } = data;

  // Map classes to their names
  const colors = ["green", "red", "orange"];
  const classNames = ["Benign", "Malignant", "Normal"];
  const borderColors = [
    "border-green-500",
    "border-red-500",
    "border-orange-500",
  ]; // Tailwind color classes for dynamic border colors

  return (
    <div
      className={`w-80 bg-red rounded-lg shadow-lg border-2 ${borderColors[userClass]} overflow-hidden`} // Dynamic border color
    >
      <img
        src={Url}
        alt={`Predicted class: ${classNames[userClass]}`}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <div className="mb-2">
          <span className="text-sm text-gray-500">Predicted Class:</span>
          <span
            className={`ml-2 font-semibold
            text-${colors[userClass]}-600
            `}
          >
            {classNames[userClass]}
          </span>
        </div>
        <div className="flex justify-between space-x-2">
          {probabilities.map((probability, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-gray-100 p-2 rounded-md shadow-sm w-full"
            >
              <span className="text-sm text-gray-500">{classNames[index]}</span>
              <span className="text-gray-800 font-semibold">
                {(probability * 100).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImagePredictionCard;
