import { Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import apiService from "../../../Services/apiService";
import {
  addNewContent,
  changeStatusContent,
} from "../../../Services/contentsService";
import CustomSort from "./CustomSort";
import Content from "./Content";
import { AMOUNT_TO_DISPLAY } from "../../../Constants";

const BestContents = () => {
  const [bestContent, setBestContent] = useState([]);

  useEffect(() => {
    loadBestContent();
  }, []);

  const loadBestContent = async () => {
    const response = await apiService.get("/publisher/bestContents");
    setBestContent(response.data.sort(CustomSort));
  };

  const changeContentStatus = async (content) => {
    if (content.status === "ACTIVE") {
      await changeStatusContent(content);
    } else if (content.status === "DELETED") {
      let newContent = {
        ...content,
        amount: AMOUNT_TO_DISPLAY(content.amount),
      };
      await addNewContent(newContent);
    }
    loadBestContent();
  };

  return (
    <Grid container spacing={4}>
      {bestContent.map((content) => (
        <Content
          key={content.url}
          content={content}
          changeContentStatus={changeContentStatus}
          showMetrics
        />
      ))}
    </Grid>
  );
};

export default BestContents;
