import { useEffect, useState } from "react";
import "./scroll.css";

export default function ScrollIndicator({ url }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [scrollPercentage, setScrollPercentage] = useState(0);

  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
      if (jsonData?.products?.length) {
        setData(jsonData.products);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [url]);

  function handleScrollPercentage() {
    const howMuchScrolled =
      document.documentElement.scrollTop || document.body.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    setScrollPercentage((howMuchScrolled / height) * 100);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScrollPercentage);
    return () => window.removeEventListener("scroll", handleScrollPercentage);
  }, []);

  if (errorMessage) return <div>Error: {errorMessage}</div>;
  if (loading) return <div>Loading data... Please wait</div>;

  return (
    <div>
      <div className="top-container">
        <h1>Custom Scroll Indicator</h1>
        <progress
          className="scroll-progress"
          value={scrollPercentage}
          max="100"
        ></progress>
      </div>
      <div className="data-container">
        {data.length > 0 ? (
          data.map((item) => <p key={item.id}>{item.title}</p>)
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
}
