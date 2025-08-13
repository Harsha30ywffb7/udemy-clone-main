import React from "react";
import "./FilmEdit.css";

const FilmEdit = () => {
  const FilmAndEdit = {
    tips: [
      // From first page
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

      // From second page
      {
        title: "Take breaks and review frequently.",
        description:
          "Check often for any changes such as new noises. Be aware of your own energy levels—filming can tire you out and that translates to the screen.",
      },
      {
        title: "Build rapport.",
        description:
          "Students want to know who’s teaching them. Even for a course that is mostly screencasts, film yourself for your introduction. Or go the extra mile and film yourself introducing each section!",
      },
      {
        title: "Being on camera takes practice.",
        description:
          "Make eye contact with the camera and speak clearly. Do as many retakes as you need to get it right.",
      },
      {
        title: "Set yourself up for editing success.",
        description:
          "You can edit out long pauses, mistakes, and ums or ahs. Film a few extra activities or images that you can add in later to cover those cuts.",
      },
      {
        title: "Create audio marks.",
        description:
          "Clap when you start each take to easily locate the audio spike during editing. Use our guides to manage your recording day efficiently.",
      },
      {
        title: "For screencasts, clean up.",
        description:
          "Move unrelated files and folders off your desktop and open any tabs in advance. Make on-screen text at least 24pt and use zooming to highlight.",
      },
    ],

    requirements: [
      // From first page
      {
        text: "Film and export in HD to create videos of at least 720p, or 1080p if possible",
      },
      {
        text: "Audio should come out of both the left and right channels and be synced to your video",
      },
      {
        text: "Audio should be free of echo and background noise so as not to be distracting to students",
      },

      // From second page
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
      // From first page
      {
        title: "Teaching Center: Guide to equipment",
        link: "#",
        description: "Make a home studio on a budget",
      },
      {
        title: "Udemy Trust & Safety",
        link: "#",
        description: "Our policies for instructors and students",
      },
      {
        title: "Join the community",
        link: "#",
        description: "A place to talk with other instructors",
      },

      // From second page
      {
        title: "Create a test video",
        link: "#",
        description: "Get feedback before filming your whole course",
      },
      {
        title: "Teaching Center: Guide to quality A/V",
        link: "#",
        description: "Film and edit with confidence",
      },
      {
        title: "Udemy trust & safety",
        link: "#",
        description: "Our policies for instructors and students",
      },
    ],
  };

  return (
    <div className="film-edit">
      <div className="title">Film & edit</div>
    </div>
  );
};

export default FilmEdit;
