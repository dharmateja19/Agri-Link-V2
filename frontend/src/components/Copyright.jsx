import React from "react";

const Copyright = () => {
  return (
    <footer className="bg-green-700 text-white py-4 text-center mt-auto">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} AgriLink. All rights reserved.
      </p>
    </footer>
  );
};

export default Copyright;
