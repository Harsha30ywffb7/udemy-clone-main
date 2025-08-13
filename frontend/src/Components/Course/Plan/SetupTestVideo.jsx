import React from "react";
import "./SetupTestVideo.css";

const SetupTestVideo = () => {
  const courseSetupData = {
    tips: [
      {
        title: "Equipment can be easy.",
        description:
          "You don’t need to buy fancy equipment. Most smartphone cameras can capture video in HD, and you can record audio on another phone or external microphone.",
      },
      {
        title: "Students need to hear you.",
        description:
          "A good microphone is the most important piece of equipment you will choose. There are a lot of affordable options. Make sure it’s correctly plugged in and 6-12 inches (15-30 cm) from you.",
      },
      {
        title: "Make a studio.",
        description:
          "Clean up your background and arrange props. Almost any small space can be transformed with a backdrop made of colored paper or an ironed bed sheet.",
      },
      {
        title: "Light the scene and your face.",
        description:
          "Turn off overhead lights. Experiment with three-point lighting by placing two lamps in front of you and one behind aimed at the background.",
      },
      {
        title: "Reduce noise and echo.",
        description:
          "Turn off fans or air vents, and record at a time when it’s quiet. Place acoustic foam or blankets on the walls, and bring in rugs or furniture to dampen echo.",
      },
      {
        title: "Be creative.",
        description:
          "Students won’t see behind the scenes. No one will know if you’re surrounded by pillows for soundproofing…unless you tell other instructors in the community!",
      },
    ],
    requirements: [
      {
        text: "Film and export in HD to create videos of at least 720p, or 1080p if possible",
      },
      {
        text: "Audio should come out of both the left and right channels and be synced to your video",
      },
      {
        text: "Audio should be free of echo and background noise so as not to be distracting to students",
      },
    ],
    resources: [
      {
        title: "Teaching Center: Guide to equipment",
        link: "https://www.udemy.com/instructor/resources/teaching-center-guide-to-equipment", // You can replace with the actual link
        description: "Make a home studio on a budget",
      },
      {
        title: "Udemy Trust & Safety",
        link: "https://www.udemy.com/instructor/resources/udemy-trust-safety", // You can replace with the actual link
        description: "Our policies for instructors and students",
      },
      {
        title: "Join the community",
        link: "https://www.udemy.com/instructor/resources/join-the-community", // You can replace with the actual link
        description: "A place to talk with other instructors",
      },
    ],
  };

  return (
    <div className="setup-test-video">
      <div className="title">Setup & test video</div>
    </div>
  );
};

export default SetupTestVideo;
