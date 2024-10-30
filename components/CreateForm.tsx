"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AiChatSession } from "@/configs/AiModel";
import { useUser } from "@clerk/nextjs";
import { db } from "@/configs";
import { jsonForms } from "@/configs/schema";
import moment from "moment";
import { useRouter } from "next/navigation";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import Image from "next/image";

const PLACEHOLDERS = [
  "Create a waitlist form",
  "Design a customer feedback survey",
  "Build a job application form",
  "Make an event registration form",
  "Develop a product order form",
];

const PROMPT = `
  Based on the following user input, please generate a form in JSON format. The JSON object should include:
  
  - formTitle: A title for the form.
  - formSubheading: A subheading for the form.
  - formFields: An array of field objects, each containing:
    - fieldName: The unique name/identifier of the field.
    - placeholder: Placeholder text for the field (if applicable).
    - formLabel: The label displayed next to the field.
    - fieldType: The type of the field (e.g., text, email, select, checkbox, radio).
    - required: A boolean indicating whether the field is required.
  
  If the fieldType is "select", "radio", or "checkbox", include an "options" property with:
    - label: The label shown for each option.
    - value: The value associated with each option.

  Example options:
  options: [
      { label: "Excellent", value: "5" },
      { label: "Good", value: "4" },
      { label: "Average", value: "3" },
      { label: "Poor", value: "2" },
      { label: "Very Poor", value: "1" },
    ],

  Ensure that the output is structured in valid JSON format.
`;

// Predefined forms moved outside component
const FIXED_FORMS = {
  feedback: {
    formTitle: "Customer Feedback Form",
    formSubheading:
      "We value your feedback. Please help us improve our services.",
    formFields: [
      {
        fieldName: "name",
        placeholder: "Enter your name",
        formLabel: "Name",
        fieldType: "text",
        required: true,
      },
      {
        fieldName: "email",
        placeholder: "Enter your email",
        formLabel: "Email",
        fieldType: "email",
        required: true,
      },
      {
        fieldName: "rating",
        formLabel: "How would you rate our service?",
        fieldType: "radio",
        required: true,
        options: [
          { label: "Excellent", value: "5" },
          { label: "Good", value: "4" },
          { label: "Average", value: "3" },
          { label: "Poor", value: "2" },
          { label: "Very Poor", value: "1" },
        ],
      },
      {
        fieldName: "feedback",
        placeholder: "Please provide your feedback here",
        formLabel: "Your Feedback",
        fieldType: "textarea",
        required: true,
      },
    ],
  },
  contact: {
    formTitle: "Contact Us",
    formSubheading: "Get in touch with us. We'd love to hear from you!",
    formFields: [
      {
        fieldName: "name",
        placeholder: "Enter your full name",
        formLabel: "Full Name",
        fieldType: "text",
        required: true,
      },
      {
        fieldName: "email",
        placeholder: "Enter your email address",
        formLabel: "Email Address",
        fieldType: "email",
        required: true,
      },
      {
        fieldName: "phone",
        placeholder: "Enter your phone number",
        formLabel: "Phone Number",
        fieldType: "tel",
        required: false,
      },
      {
        fieldName: "subject",
        placeholder: "Enter the subject of your message",
        formLabel: "Subject",
        fieldType: "text",
        required: true,
      },
      {
        fieldName: "message",
        placeholder: "Type your message here",
        formLabel: "Message",
        fieldType: "textarea",
        required: true,
      },
    ],
  },
  waitlist: {
    formTitle: "Join Our Waitlist",
    formSubheading: "Be the first to know when we launch!",
    formFields: [
      {
        fieldName: "name",
        placeholder: "Enter your full name",
        formLabel: "Full Name",
        fieldType: "text",
        required: true,
      },
      {
        fieldName: "email",
        placeholder: "Enter your email address",
        formLabel: "Email Address",
        fieldType: "email",
        required: true,
      },
      {
        fieldName: "interest",
        formLabel: "What are you most interested in?",
        fieldType: "select",
        required: true,
        options: [
          { label: "Early access to the product", value: "early_access" },
          { label: "Beta testing", value: "beta_testing" },
          { label: "Product updates", value: "updates" },
          { label: "Pricing information", value: "pricing" },
        ],
      },
      {
        fieldName: "referral",
        placeholder: "How did you hear about us?",
        formLabel: "Referral Source",
        fieldType: "text",
        required: false,
      },
    ],
  },
};

