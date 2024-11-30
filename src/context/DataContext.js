import { Spin } from "antd";
import React, { createContext, useEffect, useState } from "react";
import { useApi } from "../api";
import { showMessage } from "../utils";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState(false);
  const [data, setData] = useState([]);
  const { getContent } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentData = await getContent();
        setData(contentData);
      } catch (error) {
        showMessage({
          content: `Failed to fetch data: ${error}`,
          type: "error",
        });
        console.error();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{ loading, setLoading, data, activeId, setActiveId }}
    >
      <Spin fullscreen spinning={loading} />
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
