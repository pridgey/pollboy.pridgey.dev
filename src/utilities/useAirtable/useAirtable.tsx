import React, { createContext, useContext } from "react";
import Airtable from "airtable";

export const AirtableContext = createContext<Airtable.Base | null>(null);

export const useAirtable = (): Airtable.Base | null =>
  useContext(AirtableContext);

export const AirtableProvider: React.FC = ({ children }) => {
  // Create Airtable base for our various requests
  const base = new Airtable({
    apiKey: process.env.REACT_APP_AIRTABLE_KEY || "",
  }).base(process.env.REACT_APP_AIRTABLE_BASE || "");
  // Return the wrappable provider
  return (
    <AirtableContext.Provider value={base}>{children}</AirtableContext.Provider>
  );
};