const CreateForm = () => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  const createFormInDB = useCallback(
    async (jsonData: string) => {
      const resp = await db
        .insert(jsonForms)
        .values({
          jsonform: jsonData,
          createdBy: user?.primaryEmailAddress?.emailAddress || "Unknown User",
          createdAt: moment().format("DD/MM/YYYY"),
        })
        .returning({ id: jsonForms.id });

      if (resp[0].id) {
        router.push("/edit-form/" + resp[0].id);
      }
    },
    [user, router]
  );
  const [lastRequestTime, setLastRequestTime] = useState(0);
  
  // const onCreateForm = useCallback(async () => {
  //   if (!isLoaded || !isSignedIn) {
  //     setError("User is not signed in");
  //     return;
  //   }

  //   setLoading(true);

    // try {
    //   const result = await AiChatSession("Description" + userInput + PROMPT);
    //   const aiResponse = await result.response.text();
    //   if (aiResponse) {
    //     await createFormInDB(aiResponse);
    //   }
    // } catch (error) {
    //   console.error("Error during AI session:", error);
    //   setError("Error creating form");
    // } finally {
    //   setLoading(false);
    // }
  // }, [isLoaded, isSignedIn, userInput, createFormInDB]);

  const onCreateForm = useCallback(async () => {
    const currentTime = Date.now();
    // Check if 10 seconds have passed since the last request
    if (currentTime - lastRequestTime < 10000) {
      setError("Please wait 10 seconds before making another request.");
      return;
    }
  
    setLoading(true);
    setLastRequestTime(currentTime);
    try {
      const result = await AiChatSession("Description" + userInput + PROMPT);
      const aiResponse = await result.response.text();
      if (aiResponse) {
        await createFormInDB(aiResponse);
      }
    } catch (error) {
      console.error("Error during AI session:", error);
      setError("Error creating form");
    } finally {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, userInput, createFormInDB, lastRequestTime]);
  
  // const createFixedForm = useCallback(
  //   async (formData: unknown) => {
  //     if (!isLoaded || !isSignedIn) {
  //       setError("User is not signed in");
  //       return;
  //     }

  //     setLoading(true);
  //     try {
  //       await createFormInDB(JSON.stringify(formData));
  //     } catch (error) {
  //       console.error("Error creating form:", error);
  //       setError("Error creating form");
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [isLoaded, isSignedIn, createFormInDB]
  // );
  const createFixedForm = useCallback(
    async (formData: unknown) => {
      const currentTime = Date.now();
      // Check if 10 seconds have passed since the last request
      if (currentTime - lastRequestTime < 10000) {
        setError("Please wait 10 seconds before making another request.");
        return;
      }
  
        setLoading(true);
        try {
          await createFormInDB(JSON.stringify(formData));
        } catch (error) {
          console.error("Error creating form:", error);
          setError("Error creating form");
        } finally {
          setLoading(false);
        }
      },
      [isLoaded, isSignedIn, createFormInDB, lastRequestTime]
    );
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onCreateForm();
    },
    [onCreateForm]
  );

  if (error) return <div>Error: {error}</div>;
  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Image
          src="/Loadertrans.gif"
          alt="my gif"
          height={150}
          width={150}
          unoptimized
        />
        Loading...
      </div>
    );
  }
  if (!isSignedIn) return <div>Please sign in to create forms.</div>;

  return (
    <div className="space-y-4 max-w-xl">
      <Button
        onClick={onCreateForm}
        disabled={loading || !userInput.trim()}
        className="w-full bg-transparent shadow-none text-xl disabled:text-text text-text"
      >
        {loading ? "Generating..." : "Generate Custom Form"}
      </Button>
      <PlaceholdersAndVanishInput
        placeholders={PLACEHOLDERS}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUserInput(e.target.value)
        }
        onSubmit={handleSubmit}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={() => createFixedForm(FIXED_FORMS.feedback)}
          disabled={loading}
          className="w-full bg-transparent rounded-full border border-secondary text-white hover:bg-secondary"
        >
          Create Feedback Form
        </Button>
        <Button
          onClick={() => createFixedForm(FIXED_FORMS.contact)}
          disabled={loading}
          className="w-full bg-transparent rounded-full border border-secondary text-white hover:bg-secondary"
        >
          Create Contact Form
        </Button>
        <Button
          onClick={() => createFixedForm(FIXED_FORMS.waitlist)}
          disabled={loading}
          className="w-full bg-transparent rounded-full border border-secondary text-white hover:bg-secondary"
        >
          Create Waitlist Form
        </Button>
      </div>
    </div>
  );
};

export default CreateForm;
