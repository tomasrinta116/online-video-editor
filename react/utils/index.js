import axios from "axios";
import { server } from "../../config";
import React from "react";
import ReactWaves from "@dschoon/react-waves";

export const handleObjectItemDragStart = (event, id, text = false) => {
  var dragSrcEl = event.target;
  event.dataTransfer.effectAllowed = "move";
  var objectItem = {
    content: id,
    target: "itemType",
    text: text
  };
  event.dataTransfer.setData("text", JSON.stringify(objectItem));
};

export const DateToString = date => {
  let string = `${date.getHours()}:`;
  if (string.length < 3) string = "0" + string;

  string += `00${date.getMinutes()}:`.slice(-3);
  string += `00${date.getSeconds()},`.slice(-3);
  string += `${date.getMilliseconds()}000`.slice(0, 3);
  return string;
};
export const getContent = (item, resource) => {
  const type = resource?.mimeType?.split("/")[0];
  let content = item.support;
  switch (content) {
    case "video":
      const url = type === "video" ? resource.thumbnail : resource.url;
      return (
        <div
          style={{
            backgroundRepeat: "repeat-x",
            backgroundPosition: "left",
            backgroundSize: "auto 100%",
            width: "100%",
            height: "100%",
            backgroundImage: `url(${url})`
          }}
        ></div>
      );
    case "audio":
      return (
        <ReactWaves
          onClick={() => console.log("aasasa")}
          audioFile={resource?.url}
          className={"react-waves audioTimeline"}
          options={{
            barHeight: 1,
            cursorWidth: 0,
            height: 20,
            hideScrollbar: true,
            progressColor: "#b0b5b3",
            responsive: true,
            waveColor: "#b0b5b3",
            width: "100%"
          }}
          volume={1}
          zoom={1}
          children={
            <div className="inner-wave">
              <i className="material-icons text-icon" aria-hidden="true">
              music_note
              </i>{" "}
              <span>{resource?.name}</span>
            </div>
          }
          playing={false}
        />
      );
    case "text":
      return (
        <>
          <i className="material-icons text-icon" aria-hidden="true">
            title_icon
          </i>{" "}
          {item.content}
        </>
      );
    default:
      return false;
  }
};

export const formattedDateFromString = date => {
  let splittedDate = date.split(/:|,/);
  return new Date(
    1970,
    0,
    1,
    Number(splittedDate[0]),
    Number(splittedDate[1]),
    Number(splittedDate[2]),
    Number(splittedDate[3])
  );
};

export const addToLibrary = (e, url, setError, reloadResources, setLoading) => {
  e.stopPropagation();
  const projectId = localStorage.getItem("id");
  const requestUrl = `${server.apiUrl}/project/${projectId}/import`;
  setLoading(true);
  axios
    .post(
      requestUrl,
      JSON.stringify({
        url: url,
        projectID: projectId
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then(data => {
      if (typeof data.err !== "undefined") {
        setLoading(false);
        alert(`${data.err}\n\n${data.msg}`);
      }
      setLoading(false);
      reloadResources();
    })
    .catch(error => {
      setError(error.message);
      setLoading(false);
    });
};
export const getResources = setError => {
  const project = localStorage.getItem("id");
  const url = `${server.apiUrl}/project/${project}`;
  const params = {
    method: "GET"
  };
  return fetch(url, params)
    .then(response => response.json())
    .then(data => {
      if (typeof data.err === "undefined") {
        return data?.resources;
      } else {
        alert(`${data.err}\n\n${data.msg}`);
      }
    })
    .catch(error => {
      setError(error.message);
    });
};
