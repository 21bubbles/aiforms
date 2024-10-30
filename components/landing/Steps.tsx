// import React from "react";

// export default function Steps() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-bg text-text px-4 md:px-8">
//       {/* Header Section */}
//       <div className="text-center mb-8">
//         <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
//           3 Easy Steps to Create and Share AI-Powered Forms
//         </h1>
//         <p className="text-lg md:text-xl text-text max-w-lg mx-auto">
//           Our AI-driven platform helps you build custom, engaging forms
//           effortlessly—no coding or technical setup required.
//         </p>
//       </div>

//       {/* Steps Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
//         {/* Step 1 */}
//         <div className="bg-primary rounded-lg shadow-lg p-6 text-center hover:shadow-2xl transition-shadow duration-300">
//           <div className="text-text text-4xl mb-4">1</div>
//           <h2 className="text-xl font-semibold mb-2">Set Up Your Form</h2>
//           <p className="text-text">
//             Enter a form name, choose a purpose, and let our AI suggest
//             questions and layouts tailored to your needs.
//           </p>
//         </div>

//         {/* Step 2 */}
//         <div className="bg-primary rounded-lg shadow-lg p-6 text-center hover:shadow-2xl transition-shadow duration-300">
//           <div className="text-text text-4xl mb-4">2</div>
//           <h2 className="text-xl font-semibold mb-2">Customize & Preview</h2>
//           <p className="text-text">
//             Add or edit fields, personalize the design, and preview the form in
//             real-time to ensure it fits your brand.
//           </p>
//         </div>

//         {/* Step 3 */}
//         <div className="bg-primary rounded-lg shadow-lg p-6 text-center hover:shadow-2xl transition-shadow duration-300">
//           <div className="text-text text-4xl mb-4">3</div>
//           <h2 className="text-xl font-semibold mb-2">
//             Share and Collect Responses
//           </h2>
//           <p className="text-text">
//             Publish your form, share it via link, or embed it on your website.
//             Start gathering insights instantly!
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";

export function Steps() {
  const data = [
    {
      title: "Generate Your Form",
      content: (
        <div>
          <p className="text-text font-normal mb-8">
            Describe your form’s purpose with a prompt, and our AI instantly
            builds a custom form for you.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/create-form.png"
              alt="my gif"
              width="1130"
              height="1240"
              unoptimized
              className="border border-secondary rounded-md"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Customize and Share",
      content: (
        <div>
          <p className="text-text font-normal mb-8">
            Edit questions, add branding, and preview. Then, share via link or
            embed it on your website to start collecting responses.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/edit-form.png"
              alt="my gif"
              width="1130"
              height="1240"
              unoptimized
              className="border border-secondary rounded-md"
            />
          </div>
        </div>
      ),
    },
    {
      title: "View Responses and Insights",
      content: (
        <div>
          <p className="text-text font-normal mb-4">
            Track responses in real-time on your dashboard, with AI-powered
            summaries to highlight key trends and insights.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/submissions.png"
              alt="my gif"
              width="1130"
              height="1240"
              unoptimized
              className="border border-secondary rounded-md"
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="bg-[#1f1f1d] mt-10 mx-auto">
      <Timeline data={data} />
    </div>
  );
}
