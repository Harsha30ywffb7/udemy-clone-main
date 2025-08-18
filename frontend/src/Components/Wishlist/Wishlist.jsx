import React, { useState } from "react";
import CourseCard from "../ProdCard/CourseCard";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const Wishlist = () => {
  const [activeTab, setActiveTab] = useState("allcourses");

  const tabs = [
    { id: "allcourses", label: "All courses" },
    { id: "mylists", label: "My Lists" },
    { id: "wishlist", label: "Wishlist" },
    { id: "archived", label: "Archived" },
    { id: "learningtools", label: "Learning tools" },
  ];

  return (
    <div className="w-full">
      {/* Header Tabs */}
      <div className="overflow-hidden border border-gray-300 bg-black text-gray-300 h-[150px]">
        <h1 className="ml-[340px] mt-[50px] text-white text-2xl font-semibold">
          My learning
        </h1>
        <div className="ml-[300px] flex space-x-4 mt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-lg transition duration-300 ${
                activeTab === tab.id
                  ? "border-b-4 border-gray-300"
                  : "hover:border-b-4 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="border border-gray-300 border-t-0 p-4">
        {activeTab === "allcourses" && (
          <div>
            <h3 className="text-xl font-semibold">London</h3>
            <p className="text-gray-600">
              London is the capital city of England.
            </p>
          </div>
        )}
        {activeTab === "mylists" && <div>No lists yet.</div>}
        {activeTab === "wishlist" && <Wishcard />}
        {activeTab === "archived" && (
          <div>
            <h3 className="text-xl font-semibold">Tokyo</h3>
            <p className="text-gray-600">Tokyo is the capital of Japan.</p>
          </div>
        )}
        {activeTab === "learningtools" && (
          <div>
            <h3 className="text-xl font-semibold">Learning Tools</h3>
            <p className="text-gray-600">Explore your learning tools here.</p>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="Search my courses"
          variant="outlined"
        />
      </Box>
    </div>
  );
};

export default Wishlist;

const Wishcard = () => {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
      </div>
    </div>
  );
};
